# 🚀 智能文件處理系統 - Netlify 部署完整指南

## 📋 目錄
1. [系統需求](#系統需求)
2. [準備工作](#準備工作)
3. [項目設置](#項目設置)
4. [部署到 Netlify](#部署到-netlify)
5. [環境變數配置](#環境變數配置)
6. [故障排除](#故障排除)

---

## 系統需求

在開始之前，請確保您的電腦已安裝：

- **Node.js** (版本 18.0 或更高)
  - 下載地址：https://nodejs.org/
  - 驗證安裝：打開命令提示字元，輸入 `node --version`

- **Git** (用於版本控制)
  - 下載地址：https://git-scm.com/
  - 驗證安裝：輸入 `git --version`

- **文字編輯器**
  - 推薦：Visual Studio Code (https://code.visualstudio.com/)

---

## 準備工作

### 步驟 1：註冊 Netlify 帳號

1. 前往 https://www.netlify.com/
2. 點擊 "Sign up" 註冊
3. 建議使用 GitHub 帳號登入（稍後會用到）

### 步驟 2：註冊 GitHub 帳號（如果還沒有）

1. 前往 https://github.com/
2. 點擊 "Sign up" 註冊
3. 完成電子郵件驗證

### 步驟 3：取得 API 金鑰

您需要以下 API 金鑰之一（或多個）：

#### **OpenAI API Key**
1. 前往 https://platform.openai.com/
2. 註冊/登入帳號
3. 點擊右上角頭像 → "View API keys"
4. 點擊 "Create new secret key"
5. 複製並安全保存金鑰

#### **Google Gemini API Key**
1. 前往 https://makersuite.google.com/app/apikey
2. 登入 Google 帳號
3. 點擊 "Create API Key"
4. 複製並保存金鑰

#### **Grok API Key**
1. 前往 https://x.ai/
2. 申請 API 存取權限
3. 取得金鑰

---

## 項目設置

### 步驟 1：創建項目資料夾

打開命令提示字元（Windows）或終端機（Mac/Linux），執行：

```bash
# 創建項目資料夾
mkdir agentic-doc-processor
cd agentic-doc-processor

# 初始化 Git
git init

# 初始化 npm 項目
npm init -y
```

### 步驟 2：安裝必要套件

```bash
npm install react react-dom lucide-react
npm install --save-dev vite @vitejs/plugin-react
```

### 步驟 3：創建項目結構

在項目資料夾中創建以下檔案結構：

```
agentic-doc-processor/
├── public/
│   └── agents.yaml          # 代理配置檔
├── src/
│   ├── App.jsx             # 主應用程式
│   └── main.jsx            # 入口檔案
├── index.html              # HTML 模板
├── package.json            # 依賴配置
├── vite.config.js          # Vite 配置
└── netlify.toml            # Netlify 配置
```

### 步驟 4：創建 `index.html`

在根目錄創建 `index.html`：

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🌸 智能文件處理系統</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

### 步驟 5：創建 `src/main.jsx`

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

### 步驟 6：創建 `src/App.jsx`

將我提供的完整 React 程式碼複製到這個檔案中。

### 步驟 7：創建 `vite.config.js`

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
```

### 步驟 8：創建 `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### 步驟 9：更新 `package.json`

在 `package.json` 中添加 scripts：

```json
{
  "name": "agentic-doc-processor",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0"
  }
}
```

### 步驟 10：複製 `agents.yaml`

將我提供的 `agents.yaml` 檔案放入 `public/` 資料夾。

### 步驟 11：創建 `.gitignore`

```
node_modules/
dist/
.env
.env.local
.DS_Store
```

---

## 部署到 Netlify

### 方法 1：透過 GitHub（推薦）

#### 步驟 1：推送到 GitHub

```bash
# 添加所有檔案
git add .

# 提交變更
git commit -m "Initial commit"

# 在 GitHub 創建新倉庫
# 前往 https://github.com/new
# 倉庫名稱：agentic-doc-processor
# 設為 Public 或 Private
# 不要初始化 README

# 連接遠端倉庫（替換 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/agentic-doc-processor.git

# 推送程式碼
git branch -M main
git push -u origin main
```

#### 步驟 2：連接 Netlify

1. 登入 https://app.netlify.com/
2. 點擊 "Add new site" → "Import an existing project"
3. 選擇 "GitHub"
4. 授權 Netlify 存取 GitHub
5. 選擇 `agentic-doc-processor` 倉庫
6. 構建設置：
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
7. 點擊 "Deploy site"

### 方法 2：手動部署

#### 步驟 1：本地構建

```bash
# 安裝依賴
npm install

# 構建專案
npm run build
```

#### 步驟 2：拖放部署

1. 登入 https://app.netlify.com/
2. 將 `dist` 資料夾直接拖放到 Netlify 儀表板
3. 等待部署完成

---

## 環境變數配置

### 在 Netlify 設置環境變數

1. 在 Netlify 儀表板中，進入您的網站
2. 點擊 "Site settings"
3. 點擊左側 "Environment variables"
4. 點擊 "Add a variable"
5. 添加以下變數：

```
VITE_OPENAI_API_KEY=sk-your-openai-key-here
VITE_GEMINI_API_KEY=your-gemini-key-here
VITE_GROK_API_KEY=your-grok-key-here
```

**⚠️ 重要提示：**
- 在 Vite 中，環境變數必須以 `VITE_` 開頭才能在前端使用
- 不要將 API 金鑰提交到 Git
- 生產環境建議使用後端 API 來保護金鑰

### 在程式碼中使用環境變數

更新 `App.jsx` 中的 API 金鑰讀取：

```jsx
const [apiKeys, setApiKeys] = useState({
  openai: import.meta.env.VITE_OPENAI_API_KEY || '',
  gemini: import.meta.env.VITE_GEMINI_API_KEY || '',
  grok: import.meta.env.VITE_GROK_API_KEY || ''
});
```

---

## 實現 API 整合

### 安裝 API 客戶端

```bash
npm install openai @google/generative-ai
```

### 創建 API 服務檔案 `src/apiService.js`

```javascript
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const executeAgent = async (agent, input, apiKeys) => {
  try {
    if (agent.model.includes('gpt')) {
      const openai = new OpenAI({
        apiKey: apiKeys.openai,
        dangerouslyAllowBrowser: true // 僅用於演示，生產環境應使用後端
      });

      const response = await openai.chat.completions.create({
        model: agent.model,
        messages: [
          { role: 'system', content: agent.prompt },
          { role: 'user', content: input }
        ],
        temperature: agent.temperature,
        top_p: agent.top_p,
        max_tokens: agent.max_tokens || 2048
      });

      return response.choices[0].message.content;
    } 
    else if (agent.model.includes('gemini')) {
      const genAI = new GoogleGenerativeAI(apiKeys.gemini);
      const model = genAI.getGenerativeModel({ model: agent.model });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: `${agent.prompt}\n\n${input}` }] }],
        generationConfig: {
          temperature: agent.temperature,
          topP: agent.top_p,
          maxOutputTokens: agent.max_tokens || 2048
        }
      });

      return result.response.text();
    }
    
    throw new Error(`不支援的模型: ${agent.model}`);
  } catch (error) {
    console.error('API 錯誤:', error);
    throw error;
  }
};
```

---

## 本地測試

在部署前，在本地測試：

```bash
# 開發模式
npm run dev

# 在瀏覽器打開 http://localhost:5173

# 測試構建
npm run build
npm run preview
```

---

## 故障排除

### 問題 1：部署失敗 - "Command failed"

**解決方案：**
- 檢查 `package.json` 中的 build 指令
- 確保所有依賴都已安裝
- 查看 Netlify 部署日誌中的具體錯誤

### 問題 2：白屏或空白頁面

**解決方案：**
- 檢查瀏覽器控制台是否有錯誤
- 確認 `index.html` 路徑正確
- 檢查 `netlify.toml` 重定向設置

### 問題 3：API 金鑰無效

**解決方案：**
- 確認環境變數名稱正確（以 `VITE_` 開頭）
- 重新部署網站以更新環境變數
- 檢查 API 金鑰是否有效且有足夠配額

### 問題 4：CORS 錯誤

**解決方案：**
- 使用 Netlify Functions 創建後端 API 端點
- 參考：https://docs.netlify.com/functions/overview/

### 問題 5：檔案上傳不工作

**解決方案：**
- 確認使用 `FileReader` API 讀取檔案
- 檢查檔案大小限制
- 使用 base64 編碼處理 PDF

---

## 進階功能：添加 Netlify Functions

### 創建安全的 API 端點

1. 創建 `netlify/functions` 資料夾
2. 創建 `netlify/functions/execute-agent.js`：

```javascript
import OpenAI from 'openai';

export default async (req) => {
  if (req.method !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { agent, input } = JSON.parse(req.body);
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await openai.chat.completions.create({
      model: agent.model,
      messages: [
        { role: 'system', content: agent.prompt },
        { role: 'user', content: input }
      ],
      temperature: agent.temperature
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ output: response.choices[0].message.content })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

3. 在前端調用：

```javascript
const response = await fetch('/.netlify/functions/execute-agent', {
  method: 'POST',
  body: JSON.stringify({ agent, input })
});
const data = await response.json();
```

---

## 維護與更新

### 更新程式碼

```bash
# 拉取最新程式碼
git pull origin main

# 進行修改後
git add .
git commit -m "描述你的變更"
git push origin main

# Netlify 會自動重新部署
```

### 監控與分析

1. 在 Netlify 儀表板查看：
   - 部署歷史
   - 訪問分析
   - 錯誤日誌

2. 設置通知：
   - 部署成功/失敗通知
   - 整合 Slack 或 Email

---

## 檢查清單

部署前確認：

- [ ] 所有依賴已正確安裝
- [ ] `package.json` 包含正確的 build 指令
- [ ] `netlify.toml` 配置正確
- [ ] 環境變數已設置
- [ ] 本地測試通過
- [ ] `.gitignore` 已配置
- [ ] API 金鑰已安全保護
- [ ] `agents.yaml` 檔案在 `public/` 資料夾中

---

## 資源連結

- **Netlify 文檔**: https://docs.netlify.com/
- **Vite 文檔**: https://vitejs.dev/
- **React 文檔**: https://react.dev/
- **Tailwind CSS**: https://tailwindcss.com/

---

## 取得幫助

如果遇到問題：

1. 查看 Netlify 部署日誌
2. 檢查瀏覽器控制台錯誤
3. 參考 Netlify 社群論壇
4. 查看 GitHub Issues

---

**祝您部署順利！🎉**

如有任何問題，歡迎查閱官方文檔或尋求社群支持。
