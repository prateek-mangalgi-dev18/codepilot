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
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
                    isScrolled ? "bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 py-3" : "bg-transparent py-5"
                )}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="h-7 w-7 rounded bg-white flex items-center justify-center font-bold text-black transition-transform group-hover:scale-105">
                            <span className="text-[10px]">CP</span>
                        </div>
                        <span className="font-semibold text-lg tracking-tight text-white">
                            CodePilot
                        </span>
                    </Link>

                    {/* Desktop Links - Minimal */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Features</Link>
                        <Link
                            href="/chat"
                            className="inline-flex h-9 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition-all hover:bg-neutral-200 active:scale-95"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-neutral-400 hover:text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed inset-x-0 top-[60px] z-40 bg-[#0a0a0a]/95 p-6 backdrop-blur-2xl md:hidden border-b border-white/5"
                    >
                        <div className="flex flex-col gap-6">
                            <Link href="#features" className="text-lg font-medium text-neutral-400" onClick={() => setIsMobileMenuOpen(false)}>Features</Link>
                            <Link
                                href="/chat"
                                className="rounded-full bg-white py-3 text-center font-bold text-black"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Get Started
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
