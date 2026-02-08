import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans selection:bg-sky-500/30">

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
