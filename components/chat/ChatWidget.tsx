'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store';

interface Message {
  id: string;
  text: string;
  sender: 'visitor' | 'vedant';
  timestamp: Date;
}

const AUTO_REPLY = "Hi! Thanks for reaching out. I'm currently unavailable but will get back to you at vedantyerne1@gmail.com as soon as possible! 🚀";

export default function ChatWidget() {
  const isOpen = useAppStore((s) => s.isChatOpen);
  const toggleChat = useAppStore((s) => s.toggleChat);
  const chatUnread = useAppStore((s) => s.chatUnread);
  const setChatUnread = useAppStore((s) => s.setChatUnread);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey there! 👋 I'm Vedant. Feel free to ask me anything or just say hello!",
      sender: 'vedant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      setChatUnread(1);
    }
  }, [isOpen, messages.length, setChatUnread]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'visitor',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Auto-reply after 1.5s
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: AUTO_REPLY,
          sender: 'vedant',
          timestamp: new Date(),
        },
      ]);
    }, 1500);
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        className="fixed bottom-8 right-8 z-[5000] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { toggleChat(); setChatUnread(0); }}
        data-cursor-label="Chat"
        data-cursor-variant="hover"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="close" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }} className="text-xl">✕</motion.span>
          ) : (
            <motion.span key="open" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-xl">💬</motion.span>
          )}
        </AnimatePresence>
        {chatUnread > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
            {chatUnread}
          </span>
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-28 right-8 z-[4999] w-80 rounded-3xl glass-strong border border-white/10 overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3"
              style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))' }}
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center font-clash font-bold text-sm text-white">
                  VY
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border border-[#111]" />
              </div>
              <div>
                <div className="font-montreal font-medium text-sm text-white">Vedant Yerne</div>
                <div className="font-mono text-[10px] text-[#A0A0A0]">Usually replies within a day</div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: 'none' }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`flex ${msg.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl font-montreal text-sm ${
                      msg.sender === 'visitor'
                        ? 'text-white rounded-tr-sm'
                        : 'text-[#F5F5F5] rounded-tl-sm'
                    }`}
                    style={{
                      background:
                        msg.sender === 'visitor'
                          ? 'linear-gradient(135deg, #3B82F6, #8B5CF6)'
                          : 'rgba(255,255,255,0.05)',
                    }}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/5 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-[#A0A0A0]"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10">
              <div className="flex gap-2 items-center">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/5 rounded-xl px-3 py-2 text-sm font-montreal text-white placeholder-[#555] outline-none border border-white/5 focus:border-blue-500/50 transition-colors"
                />
                <button
                  onClick={sendMessage}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0 transition-all hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
                >
                  ↑
                </button>
              </div>

              {/* Fallback email */}
              <div className="mt-2 text-center">
                <a
                  href="mailto:vedantyerne1@gmail.com"
                  className="font-mono text-[10px] text-[#555] hover:text-blue-400 transition-colors"
                >
                  Or email: vedantyerne1@gmail.com
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
