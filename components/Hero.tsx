"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-20 overflow-hidden bg-[#0a0a0a]">
            {/* Very Subtle Background Detail */}
            <div className="absolute inset-0 bg-[#0a0a0a]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0,transparent_70%)]" />
            </div>

            <div className="relative z-10 text-center px-6 max-w-6xl mx-auto w-full">
                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-6"
                >
                    Built to build.
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    A minimal coding assistant for developers who value speed and clarity over noise. Ship faster with structural intelligence.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
                >
                    <Link
                        href="/chat"
                        className="h-12 px-8 rounded-full bg-white text-black font-semibold flex items-center justify-center transition-all hover:bg-neutral-200 active:scale-95"
                    >
                        Start coding
                    </Link>
                    <Link
                        href="#features"
                        className="h-12 px-8 rounded-full border border-white/10 text-neutral-400 font-medium flex items-center justify-center hover:text-white hover:bg-white/5 transition-all"
                    >
                        View features
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
