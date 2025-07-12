import { z } from "zod";
import { server } from "../index.js";
import { googleWebSearch } from "../services/googleSearch.js";
import { runMysqlQuery } from "../services/mysqlQuery.js";
import { visitPageAndConvertToMarkdown } from "../services/visitPage.js";
import { fetchGithubFile } from "../services/githubFile.js";
import { listGeminiModels, geminiGenerateContent } from "../services/gemini.js";
import { visitPageAndGetHtml } from "../services/visitPage.js";
import { pdfToMarkdown } from "../services/gemini.js";
import {
  listTodos,
  addTodo,
  completeTodo,
  deleteTodo,
  exportTodos,
  importTodos,
} from "../services/todo.js";
import { geminiChatWithHistory } from "../services/gemini.js";
import {
  setGeminiSystemPrompt,
  getGeminiSystemPrompt,
} from "../services/gemini.js";
import { searchTasks, searchProjects } from "../services/search.js";
import { collectTextFilesToMarkdown } from "../services/fileCollector.js";
import { getSystemInfo } from "../services/systemInfo.js";
import {
  startProcess,
  listProcesses,
  getProcessStatus,
  getProcessOutput,
  killProcess,
  stopProcess,
  sendProcessInput,
} from "../services/processManager.js";
// Figma ile ilgili importlar kaldırıldı

// Basit bir değişkende sunucu genelinde varsayılan model tutulsun
declare let geminiDefaultModel: string;
if (typeof (globalThis as any)["geminiDefaultModel"] === "undefined") {
  (globalThis as any)["geminiDefaultModel"] = "gemini-2.0-flash-001";
}

geminiDefaultModel = (globalThis as any)["geminiDefaultModel"];

function registerGeminiConfigTools() {
  server.tool(
    "gemini_set_system_prompt",
    "Belirli bir kullanıcı için Gemini sistem promptunu ayarlar.",
    {
      userId: z.string().describe("Kullanıcı kimliği"),
      prompt: z.string().describe("Sistem promptu"),
    },
    async ({ userId, prompt }) => {
      await setGeminiSystemPrompt(userId, prompt);
      return {
        content: [{ type: "text", text: "Sistem promptu ayarlandı." }],
      };
    }
  );

  server.tool(
    "gemini_get_system_prompt",
    "Belirli bir kullanıcının Gemini sistem promptunu döner.",
    {
      userId: z.string().describe("Kullanıcı kimliği"),
    },
    async ({ userId }) => {
      const prompt = await getGeminiSystemPrompt(userId);
      return {
        content: [
          { type: "text", text: prompt ?? "Tanımlı sistem promptu yok." },
        ],
      };
    }
  );

  server.tool(
    "gemini_set_default_model",
    "Sunucu genelinde Gemini için varsayılan modeli ayarlar.",
    {
      model: z.string().describe("Model adı (ör: gemini-2.0-flash-001)"),
    },
    async ({ model }) => {
      (globalThis as any)["geminiDefaultModel"] = model;
      geminiDefaultModel = model;
      return {
        content: [
          {
            type: "text",
            text: `Varsayılan model '${model}' olarak ayarlandı.`,
          },
        ],
      };
    }
  );

  server.tool(
    "gemini_get_default_model",
    "Sunucu genelinde Gemini için varsayılan modeli döner.",
    {},
    async () => {
      return {
        content: [
          { type: "text", text: (globalThis as any)["geminiDefaultModel"] },
        ],
      };
    }
  );
}

// Google Web Search Tool
function registerGoogleWebSearchTool() {
  server.tool(
    "web_search",
    "Verilen sorgu ile Google'da arama yapar ve ilk 20 sonucu döner.",
    {
      query: z.string().describe("Aranacak kelime veya cümle."),
    },
    async ({ query }) => {
      try {
        const result = await googleWebSearch({ query });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Arama hatası: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );
}

// Yardımcı fonksiyon: undefined olan property'leri objeden çıkarır
function clean<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  ) as Partial<T>;
}

// MySQL Query Tool
function registerMysqlQueryTool() {
  server.tool(
    "mysql_query",
    "Verilen SQL sorgusunu ve bağlantı bilgilerini kullanarak MySQL veritabanında sorgu çalıştırır ve sonucu tablo olarak döner.",
    {
      sql: z.string().describe("Çalıştırılacak SQL sorgusu."),
      host: z.string().describe("MySQL sunucu adresi (ör: localhost)"),
      port: z.number().optional().describe("MySQL portu (varsayılan: 3306)"),
      user: z.string().describe("MySQL kullanıcı adı"),
      password: z.string().describe("MySQL şifresi"),
      database: z.string().describe("Veritabanı adı"),
    },
    async ({ sql, host, port, user, password, database }) => {
      try {
        const params = clean({ sql, host, port, user, password, database });
        const result = await runMysqlQuery(params as any);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `MySQL sorgu hatası: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );
}

// Visit Page Tool
function registerVisitPageTool() {
  server.tool(
    "visit_page",
    "Verilen bir web sayfasını ziyaret eder ve içeriğini markdown formatında döner.",
    {
      url: z.string().url().describe("Ziyaret edilecek web sayfası URL'si."),
    },
    async ({ url }) => {
      try {
        const markdown = await visitPageAndConvertToMarkdown(url);
        return {
          content: [
            {
              type: "text",
              text: markdown,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Sayfa ziyaret hatası: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );
}

// Github File Tool
function registerGithubFileTool() {
  server.tool(
    "github_file",
    "Verilen bir GitHub reposundan (owner, repo, path, branch) dosya içeriğini çeker.",
    {
      owner: z.string().describe("GitHub kullanıcı veya organizasyon adı"),
      repo: z.string().describe("GitHub repository adı"),
      path: z
        .string()
        .describe("Repository içindeki dosya yolu (ör: src/index.ts)"),
      branch: z.string().optional().describe("Branch adı (varsayılan: main)"),
    },
    async ({ owner, repo, path, branch }) => {
      try {
        const params = clean({ owner, repo, path, branch });
        const content = await fetchGithubFile(params as any);
        return {
          content: [
            {
              type: "text",
              text: content,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `GitHub dosya hatası: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );
}

function registerGeminiListModelsTool() {
  server.tool(
    "gemini_list_models",
    "Gemini API ile kullanılabilir modelleri listeler.",
    {},
    async () => {
      try {
        const models = await listGeminiModels();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(models, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Model listeleme hatası: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );
}

function getRegisteredTool(name: string) {
  // MCP tool'larını dinamik olarak bulmak için yardımcı (server as any)._tools içinden
  const tools = (server as any)._tools as any[];
  return tools?.find?.((t: any) => t.name === name);
}

function isToolCallResponse(text: string) {
  // Yanıt JSON ve içinde 'tool' anahtarı varsa tool çağrısıdır
  try {
    const obj = JSON.parse(text);
    return obj && typeof obj === "object" && typeof obj.tool === "string";
  } catch {
    return false;
  }
}

function parseToolCall(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function registerGeminiChatTool() {
  server.tool(
    "gemini_chat",
    "Gemini API ile fikir alışverişi, içerik üretimi veya özetleme yapar. Eğer yanıtı bir MCP tool çağrısı önerirse, ilgili tool otomatik olarak çağrılır. userId verilirse sohbet geçmişi tutulur.",
    {
      model: z
        .string()
        .optional()
        .describe("Kullanılacak model adı (varsayılan: gemini-2.0-flash-001)"),
      contents: z
        .union([z.string(), z.array(z.string())])
        .describe("Model ile paylaşılacak içerik veya mesaj(lar)."),
      userId: z
        .string()
        .optional()
        .describe("Kullanıcıya özel sohbet geçmişi için kimlik"),
    },
    async ({ model = "gemini-2.0-flash-001", contents, userId }) => {
      try {
        if (userId && typeof contents === "string") {
          const resultRaw = await geminiChatWithHistory({
            model,
            userId,
            message: contents,
          });
          const result = String(resultRaw);
          if (isToolCallResponse(result)) {
            const call = parseToolCall(result);
            const tool = getRegisteredTool(call.tool);
            if (tool) {
              const toolResult = await tool.handler(call.args || {});
              return toolResult;
            } else {
              return {
                content: [
                  {
                    type: "text",
                    text: `Bilinmeyen tool: ${call.tool}`,
                  },
                ],
              };
            }
          }
          return {
            content: [
              {
                type: "text",
                text: result || "",
              },
            ],
          };
        }
        // Eski davranış (geçmişsiz)
        const resultRaw = await geminiGenerateContent({ model, contents });
        const result = String(resultRaw);
        if (isToolCallResponse(result)) {
          const call = parseToolCall(result);
          const tool = getRegisteredTool(call.tool);
          if (tool) {
            const toolResult = await tool.handler(call.args || {});
            return toolResult;
          } else {
            return {
              content: [
                {
                  type: "text",
                  text: `Bilinmeyen tool: ${call.tool}`,
                },
              ],
            };
          }
        }
        return {
          content: [
            {
              type: "text",
              text: result || "",
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Gemini içerik üretim hatası: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );
}

function registerPdfToMarkdownTool() {
  server.tool(
    "pdf_to_markdown",
    "Verilen bir PDF dosyasını (URL) indirir ve içeriğini Markdown formatında döner.",
    {
      url: z.string().url().describe("PDF dosyasının URL'si"),
    },
    async ({ url }) => {
      try {
        const markdown = await pdfToMarkdown({ url });
        return {
          content: [
            {
              type: "text",
              text: markdown,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `PDF'den Markdown'a çevirme hatası: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );
}

function registerSearchTools() {
  server.tool(
    "search_tasks",
    "Görevlerde başlık, açıklama, proje, durum, atanan, etiket bazlı arama ve filtreleme yapar.",
    {
      query: z.string().optional().describe("Aranacak kelime"),
      projectId: z.string().optional().describe("Proje id'si"),
      status: z.string().optional().describe("Durum (todo, in_progress, done)"),
      assignee: z.string().optional().describe("Atanan kullanıcı"),
      labelId: z.string().optional().describe("Etiket id'si"),
    },
    async (args) => {
      const params = clean(args);
      const results = await searchTasks(params as any);
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.tool(
    "search_projects",
    "Projelerde isim ve açıklama bazlı arama yapar.",
    {
      query: z.string().optional().describe("Aranacak kelime"),
    },
    async (args) => {
      const params = clean(args);
      const results = await searchProjects(params as any);
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      };
    }
  );
}

function registerFileCollectorTool() {
  server.tool(
    "collect_text_files_to_markdown",
    "Belirtilen klasördeki tüm metin dosyalarını toplar ve tek bir markdown dosyasında birleştirir.",
    {
      folderPath: z.string().describe("Taranacak klasör yolu"),
      outputPath: z.string().describe("Çıktı markdown dosyasının yolu"),
      includeExtensions: z
        .array(z.string())
        .optional()
        .describe(
          "Dahil edilecek dosya uzantıları (varsayılan: .txt, .md, .js, .ts, .json, .html, .css, .py, .java, .cpp, .c, .php, .rb, .go, .rs, .swift, .kt, .scala, .sql, .xml, .yaml, .yml, .ini, .cfg, .conf, .log)"
        ),
      excludePatterns: z
        .array(z.string())
        .optional()
        .describe(
          "Hariç tutulacak dosya/klasör desenleri (varsayılan: node_modules, .git, dist, build, .next, .cache)"
        ),
    },
    async ({ folderPath, outputPath, includeExtensions, excludePatterns }) => {
      try {
        const result = await collectTextFilesToMarkdown(
          folderPath,
          outputPath,
          includeExtensions,
          excludePatterns
        );

        return {
          content: [
            {
              type: "text",
              text:
                `✅ Başarıyla tamamlandı!\n\n` +
                `📁 **Klasör:** ${folderPath}\n` +
                `📄 **Toplam Dosya:** ${result.totalFiles}\n` +
                `💾 **Toplam Boyut:** ${(result.totalSize / 1024).toFixed(
                  2
                )} KB\n` +
                `📝 **Çıktı Dosyası:** ${result.outputPath}\n\n` +
                `📋 **Dosya Listesi:**\n` +
                result.fileList
                  .map(
                    (file: any) =>
                      `- ${file.path} (${(file.size / 1024).toFixed(2)} KB)`
                  )
                  .join("\n"),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Hata: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );
}

function registerSystemInfoTool() {
  server.tool(
    "system_info",
    "Returns a report of the current system environment (OS, CPU, memory, Node/Bun/TypeScript versions, and key environment variables).",
    {},
    async () => {
      try {
        const info = await getSystemInfo();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(info, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `system_info tool error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );
}

function registerProcessManagementTools() {
  server.tool(
    "process_start",
    "Starts a process in a directory. Can run in background (async) or foreground (waits for result). Optionally send input to stdin.",
    {
      command: z.string().describe("Command to run"),
      args: z.array(z.string()).optional().describe("Arguments"),
      cwd: z.string().optional().describe("Working directory"),
      background: z.boolean().optional().describe("Run in background (async)?"),
      input: z.string().optional().describe("Input to send to stdin"),
    },
    async ({ command, args, cwd, background, input }) => {
      const params = clean({ command, args, cwd, background, input });
      const result = startProcess(params as any);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
  );
  server.tool("process_list", "Lists all managed processes.", {}, async () => {
    const result = listProcesses();
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  });
  server.tool(
    "process_status",
    "Gets the status of a managed process.",
    { id: z.string().describe("Process id") },
    async ({ id }) => {
      const result = getProcessStatus(id);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
  );
  server.tool(
    "process_output",
    "Gets the output (stdout/stderr) of a managed process. Output is returned as a string.",
    { id: z.string().describe("Process id") },
    async ({ id }) => {
      const result = getProcessOutput(id);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
  );
  server.tool(
    "process_kill",
    "Kills a managed process.",
    { id: z.string().describe("Process id") },
    async ({ id }) => {
      killProcess(id);
      return { content: [{ type: "text", text: `Process ${id} killed.` }] };
    }
  );
  server.tool(
    "process_stop",
    "Stops (SIGSTOP) a managed process.",
    { id: z.string().describe("Process id") },
    async ({ id }) => {
      stopProcess(id);
      return { content: [{ type: "text", text: `Process ${id} stopped.` }] };
    }
  );
  server.tool(
    "process_input",
    "Sends input to a managed process's stdin.",
    {
      id: z.string().describe("Process id"),
      input: z.string().describe("Input text"),
    },
    async ({ id, input }) => {
      sendProcessInput(id, input);
      return {
        content: [{ type: "text", text: `Input sent to process ${id}.` }],
      };
    }
  );
}

// Figma ile ilgili tool fonksiyonları ve registerFigmaTools kaldırıldı

// Register all tools
export function registerTools() {
  registerGoogleWebSearchTool();
  registerMysqlQueryTool();
  registerVisitPageTool();
  registerGithubFileTool();
  registerGeminiListModelsTool();
  registerGeminiChatTool();
  registerPdfToMarkdownTool();
  registerSearchTools();
  registerFileCollectorTool();
  registerSystemInfoTool();
  registerProcessManagementTools();
}
