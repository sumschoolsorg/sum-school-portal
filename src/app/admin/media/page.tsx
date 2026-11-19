'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
import {
  mediaAssetRepository,
  heroBannerRepository,
  facultyRepository,
  eventRepository,
  achievementRepository,
  galleryRepository,
  facilityRepository,
  testimonialRepository,
  schoolRepository,
  homepageRepository,
} from '@/lib/repositories';
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
  Grid,
  List,
  Edit,
  RefreshCw,
  AlertTriangle,
  Tag,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

export const SCHOOL_IMAGE_CATEGORIES = [
  'School Campus',
  'School Building',
  'Founders',
  'Headmaster',
  'Faculty',
  'Classrooms',
  'Science Laboratory',
  'Computer Laboratory',
  'Sports',
  'Cultural Events',
  'Achievements',
  'Students and Activities',
  'School Functions',
  'Infrastructure',
  'General',
] as const;

export type SchoolImageCategory = (typeof SCHOOL_IMAGE_CATEGORIES)[number];

export interface ImageUsageLocation {
  collection: string;
  id: string;
  title: string;
  field: string;
  pageUrl?: string;
}

// Client-side image optimizer with aspect-ratio preservation
async function optimizeImage(
  file: File,
  maxDimension = 2400,
  quality = 0.88
): Promise<{ file: File; originalSize: number; optimizedSize: number; dimensions: string }> {
  if (file.size <= 1.2 * 1024 * 1024 || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return { file, originalSize: file.size, optimizedSize: file.size, dimensions: 'Original' };
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      const origDim = `${width}x${height}`;

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
}

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<SchoolImageCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [autoCompress, setAutoCompress] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upload category selection
  const [uploadCategory, setUploadCategory] = useState<SchoolImageCategory>('General');

  // Preview / Inspector Modal
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);

  // Edit Details Modal
  const [editAsset, setEditAsset] = useState<MediaAsset | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editAltText, setEditAltText] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editCategory, setEditCategory] = useState<SchoolImageCategory>('General');
  const [isSavingDetails, setIsSavingDetails] = useState(false);

  // Replace Image Modal
  const [replaceAsset, setReplaceAsset] = useState<MediaAsset | null>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // Delete with Usage Warning Modal
  const [deleteAsset, setDeleteAsset] = useState<MediaAsset | null>(null);
  const [deleteUsages, setDeleteUsages] = useState<ImageUsageLocation[]>([]);
  const [isScanningUsage, setIsScanningUsage] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Direct URL link saving
  const [linkUrl, setLinkUrl] = useState<string>('');
  const [linkTitle, setLinkTitle] = useState<string>('');
  const [linkAltText, setLinkAltText] = useState<string>('');
  const [linkCategory, setLinkCategory] = useState<SchoolImageCategory>('General');
  const [isSavingLink, setIsSavingLink] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${Math.round(bytes / 1024)} KB`;
  };

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

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('Image URL copied to clipboard! Paste it into any form or page.');
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Upload handler with client-side compression
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const rawFile = files[i];
      if (!rawFile.type.startsWith('image/')) {
        toast.error(`"${rawFile.name}" is not a supported image file (JPEG, PNG, WebP only).`);
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

        const targetFolder = uploadCategory.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'general';
        const { url, path } = await uploadImageWithUniqueId(fileToUpload, targetFolder);

        const titleDerived = fileToUpload.name
          .replace(/\.[^.]+$/, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());

        await mediaAssetRepository.create({
          url,
          name: fileToUpload.name,
          title: titleDerived,
          description: `Authentic school photograph cataloged under ${uploadCategory}.`,
          altText: `${titleDerived} - S.U.M. School, Royappanpatti`,
          tags: [uploadCategory.toLowerCase(), 'authentic', 'school', 'royappanpatti'],
          category: uploadCategory,
          folder: targetFolder,
          storagePath: path,
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
        `Uploaded ${successCount} authentic photograph${successCount > 1 ? 's' : ''} to Firebase Storage & saved metadata!`
      );
    }

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Save image by direct link
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
        linkTitle.trim() ||
        normalized.split('/').pop()?.split('?')[0] ||
        `school-photo-${Date.now()}`;

      await mediaAssetRepository.create({
        url: normalized,
        name: derivedName.slice(0, 280),
        title: linkTitle.trim() || derivedName,
        description: `External verified school photograph asset: ${linkCategory}`,
        altText: linkAltText.trim() || `${linkTitle.trim() || derivedName} - S.U.M. School`,
        tags: [linkCategory.toLowerCase(), 'link', 'school'],
        category: linkCategory,
        folder: linkCategory.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        size: 0,
        uploadedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        dimensions: 'External Asset',
        sourceType: 'url',
      });

      setLinkUrl('');
      setLinkTitle('');
      setLinkAltText('');
      await loadMedia();
      toast.success('Authentic image link saved to ZERO AI School Image Library!');
    } catch (err) {
      console.error('Failed to save image link:', err);
      toast.error((err as Error)?.message || 'Failed to save image link to Firebase.');
    } finally {
      setIsSavingLink(false);
    }
  };

  // Open Edit Details modal
  const handleOpenEdit = (asset: MediaAsset) => {
    setEditAsset(asset);
    setEditTitle(asset.title || asset.name);
    setEditDescription(asset.description || '');
    setEditAltText(asset.altText || '');
    setEditTags(Array.isArray(asset.tags) ? asset.tags.join(', ') : '');
    setEditCategory((asset.category as SchoolImageCategory) || 'General');
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAsset?.id) return;

    setIsSavingDetails(true);
    try {
      const tagArray = editTags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      await mediaAssetRepository.update(editAsset.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        altText: editAltText.trim(),
        tags: tagArray,
        category: editCategory,
      });

      toast.success('Image details updated in Firestore!');
      setEditAsset(null);
      await loadMedia();
    } catch (err) {
      console.error('Failed to update image details:', err);
      toast.error((err as Error)?.message || 'Failed to update image details.');
    } finally {
      setIsSavingDetails(false);
    }
  };

  // Replace Image Workflow
  const handleStartReplace = (asset: MediaAsset) => {
    setReplaceAsset(asset);
    replaceFileInputRef.current?.click();
  };

  const handleExecuteReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0];
    if (!newFile || !replaceAsset?.id) return;

    if (!newFile.type.startsWith('image/')) {
      toast.error('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    const toastId = toast.loading('Replacing image in Firebase Storage & updating Firestore...');
    try {
      let fileToUpload = newFile;
      let originalBytes = newFile.size;
      let finalBytes = newFile.size;
      let dimString = 'Original';

      if (autoCompress) {
        const opt = await optimizeImage(newFile);
        fileToUpload = opt.file;
        originalBytes = opt.originalSize;
        finalBytes = opt.optimizedSize;
        dimString = opt.dimensions;
      }

      const folder = replaceAsset.folder || 'general';
      const { url: newUrl, path: newStoragePath } = await uploadImageWithUniqueId(fileToUpload, folder);

      // Save update to mediaAsset
      await mediaAssetRepository.update(replaceAsset.id, {
        url: newUrl,
        name: fileToUpload.name,
        size: originalBytes,
        optimizedSize: finalBytes,
        dimensions: dimString,
        storagePath: newStoragePath,
        uploadedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      });

      // Cleanup old storage object safely only after new reference is verified
      if (replaceAsset.storagePath) {
        await deleteImageByUrl(replaceAsset.url).catch(() => {});
      }

      toast.success('Image successfully replaced in Firebase Storage & Firestore reference updated!', { id: toastId });
      setReplaceAsset(null);
      await loadMedia();
    } catch (err) {
      console.error('Replace image error:', err);
      toast.error((err as Error)?.message || 'Failed to replace image.', { id: toastId });
    } finally {
      if (replaceFileInputRef.current) replaceFileInputRef.current.value = '';
    }
  };

  // Delete Image Workflow with Usage Scanner
  const handleStartDelete = async (asset: MediaAsset) => {
    setDeleteAsset(asset);
    setIsScanningUsage(true);
    setDeleteUsages([]);

    try {
      const normalized = asset.url.trim();
      const results: ImageUsageLocation[] = [];

      const [
        banners,
        faculty,
        events,
        achievements,
        gallery,
        facilities,
        testimonials,
        school,
        homepage,
      ] = await Promise.all([
        heroBannerRepository.getAll().catch(() => []),
        facultyRepository.getAll().catch(() => []),
        eventRepository.getAll().catch(() => []),
        achievementRepository.getAll().catch(() => []),
        galleryRepository.getAll().catch(() => []),
        facilityRepository.getAll().catch(() => []),
        testimonialRepository.getAll().catch(() => []),
        schoolRepository.get().catch(() => null),
        homepageRepository.get().catch(() => null),
      ]);

      banners.forEach((b) => {
        if (b.imageUrl === normalized) {
          results.push({ collection: 'Hero Banners', id: b.id || '', title: b.title || 'Hero Banner', field: 'imageUrl', pageUrl: '/admin/banners' });
        }
      });

      faculty.forEach((f) => {
        if (f.photoUrl === normalized) {
          results.push({ collection: 'Faculty Directory', id: f.id || '', title: f.name || 'Faculty Member', field: 'photoUrl', pageUrl: '/admin/faculty' });
        }
      });

      events.forEach((ev) => {
        if (ev.imageUrl === normalized) {
          results.push({ collection: 'School Events', id: ev.id || '', title: ev.title || 'Event', field: 'imageUrl', pageUrl: '/admin/events' });
        }
      });

      achievements.forEach((a) => {
        if (a.imageUrl === normalized || a.awardPhotoUrl === normalized) {
          results.push({ collection: 'Achievements', id: a.id || '', title: a.title || 'Achievement', field: a.imageUrl === normalized ? 'imageUrl' : 'awardPhotoUrl', pageUrl: '/admin/achievements' });
        }
      });

      gallery.forEach((g) => {
        if (g.imageUrl === normalized || g.thumbnailUrl === normalized) {
          results.push({ collection: 'Photo Gallery', id: g.id || '', title: g.title || 'Gallery Item', field: 'imageUrl', pageUrl: '/admin/gallery' });
        }
      });

      facilities.forEach((fac) => {
        if (fac.imageUrl === normalized) {
          results.push({ collection: 'Campus Facilities', id: fac.id || '', title: fac.title || 'Facility', field: 'imageUrl', pageUrl: '/admin/facilities' });
        }
      });

      testimonials.forEach((t) => {
        if (t.photoUrl === normalized) {
          results.push({ collection: 'Testimonials', id: t.name || 'Testimonial', title: t.name || 'Testimonial', field: 'photoUrl', pageUrl: '/admin/testimonials' });
        }
      });

      if (school) {
        if (school.heroImageUrl === normalized) {
          results.push({ collection: 'School Profile', id: 'default', title: 'Campus Hero Image', field: 'heroImageUrl', pageUrl: '/admin/school-info' });
        }
        if (school.logoUrl === normalized) {
          results.push({ collection: 'School Profile', id: 'default', title: 'School Crest Logo', field: 'logoUrl', pageUrl: '/admin/school-info' });
        }
        if (school.jubileeLogoUrl === normalized) {
          results.push({ collection: 'School Profile', id: 'default', title: 'Jubilee Logo', field: 'jubileeLogoUrl', pageUrl: '/admin/school-info' });
        }
      }

      if (homepage?.principalMessage?.photoUrl === normalized) {
        results.push({ collection: 'Homepage Content', id: 'default', title: "Headmaster's Photo", field: 'principalMessage.photoUrl', pageUrl: '/admin/homepage' });
      }

      setDeleteUsages(results);
    } catch (scanErr) {
      console.warn('Usage scan error:', scanErr);
    } finally {
      setIsScanningUsage(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteAsset?.id) return;

    setIsDeleting(true);
    try {
      // 1. Delete Firestore record
      await mediaAssetRepository.delete(deleteAsset.id);

      // 2. Delete Storage object if applicable
      await deleteImageByUrl(deleteAsset.url).catch(() => {});

      toast.success(`Photograph "${deleteAsset.title || deleteAsset.name}" deleted from library & storage.`);
      setDeleteAsset(null);
      await loadMedia();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error((err as Error)?.message || 'Failed to delete media asset.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered and searched media list
  const filteredMedia = useMemo(() => {
    return mediaList.filter((m) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        m.category === selectedCategory ||
        (selectedCategory === 'General' && !m.category);

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const titleMatch = (m.title || m.name || '').toLowerCase().includes(q);
      const descMatch = (m.description || '').toLowerCase().includes(q);
      const tagMatch = Array.isArray(m.tags) && m.tags.some((t) => t.toLowerCase().includes(q));
      const catMatch = (m.category || m.folder || '').toLowerCase().includes(q);

      return titleMatch || descMatch || tagMatch || catMatch;
    });
  }, [mediaList, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Hidden file input for replacement */}
      <input
        ref={replaceFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleExecuteReplace}
      />

      {/* Header Banner - ZERO AI BRANDING */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>ZERO AI — Authentic Media Registry</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3" />
              <span>100% Authentic School Photography</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            ZERO AI — SCHOOL IMAGE LIBRARY
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1.5 max-w-2xl leading-relaxed">
            Centralized media asset hub for S.U.M. Higher Secondary &amp; Primary School. Manage, inspect, replace, and audit authentic campus photographs used across all public pages, banners, and faculty profiles.
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
            {isUploading ? 'Uploading...' : 'Upload Authentic Photo'}
          </Button>

          <Link href="/admin/gallery">
            <Button
              variant="outline"
              size="md"
              className="border-white/30 text-white hover:bg-white/10"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              School Gallery
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Upload Dropzone Card with 15 Categories & Client-Side 25MB Auto-Compression */}
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
                Drag &amp; Drop Authentic Photos or Click to Browse
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Supports camera-quality JPEG, PNG, WebP up to 25MB. Dynamic client-side compression ensures fast loading without quality loss.
              </p>
            </div>

            {/* Target Category Selector */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Folder className="w-4 h-4 text-amber-500" />
                <span>Target Category:</span>
                <select
                  value={uploadCategory}
                  onChange={(e) => {
                    const cat = e.target.value as SchoolImageCategory;
                    setUploadCategory(cat);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-medium cursor-pointer focus:ring-2 focus:ring-blue-500"
                >
                  {SCHOOL_IMAGE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
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
                  Auto-Compress &amp; Preserve Aspect Ratio
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
                {isUploading ? 'Compressing & Uploading to Storage...' : 'Select Photos to Upload'}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Add Image by Direct Link (URL) */}
      <Card className="p-5 sm:p-6">
        <form onSubmit={handleSaveImageLink} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <LinkIcon className="w-4 h-4 text-blue-600" />
              <span>Register Authentic Image by Link (URL / Google Drive / Local Path)</span>
            </div>
            <span className="text-[11px] text-slate-500">Google Drive share links auto-convert to direct viewable URLs</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Paste direct URL or Google Drive share link (https://...)"
              className="lg:col-span-5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
              placeholder="Image title (e.g. Science Lab Compound Microscope)"
              className="lg:col-span-3 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={linkCategory}
              onChange={(e) => setLinkCategory(e.target.value as SchoolImageCategory)}
              className="lg:col-span-2 px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {SCHOOL_IMAGE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="lg:col-span-2"
              isLoading={isSavingLink}
              disabled={!linkUrl.trim()}
            >
              Save Link
            </Button>
          </div>
        </form>
      </Card>

      {/* Asset Library Controls: Search, 15 Categories Filter & View Mode Toggle */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-600" />
              <span>Approved School Photographic Assets</span>
              <Badge variant="neutral">{filteredMedia.length} Photos</Badge>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click &ldquo;Copy URL&rdquo; to embed in any page or select &ldquo;Edit Details&rdquo; to update metadata.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search title, tags, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 15 Categories Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            All Categories ({mediaList.length})
          </button>
          {SCHOOL_IMAGE_CATEGORIES.map((cat) => {
            const count = mediaList.filter(
              (m) => m.category === cat || (cat === 'General' && !m.category)
            ).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <span>{cat}</span>
                {count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Media Display: Grid or List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-xs text-slate-500">Loading authentic school photography library...</p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <Card className="p-16 text-center text-slate-400">
          <ImageIcon className="w-16 h-16 mx-auto mb-3 opacity-25" />
          <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">No Photographic Assets Found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {searchQuery
              ? `No images matched "${searchQuery}" in category ${selectedCategory}.`
              : `No photographs cataloged under category "${selectedCategory}" yet. Upload high-resolution school photos above.`}
          </p>
        </Card>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredMedia.map((asset) => {
            const isCopied = copiedId === asset.id;
            const displayTitle = asset.title || asset.name;
            return (
              <Card
                key={asset.id}
                className="overflow-hidden group hover:shadow-lg transition flex flex-col border border-slate-200 dark:border-slate-800"
              >
                <div
                  onClick={() => setPreviewAsset(asset)}
                  className="relative aspect-[16/10] bg-slate-950 overflow-hidden cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.url}
                    alt={asset.altText || displayTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <span className="p-2 rounded-full bg-white/90 text-slate-900 shadow-sm" title="View Details">
                      <Eye className="w-4 h-4" />
                    </span>
                  </div>
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-amber-300 uppercase tracking-wider border border-white/10">
                    {asset.category || asset.folder || 'General'}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <h4
                      className="text-xs font-bold text-slate-900 dark:text-white truncate"
                      title={displayTitle}
                    >
                      {displayTitle}
                    </h4>

                    {asset.altText && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5" title={asset.altText}>
                        Alt: {asset.altText}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                      <span>{asset.dimensions || 'Photo'}</span>
                      <span>
                        {asset.optimizedSize
                          ? `${formatBytes(asset.optimizedSize)} (optimized)`
                          : formatBytes(asset.size)}
                      </span>
                    </div>

                    {/* Tag Pills */}
                    {Array.isArray(asset.tags) && asset.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {asset.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      onClick={() => handleCopyUrl(asset.url, asset.id || '')}
                      variant={isCopied ? 'accent' : 'primary'}
                      size="sm"
                      className="flex-1 text-xs"
                      leftIcon={isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    >
                      {isCopied ? 'Copied' : 'Copy URL'}
                    </Button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(asset)}
                      className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition cursor-pointer"
                      title="Edit Details (Title, Description, Alt Text, Tags)"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStartReplace(asset)}
                      className="p-2 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition cursor-pointer"
                      title="Replace Image File"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStartDelete(asset)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                      title="Delete Image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <Card className="overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="p-3 w-16">Preview</th>
                  <th className="p-3">Title &amp; Alt Text</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Dimensions</th>
                  <th className="p-3">File Size</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredMedia.map((asset) => {
                  const isCopied = copiedId === asset.id;
                  const displayTitle = asset.title || asset.name;
                  return (
                    <tr key={asset.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="p-3">
                        <div
                          onClick={() => setPreviewAsset(asset)}
                          className="w-12 h-12 rounded-lg bg-slate-950 overflow-hidden cursor-pointer"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={asset.url}
                            alt={asset.altText || displayTitle}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white">{displayTitle}</div>
                        {asset.altText && <div className="text-[11px] text-slate-500 truncate max-w-xs">{asset.altText}</div>}
                      </td>
                      <td className="p-3">
                        <Badge variant="neutral">{asset.category || asset.folder || 'General'}</Badge>
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{asset.dimensions || 'N/A'}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">
                        {asset.optimizedSize ? formatBytes(asset.optimizedSize) : formatBytes(asset.size)}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{asset.uploadedAt}</td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Button
                            onClick={() => handleCopyUrl(asset.url, asset.id || '')}
                            variant={isCopied ? 'accent' : 'outline'}
                            size="sm"
                            className="text-xs"
                            leftIcon={isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          >
                            {isCopied ? 'Copied' : 'Copy'}
                          </Button>

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(asset)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition cursor-pointer"
                            title="Edit Details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStartReplace(asset)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition cursor-pointer"
                            title="Replace File"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStartDelete(asset)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* LIGHTBOX / IMAGE DETAILS MODAL */}
      {previewAsset && (
        <Modal
          isOpen={!!previewAsset}
          onClose={() => setPreviewAsset(null)}
          title={previewAsset.title || previewAsset.name}
          size="lg"
        >
          <div className="space-y-4">
            <div className="max-h-[55vh] overflow-hidden rounded-2xl bg-slate-950 flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewAsset.url}
                alt={previewAsset.altText || previewAsset.title || previewAsset.name}
                className="max-h-[50vh] w-auto object-contain mx-auto rounded-lg"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">Permanent Image URL:</span>
                <button
                  type="button"
                  onClick={() => handleCopyUrl(previewAsset.url, previewAsset.id || '')}
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy URL</span>
                </button>
              </div>

              <input
                type="text"
                readOnly
                value={previewAsset.url}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono select-all"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-slate-600 dark:text-slate-300">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Category</div>
                  <div className="font-semibold">{previewAsset.category || previewAsset.folder || 'General'}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Dimensions</div>
                  <div className="font-semibold">{previewAsset.dimensions || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">File Size</div>
                  <div className="font-semibold">
                    {previewAsset.optimizedSize ? formatBytes(previewAsset.optimizedSize) : formatBytes(previewAsset.size)}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Upload Date</div>
                  <div className="font-semibold">{previewAsset.uploadedAt}</div>
                </div>
              </div>

              {previewAsset.altText && (
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Alt Text (Accessibility &amp; SEO)</div>
                  <div className="font-medium text-slate-700 dark:text-slate-300 mt-0.5">{previewAsset.altText}</div>
                </div>
              )}

              {previewAsset.description && (
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Description</div>
                  <div className="text-slate-700 dark:text-slate-300 mt-0.5">{previewAsset.description}</div>
                </div>
              )}

              {Array.isArray(previewAsset.tags) && previewAsset.tags.length > 0 && (
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Tags</div>
                  <div className="flex flex-wrap gap-1">
                    {previewAsset.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Edit className="w-3.5 h-3.5" />}
                onClick={() => {
                  const target = previewAsset;
                  setPreviewAsset(null);
                  handleOpenEdit(target);
                }}
              >
                Edit Metadata
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPreviewAsset(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Copy className="w-4 h-4" />}
                  onClick={() => handleCopyUrl(previewAsset.url, previewAsset.id || '')}
                >
                  Copy URL to Clipboard
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* EDIT DETAILS MODAL */}
      {editAsset && (
        <Modal
          isOpen={!!editAsset}
          onClose={() => setEditAsset(null)}
          title="Edit Photographic Asset Details"
          size="md"
        >
          <form onSubmit={handleSaveDetails} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Image Title *
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Science Laboratory Physics Apparatus"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value as SchoolImageCategory)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {SCHOOL_IMAGE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Alt Text (For Accessibility &amp; Google Image SEO)
              </label>
              <input
                type="text"
                value={editAltText}
                onChange={(e) => setEditAltText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                placeholder="Descriptive alt text for screen readers"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. campus, physics, students, laboratory"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Description / Archival Notes
              </label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                placeholder="Context or notes about this photograph..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditAsset(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSavingDetails}>
                Save Metadata
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* DELETE CONFIRMATION & USAGE WARNING MODAL */}
      {deleteAsset && (
        <Modal
          isOpen={!!deleteAsset}
          onClose={() => setDeleteAsset(null)}
          title="Delete Photographic Asset"
          size="md"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Safe Deletion &amp; Reference Audit</h4>
                <p className="mt-1 leading-relaxed">
                  You are about to permanently delete &ldquo;<strong>{deleteAsset.title || deleteAsset.name}</strong>&rdquo;.
                </p>
              </div>
            </div>

            {isScanningUsage ? (
              <div className="flex items-center justify-center py-6 gap-2 text-xs text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>Scanning all school records for active image references...</span>
              </div>
            ) : deleteUsages.length > 0 ? (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 space-y-2 text-xs">
                <div className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Warning: This image is currently referenced in {deleteUsages.length} place(s)!</span>
                </div>
                <p className="text-rose-700 dark:text-rose-400">
                  Deleting this image will cause broken image displays on the following pages:
                </p>
                <ul className="space-y-1.5 pt-1">
                  {deleteUsages.map((u, i) => (
                    <li key={i} className="flex items-center justify-between text-[11px] bg-white dark:bg-slate-900 p-2 rounded-lg border border-rose-100 dark:border-rose-900/60">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{u.collection}:</span>{' '}
                        <span className="text-slate-600 dark:text-slate-400">{u.title}</span>
                      </div>
                      {u.pageUrl && (
                        <Link href={u.pageUrl} className="text-blue-600 hover:underline flex items-center gap-1 font-semibold">
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-slate-500 pt-1">
                  Tip: Use the &ldquo;Replace Image&rdquo; button instead to seamlessly update this photo without breaking references.
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Zero active references found. This photo is safe to delete.</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteAsset(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmDelete}
                isLoading={isDeleting}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                {deleteUsages.length > 0 ? 'Delete Anyway' : 'Confirm Delete'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
