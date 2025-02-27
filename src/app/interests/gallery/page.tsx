'use client';
import PhotoGallery from '@/components/Viewer';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
        <div className='max-w-5xl mx-auto'>
            <Navbar/>
            <PhotoGallery/>
        </div>
    );
}