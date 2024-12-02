import React, { useEffect, useState } from 'react';
import { Github, Linkedin, Mail, Download, Terminal, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import dynamic from 'next/dynamic';

const AboutMePage = dynamic(() => import('@/components/AboutMePage'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full flex items-center justify-center bg-gray-800/50">
      <div className="text-blue-400">Loading visualization...</div>
    </div>
  )
});

interface TypewriterTextProps {
  text: string;
  delay?: number;
}

interface Project {
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
}

interface ProjectCardProps {
  project: Project;
}

interface Hobby {
  title: string;
  description: string;
  icon: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ text, delay = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, delay);
    
    return () => clearInterval(timer);
  }, [text, delay]);
  
  return <span>{displayText}</span>;
};

const hobbies: Hobby[] = [
  {
    title: "Competitive Gaming",
    description: "Pushing the limits in strategic games, focusing on team coordination and split-second decision making.",
    icon: "🎮"
  },
  {
    title: "Weightlifting",
    description: "Dedicated to personal growth through discipline and consistent training.",
    icon: "💪"
  },
  {
    title: "Photography",
    description: "Capturing moments and perspectives through both digital and film mediums.",
    icon: "📸"
  },
  {
    title: "Music Production",
    description: "Creating electronic music and exploring sound design in my free time.",
    icon: "🎵"
  }
];

const projects: Project[] = [
  {
    title: 'Medpass',
    description: 'Medical dashboard for studying with integrated AI assistance and comprehensive learning analytics.',
    techStack: ['NextJS', 'Tailwind', 'FastAPI', 'Postgres', 'SQLAlchemy', 'NumPy', 'pandas', 'scikit-learn', 'PyTorch', 'Docker', 'Git'],
    githubUrl: '#',
    liveUrl: '#'
  },
  {
    title: 'Rapter 7',
    description: 'Full-stack application with comprehensive testing and CI/CD implementation, focusing on scalable architecture.',
    techStack: ['NextJS', 'Tailwind', 'MongoDB', 'Javascript', 'RESTful APIs', 'CI/CD', 'Testing', 'Postman'],
    githubUrl: '#',
    liveUrl: '#'
  },
  {
    title: 'Emotion Recognition',
    description: 'AI-powered emotion recognition system leveraging advanced speech analysis and machine learning.',
    techStack: ['AI', 'Machine Learning', 'Signal Processing', 'Neural Networks'],
    githubUrl: '#',
    liveUrl: '#'
  }
];

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="text-2xl text-white">{project.title}</CardTitle>
        <CardDescription className="text-gray-300">{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech, index) => (
            <Badge key={index} variant="secondary" className="bg-blue-900/50">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-4">
        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" 
           className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors">
          <Github className="h-5 w-5" />
          Code
        </a>
        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
           className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors">
          <ExternalLink className="h-5 w-5" />
          Live Demo
        </a>
      </CardFooter>
    </Card>
  );
};

const PortfolioPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Navigation */}
      <nav className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Terminal className="h-6 w-6 text-blue-400" />
            <span className="text-2xl font-bold">domm.dev</span>
          </div>
          <div className="flex gap-4">
            <a href="https://github.com/mayer-domminic" target="_blank" rel="noopener noreferrer"
               className="transform hover:scale-110 transition-transform">
              <Github className="h-6 w-6 hover:text-blue-400 transition-colors" />
            </a>
            <a href="https://www.linkedin.com/in/domminicm/" target="_blank" rel="noopener noreferrer"
               className="transform hover:scale-110 transition-transform">
              <Linkedin className="h-6 w-6 hover:text-blue-400 transition-colors" />
            </a>
            <a href="mailto:domminicmayer@gmail.com"
               className="transform hover:scale-110 transition-transform">
              <Mail className="h-6 w-6 hover:text-blue-400 transition-colors" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 font-mono">
            <span className="text-blue-400">const</span>{' '}
            <span className="text-purple-400">developer</span>{' '}
            <span className="text-blue-400">=</span>{' '}
            <span className="text-green-400">'</span>
            <TypewriterText text="Doomminic Mayer" />
            <span className="text-green-400">'</span>
          </div>

          <h1 className={`text-4xl md:text-6xl font-bold mb-6 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            Forever improving {' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              myself
            </span>
          </h1>

          <p className={`text-xl text-gray-300 mb-8 transition-opacity duration-1000 delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            A leadership-driven software engineer passionate about building innovative solutions 
            through technology. Focused on creating impactful applications that combine technical 
            excellence with practical utility.
          </p>

          <div className={`flex gap-4 mb-20 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Button className="bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all">
              <a href="mailto:domminicmayer@gmail.com"
                 className="transform hover:scale-110 transition-transform">
                Contact Me
              </a>
            </Button>
            <Button variant="outline" className="border-blue-600 text-blue-400 transform hover:scale-105 transition-all" asChild>
              <a href="/Domminic_Mayer_Resume.pdf" download>
                <Download className="mr-2 h-4 w-4" /> Download Resume
              </a>
            </Button>
          </div>

          {/* Projects Section */}
          <div className={`transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-bold mb-8">Featured Projects</h2>
            <div className="grid grid-cols-1 gap-6 mb-20">
              {projects.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </div>

            {/* Get to Know Me Section */}
            <div className={`transition-all duration-1000 delay-800 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="mb-8 font-mono">
                <span className="text-blue-400">const</span>{' '}
                <span className="text-purple-400">aboutMe</span>{' '}
                <span className="text-blue-400">=</span>{' '}
                <span className="text-green-400">'</span>
                <TypewriterText text="Get to know me" />
                <span className="text-green-400">'</span>
              </div>

              <Card className="bg-gray-800/50 border-gray-700 mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">My Journey</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <p className="mb-4">
                    Through my travels, I've gained unique perspectives that influence my approach to problem-solving 
                    and development. Below you'll find a visualization of places I've visited and dream destinations 
                    that inspire my journey.
                  </p>
                </CardContent>
              </Card>

              <div className="mb-8">
                <AboutMePage />
              </div>

              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-400"></div>
                  <span className="text-gray-300">Places I've Visited</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-400"></div>
                  <span className="text-gray-300">Dream Destinations</span>
                </div>
              </div>

              {/* Personal Section */}
              <div className="mt-20 mb-20">
                <div className="mb-8 font-mono">
                  <span className="text-blue-400">const</span>{' '}
                  <span className="text-purple-400">interests</span>{' '}
                  <span className="text-blue-400">=</span>{' '}
                  <span className="text-green-400">'</span>
                  <TypewriterText text="Beyond the Code" />
                  <span className="text-green-400">'</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hobbies.map((hobby, index) => (
                    <Card 
                      key={index}
                      className="bg-gray-800/50 border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20"
                    >
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{hobby.icon}</span>
                          <CardTitle className="text-xl text-white">{hobby.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300">{hobby.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;