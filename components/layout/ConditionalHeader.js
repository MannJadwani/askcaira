'use client';

import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Only show header on landing page (/) 
  if (pathname !== '/') {
    return null;
  }

  return (
    <header className="glass-primary sticky top-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/10">
      <div className="flex justify-between items-center px-6 py-4">
        {/* Left section - Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center glow-blue">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">
            Ask{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Caira
            </span>
          </h1>
        </div>

        {/* Center section - Navigation links */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
            Features
          </a>
          <a href="#pricing" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
            Pricing
          </a>
          <a href="#about" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
            About
          </a>
        </nav>

        {/* Right section - Authentication buttons */}
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="glass-button-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
                Get Started
              </button>
            </SignUpButton>
          </SignedOut>
          
          <SignedIn>
            <Link href="/home" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
} 