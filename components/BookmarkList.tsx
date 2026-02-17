"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { createRealtimeClient } from "@/lib/supabase/realtime-client";
import { Bookmark } from "@/lib/types";
import BookmarkItem from "./BookmarkItem";
import { Loader2, BookmarkX } from "lucide-react";

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  // Load user and initial bookmarks
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
  }, [supabase]);

  // Set up real-time subscription with authenticated client
  useEffect(() => {
    if (!user) return;

    const setupRealtime = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.error("No access token for realtime");
        return;
      }

      console.log("Setting up realtime with authenticated client...");

      const realtimeClient = createRealtimeClient(session.access_token);

      const channel = realtimeClient
        .channel("bookmarks_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("Realtime event received:", payload.eventType);
            if (payload.eventType === "INSERT") {
              setBookmarks((current) => {
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
        .subscribe((status) => {
          console.log("Realtime subscription status:", status);
        });

      return () => {
        realtimeClient.removeChannel(channel);
      };
    };

    const cleanup = setupRealtime();

    return () => {
      cleanup.then((fn) => fn?.());
    };
  }, [user, supabase]);

  const handleBookmarkDeleted = (id: string) => {
    setBookmarks((current) => current.filter((b) => b.id !== id));
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
