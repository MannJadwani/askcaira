import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client;
let db;

export async function connectToDatabase() {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('askcaira');
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function getDb() {
  if (!db) {
    await connectToDatabase();
  }
  return db;
}

// Collection helpers
export async function getFilesCollection() {
  const db = await getDb();
  return db.collection('files');
}

export async function getChatsCollection() {
  const db = await getDb();
  return db.collection('chats');
}

// New schema helper functions
export async function createFileRecord(fileData) {
  const filesCollection = await getFilesCollection();
  return await filesCollection.insertOne({
    ...fileData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

export async function createChatForFile(fileId, userId, initialMessage = null) {
  const chatsCollection = await getChatsCollection();
  
  const chatData = {
    fileId,
    userId,
    title: `Analysis Chat`,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Add initial system message if provided
  if (initialMessage) {
    chatData.messages.push({
      id: '1',
      type: 'assistant',
      content: initialMessage,
      timestamp: new Date(),
      hasVisualization: false,
      visualizationHTML: null,
      metadata: {}
    });
  }

  return await chatsCollection.insertOne(chatData);
}

export async function addMessageToChat(chatId, message) {
  const chatsCollection = await getChatsCollection();
  
  const messageData = {
    id: Date.now().toString(),
    type: message.type || 'user',
    content: message.content,
    timestamp: new Date(),
    hasVisualization: message.hasVisualization || false,
    visualizationHTML: message.visualizationHTML || null,
    metadata: message.metadata || {}
  };

  return await chatsCollection.updateOne(
    { _id: chatId },
    { 
      $push: { messages: messageData },
      $set: { updatedAt: new Date() }
    }
  );
}

export async function getChatForFile(fileId, userId) {
  const chatsCollection = await getChatsCollection();
  return await chatsCollection.findOne({ fileId, userId });
}

export async function updateChatMessage(chatId, messageId, updates) {
  const chatsCollection = await getChatsCollection();
  return await chatsCollection.updateOne(
    { _id: chatId, 'messages.id': messageId },
    { 
      $set: { 
        'messages.$.content': updates.content,
        'messages.$.hasVisualization': updates.hasVisualization,
        'messages.$.visualizationHTML': updates.visualizationHTML,
        'messages.$.metadata': updates.metadata,
        updatedAt: new Date()
      }
    }
  );
}

export async function saveOrUpdateChat(fileId, userId, newMessages) {
  const chatsCollection = await getChatsCollection();
  
  // Check if a chat already exists for this file and user
  let existingChat = await chatsCollection.findOne({ fileId, userId });
  
  if (existingChat) {
    // Update existing chat with new messages
    const result = await chatsCollection.updateOne(
      { _id: existingChat._id },
      { 
        $push: { 
          messages: { 
            $each: newMessages.map(msg => ({
              ...msg,
              timestamp: msg.timestamp || new Date()
            }))
          }
        },
        $set: { updatedAt: new Date() }
      }
    );
    
    // Return the updated chat
    return await chatsCollection.findOne({ _id: existingChat._id });
  } else {
    // Create new chat
    const chatData = {
      fileId,
      userId,
      title: 'Data Analysis Chat',
      messages: newMessages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp || new Date()
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await chatsCollection.insertOne(chatData);
    return await chatsCollection.findOne({ _id: result.insertedId });
  }
} 