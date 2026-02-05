'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface DragDropUploadProps {
    images: string[]
    onUpdate: (urls: string[]) => void
}

export default function DragDropUpload({ images, onUpdate }: DragDropUploadProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const uploadFiles = async (files: File[]) => {
        setUploading(true)
        try {
            const uploadPromises = files.map(async (file) => {
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
                const filePath = `uploads/${fileName}`

                const { data, error } = await supabase.storage
                    .from('store')
                    .upload(filePath, file)

                if (error) throw error

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('store')
                    .getPublicUrl(filePath)

                return publicUrl
            })

            const newUrls = await Promise.all(uploadPromises)
            onUpdate([...images, ...newUrls])
        } catch (error: any) {
            console.error('Upload error:', error)
            alert('Upload failed: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
        if (files.length > 0) {
            uploadFiles(files)
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'))
        if (files.length > 0) {
            uploadFiles(files)
        }
    }

    const addImageUrl = () => {
        const url = prompt('Enter image URL:')
        if (url) onUpdate([...images, url])
    }

    return (
        <div className="space-y-4">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all relative ${isDragging ? 'border-white bg-neutral-800' : 'border-neutral-800 bg-black hover:bg-neutral-950'
                    } ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => !uploading && fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    accept="image/*"
                    className="hidden"
                />

                {uploading ? (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
                        <p className="text-white font-bold">Uploading...</p>
                    </div>
                ) : (
                    <>
                        <Upload className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                        <p className="text-white font-bold mb-2">Drag and drop images here</p>
                        <p className="text-neutral-500 text-sm mb-6">Support for PNG, JPG and WEBP</p>
                        <div className="flex justify-center gap-4">
                            <button
                                type="button"
                                className="btn-secondary px-8 py-2 rounded-full text-xs font-bold"
                            >
                                Select Files
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    addImageUrl()
                                }}
                                className="text-neutral-500 hover:text-white text-xs font-bold transition-colors"
                            >
                                Or paste URL
                            </button>
                        </div>
                    </>
                )}
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {images.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 group">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => onUpdate(images.filter((_, i) => i !== idx))}
                                className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                            {idx === 0 && (
                                <div className="absolute bottom-0 inset-x-0 bg-white text-black text-[10px] font-bold py-1 text-center">
                                    PRIMARY
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
