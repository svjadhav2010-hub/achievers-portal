// app/dashboard/_components/ProfilePictureUpload.tsx
'use client';
import { useState } from 'react';
import Image from 'next/image';

interface ProfilePictureUploadProps {
  currentPicture?: string;
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
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{
        width: 120,
        height: 120,
        borderRadius: '50%',
        overflow: 'hidden',
        border: '3px solid #00aac8',
        position: 'relative',
        cursor: 'pointer',
        background: picture ? 'transparent' : 'linear-gradient(135deg, #00aac8, #8dc63f)'
      }}>
        {picture ? (
          <Image 
            src={picture} 
            alt={userName}
            width={120}
            height={120}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            fontWeight: 700,
            color: 'white'
          }}>
            {getInitials(userName)}
          </div>
        )}
      </div>
      
      <label htmlFor="profile-upload" style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: '#0d0d0d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: '2px solid white'
      }}>
        {uploading ? (
          <div style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
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
        style={{ display: 'none' }}
        disabled={uploading}
      />
      
      {error && (
        <p style={{ color: 'red', fontSize: 12, marginTop: 8 }}>{error}</p>
      )}
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}