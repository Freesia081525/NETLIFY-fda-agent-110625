import React, { useState, useEffect } from 'react';
import { Upload, FileText, Settings, Play, ChevronRight, Eye, Download, Moon, Sun, Palette, Edit2, X, Sparkles, Flower2 } from 'lucide-react';

// The backend URL will be provided by Netlify's environment variables
const RENDER_API_URL = process.env.REACT_APP_RENDER_API_URL;

const AgenticDocProcessor = () => {
  // All theme and style states remain the same...
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

  // States...
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
    setDocument('');
    if (file.type !== 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (readEvent) => setDocument(readEvent.target.result);
      reader.readAsText(file);
    }
  };

  const handleProcessAndPreview = async () => {
    if (!fileObject) return;
    if (!RENDER_API_URL) {
      alert("Backend API URL is not configured. Please set REACT_APP_RENDER_API_URL in your environment variables.");
      return;
    }

    if (fileObject.type !== 'application/pdf') {
      setStep('preview');
      return;
    }

    setIsProcessingOcr(true);
    
    // Use FormData to send the file and other fields to the backend
    const formData = new FormData();
    formData.append('file', fileObject);
    formData.append('fileName', fileName);
    formData.append('ocrMethod', ocrMethod);
    formData.append('pythonOcrPackage', pythonOcrPackage);
    formData.append('ocrLanguage', ocrLanguage);
    formData.append('selectedPages', selectedPages);

    try {
      const response = await fetch(`${RENDER_API_URL}/api/ocr`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      setDocument(data.ocrText);
      setStep('preview');
    } catch (error) {
      console.error('Error during OCR processing:', error);
      alert(`Failed to process OCR on the backend: ${error.message}`);
    } finally {
      setIsProcessingOcr(false);
    }
  };

  const executeAgent = async (index) => {
    if (!RENDER_API_URL) {
      alert("Backend API URL is not configured. Please set REACT_APP_RENDER_API_URL in your environment variables.");
      return;
    }
    setIsExecutingAgents(true);
    const agent = agents[index];
    const prevOutput = index === 0 ? document : agentOutputs[index - 1].output;
    
    const startTime = Date.now();
    try {
        const response = await fetch(`${RENDER_API_URL}/api/agent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ agent: agent, inputText: prevOutput }),
        });
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        const endTime = Date.now();

        const newOutputs = [...agentOutputs];
        newOutputs[index] = { input: prevOutput, output: data.output, time: (endTime - startTime) / 1000 };
        setAgentOutputs(newOutputs);
        
        if (index < selectedAgentCount - 1) {
            setCurrentAgentIndex(index + 1);
        }

    } catch(error) {
        console.error('Error during agent execution:', error);
        alert(`Failed to execute agent on the backend: ${error.message}`);
    } finally {
        setIsExecutingAgents(false);
    }
  };

  const handleDocumentChange = (e) => {
    setDocument(e.target.value);
  };
  
  const updateAgentParam = (index, field, value) => {
    const newAgents = [...agents];
    newAgents[index][field] = value;
    setAgents(newAgents);
  };

  // The entire JSX return statement remains the same as your last version.
  // It will now use the new `handleProcessAndPreview` and `executeAgent` functions.
  return (
    // ... PASTE THE ENTIRE `return (...)` BLOCK FROM YOUR PREVIOUS CODE HERE ...
    // It is identical and does not need to be changed.
    <div className={`min-h-screen ${theme.bg} ${theme.text} transition-colors duration-300`}>
      {/* Header and Style Picker... */}
      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps... */}
        
        {/* Step: Upload */}
        {step === 'upload' && (
          // ... Paste the "upload" step JSX here
        )}

        {/* Step: Preview (now with the editable textarea) */}
        {step === 'preview' && (
          <div className="max-w-6xl mx-auto">
            <div className={`${theme.card} rounded-2xl p-8 border-2`} style={{ borderColor: style.primary }}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Eye style={{ color: style.accent }} /> 文件預覽</h2>
              <label className="block font-semibold mb-2">可編輯的OCR預覽結果</label>
              <div className="mb-6">
                <textarea
                  value={document}
                  onChange={handleDocumentChange}
                  className={`w-full p-4 rounded-xl border-2 h-96 font-mono text-sm resize-none ${theme.bg}`}
                  style={{ borderColor: style.primary }}
                  placeholder="沒有可預覽的內容。在此處編輯文本..."
                />
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep('upload')} className="flex-1 py-3 rounded-xl font-bold border-2 hover:opacity-80" style={{ borderColor: style.accent, color: style.accent }}>返回</button>
                <button onClick={() => setStep('config')} className="flex-1 py-3 rounded-xl font-bold text-white hover:opacity-90" style={{ backgroundColor: style.accent }}>下一步：設定代理</button>
              </div>
            </div>
          </div>
        )}

        {/* Step: Config... */}
        {/* Step: Execute... */}
      </div>
    </div>
  );
};

export default AgenticDocProcessor;
