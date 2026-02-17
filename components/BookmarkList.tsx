"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bookmark } from "@/lib/types";
import BookmarkItem from "./BookmarkItem";
import { Loader2, BookmarkX } from "lucide-react";

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchBookmarks = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching bookmarks:", error);
      } else {
        setBookmarks(data || []);
      }
      setLoading(false);
    };

    fetchBookmarks();

    // Set up real-time subscription
    const channel = supabase
      .channel("bookmarks_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBookmarks((current) => {
              // Avoid duplicates
              if (current.find((b) => b.id === payload.new.id)) {
                return current;
              }
              return [payload.new as Bookmark, ...current];
            });
          } else if (payload.eventType === "DELETE") {
            setBookmarks((current) =>
              current.filter((b) => b.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleBookmarkDeleted = (id: string) => {
    setBookmarks((current) => current.filter((b) => b.id !== id));
  };

  const refreshBookmarks = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setBookmarks(data);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <BookmarkX className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">
          Sign in to see your bookmarks
        </p>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <BookmarkX className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">
          No bookmarks yet. Add your first one above!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookmarks.map((bookmark) => (
        <BookmarkItem
          key={bookmark.id}
          bookmark={bookmark}
          onDelete={handleBookmarkDeleted}
        />
      ))}
    </div>
  );
}

