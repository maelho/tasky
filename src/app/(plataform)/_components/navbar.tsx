import Link from "next/link";

import { SiteConfig } from "~/config/site";
import { ThemeToggle } from "~/components/theme-toggle";

import {
  ActivityButton,
  OrganizationSwitcherButton,
  SelectBoardButton,
  SettingsButton,
  UserClerkButton,
} from "./navbar-items";

type NavbarProps = {
  orgId: string;
};

export async function Navbar({ orgId }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href={`/organization/${orgId}`}
            className="flex items-center space-x-2 transition-all hover:opacity-80 group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold text-sm group-hover:scale-105 transition-transform">
              T
            </div>
            <span className="hidden sm:block text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {SiteConfig.title}
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <nav className="hidden md:flex items-center gap-2">
            <SelectBoardButton orgId={orgId} />
            <ActivityButton orgId={orgId} />
            <SettingsButton orgId={orgId} />
          </nav>

          <div className="flex items-center gap-3 ml-4 border-l border-border/40 pl-4">
            <div className="md:hidden">
              <SelectBoardButton orgId={orgId} />
            </div>
            <OrganizationSwitcherButton />
            <ThemeToggle />
            <UserClerkButton />
          </div>
        </div>
      </div>
    </header>
  );
}
