import type { AuditLogsSelect } from "~/server/db/schema";

import { formatDateToLocal, generateLogMessage } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

type ActivityItemProps = {
  data: AuditLogsSelect;
};

export function ActivityItem({ data }: ActivityItemProps) {
  const initials = data.userName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-card/50 hover:bg-card/80 transition-colors">
      <Avatar className="h-8 w-8 border border-border/50 shrink-0">
        <AvatarImage src={data.userImage} alt={data.userName} />
        <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">{initials}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="text-sm text-foreground">
          <span className="font-medium text-primary">{data.userName}</span>
          <span className="text-muted-foreground ml-1">{generateLogMessage(data)}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <time dateTime={data.createdAt.toString()}>{formatDateToLocal(data.createdAt.toString())}</time>
        </div>
      </div>
    </div>
  );
}
