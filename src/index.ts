#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Import registration functions
import { registerTools } from "./tools/index.js";
import { registerResources } from "./resources/index.js";

// Create MCP server instance
export const server = new McpServer({
  name: "mcp-web-tools",
  version: "1.0.0",
  capabilities: {
    tools: {},
    resources: {},
    prompts: {},
  },
});

// Register all capabilities
registerTools();
registerResources();

// Main function to start the server
async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MCP Server started and connected via stdio");
  } catch (error) {
    console.error("Failed to start MCP server:", error);
    process.exit(1);
  }
}

// Start the server
main();
