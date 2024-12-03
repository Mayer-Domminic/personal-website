
export default function ProjectsPage() {
    return (
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold mb-12">Projects</h1>
        <div className="grid grid-cols-1 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
    );
  }