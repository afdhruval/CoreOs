import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '../../auth/hook/useAuth';
import { sendMessageApi, getChatsApi, getMessagesApi } from '../service/chat.api';
import './dashboard.scss';

const TypewriterText = ({ content, speed = 10, onComplete }) => {
    const [displayedText, setDisplayedText] = useState("");
    const index = useRef(0);
    useEffect(() => {
        setDisplayedText(""); index.current = 0;
        let timeout;
        const type = () => {
            if (index.current < content.length) {
                setDisplayedText((prev) => prev + content.charAt(index.current));
                index.current += 1;
                timeout = setTimeout(type, speed);
            } else if (onComplete) { onComplete(); }
        };
        type(); return () => clearTimeout(timeout);
    }, [content]);
    return (
        <span className="typewriter-container">
            <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayedText}</ReactMarkdown>
            </div>
            {index.current < content.length && <span className="type-cursor"></span>}
        </span>
    );
};

const UnifiedChatInput = ({ placeholder, val, onChange, onSend, onToggleModels, isModelSelectorOpen, ModelSelector, isLoading }) => (
    <div className="discovery-input-card-v2">
        <textarea placeholder={placeholder} value={val} onChange={e => onChange(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && onSend(e)} />
        <div className="input-actions-row">
            <div className="left" style={{ position: 'relative' }}>
                <button className="action-ic" onClick={onToggleModels}><i className="ri-add-line"></i></button>
                {isModelSelectorOpen && <ModelSelector />}
            </div>
            <div className="right">
                <button className="action-ic"><i className="ri-mic-line"></i></button>
                <button className="send-circle" onClick={onSend} disabled={!val.trim() || isLoading}>
                    <i className={isLoading ? "ri-loader-4-line spin" : "ri-arrow-up-line"}></i>
                </button>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const { handleGetme, handleLogout } = useAuth();
    const navigate = useNavigate();

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'normal-dark');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isThemeSubmenuOpen, setIsThemeSubmenuOpen] = useState(false);
    const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [chatInput, setChatInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chats, setChats] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [currentModel, setCurrentModel] = useState({ id: 'gpt-4o-mini', name: 'GPT-4o mini', provider: 'OpenAI' });
    const [latestAiMsgId, setLatestAiMsgId] = useState(null);
    
    const messagesEndRef = useRef(null);
    const viewportRef = useRef(null);
    const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };

    useEffect(() => { scrollToBottom(); }, [messages, isLoading]);

    const [freeChatsLeft, setFreeChatsLeft] = useState(() => {
        const stored = localStorage.getItem('freeChatsLeft');
        return stored !== null ? parseInt(stored) : 3;
    });

    useEffect(() => {
        const handleKeyDown = (e) => { 
            if (e.key === 'Escape') {
                setIsSearchModalOpen(false);
                setIsQuotaModalOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        handleGetme();
    }, []);

    useEffect(() => { if (user) fetchChats(); else setChats([]); }, [user]);

    const fetchChats = async () => {
        try { const data = await getChatsApi(); setChats(data.chat || []); } catch (err) { console.error(err); }
    };

    const fetchMessages = async (chatId) => {
        try {
            setLatestAiMsgId(null);
            const data = await getMessagesApi(chatId);
            setMessages(data.messages || []);
            setCurrentChatId(chatId);
            setIsMobileSidebarOpen(false);
            setIsSearchModalOpen(false);
        } catch (err) { toast.error("Failed to load history"); }
    };

    const applyThemeSelection = (newTheme) => {
        setTimeout(() => {
            setTheme(newTheme); localStorage.setItem('theme', newTheme);
            document.documentElement.setAttribute('data-theme', newTheme);
            setIsUserMenuOpen(false);
            setIsThemeSubmenuOpen(false);
        }, 150);
    };

    const handleSignOut = () => {
        handleLogout();
        setIsUserMenuOpen(false);
        navigate('/');
    };

    const handleNewChat = () => { setCurrentChatId(null); setMessages([]); setChatInput(''); setIsMobileSidebarOpen(false); setLatestAiMsgId(null); };

    const handleSendMessage = async (e, forcedContent) => {
        if (e) e.preventDefault();
        const msgContent = forcedContent || chatInput.trim();
        if (!msgContent) return;
        
        // Quota check for guests
        if (!user && freeChatsLeft <= 0) {
            setIsQuotaModalOpen(true);
            return;
        }

        setIsLoading(true); setChatInput(''); 
        try {
            const tempMsg = { _id: 'user-' + Date.now(), content: msgContent, role: 'user' };
            setMessages(prev => [...prev, tempMsg]);
            
            const data = await sendMessageApi({ message: msgContent, chat: currentChatId, model: currentModel.id });
            
            if (!user) {
                const nextFree = freeChatsLeft - 1;
                setFreeChatsLeft(nextFree);
                localStorage.setItem('freeChatsLeft', nextFree.toString());
            }

            if (!currentChatId && !data.isGuest) {
                setCurrentChatId(data.chat._id); fetchChats();
            } else if (data.isGuest) {
                setCurrentChatId(data.chat._id); // Temporarily set for the session
            }

            const aiId = 'ai-' + Date.now();
            setLatestAiMsgId(aiId);
            setMessages(prev => [...prev, { _id: aiId, content: data.aiMessage, role: 'ai' }]);
        } catch (err) { 
            toast.error("Error sending message"); 
            console.error(err);
        } finally { setIsLoading(false); }
    };

    const handleCopy = (text) => { navigator.clipboard.writeText(text); toast.success("Copied to clipboard!"); };

    const handleShare = (text) => {
        if (navigator.share) {
            navigator.share({ title: 'Coreos Chat', text: text, url: window.location.href })
                .then(() => toast.success("Shared successfully!"))
                .catch(() => toast.error("Share cancelled"));
        } else {
            handleCopy(text);
            toast.success("Link copied to clipboard for sharing!");
        }
    };

    const groupChatsByDate = (chatList) => {
        const groups = { Today: [], Yesterday: [], 'Last 7 Days': [], 'Older': [] };
        const now = new Date();
        (chatList || []).forEach(chat => {
            if (!chat) return;
            const date = new Date(chat.createdAt || Date.now());
            const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
            if (diffDays === 0) groups.Today.push(chat);
            else if (diffDays === 1) groups.Yesterday.push(chat);
            else if (diffDays < 7) groups['Last 7 Days'].push(chat);
            else groups.Older.push(chat);
        });
        return groups;
    };

    const filteredChats = (chats || []).filter(chat => chat && chat.title && chat.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const groupedChats = groupChatsByDate(filteredChats);

    const models = [
        { category: 'OpenAI', list: [
            { id: 'gpt-4o-mini', name: 'GPT-4o mini', provider: 'OpenAI' },
            { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' }
        ]},
        { category: 'Google Generative AI', list: [
            { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google' },
            { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google' }
        ]},
        { category: 'Mistral AI', list: [
            { id: 'mistral-small', name: 'Mistral Small', provider: 'Mistral' },
            { id: 'mistral-large', name: 'Mistral Large', provider: 'Mistral' }
        ]}
    ];

    const ModelSelector = () => (
        <div className="model-selector-popover-v2 animate-popover">
            <div className="pop-header-v2"><i className="ri-search-line"></i><input type="text" placeholder="Search models..." /></div>
            <div className="pop-body-v2">
                {models.map(cat => (
                    <div key={cat.category} className="cat-section">
                        <p className="cat-title">{cat.category}</p>
                        {cat.list.map(m => (
                            <div key={m.id} className={`m-row ${currentModel.id === m.id ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); setCurrentModel(m); setIsModelSelectorOpen(false); }}>
                                <div className="m-icon-box"><i className={m.provider === 'OpenAI' ? "ri-openai-fill" : (m.provider === 'Mistral' ? "ri-sparkling-2-line" : "ri-google-fill")}></i></div>
                                <span className="m-name">{m.name}</span>
                                {currentModel.id === m.id && <i className="ri-check-line select-check"></i>}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className={`dashboard-layout ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`}>
            {isMobileSidebarOpen && <div className="sidebar-overlay active" onClick={() => setIsMobileSidebarOpen(false)} />}

            {isSearchModalOpen && (
                <div className="global-search-overlay" onClick={() => setIsSearchModalOpen(false)}>
                    <div className="global-search-modal animate-popover" onClick={e => e.stopPropagation()}>
                        <div className="search-header">
                            <i className="ri-search-line"></i>
                            <input autoFocus type="text" placeholder="Search your chats..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            <kbd onClick={() => setIsSearchModalOpen(false)}>ESC</kbd>
                        </div>
                        <div className="search-results-body">
                            {Object.entries(groupedChats).map(([label, list]) => list.length > 0 && (
                                <div key={label} className="search-group">
                                    <h4 className="group-label">{label}</h4>
                                    {list.map(chat => (
                                        <div key={chat._id} className="search-chat-item" onClick={() => fetchMessages(chat._id)}>
                                            <div className="chat-info"><i className="ri-message-3-line"></i><span className="chat-title">{chat.title}</span></div>
                                            <span className="chat-time">{new Date(chat.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {isQuotaModalOpen && (
                <div className="global-search-overlay" onClick={() => setIsQuotaModalOpen(false)}>
                    <div className="global-search-modal quota-modal animate-popover" onClick={e => e.stopPropagation()}>
                        <div className="quota-content">
                            <i className="ri-error-warning-line main-icon"></i>
                            <h2>Free Quota Exhausted</h2>
                            <p>You have used your 3 free guest messages. <br/> Please sign in to continue chatting with COREOS AI.</p>
                            <div className="quota-actions">
                                <button className="login-primary" onClick={() => navigate('/login')}>Sign In</button>
                                <button className="cancel-secondary" onClick={() => setIsQuotaModalOpen(false)}>Maybe Later</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <aside className={`sidebar ${!isSidebarOpen ? 'collapsed' : ''} ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-content">
                    <div className="top-nav-area">
                        <div className="logo-row-premium">
                            <div className="logo-group"><div className="premium-logo-box"><div className="inner-circle"></div></div><span className="logo-name">COREOS</span></div>
                            <button className="sidebar-toggle-btn" onClick={() => setIsSidebarOpen(false)}><i className="ri-layout-left-line"></i></button>
                        </div>
                        <div className="action-buttons-stack">
                            <button className="nav-item highlighted main-new-chat" onClick={handleNewChat}><i className="ri-add-line"></i><span>New Chat</span></button>
                            <button className="nav-item" onClick={() => setIsSearchModalOpen(true)}><i className="ri-search-line"></i><span>Search</span></button>
                        </div>
                    </div>
                    <div className="middle-list-area">
                        <div className="list-label">RECENT</div>
                        <div className="chats-list">
                            {chats.slice(0, 15).map(chat => (
                                <div key={chat._id} className={`chat-row-item ${currentChatId === chat._id ? 'active' : ''}`} onClick={() => fetchMessages(chat._id)}><span className="title">{chat.title}</span></div>
                            ))}
                        </div>
                    </div>
                    <div className="sidebar-footer-v2">
                        {user ? (
                            <div className="user-area-relative">
                                {isUserMenuOpen && (
                                    <div className="user-popover-box-fixed-v2 animate-popover">
                                        {!isThemeSubmenuOpen ? (
                                            <>
                                                <div className="pop-header-v3"><p className="username">{user.username}</p><p className="email">{user.email}</p></div>
                                                <div className="pop-menu-v3">
                                                    <button className="pop-btn" onClick={(e) => { e.stopPropagation(); setIsThemeSubmenuOpen(true); }}><i className="ri-sun-line"></i><span>Theme</span></button>
                                                    <button className="pop-btn" onClick={() => navigate('/settings')}><i className="ri-settings-4-line"></i><span>Settings</span></button>
                                                    <button className="pop-btn logout" onClick={handleSignOut}><i className="ri-logout-box-r-line"></i><span>Log out</span></button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="pop-header-v3 submenu">
                                                    <button className="back-btn" onClick={(e) => { e.stopPropagation(); setIsThemeSubmenuOpen(false); }}><i className="ri-arrow-left-s-line"></i></button>
                                                    <p className="title">Theme</p>
                                                </div>
                                                <div className="pop-menu-v3">
                                                    <button className={`pop-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => applyThemeSelection('light')}><i className="ri-sun-line"></i><span>Light</span></button>
                                                    <button className={`pop-btn ${theme === 'normal-dark' ? 'active' : ''}`} onClick={() => applyThemeSelection('normal-dark')}><i className="ri-moon-line"></i><span>Dark</span></button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                                <div className="user-pill-v2" onClick={() => { setIsUserMenuOpen(!isUserMenuOpen); setIsThemeSubmenuOpen(false); }}>
                                    <div className="avatar-circle-red">{user.username.charAt(0).toUpperCase()}</div><span className="name">{user.username}</span>
                                </div>
                            </div>
                        ) : (
                            <button className="user-pill-v2 signin" onClick={() => navigate('/login')}><div className="avatar-circle"><i className="ri-user-line"></i></div><span className="name">Sign In</span></button>
                        )}
                    </div>
                </div>
            </aside>

            <main className="main-content">
                {!isSidebarOpen && <button className="floating-sidebar-toggle" onClick={() => setIsSidebarOpen(true)}><i className="ri-layout-left-line"></i></button>}

                <div className="chat-window-viewport" ref={viewportRef}>
                    {!currentChatId && messages.length === 0 ? (
                        <div className="discovery-screen-v2">
                            <h1 className="hero-title">COREOS AI</h1>
                            <div className="discovery-chips-row-v2">
                                <button className="chip"><i className="ri-compass-line"></i> For you</button>
                                <button className="chip"><i className="ri-book-read-line"></i> Study guide</button>
                                <button className="chip"><i className="ri-briefcase-line"></i> Business</button>
                                <button className="chip"><i className="ri-heart-pulse-line"></i> Health</button>
                            </div>
                            <div className="hero-input-zone">
                                <UnifiedChatInput placeholder="Ask anything..." val={chatInput} onChange={setChatInput} onSend={handleSendMessage} onToggleModels={() => setIsModelSelectorOpen(!isModelSelectorOpen)} isModelSelectorOpen={isModelSelectorOpen} ModelSelector={ModelSelector} isLoading={isLoading} />
                                <div className="hero-suggestions-list">
                                    {["Show me latest Flipkart deals", "Find online courses to master digital art", "Recommend Bollywood movies for a long flight"].map((s, i) => (
                                        <div key={i} className="suggestion-item" onClick={() => handleSendMessage(null, s)}><span>{s}</span></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : ( 
                        <div className="document-style-flow">
                            {messages.map((m) => (
                                <div key={m._id} className={`doc-msg-row ${m.role}`}>
                                    {m.role === 'user' ? (
                                        <div className="user-text-box">{m.content}</div>
                                    ) : (
                                        <div className="ai-response-body">
                                            <div className="content-wrapper">
                                                {m._id === latestAiMsgId ? (
                                                    <TypewriterText content={m.content} speed={10} onComplete={() => setLatestAiMsgId(null)} />
                                                ) : (<div className="markdown-content"><ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown></div>)}
                                            </div>
                                            <div className="ai-toolbar-left">
                                                <button className="tool-btn" onClick={() => handleSendMessage(null, "Regenerate")}><i className="ri-restart-line"></i></button>
                                                <button className="tool-btn" onClick={() => handleShare(m.content)}><i className="ri-share-line"></i></button>
                                                <button className="tool-btn" onClick={() => handleCopy(m.content)}><i className="ri-file-copy-line"></i></button>
                                                <button className="tool-btn"><i className="ri-download-line"></i></button>
                                            </div>
                                            <div className="msg-divider"></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="doc-msg-row ai loading"><div className="modern-typing"><span></span><span></span><span></span></div></div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {(currentChatId || messages.length > 0) && (
                    <div className="chat-input-wrapper-fixed">
                        <div className="inner-input-container">
                             <UnifiedChatInput placeholder="Ask anything..." val={chatInput} onChange={setChatInput} onSend={handleSendMessage} onToggleModels={() => setIsModelSelectorOpen(!isModelSelectorOpen)} isModelSelectorOpen={isModelSelectorOpen} ModelSelector={ModelSelector} isLoading={isLoading} />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
export default Dashboard;