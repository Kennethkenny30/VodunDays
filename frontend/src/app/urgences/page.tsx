"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/layout/BottomNav";
import { createAlert } from "@/lib/api/urgences";
import type { AlertType } from "@/lib/types/api";

// ─── UUID festivalier (persisté dans localStorage) ────────────────────────────

const [uuid, setUuid] = useState(() => {
  if (typeof window === "undefined") return ""
  let id = localStorage.getItem("vd_uuid")
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem("vd_uuid", id)
  }
  return id
})

// ─── Config types d'alerte ────────────────────────────────────────────────────

const ALERT_TYPES: { type: AlertType; label: string; emoji: string; color: string; description: string }[] = [
  { type: "MEDICAL",   label: "Urgence médicale",  emoji: "🚑", color: "#FF3B30", description: "Malaise, blessure, besoin de soins" },
  { type: "SECURITY",  label: "Sécurité",          emoji: "🛡️", color: "#FF9500", description: "Agression, vol, comportement suspect" },
  { type: "FIRE",      label: "Incendie",          emoji: "🔥", color: "#FF3B30", description: "Fumée, flammes, danger immédiat" },
  { type: "LOST",      label: "Personne perdue",   emoji: "🧍", color: "#5856D6", description: "Enfant ou personne égarée" },
  { type: "TECHNICAL", label: "Problème technique",emoji: "⚙️", color: "#34C759", description: "Panne, infrastructure, équipement" },
  { type: "OTHER",     label: "Autre",             emoji: "📢", color: "#8E8E93", description: "Autre type de signalement" },
];

// ─── Page ────────────────────────────────────────────────────────────────────

type Step = "type" | "details" | "success";

export default function UrgencesPage() {
  const router  = useRouter();
  const [step, setStep]               = useState<Step>("type");
  const [selectedType, setSelectedType] = useState<AlertType | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription]= useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [uuid, setUuid]               = useState("");

  useEffect(() => { setUuid(getFestivalierUUID()); }, []);

  const selectedConfig = ALERT_TYPES.find((t) => t.type === selectedType);

  const handleSubmit = async () => {
    if (!uuid) {
      setError("Identifiant manquant, rechargez la page.")
      return
    }
    setError(null);
    setLoading(true);
    try {
      const res = await createAlert({
        uuid,
        displayName: displayName.trim(),
        type:        selectedType,
        description: description.trim(),
      });
      if (res.success) {
        setStep("success");
      } else {
        setError(res.message || "Erreur lors de l'envoi. Réessayez.");
      }
    } catch {
      setError("Impossible d'envoyer l'alerte. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#151419] pb-28">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#151419]/95 backdrop-blur border-b border-white/[0.06] px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button onClick={() => router.back()} className="text-white/60 hover:text-white transition-colors p-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
          <h1 className="text-white font-semibold">Signaler une urgence</h1>
          <div className="w-7" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6">
        <AnimatePresence mode="wait">
          {/* ── Étape 1 : choix du type ── */}
          {step === "type" && (
            <motion.div
              key="type"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🆘</div>
                <p className="text-white/60 text-sm">Quel type d'urgence souhaitez-vous signaler ?</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {ALERT_TYPES.map(({ type, label, emoji, color, description: desc }) => (
                  <button
                    key={type}
                    onClick={() => { setSelectedType(type); setStep("details"); }}
                    className="relative flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] active:scale-95 transition-all text-left"
                    style={{ borderColor: `${color}30` }}
                  >
                    <div className="text-2xl">{emoji}</div>
                    <span className="text-white text-sm font-medium text-center leading-tight">{label}</span>
                    <span className="text-white/40 text-xs text-center leading-tight">{desc}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Étape 2 : détails ── */}
          {step === "details" && selectedConfig && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              {/* Type sélectionné */}
              <div
                className="flex items-center gap-3 p-3 rounded-xl border"
                style={{ borderColor: `${selectedConfig.color}40`, backgroundColor: `${selectedConfig.color}10` }}
              >
                <span className="text-2xl">{selectedConfig.emoji}</span>
                <div>
                  <p className="text-white font-medium text-sm">{selectedConfig.label}</p>
                  <p className="text-white/50 text-xs">{selectedConfig.description}</p>
                </div>
                <button onClick={() => setStep("type")} className="ml-auto text-white/40 hover:text-white/70">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              {/* Nom / pseudo */}
              <div className="space-y-2">
                <label className="text-white/70 text-sm font-medium">Votre nom ou pseudo *</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Pour qu'on puisse vous retrouver facilement"
                  className="w-full bg-white/[0.05] border border-white/[0.10] rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-white/30 transition-colors"
                  maxLength={100}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-white/70 text-sm font-medium">Décrivez la situation *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Donnez le maximum de détails : lieu précis, nombre de personnes concernées…"
                  rows={4}
                  className="w-full bg-white/[0.05] border border-white/[0.10] rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-white/30 transition-colors resize-none"
                  maxLength={500}
                />
                <p className="text-white/30 text-xs text-right">{description.length}/500</p>
              </div>

              {/* Erreur */}
              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              )}

              {/* Bouton */}
              <button
                onClick={handleSubmit}
                disabled={loading || !displayName.trim() || !description.trim()}
                className="w-full py-4 rounded-2xl text-white font-semibold text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: selectedConfig.color }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                    </svg>
                    Envoi en cours…
                  </>
                ) : (
                  <>
                    <span>{selectedConfig.emoji}</span>
                    Envoyer le signalement
                  </>
                )}
              </button>

              <p className="text-white/30 text-xs text-center">
                Votre signalement sera transmis immédiatement aux équipes de sécurité du festival.
              </p>
            </motion.div>
          )}

          {/* ── Étape 3 : succès ── */}
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
                className="text-6xl"
              >
                ✅
              </motion.div>
              <div>
                <h2 className="text-white text-xl font-bold mb-2">Signalement envoyé</h2>
                <p className="text-white/60 text-sm leading-relaxed">
                  Votre alerte a été transmise aux équipes de sécurité du festival Vodun Days.
                  Restez visible et accessible.
                </p>
              </div>

              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 text-left space-y-2">
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <span>{selectedConfig?.emoji}</span>
                  <span>{selectedConfig?.label}</span>
                </div>
                <p className="text-white/50 text-xs">{description}</p>
              </div>

              <div className="space-y-3 pt-4">
                <p className="text-white/40 text-xs">
                  📞 Urgences nationales : <strong className="text-white/60">117 / 118</strong>
                </p>
                <button
                  onClick={() => { setStep("type"); setSelectedType(null); setDisplayName(""); setDescription(""); }}
                  className="w-full py-3 rounded-2xl border border-white/[0.10] text-white/70 text-sm hover:bg-white/[0.05] transition-colors"
                >
                  Faire un autre signalement
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="w-full py-3 rounded-2xl bg-white/[0.08] text-white text-sm font-medium hover:bg-white/[0.12] transition-colors"
                >
                  Retour à l'accueil
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
