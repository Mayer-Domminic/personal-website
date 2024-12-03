export const BlogCard = ({ post }: { post: BlogPost }) => (
    <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl text-white">{post.title}</CardTitle>
        <CardDescription className="text-gray-400">{post.date}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300">{post.excerpt}</p>
      </CardContent>
      <CardFooter>
        <Link 
          href={`/blog/${post.category}/${post.slug}`}
          className="text-blue-400 hover:text-blue-300"
        >
          Read more →
        </Link>
      </CardFooter>
    </Card>
  );
  