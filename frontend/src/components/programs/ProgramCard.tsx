"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, CalendarPlus, CalendarCheck, AlertTriangle, Music2, ChevronDown } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import type { Program, ProgramType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { usePlanner } from "@/providers/FestivalPlannerProvider";
import { localize } from "@/lib/i18n/localize";

// Couleurs de badge (text via CSS vars pour adaptation clair/sombre)
const programTypeBadgeStyles: Record<ProgramType, { bg: string; textVar: string; border: string }> = {
  RITUAL:     { bg: "rgba(245, 110, 15, 0.25)", textVar: "--vd-badge-ritual",     border: "rgba(245, 110, 15, 0.40)" },
  ANIMATION:  { bg: "rgba(245, 110, 15, 0.18)", textVar: "--vd-badge-animation",  border: "rgba(245, 110, 15, 0.32)" },
  CONCERT:    { bg: "rgba(245, 110, 15, 0.13)", textVar: "--vd-badge-concert",    border: "rgba(245, 110, 15, 0.26)" },
  EXHIBITION: { bg: "rgba(245, 110, 15, 0.09)", textVar: "--vd-badge-exhibition", border: "rgba(245, 110, 15, 0.20)" },
  CONFERENCE: { bg: "rgba(245, 110, 15, 0.06)", textVar: "--vd-badge-conference", border: "rgba(245, 110, 15, 0.15)" },
};

// Flou progressif (etat replie)
//
// 3 couches de backdrop-blur croissant, chacune masquee (mask-image) pour
// ne se reveler que sur une portion de plus en plus etroite au fond de
// l'image - l'effet "flou qui remonte depuis le bas" de la reference.
// La derniere couche est un lavage degrade qui se termine exactement sur
// la couleur de la card (--vd-card-surface) : c'est cette meme couleur
// qui sert de fond au panneau deploye juste en dessous, donc la jonction
// entre l'image et le panneau est invisible - effet de fusion progressive.
function ProgressiveBlur() {
  return (
    <div className="absolute inset-x-0 bottom-0 h-[92%] pointer-events-none z-1">
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          maskImage: "linear-gradient(to top, black 0%, black 30%, transparent 64%)",
          WebkitMaskImage: "linear-gradient(to top, black 0%, black 30%, transparent 64%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          maskImage: "linear-gradient(to top, black 0%, black 17%, transparent 44%)",
          WebkitMaskImage: "linear-gradient(to top, black 0%, black 17%, transparent 44%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(26px)",
          WebkitBackdropFilter: "blur(26px)",
          maskImage: "linear-gradient(to top, black 0%, black 8%, transparent 26%)",
          WebkitMaskImage: "linear-gradient(to top, black 0%, black 8%, transparent 26%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, var(--vd-card-surface) 0%, rgba(0,0,0,0.62) 20%, rgba(0,0,0,0.24) 48%, transparent 82%)",
        }}
      />
    </div>
  );
}

// Ripple

function AddRipple({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.span
          key="ripple"
          initial={{ scale: 0.6, opacity: 0.7 }}
          animate={{ scale: 2.2, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="absolute inset-0 rounded-lg bg-[#F56E0F]/30 pointer-events-none"
        />
      )}
    </AnimatePresence>
  );
}

// Creneau additionnel (regroupement)
//
// Un evenement avec plusieurs creneaux le meme jour n'affiche qu'une seule
// ProgramCard (le premier creneau) - les autres apparaissent ici, dans le
// panneau deploye, chacun avec son propre etat planner independant (chaque
// creneau est un Program a part entiere, avec son propre id).
function SlotRow({ slot }: { slot: Program }) {
  const t = useTranslations("programme");
  const { addToAgenda, removeFromAgenda, isInAgenda, conflicts } = usePlanner();
  const inAgenda    = isInAgenda(slot.id);
  const hasConflict = conflicts.includes(slot.id);
  const [ripple, setRipple] = useState(false);

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation();
    if (inAgenda) {
      removeFromAgenda(slot.id);
    } else {
      addToAgenda(slot);
      setRipple(true);
      setTimeout(() => setRipple(false), 500);
    }
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 py-2 px-2.5 rounded-lg",
        hasConflict ? "bg-amber-500/10" : "bg-white/5",
      )}
    >
      <span className="flex items-center gap-1.5 text-[12px] font-semibold text-foreground/80">
        {hasConflict && <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />}
        {slot.startTime} – {slot.endTime}
      </span>

      <motion.button
        whileTap={{ scale: 0.86 }}
        onClick={handleToggle}
        aria-label={inAgenda ? t("card.removeFromAgenda") : t("card.addToAgenda")}
        className={cn(
          "relative py-1 px-2.5 rounded-lg overflow-hidden shrink-0",
          "flex items-center justify-center",
          "border transition-all duration-300",
          inAgenda
            ? "bg-[rgba(245,110,15,0.18)] border-[rgba(245,110,15,0.4)]"
            : "bg-vd-inner-tint border-vd-border-soft",
        )}
      >
        <AddRipple active={ripple} />
        <AnimatePresence mode="wait" initial={false}>
          {inAgenda ? (
            <motion.span
              key="check"
              initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <CalendarCheck className="w-3.5 h-3.5 text-[#F56E0F]" />
            </motion.span>
          ) : (
            <motion.span
              key="plus"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <CalendarPlus className="w-3.5 h-3.5 text-muted-foreground" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

// Lineup concert
//
// Pour les evenements de type CONCERT, le panneau deploye remplace la liste
// simple des creneaux (SlotRow) par une "programmation" plus riche : chaque
// creneau devient un bloc avec les artistes qui s'y produisent (photo
// circulaire, nom, genre). Un concert se planifie en un seul geste : le
// bouton planner reste unique, porte par la card elle-meme (etat replie),
// et ajoute/retire tous les creneaux de l'evenement ensemble - il n'y a
// aucun bouton par creneau ni par artiste dans la lineup.

// Photo circulaire avec repli sur les initiales si l'image manque/échoue -
// evite tout avatar casse, jamais de placeholder visible a l'ecran.
function ArtistAvatar({ name, imageUrl }: { name: string; imageUrl?: string | null }) {
  const [errored, setErrored] = useState(false);
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  if (imageUrl && !errored) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={name}
        className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-[rgba(245,110,15,0.3)]"
        onError={() => setErrored(true)}
      />
    );
  }

  return (
    <div className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-[13px] font-bold text-[#FFC08A] bg-[rgba(245,110,15,0.18)] ring-2 ring-[rgba(245,110,15,0.3)]">
      {initials || "?"}
    </div>
  );
}

// Ligne d'un creneau dans la lineup : purement informative (heure + artistes
// + indicateur de conflit eventuel). Pas de bouton planner ici - un concert
// se planifie en un seul geste (voir handleAgendaToggle sur la card), pas
// creneau par creneau : le detail horaire aide juste a se reperer.
function LineupSlotRow({ slot }: { slot: Program }) {
  const t = useTranslations("programme");
  const { conflicts } = usePlanner();
  const hasConflict = conflicts.includes(slot.id);
  const artists = slot.artists ?? [];

  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden border transition-colors duration-300",
        hasConflict ? "border-amber-500/40 bg-amber-500/[0.06]" : "border-white/8 bg-white/[0.035]",
      )}
    >
      {/* Creneau de passage sur scene */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5">
        {hasConflict && <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />}
        <span className="text-[12px] font-bold text-[#F56E0F]">
          {slot.startTime} – {slot.endTime}
        </span>
      </div>

      {/* Artistes programmes sur ce creneau */}
      {artists.length > 0 ? (
        <div className="divide-y divide-white/5">
          {artists.map((artist) => (
            <div key={artist.id} className="flex items-center gap-3 px-3 py-2.5">
              <ArtistAvatar name={artist.name} imageUrl={artist.imageUrl} />
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-foreground truncate">{artist.name}</p>
                {artist.genre && (
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide truncate">
                    {artist.genre}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="px-3 py-2.5 text-[11px] text-muted-foreground italic">
          {t("card.lineupTba")}
        </p>
      )}
    </div>
  );
}

function ArtistLineup({ slots }: { slots: Program[] }) {
  const sorted = [...slots].sort((a, b) => a.startTime.localeCompare(b.startTime));
  return (
    <div className="space-y-2.5">
      {sorted.map((slot, i) => (
        <motion.div
          key={slot.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <LineupSlotRow slot={slot} />
        </motion.div>
      ))}
    </div>
  );
}

// ProgramCard

interface ProgramCardProps {
  program: Program;
  index?: number;
  highlighted?: boolean; // Ciblé par la recherche : scroll + surbrillance temporaire
}

export function ProgramCard({ program, index = 0, highlighted = false }: ProgramCardProps) {
  const router = useRouter();
  const locale = useLocale();
  const tEnum = useTranslations("enums");
  const t = useTranslations("programme");
  const { addToAgenda, removeFromAgenda, isInAgenda, conflicts } = usePlanner();

  const badgeStyle = programTypeBadgeStyles[program.type];
  const [ripple, setRipple]     = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Concert avec au moins un artiste renseigne (sur le creneau principal ou
  // un otherSlot) : le panneau deploye bascule sur la lineup enrichie plutot
  // que la liste de creneaux nue. Sans artiste connu, on garde le rendu
  // standard (evite une section "programmation" vide pour un concert TBA).
  const allEventSlots = [program, ...(program.otherSlots ?? [])];
  const isConcertWithLineup =
    program.type === "CONCERT" && allEventSlots.some((s) => s.artists && s.artists.length > 0);

  // Un concert se planifie en un seul geste : le bouton (unique, porte par
  // la card) agit sur TOUS les creneaux de l'evenement a la fois - "in
  // agenda" n'est vrai que si chacun y est deja, et le toggle ajoute/retire
  // le lot complet. Pour tout autre type, comportement inchange (un seul
  // creneau concerne, le principal).
  const inAgenda = isConcertWithLineup
    ? allEventSlots.every((s) => isInAgenda(s.id))
    : isInAgenda(program.id);

  const hasConflict = conflicts.includes(program.id)
    || (program.otherSlots?.some((slot) => conflicts.includes(slot.id)) ?? false);

  const ref      = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  // Scroll vers la carte ciblée par la recherche, après l'animation d'entrée de la liste
  useEffect(() => {
    if (!highlighted) return;
    const t = setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 350);
    return () => clearTimeout(t);
  }, [highlighted]);

  function handleAgendaToggle(e: React.MouseEvent) {
    e.stopPropagation();
    if (isConcertWithLineup) {
      if (inAgenda) {
        allEventSlots.forEach((s) => removeFromAgenda(s.id));
      } else {
        allEventSlots.forEach((s) => { if (!isInAgenda(s.id)) addToAgenda(s); });
        setRipple(true);
        setTimeout(() => setRipple(false), 500);
      }
      return;
    }
    if (inAgenda) {
      removeFromAgenda(program.id);
    } else {
      addToAgenda(program);
      setRipple(true);
      setTimeout(() => setRipple(false), 500);
    }
  }

  /**
   * Deep-link vers la carte avec focal sur le site de l'événement.
   *
   * Stratégie URL :
   *   /carte?siteId=<uuid>            → site BDD (priorité)
   *   /carte?lat=<n>&lng=<n>&name=<s> → fallback coords brutes si pas de siteId
   *
   * CarteMapSection lit ces params au mount et fait flyTo + sélection du marqueur.
   */
  function handleViewOnMap(e: React.MouseEvent) {
    e.stopPropagation();

    if (program.siteId) {
      // Cas nominal : site BDD avec UUID - CarteMapSection le retrouvera dans loadPOIs
      router.push(`/carte?siteId=${program.siteId}`);
      return;
    }

    if (program.siteLat !== null && program.siteLng !== null) {
      // Fallback : on envoie les coordonnées brutes + nom pour un simple flyTo
      const params = new URLSearchParams({
        lat:  String(program.siteLat),
        lng:  String(program.siteLng),
        name: program.location,
      });
      router.push(`/carte?${params.toString()}`);
      return;
    }

    // Dernier recours : on ouvre la carte sans focal
    router.push("/carte");
  }

  function toggleExpanded() {
    setExpanded((v) => !v);
  }

  function handleImageKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleExpanded();
    }
  }

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 28, filter: "blur(4px)" }}
      animate={isInView
        ? { opacity: 1, y: 0, filter: "blur(0px)" }
        : { opacity: 0, y: 28, filter: "blur(4px)" }
      }
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "group relative rounded-[20px] overflow-hidden",
        "bg-vd-card-surface backdrop-blur-md",
        hasConflict
          ? "shadow-[0_4px_28px_rgba(245,158,11,0.25)]"
          : "shadow-[0_4px_24px_rgba(0,0,0,0.25)]",
        "transition-shadow duration-700",
        highlighted && "shadow-[0_0_0_2px_rgba(245,110,15,0.55),0_4px_28px_rgba(245,110,15,0.3)]",
      )}
    >
      {/* Conflict banner */}
      {hasConflict && (
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border-b border-amber-500/20">
          <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wide">
            {t("card.conflict")}
          </span>
        </div>
      )}

      {/* Image + overlay flou - etat replie, toujours visible.
          Seule zone cliquable pour deplier/replier la carte. */}
      <motion.div
        whileTap={{ scale: 0.985 }}
        onClick={toggleExpanded}
        onKeyDown={handleImageKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        className={cn("relative aspect-16/10 overflow-hidden cursor-pointer", hasConflict && "mt-7")}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={program.image}
          alt={program.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.fallback) {
              target.dataset.fallback = "1";
              target.src = "/images/vodundays-3.jpg";
            }
          }}
        />

        {program.isLive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.07 + 0.3, duration: 0.3 }}
            className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-full bg-[#F56E0F] text-[#FBFBFB] text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_2px_12px_rgba(245,110,15,0.5)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBFBFB] animate-pulse" />
            {t("card.live")}
          </motion.div>
        )}

        <ProgressiveBlur />

        {/* Infos essentielles superposees sur le flou : type, horaire, titre,
            lieu, et le seul bouton visible a l'etat replie (ajouter au planner). */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-3">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.08em] mb-2"
            style={{
              backgroundColor: badgeStyle.bg,
              color: "#FFC08A",
              border: `1px solid ${badgeStyle.border}`,
            }}
          >
            {tEnum(`programType.${program.type}` as "programType.RITUAL")}
          </span>

          {/* Titre / heure sur une ligne : l'heure sert de reference pour
              la ligne suivante (lieu / bouton planner) juste en dessous. */}
          <div className="flex items-end justify-between gap-3 mb-1">
            <h3 className="flex-1 min-w-0 text-[15px] font-extrabold text-white leading-tight truncate">
              {localize(program, "title", locale)}
            </h3>
            <span className="shrink-0 text-[12px] font-bold text-[#F56E0F]">
              {isConcertWithLineup
                ? program.startTime
                : `${program.startTime} – ${program.endTime}`}
            </span>
          </div>

          {/* Lieu / bouton planner : l'action rapide se trouve juste sous
              l'info horaire qui la motive. */}
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-1.5 text-[11px] text-white/75 truncate min-w-0">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{localize(program, "location", locale)}</span>
            </p>

            <motion.button
              whileTap={{ scale: 0.86 }}
              onClick={handleAgendaToggle}
              aria-label={inAgenda ? t("card.removeFromAgenda") : t("card.addToAgenda")}
              className={cn(
                "relative shrink-0 py-1 px-2.5 rounded-lg overflow-hidden",
                "flex items-center justify-center",
                "border transition-all duration-300",
                inAgenda
                  ? "bg-[rgba(245,110,15,0.22)] border-[rgba(245,110,15,0.5)] shadow-[0_0_12px_rgba(245,110,15,0.25)]"
                  : "bg-white/10 border-white/25 backdrop-blur-sm",
              )}
            >
              <AddRipple active={ripple} />
              <AnimatePresence mode="wait" initial={false}>
                {inAgenda ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <CalendarCheck className="w-4 h-4 text-[#F56E0F]" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="plus"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <CalendarPlus className="w-4 h-4 text-white" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Indicateur d'expansion - affordance discrete et centree,
              separee de l'action planner pour ne pas preter a confusion. */}
          <div className="flex justify-center mt-1.5">
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm"
            >
              <ChevronDown className="w-3.5 h-3.5 text-white" />
            </motion.span>
          </div>
        </div>
      </motion.div>

      {/* Etat deploye (accordeon) : infos complementaires - meme couleur de
          fond que le lavage de l'image (--vd-card-surface) donc aucune
          bordure ni rupture visuelle, la fusion est continue. Pousse le
          reste de la liste et s'anime en douceur a l'ouverture/fermeture. */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height:  { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
              opacity: { duration: 0.25, ease: "easeOut" },
            }}
            className="overflow-hidden bg-vd-card-surface"
          >
            <div className="px-4 pb-4 pt-1">
              {isConcertWithLineup ? (
                <div className="mb-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-white/50 mb-2">
                    {t("card.lineup")}
                  </p>
                  <ArtistLineup slots={allEventSlots} />
                </div>
              ) : (
                <>
                  {program.otherSlots && program.otherSlots.length > 0 && (
                    <div className="mb-3 space-y-1.5">
                      {program.otherSlots.map((slot) => (
                        <SlotRow key={slot.id} slot={slot} />
                      ))}
                    </div>
                  )}

                  {program.artists && program.artists.length > 0 && (
                    <p className="flex items-center gap-1.5 text-[12px] text-[#F56E0F] mb-3 font-semibold truncate">
                      <Music2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{program.artists.map((a) => a.name).join(", ")}</span>
                    </p>
                  )}
                </>
              )}

              <button
                onClick={handleViewOnMap}
                className={cn(
                  "w-full py-1.5 px-3 rounded-lg flex items-center justify-center gap-2",
                  "text-[11px] font-bold",
                  "bg-[rgba(245,110,15,0.15)] text-[#F56E0F]",
                  "border border-[rgba(245,110,15,0.30)]",
                  "transition-all duration-150 active:scale-[0.97] hover:bg-[rgba(245,110,15,0.25)]"
                )}
              >
                <MapPin className="w-3 h-3" />
                {t("card.viewOnMap")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

// Skeleton

export function ProgramCardSkeleton() {
  return (
    <div className={cn("relative rounded-[20px] overflow-hidden", "bg-vd-card-surface", "shadow-[0_4px_24px_rgba(0,0,0,0.25)]")}>
      <div className="relative aspect-16/10 bg-vd-skeleton animate-pulse">
        <div className="absolute inset-x-0 bottom-0 p-3 space-y-2">
          <div className="h-5 w-16 rounded-full bg-vd-card-surface/60 animate-pulse" />
          <div className="flex items-end justify-between gap-3">
            <div className="h-5 w-1/2 rounded bg-vd-card-surface/60 animate-pulse" />
            <div className="h-4 w-16 rounded bg-vd-card-surface/60 animate-pulse" />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="h-4 w-1/3 rounded bg-vd-card-surface/60 animate-pulse" />
            <div className="h-7 w-10 rounded-lg bg-vd-card-surface/60 animate-pulse" />
          </div>
          <div className="flex justify-center pt-1">
            <div className="w-6 h-6 rounded-full bg-vd-card-surface/60 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}