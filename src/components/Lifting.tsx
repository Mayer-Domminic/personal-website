import React, { useEffect, useState } from 'react';
import { 
  Dumbbell, 
  TrendingUp, 
  Calendar, 
  Clock, 
  BarChart4, 
  Award,
  Plus,
  X,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

// Types
interface WorkoutExerciseSet {
  index: number;
  type: string;
  weight_kg: number;
  reps: number;
  distance_meters: number | null;
  duration_seconds: number | null;
  rpe: number;
}

interface WorkoutExercise {
  index: number;
  title: string;
  notes: string;
  exercise_template_id: string;
  supersets_id: number;
  sets: WorkoutExerciseSet[];
}

interface Workout {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  updated_at: string;
  created_at: string;
  exercises: WorkoutExercise[];
}

interface ApiResponse {
  page: number;
  page_count: number;
  workouts: Workout[];
}

// Exercise progression interface
interface ExerciseProgress {
  date: string;
  weight: number;
  reps: number;
  volume: number;
}

interface ExerciseProgressMap {
  [key: string]: ExerciseProgress[];
}

// Constants
const API_KEY = process.env.NEXT_PUBLIC_HEVY_API_KEY || '';
const API_URL = 'https://api.hevyapp.com/v1';

const LiftingPage: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgressMap>({});
  const [totalStats, setTotalStats] = useState({
    totalWorkouts: 0,
    totalWeight: 0,
    totalSets: 0,
    mostFrequentExercise: '',
    highestWeightExercise: { name: '', weight: 0 }
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [fetchingAllData, setFetchingAllData] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchAllWorkouts();
  }, []);
  
  useEffect(() => {
    // This handles pagination in the UI
    if (allWorkouts.length > 0) {
      const pageSize = 10;
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      setWorkouts(allWorkouts.slice(startIndex, endIndex));
    }
  }, [currentPage, allWorkouts]);

  const fetchAllWorkouts = async () => {
    setLoading(true);
    setFetchingAllData(true);
    try {
      // First, fetch the first page to get total page count
      const initialResponse = await fetch(`${API_URL}/workouts?page=1&pageSize=10`, {
        headers: {
          'api-key': API_KEY
        }
      });
      
      if (!initialResponse.ok) {
        throw new Error('Failed to fetch workouts');
      }
      
      const initialData: ApiResponse = await initialResponse.json();
      const totalPageCount = initialData.page_count;
      setTotalPages(totalPageCount);
      
      // Store all fetched workouts here
      let allFetchedWorkouts: Workout[] = [...initialData.workouts];
      
      // Fetch all remaining pages
      const remainingPages = Array.from({ length: totalPageCount - 1 }, (_, i) => i + 2);
      
      // Display the first page of workouts immediately
      setWorkouts(initialData.workouts);
      
      if (remainingPages.length > 0) {
        // Create an array of promises for all remaining pages
        const pagePromises = remainingPages.map(page => 
          fetch(`${API_URL}/workouts?page=${page}&pageSize=10`, {
            headers: {
              'api-key': API_KEY
            }
          })
          .then(response => {
            if (!response.ok) throw new Error(`Failed to fetch page ${page}`);
            return response.json();
          })
          .then((data: ApiResponse) => data.workouts)
          .catch(error => {
            console.error(`Error fetching page ${page}:`, error);
            return []; // Return empty array for failed pages
          })
        );
        
        // Wait for all pages to load
        const additionalWorkouts = await Promise.all(pagePromises);
        
        // Combine all workouts into a single array
        additionalWorkouts.forEach(pageWorkouts => {
          allFetchedWorkouts = [...allFetchedWorkouts, ...pageWorkouts];
        });
      }
      
      // Sort all workouts by date (newest first)
      allFetchedWorkouts.sort((a, b) => 
        new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
      );
      
      setAllWorkouts(allFetchedWorkouts);
      
      // Process all workout data for statistics and progress tracking
      processWorkoutData(allFetchedWorkouts);

    } catch (err) {
      setError('Error fetching workout data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
      setFetchingAllData(false);
    }
  };

  const processWorkoutData = (workouts: Workout[]) => {
    const exerciseMap: ExerciseProgressMap = {};
    const exerciseCount: { [key: string]: number } = {};
    let totalWeight = 0;
    let totalSets = 0;
    let highestWeight = { name: '', weight: 0 };

    workouts.forEach(workout => {
      const workoutDate = new Date(workout.start_time).toISOString().split('T')[0];
      
      workout.exercises.forEach(exercise => {
        // Count exercise frequency
        exerciseCount[exercise.title] = (exerciseCount[exercise.title] || 0) + 1;
        
        // Track highest weight
        const maxSetWeight = Math.max(...exercise.sets.map(set => set.weight_kg || 0));
        if (maxSetWeight > highestWeight.weight) {
          highestWeight = { name: exercise.title, weight: maxSetWeight };
        }
        
        // Calculate total weight lifted and total sets
        totalSets += exercise.sets.length;
        
        // Create progress data for each exercise
        if (!exerciseMap[exercise.title]) {
          exerciseMap[exercise.title] = [];
        }
        
        // For each set in the exercise
        exercise.sets.forEach(set => {
          totalWeight += (set.weight_kg || 0) * (set.reps || 0);
          
          // Only include sets with weight for progression tracking
          if (set.weight_kg > 0) {
            const volume = (set.weight_kg || 0) * (set.reps || 0);
            
            // Check if we already have an entry for this date and exercise
            const existingEntryIndex = exerciseMap[exercise.title].findIndex(
              item => item.date === workoutDate
            );
            
            if (existingEntryIndex >= 0) {
              // If the weight is higher, update the entry
              if (set.weight_kg > exerciseMap[exercise.title][existingEntryIndex].weight) {
                exerciseMap[exercise.title][existingEntryIndex].weight = set.weight_kg;
                exerciseMap[exercise.title][existingEntryIndex].reps = set.reps;
                exerciseMap[exercise.title][existingEntryIndex].volume = volume;
              }
            } else {
              // Add a new entry
              exerciseMap[exercise.title].push({
                date: workoutDate,
                weight: set.weight_kg,
                reps: set.reps,
                volume: volume
              });
            }
          }
        });
      });
    });

    // Find most frequent exercise
    let mostFrequentExercise = '';
    let highestCount = 0;
    
    Object.entries(exerciseCount).forEach(([exercise, count]) => {
      if (count > highestCount) {
        highestCount = count;
        mostFrequentExercise = exercise;
      }
    });

    // Sort progression data by date
    Object.keys(exerciseMap).forEach(exercise => {
      exerciseMap[exercise].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });

    setExerciseProgress(exerciseMap);
    setTotalStats({
      totalWorkouts: workouts.length,
      totalWeight,
      totalSets,
      mostFrequentExercise,
      highestWeightExercise: highestWeight
    });

    // Set initial selected exercise if we have data
    if (!selectedExercise && Object.keys(exerciseMap).length > 0) {
      setSelectedExercise(Object.keys(exerciseMap)[0]);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getProgressData = () => {
    if (!selectedExercise || !exerciseProgress[selectedExercise]) {
      return [];
    }
    
    return exerciseProgress[selectedExercise].map(progress => ({
      date: progress.date,
      weight: progress.weight,
      volume: progress.volume
    }));
  };

  // Generate workout distribution data
  const getWorkoutDistribution = () => {
    const dayMap: {[key: string]: number} = {
      'Sun': 0, 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0
    };
    
    workouts.forEach(workout => {
      const date = new Date(workout.start_time);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3);
      dayMap[day] += 1;
    });
    
    return Object.entries(dayMap).map(([day, count]) => ({
      day,
      count
    }));
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(allWorkouts.length / 10)) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 ">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="mb-8 font-mono">
            <span className="text-blue-400">const</span>{' '}
            <span className="text-purple-400">liftingJourney</span>{' '}
            <span className="text-blue-400">=</span>{' '}
            <span className="text-green-400">'</span>
            <span>Progress Tracking</span>
            <span className="text-green-400">'</span>
          </div>

          <h1 className={`text-4xl md:text-6xl font-bold mb-6 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            My Weightlifting {' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Journey
            </span>
          </h1>

          <p className={`text-xl text-gray-300 mb-8 transition-opacity duration-1000 delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            Track my strength progression, workout habits, and performance metrics 
            powered by Hevy. This dashboard shows my commitment to consistent improvement
            and the data-driven approach to my fitness journey.
          </p>

          {/* Stats Overview */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                  Total Workouts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStats.totalWorkouts}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Dumbbell className="h-4 w-4 mr-2 text-blue-400" />
                  Total Weight Lifted
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(totalStats.totalWeight / 1000).toFixed(1)} tons</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <BarChart4 className="h-4 w-4 mr-2 text-blue-400" />
                  Total Sets Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStats.totalSets}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Award className="h-4 w-4 mr-2 text-blue-400" />
                  Heaviest Lift
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStats.highestWeightExercise.weight} kg</div>
                <div className="text-xs text-gray-400">{totalStats.highestWeightExercise.name}</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className={`transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Tabs defaultValue="progress" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
                <TabsTrigger value="insights">Workout Insights</TabsTrigger>
                <TabsTrigger value="history">Workout History</TabsTrigger>
              </TabsList>
              
              {/* Progress Tracking Content */}
              <TabsContent value="progress" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="bg-gray-800/50 border-gray-700 lg:col-span-1">
                    <CardHeader>
                      <CardTitle className="text-xl">Select Exercise</CardTitle>
                      <CardDescription>
                        Choose an exercise to view my progression
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 max-h-96 overflow-y-auto">
                      <div className="flex flex-col gap-2">
                        {Object.keys(exerciseProgress).map(exercise => (
                          <Button
                            key={exercise}
                            variant={selectedExercise === exercise ? "default" : "outline"}
                            className={`justify-start text-left font-normal ${
                              selectedExercise === exercise
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "border-gray-700 hover:border-blue-500"
                            }`}
                            onClick={() => setSelectedExercise(exercise)}
                          >
                            <Dumbbell className="h-4 w-4 mr-2" />
                            {exercise}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-800/50 border-gray-700 lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-xl">
                        {selectedExercise ? selectedExercise : 'Exercise'} Progression
                      </CardTitle>
                      <CardDescription>
                        Track my strength gains over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedExercise && exerciseProgress[selectedExercise]?.length > 0 ? (
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={getProgressData()}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                              <XAxis 
                                dataKey="date"
                                stroke="#94a3b8"
                                tick={{fill: '#94a3b8'}}
                                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                              />
                              <YAxis 
                                stroke="#94a3b8"
                                tick={{fill: '#94a3b8'}}
                                label={{ 
                                  value: 'Weight (kg)', 
                                  angle: -90, 
                                  position: 'insideLeft',
                                  style: { fill: '#94a3b8' }
                                }}
                              />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.375rem' }}
                                formatter={(value) => [`${value} kg`, 'Weight']}
                                labelFormatter={(date) => formatDate(date.toString())}
                              />
                              <Legend wrapperStyle={{ color: '#94a3b8' }} />
                              <Line 
                                type="monotone" 
                                dataKey="weight" 
                                name="Weight (kg)"
                                stroke="#60a5fa" 
                                activeDot={{ r: 8 }}
                                strokeWidth={2}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-80 text-gray-400">
                          <TrendingUp className="h-12 w-12 mb-4" />
                          <p>Select an exercise to view progression data</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Insights Content */}
              <TabsContent value="insights" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">

                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-xl">Top Exercises</CardTitle>
                      <CardDescription>
                      My most frequent exercises
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(exerciseProgress)
                          .sort((a, b) => b[1].length - a[1].length)
                          .slice(0, 5)
                          .map(([exercise, data], index) => (
                            <div key={exercise} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="bg-blue-900/50 text-blue-200 w-6 h-6 rounded-full flex items-center justify-center mr-3">
                                  {index + 1}
                                </div>
                                <div>
                                  <p className="font-medium">{exercise}</p>
                                  <p className="text-sm text-gray-400">{data.length} sessions</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-blue-400">
                                  {Math.max(...data.map(d => d.weight))} kg
                                </p>
                                <p className="text-sm text-gray-400">best</p>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Workout History Content */}
              <TabsContent value="history" className="mt-6">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Recent Workouts</CardTitle>
                      <CardDescription>
                      My workout history
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1 || fetchingAllData}
                        className="border-gray-700 hover:border-blue-500"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm">
                        Page {currentPage} of {Math.ceil(allWorkouts.length / 10)}
                        {fetchingAllData && " (Loading all data...)"}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentPage === Math.ceil(allWorkouts.length / 10) || fetchingAllData}
                        className="border-gray-700 hover:border-blue-500"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                                          {loading || fetchingAllData ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                        {fetchingAllData && <p className="text-sm text-gray-400">Fetching all my workout data...</p>}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {workouts.length > 0 ? (
                          workouts.map(workout => (
                            <Card key={workout.id} className="bg-gray-800/30 border-gray-700 hover:border-blue-500 transition-all duration-300">
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <CardTitle className="text-lg">{workout.title}</CardTitle>
                                  <Badge variant="secondary" className="bg-blue-900/50 text-blue-200">
                                    {formatDate(workout.start_time)}
                                  </Badge>
                                </div>
                                {workout.description && (
                                  <CardDescription>
                                    {workout.description}
                                  </CardDescription>
                                )}
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {workout.exercises.slice(0, 3).map((exercise, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <Dumbbell className="h-4 w-4 text-blue-400 flex-shrink-0" />
                                      <span className="text-sm truncate">{exercise.title}</span>
                                      <span className="text-xs text-gray-400">
                                        {exercise.sets.length} sets
                                      </span>
                                    </div>
                                  ))}
                                  {workout.exercises.length > 3 && (
                                    <div className="flex items-center gap-2">
                                      <Plus className="h-4 w-4 text-gray-400" />
                                      <span className="text-sm text-gray-400">
                                        {workout.exercises.length - 3} more exercises
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                              <CardFooter className="pt-0">
                                <div className="flex items-center text-xs text-gray-400">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {workout.end_time && workout.start_time ? (
                                    <span>
                                      {Math.round((new Date(workout.end_time).getTime() - new Date(workout.start_time).getTime()) / 60000)} min
                                    </span>
                                  ) : (
                                    <span>Duration unavailable</span>
                                  )}
                                </div>
                              </CardFooter>
                            </Card>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-400">
                            No workouts found
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiftingPage;