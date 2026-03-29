import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/utils/api';
import type { Site, Page } from '@vera/shared';
import { ElementRenderer } from '@/components/preview/ElementRenderer';

export default function Preview() {
  const { siteSlug, pageSlug } = useParams<{ siteSlug: string; pageSlug?: string }>();
  const [site, setSite] = useState<Site | null>(null);
  const [page, setPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSite();
  }, [siteSlug, pageSlug]);

  const loadSite = async () => {
    if (!siteSlug) return;

    setIsLoading(true);
    setError(null);

    try {
      const endpoint = pageSlug
        ? `/public/sites/${siteSlug}/${pageSlug}`
        : `/public/sites/${siteSlug}`;
      const response = await api.get(endpoint);
      const data = response.data.data;

      setSite(data.site);
      setPage(data.page);
    } catch (err) {
      setError('Site not found or not published');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !site || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Site Not Found</h1>
          <p className="text-gray-600 mb-4">
            {error || 'This site does not exist or is not published.'}
          </p>
          <Link to="/" className="text-primary-600 hover:underline">
            Go to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: site.settings?.fontFamily || 'Inter, sans-serif',
        '--primary-color': site.settings?.primaryColor || '#3b82f6',
        '--secondary-color': site.settings?.secondaryColor || '#1f2937',
      } as React.CSSProperties}
    >
      {/* Navigation for multi-page sites */}
      {site.pages && site.pages.length > 1 && (
        <nav className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link to={`/s/${siteSlug}`} className="font-semibold text-gray-900">
                {site.name}
              </Link>
              <div className="flex gap-4">
                {site.pages.map((p) => (
                  <Link
                    key={p.id}
                    to={`/s/${siteSlug}/${p.slug}`}
                    className={`text-sm ${
                      p.id === page.id
                        ? 'text-primary-600 font-medium'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {p.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Page content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {page.elements.map((element) => (
          <ElementRenderer
            key={element.id}
            element={element}
            siteSlug={siteSlug}
            pages={site.pages}
          />
        ))}
      </main>

      {/* Powered by footer */}
      <footer className="text-center py-4 text-sm text-gray-500">
        Built with <span className="text-primary-600">Vera Site Builder</span>
      </footer>
    </div>
  );
}
