# Service Analyzer

🔍 **Service Analyzer** is a TypeScript CLI app that uses OpenAI's GPT-4 to generate detailed, markdown-formatted reports for any service or product description you provide. It is designed for professional, reproducible AI-powered analysis.

---

## ⚙️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd service-analyzer
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure your OpenAI API key**
   - Create a `.env` file in the project root:
     ```
     OPENAI_API_KEY=your-api-key-here
     ```
   - The `.env` file is already gitignored for security.

---

## ▶️ How to Run the App

You can run the app using ts-node (no build step required):

```bash
npx ts-node src/index.ts
```

Or, if you prefer to build and run:
```bash
npm run build
npm start
```

---

## 💾 How to View the Output
- The markdown report is **printed to your terminal**.
- It is also **saved as `last_report.md`** in the project root after each run.
- The app will show you the path to the saved file.

---

## 🧪 Example

**Input:**
```
Notion
```

**Output (truncated):**
```
# Notion Service Analysis

## Brief History
- Founded in 2013 in San Francisco
- ...

## Target Audience
- Knowledge workers
- Students
- ...

## Core Features
- Note-taking
- Database management
- ...

... (see sample_outputs.md for full examples)
```

---

## 📁 Project Structure

```
service-analyzer/
├── src/
│   ├── index.ts           # CLI entry point (minimal)
│   ├── promptBuilder.ts   # Prompt construction logic
│   ├── openaiClient.ts    # OpenAI API integration & error handling
│   └── markdownSaver.ts   # Utility to save markdown reports
├── .env                   # Your OpenAI API key (not committed)
├── .gitignore             # Ensures .env and node_modules are ignored
├── README.md              # This file
├── sample_outputs.md      # Example outputs for reference
└── ...
```

---

## 🔒 Security
- Your OpenAI API key is never hardcoded or logged.
- `.env` is gitignored by default.

---

## 📝 License
MIT 