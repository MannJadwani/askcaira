'use client';

import { useState, useEffect } from 'react';
import FileSidebar from '../../components/home/FileSidebar';
import UploadPanel from '../../components/home/UploadPanel';
import ChatInterface from '../../components/home/ChatInterface';
import VisualizationPanel from '../../components/home/VisualizationPanel';

export default function HomePage() {
  const [files, setFiles] = useState([]);
  const [currentMode, setCurrentMode] = useState('upload'); // 'upload', 'chat', 'visualize'
  const [currentFile, setCurrentFile] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Load user files on component mount
  useEffect(() => {
    loadUserFiles();
  }, []);

  const loadUserFiles = async () => {
    try {
      const response = await fetch('/api/files');
      const data = await response.json();
      
      if (data.success) {
        setFiles(data.files || []);
      } else {
        console.error('Error loading files:', data.error);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const handleFileUpload = async (fileData, mode) => {
    // Handle successful file upload
    setCurrentMode(mode);
    setCurrentFile(fileData);
    
    // Refresh the files list to include the new file
    await loadUserFiles();
    
    // Show success notification
    if (mode === 'visualize') {
      // Could add a toast notification here in the future
      console.log(`✅ Visualization ready for ${fileData.name}`);
    }
  };

  const handleFileSelect = (file) => {
    setCurrentFile(file);
    setCurrentMode('chat'); // Default to chat when selecting existing file
  };

  const handleBackToUpload = () => {
    setCurrentMode('upload');
    setCurrentFile(null);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      {/* Sidebar */}
      <FileSidebar 
        files={files}
        currentFile={currentFile}
        onFileSelect={handleFileSelect}
        onNewChat={handleBackToUpload}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-80'}`}>
        {currentMode === 'upload' && (
          <UploadPanel onFileUpload={handleFileUpload} />
        )}
        
        {currentMode === 'chat' && currentFile && (
          <ChatInterface 
            file={currentFile}
            onBack={handleBackToUpload}
          />
        )}
        
        {currentMode === 'visualize' && currentFile && (
          <VisualizationPanel 
            file={currentFile}
            onBack={handleBackToUpload}
          />
        )}
      </div>
    </div>
  );
} 