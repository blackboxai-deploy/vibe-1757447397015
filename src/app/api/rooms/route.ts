import { NextRequest, NextResponse } from 'next/server';
import { mockRooms, mockMessages, mockUsers } from '@/lib/mockData';
import { ChatRoom } from '@/types/chat';
import { generateRoomId } from '@/lib/chatUtils';

// GET /api/rooms - Get all rooms
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const search = searchParams.get('search');
    const type = searchParams.get('type') as 'public' | 'private' | 'group' | null;

    let filteredRooms = [...mockRooms];

    // Filter by user participation
    if (userId) {
      filteredRooms = filteredRooms.filter(room =>
        room.participants.some(p => p.id === userId)
      );
    }

    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase();
      filteredRooms = filteredRooms.filter(room =>
        room.name.toLowerCase().includes(searchLower) ||
        room.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by type
    if (type) {
      filteredRooms = filteredRooms.filter(room => room.type === type);
    }

    // Sort by last message timestamp or creation date
    filteredRooms.sort((a, b) => {
      const aTime = a.lastMessage?.timestamp.getTime() || a.createdAt.getTime();
      const bTime = b.lastMessage?.timestamp.getTime() || b.createdAt.getTime();
      return bTime - aTime; // Most recent first
    });

    return NextResponse.json({
      rooms: filteredRooms,
      totalRooms: filteredRooms.length,
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/rooms - Create a new room
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, type = 'public', creatorId, participants = [] } = body;

    // Validate required fields
    if (!name || !creatorId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, creatorId' },
        { status: 400 }
      );
    }

    // Validate room name
    if (name.length < 2 || name.length > 50) {
      return NextResponse.json(
        { error: 'Room name must be between 2 and 50 characters' },
        { status: 400 }
      );
    }

    // Check if room name already exists (case-insensitive)
    const existingRoom = mockRooms.find(
      room => room.name.toLowerCase() === name.toLowerCase()
    );
    if (existingRoom) {
      return NextResponse.json(
        { error: 'A room with this name already exists' },
        { status: 409 }
      );
    }

    // Find creator user
    const creator = mockUsers.find(u => u.id === creatorId);
    if (!creator) {
      return NextResponse.json(
        { error: 'Creator user not found' },
        { status: 404 }
      );
    }

    // Get participant users
    const participantUsers = participants
      .map((participantId: string) => mockUsers.find(u => u.id === participantId))
      .filter(Boolean);

    // Always include creator as participant
    if (!participantUsers.some(p => p?.id === creatorId)) {
      participantUsers.push(creator);
    }

    const newRoom: ChatRoom = {
      id: generateRoomId(name),
      name: name.trim(),
      description: description?.trim() || '',
      participants: participantUsers,
      unreadCount: 0,
      createdAt: new Date(),
      type: type as 'public' | 'private' | 'group',
    };

    // Add room to mock data
    mockRooms.push(newRoom);

    // Initialize empty messages array for the room
    mockMessages[newRoom.id] = [];

    // Create system message for room creation
    const systemMessage = {
      id: `sys_${Date.now()}`,
      content: `${creator.name} created the room "${name}"`,
      senderId: 'system',
      senderName: 'System',
      senderAvatar: '',
      timestamp: new Date(),
      roomId: newRoom.id,
      type: 'system' as const,
      reactions: [],
    };
    mockMessages[newRoom.id].push(systemMessage);

    return NextResponse.json({
      success: true,
      room: newRoom,
      message: 'Room created successfully',
    });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/rooms - Update room settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomId, name, description, participants, userId } = body;

    if (!roomId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: roomId, userId' },
        { status: 400 }
      );
    }

    const room = mockRooms.find(r => r.id === roomId);
    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Check if user is a participant
    const isParticipant = room.participants.some(p => p.id === userId);
    if (!isParticipant) {
      return NextResponse.json(
        { error: 'User is not a participant in this room' },
        { status: 403 }
      );
    }

    // Update room properties
    if (name !== undefined) {
      if (name.length < 2 || name.length > 50) {
        return NextResponse.json(
          { error: 'Room name must be between 2 and 50 characters' },
          { status: 400 }
        );
      }
      room.name = name.trim();
    }

    if (description !== undefined) {
      room.description = description?.trim() || '';
    }

    if (participants !== undefined) {
      const participantUsers = participants
        .map((participantId: string) => mockUsers.find(u => u.id === participantId))
        .filter(Boolean);
      room.participants = participantUsers;
    }

    return NextResponse.json({
      success: true,
      room,
      message: 'Room updated successfully',
    });
  } catch (error) {
    console.error('Error updating room:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/rooms - Delete a room
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    const userId = searchParams.get('userId');

    if (!roomId || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters: roomId, userId' },
        { status: 400 }
      );
    }

    const roomIndex = mockRooms.findIndex(r => r.id === roomId);
    if (roomIndex === -1) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    const room = mockRooms[roomIndex];

    // Check if user is a participant (in a real app, you might want admin-only deletion)
    const isParticipant = room.participants.some(p => p.id === userId);
    if (!isParticipant) {
      return NextResponse.json(
        { error: 'User is not authorized to delete this room' },
        { status: 403 }
      );
    }

    // Remove room from arrays
    mockRooms.splice(roomIndex, 1);
    delete mockMessages[roomId];

    return NextResponse.json({
      success: true,
      message: 'Room deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting room:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}