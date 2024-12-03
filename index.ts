
export interface Location {
    name: string;
    lat: number;
    lng: number;
    type: 'visited' | 'dream';
  }
  
  export interface Project {
    title: string;
    description: string;
    techStack: string[];
    githubUrl: string;
    liveUrl: string;
    image?: string;
  }
  
  export interface BlogPost {
    title: string;
    slug: string;
    date: string;
    category: string;
    excerpt: string;
    content: string;
  }
  
  export interface LearningProgress {
    skill: string;
    currentLevel: string;
    startDate: string;
    milestones: Array<{
      date: string;
      achievement: string;
    }>;
  }