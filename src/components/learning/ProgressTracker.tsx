export const ProgressTracker = ({ progress }: { progress: LearningProgress }) => (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle>{progress.skill}</CardTitle>
        <CardDescription>Current Level: {progress.currentLevel}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {progress.milestones.map((milestone, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <div>
                <p className="text-sm text-gray-400">{milestone.date}</p>
                <p className="text-white">{milestone.achievement}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );