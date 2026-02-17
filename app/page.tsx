"use client";

import { useState, useCallback } from "react";
import AuthButton from "@/components/AuthButton";
import BookmarkForm from "@/components/BookmarkForm";
import BookmarkList from "@/components/BookmarkList";
import { Bookmark as BookmarkIcon } from "lucide-react";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleBookmarkAdded = useCallback(() => {
    // Trigger a refresh of the bookmark list
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookmarkIcon className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Smart Bookmarks
            </h1>
          </div>
          <AuthButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Add Bookmark Section */}
        <section className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Bookmark
            </h2>
            <BookmarkForm onBookmarkAdded={handleBookmarkAdded} />
          </div>
        </section>

        {/* Bookmarks List Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Bookmarks
            </h2>
          </div>
          <BookmarkList key={refreshKey} />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-gray-500">
        <p>Smart Bookmark Manager - Built with Next.js & Supabase</p>
      </footer>
    </div>
  );
}
