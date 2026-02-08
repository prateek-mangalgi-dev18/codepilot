"use client";

import { motion } from "framer-motion";
import { Zap, Code, Shield, Cpu, Terminal, GitBranch } from "lucide-react";

const features = [
    {
        title: "Instant Answers",
        description: "Get immediate responses to your coding queries. No latency, just results.",
        icon: <Zap className="w-6 h-6 text-yellow-400" />,
        className: "md:col-span-2",
    },
    {
        title: "Smart Syntax",
        description: "CodePilot understands context and provides syntax-aware suggestions.",
        icon: <Code className="w-6 h-6 text-sky-400" />,
        className: "md:col-span-1",
    },
    {
        title: "Secure & Private",
        description: "Your codebase never leaves your local environment without permission.",
        icon: <Shield className="w-6 h-6 text-green-400" />,
        className: "md:col-span-1",
    },
    {
        title: "Multi-Language Support",
        description: "Python, JavaScript, Rust, Go—we speak them all fluently.",
        icon: <Cpu className="w-6 h-6 text-purple-400" />,
        className: "md:col-span-2",
    },
];

export default function Features() {
    return (
        <section id="features" className="py-24 bg-[#020617] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f1724] to-[#020617]" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-6">
                        Everything you need <br />
                        to ship faster.
                    </h2>
                    <p className="text-lg text-gray-400 max-w-xl">
                        A comprehensive suite of tools designed to accelerate your development workflow from day one.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition-all hover:border-white/20 hover:bg-white/10 ${feature.className}`}
                        >
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-semibold text-white mb-2">{feature.title}</h3>
                                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>

                            {/* Hover Gradient */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{
                                    background: "radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%)"
                                }}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
