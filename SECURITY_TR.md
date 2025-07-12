# Güvenlik Politikası

## Desteklenen Versiyonlar

Aşağıdaki versiyonlar güvenlik güncellemeleri alır:

| Versiyon | Destekleniyor |
| -------- | ------------- |
| 1.0.x    | ✅            |
| < 1.0    | ❌            |

## Güvenlik Açığı Bildirimi

Güvenlik açığı bulduysanız, lütfen aşağıdaki adımları takip edin:

### Özel Bildirim

Güvenlik açıklarını özel olarak bildirmek için:

- Email: [security@yourdomain.com]
- Konu: `[SECURITY] MCP Web Tools - [Açıklama]`

### Bildirim İçeriği

Güvenlik açığı bildiriminizde şunları belirtin:

- Açıklığın detaylı açıklaması
- Yeniden üretme adımları
- Potansiyel etki
- Önerilen çözüm (varsa)

### Yanıt Süresi

- İlk yanıt: 48 saat içinde
- Detaylı değerlendirme: 1 hafta içinde
- Düzeltme planı: 2 hafta içinde

## Güvenlik Önlemleri

### API Anahtarları

- API anahtarlarını asla kod içinde saklamayın
- Ortam değişkenleri kullanın
- `.env` dosyasını `.gitignore`'a ekleyin

### Bağımlılık Güvenliği

- Düzenli güvenlik denetimleri yapın: `bun audit`
- Bağımlılıkları güncel tutun
- Güvenlik açığı olan paketleri hemen güncelleyin

### Kod Güvenliği

- Input validasyonu yapın
- SQL injection'a karşı parametreli sorgular kullanın
- XSS saldırılarına karşı output encoding yapın

## Güvenlik Güncellemeleri

Güvenlik güncellemeleri:

- Kritik: 24 saat içinde
- Yüksek: 1 hafta içinde
- Orta: 1 ay içinde
- Düşük: Bir sonraki düzenli sürümde

## Güvenlik Denetimi

Projeyi güvenlik açısından denetlemek için:

```bash
# Bağımlılık güvenlik denetimi
bun audit

# TypeScript tip güvenliği
bun run build:tsc

# Kod analizi
bun run lint
```

## Güvenlik İyi Uygulamaları

### Geliştiriciler İçin

1. Güvenlik açıklarını hemen bildirin
2. Güvenlik güncellemelerini hızlıca uygulayın
3. Güvenlik testleri yazın
4. Kod gözden geçirmelerinde güvenliğe odaklanın

### Kullanıcılar İçin

1. Projeyi güncel tutun
2. API anahtarlarını güvenli saklayın
3. Güvenlik güncellemelerini takip edin
4. Şüpheli aktiviteleri bildirin

## Güvenlik Kaynakları

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [TypeScript Security](https://www.typescriptlang.org/docs/handbook/security.html)

## İletişim

Güvenlik ile ilgili sorularınız için:

- Email: [security@yourdomain.com]
- GitHub Security Advisories: [GitHub Security](https://github.com/yourusername/mcp-web-tools/security/advisories)

---

## 🇺🇸 English Security Policy

English security policy for this project can be found in [SECURITY.md](SECURITY.md).
