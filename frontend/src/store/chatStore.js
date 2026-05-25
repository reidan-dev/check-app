/**
 * Check-App Chat State Store
 * Zustand store for managing chat state and actions
 */

import { create } from 'zustand';
import ChatState from '../constants/chatStates';

const initialState = {
     // Messages array
    messages: [],

       // Current chat state
     chatState: ChatState.GREET,

      // User data collected during conversation
     userData: {
        name: "",
        symptoms: "",
        specialist: "",
        location: ""
      },

       // UI states
     isTyping: false,
};

export const useChatStore = create((set) => ({
     ...initialState,

    // Reset store to initial state
    resetStore: () => set(initialState),

       // Add a message to the messages array
    addMessage: (message) => set(
        (state) => ({ messages: [...state.messages, message] })
      ),

       // Clear all messages
    clearMessages: () => set({ messages: [] }),

       // Set current chat state
    setChatState: (newState) => set({ chatState: newState }),

       // Update user data (partial update)
    updateUserData: (updates) => set(
        (state) => ({ userData: { ...state.userData, ...updates } })
      ),

       // Set specific user data field
    setUserDataField: (field, value) => set(
        (state) => ({ userData: { ...state.userData, [field]: value } })
      ),

       // Reset user data
    resetUserData: () => set({ userData: initialState.userData }),

       // Set typing indicator
    setIsTyping: (isTyping) => set({ isTyping }),

       // Add bot message helper
     addBotMessage: (text) => set((state) => ({
         messages: [
            ...state.messages,
            { id: Date.now(), type: "bot", text, timestamp: new Date() }
          ]
      })),

       // Add user message helper
    addUserMessage: (text) => set((state) => ({
         messages: [
            ...state.messages,
             { id: Date.now(), type: "user", text, timestamp: new Date() }
           ]
      })),

       // Show quick reply buttons
    showQuickReplies: (options) => set((state) => ({
        messages: [
            ...state.messages,
            { id: Date.now(), type: "quick_replies", options, timestamp: new Date() }
         ]
      })),

       // Remove quick replies from view
    removeQuickReplies: () => set((state) => ({
       messages: state.messages.filter(m => m.type !== "quick_replies")
      })),
}));

export default useChatStore;
