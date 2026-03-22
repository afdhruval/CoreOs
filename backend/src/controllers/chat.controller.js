import { generateMessage, generateChattitle } from "../services/ai.service.js";
import chatModel from "../model/chat.model.js";
import messageModel from "../model/message.model.js"

export async function sendMessage(req, res) {

    const { message, chat: chatId } = req.body


    let title = null, chat = null

    if (!chatId) {
        const title = await generateChattitle(message)
        chat = await chatModel.create({
            user: req.user.id,
            title
        })
    }

    const humanMessage = await messageModel.create({
        chat: chatId || chat._id,
        content: message,
        role: "user"
    })

    const messagess = await messageModel.find({ chat: chatId })

    const result = await generateMessage(messagess)

    const messages = await messageModel.create({
        chat: chatId || chat._id,
        content: result,
        role: "ai"
    })

    console.log(messagess);


    res.status(201).json({
        aiMessagee: result,
        title,
        chat,
        messages
    })

}


