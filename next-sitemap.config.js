/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://grit.onebuffalolabs.com',
  generateRobotsTxt: true,
  trailingSlash: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  exclude: ['/apple-icon.png', '/icon.png', '/icon.svg', '/favicon-96x96.png', '/manifest.json'],
  outDir: './out',
};
