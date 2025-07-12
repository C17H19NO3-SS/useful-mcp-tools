import os from "os";
import process from "process";

export interface SystemInfo {
  platform: string;
  arch: string;
  cpu: string;
  cpuCount: number;
  totalMemory: string;
  freeMemory: string;
  uptime: string;
  uptimeReadable: string;
  loadAverage: string;
  hostname: string;
  networkInterfaces: Record<string, any>;
  processId: number;
  currentDirectory: string;
  userInfo: Record<string, any>;
  tempDir: string;
  homeDir: string;
  shell: string | undefined;
  nodeVersion: string;
  bunVersion: string | undefined;
  typescriptVersion: string | undefined;
  env: Record<string, string | undefined>;
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}

export async function getSystemInfo(): Promise<SystemInfo> {
  const cpus = os.cpus();
  let bunVersion: string | undefined = undefined;
  let typescriptVersion: string | undefined = undefined;
  try {
    bunVersion = (globalThis as any).Bun?.version;
  } catch {}
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    typescriptVersion = require("typescript/package.json").version;
  } catch {}
  return {
    platform: os.platform(),
    arch: os.arch(),
    cpu: cpus[0]?.model || "unknown",
    cpuCount: cpus.length,
    totalMemory: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + " GB",
    freeMemory: (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + " GB",
    uptime: (os.uptime() / 60 / 60).toFixed(2) + " hours",
    uptimeReadable: formatUptime(os.uptime()),
    loadAverage: os
      .loadavg()
      .map((n) => n.toFixed(2))
      .join(", "),
    hostname: os.hostname(),
    networkInterfaces: os.networkInterfaces(),
    processId: process.pid,
    currentDirectory: process.cwd(),
    userInfo: os.userInfo(),
    tempDir: os.tmpdir(),
    homeDir: os.homedir(),
    shell: process.env.SHELL || process.env.ComSpec,
    nodeVersion: process.version,
    bunVersion,
    typescriptVersion,
    env: process.env,
  };
}
