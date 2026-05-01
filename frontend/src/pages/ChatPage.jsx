import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { aiResponses } from '../data/mockData.js';
import ChatMessage from '../components/ChatMessage.jsx';
import Recommendations from '../components/Recommendations.jsx';
import TypingIndicator from '../components/TypingIndicator.jsx';
import Welcome from '../components/Welcome.jsx';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatAreaRef = useRef(null);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  function handleSubmit(event) {
    event.preventDefault();
    const text = input.trim();
    if (!text || isTyping) return;

    setMessages((current) => [...current, { role: 'user', text }]);
    setInput('');
    setIsTyping(true);

    window.setTimeout(() => {
      const response = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      setMessages((current) => [...current, { role: 'assistant', text: response }]);
      setIsTyping(false);
    }, 1200);
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto chat-scroll p-6 space-y-4" ref={chatAreaRef}>
        <div className="max-w-2xl mx-auto space-y-4">
          <Welcome />
          <div className="space-y-4">
            {messages.map((message, index) => (
              <ChatMessage key={`${message.role}-${index}`} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
          </div>
        </div>
      </div>
      <div className="shrink-0 border-t border-slate-800 bg-slate-900 p-4">
        <form className="max-w-2xl mx-auto flex items-center gap-3" onSubmit={handleSubmit}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            type="text"
            placeholder="메시지를 입력하세요..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder-slate-500"
          />
          <button type="submit" className="p-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl transition" aria-label="전송">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
      <Recommendations />
    </>
  );
}
