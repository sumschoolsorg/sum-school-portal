'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Loader2,
  Camera,
  ShieldCheck,
  Search,
  HardDrive,
  Sparkles,
  Link as LinkIcon,
  UploadCloud,
  Check,
} from 'lucide-react';
import {
  uploadImageWithUniqueId,
  normalizeImageUrl,
  isValidImageUrl,
} from '@/lib/storage';
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
  const propUrl = value ?? currentImageUrl ?? '';
  const [preview, setPreview] = useState<string>(propUrl);
  const [inputMode, setInputMode] = useState<'file' | 'url'>('file');
  const [urlInput, setUrlInput] = useState<string>(propUrl);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);
  const [sizeStats, setSizeStats] = useState<{ original: number; uploaded: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevPropRef = useRef(propUrl);

  useEffect(() => {
    if (prevPropRef.current !== propUrl) {
      prevPropRef.current = propUrl;
      setPreview(propUrl);
      setUrlInput(propUrl);
    }
  }, [propUrl]);

  const notifyChange = (url: string) => {
    prevPropRef.current = url;
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

  const processFileUpload = async (rawFile: File) => {
    if (!rawFile.type.startsWith('image/')) {
      toast.error('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (rawFile.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Photo size (${formatBytes(rawFile.size)}) exceeds the ${maxSizeMB}MB admin limit.`);
      return;
    }

    const previousUrl = preview;
    const objectUrl = URL.createObjectURL(rawFile);
    setPreview(objectUrl);
    setIsUploading(true);

    try {
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
      setUrlInput(url);
      notifyChange(url);

      if (originalBytes > finalBytes && originalBytes > 1024 * 1024) {
        toast.success(`Photo uploaded to Firebase Storage! (${formatBytes(originalBytes)} → ${formatBytes(finalBytes)})`);
      } else {
        toast.success(`Photo uploaded to Firebase Storage! (${formatBytes(finalBytes)})`);
      }
    } catch (error) {
      console.error('Firebase Storage upload failed:', error);
      URL.revokeObjectURL(objectUrl);
      setPreview(previousUrl);
      setSizeStats(null);
      toast.error(
        (error as Error)?.message || 'Upload to Firebase Storage failed. Please verify your Firebase login & storage permissions.'
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;
    await processFileUpload(rawFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      await processFileUpload(droppedFile);
    }
  };

  const handleApplyUrl = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const normalized = normalizeImageUrl(urlInput);
    if (!normalized || !isValidImageUrl(normalized)) {
      toast.error('Please enter a valid image link (https://..., Google Drive share link, or /images/...).');
      return;
    }
    setPreview(normalized);
    setUrlInput(normalized);
    setSizeStats(null);
    notifyChange(normalized);
    toast.success('Image link applied! Click Save to persist changes to Firebase.');
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview('');
    setUrlInput('');
    setSizeStats(null);
    notifyChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePickRealImage = (url: string) => {
    const normalized = normalizeImageUrl(url);
    setPreview(normalized);
    setUrlInput(normalized);
    setSizeStats(null);
    notifyChange(normalized);
  };

  return (
    <div className={`w-full ${className} space-y-2.5`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {label && (
            <label className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
              {label}
            </label>
          )}
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            title={`Max photo upload limit: ${maxSizeMB}MB with auto-optimization`}
          >
            <HardDrive className="w-2.5 h-2.5 text-blue-500" />
            Max {maxSizeMB}MB
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick Mode Switcher: Upload File vs Paste Image Link */}
          <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setInputMode('file')}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                inputMode === 'file'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <UploadCloud className="w-3 h-3" />
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setInputMode('url')}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                inputMode === 'url'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <LinkIcon className="w-3 h-3" />
              Image Link
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition shadow-2xs cursor-pointer"
            title="Browse campus photography library"
          >
            <Search className="w-3 h-3 text-emerald-700" />
            <span>Library</span>
          </button>
        </div>
      </div>

      {/* Direct URL Paste Mode */}
      {inputMode === 'url' && (
        <div className="p-3.5 rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20 space-y-2.5">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleApplyUrl(e);
                  }
                }}
                placeholder="Paste direct image URL or Google Drive share link (https://...)"
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={handleApplyUrl}
              disabled={!urlInput.trim()}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Check className="w-3.5 h-3.5" />
              Apply Link
            </button>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Supports direct image URLs (JPG/PNG/WebP), Firebase Storage URLs, Google Drive share links, and Dropbox links.
          </p>
        </div>
      )}

      {/* Dropzone & Preview Area */}
      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-4 transition-all duration-200 cursor-pointer text-center flex flex-col items-center justify-center min-h-[148px] ${
          isDragging
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 scale-[1.01]'
            : preview
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

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Optimizing &amp; Uploading to Firebase Storage...
            </span>
            <span className="text-[11px] text-slate-400">
              Smart auto-compression enabled (up to {maxSizeMB}MB supported)
            </span>
          </div>
        ) : preview ? (
          <div className="relative w-full h-36 flex flex-col items-center justify-center group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Selected image preview"
              className="max-h-28 max-w-full rounded-xl object-contain shadow-xs"
            />
            <div className="mt-1.5 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                Image Ready
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
                  fileInputRef.current?.click();
                }}
                className="text-[11px] text-blue-600 hover:underline font-medium cursor-pointer"
              >
                Replace File
              </button>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition cursor-pointer"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                Click to upload photo from device
              </span>{' '}
              or drag &amp; drop here
            </div>
            <p className="text-[11px] text-slate-400">
              PNG, JPG, WebP up to {maxSizeMB}MB — or switch to &quot;Image Link&quot; above to paste a URL
            </p>
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
