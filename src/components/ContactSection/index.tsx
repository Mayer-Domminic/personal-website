import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Github, Linkedin, Mail } from 'lucide-react';

export const ContactSection = () => {
  return (
    <section className="container mx-auto px-4 py-24 bg-gray-900/50" id="contact">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8">Get in Touch</h2>
        <p className="text-xl text-gray-300 mb-12">
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
        </p>
        
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full md:w-auto border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                asChild
              >
                <a href="mailto:domminicmayer@gmail.com" className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Me
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full md:w-auto border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                asChild
              >
                <a 
                  href="https://github.com/mayer-domminic" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="h-5 w-5" />
                  GitHub
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full md:w-auto border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                asChild
              >
                <a 
                  href="https://www.linkedin.com/in/domminicm/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Linkedin className="h-5 w-5" />
                  LinkedIn
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};