import type { WebSearchInput, WebSearchOutput } from "../types/tool";
import { getGoogleApiKey, getGoogleCx } from "../utils/env";

export async function googleWebSearch({
  query,
}: WebSearchInput): Promise<WebSearchOutput> {
  const API_KEY = getGoogleApiKey();
  const CX = getGoogleCx();
  if (!API_KEY || !CX || API_KEY === "YOUR_API_KEY" || CX === "YOUR_CX") {
    throw new Error(
      "Google API anahtarı ve arama motoru kimliği (CX) gereklidir."
    );
  }
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
    query
  )}&key=${API_KEY}&cx=${CX}&num=20`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google arama hatası: ${response.statusText}`);
  }
  const data: any = await response.json();
  const results = (data.items || []).map((item: any) => ({
    title: item.title,
    url: item.link,
    snippet: item.snippet,
  }));
  return { results };
}
