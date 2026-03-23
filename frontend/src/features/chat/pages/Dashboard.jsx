import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Dashboard = () => {
    const { handleSendMessage, handleOpenChat, handleGetChats } = useChat();

    const [chatInput, setChatInput] = useState("");

    const chats = useSelector((state) => state.chat.chats);
    const currentChatId = useSelector((state) => state.chat.currentChatId);

    useEffect(() => {
        handleGetChats();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!chatInput.trim()) return;

        handleSendMessage({
            message: chatInput,
            chatId: currentChatId
        });

        setChatInput("");
    };

    return (
        <main className="h-screen w-full bg-[#0b0f19] text-white flex">

            <aside className="w-[260px] bg-[#0f172a] border-r border-white/10 flex flex-col p-4">
                <h1 className="text-2xl font-semibold mb-4">Perplexity</h1>

                <div className="flex flex-col gap-2 overflow-y-auto">
                    {Object.values(chats || {}).map((chat) => (
                        <button
                            key={chat.id}
                            onClick={() => handleOpenChat(chat.id, chats)}
                            className="text-left px-3 py-2 rounded-lg hover:bg-white/10 transition"
                        >
                            {chat.title}
                        </button>
                    ))}
                </div>
            </aside>

            <section className="flex-1 flex flex-col relative">

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

                    {chats[currentChatId]?.messages?.map((msg, i) => (
                        <div
                            key={i}
                            className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm md:text-base ${msg.role === "user"
                                ? "ml-auto bg-blue-600/80 text-white rounded-br-none"
                                : "mr-auto bg-[#1e293b] text-white/90 rounded-bl-none"
                                }`}
                        >
                            {msg.role === "user" ? (
                                <p>{msg.content}</p>
                            ) : (
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        p: ({ children }) => (
                                            <p className="mb-2 last:mb-0">{children}</p>
                                        ),
                                        ul: ({ children }) => (
                                            <ul className="list-disc pl-5 mb-2">{children}</ul>
                                        ),
                                        ol: ({ children }) => (
                                            <ol className="list-decimal pl-5 mb-2">{children}</ol>
                                        ),
                                        code: ({ children }) => (
                                            <code className="bg-black/40 px-1 py-0.5 rounded">
                                                {children}
                                            </code>
                                        ),
                                        pre: ({ children }) => (
                                            <pre className="bg-black/50 p-3 rounded-xl overflow-x-auto mb-2">
                                                {children}
                                            </pre>
                                        )
                                    }}
                                >
                                    {msg.content}
                                </ReactMarkdown>
                            )}
                        </div>
                    ))}

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="absolute bottom-0 w-full px-6 py-4 bg-[#0b0f19] border-t border-white/10"
                >
                    <div className="flex gap-3">
                        <input
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Ask anything..."
                            className="flex-1 bg-[#1e293b] rounded-xl px-4 py-3 outline-none text-white h-[70px]"
                        />

                        <button
                            type="submit"
                            disabled={!chatInput.trim()}
                            className="px-6 py-3 h-[70px] w-[100px]  bg-blue-600 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
                        >
                            Send
                        </button>
                    </div>
                </form>

            </section>
        </main>
    );
};

export default Dashboard;