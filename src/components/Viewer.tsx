import React, { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Maximize, 
  Minimize,
  Info,
  RotateCcw,
  Github,
  FileText,
  Folder,
  FolderOpen,
  Menu,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// Define our data structure
interface ImageCategory {
  description: string;
  images: string[];
  date?: string;
}

interface ImageData {
  [category: string]: ImageCategory;
}

interface GitHubFile {
  path: string;
  type: string;
  sha: string;
  size?: number;
  url?: string;
  content?: string;
  download_url?: string;
}

const PhotoAndObsidianViewer: React.FC = () => {
  // Your image data
  const imageData: ImageData = {
    "Sunsets & Skies": {
      "description": "Vibrant sunsets, twilight skies, and nighttime landscapes.",
      "date": "2023-2024",
      "images": [
        "DM100462.JPG",
        "DM100464.JPG",
        "DM100465.JPG",
        "DM100491.JPG",
        "DM100493.JPG",
        "DM100499.JPG",
        "DM100502.JPG",
        "DM100791.JPG",
        "DM100792.JPG",
        "DM100793.JPG",
        "DM100852.JPG",
        "DM100853.JPG",
        "DM100862.JPG"
      ]
    },
    "Nature & Water": {
      "description": "Forests, waterfalls, rivers, and lakes.",
      "date": "2023-2024",
      "images": [
        "20240422_190429.jpg",
        "20240422_194054.jpg",
        "DM100814.JPG",
        "DM100815.JPG",
        "DM100825.JPG",
        "DM100851.JPG",
        "DM100844.JPG",
        "20231013_102817.jpg"
      ]
    },
    "Urban & Nightlife": {
      "description": "Cityscapes, buildings, and urban environments at night.",
      "date": "2023",
      "images": [
        "20230308_210251.jpg",
        "20230326_004202.jpg",
        "DM100877.JPG",
        "DM100888.JPG",
        "DM100894.JPG",
        "DM100908.JPG"
      ]
    },
    "Pets & Animals": {
      "description": "Cats, dogs, and other animals.",
      "date": "2023-2024",
      "images": [
        "DM100454.JPG",
        "DM100471.JPG",
        "DM100477.JPG",
        "DM100478.JPG",
        "DM100487.JPG",
        "DM100488.JPG",
        "DM100964.JPG",
        "DM100965.JPG"
      ]
    },
    "Winter & Roads": {
      "description": "Snowy landscapes and roads.",
      "date": "2023",
      "images": [
        "DM100982.JPG",
        "DM100984.JPG"
      ]
    }
  };
  
  // Prepare image paths - CHANGED to use /gallery/ instead of /images/
  const IMAGE_BASE_PATH = "/gallery"; // FIXED path to match your directory structure
  
  // State management for photo gallery
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [mainImagePosition, setMainImagePosition] = useState({ x: 0, y: 0 });
  const [isMainImageDragging, setIsMainImageDragging] = useState(false);
  const [mainImageStartPos, setMainImageStartPos] = useState({ x: 0, y: 0 });
  const [showInfo, setShowInfo] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [direction, setDirection] = useState(0);
  const [expandedCards, setExpandedCards] = useState<string[]>([]);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<null | 'left' | 'right'>(null);
  const [swipeStartX, setSwipeStartX] = useState(0);
  const [imageDimensions, setImageDimensions] = useState<{[key: string]: {width: number, height: number}}>({});
  
  // GitHub repo state management
  const [repoFiles, setRepoFiles] = useState<GitHubFile[]>([]);
  const [repoLoading, setRepoLoading] = useState(false);
  const [repoError, setRepoError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<GitHubFile | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileContentLoading, setFileContentLoading] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  // Motion values for card interactions
  const cardSpringConfig = { stiffness: 300, damping: 30 };
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  
  // Fetch GitHub repo data
  useEffect(() => {
    const fetchGitHubRepo = async () => {
      setRepoLoading(true);
      setRepoError(null);
      
      try {
        // Fetch the repository contents
        const response = await fetch('https://api.github.com/repos/Mayer-Domminic/obsidian-repo/contents/');
        
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const data = await response.json();
        setRepoFiles(data);
      } catch (error) {
        console.error('Error fetching GitHub repository:', error);
        setRepoError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setRepoLoading(false);
      }
    };
    
    fetchGitHubRepo();
  }, []);
  
  // Fetch file content when a file is selected
  useEffect(() => {
    if (!selectedFile || selectedFile.type !== 'file') return;
    
    const fetchFileContent = async () => {
      setFileContentLoading(true);
      
      try {
        // Only fetch if we have a download URL
        if (selectedFile.download_url) {
          const response = await fetch(selectedFile.download_url);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch file content: ${response.status}`);
          }
          
          const content = await response.text();
          setFileContent(content);
        } else {
          setFileContent('Content not available');
        }
      } catch (error) {
        console.error('Error fetching file content:', error);
        setFileContent(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setFileContentLoading(false);
      }
    };
    
    fetchFileContent();
  }, [selectedFile]);
  
  // Get bounds for draggable cards
  const getDragConstraints = () => {
    if (!cardsContainerRef.current) return { top: 0, left: 0, right: 0, bottom: 0 };
    
    const containerWidth = cardsContainerRef.current.offsetWidth;
    return {
      top: 0,
      left: -containerWidth * 0.05,
      right: containerWidth * 0.05,
      bottom: 0
    };
  };
  
  // Spring rotation
  const rotationSpring = useSpring(0, cardSpringConfig);
  useEffect(() => {
    rotationSpring.set(rotationDegree);
  }, [rotationDegree]);
  
  // Helper to get image URL - FIXED to use the correct path
  const getImageUrl = (filename: string, category: string) => {
    // Clean category name for folder structure
    const categoryFolder = category.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `${IMAGE_BASE_PATH}/${categoryFolder}/${filename}`;
  };
  
  // Helper to get cover image for a category
  const getCoverImage = (category: string) => {
    const fallbackImage = `${IMAGE_BASE_PATH}/placeholder.jpg`;
    
    if (!imageData[category].images || imageData[category].images.length === 0) {
      return fallbackImage;
    }
    
    return getImageUrl(imageData[category].images[0], category);
  };
  
  // Toggle card expansion in overview
  const toggleCardExpansion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (expandedCards.includes(id)) {
      setExpandedCards(expandedCards.filter(cardId => cardId !== id));
    } else {
      setExpandedCards([...expandedCards, id]);
    }
  };
  
  // Toggle folder expansion in repo view
  const toggleFolderExpansion = (path: string) => {
    if (expandedFolders.includes(path)) {
      setExpandedFolders(expandedFolders.filter(folder => folder !== path));
    } else {
      setExpandedFolders([...expandedFolders, path]);
    }
  };
  
  // Open a category with animation sequence
  const openCategory = (category: string) => {
    // First mark which category is being opened for animation
    setOpenCategoryId(category);
    
    // After initial animation completes, set the full selected category state
    setTimeout(() => {
      setSelectedCategory(category);
      setCurrentImageIndex(0);
      setMainImagePosition({ x: 0, y: 0 });
      setRotationDegree(0);
      setTimeout(() => setIsRotating(true), 1000);
      document.body.style.overflow = 'hidden';
    }, 400);
  };
  
  // Close the current category view
  const closeCategory = () => {
    setIsRotating(false);
    document.body.style.overflow = '';
    
    // Set openCategoryId to null first for closing animation
    setTimeout(() => {
      setSelectedCategory(null);
      setCurrentImageIndex(0);
      setFullScreen(false);
      setOpenCategoryId(null);
    }, 400);
  };
  
  // Navigation functions
  const handlePrev = () => {
    if (!isMainImageDragging && selectedCategory) {
      setDirection(-1);
      setIsRotating(false);
      setRotationDegree(0);
      
      setTimeout(() => {
        setCurrentImageIndex((prev) => 
          prev === 0 ? imageData[selectedCategory].images.length - 1 : prev - 1
        );
        resetMainImagePosition();
        setIsRotating(true);
      }, 300);
    }
  };

  const handleNext = () => {
    if (!isMainImageDragging && selectedCategory) {
      setDirection(1);
      setIsRotating(false);
      setRotationDegree(0);
      
      setTimeout(() => {
        setCurrentImageIndex((prev) => 
          prev === imageData[selectedCategory].images.length - 1 ? 0 : prev + 1
        );
        resetMainImagePosition();
        setIsRotating(true);
      }, 300);
    }
  };
  
  // Reset image position and rotation
  const resetMainImagePosition = () => {
    setMainImagePosition({ x: 0, y: 0 });
    setRotationDegree(0);
  };
  
  // Handle rotation based on drag gesture
  const handleRotation = (offsetX: number) => {
    // Calculate rotation based on horizontal drag
    const maxRotation = 25; // Maximum rotation in degrees
    const dampenFactor = 0.5; // Dampen the rotation effect
    
    // Map the x position to a rotation angle
    const newRotation = offsetX * dampenFactor;
    
    // Limit rotation to max values
    setRotationDegree(
      Math.min(Math.max(newRotation, -maxRotation), maxRotation)
    );
  };
  
  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedCategory) {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') closeCategory();
    }
  };
  
  // Handle swipe for rotation
  const handleSwipeStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setSwipeStartX(clientX);
    setSwipeDirection(null);
  };
  
  const handleSwipeMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (swipeStartX === 0) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - swipeStartX;
    
    // Calculate rotation based on swipe
    handleRotation(deltaX);
    
    // Determine swipe direction for potential image change
    if (Math.abs(deltaX) > 50) {
      setSwipeDirection(deltaX > 0 ? 'right' : 'left');
    } else {
      setSwipeDirection(null);
    }
  };
  
  const handleSwipeEnd = () => {
    // If significant rotation/swipe, change image
    if (swipeDirection === 'left' && rotationDegree < -15) {
      handleNext();
    } else if (swipeDirection === 'right' && rotationDegree > 15) {
      handlePrev();
    } else {
      // Reset rotation with spring animation
      setRotationDegree(0);
    }
    
    // Reset swipe tracking
    setSwipeStartX(0);
    setSwipeDirection(null);
  };
  
  // Gallery navigation drag handlers
  const handleGalleryMouseDown = (e: React.MouseEvent) => {
    if (!isMainImageDragging) {
      setIsDragging(true);
      setStartX(e.clientX);
    }
  };

  const handleGalleryTouchStart = (e: React.TouchEvent) => {
    if (!isMainImageDragging) {
      setIsDragging(true);
      setStartX(e.touches[0].clientX);
    }
  };

  const handleGalleryMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - startX;
    setTranslateX(diff);
  };

  const handleGalleryTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setTranslateX(diff);
  };

  const handleGalleryDragEnd = () => {
    if (!isDragging) return;
    
    if (translateX > 100) {
      handlePrev();
    } else if (translateX < -100) {
      handleNext();
    }
    
    setIsDragging(false);
    setTranslateX(0);
  };
  
  // Main image dragging handlers
  const handleMainImageMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMainImageDragging(true);
    setMainImageStartPos({
      x: e.clientX - mainImagePosition.x,
      y: e.clientY - mainImagePosition.y
    });
  };

  const handleMainImageTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsMainImageDragging(true);
    setMainImageStartPos({
      x: e.touches[0].clientX - mainImagePosition.x,
      y: e.touches[0].clientY - mainImagePosition.y
    });
  };

  const handleMainImageMouseMove = (e: React.MouseEvent) => {
    if (!isMainImageDragging) return;
    e.stopPropagation();
    
    // Calculate new position with limits 
    const maxDragDistance = 100;
    const newX = Math.min(Math.max(e.clientX - mainImageStartPos.x, -maxDragDistance), maxDragDistance);
    const newY = Math.min(Math.max(e.clientY - mainImageStartPos.y, -maxDragDistance), maxDragDistance);
    
    // Set position and calculate rotation
    setMainImagePosition({
      x: newX,
      y: newY
    });
    
    // Add rotation based on horizontal movement
    handleRotation(newX);
  };

  const handleMainImageTouchMove = (e: React.TouchEvent) => {
    if (!isMainImageDragging) return;
    e.stopPropagation();
    
    const maxDragDistance = 100;
    const newX = Math.min(Math.max(e.touches[0].clientX - mainImageStartPos.x, -maxDragDistance), maxDragDistance);
    const newY = Math.min(Math.max(e.touches[0].clientY - mainImageStartPos.y, -maxDragDistance), maxDragDistance);
    
    setMainImagePosition({
      x: newX,
      y: newY
    });
    
    // Add rotation based on horizontal movement
    handleRotation(newX);
  };

  const handleMainImageDragEnd = () => {
    if (!isMainImageDragging) return;
    setIsMainImageDragging(false);
    
    // Gradually reset rotation
    setRotationDegree(0);
  };
  
  // Set up event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mouseup', () => {
      handleGalleryDragEnd();
      handleMainImageDragEnd();
      handleSwipeEnd();
    });
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mouseup', () => {
        handleGalleryDragEnd();
        handleMainImageDragEnd();
        handleSwipeEnd();
      });
    };
  }, [isDragging, isMainImageDragging, selectedCategory, currentImageIndex, rotationDegree, swipeDirection]);
  
  // Categories array
  const categories = Object.keys(imageData);
  
  // Recursive component to render file tree
  const FileTree = ({ files, basePath = '' }: { files: GitHubFile[], basePath?: string }) => {
    // Group files by folder
    const folders: { [key: string]: GitHubFile[] } = {};
    const rootFiles: GitHubFile[] = [];
    
    // First pass: identify folders and root files
    files.forEach(file => {
      if (basePath && !file.path.startsWith(basePath)) return;
      
      const relativePath = basePath ? file.path.slice(basePath.length) : file.path;
      const pathParts = relativePath.split('/').filter(Boolean);
      
      if (pathParts.length === 0) return;
      
      if (pathParts.length === 1) {
        rootFiles.push(file);
      } else {
        const folderName = pathParts[0];
        if (!folders[folderName]) {
          folders[folderName] = [];
        }
      }
    });
    
    // Second pass: assign files to folders
    files.forEach(file => {
      if (basePath && !file.path.startsWith(basePath)) return;
      
      const relativePath = basePath ? file.path.slice(basePath.length) : file.path;
      const pathParts = relativePath.split('/').filter(Boolean);
      
      if (pathParts.length > 1) {
        const folderName = pathParts[0];
        const folderPath = basePath ? `${basePath}${folderName}/` : `${folderName}/`;
        
        // Only include if this file belongs directly to this folder level
        if (pathParts.length === 2) {
          folders[folderName].push(file);
        }
      }
    });
    
    // Sort folders and files
    const sortedFolderNames = Object.keys(folders).sort();
    const sortedRootFiles = rootFiles.sort((a, b) => a.path.localeCompare(b.path));
    
    return (
      <div className="space-y-1">
        {/* Render folders */}
        {sortedFolderNames.map(folderName => {
          const folderPath = basePath ? `${basePath}${folderName}/` : `${folderName}/`;
          const isExpanded = expandedFolders.includes(folderPath);
          
          return (
            <div key={folderPath}>
              <div 
                className="flex items-center py-1.5 px-2 rounded-md hover:bg-zinc-800/50 cursor-pointer text-zinc-200"
                onClick={() => toggleFolderExpansion(folderPath)}
              >
                {isExpanded ? 
                  <FolderOpen size={16} className="mr-2 text-blue-400" /> : 
                  <Folder size={16} className="mr-2 text-blue-400" />
                }
                <span className="text-sm">{folderName}</span>
              </div>
              
              {isExpanded && (
                <div className="ml-4 pl-2 border-l border-zinc-800">
                  <FileTree files={files} basePath={folderPath} />
                </div>
              )}
            </div>
          );
        })}
        
        {/* Render files */}
        {sortedRootFiles.map(file => {
          const isMarkdown = file.path.endsWith('.md');
          const isSelected = selectedFile?.path === file.path;
          
          return (
            <div 
              key={file.path}
              className={cn(
                "flex items-center py-1.5 px-2 rounded-md cursor-pointer text-sm",
                isSelected ? "bg-zinc-800 text-white" : "text-zinc-300 hover:bg-zinc-800/50 hover:text-white"
              )}
              onClick={() => setSelectedFile(file)}
            >
              <FileText size={16} className={cn(
                "mr-2", 
                isMarkdown ? "text-green-400" : "text-orange-400"
              )} />
              {file.path.split('/').pop()}
            </div>
          );
        })}
      </div>
    );
  };
  
  // Render markdown with basic formatting
  const renderMarkdown = (content: string) => {
    if (!content) return null;
    
    // Split into lines for processing
    const lines = content.split('\n');
    const processedLines = lines.map((line, index) => {
      // Headers
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-bold mt-5 mb-3">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-bold mt-4 mb-2">{line.substring(4)}</h3>;
      }
      
      // Lists
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-6 mb-1">{line.substring(2)}</li>;
      }
      if (line.match(/^\d+\. /)) {
        const content = line.replace(/^\d+\. /, '');
        return <li key={index} className="ml-6 mb-1 list-decimal">{content}</li>;
      }
      
      // Links - basic support
      const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
      if (line.match(linkPattern)) {
        const parts = [];
        let lastIndex = 0;
        let match;
        
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        while ((match = linkRegex.exec(line)) !== null) {
          // Text before link
          if (match.index > lastIndex) {
            parts.push(line.substring(lastIndex, match.index));
          }
          
          // Link element
          parts.push(
            <a 
              key={`link-${match.index}`}
              href={match[2]} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {match[1]}
            </a>
          );
          
          lastIndex = match.index + match[0].length;
        }
        
        // Text after last link
        if (lastIndex < line.length) {
          parts.push(line.substring(lastIndex));
        }
        
        return <p key={index} className="mb-3">{parts}</p>;
      }
      
      // Empty line creates spacing
      if (line.trim() === '') {
        return <div key={index} className="h-4"></div>;
      }
      
      // Default paragraph
      return <p key={index} className="mb-3">{line}</p>;
    });
    
    return <div className="markdown-content">{processedLines}</div>;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      {/* Header with tabs */}
      <header className="w-full p-4 md:p-6 flex flex-col space-y-4 z-10 relative">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-light tracking-wider">Mayer Dominic</h1>
          <div className="flex items-center space-x-2">
            <a 
              href="https://github.com/Mayer-Domminic/obsidian-repo" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <Github size={16} className="mr-1" />
              <span className="hidden md:inline">GitHub</span>
            </a>
          </div>
        </div>
        
        <Tabs defaultValue="photos" className="w-full">
          <TabsList className="bg-zinc-800/60 grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="photos">Photo Gallery</TabsTrigger>
            <TabsTrigger value="obsidian">Obsidian Vault</TabsTrigger>
          </TabsList>
          
          <TabsContent value="photos" className="border-none p-0 outline-none">
            {/* Main grid of interactive category cards */}
            <div className="container mx-auto px-4 py-4" ref={cardsContainerRef}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => {
                  const isExpanded = expandedCards.includes(category);
                  const isOpening = openCategoryId === category;
                  const categoryData = imageData[category];
                  
                  return (
                    <motion.div
                      key={category}
                      layoutId={`category-card-${category}`}
                      className={`${
                        isOpening ? 'z-50' : 'z-10'
                      }`}
                      animate={isOpening ? {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: '100vw',
                        height: '100vh',
                        borderRadius: 0,
                        zIndex: 50
                      } : {
                        position: 'relative',
                        width: 'auto',
                        height: 'auto',
                        zIndex: isExpanded ? 20 : 10
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                        duration: 0.5
                      }}
                    >
                      <Card
                        className={`h-full bg-zinc-900/40 border-zinc-800 overflow-hidden cursor-grab relative group active:cursor-grabbing ${
                          isExpanded ? 'ring-2 ring-white/30 shadow-xl' : ''
                        }`}
                      >
                        <motion.div 
                          drag={!isOpening && !selectedCategory}
                          dragConstraints={getDragConstraints()}
                          dragElastic={0.1}
                          whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
                          whileHover={{ scale: isExpanded ? 1 : 1.02 }}
                          onClick={() => !isExpanded && openCategory(category)}
                          className="h-full relative"
                        >
                          <div className={`relative aspect-[3/4] overflow-hidden ${
                            isExpanded ? 'rounded-t-lg' : 'rounded-lg'
                          }`}>
                            <motion.img
                              src={getCoverImage(category)}
                              alt={`${category} cover image`}
                              className="w-full h-full object-cover pointer-events-none"
                              layoutId={`category-image-${category}`}
                              animate={{ 
                                scale: isExpanded ? 1.05 : 1
                              }}
                              transition={{ duration: 0.3 }}
                              onError={(e) => {
                                // Fallback if image fails to load
                                (e.target as HTMLImageElement).src = `${IMAGE_BASE_PATH}/placeholder.jpg`;
                              }}
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80" />
                            
                            <motion.div 
                              className="absolute bottom-0 left-0 w-full p-4"
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.1 }}
                            >
                              {categoryData.date && (
                                <Badge variant="outline" className="mb-2 text-xs bg-black/50 text-white border-zinc-500">
                                  {categoryData.date}
                                </Badge>
                              )}
                              <h3 className="text-lg font-medium text-white">{category}</h3>
                              <motion.div 
                                className="flex items-center mt-1 text-xs text-zinc-300"
                                animate={{ opacity: isExpanded ? 0 : 1 }}
                              >
                                <span>{categoryData.images.length} photos</span>
                              </motion.div>
                            </motion.div>
                            
                            {/* Quick expand button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-3 right-3 bg-black/40 rounded-full w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                              onClick={(e) => toggleCardExpansion(category, e)}
                            >
                              {isExpanded ? 
                                <ChevronLeft size={16} /> : 
                                <Info size={16} />
                              }
                            </Button>
                          </div>
                          
                          {/* Expanded card content */}
                          <motion.div
                            className="bg-zinc-900/90 backdrop-blur-sm p-4 overflow-hidden"
                            initial={{ height: 0 }}
                            animate={{ 
                              height: isExpanded ? 'auto' : 0,
                            }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <p className="text-zinc-200 text-sm mb-3">{categoryData.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-zinc-400">{categoryData.images.length} photos</span>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-xs h-8 border-zinc-700"
                                onClick={() => openCategory(category)}
                              >
                                View Gallery
                              </Button>
                            </div>
                          </motion.div>
                        </motion.div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="obsidian" className="border-none p-0 outline-none">
            {/* Obsidian Repository Viewer */}
            <div className="container mx-auto px-4 py-4">
              {/* Mobile view with slide-out sidebar */}
              <div className="md:hidden flex items-center mb-4">
                <Sheet open={showMobileSidebar} onOpenChange={setShowMobileSidebar}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="mr-2">
                      <Menu size={18} />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[280px] p-0 bg-zinc-900 border-zinc-800">
                    <div className="h-full flex flex-col overflow-hidden">
                      <div className="p-4 border-b border-zinc-800">
                        <h2 className="text-lg font-medium flex items-center">
                          <Github size={18} className="mr-2" />
                          Repository Files
                        </h2>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4">
                        {repoLoading ? (
                          <div className="space-y-2">
                            <Skeleton className="h-6 w-full bg-zinc-800" />
                            <Skeleton className="h-6 w-5/6 bg-zinc-800" />
                            <Skeleton className="h-6 w-4/6 bg-zinc-800" />
                          </div>
                        ) : repoError ? (
                          <div className="text-red-400 text-sm p-2">
                            Error: {repoError}
                          </div>
                        ) : (
                          <FileTree files={repoFiles} />
                        )}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                
                <h2 className="text-lg font-medium">
                  {selectedFile ? (
                    <span className="text-sm">
                      {selectedFile.path.split('/').pop()}
                    </span>
                  ) : (
                    'Obsidian Vault'
                  )}
                </h2>
              </div>
              
              {/* Desktop layout */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sidebar - File Browser */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-zinc-800">
                    <h2 className="text-sm font-medium flex items-center">
                      <Github size={16} className="mr-2" />
                      Repository Files
                    </h2>
                  </div>
                  
                  <div className="p-4 h-[600px] overflow-y-auto">
                    {repoLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-full bg-zinc-800" />
                        <Skeleton className="h-6 w-5/6 bg-zinc-800" />
                        <Skeleton className="h-6 w-4/6 bg-zinc-800" />
                      </div>
                    ) : repoError ? (
                      <div className="text-red-400 text-sm p-2">
                        Error: {repoError}
                      </div>
                    ) : (
                      <FileTree files={repoFiles} />
                    )}
                  </div>
                </div>
                
                {/* Main Content - File Viewer */}
                <div className="md:col-span-3 bg-zinc-900/40 border border-zinc-800 rounded-lg overflow-hidden">
                  {selectedFile ? (
                    <div className="h-full flex flex-col">
                      <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                        <h2 className="text-sm font-medium flex items-center">
                          <FileText size={16} className="mr-2" />
                          {selectedFile.path}
                        </h2>
                        
                        {selectedFile.html_url && (
                          <a 
                            href={selectedFile.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-zinc-400 hover:text-white flex items-center"
                          >
                            <ExternalLink size={14} className="mr-1" />
                            View on GitHub
                          </a>
                        )}
                      </div>
                      
                      <div className="p-4 overflow-y-auto h-[550px]">
                        {fileContentLoading ? (
                          <div className="space-y-3">
                            <Skeleton className="h-5 w-full bg-zinc-800" />
                            <Skeleton className="h-5 w-5/6 bg-zinc-800" />
                            <Skeleton className="h-5 w-4/6 bg-zinc-800" />
                            <Skeleton className="h-5 w-3/4 bg-zinc-800" />
                          </div>
                        ) : (
                          <div className="text-zinc-200 text-sm">
                            {selectedFile.path.endsWith('.md') ? (
                              renderMarkdown(fileContent || '')
                            ) : (
                              <pre className="font-mono text-xs whitespace-pre-wrap bg-zinc-800 p-4 rounded-md overflow-x-auto">
                                {fileContent}
                              </pre>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-[600px] flex flex-col items-center justify-center text-zinc-400">
                      <FileText size={48} className="mb-4 opacity-20" />
                      <p className="text-lg">Select a file from the repository</p>
                      <p className="text-sm mt-2">View your Obsidian notes and other files</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Mobile content view */}
              <div className="md:hidden">
                {selectedFile ? (
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg overflow-hidden">
                    <div className="p-4 overflow-y-auto max-h-[70vh]">
                      {fileContentLoading ? (
                        <div className="space-y-3">
                          <Skeleton className="h-5 w-full bg-zinc-800" />
                          <Skeleton className="h-5 w-5/6 bg-zinc-800" />
                          <Skeleton className="h-5 w-4/6 bg-zinc-800" />
                        </div>
                      ) : (
                        <div className="text-zinc-200 text-sm">
                          {selectedFile.path.endsWith('.md') ? (
                            renderMarkdown(fileContent || '')
                          ) : (
                            <pre className="font-mono text-xs whitespace-pre-wrap bg-zinc-800 p-4 rounded-md overflow-x-auto">
                              {fileContent}
                            </pre>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-[60vh] flex flex-col items-center justify-center text-zinc-400 bg-zinc-900/40 border border-zinc-800 rounded-lg">
                    <FileText size={48} className="mb-4 opacity-20" />
                    <p className="text-center px-4">Select a file from the repository using the menu button</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </header>
      
      {/* Category Detail View */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div 
            className={`fixed inset-0 z-50 flex flex-col ${fullScreen ? 'p-0' : 'p-4'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ 
              backgroundColor: 'rgba(0,0,0,0.95)',
            }}
          >
            {/* Controls */}
            <div className={`flex justify-between items-center ${fullScreen ? 'p-4' : 'py-2'} transition-all duration-300`}>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeCategory}
                className="rounded-full bg-black/40 hover:bg-black/60 text-white"
              >
                <X size={18} />
              </Button>
              
              <div className="flex items-center">
                <h2 className="text-lg font-medium mr-4">{selectedCategory}</h2>
                <div className="flex space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setRotationDegree(0);
                            resetMainImagePosition();
                          }}
                          className="rounded-full bg-black/40 hover:bg-black/60 text-white"
                        >
                          <RotateCcw size={18} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Reset image position</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowInfo(!showInfo)}
                          className="rounded-full bg-black/40 hover:bg-black/60 text-white"
                        >
                          <Info size={18} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Toggle info</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setFullScreen(!fullScreen)}
                          className="rounded-full bg-black/40 hover:bg-black/60 text-white"
                        >
                          {fullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Toggle fullscreen</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
            
            {/* Category Info Panel */}
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-black/60 backdrop-blur-md p-4 rounded-lg mb-4 max-w-xl mx-auto w-full"
                >
                  <h2 className="text-xl font-medium mb-2">{selectedCategory}</h2>
                  {imageData[selectedCategory].date && (
                    <div className="text-zinc-300 text-sm mb-3">
                      Date: {imageData[selectedCategory].date}
                    </div>
                  )}
                  <p className="text-zinc-200 text-sm">{imageData[selectedCategory].description}</p>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex-1 flex flex-col justify-center">
              {/* Image count indicator */}
              <div className="absolute top-4 right-4 z-10 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                {currentImageIndex + 1} / {imageData[selectedCategory].images.length}
              </div>
              
              {/* Main content area with image display */}
              <div className="relative w-full flex-1 flex flex-col items-center justify-center overflow-hidden" ref={containerRef}>
                {/* Navigation buttons */}
                <Button 
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 border-none rounded-full w-10 h-10 p-0 flex items-center justify-center"
                  variant="outline"
                  size="icon"
                >
                  <ChevronLeft size={20} />
                </Button>
                
                <Button 
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 border-none rounded-full w-10 h-10 p-0 flex items-center justify-center"
                  variant="outline"
                  size="icon"
                >
                  <ChevronRight size={20} />
                </Button>
                
                {/* Main image display */}
                <div 
                  className="relative w-full flex-1 flex items-center justify-center"
                  onMouseDown={(e) => {
                    handleGalleryMouseDown(e);
                    handleSwipeStart(e);
                  }}
                  onMouseMove={(e) => {
                    handleGalleryMouseMove(e);
                    handleSwipeMove(e);
                  }}
                  onMouseUp={() => {
                    handleGalleryDragEnd();
                    handleSwipeEnd();
                  }}
                  onMouseLeave={() => {
                    handleGalleryDragEnd();
                    handleSwipeEnd();
                  }}
                  onTouchStart={(e) => {
                    handleGalleryTouchStart(e);
                    handleSwipeStart(e);
                  }}
                  onTouchMove={(e) => {
                    handleGalleryTouchMove(e);
                    handleSwipeMove(e);
                  }}
                  onTouchEnd={() => {
                    handleGalleryDragEnd();
                    handleSwipeEnd();
                  }}
                  style={{ 
                    cursor: isDragging ? 'grabbing' : 'grab',
                  }}
                >
                  <div 
                    className="flex items-center justify-center h-full w-full"
                    style={{ 
                      transform: `translateX(${translateX}px)`,
                      transition: isDragging ? 'none' : 'transform 0.3s ease-out' 
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {selectedCategory && (
                        <motion.div
                          key={`${selectedCategory}-${currentImageIndex}`}
                          ref={mainImageRef}
                          className="cursor-move max-h-full max-w-full relative"
                          style={{
                            transform: `translate(${mainImagePosition.x}px, ${mainImagePosition.y}px) rotate(${rotationSpring.get()}deg)`,
                            transition: isMainImageDragging ? 'none' : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                          }}
                          initial={{ 
                            opacity: 0,
                            rotateY: direction * 45,
                            scale: 0.9
                          }}
                          animate={{ 
                            opacity: 1,
                            rotateY: isRotating ? [0, 5, 0, -5, 0] : 0,
                            scale: isRotating ? [1, 1.02, 1, 0.98, 1] : 1,
                          }}
                          exit={{ 
                            opacity: 0,
                            rotateY: direction * -45,
                            scale: 0.9
                          }}
                          transition={{ 
                            duration: 0.5,
                            rotateY: {
                              duration: isRotating ? 10 : 0.5,
                              repeat: isRotating ? Infinity : 0,
                              repeatType: "reverse"
                            },
                            scale: {
                              duration: isRotating ? 8 : 0.5,
                              repeat: isRotating ? Infinity : 0,
                              repeatType: "reverse"
                            }
                          }}
                          onMouseDown={handleMainImageMouseDown}
                          onMouseMove={handleMainImageMouseMove}
                          onMouseUp={handleMainImageDragEnd}
                          onMouseLeave={handleMainImageDragEnd}
                          onTouchStart={handleMainImageTouchStart}
                          onTouchMove={handleMainImageTouchMove}
                          onTouchEnd={handleMainImageDragEnd}
                        >
                          <img 
                            src={getImageUrl(imageData[selectedCategory].images[currentImageIndex], selectedCategory)}
                            alt={`${selectedCategory} image ${currentImageIndex + 1}`}
                            className={`rounded-lg shadow-2xl max-h-[70vh] max-w-[90vw] transition-transform duration-300 ${
                              isMainImageDragging ? 'scale-[1.03]' : ''
                            }`}
                            style={{
                              // Dynamically determine object-fit based on the detected dimensions
                              objectFit: "contain",
                              background: "rgba(0,0,0,0.2)"
                            }}
                            onError={(e) => {
                              // Fallback if image fails to load
                              (e.target as HTMLImageElement).src = `${IMAGE_BASE_PATH}/placeholder.jpg`;
                            }}
                            onLoad={(e) => {
                              // Detect orientation on load
                              const img = e.target as HTMLImageElement;
                              const orientation = img.naturalWidth > img.naturalHeight ? 'landscape' : 'portrait';
                              
                              // Update the image dimensions for reference
                              setImageDimensions(prev => ({
                                ...prev,
                                [img.src]: { width: img.naturalWidth, height: img.naturalHeight }
                              }));
                            }}
                          />
                          
                          {/* Swipe direction indicator overlay */}
                          <div
                            className={`absolute inset-0 pointer-events-none transition-opacity duration-300 flex items-center justify-center ${
                              swipeDirection ? 'opacity-40' : 'opacity-0'
                            }`}
                          >
                            {swipeDirection === 'left' && (
                              <div className="text-white text-4xl">&larr;</div>
                            )}
                            {swipeDirection === 'right' && (
                              <div className="text-white text-4xl">&rarr;</div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                {/* Image slider gallery */}
                <div 
                  ref={sliderRef} 
                  className="w-full max-w-4xl mx-auto mt-4 px-10 transition-all duration-300"
                  style={{
                    opacity: fullScreen ? 0 : 1,
                    transform: `translateY(${fullScreen ? '20px' : '0'})`,
                    height: fullScreen ? '0' : 'auto'
                  }}
                >
                  <div className="relative pb-2">
                    {/* Thumbnail slider */}
                    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent">
                      {selectedCategory && imageData[selectedCategory].images.map((image, idx) => (
                        <motion.div
                          key={`thumb-${selectedCategory}-${idx}`}
                          onClick={() => {
                            setCurrentImageIndex(idx);
                            resetMainImagePosition();
                            setDirection(idx > currentImageIndex ? 1 : -1);
                            setIsRotating(false);
                            setTimeout(() => setIsRotating(true), 800);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`shrink-0 cursor-pointer transition-all duration-200 ${
                            idx === currentImageIndex ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100'
                          }`}
                        >
                          <div className="relative w-16 h-16 overflow-hidden rounded-md">
                            <img 
                              src={getImageUrl(image, selectedCategory)}
                              alt={`${selectedCategory} thumbnail ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback if thumbnail fails to load
                                (e.target as HTMLImageElement).src = `${IMAGE_BASE_PATH}/placeholder.jpg`;
                              }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Use slider component for larger displays */}
                    {selectedCategory && (
                      <div className="hidden md:block mt-2">
                        <Slider
                          defaultValue={[0]}
                          max={imageData[selectedCategory].images.length - 1}
                          step={1}
                          value={[currentImageIndex]}
                          onValueChange={(value) => {
                            const newIndex = value[0];
                            if (newIndex !== currentImageIndex) {
                              setDirection(newIndex > currentImageIndex ? 1 : -1);
                              setIsRotating(false);
                              setCurrentImageIndex(newIndex);
                              resetMainImagePosition();
                              setTimeout(() => setIsRotating(true), 800);
                            }
                          }}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer with instructions */}
            <div className={`w-full text-center text-xs text-zinc-500 py-2 transition-opacity duration-300 ${
              fullScreen ? 'opacity-0' : 'opacity-100'
            }`}>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                <span>&#8226; Drag image to move</span>
                <span>&#8226; Swipe left/right to rotate and navigate</span>
                <span>&#8226; Use slider to browse gallery</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotoAndObsidianViewer;