import { useDispatch } from "react-redux";
import { sendMessage } from "../service/chat.api.js";
import {
    createNewChat,
    addNewMessage,
    setcurrentChatId,
    setLoading
} from "../chat.slice.js";

export const useChat = () => {

    const dispatch = useDispatch();

    async function handleSendMessage({ message, chatId }) {
        try {
            dispatch(setLoading(true));

            // ✅ IMPORTANT (await)
            const data = await sendMessage({ message, chatId });

            const { chat, aiMessage } = data;

            dispatch(createNewChat({
                chatId: chat._id,
                title: "New Chat"
            }));

            // user message
            dispatch(addNewMessage({
                chatId: chat._id,
                content: message,
                role: "user"
            }));

            // ai message
            dispatch(addNewMessage({
                chatId: chat._id,
                content: aiMessage,
                role: "ai"
            }));

            dispatch(setcurrentChatId(chat._id));

        } catch (error) {
            console.log("ERROR:", error);
        }
    }

    return {
        handleSendMessage
    };
};