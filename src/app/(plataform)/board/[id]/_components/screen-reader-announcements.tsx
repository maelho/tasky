"use client";

import { useEffect, useRef } from "react";

interface ScreenReaderAnnouncementsProps {
  announcement: string;
  priority?: "polite" | "assertive";
  clearAfter?: number;
}

export function ScreenReaderAnnouncements({
  announcement,
  priority = "polite",
  clearAfter = 3000,
}: ScreenReaderAnnouncementsProps) {
  const announcementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (announcement && announcementRef.current) {
      // Clear any existing announcement
      announcementRef.current.textContent = "";

      // Add the new announcement after a brief delay to ensure screen readers pick it up
      const timer = setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = announcement;
        }
      }, 100);

      // Clear the announcement after the specified time
      const clearTimer = setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = "";
        }
      }, clearAfter);

      return () => {
        clearTimeout(timer);
        clearTimeout(clearTimer);
      };
    }
  }, [announcement, clearAfter]);

  return (
    <div
      ref={announcementRef}
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
      role="status"
    />
  );
}

export function useBoardAnnouncements() {
  const announce = (
    message: string,
    priority: "polite" | "assertive" = "polite",
  ) => {
    const announcer = document.createElement("div");
    announcer.setAttribute("aria-live", priority);
    announcer.setAttribute("aria-atomic", "true");
    announcer.setAttribute("class", "sr-only");
    announcer.setAttribute("role", "status");

    document.body.appendChild(announcer);

    setTimeout(() => {
      announcer.textContent = message;
    }, 100);

    setTimeout(() => {
      if (document.body.contains(announcer)) {
        document.body.removeChild(announcer);
      }
    }, 3000);
  };

  return { announce };
}

export const BOARD_ANNOUNCEMENTS = {
  CARD_MOVED: (cardTitle: string, fromList: string, toList: string) =>
    `Card "${cardTitle}" moved from ${fromList} to ${toList}`,

  CARD_CREATED: (cardTitle: string, listTitle: string) =>
    `Card "${cardTitle}" created in list ${listTitle}`,

  CARD_DELETED: (cardTitle: string) => `Card "${cardTitle}" deleted`,

  CARD_UPDATED: (cardTitle: string) => `Card "${cardTitle}" updated`,

  LIST_CREATED: (listTitle: string) => `List "${listTitle}" created`,

  LIST_DELETED: (listTitle: string) => `List "${listTitle}" deleted`,

  LIST_MOVED: (listTitle: string, newPosition: number) =>
    `List "${listTitle}" moved to position ${newPosition}`,

  LIST_RENAMED: (oldTitle: string, newTitle: string) =>
    `List renamed from "${oldTitle}" to "${newTitle}"`,

  BOARD_RENAMED: (oldTitle: string, newTitle: string) =>
    `Board renamed from "${oldTitle}" to "${newTitle}"`,

  BOARD_DELETED: (boardTitle: string) => `Board "${boardTitle}" deleted`,

  DRAG_STARTED: (itemType: "card" | "list", itemTitle: string) =>
    `Started dragging ${itemType} "${itemTitle}". Use arrow keys to move, Enter to drop, Escape to cancel`,

  DRAG_ENDED: (itemType: "card" | "list", itemTitle: string) =>
    `Finished dragging ${itemType} "${itemTitle}"`,

  LOADING: (action: string) => `${action} in progress, please wait`,

  ERROR: (action: string, error: string) => `Error ${action}: ${error}`,

  SUCCESS: (action: string) => `${action} completed successfully`,
} as const;
