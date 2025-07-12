import { spawn } from "child_process";
import path from "path";
import os from "os";

interface ManagedProcess {
  id: string;
  command: string;
  args: string[];
  cwd: string;
  originalCwd: string;
  background: boolean;
  process: ReturnType<typeof spawn>;
  output: string[];
  error: string[];
  status: "running" | "exited" | "stopped" | "killed";
  exitCode?: number | null | undefined;
}

const processes: Record<string, ManagedProcess> = {};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

export function listProcesses() {
  return Object.values(processes).map((p) => ({
    id: p.id,
    command: p.command,
    args: p.args,
    cwd: p.cwd,
    originalCwd: p.originalCwd,
    background: p.background,
    status: p.status,
    exitCode: p.exitCode,
  }));
}

export function getProcessStatus(id: string) {
  const p = processes[id];
  if (!p) throw new Error("Process not found");
  return {
    id: p.id,
    command: p.command,
    args: p.args,
    cwd: p.cwd,
    originalCwd: p.originalCwd,
    background: p.background,
    status: p.status,
    exitCode: p.exitCode,
  };
}

export function getProcessOutput(id: string) {
  const p = processes[id];
  if (!p) throw new Error("Process not found");
  return {
    output: p.output.join(""),
    error: p.error.join(""),
  };
}

export function sendProcessInput(id: string, input: string) {
  const p = processes[id];
  if (!p) throw new Error("Process not found");
  if (p.status !== "running") throw new Error("Process is not running");
  p.process.stdin?.write(input);
  // Gönderilen inputu olduğu gibi output log'una ekle
  p.output.push(input);
}

export function killProcess(id: string) {
  const p = processes[id];
  if (!p) throw new Error("Process not found");
  p.process.kill();
  p.status = "killed";
}

export function stopProcess(id: string) {
  const p = processes[id];
  if (!p) throw new Error("Process not found");
  p.process.kill("SIGSTOP");
  p.status = "stopped";
}

export function startProcess({
  command,
  args = [],
  cwd = process.cwd(),
  background = false,
  input,
}: {
  command: string;
  args?: string[];
  cwd?: string;
  background?: boolean;
  input?: string;
}) {
  const id = generateId();
  const originalCwd = process.cwd();
  const isWindows = os.platform() === "win32";
  let spawnCommand = command;
  let spawnArgs = args;
  let useShell = false;

  // Windows'ta .bat/.cmd/.exe veya komutlar için cmd /c ile başlat
  if (isWindows) {
    // Eğer komut .bat/.cmd/.exe ile bitiyorsa veya argüman yoksa da cmd /c ile başlat
    const isBatch = /\.(bat|cmd|exe)$/i.test(command) || args.length === 0;
    if (isBatch) {
      spawnCommand = "cmd";
      spawnArgs = ["/c", command, ...args];
      useShell = false;
    } else {
      useShell = false;
    }
  } else {
    // Linux/macOS: doğrudan çalıştır, shell kullanma
    useShell = false;
  }

  const proc = spawn(spawnCommand, spawnArgs, {
    cwd: path.resolve(cwd),
    shell: useShell,
    detached: background,
    stdio: ["pipe", "pipe", "pipe"],
  });
  const managed: ManagedProcess = {
    id,
    command,
    args,
    cwd: path.resolve(cwd),
    originalCwd,
    background,
    process: proc,
    output: [],
    error: [],
    status: "running",
    exitCode: null,
  };
  proc.stdout.on("data", (data) => managed.output.push(data.toString()));
  proc.stderr.on("data", (data) => managed.error.push(data.toString()));
  proc.on("exit", (code) => {
    managed.status = "exited";
    managed.exitCode = code;
  });
  if (input) {
    proc.stdin.write(input);
    proc.stdin.end();
  }
  processes[id] = managed;
  return {
    id,
    status: managed.status,
    cwd: managed.cwd,
    originalCwd: managed.originalCwd,
  };
}
