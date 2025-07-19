/**
 * GlassButton Component
 * A reusable button component with glassmorphic styling and neon effects
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 * @param {'primary'|'secondary'|'ghost'} props.variant - Button variant
 * @param {boolean} props.disabled - Disabled state
 * @param {Function} props.onClick - Click handler
 * @param {string} props.type - Button type
 */
export default function GlassButton({ 
  children, 
  className = '', 
  variant = 'primary',
  disabled = false,
  onClick,
  type = 'button',
  ...props 
}) {
  const baseClasses = "font-medium px-6 py-3 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-cyan-400 to-blue-500 
      text-gray-900 font-semibold
      shadow-[0_4px_16px_rgba(0,212,255,0.4)]
      hover:shadow-[0_8px_24px_rgba(0,212,255,0.6)]
      hover:transform hover:-translate-y-0.5
      active:transform active:translate-y-0
      border border-cyan-400/50
    `,
    secondary: `
      bg-white/3 backdrop-blur-lg 
      text-white border border-white/20
      hover:bg-white/8 hover:border-white/30
      hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]
    `,
    ghost: `
      text-cyan-400 
      hover:bg-white/5 hover:text-cyan-300
      border border-transparent hover:border-white/20
    `
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
} 