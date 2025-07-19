import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from '@clerk/nextjs/server';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { createFileRecord, createChatForFile } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
// File operations no longer needed - sending data directly to Gemini

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file');
    const mode = formData.get('mode'); // 'chat' or 'visualize'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    const isValidType = allowedTypes.includes(file.type) || 
                       file.name.endsWith('.csv') || 
                       file.name.endsWith('.xlsx') || 
                       file.name.endsWith('.xls');

    if (!isValidType) {
      return NextResponse.json({ error: 'Invalid file type. Only CSV and Excel files are supported.' }, { status: 400 });
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    // Parse the file based on type
    let parsedData;
    let headers = [];
    
    try {
      console.log('Parsing file:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      if (file.name.endsWith('.csv') || file.type === 'text/csv') {
        // Parse CSV
        console.log('Parsing as CSV...');
        const csvText = fileBuffer.toString('utf8');
        const result = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true
        });
        
        if (result.errors.length > 0) {
          console.error('CSV parsing errors:', result.errors);
          throw new Error(`CSV parsing failed: ${result.errors[0].message}`);
        }
        
        parsedData = result.data;
        headers = result.meta.fields || [];
        console.log('CSV parsed successfully:', { rows: parsedData.length, columns: headers.length });
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || 
                 file.type.includes('spreadsheet') || file.type.includes('excel')) {
        // Parse Excel
        console.log('Parsing as Excel...');
        
        try {
          const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
          console.log('Workbook sheets:', workbook.SheetNames);
          
          if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
            throw new Error('No sheets found in Excel file');
          }
          
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          if (!worksheet) {
            throw new Error(`Sheet "${sheetName}" not found or is empty`);
          }
          
          parsedData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: null,
            blankrows: false
          });
          
          console.log('Raw Excel data length:', parsedData.length);
          
          // Extract headers and data
          if (parsedData.length === 0) {
            throw new Error('Excel sheet appears to be empty');
          }
          
          // Filter out completely empty rows
          parsedData = parsedData.filter(row => 
            row.some(cell => cell !== null && cell !== undefined && cell !== '')
          );
          
          if (parsedData.length === 0) {
            throw new Error('No data found in Excel sheet after filtering empty rows');
          }
          
          headers = parsedData[0];
          const dataRows = parsedData.slice(1);
          
          // Validate headers
          if (!headers || headers.length === 0) {
            throw new Error('No column headers found in Excel file');
          }
          
          // Convert back to object format
          parsedData = dataRows.map((row, rowIndex) => {
            const obj = {};
            headers.forEach((header, index) => {
              obj[header] = row[index];
            });
            return obj;
          });
          
          console.log('Excel parsed successfully:', { rows: parsedData.length, columns: headers.length });
        } catch (xlsxError) {
          console.error('XLSX parsing error:', xlsxError);
          throw new Error(`Excel file parsing failed: ${xlsxError.message}. Please ensure the file is a valid Excel file (.xlsx or .xls)`);
        }
      } else {
        throw new Error(`Unsupported file format. File: ${file.name}, Type: ${file.type}. Please upload a CSV or Excel file.`);
      }

      // Validate parsed data
      if (!parsedData || parsedData.length === 0) {
        return NextResponse.json({ error: 'File appears to be empty or could not be parsed' }, { status: 400 });
      }

      // Create data summary for Gemini
      const dataSummary = {
        fileName: file.name,
        totalRows: parsedData.length,
        columns: headers,
        columnTypes: {},
        sampleData: parsedData.slice(0, 5), // First 5 rows as sample
        dataPreview: parsedData.slice(0, 100) // First 100 rows for analysis
      };

      // Analyze column types
      headers.forEach(header => {
        const sampleValues = parsedData.slice(0, 100)
          .map(row => row[header])
          .filter(val => val !== null && val !== undefined && val !== '');
        
        if (sampleValues.length > 0) {
          const firstValue = sampleValues[0];
          if (typeof firstValue === 'number' && !isNaN(firstValue)) {
            dataSummary.columnTypes[header] = 'number';
          } else if (typeof firstValue === 'boolean') {
            dataSummary.columnTypes[header] = 'boolean';
          } else if (Date.parse(firstValue)) {
            dataSummary.columnTypes[header] = 'date';
          } else {
            dataSummary.columnTypes[header] = 'text';
          }
        } else {
          dataSummary.columnTypes[header] = 'unknown';
        }
      });

      // Step 1: Prepare data for Gemini analysis (no file upload needed)
      console.log('Step 1: Preparing data for Gemini analysis...');

      // Step 2: Ask Gemini to analyze data and suggest chart types
      console.log('Step 2: Asking Gemini for chart recommendations...');
      
      const analysisPrompt = `
        Analyze this dataset and recommend the best chart types to visualize the data effectively.
        
        Dataset summary:
        - File: ${file.name}
        - Rows: ${parsedData.length}
        - Columns: ${headers.length}
        - Column types: ${JSON.stringify(dataSummary.columnTypes)}
        - Sample data: ${JSON.stringify(dataSummary.sampleData.slice(0, 3))}
        
        Please recommend 3-5 different chart types that would best show insights from this data.
        For each recommendation, specify:
        1. Chart type (bar, line, pie, scatter, etc.)
        2. Which columns to use (x-axis, y-axis, categories)
        3. What insight this chart would reveal
        4. Title for the chart
        
        Respond in JSON format:
        {
          "recommendations": [
            {
              "type": "bar",
              "xAxis": "column_name",
              "yAxis": "column_name", 
              "title": "Chart Title",
              "insight": "What this chart shows"
            }
          ]
        }
      `;

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      // Include data directly in the prompt
      const fullAnalysisPrompt = `${analysisPrompt}
      
      **Complete dataset information:**
      ${JSON.stringify(dataSummary, null, 2)}`;
      
      const analysisResult = await model.generateContent(fullAnalysisPrompt);

      let chartRecommendations;
      try {
        const analysisText = analysisResult.response.text();
        console.log('Raw analysis response:', analysisText);
        
        // Extract JSON from response
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          chartRecommendations = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (jsonError) {
        console.error('Error parsing analysis JSON:', jsonError);
        // Fallback recommendations
        chartRecommendations = {
          recommendations: [
            {
              type: "bar",
              xAxis: headers[0],
              yAxis: headers[1] || headers[0],
              title: `${headers[1] || 'Values'} by ${headers[0]}`,
              insight: "Distribution of values across categories"
            }
          ]
        };
      }
      console.log('Step 2 completed: Chart recommendations received');

      // Step 3: Generate HTML visualizations
      console.log('Step 3: Generating HTML visualizations...');
      const htmlPrompt = `
        Create interactive HTML charts using Plotly.js based on these recommendations.
        Use the uploaded dataset to generate real charts with actual data.
        
        Chart recommendations: ${JSON.stringify(chartRecommendations)}
        
        Requirements:
        1. Create a complete HTML page with multiple charts
        2. Use Plotly.js CDN for charts
        3. Make charts responsive and interactive
        4. Use a dark theme to match the application
        5. Include chart titles and proper styling
        6. Use actual data from the uploaded file
        
        Return only the complete HTML code that can be displayed in an iframe.
        The HTML should be self-contained with inline CSS and JavaScript.
      `;

      // Include data directly in the HTML generation prompt
      const fullHtmlPrompt = `${htmlPrompt}
      
      **Complete dataset to use for charts:**
      ${JSON.stringify(dataSummary, null, 2)}`;
      
      const htmlResult = await model.generateContent(fullHtmlPrompt);

      const generatedHTML = htmlResult.response.text();
      console.log('Step 3 completed: HTML visualizations generated');
      
      // Extract just the HTML without showing it to the user
      const cleanHTML = generatedHTML.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();

      // Step 4: Create file record (without visualization HTML)
      console.log('Step 4: Saving file to database...');
      const fileData = {
        userId,
        originalFileName: file.name,
        displayName: `${file.name} - Processed Data`,
        uploadDate: new Date(),
        fileType: file.type,
        size: file.size,
        status: 'ready',
        mode: mode || 'visualize',
        dataSummary,
        chartRecommendations,
        rowCount: parsedData.length,
        columnCount: headers.length
      };

      const fileResult = await createFileRecord(fileData);
      const fileId = fileResult.insertedId;
      console.log('Step 4 completed: File record saved to database');

      // Step 5: Create initial chat with visualization
      console.log('Step 5: Creating initial chat...');
      
      const welcomeMessage = `I've analyzed your file "${file.name}" and created interactive visualizations! 

**Data Summary:**
📊 ${parsedData.length} rows, ${headers.length} columns
📈 Generated ${chartRecommendations?.recommendations?.length || 'several'} chart recommendations

${chartRecommendations?.recommendations ? 
  '\n**Generated Charts:**\n' + chartRecommendations.recommendations.map(rec => 
    `• ${rec.title}: ${rec.insight}`
  ).join('\n') : ''}

✨ **Your visualization is ready!** You can see the interactive charts in the visualization panel, or ask me questions about your data.`;

      const chatResult = await createChatForFile(
        fileId, 
        userId, 
        welcomeMessage
      );
      console.log('Step 5 completed: Initial chat created');

      // Step 6: Add visualization message to chat
      console.log('Step 6: Adding visualization to chat...');
      
      // Import addMessageToChat function
      const { addMessageToChat } = await import('../../../lib/mongodb');
      
      await addMessageToChat(chatResult.insertedId, {
        type: 'assistant',
        content: '✅ **Visualization Created Successfully!**\n\nI\'ve generated interactive charts based on your data. You can see them in the visualization panel above!',
        hasVisualization: true,
        visualizationHTML: cleanHTML,
        metadata: { 
          chartRecommendations,
          generatedAt: new Date()
        }
      });
      
      console.log('Step 6 completed: Visualization added to chat');

      return NextResponse.json({
        success: true,
        file: {
          id: fileId.toString(),
          name: fileData.originalFileName,
          displayName: fileData.displayName,
          uploadDate: fileData.uploadDate,
          fileType: fileData.fileType,
          size: fileData.size,
          status: fileData.status,
          mode: fileData.mode,
          rowCount: fileData.rowCount,
          columnCount: fileData.columnCount,
          chartRecommendations,
          generatedHTML: cleanHTML, // For immediate use
          chatId: chatResult.insertedId.toString()
        },
        message: `Successfully processed ${parsedData.length} rows with ${headers.length} columns and generated ${chartRecommendations.recommendations?.length || 1} visualizations`
      });

    } catch (parseError) {
      console.error('Error parsing file:', parseError);
      
      // Provide more specific error message
      let errorMessage = parseError.message || 'Failed to parse file';
      
      // Add helpful suggestions based on file type
      if (file.name.toLowerCase().includes('exlx')) {
        errorMessage = 'Invalid file extension "exlx". Did you mean ".xlsx"? Please ensure your file has the correct Excel extension (.xlsx or .xls).';
      } else if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        errorMessage = `Unsupported file extension: ${file.name.split('.').pop()}. Please upload a CSV (.csv) or Excel (.xlsx, .xls) file.`;
      }
      
      return NextResponse.json({ 
        error: errorMessage,
        debug: {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          originalError: parseError.message
        }
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Internal server error during file processing' 
    }, { status: 500 });
  }
} 