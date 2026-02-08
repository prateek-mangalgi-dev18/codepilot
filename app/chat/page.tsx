"use client";

import { useState, useRef, useEffect, memo } from "react";
import ReactMarkdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Trash2, Copy, Check, Terminal } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Role = "user" | "bot";

type Message = {
    role: Role;
    content: string;
    time: string;
};

// Extracted CopyButton component
function CopyButton({ getText }: { getText: () => string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const text = getText();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
            title="Copy Code"
        >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
        </button>
    );
}

// Extracted CodeBlock component to handle Ref and Copy logic properly
const CodeBlock = ({ children, className }: any) => {
    const preRef = useRef<HTMLPreElement>(null);

    // Extract language from className (e.g., "language-js")
    // default to "code" if not found
    const lang = (className || "").replace("language-", "") || "code";

    const getCodeText = () => {
        if (!preRef.current) return "";
        return preRef.current.innerText;
    };

    return (
        <div className="my-4 rounded-xl overflow-hidden border border-white/10 shadow-lg">
            <div className="flex justify-between items-center bg-[#0f1724] px-4 py-2 text-xs text-gray-400 border-b border-white/5">
                <span className="uppercase font-mono">{lang}</span>
                <CopyButton getText={getCodeText} />
            </div>
            <pre
                ref={preRef}
                className={cn("!m-0 !p-4 !bg-[#0b1220] overflow-x-auto text-sm", className)}
            >
                {children}
            </pre>
        </div>
    );
};

export default function ChatPage() {
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
                    content: "Server error. Please try again later.",
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

    if (!mounted) return null;

    return (
        <main className="min-h-screen bg-[#020617] text-white flex flex-col font-sans selection:bg-sky-500/30">

            {/* Background Grid */}
            <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-20 pointer-events-none" />

            {/* HEADER */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#020617]/80 border-b border-white/5 mx-auto w-full max-w-5xl px-6 py-4 flex items-center justify-between mt-4 rounded-2xl md:mt-6">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 text-white font-bold shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/40 transition-all duration-300">
                        <span className="text-sm">CP</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight text-white/90 group-hover:text-white transition-colors">
                        CodePilot
                    </span>
                </Link>

                <button
                    onClick={clearChat}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5 active:scale-95"
                    title="Clear Chat"
                >
                    <Trash2 size={18} />
                </button>
            </header>

            {/* CHAT CONTAINER */}
            <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 pb-32">
                <div className="space-y-6">
                    <AnimatePresence>
                        {messages.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center min-h-[50vh] text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500/20 to-indigo-600/20 flex items-center justify-center mb-6">
                                    <Terminal className="w-8 h-8 text-sky-400" />
                                </div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
                                    Ready to code?
                                </h2>
                                <p className="text-gray-400">
                                    Ask me anything about your project.
                                </p>
                            </motion.div>
                        )}

                        {messages.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                layout
                                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={cn(
                                        "max-w-[85%] md:max-w-[75%] px-5 py-4 rounded-3xl backdrop-blur-sm shadow-xl",
                                        m.role === "user"
                                            ? "bg-gradient-to-br from-sky-600 to-indigo-600 text-white rounded-br-none"
                                            : "bg-white/5 border border-white/5 text-gray-200 rounded-bl-none"
                                    )}
                                >
                                    {m.role === "bot" ? (
                                        <div className="markdown prose prose-invert max-w-none prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 prose-code:text-sky-300">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                rehypePlugins={[rehypePrism]}
                                                components={{
                                                    pre: CodeBlock
                                                }}
                                            >
                                                {m.content}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <div className="whitespace-pre-wrap">{m.content}</div>
                                    )}

                                    <div className={cn(
                                        "text-[10px] mt-2 opacity-50",
                                        m.role === "user" ? "text-sky-200 text-right" : "text-gray-500"
                                    )}>
                                        {m.time}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {loading && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-start"
                            >
                                <div className="bg-white/5 border border-white/5 px-4 py-3 rounded-3xl rounded-bl-none flex gap-1 items-center">
                                    <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={bottomRef} />
                </div>
            </div>

            {/* INPUT AREA */}
            <div className="fixed bottom-6 left-0 right-0 px-4">
                <div className="max-w-3xl mx-auto relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-indigo-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="relative flex items-center bg-[#0f1724]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl overflow-hidden focus-within:border-sky-500/50 focus-within:ring-1 focus-within:ring-sky-500/50 transition-all">
                        <input
                            disabled={loading}
                            className="flex-1 bg-transparent px-6 py-4 text-white placeholder-gray-500 focus:outline-none disabled:opacity-50"
                            placeholder="Ask a coding question..."
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
                            disabled={loading || !input.trim()}
                            onClick={sendMessage}
                            className="mr-2 p-2 rounded-full bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-50 disabled:bg-white/5 disabled:text-gray-500 transition-all active:scale-95"
                        >
                            <Send size={18} />
                        </button>
                    </div>

                    <div className="text-center mt-3 text-xs text-gray-500">
                        AI can make mistakes. Please review the code.
                    </div>
                </div>
            </div>
        </main>
    );
}
