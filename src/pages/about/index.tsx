export default function AboutPage() {
    return (
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold mb-12">About Me</h1>
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-6">My Journey</h2>
            <GlobeVisualization />
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-6">Learning Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {learningProgress.map((progress, index) => (
                <ProgressTracker key={index} progress={progress} />
              ))}
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-6">Reading List</h2>
            <ReadingList />
          </section>
        </div>
      </div>
    );
  }