import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/lib/mockData';
import { User } from '@/types/chat';

// GET /api/users - Get all users or filter by status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as User['status'] | null;
    const search = searchParams.get('search');

    let filteredUsers = [...mockUsers];

    // Filter by status
    if (status && ['online', 'away', 'offline'].includes(status)) {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }

    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(searchLower)
      );
    }

    // Sort users: online first, then by name
    filteredUsers.sort((a, b) => {
      // Priority: online > away > offline
      const statusPriority = { online: 3, away: 2, offline: 1 };
      const aPriority = statusPriority[a.status];
      const bPriority = statusPriority[b.status];

      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }

      // If same status, sort alphabetically by name
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({
      users: filteredUsers,
      totalUsers: filteredUsers.length,
      onlineCount: mockUsers.filter(u => u.status === 'online').length,
      awayCount: mockUsers.filter(u => u.status === 'away').length,
      offlineCount: mockUsers.filter(u => u.status === 'offline').length,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user (for demo purposes)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, avatar, status = 'online' } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (name.length < 2 || name.length > 50) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 50 characters' },
        { status: 400 }
      );
    }

    // Check if user name already exists
    const existingUser = mockUsers.find(
      user => user.name.toLowerCase() === name.toLowerCase()
    );
    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this name already exists' },
        { status: 409 }
      );
    }

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      avatar: avatar || `https://placehold.co/200x200?text=${encodeURIComponent(name.charAt(0).toUpperCase())}`,
      status: status as User['status'],
      lastSeen: new Date(),
    };

    mockUsers.push(newUser);

    return NextResponse.json({
      success: true,
      user: newUser,
      message: 'User created successfully',
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/users - Update user status or profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, status, avatar } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user properties
    if (name !== undefined) {
      if (name.length < 2 || name.length > 50) {
        return NextResponse.json(
          { error: 'Name must be between 2 and 50 characters' },
          { status: 400 }
        );
      }
      
      // Check for duplicate names (excluding current user)
      const existingUser = mockUsers.find(
        u => u.id !== userId && u.name.toLowerCase() === name.toLowerCase()
      );
      if (existingUser) {
        return NextResponse.json(
          { error: 'A user with this name already exists' },
          { status: 409 }
        );
      }
      
      user.name = name.trim();
    }

    if (status !== undefined) {
      if (!['online', 'away', 'offline'].includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status. Must be online, away, or offline' },
          { status: 400 }
        );
      }
      user.status = status as User['status'];
      user.lastSeen = new Date();
    }

    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    return NextResponse.json({
      success: true,
      user,
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/users/[id] - Get specific user by ID
export async function GET_USER_BY_ID(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;

    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/users - Delete a user (for demo purposes)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    mockUsers.splice(userIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}