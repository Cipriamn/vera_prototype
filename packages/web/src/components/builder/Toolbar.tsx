import type { BuilderTheme } from "@/hooks/useBuilderTheme";
import { useBuilderStore } from "@/stores/builderStore";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type ToolbarProps = {
  theme: BuilderTheme;
  onToggleTheme: () => void;
};

export default function Toolbar({ theme, onToggleTheme }: ToolbarProps) {
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
      <header className="min-h-[3.25rem] shrink-0 flex items-center justify-between gap-3 px-4 md:px-6 py-2 border-b border-builder-border bg-builder-surface/80 backdrop-blur-md">
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <Link
            to="/dashboard"
            className="text-builder-text-muted hover:text-builder-text flex items-center gap-2 shrink-0 rounded-lg px-3 py-2 -ml-1 transition-colors hover:bg-builder-surface-muted"
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
            <span className="text-sm font-medium hidden sm:inline">Back</span>
          </Link>

          <div className="h-6 w-px bg-builder-border shrink-0" />

          <div className="min-w-0">
            <h1 className="text-sm font-semibold font-display text-builder-text truncate">
              {site?.name || "Loading..."}
            </h1>
            <p className="text-xs text-builder-text-muted truncate">
              {currentPage?.name || "Loading..."}
            </p>
          </div>
        </div>

        <div className="flex flex-nowrap items-center gap-2.5 md:gap-3 shrink-0">
          <span className="text-xs text-builder-text-muted hidden lg:inline pr-0.5 shrink-0">
            Pages
          </span>
          {site?.pages && site.pages.length > 0 && (
            <select
              value={currentPage?.id || ""}
              onChange={(e) => {
                const pageId = e.target.value;
                navigate(`/builder/${site.id}/${pageId}`);
              }}
              className="builder-select text-sm py-2 min-h-[2.5rem] max-w-[140px] md:max-w-[220px]"
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
            className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[2.5rem] shrink-0 whitespace-nowrap text-sm text-builder-text border border-builder-border rounded-lg hover:bg-builder-surface-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Page name, URL, SEO, delete"
          >
            <svg
              className="w-4 h-4 shrink-0"
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
            <span className="hidden sm:inline whitespace-nowrap">
              Page settings
            </span>
          </button>
          <button
            type="button"
            onClick={() => setShowNewPageModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[2.5rem] shrink-0 whitespace-nowrap text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/35 rounded-lg transition-colors"
            title="Add new page"
          >
            <svg
              className="w-4 h-4 shrink-0"
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
            <span className="whitespace-nowrap">New Page</span>
          </button>
        </div>

        <div className="flex flex-nowrap items-center gap-2.5 md:gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2.5 min-h-[2.5rem] min-w-[2.5rem] inline-flex items-center justify-center rounded-lg border border-builder-border text-builder-text-muted hover:text-builder-text hover:bg-builder-surface-muted transition-colors"
            title={theme === "dark" ? "Light mode" : "Dark mode"}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
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
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
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
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-2 text-sm text-builder-text-muted">
            {isSaving ? (
              <span className="flex items-center gap-1.5">
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
                Saving…
              </span>
            ) : hasUnsavedChanges ? (
              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                Unsaved
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
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

          <div className="h-6 w-px bg-builder-border hidden sm:block" />

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            className="px-4 py-2 min-h-[2.5rem] text-sm font-medium rounded-lg border border-builder-border hover:bg-builder-surface-muted disabled:opacity-45 disabled:cursor-not-allowed transition-colors"
          >
            Save
          </button>

          <button
            type="button"
            onClick={handlePreview}
            disabled={!site?.isPublished}
            className="hidden md:inline-flex items-center px-4 py-2 min-h-[2.5rem] text-sm rounded-lg border border-builder-border hover:bg-builder-surface-muted disabled:opacity-45 disabled:cursor-not-allowed transition-colors"
            title={
              !site?.isPublished ? "Publish site to preview" : "Preview site"
            }
          >
            Preview
          </button>

          {site?.isPublished ? (
            <button
              type="button"
              onClick={handleUnpublish}
              className="px-4 py-2 min-h-[2.5rem] text-sm rounded-lg bg-builder-surface-muted text-builder-text hover:opacity-90 transition-opacity"
            >
              Unpublish
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              className="px-5 py-2 min-h-[2.5rem] text-sm font-semibold rounded-full bg-primary-600 text-white hover:bg-primary-500 shadow-sm shadow-primary-600/25 transition-colors"
            >
              Publish
            </button>
          )}
        </div>
      </header>

      {/* Page settings modal */}
      {showPageSettingsModal && currentPage && (
        <div className="builder-modal-overlay">
          <div className="builder-modal-panel max-h-[90vh] overflow-y-auto max-w-md">
            <h2 className="text-lg font-semibold font-display text-builder-text mb-4">
              Page settings
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="editPageName"
                  className="builder-field-label !text-sm !text-builder-text"
                >
                  Page name
                </label>
                <input
                  id="editPageName"
                  type="text"
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                  className="builder-input py-2 px-3"
                />
              </div>

              <div>
                <label
                  htmlFor="editPageSlug"
                  className="builder-field-label !text-sm !text-builder-text"
                >
                  URL slug
                </label>
                <input
                  id="editPageSlug"
                  type="text"
                  value={pageSlug}
                  onChange={(e) => setPageSlug(e.target.value)}
                  className="builder-input py-2 px-3 font-mono text-sm"
                />
                <p className="text-xs text-builder-text-muted mt-1">
                  Published URL: /s/{site?.slug}/{pageSlug || "…"}
                </p>
              </div>

              <div>
                <label
                  htmlFor="editMetaTitle"
                  className="builder-field-label !text-sm !text-builder-text"
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
                  className="builder-input py-2 px-3"
                />
              </div>

              <div>
                <label
                  htmlFor="editMetaDescription"
                  className="builder-field-label !text-sm !text-builder-text"
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
                  className="builder-input py-2 px-3 min-h-[5rem]"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyPage ? true : pageIsHomepage}
                  disabled={onlyPage}
                  onChange={(e) => setPageIsHomepage(e.target.checked)}
                  className="rounded border-builder-border text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-400"
                />
                <span className="text-sm text-builder-text">Homepage</span>
              </label>
              {onlyPage && (
                <p className="text-xs text-builder-text-muted">
                  The only page in this site is always the homepage.
                </p>
              )}
            </div>

            {pageSettingsError && (
              <p
                className="mt-3 text-sm text-red-600 dark:text-red-400"
                role="alert"
              >
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
                  className="px-4 py-2 text-sm text-builder-text hover:bg-builder-surface-muted rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePageSettings}
                  disabled={isSavingPageSettings}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-500 disabled:opacity-50 transition-colors"
                >
                  {isSavingPageSettings ? "Saving…" : "Save"}
                </button>
              </div>
              {!onlyPage && (
                <button
                  type="button"
                  onClick={handleDeletePage}
                  className="w-full px-4 py-2 text-sm border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
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
        <div className="builder-modal-overlay">
          <div className="builder-modal-panel max-w-md">
            <h2 className="text-lg font-semibold font-display text-builder-text mb-4">
              Create new page
            </h2>
            <div className="mb-4">
              <label
                htmlFor="pageName"
                className="builder-field-label !text-sm !text-builder-text"
              >
                Page name
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
                className="builder-input py-2 px-3"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowNewPageModal(false);
                  setNewPageName("");
                }}
                className="px-4 py-2 text-sm text-builder-text hover:bg-builder-surface-muted rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreatePage}
                disabled={!newPageName.trim() || isCreatingPage}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCreatingPage ? "Creating…" : "Create page"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
