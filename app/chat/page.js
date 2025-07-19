'use client';

import { useState, useRef, useEffect } from 'react';
import GlassCard from '../../components/ui/GlassCard';
import GlassButton from '../../components/ui/GlassButton';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function GeneralChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Add welcome message
    setMessages([
      {
        id: '1',
        type: 'assistant',
        content: `Hello! I'm Caira, your AI assistant. I can help you with a wide range of questions, provide insights, explain concepts, or just have a conversation. You can also upload a CSV file to analyze your data. What would you like to talk about?`,
        timestamp: new Date()
      }
    ]);
  }, []);

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

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send message to chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          fileId: uploadedFile?.id,
          chatHistory: messages.map(msg => ({
            type: msg.type,
            content: msg.content
          })),
          mode: uploadedFile ? 'chat' : 'general'
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
        timestamp: new Date()
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

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert('Please upload a CSV or Excel file.');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mode', 'chat');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setUploadedFile(result.file);
      
      // Add file upload message to chat
      const fileMessage = {
        id: Date.now().toString(),
        type: 'system',
        content: `📎 File uploaded: ${file.name}\n📊 ${result.file.rowCount} rows, ${result.file.columnCount} columns`,
        timestamp: new Date()
      };

      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Great! I've successfully loaded your file "${file.name}". I can now help you analyze this data, answer questions about it, and provide insights. The file contains ${result.file.rowCount} rows and ${result.file.columnCount} columns.\n\nWhat would you like to know about your data?`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, fileMessage, aiResponse]);
      setIsUploading(false);
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message || 'Upload failed. Please try again.');
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        type: 'assistant',
        content: uploadedFile 
          ? `Hello! I have your file "${uploadedFile.name}" loaded with ${uploadedFile.rowCount} rows and ${uploadedFile.columnCount} columns. What would you like to analyze?`
          : `Hello! I'm Caira, your AI assistant. I can help you with a wide range of questions, provide insights, explain concepts, or just have a conversation. You can also upload a CSV file to analyze your data. What would you like to talk about?`,
        timestamp: new Date()
      }
    ]);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setMessages([
      {
        id: '1',
        type: 'assistant',
        content: `Hello! I'm Caira, your AI assistant. I can help you with a wide range of questions, provide insights, explain concepts, or just have a conversation. You can also upload a CSV file to analyze your data. What would you like to talk about?`,
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex flex-col">
      {/* Header */}
      <header className="glass-primary backdrop-blur-xl bg-black/50 border-b border-white/10 p-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/home" className="text-gray-300 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center glow-blue">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-white">
                Chat with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Caira
                </span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <GlassButton 
              onClick={clearChat} 
              className="px-3 py-2 text-sm"
              disabled={isUploading}
            >
              Clear Chat
            </GlassButton>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-4xl mx-auto p-6">
          <GlassCard className="h-full flex flex-col p-0">
            {/* File Upload Area */}
            {uploadedFile && (
              <div className="p-4 border-b border-white/10 bg-emerald-500/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-medium">{uploadedFile.name}</h4>
                      <p className="text-emerald-400 text-xs">{uploadedFile.rowCount} rows • {uploadedFile.columnCount} columns</p>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-1 rounded hover:bg-white/10 transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : message.type === 'system' ? 'justify-center' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                        : message.type === 'system'
                        ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-sm'
                        : 'glass-secondary text-gray-100'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div
                      className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-cyan-100' : message.type === 'system' ? 'text-yellow-300' : 'text-gray-400'
                      }`}
                    >
                      {formatTimestamp(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="glass-secondary text-gray-100 rounded-lg p-4 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-400">Caira is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-white/10">
              {isUploading && (
                <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-cyan-300 text-sm">Uploading and processing file...</span>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="flex space-x-4">
                <div className="flex-1">
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={uploadedFile ? "Ask me about your data..." : "Ask me anything or upload a CSV file..."}
                    className="w-full glass-input text-white placeholder-gray-400 resize-none"
                    rows="1"
                    disabled={isLoading || isUploading}
                  />
                </div>
                
                {/* File Upload Button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <GlassButton
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || isUploading}
                  className="px-4 py-2 glass-secondary text-gray-300 hover:text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Upload CSV file"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </GlassButton>
                
                <GlassButton
                  type="submit"
                  disabled={!inputValue.trim() || isLoading || isUploading}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </GlassButton>
              </form>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
} 