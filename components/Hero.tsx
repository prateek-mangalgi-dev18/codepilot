"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { currentTarget, clientX, clientY } = e;
        const { left, top } = currentTarget.getBoundingClientRect();
        setMousePosition({
            x: clientX - left,
            y: clientY - top,
        });
    };

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative min-h-[120vh] flex flex-col items-center justify-start pt-48 overflow-hidden bg-[#020617]"
        >
            {/* Spotlight Effect */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(14, 165, 233, 0.15), transparent 40%)`,
                }}
            />

            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <motion.div style={{ y, opacity }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
    
                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-8xl font-bold tracking-tight text-white mb-8"
                >
                    Code Faster <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-sky-400 animate-text">
                        Think Smarter
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12"
                >
                    An AI coding assistant that helps you write, understand, and improve code, right when you need it.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24"
                >
                    <Link
                        href="/chat"
                        className="group relative h-12 px-8 rounded-full bg-white text-black font-semibold flex items-center gap-2 overflow-hidden transition-all hover:scale-105 active:scale-95"
                    >
                        <span className="relative z-10">Start Coding Now</span>
                        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-sky-200 to-indigo-200 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                    <Link
                        href="#features"
                        className="h-12 px-8 rounded-full border border-white/10 bg-white/5 text-white font-medium flex items-center gap-2 hover:bg-white/10 transition-colors backdrop-blur-sm"
                    >
                        View Features
                    </Link>
                </motion.div>

                {/* 3D Dashboard Mockup */}
                <motion.div
                    initial={{ opacity: 0, rotateX: 20, y: 100 }}
                    animate={{ opacity: 1, rotateX: 0, y: 0 }}
                    transition={{ duration: 1, delay: 0.4, type: "spring" }}
                    className="relative rounded-xl border border-white/10 bg-[#0f1724]/50 shadow-2xl backdrop-blur-xl overflow-hidden group hover:border-sky-500/20 transition-colors"
                >
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <div className="p-2">
                        <div className="rounded-lg bg-[#020617] border border-white/5 p-4 md:p-8 overflow-hidden relative">
                            <div className="flex gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                            </div>
                            <div className="space-y-2 font-mono text-sm md:text-base">
                                <div className="flex gap-4">
                                    <span className="text-gray-600 select-none">1</span>
                                    <span className="text-purple-400">export default</span> <span className="text-blue-400">async function</span> <span className="text-yellow-200">generate</span>() {"{"}
                                </div>
                                <div className="flex gap-4">
                                    <span className="text-gray-600 select-none">2</span>
                                    <span className="text-gray-500 ml-4">// AI is thinking...</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="text-gray-600 select-none">3</span>
                                    <span className="ml-4 text-purple-400">const</span> <span className="text-red-300">result</span> = <span className="text-purple-400">await</span> <span className="text-blue-400">CodePilot</span>.<span>stream</span>();
                                </div>
                                <div className="flex gap-4 animate-pulse">
                                    <span className="text-gray-600 select-none">4</span>
                                    <span className="ml-4 w-4 h-6 bg-sky-500/50 block" />
                                </div>
                            </div>

                            {/* Reflection */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/5 to-transparent pointer-events-none" />
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020617] to-transparent z-20" />
        </section>
    );
}
