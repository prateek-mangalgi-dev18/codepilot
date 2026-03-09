import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-[#0a0a0a] border-t border-white/5 py-12 px-6 mt-auto">
            <div className="max-w-7xl mx-auto flex justify-center">
                <p className="text-neutral-700 text-[10px] tracking-[0.2em] uppercase">
                    CodePilot
                </p>
            </div>
        </footer>
    );
}
