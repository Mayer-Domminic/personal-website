import React, { useState, useReducer, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Camera
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";

// Define our data structure
interface ImageCategory {
  images: string[];
}

interface ImageData {
  [category: string]: ImageCategory;
}

// Combined state using reducer pattern
interface GalleryState {
  selectedCategory: string | null;
  openCategoryId: string | null;
  currentImageIndex: number;
  imagePosition: { x: number, y: number };
  dragInfo: {
    isDragging: boolean;
    startX: number;
    translateX: number;
  };
  loadedImages: Record<string, boolean>;
  scrollPosition: number;
}

type GalleryAction = 
  | { type: 'OPEN_CATEGORY', payload: { category: string, scrollY: number } }
  | { type: 'CLOSE_CATEGORY' }
  | { type: 'SET_CURRENT_IMAGE', payload: number }
  | { type: 'NEXT_IMAGE' }
  | { type: 'PREV_IMAGE' }
  | { type: 'RESET_IMAGE_POSITION' }
  | { type: 'UPDATE_IMAGE_POSITION', payload: { x: number, y: number } }
  | { type: 'START_DRAG', payload: number }
  | { type: 'UPDATE_DRAG', payload: number }
  | { type: 'END_DRAG', payload?: 'next' | 'prev' }
  | { type: 'SET_IMAGE_LOADED', payload: { src: string, loaded: boolean } };

const initialState: GalleryState = {
  selectedCategory: null,
  openCategoryId: null,
  currentImageIndex: 0,
  imagePosition: { x: 0, y: 0 },
  dragInfo: {
    isDragging: false,
    startX: 0,
    translateX: 0
  },
  loadedImages: {},
  scrollPosition: 0
};

function galleryReducer(state: GalleryState, action: GalleryAction): GalleryState {
  switch (action.type) {
    case 'OPEN_CATEGORY':
      return {
        ...state,
        openCategoryId: action.payload.category,
        selectedCategory: action.payload.category,
        currentImageIndex: 0,
        imagePosition: { x: 0, y: 0 },
        scrollPosition: action.payload.scrollY
      };
    case 'CLOSE_CATEGORY':
      return {
        ...state,
        selectedCategory: null,
        openCategoryId: null
      };
    case 'SET_CURRENT_IMAGE':
      return {
        ...state,
        currentImageIndex: action.payload,
        imagePosition: { x: 0, y: 0 }
      };
    case 'NEXT_IMAGE':
      // Logic for next image will be handled with category data in component
      return state;
    case 'PREV_IMAGE':
      // Logic for prev image will be handled with category data in component
      return state; 
    case 'RESET_IMAGE_POSITION':
      return {
        ...state,
        imagePosition: { x: 0, y: 0 }
      };
    case 'UPDATE_IMAGE_POSITION':
      return {
        ...state,
        imagePosition: action.payload
      };
    case 'START_DRAG':
      return {
        ...state,
        dragInfo: {
          isDragging: true,
          startX: action.payload,
          translateX: 0
        }
      };
    case 'UPDATE_DRAG':
      return {
        ...state,
        dragInfo: {
          ...state.dragInfo,
          translateX: action.payload - state.dragInfo.startX
        }
      };
    case 'END_DRAG':
      return {
        ...state,
        dragInfo: {
          isDragging: false,
          startX: 0,
          translateX: 0
        }
      };
    case 'SET_IMAGE_LOADED':
      return {
        ...state,
        loadedImages: {
          ...state.loadedImages,
          [action.payload.src]: action.payload.loaded
        }
      };
    default:
      return state;
  }
}

// Debug utility
const logImageLoadEvent = (type: string, src: string, success: boolean) => {
  console.log(`Image ${type}: ${src} - ${success ? 'Success' : 'Failed'}`);
};

const PhotoGallery: React.FC = () => {
  // Your image data - reorganized per requirements
  const imageData: ImageData = {
    "Sunsets & Skies": {
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
        "DM100862.JPG",
        // Added winter/roads images to this category
        "DM100982.JPG",
        "DM100984.JPG"
      ]
    },
    "Nature": {
      "images": [
        "DM100825.JPG", // Set as cover image
        "20240422_194029.jpg",
        "20240422_194054.jpg",
        "DM100814.JPG",
        "DM100815.JPG",
        "DM100851.JPG",
        "DM100844.JPG"
      ]
    },
    "Urban": {
      "images": [
        "DM100894.JPG", // Set as cover image
        "20230326_004202.jpg",
        "DM100877.JPG",
        "DM100888.JPG",
        "DM100908.JPG"
      ]
    },
    "Animals": {
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
    }
  };
  
  const [state, dispatch] = useReducer(galleryReducer, initialState);
  const [direction, setDirection] = useState(0);
  const [isImageDragging, setIsImageDragging] = useState(false);
  const [imageStartPos, setImageStartPos] = useState({ x: 0, y: 0 });
  
  // Helper to get image URL - fixed to use /public/ directory
  const getImageUrl = (filename: string, size: 'thumb' | 'full' = 'full') => {
    // Ensure it starts with a slash
    return `/${filename}`;
  };
  
  // Get cover image for a category
  const getCoverImage = (category: string) => {
    // Custom cover images for specific categories
    if (category === "Nature") return "DM100825.JPG";
    if (category === "Urban") return "DM100894.JPG";
    
    // Default first image for other categories
    if (!imageData[category].images || imageData[category].images.length === 0) {
      return '';
    }
    return imageData[category].images[0];
  };
  
  // Filter out any images that failed to load
  const getFilteredImages = (category: string) => {
    if (!category || !imageData[category]) return [];
    return imageData[category].images.filter(img => {
      const imgUrl = getImageUrl(img);
      return state.loadedImages[imgUrl] !== false; // Keep if not explicitly marked as failed
    });
  };
  
  // Navigation functions with simplified logic
  const handlePrev = () => {
    if (!isImageDragging && state.selectedCategory) {
      setDirection(-1);
      const images = getFilteredImages(state.selectedCategory);
      const newIndex = state.currentImageIndex === 0 ? images.length - 1 : state.currentImageIndex - 1;
      dispatch({ type: 'SET_CURRENT_IMAGE', payload: newIndex });
    }
  };

  const handleNext = () => {
    if (!isImageDragging && state.selectedCategory) {
      setDirection(1);
      const images = getFilteredImages(state.selectedCategory);
      const newIndex = state.currentImageIndex === images.length - 1 ? 0 : state.currentImageIndex + 1;
      dispatch({ type: 'SET_CURRENT_IMAGE', payload: newIndex });
    }
  };
  
  // Open a category with simplified animation sequence
  const openCategory = (category: string) => {
    console.log(`Opening category: ${category}`);
    const scrollY = window.scrollY;
    console.log(`Current scroll position: ${scrollY}px`);
    document.body.style.overflow = 'hidden';
    
    // Update initial state for filtered images to ensure we have valid images
    const filteredImages = imageData[category].images.filter(img => {
      const imgUrl = getImageUrl(img);
      return state.loadedImages[imgUrl] !== false;
    });
    
    console.log(`Found ${filteredImages.length} valid images in category`);
    dispatch({ type: 'OPEN_CATEGORY', payload: { category, scrollY } });
  };
  
  // Close the current category view
  const closeCategory = () => {
    console.log('Closing category');
    document.body.style.overflow = '';
    
    // Scroll back to the original position
    setTimeout(() => {
      window.scrollTo({ top: state.scrollPosition, behavior: 'auto' });
    }, 100);
    
    dispatch({ type: 'CLOSE_CATEGORY' });
  };
  
  // Image load handler
  const handleImageLoad = (src: string) => {
    logImageLoadEvent('LOAD', src, true);
    dispatch({ 
      type: 'SET_IMAGE_LOADED', 
      payload: { src, loaded: true } 
    });
  };
  
  // Image error handler
  const handleImageError = (src: string) => {
    logImageLoadEvent('ERROR', src, false);
    console.error(`Failed to load image: ${src}`);
    dispatch({ 
      type: 'SET_IMAGE_LOADED', 
      payload: { src, loaded: false } 
    });
  };
  
  // Main image dragging handlers (simplified)
  const handleImageMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsImageDragging(true);
    setImageStartPos({
      x: e.clientX - state.imagePosition.x,
      y: e.clientY - state.imagePosition.y
    });
  };

  const handleImageMouseMove = (e: React.MouseEvent) => {
    if (!isImageDragging) return;
    e.stopPropagation();
    
    // Calculate new position with limits
    const maxDragDistance = 100;
    const newX = Math.min(Math.max(e.clientX - imageStartPos.x, -maxDragDistance), maxDragDistance);
    const newY = Math.min(Math.max(e.clientY - imageStartPos.y, -maxDragDistance), maxDragDistance);
    
    dispatch({ 
      type: 'UPDATE_IMAGE_POSITION', 
      payload: { x: newX, y: newY }
    });
  };

  const handleImageDragEnd = () => {
    if (!isImageDragging) return;
    setIsImageDragging(false);
    
    // If dragged significantly left/right, navigate to next/prev image
    if (state.imagePosition.x < -50) {
      handleNext();
    } else if (state.imagePosition.x > 50) {
      handlePrev();
    }
    
    // Reset image position with animation
    dispatch({ type: 'RESET_IMAGE_POSITION' });
  };
  
  // Gallery navigation with simple swipe detection
  const handleGalleryMouseDown = (e: React.MouseEvent) => {
    if (!isImageDragging) {
      dispatch({ type: 'START_DRAG', payload: e.clientX });
    }
  };

  const handleGalleryMouseMove = (e: React.MouseEvent) => {
    if (state.dragInfo.isDragging) {
      dispatch({ type: 'UPDATE_DRAG', payload: e.clientX });
    }
  };

  const handleGalleryDragEnd = () => {
    if (!state.dragInfo.isDragging) return;
    
    if (state.dragInfo.translateX > 100) {
      handlePrev();
    } else if (state.dragInfo.translateX < -100) {
      handleNext();
    }
    
    dispatch({ type: 'END_DRAG' });
  };
  
  useEffect(() => {
    // Scroll handling for gallery opening
    if (state.selectedCategory) {
      // When gallery opens, ensure it's visible at the current scroll position
      const handleResize = () => {
        if (state.selectedCategory) {
          // Adjust overlay position if window size changes
          const overlayEl = document.querySelector('.gallery-overlay');
          if (overlayEl) {
            overlayEl.scrollIntoView({ behavior: 'auto', block: 'start' });
          }
        }
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [state.selectedCategory]);
  
  // Categories array
  const categories = Object.keys(imageData);
  
  return (
    <div id="photo-section" className="mb-16">
      <div className="mb-8 font-mono">
        <span className="text-blue-400">const</span>{' '}
        <span className="text-purple-400">gallery</span>{' '}
        <span className="text-blue-400">=</span>{' '}
        <span className="text-green-400">'</span>
        <span className="text-white">My Photos</span>
        <span className="text-green-400">'</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <Card
            key={category}
            className="h-full bg-gray-800/50 border-gray-700 hover:border-blue-500 overflow-hidden relative group transition-all duration-300 transform hover:-translate-y-1 z-10"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={() => openCategory(category)}
              className="h-full relative cursor-pointer"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                <img
                  src={getImageUrl(getCoverImage(category))}
                  alt={`${category} cover`}
                  className="w-full h-full object-cover pointer-events-none"
                  onLoad={(e) => handleImageLoad((e.target as HTMLImageElement).src)}
                  onError={(e) => handleImageError((e.target as HTMLImageElement).src)}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent" />
                
                <div className="absolute bottom-0 left-0 w-full p-4">
                  <div className="flex items-center gap-3">
                    <Camera className="h-5 w-5 text-purple-400" />
                    <h3 className="text-lg font-medium text-white">{category}</h3>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-300">
                    <span>{getFilteredImages(category).length} photos</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </Card>
        ))}
      </div>
      
      {/* Gallery Overlay - Fixed Position with Simple Animation */}
      <AnimatePresence>
        {state.selectedCategory && (
          <motion.div 
            className="fixed inset-0 z-50 gallery-overlay flex flex-col p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ backgroundColor: 'rgba(17, 24, 39, 0.95)' }}
          >
            {/* Controls */}
            <div className="flex justify-between items-center py-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={closeCategory}
                className="rounded-full bg-gray-800/40 hover:bg-gray-800/60 text-white"
              >
                <X size={18} />
              </Button>
              
              <div className="flex items-center">
                <h2 className="text-lg font-medium mr-4 text-white">{state.selectedCategory}</h2>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              {/* Image count indicator */}
              <div className="absolute top-4 right-4 z-10 bg-gray-800/50 text-white text-xs px-2 py-1 rounded-full">
                {state.currentImageIndex + 1} / {getFilteredImages(state.selectedCategory).length}
              </div>
              
              {/* Main content area with image display */}
              <div className="relative w-full flex-1 flex flex-col items-center justify-center overflow-hidden">
                {/* Navigation buttons */}
                <Button 
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-gray-800/30 hover:bg-gray-800/50 border-none rounded-full w-10 h-10 p-0 flex items-center justify-center"
                  variant="outline"
                  size="icon"
                >
                  <ChevronLeft size={20} />
                </Button>
                
                <Button 
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-gray-800/30 hover:bg-gray-800/50 border-none rounded-full w-10 h-10 p-0 flex items-center justify-center"
                  variant="outline"
                  size="icon"
                >
                  <ChevronRight size={20} />
                </Button>
                
                {/* Main image display */}
                <div 
                  className="relative w-full flex-1 flex items-center justify-center"
                  onMouseDown={handleGalleryMouseDown}
                  onMouseMove={handleGalleryMouseMove}
                  onMouseUp={handleGalleryDragEnd}
                  onMouseLeave={handleGalleryDragEnd}
                  style={{ 
                    cursor: state.dragInfo.isDragging ? 'grabbing' : 'grab',
                  }}
                >
                  <div 
                    className="flex items-center justify-center h-full w-full"
                    style={{ 
                      transform: `translateX(${state.dragInfo.translateX}px)`,
                      transition: state.dragInfo.isDragging ? 'none' : 'transform 0.3s ease-out' 
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {state.selectedCategory && (
                        <motion.div
                          key={`${state.selectedCategory}-${state.currentImageIndex}`}
                          className="cursor-move max-h-full max-w-full relative"
                          style={{
                            transform: `translate(${state.imagePosition.x}px, ${state.imagePosition.y}px)`,
                            transition: isImageDragging ? 'none' : 'transform 0.3s ease-out'
                          }}
                          initial={{ 
                            opacity: 0,
                            scale: 0.9,
                            rotateY: direction * 15
                          }}
                          animate={{ 
                            opacity: 1,
                            scale: 1,
                            rotateY: 0
                          }}
                          exit={{ 
                            opacity: 0,
                            scale: 0.9,
                            rotateY: direction * -15
                          }}
                          transition={{ duration: 0.3 }}
                          onMouseDown={handleImageMouseDown}
                          onMouseMove={handleImageMouseMove}
                          onMouseUp={handleImageDragEnd}
                          onMouseLeave={handleImageDragEnd}
                        >
                          {getFilteredImages(state.selectedCategory).length > 0 && (
                            <img 
                              src={getImageUrl(getFilteredImages(state.selectedCategory)[state.currentImageIndex])}
                              alt={`${state.selectedCategory} image ${state.currentImageIndex + 1}`}
                              className={`rounded-lg shadow-xl max-h-[70vh] max-w-[90vw] ${
                                isImageDragging ? 'scale-[1.02]' : ''
                              }`}
                              style={{
                                objectFit: "contain",
                                transition: "transform 0.2s ease"
                              }}
                              onLoad={(e) => handleImageLoad((e.target as HTMLImageElement).src)}
                              onError={(e) => handleImageError((e.target as HTMLImageElement).src)}
                            />
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                {/* Thumbnail gallery */}
                {state.selectedCategory && (
                  <div className="w-full max-w-4xl mx-auto mt-4 px-2 overflow-x-auto">
                    <div className="flex space-x-2 pb-2">
                      {getFilteredImages(state.selectedCategory).map((image, idx) => (
                        <div
                          key={`thumb-${idx}`}
                          onClick={() => {
                            setDirection(idx > state.currentImageIndex ? 1 : -1);
                            dispatch({ type: 'SET_CURRENT_IMAGE', payload: idx });
                          }}
                          className={`shrink-0 cursor-pointer transition-all duration-200 ${
                            idx === state.currentImageIndex ? 'ring-2 ring-purple-400' : 'opacity-60 hover:opacity-100'
                          }`}
                        >
                          <div className="w-14 h-14 overflow-hidden rounded-md">
                            <img 
                              src={getImageUrl(image, 'thumb')}
                              alt={`${state.selectedCategory} thumbnail ${idx + 1}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onLoad={(e) => handleImageLoad((e.target as HTMLImageElement).src)}
                              onError={(e) => handleImageError((e.target as HTMLImageElement).src)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotoGallery;