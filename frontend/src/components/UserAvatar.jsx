import React from 'react';

/**
 * Reusable UserAvatar component
 * Displays user profile picture or fallback initial
 * 
 * @param {string} src - Profile picture URL
 * @param {string} name - User name for fallback initial
 * @param {string} size - Size variant: 'sm' (24px), 'md' (48px), 'lg' (96px), 'xl' (240px)
 * @param {string} className - Additional CSS classes
 */
const UserAvatar = ({ src, name = 'User', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-12 h-12 text-base',
    lg: 'w-24 h-24 text-2xl',
    xl: 'w-60 h-60 text-6xl',
  };

  const initial = name?.charAt(0)?.toUpperCase() || 'U';
  const hasValidSrc = src?.trim();

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {hasValidSrc ? (
        <>
          <img
            src={src}
            alt={name}
            className="w-full h-full rounded-full object-cover"
            onError={(e) => {
              // Hide image and show fallback on error
              e.target.style.display = 'none';
              if (e.target.nextSibling) {
                e.target.nextSibling.style.display = 'flex';
              }
            }}
          />
          <div 
            className="w-full h-full rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold absolute top-0 left-0"
            style={{display: 'none'}}
          >
            {initial}
          </div>
        </>
      ) : (
        <div className="w-full h-full rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
          {initial}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
