const interests = [
    {
      title: "Photography & Travel",
      description: "Capturing moments while exploring new places and cultures",
      icon: "📸",
      link: "/blog/photography"
    },
    {
      title: "Outdoor Adventures",
      description: "Hiking, dirt bike riding, and climbing experiences",
      icon: "🏔️",
      link: "/blog/outdoors"
    },
    {
      title: "Learning & Growth",
      description: "Books, podcasts, and continuous self-improvement",
      icon: "📚",
      link: "/blog/learning"
    },
    {
      title: "Tech & Innovation",
      description: "AI/ML, LLMs, and technology for social good",
      icon: "🤖",
      link: "/blog/tech"
    },
    {
      title: "Personal Development",
      description: "Piano, Chinese language, Rust programming",
      icon: "🎹",
      link: "/blog/progress"
    }
  ];

const PersonalInterests = () => (
<section className="mt-20">
    <h2 className="text-3xl font-bold mb-8">Interests & Activities</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {interests.map((interest, index) => (
        <Card key={index} className="bg-gray-800/50 border-gray-700 hover:border-blue-500 transition-all duration-300">
        <CardHeader>
            <div className="flex items-center gap-3">
            <span className="text-4xl">{interest.icon}</span>
            <CardTitle className="text-xl text-white">{interest.title}</CardTitle>
            </div>
        </CardHeader>
        <CardContent>
            <p className="text-gray-300">{interest.description}</p>
        </CardContent>
        <CardFooter>
            <Link href={interest.link} className="text-blue-400 hover:text-blue-300">
            Learn more →
            </Link>
        </CardFooter>
        </Card>
    ))}
    </div>
</section>
);