import { readdir, readFile, stat } from "fs/promises";
import { join, extname, basename } from "path";

interface FileInfo {
  name: string;
  path: string;
  size: number;
  extension: string;
}

/**
 * Belirtilen klasördeki tüm metin dosyalarını toplar ve tek bir markdown dosyasında birleştirir
 * @param folderPath - Taranacak klasör yolu
 * @param outputPath - Çıktı markdown dosyasının yolu
 * @param includeExtensions - Dahil edilecek dosya uzantıları (varsayılan: .txt, .md, .js, .ts, .json, .html, .css, .py, .java, .cpp, .c, .php, .rb, .go, .rs, .swift, .kt, .scala, .sql, .xml, .yaml, .yml, .ini, .cfg, .conf, .log)
 * @param excludePatterns - Hariç tutulacak dosya/klasör desenleri (varsayılan: node_modules, .git, dist, build, .next, .cache)
 * @returns Toplanan dosya bilgileri ve oluşturulan markdown dosyasının yolu
 */
export async function collectTextFilesToMarkdown(
  folderPath: string,
  outputPath: string,
  includeExtensions: string[] = [
    ".txt",
    ".md",
    ".js",
    ".ts",
    ".jsx",
    ".tsx",
    ".json",
    ".html",
    ".css",
    ".scss",
    ".sass",
    ".py",
    ".java",
    ".cpp",
    ".c",
    ".h",
    ".hpp",
    ".php",
    ".rb",
    ".go",
    ".rs",
    ".swift",
    ".kt",
    ".scala",
    ".sql",
    ".xml",
    ".yaml",
    ".yml",
    ".ini",
    ".cfg",
    ".conf",
    ".log",
    ".sh",
    ".bat",
    ".ps1",
    ".dockerfile",
    ".dockerignore",
    ".gitignore",
    ".env",
    ".env.example",
    ".env.local",
    ".eslintrc",
    ".prettierrc",
    ".babelrc",
    ".webpack.config",
    ".rollup.config",
    ".vite.config",
    ".jest.config",
    ".tsconfig",
    ".package.json",
    ".README",
    ".LICENSE",
    ".CHANGELOG",
  ],
  excludePatterns: string[] = [
    "node_modules",
    ".git",
    "dist",
    "build",
    ".next",
    ".cache",
    ".vscode",
    ".idea",
    "coverage",
    ".nyc_output",
    ".parcel-cache",
    ".turbo",
    ".svelte-kit",
    ".nuxt",
    "target",
    "bin",
    "obj",
    ".vs",
    ".gradle",
    ".mvn",
    "venv",
    "__pycache__",
    ".pytest_cache",
  ]
): Promise<{
  totalFiles: number;
  totalSize: number;
  outputPath: string;
  fileList: FileInfo[];
}> {
  const fileList: FileInfo[] = [];
  let totalSize = 0;

  // Klasörün var olup olmadığını kontrol et
  try {
    const folderStat = await stat(folderPath);
    if (!folderStat.isDirectory()) {
      throw new Error(`${folderPath} bir klasör değil`);
    }
  } catch (error) {
    throw new Error(`Klasör bulunamadı: ${folderPath}`);
  }

  // Dosyaları recursive olarak tara
  async function scanDirectory(
    dirPath: string,
    relativePath: string = ""
  ): Promise<void> {
    const entries = await readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);
      const currentRelativePath = relativePath
        ? join(relativePath, entry.name)
        : entry.name;

      // Hariç tutulacak desenleri kontrol et
      const shouldExclude = excludePatterns.some(
        (pattern) =>
          entry.name.includes(pattern) || currentRelativePath.includes(pattern)
      );

      if (shouldExclude) {
        continue;
      }

      if (entry.isDirectory()) {
        // Alt klasörleri recursive olarak tara
        await scanDirectory(fullPath, currentRelativePath);
      } else if (entry.isFile()) {
        const extension = extname(entry.name).toLowerCase();

        // Dahil edilecek uzantıları kontrol et
        if (includeExtensions.includes(extension)) {
          try {
            const fileStat = await stat(fullPath);
            const fileInfo: FileInfo = {
              name: entry.name,
              path: currentRelativePath,
              size: fileStat.size,
              extension,
            };

            fileList.push(fileInfo);
            totalSize += fileStat.size;
          } catch (error) {
            console.warn(`Dosya okunamadı: ${fullPath}`, error);
          }
        }
      }
    }
  }

  // Klasörü tara
  await scanDirectory(folderPath);

  if (fileList.length === 0) {
    throw new Error(
      `Belirtilen klasörde uygun metin dosyası bulunamadı: ${folderPath}`
    );
  }

  // Dosyaları boyuta göre sırala (büyükten küçüğe)
  fileList.sort((a, b) => b.size - a.size);

  // Markdown dosyasını oluştur
  let markdownContent = `# Klasör İçeriği Özeti\n\n`;
  markdownContent += `**Klasör:** \`${folderPath}\`\n\n`;
  markdownContent += `**Toplam Dosya Sayısı:** ${fileList.length}\n\n`;
  markdownContent += `**Toplam Boyut:** ${formatFileSize(totalSize)}\n\n`;
  markdownContent += `**Oluşturulma Tarihi:** ${new Date().toLocaleString(
    "tr-TR"
  )}\n\n`;

  markdownContent += `## Dosya Listesi\n\n`;
  markdownContent += `| Dosya Adı | Boyut | Uzantı |\n`;
  markdownContent += `|-----------|-------|--------|\n`;

  for (const file of fileList) {
    markdownContent += `| \`${file.path}\` | ${formatFileSize(file.size)} | ${
      file.extension
    } |\n`;
  }

  markdownContent += `\n---\n\n`;
  markdownContent += `## Dosya İçerikleri\n\n`;

  // Her dosyanın içeriğini ekle
  for (const file of fileList) {
    try {
      const fullPath = join(folderPath, file.path);
      const content = await readFile(fullPath, "utf-8");

      markdownContent += `### ${file.path}\n\n`;
      markdownContent += `**Boyut:** ${formatFileSize(file.size)}\n\n`;
      markdownContent += `**Uzantı:** ${file.extension}\n\n`;

      // Dosya içeriğini kod bloğu olarak ekle
      const language = getLanguageFromExtension(file.extension);
      markdownContent += `\`\`\`${language}\n`;
      markdownContent += content;
      markdownContent += `\n\`\`\`\n\n`;
      markdownContent += `---\n\n`;
    } catch (error) {
      markdownContent += `### ${file.path}\n\n`;
      markdownContent += `**Hata:** Dosya okunamadı - ${error}\n\n`;
      markdownContent += `---\n\n`;
    }
  }

  // Markdown dosyasını kaydet
  await Bun.write(outputPath, markdownContent);

  return {
    totalFiles: fileList.length,
    totalSize,
    outputPath,
    fileList,
  };
}

/**
 * Dosya boyutunu okunabilir formata çevirir
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Dosya uzantısından dil adını döner
 */
function getLanguageFromExtension(extension: string): string {
  const languageMap: { [key: string]: string } = {
    ".js": "javascript",
    ".ts": "typescript",
    ".jsx": "jsx",
    ".tsx": "tsx",
    ".json": "json",
    ".html": "html",
    ".css": "css",
    ".scss": "scss",
    ".sass": "sass",
    ".py": "python",
    ".java": "java",
    ".cpp": "cpp",
    ".c": "c",
    ".h": "c",
    ".hpp": "cpp",
    ".php": "php",
    ".rb": "ruby",
    ".go": "go",
    ".rs": "rust",
    ".swift": "swift",
    ".kt": "kotlin",
    ".scala": "scala",
    ".sql": "sql",
    ".xml": "xml",
    ".yaml": "yaml",
    ".yml": "yaml",
    ".ini": "ini",
    ".cfg": "ini",
    ".conf": "ini",
    ".log": "log",
    ".sh": "bash",
    ".bat": "batch",
    ".ps1": "powershell",
    ".dockerfile": "dockerfile",
    ".md": "markdown",
    ".txt": "text",
  };

  return languageMap[extension] || "text";
}
