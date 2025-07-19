import { SignUp } from '@clerk/nextjs';
import AuthLayout from '../../../components/auth/AuthLayout';

/**
 * Sign Up Page
 * Clerk-powered user registration with glassmorphic design
 */
export default function SignUpPage() {
  return (
    <AuthLayout 
      title="Join Ask Caira" 
      subtitle="Create your account to start analyzing data"
    >
      <div className="flex justify-center">
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-transparent shadow-none border-none",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: `
                bg-white/5 backdrop-blur-lg border border-white/10 
                text-white hover:bg-white/10 hover:border-white/20
                transition-all duration-300
              `,
              socialButtonsBlockButtonText: "text-white font-medium",
              dividerLine: "bg-white/20",
              dividerText: "text-gray-400",
              formButtonPrimary: `
                bg-gradient-to-r from-blue-400 to-blue-500 
                hover:shadow-[0_8px_24px_rgba(0,212,255,0.4)]
                hover:transform hover:-translate-y-0.5
                transition-all duration-300
              `,
              formFieldInput: `
                bg-white/5 backdrop-blur-lg border border-white/10 
                text-white placeholder:text-gray-400
                focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20
                transition-all duration-300
              `,
              formFieldLabel: "text-gray-300 font-medium",
              identityPreviewText: "text-white",
              identityPreviewEditButton: "text-blue-400 hover:text-blue-300",
              footerActionText: "text-gray-400",
              footerActionLink: "text-blue-400 hover:text-blue-300 font-medium",
              alternativeMethodsBlockButton: `
                bg-white/5 backdrop-blur-lg border border-white/10 
                text-white hover:bg-white/10
              `,
              formFieldSuccessText: "text-green-400",
              formFieldErrorText: "text-red-400",
              formFieldWarningText: "text-orange-400"
            }
          }}
          redirectUrl="/home"
          signInUrl="/sign-in"
        />
      </div>
    </AuthLayout>
  );
} 