import { Link, useNavigate } from 'react-router-dom';
import { useBuilderStore } from '@/stores/builderStore';

export default function Toolbar() {
  const navigate = useNavigate();
  const {
    site,
    currentPage,
    isSaving,
    hasUnsavedChanges,
    savePage,
    publishSite,
    unpublishSite,
  } = useBuilderStore();

  const handleSave = async () => {
    await savePage();
  };

  const handlePublish = async () => {
    await savePage();
    await publishSite();
  };

  const handleUnpublish = async () => {
    await unpublishSite();
  };

  const handlePreview = () => {
    if (site) {
      window.open(`/s/${site.slug}`, '_blank');
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <Link
          to="/dashboard"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </Link>

        <div className="h-6 w-px bg-gray-200" />

        <div>
          <h1 className="text-sm font-semibold text-gray-900">
            {site?.name || 'Loading...'}
          </h1>
          <p className="text-xs text-gray-500">
            Editing: {currentPage?.name || 'Loading...'}
          </p>
        </div>
      </div>

      {/* Center section - Page selector */}
      {site?.pages && site.pages.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Pages:</span>
          <select
            value={currentPage?.id || ''}
            onChange={(e) => {
              const pageId = e.target.value;
              navigate(`/builder/${site.id}/${pageId}`);
            }}
            className="text-sm border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {site.pages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.name} {page.isHomepage ? '(Home)' : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Save status */}
        <div className="flex items-center gap-2 text-sm">
          {isSaving ? (
            <span className="text-gray-500 flex items-center gap-1">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving...
            </span>
          ) : hasUnsavedChanges ? (
            <span className="text-amber-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-amber-500 rounded-full" />
              Unsaved changes
            </span>
          ) : (
            <span className="text-green-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </span>
          )}
        </div>

        <div className="h-6 w-px bg-gray-200" />

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={isSaving || !hasUnsavedChanges}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save
        </button>

        {/* Preview button */}
        <button
          onClick={handlePreview}
          disabled={!site?.isPublished}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title={!site?.isPublished ? 'Publish site to preview' : 'Preview site'}
        >
          Preview
        </button>

        {/* Publish/Unpublish button */}
        {site?.isPublished ? (
          <button
            onClick={handleUnpublish}
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Unpublish
          </button>
        ) : (
          <button
            onClick={handlePublish}
            className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Publish
          </button>
        )}
      </div>
    </header>
  );
}
