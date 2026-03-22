import { generateMessage, generateChattitle } from "../services/ai.service.js";

export async function sendMessage(req, res) {

    const { message } = req.body

    const title = await generateChattitle(message)

    const result = await generateMessage(message)

    res.json({
        aiMessagee: result,
        title
    })

}


