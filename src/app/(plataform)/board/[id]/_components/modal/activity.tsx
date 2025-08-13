"use client";

import type { AuditLogsSelect } from "~/server/db/schema";
import { Activity as ActivityIcon, Clock } from "lucide-react";

import { Skeleton } from "~/components/ui/skeleton";

import { ActivityItem } from "./activity-item";

type ActivityProps = {
  items: AuditLogsSelect[];
};

export function Activity({ items }: ActivityProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-x-3">
        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 shrink-0">
          <ActivityIcon className="h-4 w-4" />
        </div>
        <h3 className="font-semibold text-foreground">Activity</h3>
      </div>

      <div className="ml-11">
        {items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item) => (
              <ActivityItem key={item.id} data={item} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <div className="text-center space-y-2">
              <Clock className="h-5 w-5 mx-auto opacity-40" />
              <p className="text-sm">No activity yet</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Activity.Skeleton = function ActivitySkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-x-3">
        <div className="p-2 rounded-lg bg-muted shrink-0">
          <Skeleton className="h-4 w-4" />
        </div>
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="ml-11 space-y-3">
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
    </div>
  );
};
