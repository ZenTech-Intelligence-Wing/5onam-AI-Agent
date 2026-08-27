"use client";
import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { supabase } from "@/src/utils/supabase/client";
// Import useRouter and useParams to handle the dynamic URL ID
import { useRouter, useParams } from "next/navigation";

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
  const params = useParams();
  
  // Extract ID from the URL if the user clicks a shared link like /chat/12345
  const urlChatId = params?.id ? parseInt(params.id[0] as string) : null;

  const [userName, setUserName] = useState<string>("Commander");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [currentMode, setCurrentMode] = useState<string>("5onam");
  const [inputText, setInputText] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  
  // Initialize the current chat with the ID from the URL (if it exists)
  const [currentChatId, setCurrentChatId] = useState<number | null>(urlChatId);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const parseMarkdown = (text: string) => {
    const imageRegex = /!\[([^\]]*)\]\((.*?)\)/g;
    let html = text.replace(
      imageRegex,
      '<div class="mt-4 mb-2 overflow-hidden rounded-2xl border border-gray-200 shadow-sm inline-block w-full"><img src="$2" alt="$1" class="w-full h-auto object-cover" /></div>'
    );
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/```([\s\S]*?)```/g, "<pre><code class='bg-gray-50 p-4 rounded-xl block overflow-x-auto text-sm my-2'>$1</code></pre>");
    html = html.replace(/\n/g, "<br>");
    return html;
  };

  // 1. Check User on Load
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
        background: "#ffffff",
        color: "#000",
        customClass: {
          confirmButton: "bg-indigo-600 text-white font-medium rounded-xl px-8 py-2.5 w-full mt-2",
          input: "bg-white border border-gray-200 rounded-xl px-4 py-3 text-center focus:ring-2 focus:ring-indigo-500 outline-none text-sm",
        },
        inputValidator: (value) => {
          if (!value) return "A designation is required.";
          return null;
        },
      }).then((result) => {
        setUserName(result.value);
        localStorage.setItem("zt_username", result.value);
      });
    } else {
      setUserName(storedName);
    }
  }, []);

  // 2. Load Shared Chat if URL has an ID
  useEffect(() => {
    const fetchSharedChat = async () => {
      if (urlChatId) {
        // NOTE: Here you should fetch the specific chat from Supabase using urlChatId
        // Example: const { data } = await supabase.from('chat_history').select('*').eq('chat_id', urlChatId);
        
        // For now, we sync the state so the app knows we are in an active chat
        setCurrentChatId(urlChatId);
      }
    };
    fetchSharedChat();
  }, [urlChatId]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory, currentChatId]);

  // Reset UI for a New Chat
  const createNewChat = () => {
    setCurrentChatId(null);
    setInputText("");
    router.push('/chat'); // Removes the ID from the URL
    if (textareaRef.current) textareaRef.current.style.height = "auto";
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

    // Create new chat & silently update URL
    if (!activeChatId) {
      activeChatId = Date.now(); // Generate unique ID for the chat
      
      // Updates the browser URL to /chat/123456789 without reloading the page!
      window.history.pushState(null, '', `/chat/${activeChatId}`);

      updatedHistory.push({
        id: activeChatId,
        title: generateSmartTitle(currentText),
        messages: [],
      });
    }

    const chatIndex = updatedHistory.findIndex((c) => c.id === activeChatId);

    const userMsg: Message = {
      id: Date.now().toString(),
      text: currentText,
      isUser: true,
    };

    updatedHistory[chatIndex].messages.push(userMsg);
    setChatHistory([...updatedHistory]);
    setCurrentChatId(activeChatId);

    let backendMode = currentMode === "3ena" ? "Zimage Generation" : "Gemini 2.5 Flash";
    
    updatedHistory[chatIndex].messages.push({
      id: "loading-" + Date.now(),
      text: "Processing...",
      isUser: false,
      isTyping: true,
    });
    setChatHistory([...updatedHistory]);

    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentText, mode: backendMode }),
      });
      const data = await response.json();
      const { data: { user } } = await supabase.auth.getUser();

      updatedHistory[chatIndex].messages.pop(); // Remove loading state

      if (response.ok) {
        if (user) {
          // IMPORTANT: Save to Supabase using the activeChatId so it can be fetched later
          await supabase.from("chat_history").insert({
            user_id: user.id,
            chat_id: activeChatId, // Save the slug ID
            prompt: currentText,
            response: data.response,
          });
        }

        updatedHistory[chatIndex].messages.push({
          id: Date.now().toString(),
          text: data.response,
          isUser: false,
        });
      }
    } catch (err) {
      updatedHistory[chatIndex].messages.pop();
      updatedHistory[chatIndex].messages.push({
        id: Date.now().toString(),
        text: "**Connection Failure:** Unable to reach server.",
        isUser: false,
      });
    }

    setChatHistory([...updatedHistory]);
    setIsProcessing(false);
    if (textareaRef.current) textareaRef.current.focus();
  };

  const activeChat = chatHistory.find((c) => c.id === currentChatId);

  return (
    <div className="h-screen w-full flex bg-white text-gray-900 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className={`bg-gray-50/50 border-r border-gray-200 flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 hidden'} shrink-0 h-full`}>
        <div className="p-4 flex flex-col h-full">
          
          <div className="flex items-center gap-2 mb-6 px-2">
            <div className="w-6 h-6 bg-indigo-600 text-white rounded text-xs flex items-center justify-center font-bold">5</div>
            <span className="font-semibold text-sm">5onam AI Agent</span>
            <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded ml-1">Beta</span>
          </div>

          <button onClick={createNewChat} className="flex items-center justify-between w-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition px-3 py-2 rounded-lg text-sm text-gray-700 mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              New Chat
            </div>
            <span className="text-xs text-gray-400 font-mono">Ctrl K</span>
          </button>

          <nav className="flex flex-col gap-1 mb-8">
            <button className="flex items-center gap-3 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              Chat
            </button>
            {['Explore Agents', 'Tools', 'Knowledge Base'].map(item => (
              <button key={item} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 text-gray-600 rounded-lg text-sm transition">
                <div className="w-4 h-4 border border-gray-400 rounded-sm"></div>
                {item}
              </button>
            ))}
          </nav>

          <div className="flex-1 overflow-y-auto">
            <h3 className="text-xs font-semibold text-gray-500 mb-3 px-2">Recent Chats</h3>
            <div className="flex flex-col gap-1">
              {[...chatHistory].reverse().map(chat => (
                <div key={chat.id} onClick={() => router.push(`/chat/${chat.id}`)} className="group cursor-pointer px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 flex justify-between items-center">
                  <span className="truncate w-full pr-2">{chat.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                  <img src="https://ui-avatars.com/api/?name=Tejas+Shinde&background=random" alt="Avatar" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{userName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat */}
      <main className="flex-1 flex flex-col h-full relative min-w-0">
        
        <header className="h-14 flex items-center justify-between px-6 shrink-0 w-full border-b border-transparent">
          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-gray-100 rounded text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
            </button>
            <span className="font-medium text-sm text-gray-800">5onam AI Agent </span>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={createNewChat} className="border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
               New Chat
             </button>
          </div>
        </header>

        <div ref={chatBoxRef} className="flex-1 overflow-y-auto px-4 md:px-20 lg:px-40 pb-36 pt-10 scroll-smooth w-full">
          {!activeChat ? (
            <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto -mt-10">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-xl text-3xl flex items-center justify-center font-bold mb-6 shadow-sm">5</div>
              <h2 className="text-2xl font-semibold mb-2">Welcome to 5onam AI Agent</h2>
              <p className="text-gray-500 mb-10 text-sm">Your intelligent AI assistant for coding, research, automation and more.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                {[
                  { icon: "💡", title: "Explain a concept", desc: "Explain quantum computing in simple terms" },
                  { icon: "⚡", title: "Write code", desc: "Create a Python function to sort a list" },
                  { icon: "📊", title: "Analyze data", desc: "Help me analyze this dataset" },
                  { icon: "🎯", title: "Brainstorm ideas", desc: "Suggest AI project ideas for automation" }
                ].map((card, i) => (
                  <div key={i} onClick={() => setInputText(card.desc)} className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                     <div className="text-xl mb-3">{card.icon}</div>
                     <h4 className="font-medium text-sm mb-1">{card.title}</h4>
                     <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-8 w-full max-w-3xl mx-auto">
              {activeChat.messages.map((msg) => (
                <div key={msg.id} className={`flex w-full animate-fade-in ${msg.isUser ? "justify-end" : "justify-start"}`}>
                  {msg.isUser ? (
                    <div className="bg-gray-100 text-gray-900 px-5 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed">
                      {msg.text}
                    </div>
                  ) : msg.isTyping ? (
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">5</div>
                       <div className="text-sm text-gray-500 animate-pulse">Thinking...</div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-4 w-full">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1 shadow-sm">5</div>
                      <div className="flex-1 text-sm text-gray-800 leading-relaxed pt-1 markdown-body" dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 pt-6 pb-6 px-4 md:px-20 lg:px-40 bg-gradient-to-t from-white via-white to-transparent">
          <div className="max-w-3xl mx-auto relative">
            <div className="border border-gray-200 bg-white shadow-sm rounded-[24px] flex items-end px-3 py-2.5 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all w-full">
              
              <textarea 
                ref={textareaRef}
                value={inputText}
                onChange={handleInput}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                rows={1}
                placeholder="Message 5onam AI Agent..."
                className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none py-1.5 px-3 text-[15px] max-h-[200px] resize-none border-none ml-2"
              />
              
              <div className="flex gap-2 items-center pb-1 pr-1">
                <button 
                  onClick={sendMessage}
                  disabled={!inputText.trim() || isProcessing}
                  className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-full transition-all disabled:opacity-30 disabled:bg-gray-300"
                >
                  <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19V5m0 0l-7 7m7-7l7 7"></path></svg>
                </button>
              </div>
            </div>
            <div className="text-center mt-3 text-[11px] text-gray-400">
              5onam AI Agent can make mistakes. Please verify important information.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}