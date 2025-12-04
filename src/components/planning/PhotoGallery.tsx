import { useState } from 'react';
import { ConstructionPhoto } from '../../hooks/useConstructionPhotos';
import { X, MapPin, Calendar, User } from 'lucide-react';
import { Card } from '../ui/Card';

interface PhotoGalleryProps {
  photos: ConstructionPhoto[];
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<ConstructionPhoto | null>(null);

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500">
        <p>Aucune photo de chantier disponible.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <Card
            key={photo.id}
            className="overflow-hidden cursor-pointer hover:shadow-lg transition group"
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className="aspect-video relative overflow-hidden bg-neutral-100">
              <img
                src={photo.thumbnail_url || photo.file_url}
                alt={photo.caption || 'Photo de chantier'}
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
              {photo.location && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {photo.location}
                </div>
              )}
            </div>
            {photo.caption && (
              <div className="p-3">
                <p className="text-sm text-neutral-700 line-clamp-2">
                  {photo.caption}
                </p>
                <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(photo.taken_at).toLocaleDateString('fr-CH')}
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-6xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedPhoto.file_url}
              alt={selectedPhoto.caption || 'Photo de chantier'}
              className="max-w-full max-h-[75vh] object-contain rounded-lg"
            />

            {(selectedPhoto.caption || selectedPhoto.location) && (
              <div className="mt-4 p-4 bg-white rounded-lg">
                {selectedPhoto.caption && (
                  <p className="text-neutral-800 mb-2">{selectedPhoto.caption}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                  {selectedPhoto.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedPhoto.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedPhoto.taken_at).toLocaleDateString('fr-CH', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
