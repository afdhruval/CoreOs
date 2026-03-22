import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";

const Dashboard = () => {

    const { handleSendMessage } = useChat();
    const [chatInput, setChatInput] = useState("");

    const chats = useSelector((state) => state.chat.chats);
    const currentChatId = useSelector((state) => state.chat.currentChatId);

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
        <main className="h-screen w-full bg-[#07090f] text-white">

            <section className="flex h-full">

                {/* Sidebar */}
                <aside className="w-[280px] bg-[#080b12] flex flex-col">
                    <h1 className="h-[80px] flex items-center px-4 text-2xl">
                        Perplexity
                    </h1>

                    <div className="flex flex-col gap-2 px-3">
                        {Object.values(chats).map((chat) => (
                            <button
                                key={chat.id}
                                className="h-[50px] border border-white/30 rounded-xl text-left px-3"
                            >
                                {chat.title}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Chat */}
                <section className="flex flex-1 flex-col">

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto flex flex-col gap-3 px-4">

                        {chats[currentChatId]?.messages?.map((msg, i) => (
                            <div
                                key={i}
                                className={`w-[75%] px-4 min-h-[50px] flex items-center rounded-2xl ${msg.role === "user"
                                        ? "self-end bg-white/10"
                                        : "self-start border border-white/20"
                                    }`}
                            >
                                {msg.content}
                            </div>
                        ))}

                    </div>

                    {/* Input */}
                    <form
                        onSubmit={handleSubmit}
                        className="h-[110px] flex items-center bg-[#080b12] px-4 gap-3"
                    >
                        <input
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 h-[65px] bg-[#0f131c] rounded-xl px-4 text-lg outline-none"
                        />

                        <button
                            type="submit"
                            className="w-[140px] h-[65px] border rounded-xl"
                        >
                            Send
                        </button>
                    </form>

                </section>
            </section>
        </main>
    );
};

export default Dashboard;