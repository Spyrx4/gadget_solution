'use client';

import { useState } from 'react';
import { aiApi } from '@/lib/ai-api';
import { ChatMessage, ChatResponse } from '@/lib/types';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Halo! 👋 Saya Konsultan AI GadgetSol. Mau cari gadget apa hari ini? Saya bisa bantu rekomendasikan smartphone, laptop, tablet, atau smartwatch yang cocok buat kamu!',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    const userMessage: ChatMessage = { role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await aiApi.post<ChatResponse>('/api/chat', {
        message: content,
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.data.message,
        sources: response.data.sources,
        timestamp: response.data.timestamp,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Maaf, saya sedang mengalami kendala teknis. Silakan coba lagi dalam beberapa saat. 🙏',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Halo! 👋 Saya Konsultan AI GadgetSol. Ada yang bisa saya bantu?',
      },
    ]);
  };

  return { messages, sendMessage, isLoading, clearChat };
}
