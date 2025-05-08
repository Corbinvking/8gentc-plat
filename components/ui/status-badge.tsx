import { cn } from "@/lib/utils"

type StatusProps = {
  status: 'submitted' | 'in-progress' | 'completed' | 'cancelled'
}

export function StatusBadge({ status }: StatusProps) {
  const statusConfig = {
    'submitted': {
      color: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      label: 'Submitted'
    },
    'in-progress': {
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      label: 'In Progress'
    },
    'completed': {
      color: 'text-green-700',
      bg: 'bg-green-50',
      border: 'border-green-200',
      label: 'Completed'
    },
    'cancelled': {
      color: 'text-red-700',
      bg: 'bg-red-50',
      border: 'border-red-200',
      label: 'Cancelled'
    }
  }

  const config = statusConfig[status]

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      config.color,
      config.bg,
      config.border
    )}>
      {config.label}
    </span>
  )
} 