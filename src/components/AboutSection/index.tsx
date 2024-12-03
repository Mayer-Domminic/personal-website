import { Card, CardContent } from '@/components/ui/card';

export const AboutSection = () => {
  return (
    <section className="container mx-auto px-4 py-24 bg-gray-900/50" id="about">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-12">About Me</h2>
        <div className="space-y-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <p className="text-lg text-gray-300 leading-relaxed">
                I'm a software engineer focused on building innovative solutions that make a positive impact. 
                My journey in technology has been driven by a passion for creating tools that help people 
                learn, grow, and achieve their goals more effectively.
              </p>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Current Focus</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• AI/ML Applications for Social Good</li>
                  <li>• Full-Stack Web Development</li>
                  <li>• Cloud Architecture & DevOps</li>
                  <li>• Technical Leadership</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Learning Path</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Advanced Machine Learning</li>
                  <li>• Rust Programming</li>
                  <li>• System Design & Architecture</li>
                  <li>• Chinese Language</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};