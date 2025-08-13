import { SiteConfig } from "~/config/site";

export default function ClerkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted hidden lg:flex lg:flex-col lg:justify-between lg:p-10">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
            <span className="text-sm font-bold">T</span>
          </div>
          {SiteConfig.title}
        </div>

        <div className="space-y-6">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This task management system has completely transformed how
              our team stays organized and productive.&rdquo;
            </p>
            <footer className="text-muted-foreground text-sm">
              Sofia Davis
            </footer>
          </blockquote>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
