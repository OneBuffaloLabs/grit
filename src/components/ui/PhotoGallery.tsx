'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useChallengeState, useChallengeDispatch } from '@/context/ChallengeContext';
import { addPhotoAttachment, getPhotoAttachment } from '@/lib/db';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faSpinner } from '@fortawesome/free-solid-svg-icons';
import PhotoModal from '@/components/features/dashboard/PhotoModal';

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

  const fetchPhotos = useCallback(async () => {
    if (!challenge) return;
    setIsFetching(true);
    const newPhotos = new Map<number, string>();
    const daysWithPhotos = Object.keys(challenge.days)
      .map(Number)
      .filter((day) => challenge.days[day]?.photoAttached);

    for (const day of daysWithPhotos) {
      // Correctly pass both the challenge ID and the day number
      const url = await getPhotoAttachment(challenge._id, day);
      if (url) {
        newPhotos.set(day, url);
      }
    }
    setPhotos(newPhotos);
    setIsFetching(false);
  }, [challenge]);

  // This hook handles fetching data when the challenge changes.
  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // This hook handles cleaning up object URLs to prevent memory leaks.
  useEffect(() => {
    return () => {
      photos.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [photos]);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && challenge) {
      setIsUploading(true);
      try {
        const updatedChallenge = await addPhotoAttachment(challenge, currentDay, file);
        dispatch({ type: 'SET_CHALLENGE', payload: updatedChallenge });
      } catch (error) {
        console.error('Error uploading photo:', error);
        alert('Failed to upload photo. Please try again.');
      } finally {
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
