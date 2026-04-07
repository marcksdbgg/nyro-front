import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ROaaSFeatures } from "@/components/ROaaSFeatures";
import { CoreFeatures } from "@/components/CoreFeatures";
import { Testimonial } from "@/components/Testimonial";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-24 pb-48 md:pb-0 overflow-x-hidden">
        <Hero />
        <ROaaSFeatures />
        <CoreFeatures />
        <Testimonial />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
