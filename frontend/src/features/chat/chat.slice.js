import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null
    },

    reducers: {

        createNewChat: (state, action) => {
            const { chatId, title } = action.payload;

            if (!state.chats[chatId]) {
                state.chats[chatId] = {
                    id: chatId,
                    title,
                    messages: [],
                    createdAt: new Date().toISOString()
                };
            }
        },

        addNewMessage: (state, action) => {
            const { chatId, message } = action.payload;

            if (!state.chats[chatId]) return;

            if (!state.chats[chatId].messages) {
                state.chats[chatId].messages = [];
            }

            state.chats[chatId].messages.push(message);

            // ✅ force re-render
            state.chats = { ...state.chats };
        },

        setcurrentChatId: (state, action) => {
            state.currentChatId = action.payload;
        },

        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },

        setError: (state, action) => {
            state.error = action.payload;
        },

        setChats: (state, action) => {
            state.chats = action.payload;
        },

        deleteChat: (state, action) => {
            const chatId = action.payload;

            delete state.chats[chatId];

            if (state.currentChatId === chatId) {
                state.currentChatId = null;
            }
        }
    }
});

export const {
    createNewChat,
    addNewMessage,
    setcurrentChatId,
    setLoading,
    setError,
    setChats,
    deleteChat
} = chatSlice.actions;

export default chatSlice.reducer;