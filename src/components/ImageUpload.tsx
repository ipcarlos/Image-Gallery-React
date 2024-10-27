import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ImageUploadProps {
  onImageUpload: (files: File[]) => void
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const { t } = useTranslation()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onImageUpload(acceptedFiles)
    },
    [onImageUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 mb-8 text-center cursor-pointer transition-all duration-300 ${
        isDragActive ? 'border-gray-400 bg-gray-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600 font-medium">
        {isDragActive
          ? t('imageUpload.dropHere')
          : t('imageUpload.dragDrop')}
      </p>
      <p className="mt-1 text-xs text-gray-500">
        {t('imageUpload.description')}
      </p>
    </div>
  )
}

export default ImageUpload