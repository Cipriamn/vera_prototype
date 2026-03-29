import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBuilderStore } from '@/stores/builderStore';

export default function Toolbar() {
  const navigate = useNavigate();
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [isCreatingPage, setIsCreatingPage] = useState(false);

  const {
    site,
    currentPage,
    isSaving,
    hasUnsavedChanges,
    savePage,
    createPage,
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

  const handleCreatePage = async () => {
    if (!newPageName.trim() || !site) return;

    setIsCreatingPage(true);
    const pageId = await createPage(newPageName.trim());
    setIsCreatingPage(false);

    if (pageId) {
      setShowNewPageModal(false);
      setNewPageName('');
      navigate(`/builder/${site.id}/${pageId}`);
    }
  };

  return (
    <>
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
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Pages:</span>
        {site?.pages && site.pages.length > 0 && (
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
        )}
        <button
          onClick={() => setShowNewPageModal(true)}
          className="flex items-center gap-1 px-2 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded-md"
          title="Add new page"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Page</span>
        </button>
      </div>

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

      {/* New Page Modal */}
      {showNewPageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Page</h2>
            <div className="mb-4">
              <label htmlFor="pageName" className="block text-sm font-medium text-gray-700 mb-1">
                Page Name
              </label>
              <input
                type="text"
                id="pageName"
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreatePage();
                  if (e.key === 'Escape') {
                    setShowNewPageModal(false);
                    setNewPageName('');
                  }
                }}
                placeholder="e.g., About, Contact, Gallery"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowNewPageModal(false);
                  setNewPageName('');
                }}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePage}
                disabled={!newPageName.trim() || isCreatingPage}
                className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingPage ? 'Creating...' : 'Create Page'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
