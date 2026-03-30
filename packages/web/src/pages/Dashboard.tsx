import { useAuthStore } from "@/stores/authStore";
import { api } from "@/utils/api";
import type { Site, Template } from "@vera/shared";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type TemplateSummary = Pick<
  Template,
  "id" | "name" | "description" | "thumbnail" | "category"
>;

const CATEGORY_STYLE: Record<
  Template["category"],
  { gradient: string; label: string; dot: string }
> = {
  "student-house": {
    gradient: "from-violet-600 via-purple-700 to-indigo-950",
    label: "Student life",
    dot: "rgba(255,255,255,0.14)",
  },
  "sports-team": {
    gradient: "from-emerald-600 via-teal-700 to-cyan-950",
    label: "Sports",
    dot: "rgba(255,255,255,0.14)",
  },
  event: {
    gradient: "from-amber-500 via-orange-600 to-rose-900",
    label: "Event",
    dot: "rgba(255,255,255,0.16)",
  },
  association: {
    gradient: "from-sky-600 via-blue-700 to-indigo-950",
    label: "Organization",
    dot: "rgba(255,255,255,0.14)",
  },
};

function TemplatePreview({
  category,
  thumbnail,
}: {
  category: Template["category"];
  thumbnail: string;
}) {
  const [imgOk, setImgOk] = useState(true);
  const style = CATEGORY_STYLE[category];
  const dotGrid = {
    backgroundImage: `radial-gradient(circle at 1px 1px, ${style.dot} 1px, transparent 0)`,
    backgroundSize: "18px 18px",
  } as const;

  return (
    <div
      className={`relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br ${style.gradient}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={dotGrid}
        aria-hidden
      />
      {imgOk ? (
        <>
          <img
            src={thumbnail}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            onError={() => setImgOk(false)}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/5"
            aria-hidden
          />
        </>
      ) : (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-start justify-end p-4">
          <span className="mb-2 h-1 w-8 rounded-full bg-white/35" aria-hidden />
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
            {style.label}
          </p>
        </div>
      )}
    </div>
  );
}

function TemplateSkeleton() {
  return (
    <div
      className="rounded-2xl border border-gray-100 bg-gray-50/80 p-1 animate-pulse"
      aria-hidden
    >
      <div className="aspect-[16/10] rounded-xl bg-gradient-to-br from-gray-200 to-gray-300" />
      <div className="space-y-2 p-3 pt-2.5">
        <div className="h-4 w-2/3 rounded-md bg-gray-200" />
        <div className="h-3 w-full rounded bg-gray-200/90" />
        <div className="h-3 w-4/5 rounded bg-gray-200/90" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newSiteName, setNewSiteName] = useState("");
  const [createSiteError, setCreateSiteError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [templatesList, setTemplatesList] = useState<TemplateSummary[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templatesError, setTemplatesError] = useState(false);
  /** `null` = blank site (no template). */
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    loadSites();
  }, []);

  useEffect(() => {
    if (!showCreateModal) return;

    let cancelled = false;
    setTemplatesLoading(true);
    setTemplatesError(false);
    (async () => {
      try {
        const response = await api.get<{ data: TemplateSummary[] }>(
          "/templates",
        );
        if (!cancelled) {
          setTemplatesList(response.data.data ?? []);
        }
      } catch {
        if (!cancelled) {
          setTemplatesError(true);
        }
      } finally {
        if (!cancelled) {
          setTemplatesLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [showCreateModal]);

  const loadSites = async () => {
    try {
      const response = await api.get("/sites");
      setSites(response.data.data || []);
    } catch (error) {
      console.error("Failed to load sites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteName.trim()) return;

    setIsCreating(true);
    setCreateSiteError(null);
    try {
      const payload: { name: string; templateId?: string } = {
        name: newSiteName.trim(),
      };
      if (selectedTemplateId) {
        payload.templateId = selectedTemplateId;
      }
      const response = await api.post("/sites", payload);
      const newSite = response.data.data;
      setSites([...sites, newSite]);
      setShowCreateModal(false);
      setNewSiteName("");
      setSelectedTemplateId(null);
      setCreateSiteError(null);
      navigate(`/builder/${newSite.id}`);
    } catch (error) {
      console.error("Failed to create site:", error);
      setCreateSiteError(
        error instanceof Error ? error.message : "Failed to create site",
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteSite = async (siteId: string) => {
    if (!confirm("Are you sure you want to delete this site?")) return;

    try {
      await api.delete(`/sites/${siteId}`);
      setSites(sites.filter((s) => s.id !== siteId));
    } catch (error) {
      console.error("Failed to delete site:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Vera Site Builder
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Your Sites</h2>
          <button
            onClick={() => {
              setCreateSiteError(null);
              setSelectedTemplateId(null);
              setShowCreateModal(true);
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Create New Site
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your sites...</p>
          </div>
        ) : sites.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No sites yet
            </h3>
            <p className="mt-2 text-gray-600">
              Get started by creating your first website.
            </p>
            <button
              onClick={() => {
                setCreateSiteError(null);
                setSelectedTemplateId(null);
                setShowCreateModal(true);
              }}
              className="mt-6 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Create Your First Site
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => (
              <div
                key={site.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-40 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white/20">
                    {site.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{site.name}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        site.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {site.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Updated {new Date(site.updatedAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      to={`/builder/${site.id}`}
                      className="flex-1 text-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                    >
                      Edit
                    </Link>
                    {site.isPublished && (
                      <Link
                        to={`/s/${site.slug}`}
                        target="_blank"
                        className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        View
                      </Link>
                    )}
                    <button
                      onClick={() => handleDeleteSite(site.id)}
                      className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create site modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-900/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl shadow-2xl shadow-slate-900/10 ring-1 ring-slate-200/80 max-w-3xl w-full mx-auto my-8 max-h-[min(90vh,calc(100vh-2rem))] overflow-y-auto">
            <div className="p-6 sm:p-8 border-b border-slate-100">
              <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                Create New Site
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Name your site, then pick a starter layout or begin empty.
              </p>
            </div>
            <form onSubmit={handleCreateSite} className="p-6 sm:p-8 pt-6">
              <div className="mb-8">
                <label
                  htmlFor="siteName"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Site name
                </label>
                <input
                  id="siteName"
                  type="text"
                  value={newSiteName}
                  onChange={(e) => {
                    setNewSiteName(e.target.value);
                    setCreateSiteError(null);
                  }}
                  className="w-full px-4 py-2.5 text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-shadow"
                  placeholder="e.g. Oak House, Spring Gala 2026"
                  autoFocus
                />
                {createSiteError && (
                  <p className="mt-2 text-sm text-red-600" role="alert">
                    {createSiteError}
                  </p>
                )}
              </div>

              <div className="mb-8">
                <div className="flex items-baseline justify-between gap-4 mb-4">
                  <div>
                    <span className="block text-sm font-medium text-slate-800">
                      Starter template
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      Pre-built pages and styles you can edit anytime
                    </span>
                  </div>
                </div>
                {templatesError && !templatesLoading && (
                  <div className="mb-4 rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
                    Could not load templates. You can still create a blank site.
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedTemplateId(null)}
                    className={`group text-left rounded-2xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 overflow-hidden ${
                      selectedTemplateId === null
                        ? "border-primary-500 bg-primary-50/40 shadow-md shadow-primary-900/5 ring-2 ring-primary-500/20"
                        : "border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5"
                    }`}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-200">
                      <div
                        className="absolute inset-0 opacity-[0.35]"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.5) 1px, transparent 0)",
                          backgroundSize: "14px 14px",
                        }}
                        aria-hidden
                      />
                      <div className="absolute inset-4 sm:inset-5 rounded-xl border-2 border-dashed border-slate-300/90 bg-white/70 shadow-inner" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-slate-500">
                        <svg
                          className="w-10 h-10 text-slate-400 group-hover:text-primary-600 transition-colors duration-200"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.25}
                          aria-hidden
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Blank canvas
                        </span>
                      </div>
                    </div>
                    <div className="px-4 py-3.5 bg-white/80 border-t border-slate-100">
                      <p className="font-semibold text-slate-900 text-sm">
                        Start from scratch
                      </p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        One empty homepage — drag blocks in from the palette
                      </p>
                    </div>
                  </button>
                  {templatesLoading ? (
                    <>
                      <TemplateSkeleton />
                      <TemplateSkeleton />
                      <TemplateSkeleton />
                    </>
                  ) : (
                    templatesList.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTemplateId(t.id)}
                        className={`group text-left rounded-2xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 overflow-hidden ${
                          selectedTemplateId === t.id
                            ? "border-primary-500 bg-primary-50/40 shadow-md shadow-primary-900/5 ring-2 ring-primary-500/20"
                            : "border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5"
                        }`}
                      >
                        <TemplatePreview
                          category={t.category}
                          thumbnail={t.thumbnail}
                        />
                        <div className="px-4 py-3.5 bg-white/80 border-t border-slate-100">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                              {CATEGORY_STYLE[t.category].label}
                            </span>
                          </div>
                          <p className="font-semibold text-slate-900 text-sm">
                            {t.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                            {t.description}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewSiteName("");
                    setSelectedTemplateId(null);
                    setCreateSiteError(null);
                  }}
                  className="px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newSiteName.trim()}
                  className="px-5 py-2.5 text-sm font-semibold bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-45 disabled:cursor-not-allowed shadow-sm shadow-primary-900/20"
                >
                  {isCreating ? "Creating…" : "Create site"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
