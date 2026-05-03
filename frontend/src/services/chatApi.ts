import type { ChatRequest, ChatResponse } from '../types';
import { request } from './apiClient';

export function sendChatMessage(token: string, payload: ChatRequest): Promise<ChatResponse> {
  return request<ChatResponse>('/api/chat', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}
