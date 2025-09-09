'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User } from '@/types/chat';
import { getUserStatusColor, getUserStatusText, formatLastSeen } from '@/lib/chatUtils';
import useChatStore from '@/lib/chatStore';

interface UserListProps {
  users: User[];
  onClose: () => void;
}

export default function UserList({ users, onClose }: UserListProps) {
  const { users: allUsers } = useChatStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Get updated user data from the store
  const updatedUsers: User[] = users.map(user => 
    allUsers.find(u => u.id === user.id) || user
  );

  const filteredUsers = updatedUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineUsers = filteredUsers.filter(u => u.status === 'online');
  const awayUsers = filteredUsers.filter(u => u.status === 'away');
  const offlineUsers = filteredUsers.filter(u => u.status === 'offline');

  const UserItem = ({ user }: { user: User }) => (
    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <div className="relative flex-shrink-0">
        <Avatar className="w-10 h-10">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-sm">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${getUserStatusColor(user.status)}`} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <p className="font-medium text-sm truncate text-gray-900 dark:text-gray-100">
            {user.name}
          </p>
          <Badge 
            variant={user.status === 'online' ? 'default' : 'secondary'} 
            className="text-xs px-1.5 py-0.5"
          >
            {getUserStatusText(user.status)}
          </Badge>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {user.status === 'online' ? 'Active now' : formatLastSeen(user.lastSeen)}
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Members
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ×
          </Button>
        </div>
        
        <Input
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
        
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
          <span>{filteredUsers.length} members</span>
          <span>{onlineUsers.length} online</span>
        </div>
      </div>

      {/* User Lists */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-4">
          {/* Online Users */}
          {onlineUsers.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-2 px-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Online — {onlineUsers.length}
                </span>
              </div>
              <div className="space-y-1">
                {onlineUsers.map((user) => (
                  <UserItem key={`online-${user.id}`} user={user} />
                ))}
              </div>
            </div>
          )}

          {/* Away Users */}
          {awayUsers.length > 0 && (
            <>
              {onlineUsers.length > 0 && <Separator className="my-4" />}
              <div>
                <div className="flex items-center space-x-2 mb-2 px-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Away — {awayUsers.length}
                  </span>
                </div>
                <div className="space-y-1">
                  {awayUsers.map((user) => (
                    <UserItem key={`away-${user.id}`} user={user} />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Offline Users */}
          {offlineUsers.length > 0 && (
            <>
              {(onlineUsers.length > 0 || awayUsers.length > 0) && <Separator className="my-4" />}
              <div>
                <div className="flex items-center space-x-2 mb-2 px-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Offline — {offlineUsers.length}
                  </span>
                </div>
                <div className="space-y-1">
                  {offlineUsers.map((user) => (
                    <UserItem key={`offline-${user.id}`} user={user} />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* No Results */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No members found matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}