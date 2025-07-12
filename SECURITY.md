# Security Policy

## Supported Versions

The following versions receive security updates:

| Version | Supported |
| ------- | --------- |
| 1.0.x   | ✅        |
| < 1.0   | ❌        |

## Reporting a Vulnerability

If you find a security vulnerability, please follow these steps:

### Private Disclosure

To report security vulnerabilities privately:

- Email: [security@yourdomain.com]
- Subject: `[SECURITY] MCP Web Tools - [Description]`

### Report Content

In your security vulnerability report, please include:

- Detailed description of the vulnerability
- Reproduction steps
- Potential impact
- Suggested fix (if any)

### Response Timeline

- Initial response: Within 48 hours
- Detailed assessment: Within 1 week
- Fix plan: Within 2 weeks

## Security Measures

### API Keys

- Never store API keys in code
- Use environment variables
- Add `.env` file to `.gitignore`

### Dependency Security

- Run regular security audits: `bun audit`
- Keep dependencies updated
- Update vulnerable packages immediately

### Code Security

- Validate inputs
- Use parameterized queries against SQL injection
- Encode outputs against XSS attacks

## Security Updates

Security updates are released:

- Critical: Within 24 hours
- High: Within 1 week
- Medium: Within 1 month
- Low: In next regular release

## Security Audit

To audit the project for security:

```bash
# Dependency security audit
bun audit

# TypeScript type safety
bun run build:tsc

# Code analysis
bun run lint
```

## Security Best Practices

### For Developers

1. Report vulnerabilities immediately
2. Apply security updates quickly
3. Write security tests
4. Focus on security in code reviews

### For Users

1. Keep the project updated
2. Store API keys securely
3. Follow security updates
4. Report suspicious activities

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [TypeScript Security](https://www.typescriptlang.org/docs/handbook/security.html)

## Contact

For security-related questions:

- Email: [security@yourdomain.com]
- GitHub Security Advisories: [GitHub Security](https://github.com/yourusername/mcp-web-tools/security/advisories)

---

## 🇹🇷 Türkçe Güvenlik Politikası

Bu proje için Türkçe güvenlik politikası [SECURITY_TR.md](SECURITY_TR.md) dosyasında bulunabilir.
