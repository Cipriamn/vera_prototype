import { useBuilderStore } from "@/stores/builderStore";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Toolbar() {
  const navigate = useNavigate();
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [isCreatingPage, setIsCreatingPage] = useState(false);

  const [showPageSettingsModal, setShowPageSettingsModal] = useState(false);
  const [pageName, setPageName] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [pageMetaTitle, setPageMetaTitle] = useState("");
  const [pageMetaDescription, setPageMetaDescription] = useState("");
  const [pageIsHomepage, setPageIsHomepage] = useState(false);
  const [pageSettingsError, setPageSettingsError] = useState<string | null>(
    null,
  );
  const [isSavingPageSettings, setIsSavingPageSettings] = useState(false);

  const {
    site,
    currentPage,
    isSaving,
    hasUnsavedChanges,
    savePage,
    createPage,
    deletePage,
    updatePageDetails,
    publishSite,
    unpublishSite,
  } = useBuilderStore();

  useEffect(() => {
    if (showPageSettingsModal && currentPage) {
      setPageName(currentPage.name);
      setPageSlug(currentPage.slug);
      setPageMetaTitle(currentPage.metaTitle ?? "");
      setPageMetaDescription(currentPage.metaDescription ?? "");
      setPageIsHomepage(currentPage.isHomepage);
      setPageSettingsError(null);
    }
  }, [showPageSettingsModal, currentPage?.id]);

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
      window.open(`/s/${site.slug}`, "_blank");
    }
  };

  const handleCreatePage = async () => {
    if (!newPageName.trim() || !site) return;

    setIsCreatingPage(true);
    const pageId = await createPage(newPageName.trim());
    setIsCreatingPage(false);

    if (pageId) {
      setShowNewPageModal(false);
      setNewPageName("");
      navigate(`/builder/${site.id}/${pageId}`);
    }
  };

  const pageCount = site?.pages?.length ?? 0;
  const onlyPage = pageCount <= 1;

  const handleSavePageSettings = async () => {
    if (!pageName.trim()) {
      setPageSettingsError("Page name is required");
      return;
    }
    if (!pageSlug.trim()) {
      setPageSettingsError("URL slug is required");
      return;
    }

    setIsSavingPageSettings(true);
    setPageSettingsError(null);
    const result = await updatePageDetails({
      name: pageName.trim(),
      slug: pageSlug.trim(),
      metaTitle: pageMetaTitle,
      metaDescription: pageMetaDescription,
      isHomepage: onlyPage ? true : pageIsHomepage,
    });
    setIsSavingPageSettings(false);

    if (result.ok) {
      setShowPageSettingsModal(false);
    } else {
      setPageSettingsError(result.error);
    }
  };

  const handleDeletePage = async () => {
    if (!site || !currentPage || onlyPage) return;
    if (!confirm(`Delete page "${currentPage.name}"? This cannot be undone.`)) {
      return;
    }

    const deletedId = currentPage.id;
    const result = await deletePage(deletedId);
    if (!result.ok) {
      setPageSettingsError(result.error);
      return;
    }

    setShowPageSettingsModal(false);
    const nextSite = useBuilderStore.getState().site;
    const nextPage =
      nextSite?.pages?.find((p) => p.isHomepage) ?? nextSite?.pages?.[0];
    if (nextPage) {
      navigate(`/builder/${site.id}/${nextPage.id}`);
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
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </Link>

          <div className="h-6 w-px bg-gray-200" />

          <div>
            <h1 className="text-sm font-semibold text-gray-900">
              {site?.name || "Loading..."}
            </h1>
            <p className="text-xs text-gray-500">
              Editing: {currentPage?.name || "Loading..."}
            </p>
          </div>
        </div>

        {/* Center section - Page selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Pages:</span>
          {site?.pages && site.pages.length > 0 && (
            <select
              value={currentPage?.id || ""}
              onChange={(e) => {
                const pageId = e.target.value;
                navigate(`/builder/${site.id}/${pageId}`);
              }}
              className="text-sm border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {site.pages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.name} {page.isHomepage ? "(Home)" : ""}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={() => setShowPageSettingsModal(true)}
            disabled={!currentPage}
            className="flex items-center gap-1 px-2 py-1 text-sm text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Page name, URL, SEO, delete"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Page settings</span>
          </button>
          <button
            onClick={() => setShowNewPageModal(true)}
            className="flex items-center gap-1 px-2 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded-md"
            title="Add new page"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
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
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
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
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
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
            title={
              !site?.isPublished ? "Publish site to preview" : "Preview site"
            }
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

      {/* Page settings modal */}
      {showPageSettingsModal && currentPage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Page settings
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="editPageName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Page name
                </label>
                <input
                  id="editPageName"
                  type="text"
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="editPageSlug"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  URL slug
                </label>
                <input
                  id="editPageSlug"
                  type="text"
                  value={pageSlug}
                  onChange={(e) => setPageSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Published URL: /s/{site?.slug}/{pageSlug || "…"}
                </p>
              </div>

              <div>
                <label
                  htmlFor="editMetaTitle"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Meta title (SEO)
                </label>
                <input
                  id="editMetaTitle"
                  type="text"
                  value={pageMetaTitle}
                  onChange={(e) => setPageMetaTitle(e.target.value)}
                  placeholder="Optional; defaults to page name in preview"
                  maxLength={200}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="editMetaDescription"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Meta description (SEO)
                </label>
                <textarea
                  id="editMetaDescription"
                  value={pageMetaDescription}
                  onChange={(e) => setPageMetaDescription(e.target.value)}
                  placeholder="Short summary for search and sharing"
                  rows={3}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyPage ? true : pageIsHomepage}
                  disabled={onlyPage}
                  onChange={(e) => setPageIsHomepage(e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Homepage</span>
              </label>
              {onlyPage && (
                <p className="text-xs text-gray-500">
                  The only page in this site is always the homepage.
                </p>
              )}
            </div>

            {pageSettingsError && (
              <p className="mt-3 text-sm text-red-600" role="alert">
                {pageSettingsError}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPageSettingsModal(false);
                    setPageSettingsError(null);
                  }}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePageSettings}
                  disabled={isSavingPageSettings}
                  className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {isSavingPageSettings ? "Saving…" : "Save"}
                </button>
              </div>
              {!onlyPage && (
                <button
                  type="button"
                  onClick={handleDeletePage}
                  className="w-full px-4 py-2 text-sm border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                >
                  Delete this page
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Page Modal */}
      {showNewPageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Create New Page
            </h2>
            <div className="mb-4">
              <label
                htmlFor="pageName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Page Name
              </label>
              <input
                type="text"
                id="pageName"
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreatePage();
                  if (e.key === "Escape") {
                    setShowNewPageModal(false);
                    setNewPageName("");
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
                  setNewPageName("");
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
                {isCreatingPage ? "Creating..." : "Create Page"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
