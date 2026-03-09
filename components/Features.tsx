"use client";

import { motion } from "framer-motion";
import { Zap, Code, Shield, Cpu, Terminal, GitBranch } from "lucide-react";

const features = [
    {
        title: "Instant Answers",
        description: "Get immediate responses to your coding queries. No latency, just results.",
        icon: <Zap className="w-5 h-5 text-white" />,
    },
    {
        title: "Smart Syntax",
        description: "CodePilot understands context and provides syntax-aware suggestions.",
        icon: <Code className="w-5 h-5 text-white" />,
    },
    {
        title: "Secure & Private",
        description: "Your codebase never leaves your local environment without permission.",
        icon: <Shield className="w-5 h-5 text-white" />,
    },
    {
        title: "Multi-Language Support",
        description: "Python, JavaScript, Rust, Go—we speak them all fluently.",
        icon: <Cpu className="w-5 h-5 text-white" />,
    },
];

export default function Features() {
    return (
        <section id="features" className="py-32 bg-[#0a0a0a] relative overflow-hidden border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="max-w-3xl mb-24">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Everything you need <br />
                        to ship faster.
                    </h2>
                    <p className="text-lg text-neutral-400 max-w-xl">
                        A comprehensive suite of tools designed to accelerate your development workflow from day one.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="group p-8 rounded-2xl border border-white/5 bg-[#141414] transition-all hover:bg-[#1a1a1a] hover:border-white/10"
                        >
                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">{feature.title}</h3>
                            <p className="text-neutral-400 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
