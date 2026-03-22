import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage } from "langchain";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const geminiModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
});

const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY
});


export async function generateMessage(message) {
    try {
        const result = await geminiModel.generateContent(message);
        const response = await result.response;

        return response.text();

    } catch (error) {
        console.log("Gemini failed → switching to Mistral");

        const response = await mistralModel.invoke([
            new HumanMessage(message)
        ]);

        return response.content;
    }
}


export async function generateChattitle(message) {
    const response = await mistralModel.invoke([
        new SystemMessage(`
You are a helpful assistant that generates concise and descriptive titles for chat conversations.

User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging.
        `),
        new HumanMessage(`Generate a title for a chat conversation based on: "${message}"`)
    ]);

    return response.content; // ⚠ FIXED (not .text)
}