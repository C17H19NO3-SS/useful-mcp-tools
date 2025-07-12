# Contributing Guide

Thank you for your interest in contributing to MCP Web Tools! This guide explains how you can contribute to the project.

## 🚀 Getting Started

1. Fork this repository
2. Set up your local development environment:

   ```bash
   git clone https://github.com/YOUR_USERNAME/mcp-web-tools.git
   cd mcp-web-tools
   bun install
   cp env.example .env
   ```

3. Create a development branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Development Guidelines

### Code Style

- Use TypeScript
- Follow ESLint rules
- Use descriptive names for functions and variables
- Add JSDoc comments for each function

### Commit Messages

Write your commit messages in the following format:

```
type(scope): description

[optional body]

[optional footer]
```

Examples:

- `feat(tools): add new web scraping tool`
- `fix(gemini): resolve API timeout issue`
- `docs(readme): update installation instructions`

### Testing

- Write tests for new features
- Ensure existing tests pass
- Maintain test coverage

## 🛠️ Adding New Tools

To add a new tool:

1. Create a new service file in `src/services/`
2. Register the tool in `src/tools/index.ts`
3. Add necessary types to `src/types/tool.ts`
4. Update README.md
5. Write tests

### Tool Template

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

## 🔧 Environment Setup

### Required Tools

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- Git
- An IDE (VS Code recommended)

### API Keys

Required API keys for development:

- Google API Key (for Custom Search)
- Google CX (Custom Search Engine ID)
- Gemini API Key

## 📋 Pull Request Process

1. Commit your changes
2. Push your branch
3. Create a Pull Request
4. Describe changes in PR description
5. Wait for code review

### PR Template

```markdown
## Change Summary

[Brief description of changes]

## Change Type

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Tested

- [ ] Local tests passed
- [ ] New tests added
- [ ] Existing tests unaffected

## Additional Notes

[Additional information if any]
```

## 🐛 Bug Reporting

When reporting bugs:

1. Provide detailed description of the bug
2. Include reproduction steps
3. Describe expected and actual behavior
4. Include system information (OS, Node.js/Bun version)
5. Share error messages and logs

## 💡 Feature Suggestions

When suggesting features:

1. Explain the purpose of the feature
2. Describe use cases
3. Consider alternatives if any
4. Indicate priority level

## 📞 Contact

For questions:

- Use GitHub Issues
- Use Discussions section
- Email: [your-email@example.com]

## 🙏 Acknowledgments

Thank you for contributing! Every contribution makes the project better.

---

## 🇹🇷 Türkçe Katkıda Bulunma Rehberi

Bu proje için Türkçe katkıda bulunma rehberi [CONTRIBUTING_TR.md](CONTRIBUTING_TR.md) dosyasında bulunabilir.
