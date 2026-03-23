import { tavily } from "@tavily/core";
import "dotenv/config";

const tvly = tavily({
    apiKey: process.env.TAVILY_API_KEY
});

export const searchInternet = async (query) => {
    return await tvly.search(query, {
        maxResults: 5,
        searchDepth: "basic" 
    });
};