'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Loader2, Camera, ShieldCheck, Search, HardDrive, Sparkles } from 'lucide-react';
import { uploadImageWithUniqueId } from '@/lib/storage';
import { RealImagePickerModal } from './RealImagePickerModal';
import { toast } from 'sonner';

export interface ImageUploadProps {
  label?: string;
  folder?: string;
  currentImageUrl?: string;
  value?: string;
  maxSizeMB?: number;
  autoCompress?: boolean;
  onImageUploaded?: (url: string) => void;
  onImageSelect?: (url: string) => void;
  onChange?: (url: string) => void;
  className?: string;
}

// Client-side image optimizer using HTML5 canvas
async function optimizeImageForUpload(
  file: File,
  maxDimension = 2400,
  quality = 0.88
): Promise<{ file: File; originalSize: number; optimizedSize: number }> {
  // If file is already smaller than 1.2MB or is vector SVG/GIF, pass as is
  if (file.size <= 1.2 * 1024 * 1024 || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return { file, originalSize: file.size, optimizedSize: file.size };
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({ file, originalSize: file.size, optimizedSize: file.size });
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            resolve({ file, originalSize: file.size, optimizedSize: file.size });
            return;
          }
          const optimizedFile = new File(
            [blob],
            file.name.replace(/\.[^.]+$/, mimeType === 'image/png' ? '.png' : '.jpg'),
            {
              type: mimeType,
              lastModified: Date.now(),
            }
          );
          resolve({ file: optimizedFile, originalSize: file.size, optimizedSize: blob.size });
        },
        mimeType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ file, originalSize: file.size, optimizedSize: file.size });
    };

    img.src = objectUrl;
  });
}

export function ImageUpload({
  label = 'Upload Image',
  folder = 'uploads',
  currentImageUrl,
  value,
  maxSizeMB = 25,
  autoCompress = true,
  onImageUploaded,
  onImageSelect,
  onChange,
  className = '',
}: ImageUploadProps) {
  const initialUrl = value ?? currentImageUrl ?? '';
  const [preview, setPreview] = useState<string>(initialUrl);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);
  const [sizeStats, setSizeStats] = useState<{ original: number; uploaded: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const propUrl = value ?? currentImageUrl ?? '';
  const prevPropRef = useRef(propUrl);

  useEffect(() => {
    if (prevPropRef.current !== propUrl) {
      prevPropRef.current = propUrl;
      setPreview(propUrl);
    }
  }, [propUrl]);

  const notifyChange = (url: string) => {
    if (onChange) onChange(url);
    if (onImageSelect) onImageSelect(url);
    if (onImageUploaded) onImageUploaded(url);
  };

  const formatBytes = (bytes: number) => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${Math.round(bytes / 1024)} KB`;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    if (!rawFile.type.startsWith('image/')) {
      toast.error('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (rawFile.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Photo size (${formatBytes(rawFile.size)}) exceeds the ${maxSizeMB}MB admin limit.`);
      return;
    }

    // Local preview immediately
    const objectUrl = URL.createObjectURL(rawFile);
    setPreview(objectUrl);
    setIsUploading(true);

    try {
      // Auto-compress large camera photos if enabled
      let fileToUpload = rawFile;
      let originalBytes = rawFile.size;
      let finalBytes = rawFile.size;

      if (autoCompress) {
        const optimized = await optimizeImageForUpload(rawFile);
        fileToUpload = optimized.file;
        originalBytes = optimized.originalSize;
        finalBytes = optimized.optimizedSize;
      }

      setSizeStats({ original: originalBytes, uploaded: finalBytes });

      const { url } = await uploadImageWithUniqueId(fileToUpload, folder);
      URL.revokeObjectURL(objectUrl);
      setPreview(url);
      notifyChange(url);

      if (originalBytes > finalBytes && originalBytes > 1024 * 1024) {
        toast.success(`Photo uploaded! (${formatBytes(originalBytes)} → ${formatBytes(finalBytes)})`);
      } else {
        toast.success(`Photo uploaded successfully! (${formatBytes(finalBytes)})`);
      }
    } catch (error) {
      console.warn('Firebase Storage upload failed:', error);
      URL.revokeObjectURL(objectUrl);
      setPreview(initialUrl);
      toast.error(
        (error as Error)?.message || 'Upload to Firebase Storage failed. Please check storage permissions or try again.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview('');
    setSizeStats(null);
    notifyChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePickRealImage = (url: string) => {
    setPreview(url);
    setSizeStats(null);
    notifyChange(url);
  };

  return (
    <div className={`w-full ${className} space-y-2`}>
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center gap-2">
          {label && (
            <label className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
              {label}
            </label>
          )}
          {/* Upload Size Control Badge */}
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            title={`Max photo upload limit: ${maxSizeMB}MB with auto-optimization`}
          >
            <HardDrive className="w-2.5 h-2.5 text-blue-500" />
            Max {maxSizeMB}MB
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition shadow-2xs"
          title="Browse verified real school campus, classroom & lab photographs"
        >
          <Search className="w-3 h-3 text-emerald-700" />
          <span>Search Real Photos</span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-200/60 px-1 py-0.2 rounded">
            Zero AI
          </span>
        </button>
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-4 transition-all duration-200 cursor-pointer text-center flex flex-col items-center justify-center min-h-[150px] ${
          preview
            ? 'border-emerald-500/40 bg-emerald-50/10 dark:bg-emerald-950/20'
            : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-900/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {preview ? (
          <div className="relative w-full h-36 flex flex-col items-center justify-center group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Uploaded real preview"
              className="max-h-28 max-w-full rounded-xl object-contain shadow-xs"
            />
            <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                Verified Real Photo
              </span>

              {sizeStats && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
                  <Sparkles className="w-2.5 h-2.5 text-blue-600" />
                  {sizeStats.original > sizeStats.uploaded
                    ? `${formatBytes(sizeStats.original)} → ${formatBytes(sizeStats.uploaded)}`
                    : formatBytes(sizeStats.uploaded)}
                </span>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPickerOpen(true);
                }}
                className="text-[11px] text-blue-600 hover:underline font-medium"
              >
                Change Photo
              </button>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Optimizing &amp; Uploading photo...
            </span>
            <span className="text-[11px] text-slate-400">
              Smart auto-compression enabled (up to {maxSizeMB}MB supported)
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                Upload real photo from device
              </span>{' '}
              or drag &amp; drop
            </div>
            <p className="text-[11px] text-slate-400">
              Real-world photography (PNG, JPG, WebP up to {maxSizeMB}MB with auto-optimization)
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPickerOpen(true);
                }}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 flex items-center gap-1"
              >
                <Search className="w-3 h-3" />
                Browse 21+ Verified School Photos
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Real Image Picker Modal */}
      <RealImagePickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelectImage={handlePickRealImage}
        currentImageUrl={preview}
      />
    </div>
  );
}
