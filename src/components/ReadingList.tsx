export const ReadingList = () => {
    const books = [
      {
        title: "Book Title",
        author: "Author Name",
        status: "Currently Reading",
        progress: 65,
        notes: "Key insights and thoughts..."
      }
      // Add more books
    ];
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {books.map((book, index) => (
          <Card key={index} className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle>{book.title}</CardTitle>
              <CardDescription>{book.author}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="w-full bg-gray-700 h-2 rounded-full">
                  <div 
                    className="bg-blue-400 h-2 rounded-full"
                    style={{ width: `${book.progress}%` }}
                  />
                </div>
                <p className="text-gray-300">{book.notes}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };