export default function BlogPage() {
    const categories = [
      {
        title: "Photography",
        description: "Visual stories from my travels and adventures",
        icon: "📸",
        slug: "photography"
      },
      {
        title: "Outdoor Adventures",
        description: "Hiking, climbing, and dirt bike experiences",
        icon: "🏔️",
        slug: "outdoors"
      },
      {
        title: "Tech & Innovation",
        description: "Thoughts on AI, ML, and technology",
        icon: "🤖",
        slug: "tech"
      },
      {
        title: "Learning Journey",
        description: "Progress in piano, Chinese, and programming",
        icon: "📚",
        slug: "learning"
      }
    ];
  
    return (
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold mb-12">Blog</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.slug}
              href={`/blog/${category.slug}`}
              className="group"
            >
              <Card className="bg-gray-800/50 border-gray-700 group-hover:border-blue-500 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{category.icon}</span>
                    <CardTitle>{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    );
  }