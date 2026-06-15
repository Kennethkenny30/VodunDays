"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { BottomNav } from "@/components/layout/BottomNav";
import { createAlert } from "@/lib/api/urgences";
import type { AlertType } from "@/lib/types/api";
import {
  ArrowLeft, X, HeartPulse, Shield, Flame, UserX, Wrench, MessageCircle,
  CheckCircle, Phone, RotateCcw, Home, Loader2,
} from "lucide-react";

function getFestivalierUuid(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("vd_uuid");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("vd_uuid", id);
  }
  return id;
}

type AlertTypeConfig = {
  type: AlertType;
  key: keyof { MEDICAL: 0; SECURITY: 0; FIRE: 0; LOST: 0; TECHNICAL: 0; OTHER: 0 };
  Icon: React.ElementType;
  color: string;
};

const ALERT_TYPE_CONFIG: AlertTypeConfig[] = [
  { type: "MEDICAL",   key: "MEDICAL",   Icon: HeartPulse,    color: "#FF3B30" },
  { type: "SECURITY",  key: "SECURITY",  Icon: Shield,        color: "#FF9500" },
  { type: "FIRE",      key: "FIRE",      Icon: Flame,         color: "#FF3B30" },
  { type: "LOST",      key: "LOST",      Icon: UserX,         color: "#5856D6" },
  { type: "TECHNICAL", key: "TECHNICAL", Icon: Wrench,        color: "#34C759" },
  { type: "OTHER",     key: "OTHER",     Icon: MessageCircle, color: "#8E8E93" },
];

type Step = "type" | "details" | "success";

export default function UrgencesPage() {
  const t  = useTranslations("urgences");
  const tc = useTranslations("common");
  const router = useRouter();
  const [step, setStep]                 = useState<Step>("type");
  const [selectedType, setSelectedType] = useState<AlertType | null>(null);
  const [displayName, setDisplayName]   = useState("");
  const [description, setDescription]   = useState("");
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [uuid, setUuid]                 = useState("");

  useEffect(() => { setUuid(getFestivalierUuid()); }, []);

  const selectedConfig = ALERT_TYPE_CONFIG.find((c) => c.type === selectedType);

  const handleSubmit = async () => {
    if (!uuid || !selectedType) return;
    setError(null);
    setLoading(true);
    try {
      const res = await createAlert({
        uuid,
        displayName: displayName.trim(),
        type: selectedType,
        description: description.trim(),
      });
      if (res.success) {
        setStep("success");
      } else {
        setError(res.message || tc("error"));
      }
    } catch {
      setError(tc("error"));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep("type");
    setSelectedType(null);
    setDisplayName("");
    setDescription("");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#151419] pb-28">
      <div className="sticky top-0 z-20 bg-[#151419]/95 backdrop-blur border-b border-white/[0.06] px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button onClick={() => router.back()} className="text-white/60 hover:text-white transition-colors p-1">
            <ArrowLeft className="size-5" />
          </button>
          <h1 className="text-white font-semibold">{t("title")}</h1>
          <div className="w-7" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6">
        <AnimatePresence mode="wait">
          {step === "type" && (
            <motion.div
              key="type"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <p className="text-white/60 text-sm">{t("subtitle")}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {ALERT_TYPE_CONFIG.map(({ type, key, Icon, color }) => (
                  <button
                    key={type}
                    onClick={() => { setSelectedType(type); setStep("details"); }}
                    className="relative flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] active:scale-95 transition-all text-left"
                    style={{ borderColor: `${color}30` }}
                  >
                    <Icon className="size-6" style={{ color }} />
                    <span className="text-white text-sm font-medium text-center leading-tight">
                      {t(`types.${key}.label`)}
                    </span>
                    <span className="text-white/40 text-xs text-center leading-tight">
                      {t(`types.${key}.desc`)}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "details" && selectedConfig && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div
                className="flex items-center gap-3 p-3 rounded-xl border"
                style={{
                  borderColor: `${selectedConfig.color}40`,
                  backgroundColor: `${selectedConfig.color}10`,
                }}
              >
                <selectedConfig.Icon className="size-6" style={{ color: selectedConfig.color }} />
                <div>
                  <p className="text-white font-medium text-sm">
                    {t(`types.${selectedConfig.key}.label`)}
                  </p>
                  <p className="text-white/50 text-xs">
                    {t(`types.${selectedConfig.key}.desc`)}
                  </p>
                </div>
                <button onClick={() => setStep("type")} className="ml-auto text-white/40 hover:text-white/70">
                  <X className="size-4" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-white/70 text-sm font-medium">{t("nameLabel")}</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={t("namePlaceholder")}
                  className="w-full bg-white/[0.05] border border-white/[0.10] rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-white/30 transition-colors"
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <label className="text-white/70 text-sm font-medium">{t("descLabel")}</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("descPlaceholder")}
                  rows={4}
                  className="w-full bg-white/[0.05] border border-white/[0.10] rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-white/30 transition-colors resize-none"
                  maxLength={500}
                />
                <p className="text-white/30 text-xs text-right">{description.length}/500</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading || !displayName.trim() || !description.trim()}
                className="w-full py-4 rounded-2xl text-white font-semibold text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: selectedConfig.color }}
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  t("submit")
                )}
              </button>

              <p className="text-white/30 text-xs text-center">{t("disclaimer")}</p>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 pt-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="flex justify-center"
              >
                <CheckCircle className="size-16 text-green-400" />
              </motion.div>
              <div>
                <h2 className="text-white text-xl font-bold mb-2">{t("success.title")}</h2>
                <p className="text-white/60 text-sm leading-relaxed">{t("success.message")}</p>
              </div>

              {selectedConfig && (
                <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 text-left space-y-2">
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <selectedConfig.Icon className="size-4" style={{ color: selectedConfig.color }} />
                    <span>{t(`types.${selectedConfig.key}.label`)}</span>
                  </div>
                  <p className="text-white/50 text-xs">{description}</p>
                </div>
              )}

              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
                  <Phone className="size-3.5" />
                  <span>{t("success.emergency")}</span>
                </div>
                <button
                  onClick={resetForm}
                  className="w-full py-3 rounded-2xl border border-white/[0.10] text-white/70 text-sm hover:bg-white/[0.05] transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="size-4" />
                  {t("success.newReport")}
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="w-full py-3 rounded-2xl bg-white/[0.08] text-white text-sm font-medium hover:bg-white/[0.12] transition-colors flex items-center justify-center gap-2"
                >
                  <Home className="size-4" />
                  {t("success.home")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
