# MCP Web Tools

Model Context Protocol (MCP) tabanlı web araçları koleksiyonu. Bu proje, çeşitli web servisleri, veritabanı işlemleri, AI entegrasyonları ve dosya işlemleri için araçlar sağlar.

## 🚀 Özellikler

- **Web Arama**: Google Custom Search API ile web araması
- **Veritabanı İşlemleri**: MySQL sorguları çalıştırma
- **Web Sayfası İşleme**: HTML'i Markdown'a çevirme ve analiz
- **AI Entegrasyonu**: Google Gemini API ile içerik üretimi ve analiz
- **Dosya İşlemleri**: GitHub'dan dosya çekme, PDF'den Markdown'a çevirme
- **Todo Yönetimi**: Basit dosya tabanlı todo sistemi
- **Dosya Toplama**: Klasördeki metin dosyalarını Markdown'a birleştirme

## 📋 Gereksinimler

- [Bun](https://bun.sh/) (önerilen) veya Node.js 18+
- TypeScript 5+

## 🛠️ Kurulum

1. Projeyi klonlayın:

```bash
git clone https://github.com/yourusername/mcp-web-tools.git
cd mcp-web-tools
```

2. Bağımlılıkları yükleyin:

```bash
bun install
```

3. Ortam değişkenlerini ayarlayın:

```bash
cp env.example .env
```

4. `.env` dosyasını düzenleyerek API anahtarlarınızı ekleyin:

```env
GOOGLE_API_KEY=your_google_api_key
GOOGLE_CX=your_google_custom_search_engine_id
GEMINI_API_KEY=your_gemini_api_key
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=your_database
```

## 🚀 Kullanım

### Geliştirme Modu

```bash
bun run dev
```

### Production Build

```bash
bun run build
bun run start
```

### Bun ile Direkt Çalıştırma

```bash
bun run start:bun
```

## 🛠️ Mevcut Araçlar

### Web Arama

- `web_search`: Google'da arama yapar ve sonuçları döner

### Veritabanı

- `mysql_query`: MySQL veritabanında SQL sorguları çalıştırır

### Web Sayfası İşleme

- `visit_page`: Web sayfasını Markdown'a çevirir

### AI ve Analiz

- `gemini_chat`: Gemini API ile sohbet ve içerik üretimi
- `gemini_list_models`: Kullanılabilir Gemini modellerini listeler
- `fetch_and_run_code_snippet`: Kod analizi ve güvenlik değerlendirmesi
- `pdf_to_markdown`: PDF dosyalarını Markdown'a çevirir

### Dosya İşlemleri

- `github_file`: GitHub'dan dosya içeriği çeker
- `collect_text_files_to_markdown`: Klasördeki metin dosyalarını birleştirir

### Todo Yönetimi

- `todo_list`: Tüm todo'ları listeler
- `todo_add`: Yeni todo ekler
- `todo_complete`: Todo'yu tamamlar
- `todo_delete`: Todo'yu siler
- `todo_export`: Todo'ları JSON olarak dışa aktarır
- `todo_import`: JSON'dan todo'ları içe aktarır

### Arama ve Filtreleme

- `search_tasks`: Görevlerde arama ve filtreleme
- `search_projects`: Projelerde arama

### Konfigürasyon

- `gemini_set_system_prompt`: Kullanıcı için sistem promptu ayarlar
- `gemini_get_system_prompt`: Sistem promptunu döner
- `gemini_set_default_model`: Varsayılan modeli ayarlar
- `gemini_get_default_model`: Varsayılan modeli döner

### Sistem Bilgisi

- `system_info`: Geçerli sistem ortamı hakkında rapor döner (İşletim sistemi, CPU, bellek, Node/Bun/TypeScript sürümleri ve temel ortam değişkenleri)

## 📁 Proje Yapısı

```
src/
├── index.ts              # Ana MCP sunucusu
├── tools/
│   └── index.ts          # Tüm araçların kaydı
├── services/
│   ├── fileCollector.ts  # Dosya toplama servisi
│   ├── gemini.ts         # Gemini AI servisi
│   ├── googleSearch.ts   # Google arama servisi
│   ├── mysqlQuery.ts     # MySQL sorgu servisi
│   ├── todo.ts           # Todo yönetimi servisi
│   ├── visitPage.ts      # Web sayfası işleme servisi
│   ├── githubFile.ts     # GitHub dosya servisi
│   └── search.ts         # Arama servisi
├── types/
│   ├── mcp.ts            # MCP protokol tipleri
│   └── tool.ts           # Tool input/output tipleri
├── utils/
│   └── env.ts            # Ortam değişkeni yardımcıları
└── resources/
    └── index.ts          # MCP kaynakları
```

## 🔧 Konfigürasyon

### API Anahtarları

Projenin çalışması için aşağıdaki API anahtarları gereklidir:

1. **Google API Key**: Google Custom Search API için
2. **Google CX**: Google Custom Search Engine ID
3. **Gemini API Key**: Google Gemini AI servisleri için

### MySQL Konfigürasyonu

MySQL sorguları için veritabanı bağlantı bilgileri gerekir.

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🐛 Sorun Bildirimi

Bir bug bulduysanız veya özellik öneriniz varsa, lütfen [GitHub Issues](https://github.com/yourusername/mcp-web-tools/issues) sayfasında bildirin.

## 📄 Değişiklik Geçmişi

### v1.0.0

- İlk sürüm
- Temel MCP araçları
- Google Gemini entegrasyonu
- Web arama ve sayfa işleme
- Todo yönetimi
- Dosya toplama ve işleme

## 🙏 Teşekkürler

- [Model Context Protocol](https://modelcontextprotocol.io/) ekibine
- [Google Gemini](https://ai.google.dev/) ekibine
- [Bun](https://bun.sh/) geliştiricilerine

---

## 🇺🇸 English Documentation

English documentation for this project can be found in [README.md](README.md).
