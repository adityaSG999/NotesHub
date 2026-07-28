export default function robots() {
  const baseUrl = 'https://noteshub-beryl.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/auth/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
