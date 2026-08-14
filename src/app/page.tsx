"use client";
import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/utils/supabase/client";

const BACKEND_URL = "https://zen-tech-ai-ztiw.hf.space";

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  isImageRender?: boolean;
  imageUrl?: string;
  isTyping?: boolean;
};

type Chat = {
  id: number;
  title: string;
  messages: Message[];
};





export default function ZenTechOS() {

  const router = useRouter();
 

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
      }
    }

    checkAuth();
  }, []);

  




  const [userName, setUserName] = useState<string>("Commander");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [currentMode, setCurrentMode] = useState<string>("5onam");
  const [inputText, setInputText] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [selectedCanvasRatio, setSelectedCanvasRatio] = useState<string>("1 / 1");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const parseMarkdown = (text: string) => {
    const imageRegex = /!\[([^\]]*)\]\((.*?)\)/g;
    let html = text.replace(
      imageRegex,
      '<div class="mt-4 mb-2 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm inline-block w-full"><img src="$2" alt="$1" class="w-full h-auto object-cover" /></div>'
    );
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");
    html = html.replace(/\n/g, "<br>");
    return html;
  };

  useEffect(() => {
    const storedName = localStorage.getItem("zt_username");
    if (!storedName) {
      Swal.fire({
        title: '<span class="font-medium text-2xl tracking-tight font-sans">Initialize System</span>',
        html: '<p class="text-sm text-gray-500 mb-2">Please enter your designation to configure your workspace.</p>',
        input: "text",
        inputPlaceholder: "Your Name...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: "Continue",
        background: isDarkMode ? "rgba(25,25,25,0.85)" : "rgba(255,255,255,0.85)",
        color: isDarkMode ? "#fff" : "#000",
        customClass: {
          popup: "swal-macos border border-gray-200 dark:border-gray-800 shadow-2xl",
          confirmButton: "bg-indigo-500 text-white font-medium rounded-xl px-8 py-2.5 hover:scale-105 transition-transform w-full mt-2",
          input: "bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-center focus:ring-2 focus:ring-indigo-500 outline-none text-sm",
        },
        inputValidator: (value) => {
          if (!value) return "A designation is required.";
          return null;
        },
      }).then((result) => {
        setUserName(result.value);
        localStorage.setItem("zt_username", result.value);
        createNewChat();
      });
    } else {
      setUserName(storedName);
      createNewChat();
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory, currentChatId]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const createNewChat = () => {
    setCurrentChatId(null);
    setInputText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    if (window.innerWidth < 768 && sidebarOpen) setSidebarOpen(false);
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const generateSmartTitle = (text: string) => {
    const title = text.trim().charAt(0).toUpperCase() + text.trim().slice(1);
    return title.length > 25 ? title.substring(0, 25) + "..." : title;
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isProcessing) return;
    const currentText = inputText.trim();
    setInputText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsProcessing(true);
    let activeChatId = currentChatId;
    let updatedHistory = [...chatHistory];
    if (!activeChatId) {
      activeChatId = Date.now();
      updatedHistory.push({
        id: activeChatId,
        title: generateSmartTitle(currentText),
        messages: [],
      });
    }
    const chatIndex = updatedHistory.findIndex((c) => c.id === activeChatId);
    const userMsg: Message = { id: Date.now().toString(), text: currentText, isUser: true };
    updatedHistory[chatIndex].messages.push(userMsg);
    setChatHistory([...updatedHistory]);
    setCurrentChatId(activeChatId);
    let backendMode = "Gemini 2.5 Flash";
    let payloadMessage = currentText;
    if (currentMode === "3ena") {
      backendMode = "Zimage Generation";
      updatedHistory[chatIndex].messages.push({
        id: "loading-" + Date.now(),
        text: "",
        isUser: false,
        isImageRender: true,
        isTyping: true
      });
      setChatHistory([...updatedHistory]);
    } else if (currentMode === "1ris") {
      payloadMessage = `As an elite Prompt Engineering AI named 1ris, rewrite this idea into a highly detailed, optimized prompt format ready for an LLM. Return ONLY the enhanced prompt. Idea: "${currentText}"`;
      updatedHistory[chatIndex].messages.push({
        id: "loading-" + Date.now(),
        text: "Processing...",
        isUser: false,
        isTyping: true
      });
      setChatHistory([...updatedHistory]);
    } else {
      updatedHistory[chatIndex].messages.push({
        id: "loading-" + Date.now(),
        text: "Processing...",
        isUser: false,
        isTyping: true
      });
      setChatHistory([...updatedHistory]);
    }
    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: payloadMessage, mode: backendMode }),
      });
      const data = await response.json();
      updatedHistory[chatIndex].messages.pop();
      if (response.ok) {
        if (currentMode === "3ena") {
          const match = data.response.match(/!\[.*?\]\((.*?)\)/);
          const imgUrl = match ? match[1] : null;
          updatedHistory[chatIndex].messages.push({
            id: Date.now().toString(),
            text: data.response,
            isUser: false,
            isImageRender: true,
            imageUrl: imgUrl
          });
        } else {
          updatedHistory[chatIndex].messages.push({
            id: Date.now().toString(),
            text: data.response,
            isUser: false,
          });
        }
      } else {
        updatedHistory[chatIndex].messages.push({
          id: Date.now().toString(),
          text: `**Error:** ${data.detail || "System Exception"}`,
          isUser: false,
        });
      }
    } catch (err) {
      updatedHistory[chatIndex].messages.pop();
      updatedHistory[chatIndex].messages.push({
        id: Date.now().toString(),
        text: "**Connection Failure:** Unable to reach Zen-Tech server.",
        isUser: false,
      });
    }
    setChatHistory([...updatedHistory]);
    setIsProcessing(false);
    if (textareaRef.current) textareaRef.current.focus();
  };

  const activeChat = chatHistory.find((c) => c.id === currentChatId);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";

  return (
    <div className={`${isDarkMode ? "dark" : ""} h-screen w-full`}>
      <div className="bg-[#f5f5f7] dark:bg-[#000000] text-gray-900 dark:text-gray-100 h-full flex overflow-hidden transition-colors duration-500 text-sm">
        <main className="flex-1 flex flex-col h-full relative min-w-0 transition-all duration-500 z-10">
          <header className="h-16 flex items-center justify-between px-6 md:px-12 shrink-0 z-20 absolute top-0 w-full bg-gradient-to-b from-[#f5f5f7] via-[#f5f5f7]/80 dark:from-[#000] dark:via-[#000]/80 to-transparent pb-4 backdrop-blur-[2px]">
            <div className="flex items-center gap-4 w-1/3">
              <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
                <div className="w-2.5 h-2.5 bg-white rounded-sm rotate-45"></div>
              </div>
              <span className="font-semibold tracking-tight text-[15px] hidden sm:block">Zen-Tech OS</span>
            </div>
            <div className="w-1/3 flex justify-center">
              <div className={`text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-200/50 dark:bg-gray-800/50 px-4 py-1.5 rounded-full truncate max-w-[150px] sm:max-w-[250px] transition-all duration-300 ${activeChat ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                {activeChat ? activeChat.title : "New Chat"}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 w-1/3">
              <button onClick={toggleTheme} className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
              </button>
              <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
              </button>
              <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold shadow-inner cursor-default ring-1 ring-black/5 dark:ring-white/10 ml-1">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </header>
          <div ref={chatBoxRef} className="flex-1 overflow-y-auto px-4 md:px-12 lg:px-32 xl:px-48 pb-48 pt-24 scroll-smooth w-full">
            <div className="flex flex-col space-y-6 w-full">
              {!activeChat && (
                <div className="flex flex-col items-center justify-center mt-20 animate-fade-in">
                  <img src="https://www.image2url.com/r2/default/images/1776349590881-7c3f54c2-fed1-4d1c-83f2-1c3ae1fd79a7.png" alt="Icon" className="w-20 h-20 mb-6 object-contain" />
                  <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-center leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x">Good {greeting},</span><br />
                    <span className="text-gray-800 dark:text-gray-100">{userName}.</span>
                  </h2>
                </div>
              )}
              {activeChat?.messages.map((msg) => (
                <div key={msg.id} className={`flex w-full animate-fade-in ${msg.isUser ? "justify-end" : "justify-start"}`}>
                  {msg.isUser ? (
                    <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white px-5 py-3 rounded-3xl rounded-tr-sm max-w-[85%] text-sm leading-relaxed shadow-md">
                      {msg.text}
                    </div>
                  ) : msg.isTyping ? (
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center shrink-0">
                         <svg className="w-3.5 h-3.5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      </div>
                      <div className="text-xs font-medium text-gray-400 dark:text-gray-500 animate-pulse">Processing...</div>
                    </div>
                  ) : msg.isImageRender ? (
                    <div className="flex items-start gap-4 w-full max-w-xl">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shrink-0 mt-0.5 shadow-sm p-[1px]">
                        <div className="w-full h-full bg-white dark:bg-[#000] rounded-full flex items-center justify-center">
                           <svg className="w-3.5 h-3.5 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z"/></svg>
                        </div>
                      </div>
                      <div className="w-full relative rounded-2xl shadow-xl magic-canvas overflow-hidden" style={{ aspectRatio: selectedCanvasRatio }}>
                        {msg.imageUrl ? (
                           <img src={msg.imageUrl} alt="Generated UI" className="w-full h-full object-cover relative z-20" />
                        ) : (
                          <div className="p-4 text-sm text-red-500 text-center relative z-20 font-medium">Render Failed</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-4 w-full">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shrink-0 mt-0.5 shadow-sm p-[1px]">
                        <div className="w-full h-full bg-white dark:bg-[#000] rounded-full flex items-center justify-center">
                           <svg className="w-3.5 h-3.5 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z"/></svg>
                        </div>
                      </div>
                      <div className="flex-1 text-sm leading-relaxed pt-0.5 w-full">
                        <div className="markdown-body" dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 pt-10 pb-6 px-4 md:px-12 lg:px-32 xl:px-48 bg-gradient-to-t from-[#f5f5f7] via-[#f5f5f7]/90 dark:from-[#000] dark:via-[#000]/90 to-transparent z-30 pointer-events-none">
            <div className="w-full relative pointer-events-auto">
              <div className="flex justify-center mb-4">
                <div className="glass flex items-center p-1 rounded-full shadow-sm">
                  {["5onam", "1ris", "3ena"].map(mode => (
                    <button key={mode} onClick={() => setCurrentMode(mode)} className={`px-5 py-1.5 rounded-full text-[11px] font-medium transition-all ${currentMode === mode ? 'bg-white dark:bg-[#222] shadow text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}>
                      {mode} AI
                    </button>
                  ))}
                </div>
              </div>
              <div className="glass rounded-3xl flex flex-col px-4 pt-3 pb-2 shadow-lg focus-within:shadow-xl transition-shadow w-full">
                <textarea 
                  ref={textareaRef}
                  value={inputText}
                  onChange={handleInput}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
                  }}
                  rows={1}
                  placeholder={currentMode === '3ena' ? "/imagine a cute cat" : currentMode === '1ris' ? "Paste prompt for 1ris to analyze..." : "What would you like to explore?"}
                  className="w-full bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none py-1.5 text-[14px] overflow-y-auto leading-relaxed max-h-[300px] px-2 resize-none border-none"
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="text-[10px] font-medium text-gray-400 px-2 uppercase tracking-widest hidden sm:block">
                    Version: 1.5.124 (BETA)
                  </div>
                  <button 
                    onClick={sendMessage}
                    disabled={!inputText.trim() || isProcessing}
                    className="w-8 h-8 flex items-center justify-center bg-indigo-500 text-white hover:bg-indigo-600 hover:scale-105 active:scale-95 rounded-full transition-all disabled:opacity-30 disabled:scale-100 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14M12 5l7 7-7 7"></path></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <aside className={`sidebar-glass h-full z-40 flex flex-col transition-all duration-300 overflow-hidden shadow-2xl relative shrink-0 ${sidebarOpen ? 'w-64' : 'w-0'}`}>
          <div className="w-64 min-w-[16rem] h-full flex flex-col p-4">
            <button onClick={createNewChat} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 transition-all font-medium text-sm mt-2 mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              New Chat
            </button>
            <div className="flex-1 overflow-y-auto pr-2">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Recent Chats</h3>
              <div className="flex flex-col gap-2">
                {[...chatHistory].reverse().map(chat => (
                  <div key={chat.id} onClick={() => setCurrentChatId(chat.id)} className="group relative flex items-center justify-between w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-800/50 cursor-pointer overflow-hidden">
                    <span className="truncate w-full">{chat.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}