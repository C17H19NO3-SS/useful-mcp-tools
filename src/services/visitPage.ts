import TurndownService from "turndown";

export async function visitPageAndConvertToMarkdown(
  url: string
): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Sayfa alınamadı: ${response.status} ${response.statusText}`
    );
  }
  const html = await response.text();
  const turndownService = new TurndownService();
  const markdown = turndownService.turndown(html);
  return markdown;
}

export async function visitPageAndGetHtml(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Sayfa alınamadı: ${response.status} ${response.statusText}`
    );
  }
  return await response.text();
}
