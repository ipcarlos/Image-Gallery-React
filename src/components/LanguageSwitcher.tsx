import React from 'react'
import { useTranslation } from 'react-i18next'

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className="ml-4">
      <select
        onChange={(e) => changeLanguage(e.target.value)}
        value={i18n.language}
        className="bg-gray-100 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <option value="en">EN</option>
        <option value="es">ES</option>
        <option value="de">DE</option>
      </select>
    </div>
  )
}

export default LanguageSwitcher