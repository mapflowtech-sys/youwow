/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, Image as ImageIcon, Check, Loader2, Video, X } from 'lucide-react'

interface CoverSelectorProps {
  orderId: string
  onVideoGenerated?: (videoUrl: string) => void
}

// Пресеты обложек (1-6)
const PRESET_COVERS = [
  { id: 1, name: 'Новогодняя', path: '/song-covers/presets/preset-1.svg' },
  { id: 2, name: 'Романтическая', path: '/song-covers/presets/preset-2.svg' },
  { id: 3, name: 'День рождения', path: '/song-covers/presets/preset-3.svg' },
  { id: 4, name: 'Праздничная', path: '/song-covers/presets/preset-4.svg' },
  { id: 5, name: 'Музыкальная', path: '/song-covers/presets/preset-5.svg' },
  { id: 6, name: 'Абстрактная', path: '/song-covers/presets/preset-6.svg' }
]

export default function CoverSelector({ orderId, onVideoGenerated }: CoverSelectorProps) {
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset')
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const [customImage, setCustomImage] = useState<string | null>(null)
  const [customImageFile, setCustomImageFile] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Обработчик загрузки пользовательского изображения
  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Валидация формата
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Поддерживаются только JPG, PNG и WebP форматы')
      return
    }

    // Валидация размера (макс 10 МБ)
    if (file.size > 10 * 1024 * 1024) {
      setError('Размер файла не должен превышать 10 МБ')
      return
    }

    setError(null)
    setCustomImageFile(file)

    // Превью
    const reader = new FileReader()
    reader.onload = (event) => {
      setCustomImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Генерация видео
  const handleGenerateVideo = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    setError(null)

    try {
      let coverImage: string

      if (activeTab === 'preset') {
        if (!selectedPreset) {
          setError('Выберите обложку из списка')
          setIsGenerating(false)
          return
        }
        coverImage = selectedPreset.toString()
      } else {
        if (!customImage) {
          setError('Загрузите свою обложку')
          setIsGenerating(false)
          return
        }
        coverImage = customImage
      }

      // Симуляция прогресса (реальный прогресс сложно отслеживать с base64 ответом)
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) return prev
          return prev + 10
        })
      }, 2000)

      const response = await fetch('/api/song/create-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          coverType: activeTab,
          coverImage,
          resolution: '720p'
        })
      })

      clearInterval(progressInterval)
      setGenerationProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Ошибка генерации видео')
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Ошибка генерации видео')
      }

      // Сохраняем base64 видео
      setGeneratedVideoUrl(data.video)

      // Колбэк для родителя
      if (onVideoGenerated) {
        onVideoGenerated(data.video)
      }

    } catch (err) {
      console.error('Video generation error:', err)
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
    } finally {
      setIsGenerating(false)
      setGenerationProgress(0)
    }
  }

  // Скачивание видео
  const handleDownloadVideo = () => {
    if (!generatedVideoUrl) return

    // Конвертируем base64 в blob
    const byteString = atob(generatedVideoUrl.split(',')[1])
    const mimeString = generatedVideoUrl.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    const blob = new Blob([ab], { type: mimeString })

    // Скачиваем
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `youwow-song-video-${orderId.slice(0, 8)}.mp4`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Video className="w-6 h-6 text-purple-600" />
        <div>
          <h3 className="text-lg font-bold">Создать видео с обложкой</h3>
          <p className="text-sm text-muted-foreground">
            Выберите обложку и создайте красивое видео для соцсетей
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <button
          onClick={() => setActiveTab('preset')}
          className={`flex-1 py-2 px-4 rounded-md transition-all ${
            activeTab === 'preset'
              ? 'bg-white dark:bg-slate-700 shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <ImageIcon className="w-4 h-4 inline mr-2" />
          Готовые обложки
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`flex-1 py-2 px-4 rounded-md transition-all ${
            activeTab === 'custom'
              ? 'bg-white dark:bg-slate-700 shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Своя обложка
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'preset' ? (
          <motion.div
            key="preset"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-3"
          >
            {PRESET_COVERS.map((cover) => (
              <motion.div
                key={cover.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedPreset(cover.id)}
                className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                  selectedPreset === cover.id
                    ? 'border-purple-500 shadow-lg'
                    : 'border-slate-200 dark:border-slate-700 hover:border-purple-300'
                }`}
              >
                <div className="aspect-square bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                  <img
                    src={cover.path}
                    alt={cover.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 right-2 text-center text-xs font-medium bg-black/50 text-white py-1 rounded">
                    {cover.name}
                  </span>
                </div>
                {selectedPreset === cover.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="custom"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleCustomImageUpload}
              className="hidden"
            />

            {customImage ? (
              <div className="relative">
                <div className="aspect-square max-w-md mx-auto rounded-xl overflow-hidden border-2 border-purple-500">
                  <img
                    src={customImage}
                    alt="Custom cover"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCustomImage(null)
                    setCustomImageFile(null)
                  }}
                  className="absolute top-2 right-2"
                >
                  <X className="w-4 h-4 mr-1" />
                  Удалить
                </Button>
              </div>
            ) : (
              <Card
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-400 transition-colors cursor-pointer p-12 text-center"
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <p className="font-semibold mb-2">Загрузите изображение</p>
                <p className="text-sm text-muted-foreground mb-4">
                  JPG, PNG или WebP (макс. 10 МБ)
                </p>
                <Button variant="outline" size="sm">
                  Выбрать файл
                </Button>
              </Card>
            )}

            <p className="text-xs text-center text-muted-foreground">
              Изображение будет автоматически обрезано до квадрата
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-800 dark:text-red-200"
        >
          {error}
        </motion.div>
      )}

      {/* Progress Bar */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Генерация видео...</span>
            <span className="text-muted-foreground">{generationProgress}%</span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-linear-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${generationProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      )}

      {/* Generated Video Preview */}
      {generatedVideoUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-3"
        >
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800 dark:text-green-200">
                Видео готово!
              </span>
            </div>
            <video
              controls
              className="w-full rounded-lg mt-3"
              src={generatedVideoUrl}
            >
              Ваш браузер не поддерживает видео.
            </video>
          </div>

          <Button
            onClick={handleDownloadVideo}
            size="lg"
            className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Video className="mr-2 h-5 w-5" />
            Скачать видео (MP4)
          </Button>
        </motion.div>
      )}

      {/* Generate Button */}
      {!generatedVideoUrl && (
        <Button
          onClick={handleGenerateVideo}
          disabled={
            isGenerating ||
            (activeTab === 'preset' && !selectedPreset) ||
            (activeTab === 'custom' && !customImage)
          }
          size="lg"
          className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Генерация... {generationProgress}%
            </>
          ) : (
            <>
              <Video className="mr-2 h-5 w-5" />
              Создать видео
            </>
          )}
        </Button>
      )}
    </motion.div>
  )
}
