import { cn } from "@/lib/utils"
import { ShieldCheck, User, BarChart3 } from "lucide-react"
import type { UserRole } from "@/lib/types/api"

interface RoleBadgeProps {
  role: UserRole
  className?: string
}

const ROLE_CONFIG: Record<UserRole, { label: string; className: string; icon: typeof User }> = {
  SUPER_ADMIN: {
    label: "Super Admin",
    className: "bg-red-500/10 text-red-500 dark:bg-red-500/20",
    icon: ShieldCheck,
  },
  ADMIN: {
    label: "Admin Culture",
    className: "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20",
    icon: User,
  },
  INSTAD: {
    label: "INStaD",
    className: "bg-teal-500/10 text-teal-500 dark:bg-teal-500/20",
    icon: BarChart3,
  },
}

// Badge de rôle utilisateur avec icône et couleur distincte
export function RoleBadge({ role, className }: RoleBadgeProps) {
  const config = ROLE_CONFIG[role] ?? ROLE_CONFIG.ADMIN
  const Icon   = config.icon

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      <Icon className="size-3" />
      {config.label}
    </span>
  )
}
