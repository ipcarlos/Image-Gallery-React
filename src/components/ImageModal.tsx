import React, { useState, useEffect, useRef } from 'react'
import { X, Download, Share2, Heart, ZoomIn, ZoomOut, Trash2 } from 'lucide-react'
import { ImageItem } from '../types'
import { useTranslation } from 'react-i18next'

interface ImageModalProps {
  image: ImageItem
  onClose: () => void
  onDelete: () => void
}

interface Position {
  x: number
  y: number
}

const ImageModal: React.FC<ImageModalProps> = ({ image, onClose, onDelete }) => {
  const { t } = useTranslation()
  const [isLiked, setIsLiked] = useState(false)
  const [scale, setScale] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3))
    setPosition({ x: 0, y: 0 }) // Reset position on zoom
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5))
    setPosition({ x: 0, y: 0 }) // Reset position on zoom
  }
  
  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Shared Image',
        text: image.description,
        url: image.url
      })
    } catch (error) {
      console.log('Error sharing:', error)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1 && containerRef.current && imageRef.current) {
      const containerBounds = containerRef.current.getBoundingClientRect()
      const imageBounds = imageRef.current.getBoundingClientRect()
      
      const maxX = (imageBounds.width * scale - containerBounds.width) / 2
      const maxY = (imageBounds.height * scale - containerBounds.height) / 2
      
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y
      
      setPosition({
        x: Math.max(Math.min(newX, maxX), -maxX),
        y: Math.max(Math.min(newY, maxY), -maxY)
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('mouseleave', handleMouseUp)
      return () => {
        window.removeEventListener('mouseup', handleMouseUp)
        window.removeEventListener('mouseleave', handleMouseUp)
      }
    }
  }, [isDragging])

  const modalContent = (e: React.MouseEvent) => {
    e.stopPropagation()
    return false
  }

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 transition-all duration-300"
      onClick={onClose}
    >
      <div 
        className="absolute inset-0 flex items-center justify-center p-4"
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <div 
          className="relative max-w-7xl w-full bg-gradient-to-b from-gray-900/50 to-black/50 rounded-2xl overflow-hidden"
          onClick={modalContent}
        >
          {/* Header */}
          <div className={`absolute top-0 left-0 right-0 p-6 flex justify-between items-center transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'} z-50`}>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                <img src={image.url} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-white text-lg font-medium">
                  {image.description.slice(0, 50)}...
                </h2>
                <p className="text-gray-400 text-sm">
                  {new Date(image.id).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={onDelete}
                className="text-white/70 hover:text-red-500 transition-colors p-2 hover:bg-white/10 rounded-full"
              >
                <Trash2 size={24} />
              </button>
              <button 
                onClick={onClose}
                className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Main Image */}
          <div 
            ref={containerRef}
            className="relative flex justify-center items-center h-[80vh] overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ cursor: scale > 1 ? isDragging ? 'grabbing' : 'grab' : 'default' }}
          >
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : (
              <img
                ref={imageRef}
                src={image.url}
                alt={image.description}
                className="max-w-full max-h-full object-contain transition-transform duration-300 ease-out select-none"
                style={{ 
                  transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                  transformOrigin: 'center'
                }}
                draggable={false}
              />
            )}
          </div>

          {/* Footer Controls */}
          <div className={`absolute bottom-0 left-0 right-0 p-6 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'} z-50`}>
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2 rounded-full transition-all ${isLiked ? 'bg-red-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'}`}
                >
                  <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                </button>
                <button 
                  onClick={handleShare}
                  className="p-2 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
                >
                  <Share2 size={20} />
                </button>
                <a 
                  href={image.url}
                  download
                  className="p-2 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
                >
                  <Download size={20} />
                </a>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={handleZoomOut}
                  className="p-2 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={scale <= 0.5}
                >
                  <ZoomOut size={20} />
                </button>
                <button 
                  onClick={handleZoomIn}
                  className="p-2 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={scale >= 3}
                >
                  <ZoomIn size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageModal