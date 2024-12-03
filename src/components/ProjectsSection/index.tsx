import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Github, ExternalLink } from 'lucide-react';
import { Project } from '@/types';

const projects: Project[] = [
  {
    title: 'Medpass',
    description: 'Medical dashboard for studying with integrated AI assistance and analytics.',
    techStack: ['NextJS', 'Tailwind', 'FastAPI', 'Postgres', 'SQLAlchemy', 'PyTorch'],
    githubUrl: 'https://github.com/yourusername/medpass',
    liveUrl: 'https://medpass.demo',
    image: '/projects/medpass.png'
  },
  {
    title: 'Rapter 7',
    description: 'Full-stack application with comprehensive testing and CI/CD pipeline.',
    techStack: ['NextJS', 'Tailwind', 'MongoDB', 'Jest', 'GitHub Actions'],
    githubUrl: 'https://github.com/yourusername/rapter7',
    liveUrl: 'https://rapter7.demo',
    image: '/projects/rapter7.png'
  },
  {
    title: 'Emotion Recognition',
    description: 'AI-powered emotion recognition system using speech analysis.',
    techStack: ['Python', 'TensorFlow', 'Signal Processing', 'Neural Networks'],
    githubUrl: 'https://github.com/yourusername/emotion-recognition',
    liveUrl: 'https://emotion.demo',
    image: '/projects/emotion.png'
  }
];

export const ProjectsSection = () => {
  return (
    <section className="container mx-auto px-4 py-24" id="projects">
      <h2 className="text-4xl font-bold mb-12">Featured Projects</h2>
      <div className="grid grid-cols-1 gap-8">
        {projects.map((project, index) => (
          <Card 
            key={index}
            className="bg-gray-800/50 border-gray-700 hover:border-blue-500 transition-all duration-300"
          >
            <CardHeader>
              <CardTitle className="text-2xl">{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.map((tech, i) => (
                  <Badge key={i} variant="secondary" className="bg-blue-900/50">
                    {tech}
                  </Badge>
                ))}
              </div>
              {project.image && (
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="rounded-lg w-full object-cover h-64"
                />
              )}
            </CardContent>
            <CardFooter className="flex gap-4">
              <a 
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <Github className="h-5 w-5" />
                Code
              </a>
              <a 
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <ExternalLink className="h-5 w-5" />
                Live Demo
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};