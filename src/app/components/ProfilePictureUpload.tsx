// app/components/ProfilePictureUpload.tsx
'use client';
import { useState } from 'react';
import Image from 'next/image';

interface ProfilePictureUploadProps {
  currentPicture?: string | null;
  userName: string;
}

export default function ProfilePictureUpload({ currentPicture, userName }: ProfilePictureUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [picture, setPicture] = useState(currentPicture);
  const [error, setError] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      const res = await fetch('/api/upload-profile-picture', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (res.ok) {
        setPicture(data.profilePicture);
        window.location.reload(); // Refresh to show new picture everywhere
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="relative inline-block">
      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#00aac8] cursor-pointer bg-gradient-to-br from-[#00aac8] to-[#8dc63f]">
        {picture ? (
          <Image 
            src={picture} 
            alt={userName}
            width={128}
            height={128}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
            {getInitials(userName)}
          </div>
        )}
      </div>
      
      <label 
        htmlFor="profile-upload" 
        className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#0d0d0d] flex items-center justify-center cursor-pointer border-2 border-white hover:bg-[#2d2d2d] transition-colors"
      >
        {uploading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        )}
      </label>
      
      <input
        id="profile-upload"
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleUpload}
        className="hidden"
        disabled={uploading}
      />
      
      {error && (
        <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
      )}
    </div>
  );
}