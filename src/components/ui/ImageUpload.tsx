'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader2, Camera, ShieldCheck, Search } from 'lucide-react';
import { uploadImageWithUniqueId } from '@/lib/storage';
import { RealImagePickerModal } from './RealImagePickerModal';
import { toast } from 'sonner';

export interface ImageUploadProps {
  label?: string;
  folder?: string;
  currentImageUrl?: string;
  value?: string;
  onImageUploaded?: (url: string) => void;
  onImageSelect?: (url: string) => void;
  onChange?: (url: string) => void;
  className?: string;
}

export function ImageUpload({
  label = 'Upload Image',
  folder = 'uploads',
  currentImageUrl,
  value,
  onImageUploaded,
  onImageSelect,
  onChange,
  className = '',
}: ImageUploadProps) {
  const initialUrl = value ?? currentImageUrl ?? '';
  const [preview, setPreview] = useState<string>(initialUrl);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.');
      return;
    }

    // Local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    setIsUploading(true);
    try {
      const { url } = await uploadImageWithUniqueId(file, folder);
      setPreview(url);
      notifyChange(url);
      toast.success('Real photograph uploaded successfully!');
    } catch (error) {
      console.warn('Firebase Storage upload failed or not configured, using local object preview for dev:', error);
      notifyChange(objectUrl);
      toast.info('Real photograph selected (Local preview mode). Real Firebase upload will activate once Storage is connected.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview('');
    notifyChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePickRealImage = (url: string) => {
    setPreview(url);
    notifyChange(url);
  };

  return (
    <div className={`w-full ${className} space-y-2`}>
      <div className="flex items-center justify-between">
        {label && (
          <label className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
            {label}
          </label>
        )}
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
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                Verified Real Photography
              </span>
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
            <span className="text-xs text-slate-500">Uploading real photo...</span>
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
              Only authentic real-world photography (PNG, JPG, WebP up to 5MB)
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
