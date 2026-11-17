'use client';

// --- React ---
import React, { useState, useEffect, useRef } from 'react';

// --- Context / Hooks ---
import { useChallengeState, useChallengeDispatch } from '@/context/ChallengeContext';

// --- Components ---
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faSpinner } from '@fortawesome/free-solid-svg-icons';
import PhotoModal from '@/components/features/dashboard/PhotoModal';

// --- Utils / Lib ---
import { addPhotoAttachment, getPhotoAttachment } from '@/lib/db';
import { compressImage } from '@/utils/imageCompression';

interface PhotoGalleryProps {
  currentDay: number;
  isReadOnly?: boolean;
}

const PhotoGallery = ({ currentDay, isReadOnly = false }: PhotoGalleryProps) => {
  const { challenge } = useChallengeState();
  const dispatch = useChallengeDispatch();
  const [photos, setPhotos] = useState<Map<number, string>>(new Map());
  const [isFetching, setIsFetching] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{ day: number; url: string } | null>(null);

  const challengeId = challenge?._id;

  // Stable primitive key representing only the days with photos attached (e.g. "1,3,7")
  const photoDaysKey = challenge?.days
    ? Object.keys(challenge.days)
        .map(Number)
        .filter((day) => challenge.days[day]?.photoAttached)
        .sort((a, b) => a - b)
        .join(',')
    : '';

  // Ref tracking all active blob URLs for clean incremental loading and safe unmount cleanup
  const photosRef = useRef<Map<number, string>>(new Map());

  // Fetch only missing photos when challengeId or photoDaysKey changes
  useEffect(() => {
    let isCancelled = false;

    const syncPhotos = async () => {
      if (!challengeId || !photoDaysKey) {
        photosRef.current.forEach((url) => URL.revokeObjectURL(url));
        photosRef.current.clear();
        if (!isCancelled) {
          setPhotos(new Map());
          setIsFetching(false);
        }
        return;
      }

      const currentMap = new Map(photosRef.current);
      const targetDays = photoDaysKey.split(',').map(Number);
      const targetSet = new Set(targetDays);

      // Revoke any removed photo URLs
      for (const [day, url] of currentMap.entries()) {
        if (!targetSet.has(day)) {
          URL.revokeObjectURL(url);
          currentMap.delete(day);
        }
      }

      // Only fetch photos that have not been loaded yet
      const daysToFetch = targetDays.filter((day) => !currentMap.has(day));

      if (daysToFetch.length === 0) {
        photosRef.current = currentMap;
        if (!isCancelled) {
          setPhotos(new Map(currentMap));
          setIsFetching(false);
        }
        return;
      }

      for (const day of daysToFetch) {
        if (isCancelled) return;
        const url = await getPhotoAttachment(challengeId, day);
        if (url && !isCancelled) {
          currentMap.set(day, url);
        }
      }

      if (!isCancelled) {
        photosRef.current = currentMap;
        setPhotos(new Map(currentMap));
        setIsFetching(false);
      }
    };

    void syncPhotos();

    return () => {
      isCancelled = true;
    };
  }, [challengeId, photoDaysKey]);

  // Revoke all created blob URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      photosRef.current.forEach((url) => URL.revokeObjectURL(url));
      photosRef.current.clear();
    };
  }, []);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (file && challenge) {
      setIsUploading(true);
      try {
        const compressedFile = await compressImage(file);
        const updatedChallenge = await addPhotoAttachment(challenge, currentDay, compressedFile);
        dispatch({ type: 'SET_CHALLENGE', payload: updatedChallenge });
      } catch (error) {
        console.error('Error uploading photo:', error);
        alert('Failed to upload photo. Please try again.');
      } finally {
        input.value = '';
        setIsUploading(false);
      }
    }
  };

  return (
    <>
      {selectedPhoto && (
        <PhotoModal
          imageUrl={selectedPhoto.url}
          day={selectedPhoto.day}
          onClose={() => setSelectedPhoto(null)}
        />
      )}

      <div
        className={`bg-[var(--color-background)] rounded-lg shadow-lg p-6 sm:p-8 mt-8 ${
          isReadOnly ? 'opacity-60' : ''
        }`}>
        <h2 className="text-3xl font-bold font-orbitron text-center mb-6">Progress Gallery</h2>

        {!isReadOnly && (
          <div className="mb-8 text-center">
            <label
              htmlFor="photo-upload"
              className={`inline-block text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 ${
                isUploading
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] cursor-pointer'
              }`}>
              {isUploading ? (
                <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
              ) : (
                <FontAwesomeIcon icon={faUpload} className="mr-2" />
              )}
              {isUploading ? 'Uploading...' : `Upload Day ${currentDay} Photo`}
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={isUploading}
              className="hidden"
            />
          </div>
        )}

        {isFetching ? (
          <p className="text-center">Loading photos...</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {Array.from(photos.entries())
              .sort(([a], [b]) => a - b)
              .map(([day, url]) => (
                <div
                  key={day}
                  className="relative aspect-square cursor-pointer"
                  onClick={() => setSelectedPhoto({ day, url })}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Progress for day ${day}`}
                    className="object-cover w-full h-full rounded-md"
                  />
                  <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-bl-md rounded-tr-md">
                    Day {day}
                  </div>
                </div>
              ))}
          </div>
        )}
        {!isFetching && photos.size === 0 && (
          <p className="text-center text-[var(--color-text-muted)]">No photos uploaded yet.</p>
        )}
      </div>
    </>
  );
};

export default PhotoGallery;
