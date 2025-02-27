import React, { useEffect, useState } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Terminal, 
} from 'lucide-react';

const Navbar: React.FC = () => {
    return (
      <nav className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Terminal className="h-6 w-6 text-purple-400" />
            <a href="../../"><span className="text-2xl font-bold text-white">domm.dev</span></a>
          </div>
          <div className="flex gap-4">
            <a href="https://github.com/mayer-domminic" target="_blank" rel="noopener noreferrer"
               className="transform hover:scale-110 transition-transform text-purple-400">
              <Github className="h-6 w-6 hover:text-blue-400 transition-colors" />
            </a>
            <a href="https://www.linkedin.com/in/domminicm/" target="_blank" rel="noopener noreferrer"
               className="transform hover:scale-110 transition-transform text-purple-400">
              <Linkedin className="h-6 w-6 hover:text-blue-400 transition-colors" />
            </a>
            <a href="mailto:domminicmayer@gmail.com"
               className="transform hover:scale-110 transition-transform text-purple-400">
              <Mail className="h-6 w-6 hover:text-blue-400 transition-colors" />
            </a>
          </div>
        </div>
      </nav>
    );
  };

  export default Navbar;