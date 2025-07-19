import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getFilesCollection, getChatForFile } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Retrieve user's files from MongoDB
    const filesCollection = await getFilesCollection();
    const files = await filesCollection
      .find({ userId })
      .sort({ uploadDate: -1 }) // Most recent first
      .toArray();

    // Format files for frontend and get chat data
    const formattedFiles = await Promise.all(files.map(async (file) => {
      // Get the chat for this file to check for visualizations
      const chatRecord = await getChatForFile(file._id, userId);
      
      // Check if any messages have visualizations WITH actual HTML content
      const hasVisualization = chatRecord?.messages?.some(msg => 
        msg.hasVisualization && msg.visualizationHTML
      ) || false;
      
      // Get the latest visualization if available (must have both flag and content)
      const latestVisualization = chatRecord?.messages?.slice().reverse().find(msg => 
        msg.hasVisualization && msg.visualizationHTML
      );
      
      console.log(`File ${file.originalFileName}: hasViz=${hasVisualization}, chatExists=${!!chatRecord}, htmlLength=${latestVisualization?.visualizationHTML?.length || 0}`);
      
      return {
        id: file._id.toString(),
        name: file.originalFileName,
        displayName: file.displayName,
        uploadDate: file.uploadDate,
        fileType: file.fileType,
        size: file.size,
        status: file.status,
        mode: file.mode,
        rowCount: file.rowCount,
        columnCount: file.columnCount,
        chartRecommendations: file.chartRecommendations,
        dataSummary: file.dataSummary,
        hasVisualization: hasVisualization || !!file.generatedHTML, // Check both new and old schema
        generatedHTML: latestVisualization?.visualizationHTML || file.generatedHTML || null, // Fallback to old schema
        chatId: chatRecord?._id?.toString() || null
      };
    }));

    return NextResponse.json({
      success: true,
      files: formattedFiles
    });

  } catch (error) {
    console.error('Files API error:', error);
    return NextResponse.json({ 
      error: 'Failed to retrieve files' 
    }, { status: 500 });
  }
}

// DELETE endpoint to remove a file
export async function DELETE(request) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');

    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    const filesCollection = await getFilesCollection();
    
    // Verify file ownership and delete
    const result = await filesCollection.deleteOne({ 
      _id: new ObjectId(fileId),
      userId 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'File not found or access denied' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('File deletion error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete file' 
    }, { status: 500 });
  }
} 