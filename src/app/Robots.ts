import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/directory', '/admin', '/api/'],
      },
    ],
    sitemap: 'https://achieversnashik.in/sitemap.xml',
    host: 'https://achieversnashik.in',
  };
}