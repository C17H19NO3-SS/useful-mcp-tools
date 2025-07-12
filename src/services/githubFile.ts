export async function fetchGithubFile({
  owner,
  repo,
  path,
  branch = "main",
}: {
  owner: string;
  repo: string;
  path: string;
  branch?: string;
}): Promise<string> {
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `GitHub dosyası alınamadı: ${response.status} ${response.statusText}`
    );
  }
  return await response.text();
}
