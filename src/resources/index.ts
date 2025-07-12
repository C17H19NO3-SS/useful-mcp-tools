import { z } from "zod";
import { server } from "../index.js";

// Memory schema
const MemorySchema = z.object({
  data: z.record(z.any(), z.any()).default({}),
  lastUpdated: z.string().default(() => new Date().toISOString()),
});

type Memory = z.infer<typeof MemorySchema>;

// Memory file path
const MEMORY_FILE = "data/memory.json";

// Helper functions
async function readMemory(): Promise<Memory> {
  try {
    const file = Bun.file(MEMORY_FILE);
    if (await file.exists()) {
      const content = await file.text();
      return MemorySchema.parse(JSON.parse(content));
    }
  } catch (error) {
    console.error("Error reading memory:", error);
  }
  return MemorySchema.parse({});
}

async function writeMemory(memory: Memory): Promise<void> {
  try {
    // Ensure data directory exists
    await Bun.write(MEMORY_FILE, JSON.stringify(memory, null, 2));
  } catch (error) {
    console.error("Error writing memory:", error);
    throw error;
  }
}

// Register memory resource
function registerMemoryResource() {
  server.resource(
    "memory",
    "memory://data",
    {
      mimeType: "application/json",
      description: "Persistent memory storage for the MCP server",
    },
    async () => {
      try {
        const memory = await readMemory();
        return {
          contents: [
            {
              uri: "memory://data",
              mimeType: "application/json",
              text: JSON.stringify(memory, null, 2),
            },
          ],
        };
      } catch (error) {
        throw new Error(
          `Failed to read memory: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }
  );
}

// Register all resources
export function registerResources() {
  registerMemoryResource();
}
