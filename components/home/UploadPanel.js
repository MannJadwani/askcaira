'use client';

import { useState, useRef } from 'react';
import GlassCard from '../ui/GlassCard';
import GlassButton from '../ui/GlassButton';

export default function UploadPanel({ onFileUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [processingSteps] = useState([
    'Parsing file data...',
    'Uploading to Gemini AI...',
    'Analyzing data for chart recommendations...',
    'Generating interactive visualizations...',
    'Saving results...'
  ]);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file) => {
    // Validate file type
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    const isValidType = validTypes.includes(file.type) || 
                       file.name.endsWith('.csv') || 
                       file.name.endsWith('.xlsx') || 
                       file.name.endsWith('.xls');

    if (!isValidType) {
      alert('Please upload a CSV or Excel file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    // Automatically start processing after file selection
    setTimeout(() => {
      handleFileProcessing();
    }, 500); // Small delay for better UX
  };

  const handleFileProcessing = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    setCurrentStep(0);
    
    try {
      // Simulate progress steps for better UX
      const progressInterval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < processingSteps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 2000); // Update every 2 seconds

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('mode', 'visualize'); // Default to visualize mode

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      // Ensure we show the final step
      setCurrentStep(processingSteps.length - 1);
      
      // Brief delay to show completion
      setTimeout(() => {
        // Call the parent callback with the uploaded file data
        onFileUpload(result.file, 'visualize');
      }, 1000);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message || 'Upload failed. Please try again.');
      setIsProcessing(false);
      setCurrentStep(0);
      setSelectedFile(null);
    }
  };

  const resetFile = () => {
    setSelectedFile(null);
    setIsProcessing(false);
    setCurrentStep(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            What can I help you analyze today?
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Upload your data files and I'll help you explore, visualize, and understand your data through conversation.
          </p>
        </div>

        {!selectedFile ? (
          /* Upload Area */
          <GlassCard className="p-12 text-center rounded-2xl">
            <div
              className={`border-2 border-dashed rounded-xl p-12 transition-all duration-300 ${
                dragActive
                  ? 'border-cyan-400 bg-cyan-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-6">
                {/* Upload Icon */}
                <div className="flex justify-center">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-colors ${
                    dragActive ? 'bg-cyan-500/20' : 'bg-gray-500/20'
                  }`}>
                    <svg className={`w-10 h-10 transition-colors ${
                      dragActive ? 'text-cyan-400' : 'text-gray-400'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                </div>

                {/* Upload Text */}
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {dragActive ? 'Drop your file here' : 'Upload your data file'}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Drag and drop your CSV or Excel file, or click to browse
                  </p>
                </div>

                {/* Upload Button */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <GlassButton
                    variant="primary"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-4 text-lg font-semibold"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 4v16m8-8H4" />
                    </svg>
                    Choose File
                  </GlassButton>
                </div>

                {/* Supported Formats */}
                <div className="pt-6 border-t border-gray-700">
                  <p className="text-sm text-gray-500 mb-4">Supported formats:</p>
                  <div className="flex justify-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-emerald-500/20 rounded flex items-center justify-center">
                        <span className="text-xs font-mono text-emerald-400">CSV</span>
                      </div>
                      <span className="text-sm text-gray-400">CSV Files</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center">
                        <span className="text-xs font-mono text-blue-400">XLS</span>
                      </div>
                      <span className="text-sm text-gray-400">Excel Files</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        ) : (
          /* File Selected - Processing */
          <GlassCard className="p-8 rounded-2xl">
            <div className="text-center space-y-8">
              {/* File Info */}
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold">{selectedFile.name}</h3>
                  <p className="text-sm text-gray-400">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                {!isProcessing && (
                  <button
                    onClick={resetFile}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Processing Progress */}
              {isProcessing ? (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">
                    Creating your data visualization...
                  </h2>
                  
                  {/* Progress Steps */}
                  <div className="max-w-md mx-auto space-y-4">
                    {processingSteps.map((step, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          index < currentStep ? 'bg-emerald-500 text-white' :
                          index === currentStep ? 'bg-cyan-500 text-white animate-pulse' :
                          'bg-gray-700 text-gray-400'
                        }`}>
                          {index < currentStep ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : index === currentStep ? (
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <span className="text-xs font-semibold">{index + 1}</span>
                          )}
                        </div>
                        <span className={`text-sm transition-colors ${
                          index <= currentStep ? 'text-white' : 'text-gray-500'
                        }`}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Overall Progress Bar */}
                  <div className="max-w-md mx-auto">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${((currentStep + 1) / processingSteps.length) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Step {currentStep + 1} of {processingSteps.length}
                    </p>
                  </div>
                </div>
              ) : (
                /* Ready to Process */
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">
                    Ready to analyze your data!
                  </h2>
                  <GlassButton
                    variant="primary"
                    onClick={handleFileProcessing}
                    className="px-8 py-4 text-lg font-semibold"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Start Analysis
                  </GlassButton>
                </div>
              )}
            </div>
          </GlassCard>
        )}

        {/* Example Prompts */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-white mb-4">
            Or try these example questions:
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "What trends do you see in my data?",
              "Show me a summary of key metrics",
              "Which columns have the highest correlation?",
              "Find outliers in my dataset"
            ].map((prompt, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-gray-300 hover:text-white transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 