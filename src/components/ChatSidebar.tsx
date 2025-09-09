'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import useChatStore from '@/lib/chatStore';
import { formatTimestamp, getUserStatusColor } from '@/lib/chatUtils';
import { useTheme } from 'next-themes';
import { mockUsers } from '@/lib/mockData';

export default function ChatSidebar() {
  const {
    currentUser,
    currentRoom,
    rooms,
    users,
    setCurrentRoom,
    setCurrentUser,
    createRoom,
    updateUserStatus,
  } = useChatStore();
  
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');
  const [newRoomType, setNewRoomType] = useState<'public' | 'private' | 'group'>('public');

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) return;
    
    createRoom({
      name: newRoomName,
      description: newRoomDescription,
      type: newRoomType,
    });
    
    setNewRoomName('');
    setNewRoomDescription('');
    setNewRoomType('public');
    setIsCreateRoomOpen(false);
  };

  const handleUserSwitch = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const handleStatusChange = (status: 'online' | 'away' | 'offline') => {
    if (currentUser) {
      updateUserStatus(currentUser.id, status);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Chat App
          </h1>
          <div className="flex items-center space-x-2">
            <Label htmlFor="theme-switch" className="text-sm">
              Dark
            </Label>
            <Switch
              id="theme-switch"
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
        </div>

        {/* Current User Profile */}
        {currentUser && (
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${getUserStatusColor(currentUser.status)}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{currentUser.name}</p>
              <Select value={currentUser.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full h-6 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="away">Away</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* User Switcher */}
        <div className="mt-3">
          <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Switch User</Label>
          <Select value={currentUser?.id || ''} onValueChange={handleUserSwitch}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select user..." />
            </SelectTrigger>
            <SelectContent>
              {mockUsers.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getUserStatusColor(user.status)}`} />
                    <span>{user.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search and Create Room */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2 mb-3">
          <Input
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Dialog open={isCreateRoomOpen} onOpenChange={setIsCreateRoomOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                +
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Room</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="room-name">Room Name</Label>
                  <Input
                    id="room-name"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="Enter room name..."
                  />
                </div>
                <div>
                  <Label htmlFor="room-description">Description</Label>
                  <Textarea
                    id="room-description"
                    value={newRoomDescription}
                    onChange={(e) => setNewRoomDescription(e.target.value)}
                    placeholder="Room description..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="room-type">Room Type</Label>
                  <Select value={newRoomType} onValueChange={(value: 'public' | 'private' | 'group') => setNewRoomType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="group">Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreateRoom} className="w-full">
                  Create Room
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Rooms List */}
      <div className="flex-1">
        <ScrollArea className="h-full">
          <div className="p-2">
            <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block px-2">
              ROOMS ({filteredRooms.length})
            </Label>
            
            {filteredRooms.map((room) => (
              <Button
                key={room.id}
                variant={currentRoom?.id === room.id ? 'secondary' : 'ghost'}
                className="w-full justify-start mb-1 h-auto p-3"
                onClick={() => setCurrentRoom(room)}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="relative flex-shrink-0">
                    <Avatar className="w-8 h-8">
                      {room.avatar ? (
                        <AvatarImage src={room.avatar} alt={room.name} />
                      ) : (
                        <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          {room.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {room.type === 'private' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border border-white dark:border-gray-800" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">{room.name}</p>
                      {room.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs px-1 py-0 h-5 min-w-5 flex items-center justify-center">
                          {room.unreadCount > 99 ? '99+' : room.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {room.lastMessage 
                        ? `${room.lastMessage.senderName}: ${room.lastMessage.content}`
                        : room.description
                      }
                    </p>
                    {room.lastMessage && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {formatTimestamp(room.lastMessage.timestamp)}
                      </p>
                    )}
                  </div>
                </div>
              </Button>
            ))}
          </div>
          
          <Separator className="my-4" />
          
          {/* Online Users */}
          <div className="p-2">
            <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block px-2">
              ONLINE USERS ({users.filter(u => u.status === 'online').length})
            </Label>
            
            {users.filter(u => u.status === 'online').map((user) => (
              <div key={user.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="relative flex-shrink-0">
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${getUserStatusColor(user.status)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user.name}</p>
                  {user.status === 'online' && (
                    <p className="text-xs text-green-500">Active now</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}