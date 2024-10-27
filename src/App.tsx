import React, { useState, useCallback } from 'react'
import { Search, Bell, MessageCircle, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ImageList from './components/ImageList'
import ImageUpload from './components/ImageUpload'
import LanguageSwitcher from './components/LanguageSwitcher'
import StyleSelector, { GalleryStyle } from './components/StyleSelector'
import { ImageItem } from './types'
import { getImageDescription } from './utils/openai'

function App() {
  const { t } = useTranslation()
  const [images, setImages] = useState<ImageItem[]>([])
  const [galleryStyle, setGalleryStyle] = useState<GalleryStyle>('bento')

  const handleImageUpload = useCallback(async (newImages: File[]) => {
    const newImageItems: ImageItem[] = newImages.map(file => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      description: '',
      isLoading: true
    }))
    
    setImages(prevImages => [...prevImages, ...newImageItems])

    for (const image of newImageItems) {
      const description = await getImageDescription(image.file)
      setImages(prevImages => prevImages.map(img => 
        img.id === image.id ? { ...img, description, isLoading: false } : img
      ))
    }
  }, [])

  const handleDeleteImage = useCallback((id: number) => {
    setImages((prevImages) => prevImages.filter((img) => img.id !== id))
  }, [])

  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <svg className="h-8 w-8 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0a12 12 0 0 0-4.37 23.17c-.07-.63-.13-1.58.03-2.26.14-.6.92-3.86.92-3.86s-.24-.47-.24-1.18c0-1.1.64-1.92 1.44-1.92.68 0 1 .5 1 1.12 0 .68-.43 1.7-.66 2.64-.19.8.4 1.44 1.18 1.44 1.42 0 2.5-1.5 2.5-3.65 0-1.9-1.37-3.23-3.32-3.23-2.26 0-3.58 1.7-3.58 3.46 0 .68.26 1.42.58 1.82.06.08.07.15.05.23-.06.24-.18.75-.2.85-.03.14-.12.17-.27.1-1-.46-1.63-1.9-1.63-3.07 0-2.5 1.82-4.79 5.24-4.79 2.75 0 4.88 1.96 4.88 4.57 0 2.73-1.72 4.92-4.1 4.92-.8 0-1.55-.42-1.81-.9l-.5 1.88c-.17.67-.67 1.5-1 2.01A12 12 0 1 0 12 0z"/>
            </svg>
            <nav className="ml-6 flex space-x-8">
              <a href="#" className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">{t('header.home')}</a>
              <a href="#" className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">{t('header.explore')}</a>
              <a href="#" className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">{t('header.create')}</a>
            </nav>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder={t('header.search')}
                className="bg-gray-100 rounded-full py-2 px-4 pl-10 w-64 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <Bell className="ml-4 text-gray-600 hover:text-gray-800 cursor-pointer" size={24} />
            <MessageCircle className="ml-4 text-gray-600 hover:text-gray-800 cursor-pointer" size={24} />
            <User className="ml-4 text-gray-600 hover:text-gray-800 cursor-pointer" size={24} />
            <LanguageSwitcher />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <ImageUpload onImageUpload={handleImageUpload} />
        <StyleSelector currentStyle={galleryStyle} onStyleChange={setGalleryStyle} />
        <ImageList
          images={images}
          onDeleteImage={handleDeleteImage}
          style={galleryStyle}
        />
      </main>
    </div>
  )
}

export default App