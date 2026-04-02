"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BottomNav } from "@/components/layout/BottomNav";
import { 
  Bell, 
  Globe, 
  Moon, 
  Info, 
  Shield, 
  HelpCircle, 
  ChevronRight,
  Smartphone,
  Mail
} from "lucide-react";
import { cn } from "@/lib/utils";

const settingsGroups = [
  {
    title: "Préférences",
    items: [
      { icon: Bell, label: "Notifications", value: "Activées", href: "#" },
      { icon: Globe, label: "Langue", value: "Français", href: "#" },
      { icon: Moon, label: "Thème", value: "Sombre", href: "#" },
    ],
  },
  {
    title: "Application",
    items: [
      { icon: Smartphone, label: "Version", value: "1.0.0", href: "#" },
      { icon: Info, label: "À propos", value: "", href: "#" },
      { icon: HelpCircle, label: "Aide & Support", value: "", href: "#" },
    ],
  },
  {
    title: "Légal",
    items: [
      { icon: Shield, label: "Confidentialité", value: "", href: "#" },
      { icon: Mail, label: "Contact", value: "", href: "#" },
    ],
  },
];

function SettingsItem({ 
  icon: Icon, 
  label, 
  value, 
  href 
}: { 
  icon: typeof Bell; 
  label: string; 
  value: string; 
  href: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl",
        "hover:bg-white/[0.04] transition-colors"
      )}
    >
      <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center">
        <Icon className="w-4 h-4 text-[#878787]" />
      </div>
      <div className="flex-1">
        <p className="text-[14px] font-medium text-white">{label}</p>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-[13px] text-[#878787]">{value}</span>}
        <ChevronRight className="w-4 h-4 text-[#878787]" />
      </div>
    </a>
  );
}

export default function ParametresPage() {
  return (
    <div className="min-h-screen bg-[#151419]">
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at top, rgba(245,110,15,0.08), transparent 60%)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 px-4 pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <div className="relative w-12 h-12 shrink-0">
            <Image
              src="/images/logo.png"
              alt="Vodun Days Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.1em] text-[#878787] mb-1">
              Application
            </p>
            <h1 className="text-[22px] font-black text-white tracking-[-0.02em]">
              Paramètres
            </h1>
          </div>
        </motion.div>
      </header>

      {/* Settings groups */}
      <main className="px-4 pb-24 space-y-6">
        {settingsGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: groupIndex * 0.1 }}
          >
            <h2 className="text-[12px] uppercase tracking-wider text-[#878787] mb-2 px-1">
              {group.title}
            </h2>
            <div className={cn(
              "rounded-[16px] overflow-hidden",
              "bg-[#1B1B1E] border border-white/6"
            )}>
              {group.items.map((item, index) => (
                <div key={item.label}>
                  <SettingsItem {...item} />
                  {index < group.items.length - 1 && (
                    <div className="mx-3 h-px bg-white/[0.06]" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-center pt-4"
        >
          <p className="text-[12px] text-[#878787]">
            Vodun Days 2025
          </p>
          <p className="text-[11px] text-[#878787]/60 mt-1">
            Ouidah, Bénin
          </p>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
