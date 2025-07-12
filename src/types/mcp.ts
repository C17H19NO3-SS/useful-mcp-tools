// JSON-RPC temel tipleri
export interface JsonRpcRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: any;
}

export interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

// Initialize
export interface InitializeParams {
  protocolVersion: string;
  capabilities: any;
  clientInfo: {
    name: string;
    title?: string;
    version?: string;
  };
}
export interface InitializeResult {
  protocolVersion: string;
  capabilities: any;
  serverInfo: {
    name: string;
    title?: string;
    version?: string;
  };
  instructions?: string;
}

// Tool discovery
export interface ToolDefinition {
  name: string;
  description: string;
  parameters: object;
  output_schema?: object;
}

// Progress notification
export interface ProgressNotification {
  jsonrpc: "2.0";
  method: "notifications/progress";
  params: {
    progressToken: string | number;
    progress: number;
    total?: number;
    message?: string;
  };
}

// Cancellation notification
export interface CancelNotification {
  jsonrpc: "2.0";
  method: "notifications/cancelled";
  params: {
    requestId: string | number;
    reason?: string;
  };
}
