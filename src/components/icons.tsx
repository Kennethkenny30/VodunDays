// Icônes SVG Material Symbols - Vodun Days
// Toutes les icônes utilisées dans le projet

import { cn } from "@/lib/utils"

interface IconProps {
  className?: string
}

// Dashboard et navigation
export function IconDashboard({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 9V3h8v6h-8ZM3 13V3h8v10H3Zm10 8V11h8v10h-8ZM3 21v-6h8v6H3Z" />
    </svg>
  )
}

export function IconMenu({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 18v-2h18v2H3Zm0-5v-2h18v2H3Zm0-5V6h18v2H3Z" />
    </svg>
  )
}

export function IconSearch({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="m19.6 21-6.3-6.3q-.75.6-1.725.95Q10.6 16 9.5 16q-2.725 0-4.612-1.887Q3 12.225 3 9.5q0-2.725 1.888-4.613Q6.775 3 9.5 3t4.613 1.887Q16 6.775 16 9.5q0 1.1-.35 2.075-.35.975-.95 1.725l6.3 6.3-1.4 1.4ZM9.5 14q1.875 0 3.188-1.312Q14 11.375 14 9.5q0-1.875-1.312-3.188Q11.375 5 9.5 5 7.625 5 6.312 6.312 5 7.625 5 9.5q0 1.875 1.312 3.188Q7.625 14 9.5 14Z" />
    </svg>
  )
}

export function IconBell({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 19v-2h2v-7q0-2.075 1.25-3.687Q8.5 4.7 10.5 4.2v-.7q0-.625.438-1.062Q11.375 2 12 2t1.062.438q.438.437.438 1.062v.7q2 .5 3.25 2.113Q18 7.925 18 10v7h2v2H4Zm8 3q-.825 0-1.412-.587Q10 20.825 10 20h4q0 .825-.587 1.413Q12.825 22 12 22Z" />
    </svg>
  )
}

export function IconSun({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 17q-2.075 0-3.537-1.463Q7 14.075 7 12t1.463-3.538Q9.925 7 12 7t3.538 1.462Q17 9.925 17 12q0 2.075-1.462 3.537Q14.075 17 12 17ZM2 13v-2h3v2H2Zm17 0v-2h3v2h-3Zm-6-7V3h2v3h-2Zm0 15v-3h2v3h-2ZM5.65 7.05 4.225 5.625l1.4-1.4L7.05 5.65l-1.4 1.4Zm12.7 12.725-1.4-1.425 1.425-1.4 1.4 1.4-1.425 1.425ZM16.95 7.05l1.4-1.4 1.425 1.425-1.425 1.4-1.4-1.425ZM4.225 19.775 5.65 18.35l1.4 1.4-1.4 1.425-1.425-1.4ZM12 15q1.25 0 2.125-.875T15 12q0-1.25-.875-2.125T12 9q-1.25 0-2.125.875T9 12q0 1.25.875 2.125T12 15Z" />
    </svg>
  )
}

export function IconMoon({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21q-3.75 0-6.375-2.625T3 12q0-3.75 2.625-6.375T12 3q.35 0 .688.025.337.025.662.075-1.025.725-1.637 1.887Q11.1 6.15 11.1 7.5q0 2.25 1.575 3.825Q14.25 12.9 16.5 12.9q1.375 0 2.525-.613 1.15-.612 1.875-1.637.05.325.075.662Q21 11.65 21 12q0 3.75-2.625 6.375T12 21Z" />
    </svg>
  )
}

export function IconUser({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12q-1.65 0-2.825-1.175Q8 9.65 8 8q0-1.65 1.175-2.825Q10.35 4 12 4q1.65 0 2.825 1.175Q16 6.35 16 8q0 1.65-1.175 2.825Q13.65 12 12 12Zm-8 8v-2.8q0-.85.438-1.562.437-.713 1.162-1.088 1.55-.775 3.15-1.162Q10.35 13 12 13t3.25.388q1.6.387 3.15 1.162.725.375 1.162 1.088Q20 16.35 20 17.2V20H4Z" />
    </svg>
  )
}

export function IconUsers({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 18v-1.575q0-1.1 1.113-1.763Q2.225 14 4 14q.325 0 .625.012.3.013.575.063-.35.5-.525 1.075-.175.575-.175 1.225V18H0Zm6 0v-1.625q0-1.625 1.663-2.625 1.662-1 4.337-1 2.7 0 4.35 1 1.65 1 1.65 2.625V18H6Zm13.5 0v-1.625q0-.65-.163-1.225-.162-.575-.487-1.075.275-.05.563-.063Q19.7 14 20 14q1.8 0 2.9.662 1.1.663 1.1 1.763V18h-4.5ZM4 13q-.825 0-1.412-.588Q2 11.825 2 11t.588-1.413Q3.175 9 4 9t1.412.587Q6 10.175 6 11q0 .825-.588 1.412Q4.825 13 4 13Zm16 0q-.825 0-1.413-.588Q18 11.825 18 11t.587-1.413Q19.175 9 20 9q.825 0 1.413.587Q22 10.175 22 11q0 .825-.587 1.412Q20.825 13 20 13Zm-8-1q-1.25 0-2.125-.875T9 9q0-1.275.875-2.138Q10.75 6 12 6q1.275 0 2.137.862Q15 7.725 15 9q0 1.25-.863 2.125Q13.275 12 12 12Z" />
    </svg>
  )
}

export function IconLogout({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 21q-.825 0-1.413-.587Q3 19.825 3 19V5q0-.825.587-1.413Q4.175 3 5 3h7v2H5v14h7v2H5Zm11-4-1.375-1.45 2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5-5 5Z" />
    </svg>
  )
}

export function IconSwitch({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.99 11 3 15l3.99 4v-3H14v-2H6.99v-3ZM21 9l-3.99-4v3H10v2h7.01v3L21 9Z" />
    </svg>
  )
}

export function IconChevronRight({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8.025 22 6.25 20.225 14.475 12 6.25 3.775 8.025 2l10 10-10 10Z" />
    </svg>
  )
}

// Actions CRUD
export function IconPlus({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6h-2Z" />
    </svg>
  )
}

export function IconEdit({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 19h1.4l8.625-8.625-1.4-1.4L5 17.6V19ZM19.3 8.925l-4.25-4.2 1.4-1.4q.575-.575 1.413-.575.837 0 1.412.575l1.4 1.4q.575.575.6 1.388.025.812-.55 1.387l-1.425 1.425ZM17.85 10.4 7.25 21H3v-4.25l10.6-10.6 4.25 4.25Z" />
    </svg>
  )
}

export function IconDelete({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21H7ZM9 17h2V8H9v9Zm4 0h2V8h-2v9Z" />
    </svg>
  )
}

export function IconMore({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 20q-.825 0-1.412-.587Q10 18.825 10 18q0-.825.588-1.413Q11.175 16 12 16t1.413.587Q14 17.175 14 18q0 .825-.587 1.413Q12.825 20 12 20Zm0-6q-.825 0-1.412-.588Q10 12.825 10 12t.588-1.413Q11.175 10 12 10t1.413.587Q14 11.175 14 12q0 .825-.587 1.412Q12.825 14 12 14Zm0-6q-.825 0-1.412-.588Q10 6.825 10 6t.588-1.412Q11.175 4 12 4t1.413.588Q14 5.175 14 6t-.587 1.412Q12.825 8 12 8Z" />
    </svg>
  )
}

export function IconClose({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19Z" />
    </svg>
  )
}

export function IconSend({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 20V4l19 8-19 8Zm2-3 11.85-5L5 7v3.5l6 1.5-6 1.5V17Zm0 0V7v10Z" />
    </svg>
  )
}

export function IconDownload({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 16 7 11l1.4-1.45 2.6 2.6V4h2v8.15l2.6-2.6L17 11l-5 5Zm-6 4q-.825 0-1.412-.587Q4 18.825 4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413Q18.825 20 18 20H6Z" />
    </svg>
  )
}

export function IconRefresh({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 20q-3.35 0-5.675-2.325Q4 15.35 4 12q0-3.35 2.325-5.675Q8.65 4 12 4q1.725 0 3.3.712 1.575.713 2.7 2.038V4h2v7h-7V9h4.2q-.8-1.4-2.187-2.2Q13.625 6 12 6 9.5 6 7.75 7.75T6 12q0 2.5 1.75 4.25T12 18q1.925 0 3.475-1.1T17.65 14h2.1q-.7 2.65-2.85 4.325Q14.75 20 12 20Z" />
    </svg>
  )
}

// Domaines métier
export function IconCalendar({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 22q-.825 0-1.413-.587Q3 20.825 3 20V6q0-.825.587-1.412Q4.175 4 5 4h1V2h2v2h8V2h2v2h1q.825 0 1.413.588Q21 5.175 21 6v14q0 .825-.587 1.413Q19.825 22 19 22H5Zm0-2h14V10H5v10Z" />
    </svg>
  )
}

export function IconClock({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="m15.3 16.7-4.3-4.3V7h2v4.6l3.7 3.7-1.4 1.4ZM12 22q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" />
    </svg>
  )
}

export function IconMapPin({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12q.825 0 1.413-.588Q14 10.825 14 10t-.587-1.413Q12.825 8 12 8q-.825 0-1.412.587Q10 9.175 10 10q0 .825.588 1.412Q11.175 12 12 12Zm0 10q-4.025-3.425-6.012-6.362Q4 12.7 4 10.2q0-3.75 2.413-5.975Q8.825 2 12 2t5.587 2.225Q20 6.45 20 10.2q0 2.5-1.987 5.438Q16.025 18.575 12 22Z" />
    </svg>
  )
}

export function IconChart({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 21V3h2v16h16v2H3Zm4-4V10h3v7H7Zm4 0V6h3v11h-3Zm4 0V9h3v8h-3Z" />
    </svg>
  )
}

export function IconStar({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="m5.825 22 1.625-7.025L2 10.25l7.2-.625L12 3l2.8 6.625 7.2.625-5.45 4.725L18.175 22 12 18.275 5.825 22Z" />
    </svg>
  )
}

export function IconStarOutline({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="m8.85 17.825 3.15-1.9 3.15 1.925-.825-3.6 2.775-2.4-3.65-.325-1.45-3.4-1.45 3.375-3.65.325 2.775 2.425-.825 3.575ZM5.825 22l1.625-7.025L2 10.25l7.2-.625L12 3l2.8 6.625 7.2.625-5.45 4.725L18.175 22 12 18.275 5.825 22Z" />
    </svg>
  )
}

export function IconComment({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 14h8v-2H6v2Zm0-3h12V9H6v2Zm0-3h12V6H6v2ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6l-4 4Z" />
    </svg>
  )
}

// Statut et sécurité
export function IconShield({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 22q-3.475-.875-5.738-3.988Q4 14.9 4 11.1V5l8-3 8 3v6.1q0 3.8-2.262 6.912Q15.475 21.125 12 22Z" />
    </svg>
  )
}

export function IconBug({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21q-1.625 0-3.012-.8Q7.6 19.4 6.7 18H4v-2h2.1q-.075-.5-.088-1Q6 14.5 6 14H4v-2h2q0-.5.012-1 .013-.5.088-1H4V8h2.7q.45-.8 1.062-1.45.613-.65 1.388-1.1l-1.45-1.4L9.1 2.6l1.8 1.8q.525-.2 1.075-.3.55-.1 1.125-.1.525 0 1.075.1.55.1 1.025.3l1.8-1.8 1.4 1.45-1.45 1.4q.775.45 1.4 1.1.625.65 1.05 1.45H22v2h-2.1q.075.5.088 1 .012.5.012 1h2v2h-2q0 .5-.012 1-.013.5-.088 1H22v2h-2.7q-.9 1.4-2.288 2.2Q15.625 21 14 21q-1.625 0-3.012-.8Q9.6 19.4 8.7 18H6.7q.45.8 1.063 1.45.612.65 1.387 1.1Q10 21.25 10.988 21.625 11.975 22 13 22q2.075 0 3.538-1.462Q18 19.075 18 17v-3q0-2.5-1.75-4.25T12 8Q9.5 8 7.75 9.75T6 14v3q0 2.075 1.462 3.538Q8.925 22 11 22h2v-1Z" />
    </svg>
  )
}

export function IconWarning({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M1 21 12 2l11 19H1Zm3.45-2h15.1L12 6 4.45 19ZM12 18q.425 0 .713-.288Q13 17.425 13 17t-.287-.712Q12.425 16 12 16t-.712.288Q11 16.575 11 17t.288.712Q11.575 18 12 18Zm-1-3h2v-5h-2v5Z" />
    </svg>
  )
}

export function IconCheck({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.55 18 3.85 12.3l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4 9.55 18Z" />
    </svg>
  )
}

export function IconCheckCircle({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="m10.6 16.6 7.05-7.05-1.4-1.4-5.65 5.65-2.85-2.85-1.4 1.4 4.25 4.25ZM12 22q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" />
    </svg>
  )
}

export function IconError({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 17q.425 0 .713-.288Q13 16.425 13 16t-.287-.712Q12.425 15 12 15t-.712.288Q11 15.575 11 16t.288.712Q11.575 17 12 17Zm-1-4h2V7h-2v6Zm1 9q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" />
    </svg>
  )
}

export function IconInfo({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11 17h2v-6h-2v6Zm1-8q.425 0 .713-.288Q13 8.425 13 8t-.287-.713Q12.425 7 12 7t-.712.287Q11 7.575 11 8t.288.712Q11.575 9 12 9Zm0 13q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" />
    </svg>
  )
}

export function IconSettings({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.25 22 8.85 18.8q-.3-.125-.562-.262-.263-.138-.538-.338l-3 1.275-2.75-4.75 2.575-1.95q-.025-.175-.025-.337v-.675q0-.163.025-.338L2 9.275 4.75 4.525l3 1.275q.275-.2.538-.338.262-.137.562-.262L9.25 2h5.5l.4 3.2q.3.125.563.262.262.138.537.338l3-1.275 2.75 4.75-2.575 1.95q.025.175.025.338v.675q0 .162-.025.337l2.575 1.95-2.75 4.75-3-1.275q-.275.2-.537.338-.263.137-.563.262L14.75 22h-5.5ZM12 15.5q1.45 0 2.475-1.025Q15.5 13.45 15.5 12q0-1.45-1.025-2.475Q13.45 8.5 12 8.5q-1.45 0-2.475 1.025Q8.5 10.55 8.5 12q0 1.45 1.025 2.475Q10.55 15.5 12 15.5Z" />
    </svg>
  )
}

export function IconUserCheck({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="m17.3 18.3-2.1-2.1 1.4-1.4 .7 .7 2.1-2.1 1.4 1.4-3.5 3.5ZM9 12q-1.65 0-2.825-1.175Q5 9.65 5 8q0-1.65 1.175-2.825Q7.35 4 9 4q1.65 0 2.825 1.175Q13 6.35 13 8q0 1.65-1.175 2.825Q10.65 12 9 12Zm-7 8v-2.8q0-.85.438-1.563.437-.712 1.162-1.087 1.55-.775 3.15-1.163Q8.35 13 10 13h.35q.15 0 .3.025-.375.7-.55 1.463-.175.762-.175 1.562 0 1.225.425 2.325Q10.775 19.475 11.575 20H2Z" />
    </svg>
  )
}

export function IconArrowRight({ className }: IconProps) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="m12 20-1.425-1.4 5.6-5.6H4v-2h12.175l-5.6-5.6L12 4l8 8-8 8Z" />
    </svg>
  )
}

export function IconLoading({ className }: IconProps) {
  return (
    <svg className={cn("size-5 animate-spin", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" />
    </svg>
  )
}
