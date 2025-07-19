/**
 * GlassCard Component
 * A reusable glassmorphic card component following the Ask Caira design system
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to render inside the card
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.hover - Enable hover effects
 * @param {'primary'|'secondary'} props.variant - Card variant
 */
export default function GlassCard({ 
  children, 
  className = '', 
  hover = false, 
  variant = 'primary' 
}) {
  const baseClasses = "backdrop-blur-xl border rounded-lg shadow-2xl transition-all duration-300";
  
  const variantClasses = {
    primary: "bg-white/4 border-white/20",
    secondary: "bg-white/2 border-white/15 rounded-md"
  };
  
  const hoverClasses = hover 
    ? "hover:bg-white/8 hover:border-white/20 hover:transform hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)]" 
    : "";

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
      style={{
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}
    >
      {children}
    </div>
  );
} 