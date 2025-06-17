export interface ChatSlice {
  selectedChatData: Group | undefined;
  selectedChatMessages: Message[];
  groups: Group[];
  setGroups: (groups: Group[]) => void;
  setSelectedChatMessages: (messages: Message[]) => void;
  setSelectedChatData: (data: Group | undefined) => void;
  addGroup: (group: Group) => void;
  addMessage: (message: Message) => void;
  closeChat: () => void;
}

export const createChatSlice = (
  set: (partial: Partial<ChatSlice>) => void,
  get: () => ChatSlice
): ChatSlice => ({
  selectedChatData: undefined,
  selectedChatMessages: [],
  groups: [],
  setGroups: (groups) => {
    set({ groups });
  },
  setSelectedChatMessages: (selectedChatMessages) => {
    set({ selectedChatMessages });
  },
  setSelectedChatData: (selectedChatData) => {
    set({ selectedChatData });
  },
  addGroup: (group) => {
    const currentGroups = get().groups;
    const updatedGroups = [group, ...currentGroups];
    set({ groups: updatedGroups });
  },
  addMessage: (message) => {
    const currentMessages = get().selectedChatMessages;

    set({ selectedChatMessages: [...currentMessages, message] });
  },
  closeChat: () => {
    set({ selectedChatData: undefined, selectedChatMessages: [] });
  },
});
