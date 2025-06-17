import { create } from 'zustand';
import { createChatSlice } from './slices/chat-slices';
import { ChatSlice } from './slices/chat-slices';

export const useAppStore = create<ChatSlice>()((set, get) => ({
    ...createChatSlice(set, get),
}))