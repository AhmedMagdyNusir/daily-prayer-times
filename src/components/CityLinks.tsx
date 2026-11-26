import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cities } from "@/data/cities";
import { cityPath } from "@/lib/seo";

// Crawlable links to every city page; collapsed by default to keep the
// footer quiet (the links stay in the DOM for search engines).
export function CityLinks() {
  return (
    <details className="group pt-3 text-start">
      <summary className="mx-auto flex w-fit cursor-pointer list-none items-center gap-1 rounded-full px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&::-webkit-details-marker]:hidden">
        مواقيت الصلاة في مدن مصر
        <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
      </summary>
      <nav aria-label="مدن مصر">
        <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-4 lg:grid-cols-5">
          {cities.map((city) => (
            <li key={city.id}>
              <Link
                to={cityPath(city)}
                className="text-xs text-muted-foreground hover:text-primary hover:underline"
              >
                مواقيت الصلاة في {city.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
