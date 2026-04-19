'use client';

import React, { useState } from 'react';
import { Search, MoreVertical, Send, CheckCheck, Paperclip, ImageIcon, Check, Building2, User } from 'lucide-react';

// --- MOCK DATA ---
const MOCK_CHATS = [
  {
    id: 'c1',
    name: 'Budi Santoso',
    type: 'Developer (PT Properti Jaya)',
    avatar: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=3B5BDB&color=fff',
    lastMessage: 'Halo Bapak, untuk jadwal survei besok jam 10 pagi apakah masih sesuai?',
    time: '10:30',
    unread: 2,
    online: true,
  },
  {
    id: 'c2',
    name: 'Sari Indah',
    type: 'Agen Independen',
    avatar: 'https://ui-avatars.com/api/?name=Sari+Indah&background=10B981&color=fff',
    lastMessage: 'Sertifikat SHM sudah kami siapkan draftnya.',
    time: 'Kemarin',
    unread: 0,
    online: false,
  },
  {
    id: 'c3',
    name: 'PropNest Support',
    type: 'Sistem',
    avatar: 'https://ui-avatars.com/api/?name=PropNest&background=0f172a&color=fff',
    lastMessage: 'Selamat datang di PropNest! Temukan hunian idaman Anda.',
    time: '12 Okt',
    unread: 0,
    online: true,
  }
];

const MOCK_MESSAGES = [
  { id: 'm1', senderId: 'c1', text: 'Selamat pagi, dengan Budi dari PT Properti Jaya.', time: '10:00', isMe: false },
  { id: 'm2', senderId: 'me', text: 'Pagi Pak Budi, saya yang berminat dengan unit di BSB City.', time: '10:05', isMe: true },
  { id: 'm3', senderId: 'c1', text: 'Baik Pak. Terkait jadwal survei yang Bapak ajukan...', time: '10:29', isMe: false },
  { id: 'm4', senderId: 'c1', text: 'Halo Bapak, untuk jadwal survei besok jam 10 pagi apakah masih sesuai?', time: '10:30', isMe: false },
];

export default function InboxPage() {
  const [activeChat, setActiveChat] = useState(MOCK_CHATS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');

  const filteredChats = MOCK_CHATS.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-display font-semibold text-text-dark mb-1">Kotak Masuk</h2>
        <p className="text-sm text-text-gray font-medium">Kelola pesan dan komunikasi Anda dengan agen atau developer.</p>
      </div>

      <div className="bg-white-pure rounded-3xl shadow-sm border border-border-line/20 overflow-hidden flex h-[600px]">
        
        {/* LEFT PANE - CHAT LIST */}
        <div className="w-1/3 border-r border-border-line/30 flex flex-col bg-surface-gray/10">
          <div className="p-5 border-b border-border-line/30">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-gray/50" size={16} />
              <input 
                type="text" 
                placeholder="Cari pesan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface-gray rounded-xl text-sm border-none focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`w-full p-4 flex items-start gap-4 border-b border-border-line/10 transition-all text-left
                  ${activeChat.id === chat.id ? 'bg-brand-blue/5 relative' : 'hover:bg-surface-gray/50'}
                `}
              >
                {activeChat.id === chat.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-blue rounded-r-full"></div>
                )}
                
                <div className="relative shrink-0">
                  <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                  {chat.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white-pure rounded-full"></span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-sm font-bold text-text-dark truncate pr-2">{chat.name}</h4>
                    <span className={`text-[10px] font-medium shrink-0 ${chat.unread > 0 ? 'text-brand-blue' : 'text-text-gray/70'}`}>
                      {chat.time}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${chat.unread > 0 ? 'font-semibold text-text-dark' : 'text-text-gray'}`}>
                    {chat.lastMessage}
                  </p>
                </div>
                
                {chat.unread > 0 && (
                  <div className="shrink-0 mt-6">
                    <span className="w-5 h-5 flex items-center justify-center bg-brand-blue text-white-pure text-[10px] font-bold rounded-full">
                      {chat.unread}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT PANE - ACTIVE CHAT */}
        <div className="w-2/3 flex flex-col bg-white-pure relative">
          {/* Chat Header */}
          <div className="p-4 px-6 border-b border-border-line/30 flex items-center justify-between bg-white-pure/90 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <img src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-full shadow-sm" />
              <div>
                <h3 className="font-semibold text-text-dark text-sm">{activeChat.name}</h3>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-text-gray">
                  {activeChat.type.includes('Developer') ? <Building2 size={12} /> : <User size={12} />}
                  {activeChat.type}
                </div>
              </div>
            </div>
            <button className="p-2 text-text-gray hover:text-brand-blue hover:bg-brand-blue/5 rounded-full transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed bg-opacity-5">
            <div className="flex justify-center mb-6">
              <span className="px-3 py-1 bg-surface-gray/80 text-[10px] font-medium text-text-gray rounded-full">
                Hari ini
              </span>
            </div>
            
            {MOCK_MESSAGES.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                {!msg.isMe && (
                  <img src={activeChat.avatar} alt="avatar" className="w-8 h-8 rounded-full mr-3 self-end shadow-sm" />
                )}
                
                <div className={`max-w-[70%] ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div 
                    className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
                      msg.isMe 
                        ? 'bg-brand-blue text-white-pure rounded-br-sm' 
                        : 'bg-[#F1F5F9] text-text-dark rounded-bl-sm border border-border-line/40'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1 mt-1 px-1">
                    <span className="text-[10px] text-text-gray/70">{msg.time}</span>
                    {msg.isMe && <CheckCheck size={14} className="text-brand-blue" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white-pure border-t border-border-line/30">
            <div className="flex items-center gap-3 bg-surface-gray/50 rounded-full p-2 pr-3 border border-border-line/50 focus-within:border-brand-blue/50 focus-within:bg-white-pure transition-all shadow-inner">
              <button className="p-2 text-text-gray/70 hover:text-brand-blue transition-colors">
                <Paperclip size={18} />
              </button>
              <button className="p-2 text-text-gray/70 hover:text-brand-blue transition-colors -ml-2">
                <ImageIcon size={18} />
              </button>
              
              <input 
                type="text" 
                placeholder="Ketik pesan Anda..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 bg-transparent border-none text-sm focus:outline-none text-text-dark placeholder:text-text-gray/50 px-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && messageText.trim()) {
                    setMessageText('');
                  }
                }}
              />
              
              <button 
                className={`p-2.5 rounded-full flex items-center justify-center transition-all ${
                  messageText.trim() 
                    ? 'bg-brand-blue text-white-pure shadow-md hover:bg-brand-blue-hover hover:scale-105 active:scale-95' 
                    : 'bg-surface-gray text-text-gray cursor-not-allowed'
                }`}
              >
                <Send size={16} className={messageText.trim() ? 'translate-x-0.5 -translate-y-0.5' : ''} />
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
