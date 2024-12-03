'use client';
import { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  delay?: number;
}

export const TypewriterText = ({ text, delay = 50 }: TypewriterTextProps) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, delay);
    
    return () => clearInterval(timer);
  }, [text, delay]);
  
  return <span>{displayText}</span>;
};