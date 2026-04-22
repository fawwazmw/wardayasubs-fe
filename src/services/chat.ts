import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  _count: { messages: number };
}

export interface ChatMessageData {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  action?: string;
  createdAt: string;
}

export interface ChatSessionDetail {
  id: string;
  title: string;
  messages: ChatMessageData[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatResponse {
  action: 'add_subscription' | 'update_subscription' | 'query' | 'chat' | 'clarify';
  message: string;
  subscription?: any;
}

export const chatService = {
  // Session CRUD
  async getSessions(): Promise<ChatSession[]> {
    const res = await axios.get<ChatSession[]>(`${API_BASE_URL}/chat/sessions`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  async createSession(title?: string): Promise<ChatSessionDetail> {
    const res = await axios.post<ChatSessionDetail>(
      `${API_BASE_URL}/chat/sessions`,
      { title },
      { headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' } }
    );
    return res.data;
  },

  async getSession(id: string): Promise<ChatSessionDetail> {
    const res = await axios.get<ChatSessionDetail>(`${API_BASE_URL}/chat/sessions/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  async deleteSession(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/chat/sessions/${id}`, {
      headers: getAuthHeaders(),
    });
  },

  // Messages within a session
  async sendMessage(sessionId: string, message: string): Promise<ChatResponse> {
    const res = await axios.post<ChatResponse>(
      `${API_BASE_URL}/chat/sessions/${sessionId}/message`,
      { message },
      { headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' } }
    );
    return res.data;
  },

  async sendImage(sessionId: string, file: File, message?: string): Promise<ChatResponse> {
    const formData = new FormData();
    formData.append('image', file);
    if (message) formData.append('message', message);

    const res = await axios.post<ChatResponse>(
      `${API_BASE_URL}/chat/sessions/${sessionId}/image`,
      formData,
      { headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' } }
    );
    return res.data;
  },
};
