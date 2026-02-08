import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-[#020617] border-t border-white/5 py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-600 text-sm">
                        © {new Date().getFullYear()} CodePilot Inc. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="#" className="text-gray-600 hover:text-white transition-colors text-sm">Privacy Policy</Link>
                        <Link href="#" className="text-gray-600 hover:text-white transition-colors text-sm">Terms of Service</Link>
                    </div>
                </div>

                {/* Giant Text */}
                <div className="mt-20 overflow-hidden">
                    <h1 className="text-[12vw] font-black leading-none text-white/5 select-none text-center tracking-tighter">
                        CODEPILOT
                    </h1>
                </div>
            </div>
        </footer>
    );
}
