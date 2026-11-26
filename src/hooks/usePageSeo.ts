import { useEffect } from "react";
import { PageSeo, SITE_URL } from "@/lib/seo";

function setMeta(selector: string, content: string) {
  document.head.querySelector(selector)?.setAttribute("content", content);
}

// Keeps the head tags rendered at build time in sync during client-side
// navigation between city pages. Pass null to leave the head untouched.
export function usePageSeo(page: PageSeo | null) {
  const { title, description, path } = page ?? {};
  useEffect(() => {
    if (title === undefined || description === undefined || path === undefined) return;
    const url = SITE_URL + path;
    document.title = title;
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:url"]', url);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    document.head.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
  }, [title, description, path]);
}
