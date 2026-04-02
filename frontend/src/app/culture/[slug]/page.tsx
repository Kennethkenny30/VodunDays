"use client";

import { use, Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Clock, Star, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/layout/BottomNav";
import type { CulturalSite, Program } from "@/lib/types";

// Mock data - same as pedagogie page
const culturalSites: CulturalSite[] = [
  {
    id: "1",
    name: "Place Maro",
    slug: "place-maro",
    entities: ["Egungun"],
    description:
      "La Place Maro est un lieu emblématique de Ouidah où se déroulent les cérémonies Egungun. Ces masques ancestraux représentent les esprits des ancêtres revenus pour guider et bénir les vivants lors de rituels millénaires.",
    fullDescription:
      "La Place Maro est un lieu emblématique de Ouidah où se déroulent les cérémonies Egungun. Ces masques ancestraux représentent les esprits des ancêtres revenus pour guider et bénir les vivants lors de rituels millénaires.\n\nLes Egungun sont des masques sacrés portés par des initiés lors des cérémonies funéraires et des festivals. Ils incarnent les esprits des défunts qui reviennent temporairement dans le monde des vivants pour apporter conseils, bénédictions et parfois avertissements.\n\nPendant les Vodun Days, la Place Maro devient le théâtre de danses spectaculaires où les Egungun, vêtus de tissus multicolores tourbillonnants, communiquent avec la communauté à travers des mouvements rituels chargés de symbolisme.\n\nLa cérémonie Egungun est l'une des plus impressionnantes du festival. Les masques, souvent imposants et richement décorés, tournoient dans des danses hypnotiques au son des tambours sacrés. Chaque mouvement, chaque geste est codifié et porteur de sens pour les initiés.",
    image: "/images/vodundays-3.jpg",
    thematicColor: "#8B4513",
    coordinates: { latitude: 6.3623, longitude: 2.0844 },
  },
  {
    id: "2",
    name: "Esplanade du Fort Français",
    slug: "fort-francais",
    entities: ["Zangbeto", "Terreiros du Brésil", "Kao"],
    description:
      "L'Esplanade du Fort Français accueille les cérémonies Zangbeto, gardiens nocturnes de la tradition Yoruba. Les Terreiros du Brésil témoignent des liens historiques entre le Bénin et le Brésil à travers la diaspora.",
    fullDescription:
      "L'Esplanade du Fort Français accueille les cérémonies Zangbeto, gardiens nocturnes de la tradition Yoruba. Les Terreiros du Brésil témoignent des liens historiques entre le Bénin et le Brésil à travers la diaspora.\n\nLes Zangbeto, reconnaissables à leurs structures de paille coniques, sont les gardiens de la nuit dans la tradition Yoruba. Ils patrouillent les villages pour maintenir l'ordre et éloigner les malfaiteurs et les mauvais esprits.\n\nLes Terreiros du Brésil rappellent la connexion spirituelle entre le Bénin et le Brésil, née du commerce triangulaire. Ces espaces sacrés perpétuent les rituels vodun transportés par les esclaves africains et revenus enrichis d'influences brésiliennes.\n\nLe Fort Français, construit au XVIIe siècle, servait de comptoir pour le commerce des esclaves. Aujourd'hui, son esplanade est un lieu de mémoire où les cérémonies Zangbeto rappellent la résilience des traditions africaines face à l'oppression coloniale.",
    image: "/images/vodundays-7.jpg",
    thematicColor: "#2E8B57",
    coordinates: { latitude: 6.3612, longitude: 2.0889 },
  },
  {
    id: "3",
    name: "Place Ninsouxwé",
    slug: "place-ninsouwxe",
    entities: ["Zomadonou", "Ninsouxwé"],
    description:
      "Place sacrée dédiée aux divinités Zomadonou et Ninsouxwé, protectrices de la ville. Les cérémonies qui s'y déroulent perpétuent des traditions ancestrales transmises de génération en génération.",
    fullDescription:
      "Place sacrée dédiée aux divinités Zomadonou et Ninsouxwé, protectrices de la ville. Les cérémonies qui s'y déroulent perpétuent des traditions ancestrales transmises de génération en génération.\n\nZomadonou et Ninsouxwé sont des vodun protecteurs intimement liés à l'histoire de Ouidah. Ils veillent sur la communauté et sont invoqués pour assurer prospérité et protection contre les forces néfastes.\n\nLes rituels pratiqués sur cette place incluent des offrandes, des libations et des danses sacrées accompagnées de tambours rituels dont les rythmes codifiés transmettent des messages aux divinités.\n\nChaque année, les gardiens de ces traditions se réunissent pour honorer ces divinités protectrices lors de cérémonies spectaculaires qui attirent des milliers de visiteurs du monde entier.",
    image: "/images/vodundays-9.jpg",
    thematicColor: "#4B0082",
    coordinates: { latitude: 6.3598, longitude: 2.0856 },
  },
  {
    id: "4",
    name: "Forêt sacrée de Kpassè",
    slug: "foret-kpasse",
    entities: ["Thron", "Hounvè", "Kabada", "Koku"],
    description:
      "La Forêt sacrée de Kpassè abrite les divinités Thron, Hounvè, Kabada et Koku. Ce sanctuaire naturel est un lieu de recueillement et de communion avec les forces spirituelles de la nature et des ancêtres.",
    fullDescription:
      "La Forêt sacrée de Kpassè abrite les divinités Thron, Hounvè, Kabada et Koku. Ce sanctuaire naturel est un lieu de recueillement et de communion avec les forces spirituelles de la nature et des ancêtres.\n\nCette forêt légendaire tire son nom du roi Kpassè, fondateur de Ouidah, qui selon la légende se serait transformé en arbre pour échapper à ses ennemis. L'arbre iroko géant au centre de la forêt serait sa forme actuelle.\n\nLes quatre vodun qui y résident représentent différentes forces naturelles et spirituelles. La forêt est un sanctuaire où se pratiquent des initiations et des rituels de guérison depuis des siècles.\n\nLa forêt abrite une biodiversité exceptionnelle protégée par son caractère sacré. Les arbres centenaires, les lianes et la faune diverse créent une atmosphère mystique propice à la méditation et à la connexion spirituelle.",
    image: "/images/vodundays-10.jpg",
    thematicColor: "#228B22",
    coordinates: { latitude: 6.3578, longitude: 2.0912 },
  },
  {
    id: "5",
    name: "Temple Mami Plage",
    slug: "temple-mami",
    entities: ["Mami", "Dan"],
    description:
      "Le Temple Mami Plage est consacré à Mami Wata, la déesse des eaux. Les cérémonies honorent cette divinité puissante qui règne sur les océans et apporte prospérité à ceux qui la vénèrent.",
    fullDescription:
      "Le Temple Mami Plage est consacré à Mami Wata, la déesse des eaux. Les cérémonies honorent cette divinité puissante qui règne sur les océans et apporte prospérité à ceux qui la vénèrent.\n\nMami Wata, souvent représentée comme une sirène, est l'une des divinités les plus populaires du panthéon vodun. Elle est associée à la beauté, à la richesse et à la fertilité, mais aussi au danger des eaux profondes.\n\nDan, le serpent arc-en-ciel, est étroitement lié à Mami Wata. Il représente le mouvement, la continuité et la connexion entre le ciel et la terre. Les cérémonies au temple incluent des offrandes de parfums, de poudre blanche et d'objets brillants.\n\nLe temple, situé face à l'océan Atlantique, offre un cadre spectaculaire pour les cérémonies. Les vagues qui viennent se briser sur la plage semblent répondre aux invocations des prêtres et prêtresses.",
    image: "/images/vodundays-11.jpg",
    thematicColor: "#00CED1",
    coordinates: { latitude: 6.3545, longitude: 2.0978 },
  },
  {
    id: "6",
    name: "Couvent Sakpata",
    slug: "couvent-sakpata",
    entities: ["Sakpata"],
    description:
      "Le Couvent Sakpata est dédié au vodun de la terre et de la variole. Sakpata est une divinité redoutée et respectée, garante de la justice divine et de l'équilibre entre le monde visible et invisible.",
    fullDescription:
      "Le Couvent Sakpata est dédié au vodun de la terre et de la variole. Sakpata est une divinité redoutée et respectée, garante de la justice divine et de l'équilibre entre le monde visible et invisible.\n\nSakpata est le vodun de la terre, des maladies de peau et particulièrement de la variole. Il punit les transgresseurs des lois sacrées mais peut aussi guérir ceux qui l'honorent correctement.\n\nLe couvent est un lieu d'initiation où les adeptes apprennent les secrets de la pharmacopée traditionnelle et les rituels propitiatoires. Pendant les Vodun Days, des cérémonies spectaculaires y sont organisées avec des adeptes couverts de kaolin blanc.\n\nLes initiés de Sakpata sont reconnaissables à leurs scarifications rituelles et à leurs vêtements traditionnels. Ils détiennent des connaissances ancestrales sur les plantes médicinales et les rituels de guérison.",
    image: "/images/vodundays-12.jpg",
    thematicColor: "#8B0000",
    coordinates: { latitude: 6.3556, longitude: 2.0934 },
  },
];

// Mock programs associated with sites
const mockPrograms: Program[] = [
  {
    id: "1",
    title: "Cérémonie d'Ouverture",
    description: "Cérémonie traditionnelle d'ouverture du festival",
    type: "RITUAL",
    startTime: "09:00",
    endTime: "11:30",
    location: "Place Maro",
    rating: 5.0,
    image: "/images/vodundays-3.jpg",
    isLive: false,
    day: 1,
    siteId: "1",
  },
  {
    id: "2",
    title: "Danse Zangbéto",
    description: "Spectacle de danse traditionnelle Zangbéto",
    type: "ANIMATION",
    startTime: "14:30",
    endTime: "16:00",
    location: "Esplanade du Fort Français",
    rating: 4.8,
    image: "/images/vodundays-7.jpg",
    isLive: false,
    day: 1,
    siteId: "2",
  },
  {
    id: "3",
    title: "Danse des Egungun",
    description: "Représentation des masques Egungun",
    type: "RITUAL",
    startTime: "10:00",
    endTime: "12:00",
    location: "Place Maro",
    rating: 4.9,
    image: "/images/vodundays-10.jpg",
    isLive: false,
    day: 2,
    siteId: "1",
  },
  {
    id: "4",
    title: "Cérémonie Sakpata",
    description: "Cérémonie dédiée au vodun Sakpata",
    type: "RITUAL",
    startTime: "14:00",
    endTime: "16:30",
    location: "Couvent Sakpata",
    rating: 5.0,
    image: "/images/vodundays-13.jpg",
    isLive: false,
    day: 3,
    siteId: "6",
  },
];

function MiniProgramCard({ program }: { program: Program }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-3 p-3 rounded-xl",
        "bg-white/[0.04] border border-white/[0.06]",
        "hover:bg-white/[0.06] transition-colors"
      )}
    >
      {/* Thumbnail */}
      <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
        <Image
          src={program.image}
          alt={program.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-[13px] font-semibold text-white truncate">
          {program.title}
        </h4>
        <p className="text-[11px] text-[#878787] mt-0.5 line-clamp-1">
          {program.description}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <span className="flex items-center gap-1 text-[10px] text-[#878787]">
            <Clock className="w-3 h-3" />
            {program.startTime} - {program.endTime}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-[#F56E0F]">
            <Star className="w-3 h-3 fill-current" />
            {program.rating}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

function CultureDetailContent({ slug }: { slug: string }) {
  const [showFullContent, setShowFullContent] = useState(false);
  const site = culturalSites.find((s) => s.slug === slug);

  if (!site) {
    return (
      <div className="min-h-screen bg-[#151419] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-white mb-2">Site non trouvé</h1>
          <Link href="/pedagogie" className="text-[#F56E0F] text-sm">
            Retour aux contenus pédagogiques
          </Link>
        </div>
      </div>
    );
  }

  const associatedPrograms = mockPrograms.filter((p) => p.siteId === site.id);
  const fullDescription = (site as CulturalSite & { fullDescription?: string }).fullDescription || site.description;

  return (
    <div className="min-h-screen bg-[#151419] relative">
      {/* Full-screen hero image - inspired by f2.jpg design */}
      <div className="fixed inset-0 z-0">
        {site.image ? (
          <Image
            src={site.image}
            alt={site.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: site.thematicColor
                ? `linear-gradient(135deg, ${site.thematicColor}, #151419)`
                : "linear-gradient(135deg, #F56E0F, #151419)",
            }}
          />
        )}
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#151419]" />
      </div>

      {/* Back button - floating */}
      <Link
        href="/pedagogie"
        className={cn(
          "fixed top-4 left-4 z-50",
          "flex items-center gap-1.5 px-3 py-2 rounded-full",
          "bg-black/40 backdrop-blur-md",
          "text-white text-[13px] font-medium",
          "hover:bg-black/60 transition-colors",
          "border border-white/10"
        )}
        style={{ marginTop: "max(0px, env(safe-area-inset-top))" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Link>

      {/* Bottom sheet card - inspired by f2.jpg design */}
      <div className="relative z-10 min-h-screen flex flex-col justify-end">
        {/* Spacer to push card down */}
        <div className="flex-1 min-h-[35vh]" />
        
        {/* Card container */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={cn(
            "rounded-t-[32px] overflow-hidden",
            "bg-[#1B1B1E]/95 backdrop-blur-xl",
            "border-t border-white/10",
            "shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
          )}
        >
          {/* Handle indicator */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 rounded-full bg-white/20" />
          </div>

          {/* Entity tag - like the "Мастер спорта" badge */}
          <div className="px-5 pb-2">
            <div className="flex flex-wrap gap-2">
              {site.entities.map((entity) => (
                <span
                  key={entity}
                  className={cn(
                    "px-3 py-1 rounded-full",
                    "bg-[rgba(245,110,15,0.15)] text-[#F56E0F]",
                    "border border-[rgba(245,110,15,0.3)]",
                    "text-[11px] font-bold"
                  )}
                >
                  {entity}
                </span>
              ))}
            </div>
          </div>

          {/* Site name - large bold title like in f2.jpg */}
          <div className="px-5 pt-2 pb-4">
            <h1 className="text-[28px] font-black text-white leading-tight tracking-tight">
              {site.name}
            </h1>
          </div>

          {/* Divider */}
          <div className="mx-5 h-px bg-white/10" />

          {/* Content section */}
          <div className="px-5 py-5">
            <h2 className="text-[13px] uppercase tracking-wider text-[#878787] mb-3">
              A propos
            </h2>
            
            {/* Description with expand/collapse - short preview by default */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {!showFullContent ? (
                  <motion.div
                    key="short"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-[14px] text-[#c0c0c0] leading-relaxed">
                      {site.description}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-[14px] text-[#c0c0c0] leading-relaxed whitespace-pre-line">
                      {fullDescription}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Toggle button */}
              <button
                onClick={() => setShowFullContent(!showFullContent)}
                className={cn(
                  "mt-4 flex items-center gap-1.5",
                  "text-[#F56E0F] text-[13px] font-semibold",
                  "hover:text-[#ff8533] transition-colors"
                )}
              >
                {showFullContent ? (
                  <>
                    Voir moins
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Lire la suite
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-5 h-px bg-white/10" />

          {/* Location section */}
          {site.coordinates && (
            <div className="px-5 py-5">
              <h2 className="text-[13px] uppercase tracking-wider text-[#878787] mb-3">
                Localisation
              </h2>
              <p className="text-[13px] text-[#878787] mb-4">
                {site.coordinates.latitude.toFixed(4)}° N, {site.coordinates.longitude.toFixed(4)}° E
              </p>
              <Link
                href={`/carte?site=${site.slug}`}
                className={cn(
                  "flex items-center justify-center gap-2",
                  "w-full py-3.5 rounded-xl",
                  "bg-[#F56E0F] text-white",
                  "text-[14px] font-bold",
                  "hover:bg-[#E65D00] active:scale-[0.98]",
                  "transition-all duration-150"
                )}
              >
                <MapPin className="w-4 h-4" />
                Voir sur la carte
              </Link>
            </div>
          )}

          {/* Divider */}
          <div className="mx-5 h-px bg-white/10" />

          {/* Associated programs section */}
          <div className="px-5 py-5 pb-28">
            <h2 className="text-[13px] uppercase tracking-wider text-[#878787] mb-3">
              Evenements associes
            </h2>
            {associatedPrograms.length > 0 ? (
              <div className="space-y-3">
                {associatedPrograms.map((program) => (
                  <MiniProgramCard key={program.id} program={program} />
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-[#878787] text-center py-6">
                Aucun evenement programme sur ce site.
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}

export default function CultureDetailPage({ params }: PageProps) {
  const { slug } = use(params);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#151419] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#F56E0F] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CultureDetailContent slug={slug} />
    </Suspense>
  );
}
