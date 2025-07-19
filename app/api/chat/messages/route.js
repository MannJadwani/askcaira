import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getChatForFile } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    // Get chat for this file
    const chatRecord = await getChatForFile(new ObjectId(fileId), userId);

    console.log(`Chat messages API: fileId=${fileId}, userId=${userId}`);
    console.log(`Chat found: ${!!chatRecord}`);
    console.log(`Message count: ${chatRecord?.messages?.length || 0}`);

    if (!chatRecord) {
      console.log('No chat found for file');
      return NextResponse.json({ 
        success: false, 
        error: 'Chat not found for this file' 
      }, { status: 404 });
    }

    // Format messages for frontend
    const formattedMessages = chatRecord.messages.map(msg => ({
      id: msg.id,
      type: msg.type,
      content: msg.content,
      timestamp: msg.timestamp,
      hasVisualization: msg.hasVisualization || false,
      visualizationHTML: msg.visualizationHTML || null
    }));

    const visualizationCount = formattedMessages.filter(msg => msg.hasVisualization && msg.visualizationHTML).length;
    console.log(`Returning ${formattedMessages.length} messages, ${visualizationCount} with visualizations`);

    return NextResponse.json({
      success: true,
      messages: formattedMessages,
      chatId: chatRecord._id.toString()
    });

  } catch (error) {
    console.error('Chat messages API error:', error);
    return NextResponse.json({ 
      error: 'Failed to retrieve chat messages' 
    }, { status: 500 });
  }
} 