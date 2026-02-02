"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";

type Msg = {
  role: "user" | "bot";
  content: string;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const text = input;
    setInput("");

    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();

    setMessages((m) => [
      ...m,
      { role: "bot", content: data.reply }
    ]);

    setLoading(false);
  }

  function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    return (
      <button
        onClick={() => {
          navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="absolute top-2 right-2 text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-white"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">

      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-sky-700 to-indigo-700 text-lg font-semibold">
        🤖 CodePilot
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#081226]">

        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[75%] px-5 py-4 rounded-xl ${
              m.role === "user"
                ? "ml-auto bg-blue-600"
                : "bg-gray-800"
            }`}
          >
            {m.role === "bot" ? (
              <div className="markdown">
                <ReactMarkdown
                  rehypePlugins={[rehypePrism]}
                  components={{
                    pre({ children }) {
                      const code = String(
                        (children as any)?.props?.children || ""
                      );

                      return (
                        <div className="relative">
                          <pre className="bg-[#0b1220] p-4 rounded-lg overflow-x-auto">
                            {children}
                          </pre>
                          <CopyButton text={code} />
                        </div>
                      );
                    }
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              </div>
            ) : (
              m.content
            )}
          </div>
        ))}

        {loading && (
          <div className="bg-gray-700 px-4 py-2 rounded-lg w-fit">
            Typing...
          </div>
        )}

      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800 flex gap-3">

        <textarea
          className="flex-1 bg-[#0b1622] border border-gray-700 rounded-lg px-4 py-3 resize-none"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />

        <button
          onClick={sendMessage}
          className="bg-sky-600 px-6 rounded-lg hover:bg-sky-500"
        >
          Send
        </button>

      </div>
    </main>
  );
}
