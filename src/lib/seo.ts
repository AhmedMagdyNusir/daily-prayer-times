// SEO metadata shared by the app (client-side head updates) and the build
// (vite.config.ts prerenders a static page per city). Uses relative imports
// only, since vite.config.ts does not resolve the "@" alias.
import { cities, City } from "../data/cities";

export const SITE_URL = "https://daily-prayer-clock.vercel.app";
export const SITE_NAME = "مواقيت الصلاة";
const OG_IMAGE = `${SITE_URL}/og-image.png`;

export interface PageSeo {
  path: string;
  title: string;
  description: string;
  heading: string;
  city?: City;
}

export function cityPath(city: City): string {
  return `/${city.id}`;
}

export function homeSeo(): PageSeo {
  return {
    path: "/",
    title: "مواقيت الصلاة اليوم في مصر | مواعيد الأذان بدقة",
    description:
      "مواقيت الصلاة اليوم في القاهرة والإسكندرية وكل محافظات مصر: الفجر والشروق والظهر والعصر والمغرب والعشاء، مع عدّاد تنازلي للأذان القادم والتاريخ الهجري، حسب الهيئة المصرية العامة للمساحة.",
    heading: "مواقيت الصلاة اليوم في مصر",
  };
}

export function citySeo(city: City): PageSeo {
  return {
    path: cityPath(city),
    title: `مواقيت الصلاة في ${city.name} اليوم | مواعيد الأذان`,
    description: `مواعيد الصلاة اليوم في ${city.name} (محافظة ${city.governorate}): الفجر والشروق والظهر والعصر والمغرب والعشاء، مع عدّاد تنازلي للأذان القادم والتاريخ الهجري، حسب الهيئة المصرية العامة للمساحة.`,
    heading: `مواقيت الصلاة في ${city.name}`,
    city,
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function structuredData(page: PageSeo): object {
  const url = SITE_URL + page.path;
  const app = {
    "@type": "WebApplication",
    "@id": `${SITE_URL}/#app`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    description: homeSeo().description,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Any",
    inLanguage: "ar",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EGP" },
  };
  if (!page.city) return { "@context": "https://schema.org", ...app };

  return {
    "@context": "https://schema.org",
    "@graph": [
      app,
      {
        "@type": "WebPage",
        url,
        name: page.title,
        description: page.description,
        inLanguage: "ar",
        isPartOf: { "@id": `${SITE_URL}/#app` },
        about: {
          "@type": "City",
          name: page.city.name,
          containedInPlace: { "@type": "AdministrativeArea", name: `محافظة ${page.city.governorate}` },
          geo: {
            "@type": "GeoCoordinates",
            latitude: page.city.lat,
            longitude: page.city.lng,
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: page.city.name, item: url },
        ],
      },
    ],
  };
}

// <head> tags for a page
export function renderHeadTags(page: PageSeo): string {
  const url = SITE_URL + page.path;
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const jsonLd = JSON.stringify(structuredData(page)).replace(/</g, "\\u003c");
  return `<title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:locale" content="ar_EG" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${SITE_NAME}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />
    <script type="application/ld+json">${jsonLd}</script>`;
}

// Static content inside #root, readable without JavaScript. React replaces
// it on load.
export function renderFallbackContent(page: PageSeo): string {
  const links = cities
    .map((c) => `<li><a href="${cityPath(c)}">مواقيت الصلاة في ${escapeHtml(c.name)}</a></li>`)
    .join("");
  return `<main>
      <h1>${escapeHtml(page.heading)}</h1>
      <p>${escapeHtml(page.description)}</p>
      <h2>مواقيت الصلاة في مدن مصر</h2>
      <ul>${links}</ul>
    </main>`;
}

export function renderSitemap(lastmod: string): string {
  const urls = [homeSeo(), ...cities.map(citySeo)]
    .map(
      (page) =>
        `  <url><loc>${SITE_URL}${page.path}</loc><lastmod>${lastmod}</lastmod><changefreq>daily</changefreq><priority>${page.city ? "0.8" : "1.0"}</priority></url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}
