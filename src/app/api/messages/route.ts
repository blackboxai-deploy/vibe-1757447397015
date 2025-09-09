import { NextRequest, NextResponse } from 'next/server';
import { mockMessages, getRandomResponse } from '@/lib/mockData';
import { Message } from '@/types/chat';
import { generateMessageId } from '@/lib/chatUtils';

// GET /api/messages - Get messages for a room
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!roomId) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      );
    }

    const messages = mockMessages[roomId] || [];
    const totalMessages = messages.length;
    const paginatedMessages = messages.slice(offset, offset + limit);

    return NextResponse.json({
      messages: paginatedMessages,
      totalMessages,
      hasMore: offset + limit < totalMessages,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/messages - Send a new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, senderId, senderName, senderAvatar, roomId, type = 'text' } = body;

    // Validate required fields
    if (!content || !senderId || !senderName || !roomId) {
      return NextResponse.json(
        { error: 'Missing required fields: content, senderId, senderName, roomId' },
        { status: 400 }
      );
    }

    // Validate content length
    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'Message content too long (max 2000 characters)' },
        { status: 400 }
      );
    }

    const newMessage: Message = {
      id: generateMessageId(),
      content: content.trim(),
      senderId,
      senderName,
      senderAvatar,
      timestamp: new Date(),
      roomId,
      type,
      reactions: [],
    };

    // Add message to mock data (in a real app, this would go to a database)
    if (!mockMessages[roomId]) {
      mockMessages[roomId] = [];
    }
    mockMessages[roomId].push(newMessage);

    // Simulate auto-response (30% chance)
    let autoResponse: Message | null = null;
    if (Math.random() < 0.3) {
      setTimeout(() => {
        const { user, message } = getRandomResponse(senderId);
        autoResponse = {
          id: generateMessageId(),
          content: message,
          senderId: user.id,
          senderName: user.name,
          senderAvatar: user.avatar,
          timestamp: new Date(),
          roomId,
          type: 'text',
          reactions: [],
        };
        mockMessages[roomId].push(autoResponse);
      }, Math.random() * 3000 + 1000); // 1-4 seconds delay
    }

    return NextResponse.json({
      success: true,
      message: newMessage,
      autoResponse: autoResponse ? 'pending' : null,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/messages - Add reaction to a message
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageId, roomId, emoji, userId, userName, action = 'toggle' } = body;

    if (!messageId || !roomId || !emoji || !userId || !userName) {
      return NextResponse.json(
        { error: 'Missing required fields: messageId, roomId, emoji, userId, userName' },
        { status: 400 }
      );
    }

    const messages = mockMessages[roomId];
    if (!messages) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    const message = messages.find(m => m.id === messageId);
    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    if (!message.reactions) {
      message.reactions = [];
    }

    const existingReaction = message.reactions.find(
      r => r.emoji === emoji && r.userId === userId
    );

    if (action === 'add' || (!existingReaction && action === 'toggle')) {
      // Add reaction if it doesn't exist
      if (!existingReaction) {
        message.reactions.push({
          emoji,
          userId,
          userName,
        });
      }
    } else if (action === 'remove' || (existingReaction && action === 'toggle')) {
      // Remove reaction if it exists
      message.reactions = message.reactions.filter(
        r => !(r.emoji === emoji && r.userId === userId)
      );
    }

    return NextResponse.json({
      success: true,
      message,
      action: existingReaction ? 'removed' : 'added',
    });
  } catch (error) {
    console.error('Error updating message reaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}