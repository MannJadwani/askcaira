import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import GlassCard from './GlassCard';
import GlassButton from './GlassButton';

/**
 * LandingHero Component
 * Sophisticated landing page with glassmorphic design matching the reference aesthetic
 */
export default function LandingHero() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 px-4 py-16">
        <div className="max-w-7xl mx-auto text-center">
          {/* Hero Content */}
          <div className="mb-16">
                         <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tight">
               AI-Powered Data
               <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600">
                 Intelligence Suite
               </span>
             </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your spreadsheets into intelligent conversations. 
              Upload CSV and Excel files, visualize data instantly, and chat with your data using advanced AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <SignedOut>
                <SignUpButton mode="redirect" redirectUrl="/home">
                  <GlassButton variant="primary" className="px-10 py-4 text-lg font-semibold">
                    Get Started Free
                  </GlassButton>
                </SignUpButton>
                <SignInButton mode="redirect" redirectUrl="/home">
                  <GlassButton variant="secondary" className="px-10 py-4 text-lg">
                    Sign In
                  </GlassButton>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/home">
                  <GlassButton variant="primary" className="px-10 py-4 text-lg font-semibold">
                    Go to Dashboard
                  </GlassButton>
                </Link>
              </SignedIn>
            </div>
          </div>

          {/* Dashboard Preview Mockup */}
                     <div className="relative max-w-6xl mx-auto mb-24">
             <GlassCard className="p-8 backdrop-blur-2xl bg-white/3 border-white/20 rounded-lg">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6 px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-400">Ask Caira Dashboard</div>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                  </div>
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-purple-400 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Dashboard Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart Area */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Top Stats */}
                                     <div className="grid grid-cols-3 gap-4">
                     <GlassCard variant="secondary" className="p-4 text-center rounded-md">
                       <div className="text-2xl font-bold text-cyan-400 mb-1">12.4K</div>
                       <div className="text-xs text-gray-400">Data Points</div>
                     </GlassCard>
                     <GlassCard variant="secondary" className="p-4 text-center rounded-md">
                       <div className="text-2xl font-bold text-blue-400 mb-1">89%</div>
                       <div className="text-xs text-gray-400">Accuracy</div>
                     </GlassCard>
                     <GlassCard variant="secondary" className="p-4 text-center rounded-md">
                       <div className="text-2xl font-bold text-emerald-400 mb-1">24.7s</div>
                       <div className="text-xs text-gray-400">Avg Response</div>
                     </GlassCard>
                   </div>

                   {/* Main Chart */}
                   <GlassCard variant="secondary" className="p-6 h-64 rounded-md">
                     <div className="flex items-center justify-between mb-4">
                       <h3 className="text-white font-semibold">Data Analytics</h3>
                       <div className="flex space-x-2">
                         <div className="w-3 h-3 bg-cyan-400 rounded-sm"></div>
                         <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
                         <div className="w-3 h-3 bg-emerald-400 rounded-sm"></div>
                       </div>
                     </div>
                     {/* Simulated Chart */}
                     <div className="relative h-full bg-black/20 rounded border border-white/10">
                       <svg className="w-full h-full" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid meet">
                         {/* Grid Lines */}
                         <defs>
                           <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                             <path d="M 40 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
                           </pattern>
                         </defs>
                         <rect width="100%" height="100%" fill="url(#grid)" />
                         
                         {/* Chart Lines with proper paths */}
                         <path 
                           d="M 20 160 L 80 140 L 140 120 L 200 100 L 260 80 L 320 60 L 380 40" 
                           stroke="#00d4ff" 
                           strokeWidth="2" 
                           fill="none"
                           style={{ filter: 'drop-shadow(0 0 4px rgba(0,212,255,0.6))' }}
                         />
                         <path 
                           d="M 20 150 L 80 130 L 140 135 L 200 125 L 260 110 L 320 95 L 380 85" 
                           stroke="#3b82f6" 
                           strokeWidth="2" 
                           fill="none"
                           style={{ filter: 'drop-shadow(0 0 4px rgba(59,130,246,0.6))' }}
                         />
                         <path 
                           d="M 20 140 L 80 120 L 140 110 L 200 90 L 260 70 L 320 50 L 380 30" 
                           stroke="#10b981" 
                           strokeWidth="2" 
                           fill="none"
                           style={{ filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.6))' }}
                         />
                         
                         {/* Data points */}
                         <circle cx="380" cy="40" r="3" fill="#00d4ff" className="animate-pulse" />
                         <circle cx="380" cy="85" r="3" fill="#3b82f6" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                         <circle cx="380" cy="30" r="3" fill="#10b981" className="animate-pulse" style={{ animationDelay: '1s' }} />
                       </svg>
                     </div>
                   </GlassCard>

                   {/* Additional Charts Row */}
                   <div className="grid grid-cols-2 gap-4">
                     {/* Bar Chart */}
                     <GlassCard variant="secondary" className="p-4 rounded-md">
                       <div className="flex items-center justify-between mb-3">
                         <h4 className="text-white text-sm font-semibold">Revenue by Quarter</h4>
                         <div className="w-2 h-2 bg-cyan-400 rounded-sm"></div>
                       </div>
                       <div className="h-20 flex items-end justify-between space-x-1">
                         <div className="w-8 bg-gradient-to-t from-cyan-500/60 to-cyan-400/80 rounded-sm" style={{ height: '45%' }}></div>
                         <div className="w-8 bg-gradient-to-t from-cyan-500/60 to-cyan-400/80 rounded-sm" style={{ height: '70%' }}></div>
                         <div className="w-8 bg-gradient-to-t from-cyan-500/60 to-cyan-400/80 rounded-sm" style={{ height: '85%' }}></div>
                         <div className="w-8 bg-gradient-to-t from-cyan-500/60 to-cyan-400/80 rounded-sm" style={{ height: '60%' }}></div>
                       </div>
                       <div className="flex justify-between text-xs text-gray-500 mt-2">
                         <span>Q1</span>
                         <span>Q2</span>
                         <span>Q3</span>
                         <span>Q4</span>
                       </div>
                     </GlassCard>

                     {/* Pie Chart */}
                     <GlassCard variant="secondary" className="p-4 rounded-md h-full">
                       <div className="flex items-center justify-between mb-3">
                         <h4 className="text-white text-sm font-semibold">Data Sources</h4>
                         <div className="flex space-x-1">
                           <div className="w-2 h-2 bg-cyan-400 rounded-sm"></div>
                           <div className="w-2 h-2 bg-blue-400 rounded-sm"></div>
                           <div className="w-2 h-2 bg-emerald-400 rounded-sm"></div>
                         </div>
                       </div>
                       <div className="flex items-center justify-center h-20">
                         <div className="relative w-16 h-16">
                           <svg className="w-16 h-16 transform -rotate-90">
                             <circle cx="32" cy="32" r="28" fill="none" stroke="#00d4ff" strokeWidth="8" 
                               strokeDasharray="50 100" opacity="0.8" />
                             <circle cx="32" cy="32" r="28" fill="none" stroke="#3b82f6" strokeWidth="8" 
                               strokeDasharray="30 100" strokeDashoffset="-50" opacity="0.8" />
                             <circle cx="32" cy="32" r="28" fill="none" stroke="#10b981" strokeWidth="8" 
                               strokeDasharray="20 100" strokeDashoffset="-80" opacity="0.8" />
                           </svg>
                         </div>
                       </div>
                       <div className="text-xs text-gray-400 text-center">
                         CSV 50% • Excel 30% • JSON 20%
                       </div>
                     </GlassCard>
                   </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                   {/* AI Chat Preview */}
                   <GlassCard variant="secondary" className="p-4 rounded-md">
                     <h3 className="text-white font-semibold mb-3 flex items-center">
                       <div className="w-2 h-2 bg-emerald-400 rounded-sm mr-2 animate-pulse"></div>
                       AI Assistant
                     </h3>
                     <div className="space-y-3 text-xs">
                       <div className="bg-cyan-500/20 rounded-md p-3 ml-4 border border-cyan-500/30">
                         <div className="text-cyan-300">"What's the average monthly growth?"</div>
                       </div>
                       <div className="bg-white/10 rounded-md p-3 mr-4 border border-white/20">
                         <div className="text-gray-300">Based on your data, the average monthly growth is 15.7% with a peak in Q3.</div>
                       </div>
                       <div className="bg-cyan-500/20 rounded-md p-3 ml-4 border border-cyan-500/30">
                         <div className="text-cyan-300">"Show me trends by region"</div>
                       </div>
                       <div className="bg-white/10 rounded-md p-3 mr-4 border border-white/20">
                         <div className="text-gray-300">Here's a breakdown: North leads with 34%, followed by West at 28%...</div>
                       </div>
                     </div>
                   </GlassCard>

                   {/* Mini Analytics Cards */}
                   <div className="grid grid-cols-2 gap-3">
                     <GlassCard variant="secondary" className="p-3 rounded-md">
                       <div className="text-center">
                         <div className="text-lg font-bold text-emerald-400">+24%</div>
                         <div className="text-xs text-gray-400">Growth</div>
                         <div className="flex justify-center mt-2">
                           <svg className="w-12 h-6" viewBox="0 0 48 24">
                             <path d="M2 20 L8 16 L14 18 L20 12 L26 14 L32 8 L38 10 L44 4" 
                               stroke="#10b981" strokeWidth="1.5" fill="none" opacity="0.8" />
                           </svg>
                         </div>
                       </div>
                     </GlassCard>
                     <GlassCard variant="secondary" className="p-3 rounded-md">
                       <div className="text-center">
                         <div className="text-lg font-bold text-blue-400">8.2K</div>
                         <div className="text-xs text-gray-400">Active</div>
                         <div className="flex justify-center mt-2">
                           <svg className="w-12 h-6" viewBox="0 0 48 24">
                             <path d="M2 18 L8 15 L14 17 L20 14 L26 12 L32 9 L38 11 L44 8" 
                               stroke="#3b82f6" strokeWidth="1.5" fill="none" opacity="0.8" />
                           </svg>
                         </div>
                       </div>
                     </GlassCard>
                   </div>

                                     {/* Progress Ring */}
                   <GlassCard variant="secondary" className="p-6 text-center rounded-md">
                     <div className="relative w-24 h-24 mx-auto mb-3">
                       <svg className="w-24 h-24 transform -rotate-90">
                         <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
                         <circle 
                           cx="48" cy="48" r="40" 
                           stroke="url(#progressGradient)" 
                           strokeWidth="6" 
                           fill="none"
                           strokeDasharray={`${2 * Math.PI * 40}`}
                           strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.73)}`}
                           style={{ filter: 'drop-shadow(0 0 8px rgba(0,212,255,0.6))' }}
                         />
                         <defs>
                           <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                             <stop offset="0%" stopColor="#00d4ff" />
                             <stop offset="100%" stopColor="#3b82f6" />
                           </linearGradient>
                         </defs>
                       </svg>
                       <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-2xl font-bold text-white">73%</span>
                       </div>
                     </div>
                     <div className="text-gray-400 text-sm">Processing Complete</div>
                   </GlassCard>

                                 
               
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
                         <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
               Fully Packed with
               <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                 Amazing Features
               </span>
             </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to transform your data into actionable insights through intelligent conversation and stunning visualizations.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         {/* Upload & Processing */}
             <GlassCard className="p-8 hover:scale-105 transition-transform duration-300 rounded-lg" hover>
               <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center mb-6 glow-blue">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Smart Upload</h3>
              <p className="text-gray-400 leading-relaxed">
                Drag and drop CSV or Excel files for instant processing. Our AI automatically detects data types and suggests the best visualization formats.
              </p>
            </GlassCard>

                         {/* Data Visualization */}
             <GlassCard className="p-8 hover:scale-105 transition-transform duration-300 rounded-lg" hover>
               <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-6 glow-blue">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Interactive Charts</h3>
              <p className="text-gray-400 leading-relaxed">
                Create stunning, interactive visualizations with our advanced charting library. From simple bar charts to complex multi-dimensional plots.
              </p>
            </GlassCard>

                         {/* AI Chat */}
             <GlassCard className="p-8 hover:scale-105 transition-transform duration-300 rounded-lg" hover>
               <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center mb-6 glow-green">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI Conversations</h3>
              <p className="text-gray-400 leading-relaxed">
                Ask natural language questions about your data. Our AI understands context and provides detailed insights, trends, and recommendations.
              </p>
            </GlassCard>

                         {/* Real-time Analytics */}
             <GlassCard className="p-8 hover:scale-105 transition-transform duration-300 rounded-lg" hover>
               <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Real-time Insights</h3>
              <p className="text-gray-400 leading-relaxed">
                Get instant analytics as you explore your data. Dynamic filtering, sorting, and aggregation provide immediate feedback on your queries.
              </p>
            </GlassCard>

                         {/* Export & Share */}
             <GlassCard className="p-8 hover:scale-105 transition-transform duration-300 rounded-lg" hover>
               <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Export & Share</h3>
              <p className="text-gray-400 leading-relaxed">
                Export your visualizations and insights in multiple formats. Share interactive dashboards with your team or embed them in presentations.
              </p>
            </GlassCard>

                         {/* Security */}
             <GlassCard className="p-8 hover:scale-105 transition-transform duration-300 rounded-lg" hover>
               <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Enterprise Security</h3>
              <p className="text-gray-400 leading-relaxed">
                Your data is protected with enterprise-grade security. End-to-end encryption, secure processing, and privacy-first architecture.
              </p>
            </GlassCard>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-20">
            <div className="max-w-3xl mx-auto">
                             <GlassCard className="p-12 rounded-lg">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Ready to Transform Your Data?
                </h3>
                <p className="text-xl text-gray-300 mb-8">
                  Join thousands of professionals who are already using Ask Caira to unlock the power of their data.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <SignedOut>
                    <SignUpButton mode="redirect" redirectUrl="/home">
                      <GlassButton variant="primary" className="px-10 py-4 text-lg font-semibold">
                        Start Free Trial
                      </GlassButton>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <Link href="/home">
                      <GlassButton variant="primary" className="px-10 py-4 text-lg font-semibold">
                        Go to Dashboard
                      </GlassButton>
                    </Link>
                  </SignedIn>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  No credit card required • Free forever plan • Enterprise ready
                </p>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 