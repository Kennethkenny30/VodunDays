import type { CulturalSite } from "@/lib/types"

export type CulturalSiteExtended = CulturalSite & {
  fullDescription?: string
}

export const culturalSites: CulturalSiteExtended[] = [
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
]
