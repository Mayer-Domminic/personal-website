import { TypewriterText } from "@/components/ui/TypewriterText";
import { ProjectsSection } from "@/components/ProjectsSection";
import { AboutSection } from "@/components/AboutSection";
import { InterestsSection } from "@/components/InterestsSection";
import { ContactSection } from "@/components/ContactSection";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 font-mono">
            <span className="text-blue-400">const</span>{' '}
            <span className="text-purple-400">developer</span>{' '}
            <span className="text-blue-400">=</span>{' '}
            <span className="text-green-400">'</span>
            <TypewriterText text="Doomminic Mayer" />
            <span className="text-green-400">'</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Forever improving {' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              myself
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 animate-fade-in-delay-1">
            A leadership-driven software engineer passionate about building innovative solutions 
            through technology. Focused on creating impactful applications that combine technical 
            excellence with practical utility.
          </p>

          <div className="flex gap-4 mb-20 animate-fade-in-delay-2">
            <Button variant="default" size="lg" className="bg-blue-600 hover:bg-blue-700">
              <a href="mailto:domminicmayer@gmail.com">Contact Me</a>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-blue-600 text-blue-400"
              asChild
            >
              <a href="/Domminic_Mayer_Resume.pdf" download>
                <Download className="mr-2 h-4 w-4" /> Download Resume
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <ProjectsSection />
      <AboutSection />
      <InterestsSection />
      <ContactSection />
    </div>
  );
};