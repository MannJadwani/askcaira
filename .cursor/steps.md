# Ask Caira - Interactive Data Visualization and Chat App
## Development Checklist

This is a step-by-step checklist for building Ask Caira using Next.js, Firebase, and Google Gemini API.

---

## 🏗️ Phase 1: Project Setup & Authentication

### Initial Project Setup
- [x] Create Next.js project: `npx create-next-app@latest ask-caira`
  - [x] Select TypeScript: No (using JavaScript)
  - [x] Select ESLint: Yes  
  - [x] Select Tailwind CSS: Yes
  - [x] Select App Router: Yes
- [x] Navigate to project: `cd ask-caira`
- [x] Test initial setup: `npm run dev`

### Environment Setup
- [x] Create `.env.local` file in project root
- [x] Add environment variables (will be populated in next steps)

### Firebase Setup
- [x] Go to [Firebase Console](https://console.firebase.google.com/)
- [x] Create new project named "ask-caira"
- [x] Enable Firestore Database
- [x] ~~Enable Firebase Storage~~ (SKIPPED - storing as JSON in Firestore)
- [x] Create Web App in project settings
- [x] Copy Firebase config object
- [x] Install Firebase SDK: `npm install firebase`
- [ ] Create `lib/firebase.js` configuration file
- [ ] Add Firebase config to `.env.local`:
  ```
  NEXT_PUBLIC_FIREBASE_API_KEY=
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
  NEXT_PUBLIC_FIREBASE_APP_ID=
  ```

### Authentication with Clerk
- [x] Sign up at [Clerk.com](https://clerk.com)
- [x] Create new application named "Ask Caira"
- [x] Select Next.js framework
- [x] Copy API keys
- [x] Install Clerk: `npm install @clerk/nextjs`
- [x  ] Add Clerk keys to `.env.local`:
  ```
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
  CLERK_SECRET_KEY=
  ```
- [x] Wrap `app/layout.js` with `<ClerkProvider>`
- [x] Set up middleware.ts with clerkMiddleware
- [x] Add SignInButton, SignUpButton, UserButton to layout
- [x] Create `app/sign-in/[[...sign-in]]/page.js`
- [x] Create `app/sign-up/[[...sign-up]]/page.js`

### Google Gemini API Setup
- [ ] Go to [Google AI Studio](https://aistudio.google.com/)
- [ ] Create API key for Gemini
- [ ] Add to `.env.local`:
  ```
  GEMINI_API_KEY=
  ```
- [ ] Install Google AI SDK: `npm install @google/generative-ai`

### Basic Folder Structure
- [ ] Create `app/home/page.js`
- [ ] Create `app/upload/page.js` 
- [ ] Create `app/visualize/[fileId]/page.js`
- [ ] Create `app/chat/[fileId]/page.js`
- [x] Create `components/` directory
- [x] Create reusable UI components (GlassCard, GlassButton, AuthLayout)
- [ ] Create `lib/` directory

---

## 🎨 Phase 2: Landing and Home Pages

### Landing Page (`app/page.js`)
- [x] Design hero section explaining Ask Caira
- [x] Add value proposition copy
- [x] Implement `<SignInButton>` from Clerk
- [x] Implement `<SignUpButton>` from Clerk
- [x] Add responsive design
- [x] Conditional CTAs based on auth state
- [ ] Test authentication flow

### Home Dashboard (`app/home/page.js`)
- [ ] Add route protection with Clerk `auth()`
- [ ] Create dashboard layout
- [ ] Build file list component
- [ ] Add "Upload New File" button
- [ ] Link to `/upload` page
- [ ] Fetch user's files from Firestore
- [ ] Display file cards with metadata
- [ ] Add "No files" empty state

---

## 📁 Phase 3: File Upload & Processing

### Install Data Processing Libraries
- [ ] Install CSV parser: `npm install papaparse`
- [ ] Install Excel parser: `npm install xlsx`
- [ ] Install file type detection: `npm install file-type`

### Upload Page (`app/upload/page.js`)
- [ ] Create file input component
- [ ] Add drag-and-drop functionality
- [ ] Implement file type validation (CSV, Excel)
- [ ] Add file preview before upload
- [ ] Show upload progress indicator
- [ ] Add error handling for invalid files

### File Processing Logic
- [ ] Create client-side file parsing function
- [ ] Parse CSV files with Papa Parse
- [ ] Parse Excel files with XLSX
- [ ] Convert data to standardized JSON format
- [ ] Validate data structure

### Upload API Route (`app/api/upload/route.js`)
- [ ] Create API route handler
- [ ] Get `userId` from Clerk authentication
- [ ] ~~Upload original file to Firebase Storage~~ (SKIPPED)
- [ ] Create Firestore document with data:
  - [ ] userId
  - [ ] fileName  
  - [ ] ~~storagePath~~ (not needed)
  - [ ] uploadDate
  - [ ] fileType
  - [ ] parsedData (JSON format)
  - [ ] dataPreview
  - [ ] status
- [ ] Return fileId to client
- [ ] Redirect to visualization page

---

## 📊 Phase 4: Data Visualization

### Install Visualization Libraries
- [ ] Install charts: `npm install recharts`
- [ ] Install data manipulation: `npm install lodash`

### Visualization Page (`app/visualize/[fileId]/page.js`)
- [ ] Create page layout with split view:
  - [ ] Left side: Data visualizations
  - [ ] Right side: Chat interface
- [ ] Fetch file data from Firestore (includes parsed JSON)
- [ ] ~~Download and parse data from Firebase Storage~~ (data already in Firestore)
- [ ] Create chart selection interface

### Chart Components
- [ ] Create `components/charts/BarChart.js`
- [ ] Create `components/charts/LineChart.js`
- [ ] Create `components/charts/PieChart.js`
- [ ] Create `components/charts/ScatterPlot.js`
- [ ] Add chart type selector
- [ ] Implement dynamic column mapping
- [ ] Add chart export functionality

### Data Analysis Features
- [ ] Auto-detect chart recommendations
- [ ] Add data summary statistics
- [ ] Implement column filtering
- [ ] Add data search functionality

---

## 💬 Phase 5: Chat with Data Interface

### Chat Component (`components/Chat.js`)
- [ ] Create chat input area
- [ ] Build message display component
- [ ] Add typing indicator
- [ ] Implement message history
- [ ] Add copy message functionality
- [ ] Style chat bubbles (user vs AI)

### Chat API Route (`app/api/chat/route.js`)
- [ ] Create API route handler
- [ ] Fetch file data from Firestore using fileId (JSON format)
- [ ] Format data for Gemini prompt
- [ ] Create system prompt for data analysis
- [ ] Call Google Gemini API
- [ ] Handle API errors gracefully
- [ ] Return structured response
- [ ] Save conversation to Firestore (optional)

### Gemini Integration
- [ ] Create `lib/gemini.js` utility
- [ ] Configure Gemini model (gemini-pro)
- [ ] Create data analysis prompt template
- [ ] Implement token counting
- [ ] Add response streaming (optional)
- [ ] Handle rate limiting

### Chat Features
- [ ] Suggest example questions
- [ ] Add data context in sidebar
- [ ] Implement chat history persistence
- [ ] Add conversation export
- [ ] Clear chat functionality

---

## 🔧 Phase 6: Polish & Optimization

### Performance Optimization
- [ ] Implement file size limits
- [ ] Add data caching strategy
- [ ] Optimize chart rendering
- [ ] Add loading states everywhere
- [ ] Implement error boundaries

### User Experience
- [ ] Add onboarding tutorial
- [ ] Create help documentation
- [ ] Add keyboard shortcuts
- [ ] Implement dark mode toggle
- [ ] Add responsive design for mobile

### Data Management
- [ ] Add file deletion functionality
- [ ] Implement file sharing (optional)
- [ ] Add data export options
- [ ] Create file organization/folders

### Security & Validation
- [ ] Add file size validation (max 10MB)
- [ ] Sanitize file uploads
- [ ] Validate data columns
- [ ] Add rate limiting to API routes
- [ ] Implement CORS properly

---

## 🚀 Phase 7: Deployment

### Preparation
- [ ] Test all features thoroughly
- [ ] Set up production Firebase project
- [ ] Configure production environment variables
- [ ] Test with various file formats and sizes

### Deployment
- [ ] Deploy to Vercel
- [ ] Configure custom domain (optional)
- [ ] Set up analytics
- [ ] Monitor performance
- [ ] Set up error tracking

---

## 📋 Current Status
**Phase:** 🏗️ Phase 1 - Project Setup & Authentication  
**Next Task:** Test authentication flow with corrected middleware  
**Completed:** 26/265 tasks (updated count after removing Firebase Storage tasks)

### Recently Completed:
- ✅ Next.js project created with JavaScript, ESLint, Tailwind CSS, and App Router
- ✅ Project structure set up with app/ directory
- ✅ Package dependencies installed
- ✅ Clerk authentication installed and configured
- ✅ ClerkProvider set up in layout with auth buttons
- ✅ Middleware configured for route protection
- ✅ Firebase project created
- ✅ Simplified architecture: JSON storage instead of file storage
- ✅ **Design system created** - Glassmorphic aesthetic with neon accents
- ✅ **Reusable components** - GlassCard, GlassButton, AuthLayout
- ✅ **Authentication pages** - Sign-in and Sign-up with glassmorphic styling
- ✅ **Global CSS** - Custom glassmorphic utilities and variables
- ✅ **Route protection** - Middleware configured for auth-only access
- ✅ **Landing page** - Dark, sharp glassmorphic design with working charts
- ✅ **Dashboard preview** - Functional SVG charts with data points and animations  
- ✅ **Feature showcase** - Six feature cards with cyan/blue theme
- ✅ **Sharp aesthetic** - Removed purple, angular corners, darker glass effects

### Next Steps:
1. Add Clerk API keys to `.env.local`
2. Enable Firestore Database in Firebase
3. Add Firebase config to project
4. Create sign-in/sign-up pages

---

## 🔗 Useful Links
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Google AI Studio](https://aistudio.google.com/)
- [Recharts Documentation](https://recharts.org/)
- **[Design System](./design.md)** - Complete glassmorphic aesthetic guide

## 📝 Notes
- **Simplified Architecture**: Storing parsed data as JSON in Firestore instead of Firebase Storage
- Keep file sizes under 10MB for optimal performance (Firestore document limit: 1MB)
- Test with various CSV/Excel formats during development
- Consider adding support for JSON files in future versions
- Monitor Gemini API usage to stay within quotas
- For larger datasets, may need to implement chunking or pagination