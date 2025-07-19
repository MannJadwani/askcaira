'use client';

import { useState, useRef, useEffect } from 'react';
import GlassCard from '../ui/GlassCard';
import GlassButton from '../ui/GlassButton';

export default function ChatInterface({ file, onBack }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    // Load existing chat messages for this file
    loadChatMessages();
  }, [file]);

  const loadChatMessages = async () => {
    try {
      const response = await fetch(`/api/chat/messages?fileId=${file.id}`);
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.messages || []);
      } else {
        console.error('Error loading chat messages:', data.error);
        // Fallback to welcome message if no chat exists
        setMessages([
          {
            id: '1',
            type: 'assistant',
            content: `Hello! I've loaded your file "${file.name}". I can help you analyze your data, find patterns, answer questions about trends, and provide insights. What would you like to know?`,
            timestamp: new Date()
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading chat messages:', error);
      // Fallback to welcome message
      setMessages([
        {
          id: '1',
          type: 'assistant',
          content: `Hello! I've loaded your file "${file.name}". I can help you analyze your data, find patterns, answer questions about trends, and provide insights. What would you like to know?`,
          timestamp: new Date()
        }
      ]);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    const currentInput = inputValue;
    setInputValue(''); // Clear input immediately
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send message to chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          fileId: file.id
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to get AI response');
      }

      const aiResponse = {
        id: result.chatId || Date.now().toString(),
        type: 'assistant',
        content: result.response,
        timestamp: new Date(),
        hasVisualization: result.hasVisualization,
        visualizationHTML: result.extractedHTML
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    } catch (error) {
      console.error('Chat error:', error);
      
      // Add error message to chat
      const errorResponse = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
      setIsLoading(false);
    }
  };



  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const suggestedQuestions = [
    "What does this data tell us?",
    "Show me a chart of the key trends",
    "What are the most important insights?",
    "Create a visualization of the patterns",
    "What correlations exist in this data?"
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-semibold text-white">{file.name}</h1>
            <p className="text-sm text-gray-400">Chat with your data</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-sm text-gray-400">AI Ready</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-3xl ${message.type === 'user' ? 'ml-12' : 'mr-12'}`}>
              {message.type === 'assistant' && (
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-400">Caira</span>
                </div>
              )}
              
              <GlassCard 
                variant={message.type === 'user' ? 'primary' : 'secondary'}
                className={`p-4 rounded-2xl ${
                  message.type === 'user' 
                    ? 'bg-cyan-500/20 border-cyan-500/30 ml-auto' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <p className="text-white leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                
                {/* Show visualization indicator for assistant messages */}
                {message.type === 'assistant' && message.hasVisualization && message.visualizationHTML && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className="text-cyan-300 text-sm font-medium">📊 Visualization Generated</span>
                    </div>
                    <p className="text-cyan-200 text-xs">A new interactive chart has been created based on your data. Switch to the Visualization tab to see the full interactive chart.</p>
                    
                    {/* Mini preview iframe */}
                    <div className="mt-2 h-48 bg-black/20 rounded border border-white/10 overflow-hidden">
                      <iframe
                        srcDoc={message.visualizationHTML}
                        className="w-full h-full border-0 pointer-events-none"
                        title="Visualization Preview"
                        sandbox="allow-scripts allow-same-origin"
                        style={{ transform: 'scale(0.4)', transformOrigin: 'top left', width: '250%', height: '250%' }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="mt-2 text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </GlassCard>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-3xl mr-12">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-400">Caira</span>
              </div>
              <GlassCard variant="secondary" className="p-4 rounded-2xl bg-white/5 border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-gray-400 text-sm">Analyzing your data with AI...</span>
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInputValue(question)}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-gray-300 hover:text-white transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your data..."
              className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
              rows={1}
              style={{ minHeight: '52px', maxHeight: '120px' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-3 bottom-3 p-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:opacity-50 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
        <div className="mt-2 text-xs text-gray-500">
          Press Enter to send, Shift + Enter for new line
        </div>
      </div>
    </div>
  );
} 