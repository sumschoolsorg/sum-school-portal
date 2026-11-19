'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import {
  uploadImageWithUniqueId,
  deleteImageByUrl,
  normalizeImageUrl,
  isValidImageUrl,
} from '@/lib/storage';
import { mediaAssetRepository } from '@/lib/repositories';
import { MediaAsset } from '@/types';
import {
  Upload,
  UploadCloud,
  Image as ImageIcon,
  Copy,
  Check,
  Trash2,
  Eye,
  Sparkles,
  Folder,
  ArrowRight,
  ShieldCheck,
  Search,
  Link as LinkIcon,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<string>('general');
  const [filterFolder, setFilterFolder] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [autoCompress, setAutoCompress] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);

  // Direct URL link saving
  const [linkUrl, setLinkUrl] = useState<string>('');
  const [linkName, setLinkName] = useState<string>('');
  const [isSavingLink, setIsSavingLink] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await mediaAssetRepository.getAll();
      setMediaList(data || []);
    } catch (err) {
      console.error('Failed to load media library:', err);
      toast.error((err as Error)?.message || 'Failed to load media assets from Firebase.');
      setMediaList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    mediaAssetRepository
      .getAll()
      .then((data) => {
        if (isMounted) {
          setMediaList(data || []);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to load media library:', err);
          setMediaList([]);
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const formatBytes = (bytes: number) => {
    if (!bytes) return 'Link';
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${Math.round(bytes / 1024)} KB`;
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('Image URL copied to clipboard! Paste it into any page or form.');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async (asset: MediaAsset) => {
    if (!asset.id) return;
    try {
      setMediaList((prev) => prev.filter((m) => m.id !== asset.id));
      if (previewAsset?.id === asset.id) setPreviewAsset(null);
      await mediaAssetRepository.delete(asset.id);
      await deleteImageByUrl(asset.url);
      toast.success('Asset permanently removed from Firebase.');
    } catch (err) {
      console.error('Delete asset failed:', err);
      toast.error((err as Error)?.message || 'Failed to delete asset. Reloading...');
      await loadMedia();
    }
  };

  // Client-side image optimizer using HTML5 canvas
  const optimizeImage = async (
    file: File,
    maxDim = 1920,
    quality = 0.85
  ): Promise<{ file: File; originalSize: number; optimizedSize: number; dimensions: string }> => {
    if (file.size <= 300 * 1024 || file.type === 'image/svg+xml') {
      return { file, originalSize: file.size, optimizedSize: file.size, dimensions: 'Original' };
    }

    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        let { width, height } = img;
        const origDim = `${width}x${height}`;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ file, originalSize: file.size, optimizedSize: file.size, dimensions: origDim });
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              resolve({ file, originalSize: file.size, optimizedSize: file.size, dimensions: `${width}x${height}` });
              return;
            }
            const optimizedFile = new File(
              [blob],
              file.name.replace(/\.[^.]+$/, mime === 'image/png' ? '.png' : '.jpg'),
              { type: mime, lastModified: Date.now() }
            );
            resolve({
              file: optimizedFile,
              originalSize: file.size,
              optimizedSize: blob.size,
              dimensions: `${width}x${height}`,
            });
          },
          mime,
          quality
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve({ file, originalSize: file.size, optimizedSize: file.size, dimensions: 'Unknown' });
      };
      img.src = objectUrl;
    });
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const rawFile = files[i];
      if (!rawFile.type.startsWith('image/')) {
        toast.error(`"${rawFile.name}" is not a supported image file.`);
        continue;
      }

      try {
        let fileToUpload = rawFile;
        let originalBytes = rawFile.size;
        let finalBytes = rawFile.size;
        let dimString = 'Original';

        if (autoCompress) {
          const opt = await optimizeImage(rawFile);
          fileToUpload = opt.file;
          originalBytes = opt.originalSize;
          finalBytes = opt.optimizedSize;
          dimString = opt.dimensions;
        }

        const { url } = await uploadImageWithUniqueId(fileToUpload, selectedFolder);

        await mediaAssetRepository.create({
          url,
          name: fileToUpload.name,
          folder: selectedFolder,
          size: originalBytes,
          optimizedSize: finalBytes,
          uploadedAt: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          dimensions: dimString,
          sourceType: 'upload',
        });

        successCount++;
      } catch (err) {
        console.error('Upload error for file:', rawFile.name, err);
        toast.error((err as Error)?.message || `Failed to upload "${rawFile.name}".`);
      }
    }

    if (successCount > 0) {
      await loadMedia();
      toast.success(
        `Uploaded ${successCount} image${successCount > 1 ? 's' : ''} to Firebase Storage & saved to Firestore!`
      );
    }

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveImageLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeImageUrl(linkUrl);
    if (!normalized || !isValidImageUrl(normalized)) {
      toast.error('Please enter a valid image URL (https://..., Google Drive share link, or /images/...).');
      return;
    }

    setIsSavingLink(true);
    try {
      const derivedName =
        linkName.trim() ||
        normalized.split('/').pop()?.split('?')[0] ||
        `image-link-${Date.now()}`;

      await mediaAssetRepository.create({
        url: normalized,
        name: derivedName.slice(0, 280),
        folder: selectedFolder,
        size: 0,
        uploadedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        dimensions: 'External Link',
        sourceType: 'url',
      });

      setLinkUrl('');
      setLinkName('');
      await loadMedia();
      toast.success('Image link saved to Firebase Media Library!');
    } catch (err) {
      console.error('Failed to save image link:', err);
      toast.error((err as Error)?.message || 'Failed to save image link to Firebase.');
    } finally {
      setIsSavingLink(false);
    }
  };

  const filteredMedia = mediaList.filter((m) => {
    const matchesFolder = filterFolder === 'all' || m.folder === filterFolder;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.folder.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const folders = [
    { id: 'general', label: 'General' },
    { id: 'banners', label: 'Banners' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'events', label: 'Events' },
    { id: 'faculty', label: 'Faculty' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'news', label: 'News' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <span>Firebase Cloud Asset Management</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3 h-3" />
              Cloud Synced
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading">
            Image Upload &amp; Media Asset Manager
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Upload photos to Firebase Storage or register direct image links (Google Drive, HTTPS URLs). Copy URLs with one click to embed anywhere.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="accent"
            size="md"
            leftIcon={<UploadCloud className="w-5 h-5" />}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload Photos'}
          </Button>
          <Link href="/admin/gallery">
            <Button
              variant="outline"
              size="md"
              className="border-white/30 text-white hover:bg-white/10"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Manage Gallery
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Upload Dropzone Card with real drag & drop */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFileUpload(e.dataTransfer.files);
        }}
      >
        <Card
          className={`p-6 sm:p-8 border-2 border-dashed rounded-3xl text-center transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-100/60 dark:bg-blue-900/40 scale-[1.01]'
              : 'border-blue-300 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />

          <div className="max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                Drag &amp; Drop Images or Click to Browse
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Supports JPEG, PNG, WebP up to 25MB per file. Uploads directly to Firebase Storage.
              </p>
            </div>

            {/* Folder and Auto-Compress Settings */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Folder className="w-4 h-4 text-amber-500" />
                <span>Target Folder:</span>
                <select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-medium cursor-pointer"
                >
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      /{f.label}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoCompress}
                  onChange={(e) => setAutoCompress(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Auto-Optimize for Web
                </span>
              </label>
            </div>

            <div className="pt-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="primary"
                size="lg"
                leftIcon={<Upload className="w-4 h-4" />}
                disabled={isUploading}
              >
                {isUploading ? 'Compressing & Uploading...' : 'Select Files to Upload'}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Add Image by Direct Link (URL) */}
      <Card className="p-5 sm:p-6">
        <form onSubmit={handleSaveImageLink} className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <LinkIcon className="w-4 h-4 text-blue-600" />
            <span>Add Image by Link (URL / Google Drive)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Paste image link (https://... or Google Drive share link)"
              className="md:col-span-6 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              value={linkName}
              onChange={(e) => setLinkName(e.target.value)}
              placeholder="Optional title / label (e.g. Annual Day Banner)"
              className="md:col-span-4 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="md:col-span-2"
              isLoading={isSavingLink}
              disabled={!linkUrl.trim()}
            >
              Save Link
            </Button>
          </div>
        </form>
      </Card>

      {/* Asset Library Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <span>Media Library</span>
            <Badge variant="neutral">{filteredMedia.length} Assets</Badge>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Click &ldquo;Copy URL&rdquo; to embed an image in any form, article, or announcement.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setFilterFolder('all')}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                filterFolder === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All
            </button>
            {folders.slice(0, 4).map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterFolder(f.id)}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  filterFolder === f.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : filteredMedia.length === 0 ? (
        <Card className="p-12 text-center text-slate-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-semibold">No uploaded media assets yet.</p>
          <p className="text-xs mt-1">Upload new images or save an image link above to build your library.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredMedia.map((asset) => {
            const isCopied = copiedId === asset.id;
            return (
              <Card
                key={asset.id}
                className="overflow-hidden group hover:shadow-md transition flex flex-col"
              >
                <div
                  onClick={() => setPreviewAsset(asset)}
                  className="relative aspect-[16/10] bg-slate-950 overflow-hidden cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <span className="p-2 rounded-full bg-white/90 text-slate-900 shadow-sm">
                      <Eye className="w-4 h-4" />
                    </span>
                  </div>
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                    {asset.folder}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <h4
                      className="text-xs font-bold text-slate-900 dark:text-white truncate"
                      title={asset.name}
                    >
                      {asset.name}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      <span>{asset.dimensions || 'Image'}</span>
                      <span>
                        {asset.optimizedSize
                          ? `${formatBytes(asset.optimizedSize)} (optimized)`
                          : formatBytes(asset.size)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      onClick={() => handleCopyUrl(asset.url, asset.id || '')}
                      variant={isCopied ? 'accent' : 'primary'}
                      size="sm"
                      className="flex-1 text-xs"
                      leftIcon={isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    >
                      {isCopied ? 'Copied!' : 'Copy URL'}
                    </Button>

                    <button
                      onClick={() => handleDelete(asset)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                      title="Delete permanently"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Lightbox / Asset Inspector Modal */}
      {previewAsset && (
        <Modal
          isOpen={!!previewAsset}
          onClose={() => setPreviewAsset(null)}
          title={previewAsset.name}
          size="lg"
        >
          <div className="space-y-4">
            <div className="max-h-[60vh] overflow-hidden rounded-2xl bg-slate-950 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewAsset.url}
                alt={previewAsset.name}
                className="max-h-[60vh] w-auto object-contain mx-auto"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">Image URL:</span>
                <button
                  onClick={() => handleCopyUrl(previewAsset.url, previewAsset.id || '')}
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Exact URL</span>
                </button>
              </div>
              <input
                type="text"
                readOnly
                value={previewAsset.url}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono select-all"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <div className="grid grid-cols-3 gap-2 pt-1 text-slate-500">
                <div>Folder: <strong className="text-slate-800 dark:text-slate-200">/{previewAsset.folder}</strong></div>
                <div>Size: <strong className="text-slate-800 dark:text-slate-200">{formatBytes(previewAsset.optimizedSize || previewAsset.size)}</strong></div>
                <div>Date: <strong className="text-slate-800 dark:text-slate-200">{previewAsset.uploadedAt}</strong></div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setPreviewAsset(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Copy className="w-4 h-4" />}
                onClick={() => handleCopyUrl(previewAsset.url, previewAsset.id || '')}
              >
                Copy URL &amp; Use Image
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
