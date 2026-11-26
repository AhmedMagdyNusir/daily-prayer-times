import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";
import { cities } from "./src/data/cities";
import {
  citySeo,
  homeSeo,
  PageSeo,
  renderFallbackContent,
  renderHeadTags,
  renderSitemap,
} from "./src/lib/seo";

const HEAD_BLOCK = /<!--seo:head-->[\s\S]*?<!--\/seo:head-->/;
const CONTENT_BLOCK = /<!--seo:content-->[\s\S]*?<!--\/seo:content-->/;

const headBlock = (page: PageSeo) => `<!--seo:head-->${renderHeadTags(page)}<!--/seo:head-->`;
const contentBlock = (page: PageSeo) =>
  `<!--seo:content-->${renderFallbackContent(page)}<!--/seo:content-->`;

// Fills the SEO markers in index.html, then after the build writes a static
// copy per city (dist/<city>.html) and sitemap.xml, so crawlers get
// city-specific titles and content without running JavaScript.
function seoPages(): Plugin {
  let outDir = "dist";
  return {
    name: "seo-pages",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    transformIndexHtml(html) {
      return html
        .replace("<!-- seo:head -->", headBlock(homeSeo()))
        .replace("<!-- seo:content -->", contentBlock(homeSeo()));
    },
    closeBundle() {
      const indexPath = path.join(outDir, "index.html");
      if (!fs.existsSync(indexPath)) return;
      const html = fs.readFileSync(indexPath, "utf-8");

      // <city>.html is served at /<city> (Vercel cleanUrls, vite preview)
      for (const city of cities) {
        const page = citySeo(city);
        fs.writeFileSync(
          path.join(outDir, `${city.id}.html`),
          html.replace(HEAD_BLOCK, headBlock(page)).replace(CONTENT_BLOCK, contentBlock(page)),
        );
      }

      const today = new Date().toISOString().slice(0, 10);
      fs.writeFileSync(path.join(outDir, "sitemap.xml"), renderSitemap(today));
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), seoPages(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
