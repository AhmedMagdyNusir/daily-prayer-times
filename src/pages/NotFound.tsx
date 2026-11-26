import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);

    // The host serves the app for unknown paths, so keep them out of search results
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const created = !robots;
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    const previousRobots = robots.content;
    const previousTitle = document.title;
    robots.content = "noindex";
    document.title = "الصفحة غير موجودة | مواقيت الصلاة";
    return () => {
      if (created) robots.remove();
      else robots.content = previousRobots;
      document.title = previousTitle;
    };
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">٤٠٤</h1>
        <p className="mb-4 text-xl text-muted-foreground">الصفحة غير موجودة</p>
        <Link to="/" className="text-primary underline hover:text-primary/90">
          العودة إلى مواقيت الصلاة
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
