import React, { useState } from 'react';
import { ImageItem } from '../types';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ImageModal from './ImageModal';
import { GalleryStyle } from './StyleSelector';

interface ImageListProps {
  images: ImageItem[];
  onDeleteImage: (id: number) => void;
  style: GalleryStyle;
}

const ImageList: React.FC<ImageListProps> = ({ images, onDeleteImage, style }) => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

  const renderBentoGrid = () => (
    <div className="grid grid-cols-4 gap-4">
      {images.map((image, index) => (
        <div
          key={image.id}
          className={`relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg ${
            index === 0 ? 'col-span-2 row-span-2' : 
            index === 1 || index === 2 ? 'col-span-2' : ''
          }`}
          style={{ paddingBottom: index === 0 ? '100%' : '56.25%' }}
          onClick={() => setSelectedImage(image)}
        >
          <img
            src={image.url}
            alt={image.description}
            className="absolute inset-0 w-full h-full object-cover cursor-zoom-in transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-full hover:translate-y-0 transition-transform duration-300">
            <p className="text-white text-sm truncate flex-grow mr-2">
              {image.isLoading ? t('imageList.loading') : image.description}
            </p>
          </div>
          {image.isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderMasonryGrid = () => (
    <div className="columns-3 gap-4 space-y-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg break-inside-avoid cursor-zoom-in"
          onClick={() => setSelectedImage(image)}
        >
          <img
            src={image.url}
            alt={image.description}
            className="w-full h-auto transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-full hover:translate-y-0 transition-transform duration-300">
            <p className="text-white text-sm truncate flex-grow mr-2">
              {image.isLoading ? t('imageList.loading') : image.description}
            </p>
          </div>
          {image.isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderCarousel = () => (
    <div className="relative overflow-hidden">
      <div className="flex space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative flex-shrink-0 w-64 h-64 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg snap-center cursor-zoom-in"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.url}
              alt={image.description}
              className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-full hover:translate-y-0 transition-transform duration-300 rounded-b-lg">
              <p className="text-white text-sm truncate flex-grow mr-2">
                {image.isLoading ? t('imageList.loading') : image.description}
              </p>
            </div>
            {image.isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {style === 'bento' && renderBentoGrid()}
      {style === 'masonry' && renderMasonryGrid()}
      {style === 'carousel' && renderCarousel()}
      {selectedImage && (
        <ImageModal 
          image={selectedImage} 
          onClose={() => setSelectedImage(null)} 
          onDelete={() => {
            onDeleteImage(selectedImage.id);
            setSelectedImage(null);
          }}
        />
      )}
    </>
  );
};

export default ImageList;