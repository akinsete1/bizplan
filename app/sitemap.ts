import { MetadataRoute } from 'next';
import { BLOG_POSTS } from '@/lib/blogData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bizplannigeria.com';

  // Core routes
  const routes = [
    '',
    '/pricing',
    '/templates',
    '/blog',
    '/login',
    '/register',
    '/tools/grant-builder',
    '/tools/loan-builder',
    '/tools/calculator',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as any,
    priority: route === '' ? 1 : 0.8,
  }));

  // Blog posts
  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt).toISOString(),
    changeFrequency: 'monthly' as any,
    priority: 0.6,
  }));

  return [...routes, ...blogRoutes];
}
