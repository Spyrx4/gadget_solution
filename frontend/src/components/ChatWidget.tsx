'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Trash2 } from 'lucide-react';
import { useChat } from '@/hooks/useChat';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, sendMessage, isLoading, clearChat } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Listen for custom event to open chat
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-chat', handleOpen);
    return () => window.removeEventListener('open-chat', handleOpen);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <>
      {/* FAB Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center hover:bg-[var(--color-primary-active)] active:scale-95 transition-all duration-200"
          style={{ boxShadow: '0 4px 24px rgba(245, 78, 0, 0.35)' }}
        >
          <Sparkles className="w-6 h-6" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-32px)] bg-[var(--color-surface-card)] rounded-[var(--radius-xl)] border border-[var(--color-hairline)] overflow-hidden flex flex-col"
          style={{
            height: '520px',
            boxShadow: '0 8px 48px rgba(38, 37, 30, 0.12)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-ink)]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Konsultan AI</p>
                <p className="text-[var(--color-muted-soft)] text-[10px]">GadgetSol Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="p-1.5 text-[var(--color-muted-soft)] hover:text-white rounded transition-colors"
                title="Hapus chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[var(--color-muted-soft)] hover:text-white rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--color-canvas-soft)]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-[var(--radius-lg)] text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[var(--color-primary)] text-white rounded-br-[var(--radius-xs)]'
                      : 'bg-[var(--color-surface-card)] text-[var(--color-ink)] border border-[var(--color-hairline)] rounded-bl-[var(--radius-xs)]'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 px-3.5 py-2.5 bg-[var(--color-surface-card)] border border-[var(--color-hairline)] rounded-[var(--radius-lg)] rounded-bl-[var(--radius-xs)]">
                  <div className="flex gap-1">
                    {/* Timeline-style thinking pills */}
                    <span
                      className="inline-block w-2 h-2 rounded-full animate-bounce"
                      style={{ backgroundColor: 'var(--color-timeline-thinking)', animationDelay: '0ms' }}
                    />
                    <span
                      className="inline-block w-2 h-2 rounded-full animate-bounce"
                      style={{ backgroundColor: 'var(--color-timeline-read)', animationDelay: '150ms' }}
                    />
                    <span
                      className="inline-block w-2 h-2 rounded-full animate-bounce"
                      style={{ backgroundColor: 'var(--color-timeline-edit)', animationDelay: '300ms' }}
                    />
                  </div>
                  <span className="text-xs text-[var(--color-muted)]">Sedang berpikir...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 bg-[var(--color-surface-card)] border-t border-[var(--color-hairline)]">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanya tentang gadget..."
                disabled={isLoading}
                className="flex-1 px-3 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[var(--radius-md)] text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted-soft)] focus:outline-none focus:border-[var(--color-primary)] transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 bg-[var(--color-primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--color-primary-active)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
