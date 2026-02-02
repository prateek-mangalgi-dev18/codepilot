"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";


type Role = "user" | "bot";

type Message = {
  role: Role;
  content: string;
  time: string;
};


export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    setMounted(true);
  }, []);



  useEffect(() => {
    if (!mounted) return;

    const saved = localStorage.getItem("codepilot-chat");
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, [mounted]);



  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem("codepilot-chat", JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, mounted]);



  function getTime() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

 

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput("");
    setLoading(true);

    const updatedMessages: Message[] = [
      ...messages,
      { role: "user", content: userText, time: getTime() },
    ];

    setMessages(updatedMessages);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();

      setMessages([
        ...updatedMessages,
        {
          role: "bot",
          content: data.reply || "No response",
          time: getTime(),
        },
      ]);
    } catch {
      setMessages([
        ...updatedMessages,
        {
          role: "bot",
          content: "Server error.",
          time: getTime(),
        },
      ]);
    }

    setLoading(false);
  }

 

  function clearChat() {
    setMessages([]);
    localStorage.removeItem("codepilot-chat");
  }

 

  function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    return (
      <button
        onClick={() => {
          navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
        className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    );
  }



  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#0f1724] flex items-center justify-center">

      {/* CHAT CARD */}
      <div className="w-full max-w-4xl h-[92vh] bg-[#081226] rounded-xl shadow-lg flex flex-col overflow-hidden text-white">

        {/* HEADER */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-sky-700 to-indigo-700 px-5 py-3 flex justify-between items-center">
          <span className="font-semibold">🤖 CodePilot</span>

          <button
            onClick={clearChat}
            className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg"
          >
            Clear Chat
          </button>
        </div>

       
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {messages.length === 0 && (
            <div className="text-gray-400 text-center mt-10">
              Ask a coding question to begin!
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  m.role === "user" ? "bg-blue-600" : "bg-gray-800"
                }`}
              >
                {m.role === "bot" ? (
                  <div className="markdown">
                    <ReactMarkdown
                      rehypePlugins={[rehypePrism]}
                      components={{
                        pre({ children }) {
                          const code =
                            String((children as any)?.props?.children || "");
                          const className =
                            (children as any)?.props?.className || "";
                          const lang =
                            className.replace("language-", "") || "code";

                          return (
                            <div className="relative">
                              <div className="flex justify-between items-center bg-[#0b1220] rounded-t-lg px-3 py-1 text-xs text-gray-300">
                                <span>{lang.toUpperCase()}</span>
                                <CopyButton text={code} />
                              </div>

                              <pre className="bg-[#0b1220] p-4 rounded-b-lg overflow-x-auto">
                                {children}
                              </pre>
                            </div>
                          );
                        },
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  m.content
                )}

                <div className="text-[10px] text-gray-300 mt-1 text-right">
                  {m.time}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-gray-400 italic text-sm">
              Typing...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        
        <div className="sticky bottom-0 bg-[#061122] border-t border-gray-800 px-4 py-3 flex gap-3">

          <textarea
            disabled={loading}
            className="flex-1 resize-none rounded-xl px-4 py-3 bg-[#0b1622] border border-gray-700 focus:outline-none disabled:opacity-50"
            rows={1}
            placeholder={
              loading ? "Waiting for response..." : "Ask a coding question..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <button
            disabled={loading}
            onClick={sendMessage}
            className="bg-sky-600 hover:bg-sky-500 px-5 rounded-xl disabled:opacity-50"
          >
            Send
          </button>

        </div>

      </div>

      
      <style jsx global>{`
        .markdown h1 { font-size: 1.2rem; font-weight: 700; margin-top: .6rem; }
        .markdown h2 { font-size: 1.05rem; font-weight: 600; margin-top: .6rem; }
        .markdown p { margin: .4rem 0; }
        .markdown ul { padding-left: 1.2rem; list-style: disc; }
        .markdown pre { font-size: .85rem; }
      `}</style>

    </main>
  );
}
