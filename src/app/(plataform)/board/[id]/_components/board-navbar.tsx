import Link from "next/link";
import type { BoardSelect } from "~/server/db/schema";
import { ArrowLeft, Calendar, Users } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

import { BoardOptions } from "./board-options";
import { BoardStats } from "./board-stats";
import { BoardTitleForm } from "./board-title-form";

type BoardNavbarProps = {
  data: BoardSelect;
  orgId: string;
};

export async function BoardNavbar({ data, orgId }: BoardNavbarProps) {
  return (
    <nav
      className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-hidden"
      aria-label="Board navigation"
    >
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8">
        {/* Left section - Back button and breadcrumbs */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="gap-1 sm:gap-2 text-muted-foreground hover:text-foreground shrink-0"
          >
            <Link href={`/organization/${orgId}`}>
              <ArrowLeft size={16} />
              <span className="hidden lg:inline">Back to Boards</span>
            </Link>
          </Button>

          <Separator orientation="vertical" className="h-6 hidden lg:block" />

          {/* Breadcrumbs */}
          <div className="hidden lg:flex items-center gap-2 text-sm min-w-0">
            <Link
              href={`/organization/${orgId}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Boards
            </Link>
            <span className="text-muted-foreground shrink-0">/</span>
            <span className="font-medium truncate max-w-[150px]">{data.title}</span>
          </div>
        </div>

        {/* Center section - Board title */}
        <div className="flex items-center justify-center flex-1 min-w-0 px-2">
          <div className="flex items-center gap-2 w-full max-w-sm">
            <div className="hidden xl:flex items-center gap-2 text-muted-foreground shrink-0">
              <Users size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <BoardTitleForm data={data} />
            </div>
          </div>
        </div>

        {/* Right section - Board info and options */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Board stats */}
          <div className="hidden xl:block">
            <BoardStats boardId={data.id} variant="compact" />
          </div>

          {/* Board metadata */}
          <div className="hidden 2xl:flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={14} />
            <span className="whitespace-nowrap">
              {data.createdAt ? data.createdAt.toLocaleDateString() : "Unknown"}
            </span>
          </div>

          <Separator orientation="vertical" className="h-6 hidden xl:block" />

          {/* Board options */}
          <BoardOptions id={data.id} orgId={orgId} />
        </div>
      </div>
    </nav>
  );
}
