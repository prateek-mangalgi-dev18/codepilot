"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={cn(
                    "fixed top-4 left-0 right-0 z-50 mx-auto max-w-5xl transition-all duration-300",
                    isScrolled ? "top-4" : "top-6"
                )}
            >
                <div
                    className={cn(
                        "mx-4 md:mx-0 rounded-2xl border border-white/5 bg-[#0f1724]/80 px-4 py-3 shadow-lg ring-1 ring-white/10 backdrop-blur-xl transition-all",
                        isScrolled && "bg-[#0f1724]/90 shadow-sky-500/5 ring-white/15"
                    )}
                >
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 text-white font-bold shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/40 transition-all duration-300">
                                <span className="text-sm">CP</span>
                            </div>
                            <span className="font-bold text-lg tracking-tight text-white/90 group-hover:text-white transition-colors">
                                CodePilot
                            </span>
                        </Link>

                        {/* CTA */}
                        <div className="hidden md:flex items-center gap-4">
                            <Link
                                href="/chat"
                                className="group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-lg bg-white px-4 font-medium text-neutral-950 transition-all hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/20 active:scale-95"
                            >
                                <span className="text-sm font-semibold">Get Started</span>
                                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-sky-400/20 to-indigo-400/20 opacity-0 transition-opacity group-hover:opacity-100" />
                            </Link>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden text-gray-300 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-x-4 top-24 z-40 rounded-2xl border border-white/10 bg-[#0f1724]/95 p-6 backdrop-blur-2xl md:hidden"
                    >
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/chat"
                                    className="rounded-lg bg-white py-2.5 text-center font-bold text-black"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
