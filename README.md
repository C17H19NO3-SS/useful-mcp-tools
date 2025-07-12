# MCP Web Tools

A collection of web tools based on Model Context Protocol (MCP). This project provides tools for various web services, database operations, AI integrations, and file operations.

## 🚀 Features

- **Web Search**: Google Custom Search API integration
- **Database Operations**: MySQL query execution
- **Web Page Processing**: HTML to Markdown conversion and analysis
- **AI Integration**: Google Gemini API for content generation and analysis
- **File Operations**: GitHub file fetching, PDF to Markdown conversion
- **Todo Management**: Simple file-based todo system
- **File Collection**: Merge text files in folders to Markdown

## 📋 Requirements

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- TypeScript 5+

## 🛠️ Installation

1. Clone the project:

```bash
git clone https://github.com/yourusername/mcp-web-tools.git
cd mcp-web-tools
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables:

```bash
cp env.example .env
```

4. Edit `.env` file with your API keys:

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

## 🚀 Usage

### Development Mode

```bash
bun run dev
```

### Production Build

```bash
bun run build
bun run start
```

### Run with Bun

```bash
bun run start:bun
```

## 🛠️ Available Tools

### Web Search

- `web_search`: Performs Google search and returns results

### Database

- `mysql_query`: Executes SQL queries in MySQL database

### Web Page Processing

- `visit_page`: Converts web page to Markdown

### AI and Analysis

- `gemini_chat`: Chat and content generation with Gemini API
- `gemini_list_models`: Lists available Gemini models
- `fetch_and_run_code_snippet`: Code analysis and security assessment
- `pdf_to_markdown`: Converts PDF files to Markdown

### File Operations

- `github_file`: Fetches file content from GitHub
- `collect_text_files_to_markdown`: Merges text files in folders

### Todo Management

- `todo_list`: Lists all todos
- `todo_add`: Adds new todo
- `todo_complete`: Completes todo
- `todo_delete`: Deletes todo
- `todo_export`: Exports todos as JSON
- `todo_import`: Imports todos from JSON

### Search and Filtering

- `search_tasks`: Search and filter tasks
- `search_projects`: Search projects

### Configuration

- `gemini_set_system_prompt`: Sets system prompt for user
- `gemini_get_system_prompt`: Returns system prompt
- `gemini_set_default_model`: Sets default model
- `gemini_get_default_model`: Returns default model

### System Information

- `system_info`: Returns a report of the current system environment (OS, CPU, memory, Node/Bun/TypeScript versions, and key environment variables)

## 📁 Project Structure

```
src/
├── index.ts              # Main MCP server
├── tools/
│   └── index.ts          # Registration of all tools
├── services/
│   ├── fileCollector.ts  # File collection service
│   ├── gemini.ts         # Gemini AI service
│   ├── googleSearch.ts   # Google search service
│   ├── mysqlQuery.ts     # MySQL query service
│   ├── todo.ts           # Todo management service
│   ├── visitPage.ts      # Web page processing service
│   ├── githubFile.ts     # GitHub file service
│   └── search.ts         # Search service
├── types/
│   ├── mcp.ts            # MCP protocol types
│   └── tool.ts           # Tool input/output types
├── utils/
│   └── env.ts            # Environment variable helpers
└── resources/
    └── index.ts          # MCP resources
```

## 🔧 Configuration

### API Keys

The following API keys are required for the project to work:

1. **Google API Key**: For Google Custom Search API
2. **Google CX**: Google Custom Search Engine ID
3. **Gemini API Key**: For Google Gemini AI services

### MySQL Configuration

Database connection information is required for MySQL queries.

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🐛 Bug Reports

If you find a bug or have a feature request, please report it on [GitHub Issues](https://github.com/yourusername/mcp-web-tools/issues).

## 📄 Changelog

### v1.0.0

- Initial release
- Basic MCP tools
- Google Gemini integration
- Web search and page processing
- Todo management
- File collection and processing

## 🙏 Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) team
- [Google Gemini](https://ai.google.dev/) team
- [Bun](https://bun.sh/) developers

---

## 🇹🇷 Türkçe Dokümantasyon

Bu proje için Türkçe dokümantasyon [README_TR.md](README_TR.md) dosyasında bulunabilir.
