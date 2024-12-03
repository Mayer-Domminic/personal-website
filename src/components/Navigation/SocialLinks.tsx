import { Github, Linkedin, Mail } from 'lucide-react';

export const SocialLinks = () => {
  return (
    <>
      <a 
        href="https://github.com/mayer-domminic" 
        target="_blank" 
        rel="noopener noreferrer"
        className="transform hover:scale-110 transition-transform"
      >
        <Github className="h-6 w-6 hover:text-blue-400 transition-colors" />
      </a>
      <a 
        href="https://www.linkedin.com/in/domminicm/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="transform hover:scale-110 transition-transform"
      >
        <Linkedin className="h-6 w-6 hover:text-blue-400 transition-colors" />
      </a>
      <a 
        href="mailto:domminicmayer@gmail.com"
        className="transform hover:scale-110 transition-transform"
      >
        <Mail className="h-6 w-6 hover:text-blue-400 transition-colors" />
      </a>
    </>
  );
};