import { generateMessage, generateChattitle } from "../services/ai.service.js";
import chatModel from "../model/chat.model.js";
import messageModel from "../model/message.model.js"

export async function sendMessage(req, res) {
    try {
        const { message, chat: chatId } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        let title = null;
        let chat = null;

        if (!chatId) {
            title = await generateChattitle(message);

            chat = await chatModel.create({
                user: req.user.id,
                title
            });
        }

        const currentChatId = chatId || chat._id;

        await messageModel.create({
            chat: currentChatId,
            content: message,
            role: "user"
        });

        const messages = await messageModel.find({
            chat: currentChatId
        });

        const formattedMessages = messages.map(m => ({
            role: m.role === "ai" ? "assistant" : "user",
            content: m.content
        }));

        const result = await generateMessage(formattedMessages);

        await messageModel.create({
            chat: currentChatId,
            content: result,
            role: "ai"
        });

        res.status(201).json({
            chat: chat || { _id: currentChatId },
            title,
            aiMessage: result
        });

    } catch (error) {
        console.log("ERROR:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

export async function getChats(req, res) {

    const user = req.user

    const chat = await chatModel.find({ user: user.id })

    res.status(200).json({
        message: "chatts recieved successfully",
        chat
    })

}

export async function getMessages(req, res) {

    const { chatId } = req.params

    const chat = await chatModel.findOne({
        _id: chatId,
        user: req.user.id
    })

    if (!chat) {
        return res.status(404).json({
            message: "chat not found"
        })
    }

    const messages = await messageModel.find({
        chat: chatId
    })

    res.status(200).json({
        message: "message retrived successfully",
        messages
    })
}

export async function deleteChat(req, res) {

    const { chatId } = req.params

    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: req.user.id
    })

    await messageModel.deleteMany({
        chat: chatId
    })

    if (!chat) {
        return res.status(404).json({
            message: "chat not found"
        })
    }

    res.status(200).json({
        message: "chat deleted successfully"
    })

}


