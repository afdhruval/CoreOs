import { useDispatch } from "react-redux";
import { getChats, sendMessage, getMessages } from "../service/chat.api.js";

import {
    createNewChat,
    addNewMessage,
    setcurrentChatId,
    setLoading,
    setChats,
} from "../chat.slice.js";

export const useChat = () => {

    const dispatch = useDispatch();

    async function handleSendMessage({ message, chatId }) {
        try {
            dispatch(setLoading(true));

            const data = await sendMessage({ message, chatId });

            const { chat, aiMessage } = data;

            dispatch(createNewChat({
                chatId: chat._id,
                title: "New Chat"
            }));

            dispatch(addNewMessage({
                chatId: chat._id,
                content: message,
                role: "user"
            }));

            dispatch(addNewMessage({
                chatId: chat._id,
                content: aiMessage,
                role: "ai"
            }));

            dispatch(setcurrentChatId(chat._id));

        } catch (error) {
            console.log("ERROR:", error);
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetChats() {
        try {
            dispatch(setLoading(true));

            const data = await getChats();
            const chats = data;

            const formattedChats = chats.reduce((acc, chat) => {
                acc[chat._id] = {
                    id: chat._id,
                    title: chat.title,
                    messages: [],
                };
                return acc;
            }, {});

            dispatch(setChats(formattedChats));

            if (chats.length > 0) {
                dispatch(setcurrentChatId(chats[0]._id));
            }

        } catch (err) {
            console.log(err);
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleOpenChat(chatId, chats) {
        try {
            dispatch(setcurrentChatId(chatId));

            if (chats[chatId]?.messages?.length > 0) return;

            dispatch(setLoading(true));

            const data = await getMessages(chatId);

            const messages = data.messages;

            messages.forEach((msg) => {
                dispatch(addNewMessage({
                    chatId,
                    content: msg.content,
                    role: msg.role
                }));
            });

        } catch (err) {
            console.log(err);
        } finally {
            dispatch(setLoading(false));
        }
    }

    return {
        handleSendMessage,
        handleGetChats,
        handleOpenChat
    };
};