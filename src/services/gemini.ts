import { GoogleGenAI } from "@google/genai";
import { getGeminiApiKey } from "../utils/env";
import fetch from "node-fetch";
// @ts-ignore
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { promises as fs } from "fs";
import path from "path";

const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });

export async function listGeminiModels() {
  const models = await ai.models.list();
  return models;
}

export async function geminiGenerateContent({
  model,
  contents,
}: {
  model: string;
  contents: string | string[];
}) {
  const response = await ai.models.generateContent({ model, contents });
  return response.text;
}

export async function pdfToMarkdown({ url }: { url: string }) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`PDF indirilemedi: ${response.statusText}`);
  const buffer = await response.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;
  let markdown = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(" ");
    markdown += `\n\n---\n\nSayfa ${i}:\n\n${pageText}`;
  }
  return markdown;
}

export type GeminiMessage = { role: string; content: string };

function getHistoryPath(userId: string) {
  return path.resolve(`data/gemini_history_${userId}.json`);
}

export async function readGeminiHistory(
  userId: string
): Promise<GeminiMessage[]> {
  try {
    const data = await fs.readFile(getHistoryPath(userId), "utf-8");
    const arr = JSON.parse(data);
    return Array.isArray(arr)
      ? arr.map((m) => ({
          role: m.role as "user" | "assistant" | "system",
          content: String(m.content),
        }))
      : [];
  } catch {
    return [];
  }
}

export async function writeGeminiHistory(
  userId: string,
  history: GeminiMessage[]
) {
  await fs.mkdir(path.dirname(getHistoryPath(userId)), { recursive: true });
  await fs.writeFile(
    getHistoryPath(userId),
    JSON.stringify(history, null, 2),
    "utf-8"
  );
}

export async function geminiChatWithHistory({
  model,
  userId,
  message,
}: {
  model: string;
  userId: string;
  message: string;
}): Promise<string> {
  const history = await readGeminiHistory(userId);
  const systemPrompt = await getGeminiSystemPrompt(userId);
  const messages: GeminiMessage[] = [
    ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
    ...history,
    { role: "user", content: message },
  ];
  // Gemini API'ya geçmişi gönder
  const response = await ai.models.generateContent({
    model: String(model),
    contents: messages.map((m) => m.content),
  });
  const assistantMsg: GeminiMessage = {
    role: "assistant",
    content: String(response.text),
  };
  const newHistory = [
    ...history,
    { role: "user", content: message },
    assistantMsg,
  ];
  await writeGeminiHistory(userId, newHistory);
  return String(response.text);
}

function getSystemPromptPath(userId: string) {
  return path.resolve(`data/gemini_system_prompt_${userId}.txt`);
}

export async function setGeminiSystemPrompt(userId: string, prompt: string) {
  await fs.mkdir(path.dirname(getSystemPromptPath(userId)), {
    recursive: true,
  });
  await fs.writeFile(getSystemPromptPath(userId), prompt, "utf-8");
}

export async function getGeminiSystemPrompt(
  userId: string
): Promise<string | null> {
  try {
    return await fs.readFile(getSystemPromptPath(userId), "utf-8");
  } catch {
    return null;
  }
}
