'use client';
import { useState, useRef } from 'react';

interface Props {
  initials: string;
  currentAvatar: string | null;
  onUpdate: (url: string | null) => void;
  size?: number;
}

export default function AvatarUpload({ initials, currentAvatar, onUpdate, size = 52 }: Props) {
  const [uploading, setUploading] = useState(false);
  const [hover, setHover] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await fetch('/api/member/avatar', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onUpdate(data.avatar_url);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentAvatar) return;
    setUploading(true);
    try {
      await fetch('/api/member/avatar', { method: 'DELETE' });
      onUpdate(null);
    } finally { setUploading(false); }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Avatar circle */}
      <div
        onClick={() => !uploading && fileRef.current?.click()}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          width: size, height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          cursor: uploading ? 'wait' : 'pointer',
          position: 'relative',
          flexShrink: 0,
          background: currentAvatar ? 'transparent' : 'linear-gradient(135deg, var(--teal), var(--lime))',
          border: '2px solid ' + (hover ? 'var(--teal)' : 'transparent'),
          transition: 'border-color 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        title="Click to change profile photo"
      >
        {currentAvatar ? (
          <img src={currentAvatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ color: 'white', fontWeight: 700, fontSize: size * 0.34 }}>{initials}</span>
        )}

        {/* Hover overlay */}
        {hover && !uploading && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
        )}

        {/* Loading spinner */}
        {uploading && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%',
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: 'white',
              animation: 'spin 0.7s linear infinite',
            }} />
          </div>
        )}
      </div>

      {/* Remove button — only shows if avatar exists */}
      {currentAvatar && !uploading && (
        <button
          onClick={handleRemove}
          title="Remove photo"
          style={{
            position: 'absolute', top: -2, right: -2,
            width: 18, height: 18, borderRadius: '50%',
            background: '#e05a5a', border: '2px solid var(--card-bg)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 0, lineHeight: 1,
          }}
        >
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      )}

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        style={{ display: 'none' }}
      />

      {/* Error tooltip */}
      {error && (
        <div style={{
          position: 'absolute', top: size + 6, left: '50%',
          transform: 'translateX(-50%)',
          background: '#e05a5a', color: 'white',
          padding: '5px 10px', borderRadius: 8,
          fontSize: 11, fontWeight: 600,
          whiteSpace: 'nowrap', zIndex: 100,
        }}>
          {error}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}