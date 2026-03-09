"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Trash2, Copy, Check, Terminal, ArrowLeft } from "lucide-react";
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
            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-white transition-colors"
            title="Copy Code"
        >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
        </button>
    );
}

// Extracted CodeBlock component
const CodeBlock = ({ children, className }: any) => {
    const preRef = useRef<HTMLPreElement>(null);
    const lang = (className || "").replace("language-", "") || "code";

    const getCodeText = () => {
        if (!preRef.current) return "";
        return preRef.current.innerText;
    };

    return (
        <div className="my-6 rounded-xl overflow-hidden border border-white/5 bg-[#0d0d0d] shadow-2xl">
            <div className="flex justify-between items-center bg-[#111111] px-4 py-2 text-[10px] text-neutral-500 border-b border-white/5 uppercase tracking-widest font-mono">
                <span>{lang}</span>
                <CopyButton getText={getCodeText} />
            </div>
            <pre
                ref={preRef}
                className={cn("!m-0 !p-6 !bg-transparent overflow-x-auto text-sm leading-relaxed", className)}
            >
                {children}
            </pre>
        </div>
    );
};

export default function ChatPage() {
    const router = useRouter();
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
        if (confirm("Clear all messages?")) {
            setMessages([]);
            localStorage.removeItem("codepilot-chat");
        }
    }

    if (!mounted) return null;

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-neutral-200 flex flex-col font-sans selection:bg-white/10">

            {/* HEADER */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-white/5 w-full">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-all group px-2 py-1 -ml-2 rounded-lg hover:bg-white/5"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">Back</span>
                        </button>

                        <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="h-6 w-6 rounded bg-white flex items-center justify-center font-bold text-black text-[9px] transition-transform group-hover:scale-105">
                                CP
                            </div>
                            <span className="font-semibold text-base tracking-tight text-white/90 group-hover:text-white transition-colors">
                                CodePilot
                            </span>
                        </Link>
                    </div>

                    <button
                        onClick={clearChat}
                        className="p-2 text-neutral-500 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5 active:scale-95"
                        title="Clear Chat"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </header>

            {/* CHAT CONTAINER */}
            <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 pb-32">
                <div className="space-y-10">
                    <AnimatePresence mode="popLayout">
                        {messages.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center min-h-[50vh] text-center"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-8">
                                    <Terminal className="w-6 h-6 text-neutral-300" />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
                                    How can I help you today?
                                </h2>
                                <p className="text-neutral-500 max-w-sm leading-relaxed">
                                    Ask anything about code, logic, or system design. CodePilot is built for speed and precision.
                                </p>
                            </motion.div>
                        )}

                        {messages.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                layout
                                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={cn(
                                        "max-w-[90%] md:max-w-[80%]",
                                        m.role === "user" ? "flex flex-col items-end" : "flex flex-col items-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "px-5 py-4 rounded-2xl text-[15px] leading-relaxed shadow-sm",
                                            m.role === "user"
                                                ? "bg-white text-black font-medium"
                                                : "bg-[#141414] border border-white/5 text-neutral-300"
                                        )}
                                    >
                                        {m.role === "bot" ? (
                                            <div className="markdown prose prose-invert max-w-none prose-neutral">
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
                                    </div>

                                    <div className={cn(
                                        "text-[10px] mt-2 font-mono tracking-tighter opacity-30",
                                        m.role === "user" ? "text-right" : "text-left"
                                    )}>
                                        {m.time}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {loading && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-start"
                            >
                                <div className="bg-[#141414] border border-white/5 px-5 py-4 rounded-2xl flex gap-1.5 items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 animate-pulse" style={{ animationDelay: "0ms" }} />
                                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 animate-pulse" style={{ animationDelay: "200ms" }} />
                                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 animate-pulse" style={{ animationDelay: "400ms" }} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={bottomRef} />
                </div>
            </div>

            {/* INPUT AREA */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent pointer-events-none">
                <div className="max-w-3xl mx-auto pointer-events-auto">
                    <div className="relative flex items-center bg-[#111111] border border-white/5 rounded-2xl shadow-2xl focus-within:border-white/20 transition-all px-2 py-2">
                        <input
                            disabled={loading}
                            className="flex-1 bg-transparent pl-4 pr-2 py-3 text-white placeholder-neutral-600 focus:outline-none disabled:opacity-50 text-[15px]"
                            placeholder="Message CodePilot..."
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
                            className="p-3 rounded-xl bg-white text-black hover:bg-neutral-200 disabled:opacity-0 disabled:scale-90 transition-all active:scale-95"
                        >
                            <Send size={18} />
                        </button>
                    </div>

                    <div className="text-center mt-4 text-[11px] text-neutral-600 tracking-tight">
                        Built for speed. Use <kbd className="px-1 py-0.5 rounded border border-white/10 bg-white/5">Enter</kbd> to ship.
                    </div>
                </div>
            </div>
        </main>
    );
}
