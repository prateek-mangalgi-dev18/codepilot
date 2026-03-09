import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-white/10">

      {/* NAVBAR */}
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <Hero />

        {/* FEATURES SECTION */}
        <Features />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
