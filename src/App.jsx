import React, { useState, useEffect } from 'react';
import { Upload, FileText, Settings, Play, ChevronRight, Eye, Download, Moon, Sun, Palette, Edit2, Save, X, Sparkles, Flower2 } from 'lucide-react';

const AgenticDocProcessor = () => {
  // Theme configurations
  const themes = {
    light: { bg: 'bg-white', text: 'text-gray-900', card: 'bg-gray-50', border: 'border-gray-200' },
    dark: { bg: 'bg-gray-900', text: 'text-white', card: 'bg-gray-800', border: 'border-gray-700' }
  };

  const flowerStyles = [
    { name: '櫻花 Sakura', primary: '#FFB7C5', secondary: '#FFF0F5', accent: '#FF69B4', gradient: 'from-pink-200 to-pink-50' },
    { name: '薰衣草 Lavender', primary: '#E6E6FA', secondary: '#F8F8FF', accent: '#9370DB', gradient: 'from-purple-200 to-purple-50' },
    { name: '向日葵 Sunflower', primary: '#FFD700', secondary: '#FFFACD', accent: '#FFA500', gradient: 'from-yellow-200 to-yellow-50' },
    // ... (rest of the styles are the same)
  ];

  // State management
  const [step, setStep] = useState('upload');
  const [themeMode, setThemeMode] = useState('light');
  const [flowerStyle, setFlowerStyle] = useState(0);
  
  // --- LOGIC FIX START ---
  const [fileObject, setFileObject] = useState(null); // State to hold the actual file
  // --- LOGIC FIX END ---

  const [document, setDocument] = useState('');
  const [fileName, setFileName] = useState('');
  const [ocrMethod, setOcrMethod] = useState('llm');
  const [ocrLanguage, setOcrLanguage] = useState('traditional-chinese');
  const [selectedPages, setSelectedPages] = useState('all');
  const [agents, setAgents] = useState([]);
  const [selectedAgentCount, setSelectedAgentCount] = useState(5);
  const [currentAgentIndex, setCurrentAgentIndex] = useState(0);
  const [agentOutputs, setAgentOutputs] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [editingOutput, setEditingOutput] = useState(null);
  const [showStylePicker, setShowStylePicker] = useState(false);

  const theme = themes[themeMode];
  const style = flowerStyles[flowerStyle];

  useEffect(() => {
    const defaultAgents = [
        { name: '文件摘要器', prompt: '請提供這份文件的簡要摘要，包含主要重點。', model: 'gpt-4o-mini', temperature: 0.7, top_p: 0.9 },
        { name: '關鍵詞提取器', prompt: '從文件中提取最重要的關鍵詞和術語。', model: 'gemini-2.5-flash', temperature: 0.5, top_p: 0.9 },
        { name: '情感分析器', prompt: '分析文件的整體情感傾向和語氣。', model: 'gpt-4o-mini', temperature: 0.6, top_p: 0.9 },
        { name: '實體識別器', prompt: '識別文件中的所有命名實體（人名、地名、組織名）。', model: 'gemini-2.5-flash', temperature: 0.4, top_p: 0.9 },
        { name: '行動項目提取器', prompt: '列出文件中提到的所有行動項目和待辦事項。', model: 'gpt-4o-mini', temperature: 0.7, top_p: 0.9 }
    ];
    setAgents(defaultAgents);
    setAgentOutputs(defaultAgents.map(() => ({ input: '', output: '', time: 0 })));
  }, []);

  // --- LOGIC FIX START: Updated File Upload Handler ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setFileObject(file); // Store the entire file object

    // For non-PDF files, read the text content immediately.
    if (file.type !== 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (readEvent) => {
        setDocument(readEvent.target.result);
      };
      reader.readAsText(file);
    } else {
      // For PDFs, clear previous document text and wait for the user to trigger processing.
      setDocument('');
    }
  };
  // --- LOGIC FIX END ---

  // --- LOGIC FIX START: New function to handle OCR processing ---
  const handleProcessAndPreview = async () => {
    if (!fileObject) return;

    // If it's not a PDF, the document text is already loaded, so just proceed.
    if (fileObject.type !== 'application/pdf') {
      setStep('preview');
      return;
    }

    // Simulate OCR Processing for PDF
    setIsExecuting(true);
    setDocument(`[正在處理 OCR...]\n\n檔案: ${fileName}\n方法: ${ocrMethod}\n語言: ${ocrLanguage}\n頁面: ${selectedPages}\n\n請稍候...`);

    // Simulate network delay/processing time
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Generate simulated OCR result text
    let ocrResult = `--- SIMULATED OCR RESULT ---\n`;
    ocrResult += `File: ${fileName}\n`;
    ocrResult += `OCR Method: ${ocrMethod}\n`;
    ocrResult += `Language: ${ocrLanguage}\n`;
    ocrResult += `Pages: ${selectedPages}\n\n`;
    ocrResult += `這是從 PDF 文件模擬提取的文字內容。\n\n`;
    ocrResult += `第一章：開端\n\n很久很久以前，在一個遙遠的國度... Lorem ipsum dolor sit amet, consectetur adipiscing elit. \n\n`;
    ocrResult += `第二章：發展\n\n旅程充滿了挑戰與冒險... Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n`;
    ocrResult += `--- END OF SIMULATION ---`;

    setDocument(ocrResult);
    setIsExecuting(false);
    setStep('preview');
  };
  // --- LOGIC FIX END ---

  const executeAgent = async (index) => {
    setIsExecuting(true);
    const agent = agents[index];
    const prevOutput = index === 0 ? document : agentOutputs[index - 1].output;
    
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, 2000));
    const simulatedOutput = `[${agent.name} 處理結果]\n\n基於以下提示：「${agent.prompt}」\n\n處理的內容長度：${prevOutput.length} 字元\n使用模型：${agent.model}\n溫度：${agent.temperature}\n\n這是模擬的輸出結果。在實際部署中，這裡會顯示真實的AI模型回應。`;
    const endTime = Date.now();
    
    const newOutputs = [...agentOutputs];
    newOutputs[index] = { input: prevOutput, output: simulatedOutput, time: (endTime - startTime) / 1000 };
    setAgentOutputs(newOutputs);
    setIsExecuting(false);
    
    if (index < selectedAgentCount - 1) {
      setCurrentAgentIndex(index + 1);
    }
  };

  const updateAgentParam = (index, field, value) => {
    const newAgents = [...agents];
    newAgents[index][field] = value;
    setAgents(newAgents);
  };
  
  const exportResults = () => {
    const results = {
      fileName,
      agents: agents.slice(0, selectedAgentCount),
      outputs: agentOutputs.slice(0, selectedAgentCount),
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `processing-results-${Date.now()}.json`;
    a.click();
  };

  // ... (JSX for header, style picker, etc. remains the same)

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} transition-colors duration-300`}>
      {/* Header and Style Picker Modal are unchanged */}
      {/* ... */}
      
      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps are unchanged */}
        {/* ... */}

        {/* Step: Upload */}
        {step === 'upload' && (
          <div className="max-w-4xl mx-auto">
            <div className={`${theme.card} rounded-2xl p-8 border-2`} style={{ borderColor: style.primary }}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Upload style={{ color: style.accent }} />
                上傳文件
              </h2>
              
              <div className="border-4 border-dashed rounded-xl p-12 text-center mb-6 transition-colors hover:bg-opacity-50"
                   style={{ borderColor: style.primary, backgroundColor: style.secondary }}>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".txt,.pdf,.docx,.md"
                  className="hidden"
                  id="fileInput"
                />
                <label htmlFor="fileInput" className="cursor-pointer">
                  <FileText size={64} className="mx-auto mb-4" style={{ color: style.accent }} />
                  <p className="text-lg font-semibold mb-2">點擊或拖放文件</p>
                  <p className="text-sm opacity-75">支援 PDF, DOCX, TXT, MD</p>
                </label>
              </div>

              {fileName && (
                <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: style.secondary }}>
                  <p className="font-semibold">已選擇: {fileName}</p>
                </div>
              )}

              {/* --- LOGIC FIX START: Conditional rendering of OCR options --- */}
              {fileObject && fileObject.type === 'application/pdf' && (
                <>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block font-semibold mb-2">OCR 方法</label>
                      <select
                        value={ocrMethod}
                        onChange={(e) => setOcrMethod(e.target.value)}
                        className="w-full p-3 rounded-lg border-2"
                        style={{ borderColor: style.primary }}
                      >
                        <option value="llm">LLM-based OCR</option>
                        <option value="python">Python Packages OCR</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-2">OCR 語言</label>
                      <select
                        value={ocrLanguage}
                        onChange={(e) => setOcrLanguage(e.target.value)}
                        className="w-full p-3 rounded-lg border-2"
                        style={{ borderColor: style.primary }}
                      >
                        <option value="english">English</option>
                        <option value="traditional-chinese">繁體中文</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block font-semibold mb-2">選擇處理頁面</label>
                    <input
                      type="text"
                      value={selectedPages}
                      onChange={(e) => setSelectedPages(e.target.value)}
                      placeholder="例如: all, 1-5, 1,3,5"
                      className="w-full p-3 rounded-lg border-2"
                      style={{ borderColor: style.primary }}
                    />
                    <p className="text-sm opacity-75 mt-1">輸入 "all" 處理所有頁面，或指定頁碼範圍</p>
                  </div>
                </>
              )}
              
              {fileName && (
                 <button
                    onClick={handleProcessAndPreview}
                    disabled={!fileObject || isExecuting}
                    className="w-full py-4 rounded-xl font-bold text-white text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    style={{ backgroundColor: style.accent }}
                  >
                    {isExecuting ? '處理中...' : (fileObject && fileObject.type === 'application/pdf' ? '處理並預覽文件' : '下一步：預覽文件')}
                  </button>
              )}
              {/* --- LOGIC FIX END --- */}
            </div>
          </div>
        )}

        {/* The rest of the steps (Preview, Config, Execute) remain the same */}
        {/* Step: Preview */}
        {step === 'preview' && (
          <div className="max-w-6xl mx-auto">
            <div className={`${theme.card} rounded-2xl p-8 border-2`} style={{ borderColor: style.primary }}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Eye style={{ color: style.accent }} />
                文件預覽
              </h2>
              
              <div className="mb-6 p-6 rounded-xl border-2 max-h-96 overflow-auto"
                   style={{ backgroundColor: style.secondary, borderColor: style.primary }}>
                <pre className="whitespace-pre-wrap">{document}</pre>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep('upload')}
                  className="flex-1 py-3 rounded-xl font-bold border-2 hover:opacity-80"
                  style={{ borderColor: style.accent, color: style.accent }}
                >
                  返回
                </button>
                <button
                  onClick={() => setStep('config')}
                  className="flex-1 py-3 rounded-xl font-bold text-white hover:opacity-90"
                  style={{ backgroundColor: style.accent }}
                >
                  下一步：設定代理
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* ... Config and Execute steps are unchanged ... */}
      </div>
    </div>
  );
};

export default AgenticDocProcessor;
