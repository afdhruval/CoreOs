import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatOpenAI } from "@langchain/openai";
import {
    HumanMessage,
    SystemMessage,
    AIMessage,
    tool,
    createAgent 
} from "langchain";
import * as z from "zod";
import { tavily } from "@tavily/core";

const tvly = tavily({
    apiKey: process.env.TAVILY_API_KEY
});

const searchInternetFn = async ({ query }) => {
    try {
        const result = await tvly.search(query, {
            maxResults: 3,
            searchDepth: "basic"
        });
        const cleanResults = (result.results || []).map(r => ({
            title: r.title,
            content: r.content,
            url: r.url
        }));
        return { content: JSON.stringify(cleanResults) };
    } catch (err) {
        return { content: "No internet results found." };
    }
};

const searchInternetTool = tool(searchInternetFn, {
    name: "search_internet",
    description: "Use this tool ONLY for latest or real-time info. IMPORTANT: Call only once, then give final answer.",
    schema: z.object({ query: z.string() })
});

const getModelInstance = (modelId) => {
    if (modelId.includes('gemini')) {
        return new ChatGoogleGenerativeAI({
            model: modelId === 'gemini-1.5-flash' ? 'gemini-1.5-flash-latest' : 'gemini-1.5-pro-latest',
            apiKey: process.env.GOOGLE_API_KEY,
        });
    } else if (modelId.includes('mistral')) {
        return new ChatMistralAI({
            model: modelId === 'mistral-small' ? 'mistral-small-latest' : 'mistral-large-latest',
            apiKey: process.env.MISTRAL_API_KEY
        });
    } else if (modelId.includes('gpt')) {
        return new ChatOpenAI({
            modelName: modelId,
            openAIApiKey: process.env.OPENAI_API_KEY
        });
    }
    // Default
    return new ChatGoogleGenerativeAI({
        model: "gemini-1.5-flash-latest",
        apiKey: process.env.GOOGLE_API_KEY,
    });
};

const createInternetAgent = (model) =>
    createAgent({
        model,
        tools: [searchInternetTool],
        systemPrompt: `You are a smart AI assistant. Rules: Use tool only if necessary. Never call tool more than once. Generate FINAL answer. Keep answer concise and professional.`
    });

export async function generateMessage(messages, modelId = 'gemini-1.5-flash') {
    try {
        const model = getModelInstance(modelId);
        const agent = createInternetAgent(model);

        const response = await agent.invoke(
            {
                messages: messages.map(msg =>
                    msg.role === "user"
                        ? new HumanMessage(msg.content)
                        : new AIMessage(msg.content)
                )
            },
            { recursionLimit: 20 }
        );

        return extractText(response);
    } catch (error) {
        console.log(`⚠ Primary model (${modelId}) failed → falling back to gemini-flash`);
        try {
            const fallbackModel = getModelInstance('gemini-1.5-flash');
            const agent = createInternetAgent(fallbackModel);
            const response = await agent.invoke({
                messages: messages.map(msg => msg.role === "user" ? new HumanMessage(msg.content) : new AIMessage(msg.content))
            }, { recursionLimit: 20 });
            return extractText(response);
        } catch (err) {
            console.error("🔥 All models failed:", err);
            return "I apologize, but I encountered an error processing your request. Please try again shortly.";
        }
    }
}

function extractText(response) {
    try {
        const last = response.messages.at(-1);
        if (typeof last.content === "string") return last.content;
        if (Array.isArray(last.content)) return last.content.map(item => item.text || "").join("");
        return JSON.stringify(last.content);
    } catch {
        return "Error parsing response.";
    }
}

export async function generateChattitle(message) {
    const model = getModelInstance('mistral-small');
    const response = await model.invoke([
        new SystemMessage("Generate a short 2-4 word title. Return only the title text."),
        new HumanMessage(message)
    ]);
    return typeof response.content === "string" ? response.content : JSON.stringify(response.content);
}