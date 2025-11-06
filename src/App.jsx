import React, { useState, useEffect } from 'react';
import { Upload, FileText, Settings, Play, ChevronRight, Eye, Download, Moon, Sun, Palette, Edit2, X, Sparkles, Flower2 } from 'lucide-react';

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
    { name: '玫瑰 Rose', primary: '#FF6B9D', secondary: '#FFE5EC', accent: '#C71585', gradient: 'from-rose-200 to-rose-50' },
    { name: '蓮花 Lotus', primary: '#FFB6C1', secondary: '#FFF5F7', accent: '#FF1493', gradient: 'from-pink-300 to-pink-100' },
  ];

  // State management
  const [step, setStep] = useState('upload');
  const [themeMode, setThemeMode] = useState('light');
  const [flowerStyle, setFlowerStyle] = useState(0);
  
  const [fileObject, setFileObject] = useState(null);
  const [document, setDocument] = useState('');
  const [fileName, setFileName] = useState('');
  
  const [ocrMethod, setOcrMethod] = useState('llm');
  const [pythonOcrPackage, setPythonOcrPackage] = useState('tesseract');
  const [ocrLanguage, setOcrLanguage] = useState('traditional-chinese');
  const [selectedPages, setSelectedPages] = useState('all');
  
  const [agents, setAgents] = useState([]);
  const [selectedAgentCount, setSelectedAgentCount] = useState(5);
  const [currentAgentIndex, setCurrentAgentIndex] = useState(0);
  const [agentOutputs, setAgentOutputs] = useState([]);
  
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [isExecutingAgents, setIsExecutingAgents] = useState(false);
  
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setFileObject(file);
    setDocument(''); // Reset document on new file upload

    if (file.type !== 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (readEvent) => {
        setDocument(readEvent.target.result);
      };
      reader.readAsText(file);
    }
  };
  
  /**
   * Simulates a real OCR process with delays and method-specific output.
   */
  const simulateOcrProcessing = async () => {
    let ocrResult = `--- SIMULATED OCR RESULT ---\n`;
    ocrResult += `File: ${fileName}\n`;
    ocrResult += `Language: ${ocrLanguage}\n`;
    ocrResult += `Pages: ${selectedPages}\n\n`;

    if (ocrMethod === 'llm') {
        ocrResult += `Method: LLM-based OCR\n`;
        ocrResult += `--- [LLM Model Vision Analysis] ---\n`;
        ocrResult += `The document appears to be a technical report. It contains structured text, tables, and charts. The layout is clean, making it suitable for text extraction.\n\n`;
        ocrResult += `(這是由模擬的LLM視覺模型生成的文字...)\n\n`;
    } else {
        ocrResult += `Method: Python Package (${pythonOcrPackage})\n`;
        switch (pythonOcrPackage) {
            case 'tesseract':
                ocrResult += `--- [Tesseract OCR Engine] ---\n(模擬Tesseract輸出，可能包含一些格式或識別上的小錯誤。)\nLorem ipsum dolor sit amet, c0nsectetur adip1scing elit.\n\n`;
                break;
            case 'easyocr':
                ocrResult += `--- [EasyOCR Engine] ---\n(模擬EasyOCR輸出，在多語言處理上表現良好。)\nLorem ipsum dolor sit amet, consectetur adipiscing elit.\n\n`;
                break;
            case 'paddleocr':
                ocrResult += `--- [PaddleOCR Engine] ---\n(模擬PaddleOCR輸出，對複雜佈局有較好的適應性。)\nLorem ipsum dolor sit amet, consectetur adipiscing elit.\n\n`;
                break;
            default:
                ocrResult += `Unknown Python OCR package.\n`;
        }
    }
    
    ocrResult += `--- END OF SIMULATION ---`;
    
    // Simulate network/processing delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    return ocrResult;
  };

  const handleProcessAndPreview = async () => {
    if (!fileObject) return;

    if (fileObject.type !== 'application/pdf') {
      setStep('preview');
      return;
    }

    setIsProcessingOcr(true);
    const ocrText = await simulateOcrProcessing();
    setDocument(ocrText);
    setIsProcessingOcr(false);
    setStep('preview');
  };

  const executeAgent = async (index) => {
    setIsExecutingAgents(true);
    const agent = agents[index];
    const prevOutput = index === 0 ? document : agentOutputs[index - 1].output;
    
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    const simulatedOutput = `[${agent.name} Result]\nBased on prompt: "${agent.prompt}"\nModel: ${agent.model}\n\nThis is a simulated output. In a real application, this would be the response from the AI model.`;
    const endTime = Date.now();
    
    const newOutputs = [...agentOutputs];
    newOutputs[index] = { input: prevOutput, output: simulatedOutput, time: (endTime - startTime) / 1000 };
    setAgentOutputs(newOutputs);
    
    if (index < selectedAgentCount - 1) {
      setCurrentAgentIndex(index + 1);
    }
    setIsExecutingAgents(false);
  };

  const updateAgentParam = (index, field, value) => {
    const newAgents = [...agents];
    newAgents[index][field] = value;
    setAgents(newAgents);
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} transition-colors duration-300`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${style.gradient} border-b ${theme.border} shadow-lg`}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Flower2 size={40} style={{ color: style.accent }} />
              <div>
                <h1 className="text-3xl font-bold" style={{ color: style.accent }}>智能文件處理系統</h1>
                <p className="text-sm opacity-75">Agentic AI Document Processor</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowStylePicker(!showStylePicker)} className="p-2 rounded-lg hover:bg-white/20 transition-colors" style={{ color: style.accent }}>
                <Palette size={24} />
              </button>
              <button onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')} className="p-2 rounded-lg hover:bg-white/20 transition-colors" style={{ color: style.accent }}>
                {themeMode === 'light' ? <Moon size={24} /> : <Sun size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Style Picker Modal */}
      {showStylePicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${theme.card} rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles style={{ color: style.accent }} /> 選擇花卉主題風格
              </h2>
              <button onClick={() => setShowStylePicker(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><X size={24} /></button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {flowerStyles.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => { setFlowerStyle(idx); setShowStylePicker(false); }}
                  className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${flowerStyle === idx ? 'border-4' : 'border'}`}
                  style={{ backgroundColor: s.secondary, borderColor: s.accent }}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🌸</div>
                    <div className="font-bold" style={{ color: s.accent }}>{s.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            {['上傳', '預覽', '設定', '執行'].map((s, idx) => (
              <React.Fragment key={idx}>
                <div
                  className={`px-6 py-3 rounded-lg font-bold transition-all ${['upload', 'preview', 'config', 'execute'][idx] === step ? 'shadow-lg scale-110' : 'opacity-50'}`}
                  style={{ backgroundColor: ['upload', 'preview', 'config', 'execute'][idx] === step ? style.primary : style.secondary, color: style.accent }}
                >
                  {s}
                </div>
                {idx < 3 && <ChevronRight style={{ color: style.accent }} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step: Upload */}
        {step === 'upload' && (
          <div className="max-w-4xl mx-auto">
            <div className={`${theme.card} rounded-2xl p-8 border-2`} style={{ borderColor: style.primary }}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Upload style={{ color: style.accent }} /> 上傳文件</h2>
              <div className="border-4 border-dashed rounded-xl p-12 text-center mb-6 transition-colors hover:bg-opacity-50" style={{ borderColor: style.primary, backgroundColor: style.secondary }}>
                <input type="file" onChange={handleFileUpload} accept=".txt,.pdf,.md" className="hidden" id="fileInput" />
                <label htmlFor="fileInput" className="cursor-pointer">
                  <FileText size={64} className="mx-auto mb-4" style={{ color: style.accent }} />
                  <p className="text-lg font-semibold mb-2">點擊或拖放文件</p>
                  <p className="text-sm opacity-75">支援 PDF, TXT, MD</p>
                </label>
              </div>

              {fileName && <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: style.secondary }}><p className="font-semibold">已選擇: {fileName}</p></div>}

              {fileObject && fileObject.type === 'application/pdf' && (
                <div className="space-y-4 mb-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-2">OCR 方法</label>
                      <select value={ocrMethod} onChange={(e) => setOcrMethod(e.target.value)} className="w-full p-3 rounded-lg border-2" style={{ borderColor: style.primary }}>
                        <option value="llm">LLM-based OCR</option>
                        <option value="python">Python Packages OCR</option>
                      </select>
                    </div>
                    {ocrMethod === 'python' && (
                      <div>
                        <label className="block font-semibold mb-2">Python OCR 套件</label>
                        <select value={pythonOcrPackage} onChange={(e) => setPythonOcrPackage(e.target.value)} className="w-full p-3 rounded-lg border-2" style={{ borderColor: style.primary }}>
                          <option value="tesseract">Tesseract</option>
                          <option value="easyocr">EasyOCR</option>
                          <option value="paddleocr">PaddleOCR</option>
                        </select>
                      </div>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-semibold mb-2">OCR 語言</label>
                        <select value={ocrLanguage} onChange={(e) => setOcrLanguage(e.target.value)} className="w-full p-3 rounded-lg border-2" style={{ borderColor: style.primary }}>
                            <option value="english">English</option>
                            <option value="traditional-chinese">繁體中文</option>
                        </select>
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">選擇處理頁面</label>
                        <input type="text" value={selectedPages} onChange={(e) => setSelectedPages(e.target.value)} placeholder="e.g., all, 1-5, 1,3,5" className="w-full p-3 rounded-lg border-2" style={{ borderColor: style.primary }}/>
                    </div>
                  </div>
                </div>
              )}
              
              {fileName && (
                 <button
                    onClick={handleProcessAndPreview}
                    disabled={isProcessingOcr}
                    className="w-full py-4 rounded-xl font-bold text-white text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    style={{ backgroundColor: style.accent }}
                  >
                    {isProcessingOcr ? '正在處理OCR...' : (fileObject?.type === 'application/pdf' ? '處理並預覽文件' : '下一步：預覽文件')}
                  </button>
              )}
            </div>
          </div>
        )}

        {/* Step: Preview */}
        {step === 'preview' && (
          <div className="max-w-6xl mx-auto">
            <div className={`${theme.card} rounded-2xl p-8 border-2`} style={{ borderColor: style.primary }}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Eye style={{ color: style.accent }} /> 文件預覽</h2>
              <div className="mb-6 p-6 rounded-xl border-2 max-h-96 overflow-auto" style={{ backgroundColor: style.secondary, borderColor: style.primary }}>
                <pre className="whitespace-pre-wrap">{document || "沒有可預覽的內容。"}</pre>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep('upload')} className="flex-1 py-3 rounded-xl font-bold border-2 hover:opacity-80" style={{ borderColor: style.accent, color: style.accent }}>返回</button>
                <button onClick={() => setStep('config')} className="flex-1 py-3 rounded-xl font-bold text-white hover:opacity-90" style={{ backgroundColor: style.accent }}>下一步：設定代理</button>
              </div>
            </div>
          </div>
        )}

        {/* Step: Config */}
        {step === 'config' && (
          <div className="max-w-6xl mx-auto">
            <div className={`${theme.card} rounded-2xl p-8 border-2`} style={{ borderColor: style.primary }}>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Settings style={{ color: style.accent }} /> 代理設定</h2>
                <div className="mb-6">
                    <label className="block font-semibold mb-2">要使用的代理數量: {selectedAgentCount}</label>
                    <input type="range" min="1" max={agents.length} value={selectedAgentCount} onChange={(e) => setSelectedAgentCount(parseInt(e.target.value))} className="w-full"/>
                </div>
                <div className="space-y-4 mb-6 max-h-[500px] overflow-auto p-2">
                    {agents.slice(0, selectedAgentCount).map((agent, idx) => (
                        <div key={idx} className="p-6 rounded-xl border-2" style={{ borderColor: style.primary, backgroundColor: style.secondary }}>
                            <h3 className="font-bold text-lg mb-4" style={{ color: style.accent }}>代理 {idx + 1}: {agent.name}</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block font-semibold mb-2">提示詞</label>
                                    <textarea value={agent.prompt} onChange={(e) => updateAgentParam(idx, 'prompt', e.target.value)} className={`w-full p-3 rounded-lg border ${theme.bg}`} rows="3"/>
                                </div>
                                <div>
                                    <label className="block font-semibold mb-2">模型</label>
                                    <select value={agent.model} onChange={(e) => updateAgentParam(idx, 'model', e.target.value)} className={`w-full p-3 rounded-lg border ${theme.bg}`}>
                                        <option value="gpt-4o-mini">GPT-4o Mini</option>
                                        <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-semibold mb-2">溫度: {agent.temperature}</label>
                                    <input type="range" min="0" max="1" step="0.1" value={agent.temperature} onChange={(e) => updateAgentParam(idx, 'temperature', parseFloat(e.target.value))} className="w-full"/>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setStep('preview')} className="flex-1 py-3 rounded-xl font-bold border-2 hover:opacity-80" style={{ borderColor: style.accent, color: style.accent }}>返回</button>
                    <button onClick={() => { setStep('execute'); setCurrentAgentIndex(0); }} className="flex-1 py-3 rounded-xl font-bold text-white hover:opacity-90" style={{ backgroundColor: style.accent }}>開始執行</button>
                </div>
            </div>
          </div>
        )}

        {/* Step: Execute */}
        {step === 'execute' && (
          <div className="max-w-7xl mx-auto">
            <div className={`${theme.card} rounded-2xl p-8 border-2 mb-6`} style={{ borderColor: style.primary }}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Play style={{ color: style.accent }} /> 執行代理 ({currentAgentIndex < selectedAgentCount ? currentAgentIndex + 1 : selectedAgentCount} / {selectedAgentCount})
              </h2>
              {currentAgentIndex < selectedAgentCount && (
                <div className="p-6 rounded-xl mb-6" style={{ backgroundColor: style.secondary, borderLeft: `6px solid ${style.accent}` }}>
                  <h3 className="font-bold text-xl mb-4" style={{ color: style.accent }}>當前代理: {agents[currentAgentIndex].name}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">輸入</h4>
                      <div className="p-4 rounded-lg border h-64 overflow-auto" style={{ backgroundColor: theme.bg }}>
                        <pre className="whitespace-pre-wrap text-sm">{currentAgentIndex === 0 ? document : agentOutputs[currentAgentIndex - 1].output}</pre>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">輸出</h4>
                      <div className="p-4 rounded-lg border h-64 overflow-auto" style={{ backgroundColor: theme.bg }}>
                        {agentOutputs[currentAgentIndex].output ? <pre className="whitespace-pre-wrap text-sm">{agentOutputs[currentAgentIndex].output}</pre> : <p className="text-gray-400 italic">等待執行...</p>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => executeAgent(currentAgentIndex)}
                      disabled={isExecutingAgents || agentOutputs[currentAgentIndex].output}
                      className="flex-1 py-3 rounded-xl font-bold text-white hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{ backgroundColor: style.accent }}
                    >
                      <Play size={20} /> {isExecutingAgents ? '執行中...' : '執行此代理'}
                    </button>
                    {agentOutputs[currentAgentIndex].output && currentAgentIndex < selectedAgentCount - 1 && (
                      <button onClick={() => setCurrentAgentIndex(currentAgentIndex + 1)} className="px-6 py-3 rounded-xl font-bold text-white hover:opacity-90 flex items-center gap-2" style={{ backgroundColor: style.accent }}>
                        下一個 <ChevronRight size={20} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {currentAgentIndex >= selectedAgentCount - 1 && agentOutputs[selectedAgentCount-1]?.output && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-3xl font-bold mb-6" style={{ color: style.accent }}>所有代理執行完成！</h3>
                  <button className="px-8 py-4 rounded-xl font-bold text-white text-lg hover:opacity-90 flex items-center gap-2 mx-auto" style={{ backgroundColor: style.accent }}>
                    <Download size={24} /> 下載結果
                  </button>
                </div>
              )}

              <div className="mt-8">
                <h3 className="font-bold text-xl mb-4">執行歷史</h3>
                <div className="space-y-3">
                  {agents.slice(0, selectedAgentCount).map((agent, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border-2 transition-opacity ${idx <= currentAgentIndex ? 'opacity-100' : 'opacity-50'}`}
                      style={{ borderColor: agentOutputs[idx].output ? style.accent : style.primary, backgroundColor: style.secondary }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${isExecutingAgents && currentAgentIndex === idx ? 'animate-pulse' : ''}`}
                            style={{backgroundColor: agentOutputs[idx].output ? style.accent : 'gray'}}
                          ></div>
                          <p className="font-bold">{agent.name}</p>
                        </div>
                        {agentOutputs[idx].output && <span className="text-xs font-mono">{agentOutputs[idx].time.toFixed(2)}s</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgenticDocProcessor;
