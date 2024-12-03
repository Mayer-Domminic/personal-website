import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

const interests = [
  {
    title: "Photography & Travel",
    description: "Exploring the world through my lens, capturing moments and stories from various adventures.",
    icon: "📸",
    link: "/blog/photography",
    category: "creative"
  },
  {
    title: "Outdoor Activities",
    description: "Hiking, dirt bike riding, and climbing - always seeking new challenges in nature.",
    icon: "🏔️",
    link: "/blog/outdoors",
    category: "adventure"
  },
  {
    title: "Reading & Learning",
    description: "Exploring new ideas through books, podcasts, and continuous education.",
    icon: "📚",
    link: "/blog/learning",
    category: "education"
  },
  {
    title: "Technology & Innovation",
    description: "Building solutions with AI/ML, exploring LLMs, and contributing to open source.",
    icon: "🤖",
    link: "/blog/tech",
    category: "tech"
  },
  {
    title: "Personal Growth",
    description: "Piano practice, language learning (Chinese), and physical fitness.",
    icon: "🎹",
    link: "/blog/progress",
    category: "growth"
  }
];

export const InterestsSection = () => {
  return (
    <section className="container mx-auto px-4 py-24" id="interests">
      <h2 className="text-4xl font-bold mb-12">Beyond the Code</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {interests.map((interest, index) => (
          <Link href={interest.link} key={index}>
            <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500 transition-all duration-300 h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{interest.icon}</span>
                  <CardTitle className="text-xl">{interest.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{interest.description}</p>
              </CardContent>
              <CardFooter>
                <span className="text-blue-400 hover:text-blue-300">
                  Learn more →
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};