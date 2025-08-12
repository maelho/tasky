# Metadata and SEO Implementation

This directory contains utilities and configurations for managing metadata, SEO, and social media optimization across the Tasky application.

## Overview

The metadata system is built around Next.js 14's App Router metadata API and provides:

- **Consistent SEO** across all pages
- **Open Graph** and **Twitter Card** optimization
- **Dynamic image generation** for social media
- **PWA manifest** support
- **Type-safe metadata** utilities

## Files

### `metadata.ts`

Core metadata utility functions for creating consistent metadata across the application.

#### Functions

##### `createMetadata(options)`
Creates comprehensive metadata object with SEO and social media optimization.

```typescript
const metadata = createMetadata({
  title: "Custom Page Title",
  description: "Page description for SEO",
  image: {
    url: "/custom-og-image.png",
    width: 1200,
    height: 630,
    alt: "Custom image description"
  },
  type: "article", // or "website"
  publishedTime: "2024-01-01T00:00:00.000Z",
  authors: ["Author Name"],
  noIndex: false,
  canonical: "/canonical-url"
});
```

##### `createPageMetadata(options)`
Simplified wrapper for standard pages.

```typescript
const metadata = createPageMetadata({
  title: "Dashboard",
  description: "Manage your projects and tasks",
  path: "/dashboard",
  noIndex: false
});
```

##### `createArticleMetadata(options)`
Specialized wrapper for article/blog content.

```typescript
const metadata = createArticleMetadata({
  title: "How to Use Tasky",
  description: "A comprehensive guide to project management",
  path: "/blog/how-to-use-tasky",
  publishedTime: "2024-01-01T00:00:00.000Z",
  authors: ["John Doe"]
});
```

## Usage Examples

### Root Layout (`app/layout.tsx`)
```typescript
import { defaultMetadata } from "~/lib/metadata";

export const metadata = defaultMetadata;
```

### Dynamic Page Metadata
```typescript
import { createPageMetadata } from "~/lib/metadata";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const board = await getBoard(id);
  
  return createPageMetadata({
    title: board.title,
    description: `Manage tasks on ${board.title}`,
    path: `/board/${id}`
  });
}
```

### Static Page Metadata
```typescript
import { createPageMetadata } from "~/lib/metadata";

export const metadata = createPageMetadata({
  title: "About Us",
  description: "Learn more about Tasky and our mission",
  path: "/about"
});
```

## Open Graph Images

The application includes dynamic Open Graph image generation:

### Global Images
- `app/opengraph-image.tsx` - Main site Open Graph image
- `app/twitter-image.tsx` - Twitter-optimized image

### Dynamic Images
Create page-specific Open Graph images:

```typescript
// app/board/[id]/opengraph-image.tsx
import { ImageResponse } from "next/og";

export default async function Image({ params }) {
  const board = await getBoard(params.id);
  
  return new ImageResponse(
    (
      <div style={{ /* styling */ }}>
        <h1>{board.title}</h1>
        <p>{board.description}</p>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

## SEO Features

### Automatic Generation
- **Meta titles** with consistent formatting
- **Meta descriptions** for search engines
- **Open Graph** tags for social sharing
- **Twitter Card** metadata
- **Canonical URLs** to prevent duplicate content
- **Robots directives** for crawler control

### Social Media Optimization
- **1200x630px** Open Graph images (optimal for Facebook, LinkedIn)
- **Twitter Card** support with proper dimensions
- **Alt text** for accessibility and SEO
- **Rich media** metadata for enhanced sharing

### Technical SEO
- **Structured metadata** with proper hierarchy
- **Mobile-friendly** configuration
- **PWA manifest** for app-like experience
- **Robots.txt** for crawler guidance
- **Sitemap** support (add `sitemap.xml` generation as needed)

## Environment Requirements

The metadata system requires the following environment variables:

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

This is used as the `metadataBase` for resolving relative URLs in metadata.

## Best Practices

### Page Metadata
1. **Always use** the metadata utilities instead of raw metadata objects
2. **Include descriptive titles** that follow the pattern: "Page Name | Site Name"
3. **Write compelling descriptions** between 120-160 characters
4. **Set noIndex: true** for private/sensitive pages
5. **Use canonical URLs** to prevent duplicate content issues

### Images
1. **Optimize images** to 1200x630px for Open Graph
2. **Include alt text** for accessibility
3. **Use descriptive filenames** for better SEO
4. **Generate dynamic images** for content-specific sharing

### Performance
1. **Static generation** is preferred over dynamic when possible
2. **Cache metadata** for frequently accessed content
3. **Minimize API calls** in metadata generation functions
4. **Use fallbacks** for error cases

## Troubleshooting

### Common Issues

#### "metadataBase property not set" Error
Ensure `NEXT_PUBLIC_APP_URL` is properly configured in your environment variables.

#### Images Not Loading
1. Check image paths are correct relative to `public/`
2. Verify `metadataBase` is set properly
3. Ensure image files exist and are accessible

#### Social Media Preview Not Updating
1. Use Facebook's [Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Use Twitter's [Card Validator](https://cards-dev.twitter.com/validator)
3. Clear social media caches by re-scraping the URL

#### SEO Issues
1. Verify robots.txt is properly configured
2. Check that pages aren't accidentally set to `noIndex: true`
3. Ensure canonical URLs are correct and accessible
4. Use Google Search Console to monitor crawling issues

## Future Enhancements

- [ ] **Sitemap generation** for better crawling
- [ ] **JSON-LD structured data** for rich snippets
- [ ] **Multi-language support** for international SEO
- [ ] **Dynamic favicon generation** based on content
- [ ] **Performance monitoring** for metadata generation
- [ ] **A/B testing** for different metadata strategies

## Related Files

- `public/site.webmanifest` - PWA configuration
- `public/robots.txt` - Search engine crawler directives
- `app/opengraph-image.tsx` - Global Open Graph image generator
- `app/twitter-image.tsx` - Global Twitter image generator
- `src/config/site.ts` - Site configuration constants