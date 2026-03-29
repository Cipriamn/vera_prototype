import { useAuthStore } from "@/stores/authStore";
import { api } from "@/utils/api";
import type { Site } from "@vera/shared";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newSiteName, setNewSiteName] = useState("");
  const [createSiteError, setCreateSiteError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadSites();
  }, []);

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
      const response = await api.post("/sites", { name: newSiteName });
      const newSite = response.data.data;
      setSites([...sites, newSite]);
      setShowCreateModal(false);
      setNewSiteName("");
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Create New Site
            </h3>
            <form onSubmit={handleCreateSite}>
              <div className="mb-4">
                <label
                  htmlFor="siteName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Site Name
                </label>
                <input
                  id="siteName"
                  type="text"
                  value={newSiteName}
                  onChange={(e) => {
                    setNewSiteName(e.target.value);
                    setCreateSiteError(null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="My Awesome Site"
                  autoFocus
                />
                {createSiteError && (
                  <p className="mt-2 text-sm text-red-600" role="alert">
                    {createSiteError}
                  </p>
                )}
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewSiteName("");
                    setCreateSiteError(null);
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newSiteName.trim()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {isCreating ? "Creating..." : "Create Site"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
