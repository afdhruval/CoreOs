import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import {
    HumanMessage,
    SystemMessage,
    AIMessage,
    tool,
    createAgent
} from "langchain";
import * as z from "zod";
import { tavily } from "@tavily/core";

/* ==============================
   🔌 Tavily Setup
============================== */
const tvly = tavily({
    apiKey: process.env.TAVILY_API_KEY
});

/* ==============================
   🔍 Tool (CLEAN + SAFE)
============================== */
const searchInternetFn = async ({ query }) => {
    try {
        const result = await tvly.search(query, {
            maxResults: 3,
            searchDepth: "basic"
        });

        // 👉 only useful text extract karo
        const cleanResults = (result.results || []).map(r => ({
            title: r.title,
            content: r.content,
            url: r.url
        }));

        return {
            content: JSON.stringify(cleanResults)
        };

    } catch (err) {
        return {
            content: "No internet results found."
        };
    }
};

/* ==============================
   🛠 Tool Wrapper
============================== */
const searchInternetTool = tool(searchInternetFn, {
    name: "search_internet",
    description: `
Use this tool ONLY for latest or real-time info.

IMPORTANT:
- Call only once
- After getting result → give final answer
- Do NOT loop
`,
    schema: z.object({
        query: z.string()
    })
});

/* ==============================
   🤖 MODELS (FIXED)
============================== */
const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-flash-latest", // ✅ fixed (no 404)
    apiKey: process.env.GOOGLE_API_KEY,
});

const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY
});

/* ==============================
   🧠 AGENT (ANTI-LOOP)
============================== */
const createInternetAgent = (model) =>
    createAgent({
        model,
        tools: [searchInternetTool],
        systemPrompt: `
You are a smart AI assistant.

Rules:
- Use tool only if necessary
- Never call tool more than once
- After tool → generate FINAL answer
- Keep answer clean text (no JSON)
`
    });

/* ==============================
   💬 MESSAGE GENERATOR
============================== */
export async function generateMessage(messages) {
    try {
        const agent = createInternetAgent(geminiModel);

        const response = await agent.invoke(
            {
                messages: messages.map(msg =>
                    msg.role === "user"
                        ? new HumanMessage(msg.content)
                        : new AIMessage(msg.content)
                )
            },
            { recursionLimit: 20 } // ✅ safe limit
        );

        return extractText(response);

    } catch (error) {
        console.log("⚠ Gemini failed → switching to Mistral");

        try {
            const agent = createInternetAgent(mistralModel);

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

        } catch (err) {
            console.error("🔥 Mistral also failed:", err);
            return "Something went wrong. Please try again.";
        }
    }
}

/* ==============================
   🧹 RESPONSE CLEANER (VERY IMPORTANT)
============================== */
function extractText(response) {
    try {
        const last = response.messages.at(-1);

        // case 1: normal string
        if (typeof last.content === "string") {
            return last.content;
        }

        // case 2: array (fix for mongoose error)
        if (Array.isArray(last.content)) {
            return last.content
                .map(item => item.text || "")
                .join("");
        }

        return JSON.stringify(last.content);

    } catch {
        return "Error parsing response.";
    }
}

/* ==============================
   🏷 CHAT TITLE
============================== */
export async function generateChattitle(message) {
    const response = await mistralModel.invoke([
        new SystemMessage(`
Generate a short 2-4 word title.
Return only text.
        `),
        new HumanMessage(message)
    ]);

    return typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);
}