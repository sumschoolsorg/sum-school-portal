import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sumschool.in';
  const lastModified = new Date();

  return [
    { url: baseUrl, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/academics`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/admissions`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/facilities`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/faculty`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/events`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/news`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/gallery`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/achievements`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/alumni`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/transport`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/results`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
