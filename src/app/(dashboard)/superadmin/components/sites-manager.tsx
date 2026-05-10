"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { EmptyState } from "@/components/dashboard/empty-state"
import { Plus, MoreHorizontal, Pencil, MapPin, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { Site, SiteCreatePayload } from "@/lib/types/api"

// Types de sites disponibles
const siteTypes = [
  { value: "CULTUREL", label: "Culturel" },
  { value: "PLACE_PUBLIQUE", label: "Place publique" },
  { value: "MUSEE", label: "Musée" },
  { value: "PATRIMOINE", label: "Patrimoine" },
  { value: "RELIGIEUX", label: "Religieux" },
]

// Couleurs des badges par type
const typeColors: Record<string, string> = {
  CULTUREL: "bg-blue-500/10 text-blue-500",
  PLACE_PUBLIQUE: "bg-green-500/10 text-green-500",
  MUSEE: "bg-purple-500/10 text-purple-500",
  PATRIMOINE: "bg-amber-500/10 text-amber-500",
  RELIGIEUX: "bg-red-500/10 text-red-500",
}

// Données simulées
const mockSites: Site[] = [
  {
    id: "1",
    name: "Temple des Pythons",
    description: "Temple sacré abritant les pythons royaux",
    latitude: 6.3654,
    longitude: 2.0878,
    type: "RELIGIEUX",
    capacity: 200,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    _count: { events: 5 },
  },
  {
    id: "2",
    name: "Place Chacha",
    description: "Place historique du marché aux esclaves",
    latitude: 6.3612,
    longitude: 2.0834,
    type: "PATRIMOINE",
    capacity: 500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    _count: { events: 3 },
  },
  {
    id: "3",
    name: "Musée d'Histoire de Ouidah",
    description: "Musée retraçant l'histoire de la ville",
    latitude: 6.3678,
    longitude: 2.0912,
    type: "MUSEE",
    capacity: 150,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    _count: { events: 2 },
  },
]

interface SitesManagerProps {
  className?: string
}

// Gestionnaire des sites géographiques
export function SitesManager({ className }: SitesManagerProps) {
  const [sites, setSites] = useState<Site[]>(mockSites)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingSite, setEditingSite] = useState<Site | null>(null)
  const [formData, setFormData] = useState<Partial<SiteCreatePayload>>({})

  const handleOpenSheet = (site?: Site) => {
    if (site) {
      setEditingSite(site)
      setFormData({
        name: site.name,
        description: site.description || "",
        latitude: site.latitude,
        longitude: site.longitude,
        type: site.type,
        capacity: site.capacity,
      })
    } else {
      setEditingSite(null)
      setFormData({})
    }
    setSheetOpen(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.type || !formData.latitude || !formData.longitude) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    if (editingSite) {
      setSites((prev) =>
        prev.map((s) =>
          s.id === editingSite.id
            ? { ...s, ...formData, updatedAt: new Date().toISOString() }
            : s
        )
      )
      toast.success("Site mis à jour avec succès")
    } else {
      const newSite: Site = {
        id: String(Date.now()),
        name: formData.name,
        description: formData.description || null,
        latitude: formData.latitude,
        longitude: formData.longitude,
        type: formData.type,
        capacity: formData.capacity || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _count: { events: 0 },
      }
      setSites((prev) => [...prev, newSite])
      toast.success("Site créé avec succès")
    }

    setSheetOpen(false)
    setFormData({})
    setEditingSite(null)
  }

  const handleDelete = (id: string) => {
    setSites((prev) => prev.filter((s) => s.id !== id))
    toast.success("Site supprimé avec succès")
  }

  return (
    <div className={cn("glass-card p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold tracking-tight">Sites & géographie</h2>
        <Button onClick={() => handleOpenSheet()} size="sm">
          <Plus className="mr-2 size-4" />
          Ajouter un site
        </Button>
      </div>

      {sites.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="Aucun site configuré"
          description="Commencez par ajouter les sites du festival pour pouvoir y associer des événements."
          action={{ label: "Ajouter un site", onClick: () => handleOpenSheet() }}
        />
      ) : (
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">Capacité</TableHead>
                <TableHead className="hidden lg:table-cell">Coordonnées</TableHead>
                <TableHead className="hidden sm:table-cell">Événements</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={typeColors[site.type]}>
                      {siteTypes.find((t) => t.value === site.type)?.label || site.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {site.capacity.toLocaleString("fr-FR")}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell font-mono text-xs">
                    {site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {site._count?.events || 0}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenSheet(site)}>
                          <Pencil className="mr-2 size-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MapPin className="mr-2 size-4" />
                          Voir sur carte
                        </DropdownMenuItem>
                        <ConfirmDialog
                          title="Supprimer le site"
                          description={`Êtes-vous sûr de vouloir supprimer "${site.name}" ? Cette action est irréversible.`}
                          confirmLabel="Supprimer"
                          variant="destructive"
                          onConfirm={() => handleDelete(site.id)}
                          trigger={
                            <DropdownMenuItem
                              variant="destructive"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="mr-2 size-4" />
                              Supprimer
                            </DropdownMenuItem>
                          }
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}

      {/* Sheet de création/édition */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editingSite ? "Modifier le site" : "Nouveau site"}</SheetTitle>
            <SheetDescription>
              {editingSite
                ? "Modifiez les informations du site"
                : "Renseignez les informations du nouveau site"}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nom du site"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description du site"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {siteTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacité</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity || ""}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                placeholder="Capacité maximale"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  value={formData.latitude || ""}
                  onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                  placeholder="6.3654"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  value={formData.longitude || ""}
                  onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                  placeholder="2.0878"
                />
              </div>
            </div>
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={() => setSheetOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>Enregistrer</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
