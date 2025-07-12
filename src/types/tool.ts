// Tool input ve output şemaları
export interface WebSearchInput {
  query: string;
}

export interface WebSearchResult {
  title: string;
  url: string;
  snippet?: string;
}

export interface WebSearchOutput {
  results: WebSearchResult[];
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: object;
  outputSchema?: object;
}

export interface MysqlQueryInput {
  sql: string;
  host: string;
  port?: number;
  user: string;
  password: string;
  database: string;
}

export interface MysqlQueryOutput {
  columns: string[];
  rows: any[][];
}

export interface VisitPageInput {
  url: string;
}

export interface VisitPageOutput {
  markdown: string;
}

export interface GithubFileInput {
  owner: string;
  repo: string;
  path: string;
  branch?: string;
}

export interface GithubFileOutput {
  content: string;
}

export interface SystemInfoOutput {
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

export interface ProcessStartInput {
  command: string;
  args?: string[];
  cwd?: string;
  background?: boolean;
  input?: string;
}

export interface ProcessStartOutput {
  id: string;
  status: string;
  cwd: string;
  originalCwd: string;
}

export interface ProcessListOutput {
  id: string;
  command: string;
  args: string[];
  cwd: string;
  originalCwd: string;
  background: boolean;
  status: string;
  exitCode?: number | null;
}
[];

export interface ProcessStatusOutput {
  id: string;
  command: string;
  args: string[];
  cwd: string;
  originalCwd: string;
  background: boolean;
  status: string;
  exitCode?: number | null;
}

export interface ProcessOutput {
  output: string;
  error: string;
}
