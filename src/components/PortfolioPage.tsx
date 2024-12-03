import React, { useEffect, useState } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Terminal, 
  ExternalLink,
  ArrowRight,
  Compass,
  Dumbbell,
  Camera,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import dynamic from 'next/dynamic';

interface Hobby {
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  action?: {
    text: string;
    link: string;
  };
}

const hobbies: Hobby[] = [
  {
    title: "Adventures",
    description: "Exploring through traveling, dirt bike riding, hiking, and long car drives. Each journey brings new perspectives and experiences.",
    icon: Compass,
    action: {
      text: "Check out some",
      link: "#globe-section"
    }
  },
  {
    title: "Improvement",
    description: "Dedicated to personal growth through gym training, exploring new recipes in cooking, and expanding knowledge through reading.",
    icon: Dumbbell,
    action: {
      text: "Check out my reading list",
      link: "#reading-section"
    }
  },
  {
    title: "Photography",
    description: "Capturing moments through various lenses - from travel photography to dirt bike adventures and artistic cinematography.",
    icon: Camera,
    action: {
      text: "View some photo dumps",
      link: "#photo-section"
    }
  },
  {
    title: "Learning",
    description: "Constantly expanding horizons by studying new languages, building projects, and mastering new frameworks and programming languages.",
    icon: Brain,
    action: {
      text: "Explore my roadmap",
      link: "#projects-section"
    }
  }
];


const CustomGlobe = dynamic(() => import('@/components/CustomGlobe'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full flex items-center justify-center bg-gray-800/50">
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
            <Terminal className="h-6 w-6 text-purple-400" />
            <span className="text-2xl font-bold">domm.dev</span>
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
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

          {/* Projects Section */}
          <div className={`transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-bold mb-8">Featured Projects</h2>
            <div className="grid grid-cols-1 gap-6 mb-20">
              {projects.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </div>

            {/* Globe Section */}
            <div id="globe-section" className={`transition-all duration-1000 delay-800 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="mb-8 font-mono">
                <span className="text-blue-400">const</span>{' '}
                <span className="text-purple-400">whereAmI</span>{' '}
                <span className="text-blue-400">=</span>{' '}
                <span className="text-green-400">'</span>
                <TypewriterText text="Fiind me" />
                <span className="text-green-400">'</span>
              </div>

              <Card className="bg-gray-800/50 border-gray-700 mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">All Around The World</CardTitle>
                </CardHeader>
                <CardContent>
                <CustomGlobe />
                </CardContent>
              </Card>

              {/* Hobbies Section */}
              <div className="mb-8 font-mono">
                <span className="text-blue-400">const</span>{' '}
                <span className="text-purple-400">interests</span>{' '}
                <span className="text-blue-400">=</span>{' '}
                <span className="text-green-400">'</span>
                <TypewriterText text="Leearn more" />
                <span className="text-green-400">'</span>
              </div>
              
              <div className="mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hobbies.map((hobby, index) => (
                    <Card 
                      key={index}
                      className="bg-gray-800/50 border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20"
                    >
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          {/* Render the Lucide icon component */}
                          <hobby.icon className="h-6 w-6 text-purple-400" />
                          <CardTitle className="text-xl text-white">{hobby.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300">{hobby.description}</p>
                        {hobby.action && (
                          <a href={hobby.action.link} className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mt-4">
                            {hobby.action.text} <ArrowRight className="h-4 w-4" />
                          </a>
                        )}
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