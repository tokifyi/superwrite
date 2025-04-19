import { useState } from 'react';
import Sidebar from './Sidebar';
import Editor from './Editor';
import './App.css';

const App = () => {
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  
  const toggleAiChat = () => {
    setIsAiChatOpen(!isAiChatOpen);
  };
  
  return (
    <div className="app-container">
      <Sidebar isAiChatOpen={isAiChatOpen} toggleAiChat={toggleAiChat} />
      <div className={`editor-container ${isAiChatOpen ? 'with-ai-chat' : ''}`}>
        <Editor />
      </div>
    </div>
  );
};

export default App; 