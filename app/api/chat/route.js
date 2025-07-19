import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ObjectId } from 'mongodb';
import { saveOrUpdateChat, getFilesCollection } from '../../../lib/mongodb';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, fileId, chatHistory, mode } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    console.log(`Chat API: message="${message}", fileId=${fileId}, mode=${mode}, userId=${userId}`);

    let response;
    let hasVisualization = false;
    let visualizationHTML = null;

    if (mode === 'general' || !fileId) {
      // General chat mode
      response = generateGeneralResponse(message, chatHistory);
    } else {
      // File-specific chat mode - Use Gemini AI with actual data
      const result = await analyzeDataWithGemini(message, fileId, userId, chatHistory);
      response = result.response;
      hasVisualization = result.hasVisualization;
      visualizationHTML = result.visualizationHTML;
    }

    // Save chat to database if fileId is provided
    let chatId = null;
    if (fileId) {
      try {
        const fileObjectId = new ObjectId(fileId);
        const chatRecord = await saveOrUpdateChat(fileObjectId, userId, [
          {
            id: Date.now().toString(),
            type: 'user',
            content: message,
            timestamp: new Date()
          },
          {
            id: (Date.now() + 1).toString(),
            type: 'assistant',
            content: response,
            timestamp: new Date(),
            hasVisualization,
            visualizationHTML
          }
        ]);
        chatId = chatRecord._id.toString();
      } catch (error) {
        console.error('Error saving chat:', error);
        // Continue without saving if there's an error
      }
    }

    return NextResponse.json({
      response,
      chatId: chatId || Date.now().toString(),
      hasVisualization,
      extractedHTML: visualizationHTML
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ 
      error: 'Failed to process chat message' 
    }, { status: 500 });
  }
}

async function analyzeDataWithGemini(message, fileId, userId, chatHistory) {
  try {
    // Get the file data from database
    const filesCollection = await getFilesCollection();
    const fileRecord = await filesCollection.findOne({ 
      _id: new ObjectId(fileId), 
      userId 
    });

    if (!fileRecord) {
      return {
        response: "I couldn't find the file data. Please try uploading the file again.",
        hasVisualization: false,
        visualizationHTML: null
      };
    }

    const { dataSummary, chartRecommendations } = fileRecord;
    
    console.log('Analyzing with Gemini - File:', fileRecord.originalFileName);
    console.log('Data summary available:', !!dataSummary);
    console.log('Chart recommendations available:', !!chartRecommendations);

    // Check if the user is asking for a visualization
    const needsVisualization = checkIfNeedsVisualization(message);
    
    // Create context about the data
    const dataContext = `
**Dataset Information:**
- File: ${fileRecord.originalFileName}
- Rows: ${dataSummary?.totalRows || 'Unknown'}
- Columns: ${dataSummary?.columns?.join(', ') || 'Unknown'}
- Column Types: ${JSON.stringify(dataSummary?.columnTypes || {})}
- Sample Data: ${JSON.stringify(dataSummary?.sampleData?.slice(0, 3) || [])}

**Previous Chart Recommendations:**
${JSON.stringify(chartRecommendations?.recommendations || [])}

**Chat History Context:**
${chatHistory?.slice(-3).map(msg => `${msg.type}: ${msg.content}`).join('\n') || 'No previous conversation'}
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    if (needsVisualization) {
      // Generate both analysis and visualization
      const visualizationPrompt = `
You are a data visualization AI. The user has uploaded a dataset and is asking: "${message}"

${dataContext}

Please provide two things:

1. **ANALYSIS**: A detailed analysis answering the user's question based on the actual data shown above. Reference specific columns, values, and patterns you can see in the sample data.

2. **VISUALIZATION**: Create a complete HTML page with interactive charts using Plotly.js that addresses the user's request. Use the actual data from the dataSummary above.

**CRITICAL STYLING REQUIREMENTS** - The HTML MUST match this exact glassmorphic theme:
- Background: Dark gradient from gray-900 via slate-900 to black
- Use glassmorphic effects: rgba(255, 255, 255, 0.05) backgrounds with backdrop-filter: blur(15px)
- Color palette: 
  * Primary accent: #00d4ff (cyan)
  * Secondary: #3b82f6 (blue) 
  * Success: #10b981 (emerald)
  * Purple: #a855f7
- White text (#ffffff) on dark backgrounds
- Add subtle glow effects: box-shadow: 0 0 20px rgba(0,212,255,0.3)
- Use Inter font family
- Responsive design that works in iframe

**HTML Template Structure:**
\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.plot.ly/plotly-2.26.0.min.js"></script>
  <style>
    body { 
      margin: 0; 
      padding: 20px; 
      background: linear-gradient(135deg, #111827 0%, #0f172a 50%, #000000 100%);
      color: #ffffff; 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      min-height: 100vh;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 0 20px rgba(0, 212, 255, 0.1);
    }
    .chart-container { 
      width: 100%; 
      height: 500px; 
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    h1, h2, h3 {
      color: #ffffff;
      margin-bottom: 16px;
    }
    .metric-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }
    .metric-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: #00d4ff;
      text-shadow: 0 0 10px rgba(0, 212, 255, 0.6);
    }
    .metric-label {
      font-size: 0.875rem;
      color: #94a3b8;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Your visualization content here -->
  </div>
</body>
</html>
\`\`\`

Requirements:
- Use actual data from dataSummary provided
- Create charts that specifically answer the user's question
- Include proper titles and labels with glassmorphic styling
- Make charts interactive with hover effects
- Use the color palette specified above
- Ensure responsive design
- Add subtle animations if appropriate

Format your response as:
**ANALYSIS:**
[Your detailed analysis here]

**HTML:**
\`\`\`html
[Complete HTML code here matching the glassmorphic theme]
\`\`\`
`;

      const result = await model.generateContent(visualizationPrompt);
      const fullResponse = result.response.text();

      // Split the response into analysis and HTML
      const analysisMatch = fullResponse.match(/\*\*ANALYSIS:\*\*([\s\S]*?)(?=\*\*HTML:\*\*)/);
      const htmlMatch = fullResponse.match(/```html\n([\s\S]*?)\n```/);

      const analysis = analysisMatch ? analysisMatch[1].trim() : fullResponse;
      const htmlContent = htmlMatch ? htmlMatch[1].trim() : null;

      return {
        response: analysis,
        hasVisualization: !!htmlContent,
        visualizationHTML: htmlContent
      };

    } else {
      // Just provide analysis without visualization
      const analysisPrompt = `
You are a data analyst AI. The user has uploaded a dataset and is asking: "${message}"

${dataContext}

Please provide a detailed analysis answering the user's question based on the actual data shown above. Reference specific columns, values, and patterns you can see in the sample data. Be specific about what you observe in their dataset.

If the question is general (like "what is this data about"), describe what you can infer from the column names, data types, and sample values provided.

Keep your response informative but conversational.
`;

      const result = await model.generateContent(analysisPrompt);
      
      return {
        response: result.response.text(),
        hasVisualization: false,
        visualizationHTML: null
      };
    }

  } catch (error) {
    console.error('Gemini analysis error:', error);
    return {
      response: `I encountered an error while analyzing your data: ${error.message}. Please try rephrasing your question.`,
      hasVisualization: false,
      visualizationHTML: null
    };
  }
}

function generateGeneralResponse(message, chatHistory) {
  const lowerMessage = message.toLowerCase();
  
  // Simple pattern matching for demo purposes
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm Caira, your AI assistant. How can I help you today?";
  }
  
  if (lowerMessage.includes('what') && lowerMessage.includes('you')) {
    return "I'm an AI assistant created to help you with various tasks, answer questions, and analyze data. I can help with general inquiries or analyze CSV/Excel files when you upload them.";
  }
  
  if (lowerMessage.includes('how') && lowerMessage.includes('work')) {
    return "I work by processing your questions and providing helpful responses. For data analysis, you can upload CSV or Excel files, and I'll help you understand your data, find patterns, and generate insights.";
  }
  
  if (lowerMessage.includes('data') || lowerMessage.includes('csv') || lowerMessage.includes('file')) {
    return "I can help you analyze data! Upload a CSV or Excel file using the attachment button, and I'll be able to answer questions about your data, find patterns, generate insights, and create visualizations.";
  }
  
  // Default response
  return `I understand you're asking about "${message}". While I'd love to provide a detailed analysis, I'm currently a demo assistant. For the best experience, try uploading a CSV file so I can help analyze your data and provide specific insights!`;
}

function checkIfNeedsVisualization(message) {
  const lowerMessage = message.toLowerCase();
  const visualizationKeywords = [
    'visualiz', 'chart', 'graph', 'plot', 'show', 'display',
    'trend', 'pattern', 'distribution', 'comparison', 'correlation',
    'create', 'generate', 'make', 'draw', 'bar chart', 'line chart',
    'pie chart', 'scatter', 'histogram', 'heatmap'
  ];
  
  return visualizationKeywords.some(keyword => lowerMessage.includes(keyword));
} 