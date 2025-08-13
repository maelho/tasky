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
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link
            href={`/organization/${orgId}`}
            className="mr-4 flex items-center space-x-2 lg:mr-6 transition-colors hover:text-foreground/80"
          >
            <span className="text-lg font-bold tracking-tight">{SiteConfig.title}</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-1">
            <SelectBoardButton orgId={orgId} />
            <ActivityButton orgId={orgId} />
            <SettingsButton orgId={orgId} />
          </nav>

          <div className="flex items-center space-x-1">
            <OrganizationSwitcherButton />
            <ThemeToggle />
            <UserClerkButton />
          </div>
        </div>
      </div>
    </header>
  );
}
