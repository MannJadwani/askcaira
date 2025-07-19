'use client';

import { useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import GlassCard from '../ui/GlassCard';
import GlassButton from '../ui/GlassButton';

export default function FileSidebar({ 
  files, 
  currentFile, 
  onFileSelect, 
  onNewChat, 
  collapsed, 
  onToggleCollapse 
}) {
  const [hoveredFile, setHoveredFile] = useState(null);

  const formatDate = (date) => {
    if (!date) return '';
    const now = new Date();
    const fileDate = new Date(date);
    const diffMs = now - fileDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return fileDate.toLocaleDateString();
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-black/50 backdrop-blur-xl border-r border-white/10 transition-all duration-300 z-40 ${
      collapsed ? 'w-16' : 'w-80'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <h2 className="text-white font-semibold text-lg">Ask Caira</h2>
            )}
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d={collapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
              </svg>
            </button>
          </div>
          
          {!collapsed && (
            <div className="mt-4">
              <GlassButton 
                variant="primary" 
                onClick={onNewChat}
                className="w-full py-3 text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Analysis
              </GlassButton>
            </div>
          )}
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto p-2">
          {collapsed ? (
            // Collapsed view - just icons
            <div className="space-y-2">
              {files.slice(0, 10).map((file) => (
                <button
                  key={file.id}
                  onClick={() => onFileSelect(file)}
                  className={`w-full p-3 rounded-lg transition-all ${
                    currentFile?.id === file.id 
                      ? 'bg-cyan-500/20 border border-cyan-500/30' 
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                  title={file.name}
                >
                  <svg className="w-5 h-5 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
              ))}
            </div>
          ) : (
            // Expanded view - full file cards
            <div className="space-y-2">
              {files.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 text-sm">No files uploaded yet</p>
                </div>
              ) : (
                files.map((file) => (
                  <div
                    key={file.id}
                    className={`relative group cursor-pointer transition-all ${
                      currentFile?.id === file.id ? 'ring-1 ring-cyan-500/50' : ''
                    }`}
                    onMouseEnter={() => setHoveredFile(file.id)}
                    onMouseLeave={() => setHoveredFile(null)}
                    onClick={() => onFileSelect(file)}
                  >
                    <GlassCard 
                      variant="secondary" 
                      className={`p-3 rounded-lg transition-all ${
                        currentFile?.id === file.id 
                          ? 'bg-cyan-500/20 border-cyan-500/30' 
                          : 'hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {/* File Icon */}
                        <div className={`flex-shrink-0 p-2 rounded-lg ${
                          file.name.endsWith('.csv') 
                            ? 'bg-emerald-500/20' 
                            : file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
                            ? 'bg-blue-500/20'
                            : 'bg-gray-500/20'
                        }`}>
                          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-sm font-medium truncate">
                            {file.name}
                          </h4>
                          <p className="text-gray-400 text-xs mt-1">
                            {formatDate(file.uploadDate)}
                          </p>
                          
                          {/* Status indicator */}
                          <div className="flex items-center mt-2">
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              file.status === 'ready' ? 'bg-emerald-400' :
                              file.status === 'processing' ? 'bg-yellow-400 animate-pulse' :
                              'bg-red-400'
                            }`} />
                            <span className="text-xs text-gray-500 capitalize">
                              {file.status || 'ready'}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        {hoveredFile === file.id && (
                          <div className="flex-shrink-0">
                            <button className="p-1 rounded hover:bg-white/10 transition-colors">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </GlassCard>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer - User Controls */}
        <div className="border-t border-white/10">
          {!collapsed ? (
            /* Expanded Footer */
            <div className="p-4 space-y-4">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center space-x-2 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-xs text-gray-300 hover:text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM19 6V5a2 2 0 00-2-2H7a2 2 0 00-2 2v1m14 0v4a2 2 0 01-2 2H5a2 2 0 01-2-2V6m14 0H5" />
                  </svg>
                  <span>Alerts</span>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                </button>
                <button className="flex items-center justify-center space-x-2 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-xs text-gray-300 hover:text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Help</span>
                </button>
              </div>

              {/* AI Status */}
              <div className="flex items-center justify-center space-x-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-300 text-sm font-medium">AI Ready</span>
              </div>

              {/* User Profile Section */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8 ring-2 ring-cyan-500/30",
                        userButtonPopoverCard: "glass-primary border-white/10 backdrop-blur-xl bg-black/80",
                        userButtonPopoverActionButton: "text-white hover:bg-white/10 transition-colors",
                        userButtonPopoverActionButtonText: "text-white",
                        userButtonPopoverFooter: "hidden",
                        userButtonPopoverActionButtonIcon: "text-gray-400"
                      }
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">Account</p>
                    <p className="text-xs text-gray-400">Settings & Profile</p>
                  </div>
                </div>
                <button className="p-1 rounded hover:bg-white/10 transition-colors">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>

              {/* File Count */}
              <div className="text-xs text-gray-500 text-center">
                {files.length} file{files.length !== 1 ? 's' : ''} uploaded
              </div>
            </div>
          ) : (
            /* Collapsed Footer */
            <div className="p-3 space-y-3">
              {/* Notifications */}
              <button className="w-full p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors relative">
                <svg className="w-5 h-5 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM19 6V5a2 2 0 00-2-2H7a2 2 0 00-2 2v1m14 0v4a2 2 0 01-2 2H5a2 2 0 01-2-2V6m14 0H5" />
                </svg>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full" />
              </button>

              {/* AI Status */}
              <div className="w-full p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mx-auto" />
              </div>

              {/* User Profile */}
              <div className="flex justify-center">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 ring-2 ring-cyan-500/30",
                      userButtonPopoverCard: "glass-primary border-white/10 backdrop-blur-xl bg-black/80",
                      userButtonPopoverActionButton: "text-white hover:bg-white/10 transition-colors",
                      userButtonPopoverActionButtonText: "text-white",
                      userButtonPopoverFooter: "hidden",
                      userButtonPopoverActionButtonIcon: "text-gray-400"
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 