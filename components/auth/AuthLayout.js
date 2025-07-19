import GlassCard from '../ui/GlassCard';

/**
 * AuthLayout Component
 * A layout wrapper for authentication pages with glassmorphic background
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to render inside the layout
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Page subtitle
 */
export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-4 -left-4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '0s', animationDuration: '4s' }}
        ></div>
        <div 
          className="absolute top-1/2 -right-4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s', animationDuration: '6s' }}
        ></div>
        <div 
          className="absolute -bottom-8 left-1/3 w-80 h-80 bg-green-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '4s', animationDuration: '5s' }}
        ></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        <GlassCard className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-400 text-sm">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Auth content */}
          <div className="space-y-6">
            {children}
          </div>
          
          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Powered by Ask Caira
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
} 