"use client";

import { useState } from "react";
import { Bookmark } from "@/lib/types";
import { ExternalLink, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface BookmarkItemProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
}

export default function BookmarkItem({ bookmark, onDelete }: BookmarkItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this bookmark?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", bookmark.id);

      if (error) throw error;
      
      onDelete(bookmark.id);
    } catch (err) {
      console.error("Error deleting bookmark:", err);
      alert("Failed to delete bookmark");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className={`group flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all ${
        isDeleting ? "opacity-50" : ""
      }`}
    >
      <div className="flex-1 min-w-0 mr-4">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-lg font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span className="truncate">{bookmark.title}</span>
          <ExternalLink className="w-4 h-4 flex-shrink-0" />
        </a>
        <p className="text-sm text-gray-500 truncate mt-1">{bookmark.url}</p>
        <p className="text-xs text-gray-400 mt-1">
          Added {formatDate(bookmark.created_at)}
        </p>
      </div>
      
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Delete bookmark"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}
