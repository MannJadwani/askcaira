import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import ConditionalHeader from '../components/layout/ConditionalHeader';
import { Inter } from 'next/font/google';
import './globals.css';

// Initialize Inter font for glassmorphic design
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weights: ['300', '400', '500', '600', '700'],
});

// Export metadata for the page
export const metadata = {
  title: 'Ask Caira',
  description: 'Transform your data into insights through intelligent conversation',
};

/**
 * RootLayout is the main layout component for the application.
 * It wraps all pages with the ClerkProvider for authentication
 * and sets up the basic HTML structure, including fonts and conditional header.
 * @param {{ children: React.ReactNode }} props - The props object.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {JSX.Element} The rendered RootLayout component.
 */
export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} font-sans antialiased`}>
                    {/* Conditional header - only show on landing page */}
          <ConditionalHeader />

          {/* Main content */}
          <main className="min-h-screen">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}