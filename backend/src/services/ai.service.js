import { initChatModel } from "langchain";

process.env.GOOGLE_API_KEY = "AIzaSyDj2yJ0wFxEQYmzlcV - VY_vAN7V6r78QNE"

const model = await initChatModel("google-genai:gemini-2.5-flash-lite");

export async function testAi() {
    model.invoke("what is ai and explain in 100 words ?")
        .then((res) => {
            // console.log(res.text);
        })
}