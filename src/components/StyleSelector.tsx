import React from 'react';
import { useTranslation } from 'react-i18next';

export type GalleryStyle = 'bento' | 'masonry' | 'carousel';

interface StyleSelectorProps {
  currentStyle: GalleryStyle;
  onStyleChange: (style: GalleryStyle) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ currentStyle, onStyleChange }) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center space-x-4 my-8">
      <button
        onClick={() => onStyleChange('bento')}
        className={`px-4 py-2 rounded-full transition-all ${
          currentStyle === 'bento'
            ? 'bg-red-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {t('styleSelector.bento')}
      </button>
      <button
        onClick={() => onStyleChange('masonry')}
        className={`px-4 py-2 rounded-full transition-all ${
          currentStyle === 'masonry'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {t('styleSelector.masonry')}
      </button>
      <button
        onClick={() => onStyleChange('carousel')}
        className={`px-4 py-2 rounded-full transition-all ${
          currentStyle === 'carousel'
            ? 'bg-green-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {t('styleSelector.carousel')}
      </button>
    </div>
  );
};

export default StyleSelector;