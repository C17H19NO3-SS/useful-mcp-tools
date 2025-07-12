# Katkıda Bulunma Rehberi

MCP Web Tools projesine katkıda bulunmak istediğiniz için teşekkürler! Bu rehber, projeye nasıl katkıda bulunabileceğinizi açıklar.

## 🚀 Başlangıç

1. Bu repository'yi fork edin
2. Lokal geliştirme ortamınızı kurun:

   ```bash
   git clone https://github.com/YOUR_USERNAME/mcp-web-tools.git
   cd mcp-web-tools
   bun install
   cp env.example .env
   ```

3. Geliştirme branch'i oluşturun:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Geliştirme Kuralları

### Kod Stili

- TypeScript kullanın
- ESLint kurallarına uyun
- Fonksiyonlar ve değişkenler için açıklayıcı isimler kullanın
- Her fonksiyon için JSDoc yorumları ekleyin

### Commit Mesajları

Commit mesajlarınızı aşağıdaki formatta yazın:

```
type(scope): description

[optional body]

[optional footer]
```

Örnekler:

- `feat(tools): add new web scraping tool`
- `fix(gemini): resolve API timeout issue`
- `docs(readme): update installation instructions`

### Test

- Yeni özellikler için test yazın
- Mevcut testlerin çalıştığından emin olun
- Test coverage'ını koruyun

## 🛠️ Yeni Tool Ekleme

Yeni bir tool eklemek için:

1. `src/services/` klasöründe yeni servis dosyası oluşturun
2. `src/tools/index.ts` dosyasında tool'u kaydedin
3. Gerekli tipleri `src/types/tool.ts` dosyasına ekleyin
4. README.md dosyasını güncelleyin
5. Test yazın

### Tool Şablonu

```typescript
// src/services/yourTool.ts
export async function yourToolFunction(
  params: YourToolInput
): Promise<YourToolOutput> {
  // Implementation
}

// src/tools/index.ts
function registerYourTool() {
  server.tool(
    "your_tool_name",
    "Tool description",
    {
      param1: z.string().describe("Parameter description"),
      param2: z.number().optional().describe("Optional parameter"),
    },
    async ({ param1, param2 }) => {
      try {
        const result = await yourToolFunction({ param1, param2 });
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );
}
```

## 🔧 Ortam Kurulumu

### Gerekli Araçlar

- [Bun](https://bun.sh/) (önerilen) veya Node.js 18+
- Git
- Bir IDE (VS Code önerilen)

### API Anahtarları

Geliştirme için gerekli API anahtarları:

- Google API Key (Custom Search için)
- Google CX (Custom Search Engine ID)
- Gemini API Key

## 📋 Pull Request Süreci

1. Değişikliklerinizi commit edin
2. Branch'inizi push edin
3. Pull Request oluşturun
4. PR açıklamasında değişiklikleri detaylandırın
5. Code review'u bekleyin

### PR Şablonu

```markdown
## Değişiklik Özeti

[Değişikliklerin kısa açıklaması]

## Değişiklik Türü

- [ ] Bug fix
- [ ] Yeni özellik
- [ ] Breaking change
- [ ] Dokümantasyon güncellemesi

## Test Edildi

- [ ] Lokal testler geçti
- [ ] Yeni testler eklendi
- [ ] Mevcut testler etkilenmedi

## Ek Notlar

[Varsa ek bilgiler]
```

## 🐛 Bug Raporlama

Bug raporlarken:

1. Bug'ın detaylı açıklamasını yapın
2. Yeniden üretme adımlarını belirtin
3. Beklenen ve gerçek davranışı açıklayın
4. Sistem bilgilerini ekleyin (OS, Node.js/Bun versiyonu)
5. Hata mesajlarını ve log'ları paylaşın

## 💡 Özellik Önerileri

Özellik önerirken:

1. Özelliğin amacını açıklayın
2. Kullanım senaryolarını belirtin
3. Varsa alternatif çözümleri değerlendirin
4. Özelliğin önceliğini belirtin

## 📞 İletişim

Sorularınız için:

- GitHub Issues kullanın
- Discussions bölümünü kullanın
- Email: [your-email@example.com]

## 🙏 Teşekkürler

Katkıda bulunduğunuz için teşekkürler! Her katkı projeyi daha iyi hale getiriyor.

---

## 🇺🇸 English Contributing Guide

English contributing guide for this project can be found in [CONTRIBUTING.md](CONTRIBUTING.md).
