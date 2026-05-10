"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RoleBadge } from "@/components/dashboard/role-badge"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { EmptyState } from "@/components/dashboard/empty-state"
import { Plus, MoreHorizontal, Pencil, UserX, UserCheck, Trash2, Users, ChevronRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"
import type { User, UserRole, UserUpdatePayload } from "@/lib/types/api"

// Données simulées
const mockUsers: User[] = [
  {
    id: "1",
    email: "superadmin@vodundays.bj",
    role: "SUPER_ADMIN",
    active: true,
    firstname: "Admin",
    lastname: "Principal",
    phone: "+229 97 00 00 00",
    lastLoging: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    createdBy: null,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "culture@vodundays.bj",
    role: "ADMIN",
    active: true,
    firstname: "Marie",
    lastname: "Ahouangan",
    phone: "+229 96 00 00 00",
    lastLoging: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdBy: "1",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    email: "events@vodundays.bj",
    role: "ADMIN",
    active: false,
    firstname: "Jean",
    lastname: "Dossou",
    phone: null,
    lastLoging: null,
    createdBy: "1",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

interface UsersRolesManagerProps {
  className?: string
}

// Gestionnaire des utilisateurs et rôles
export function UsersRolesManager({ className }: UsersRolesManagerProps) {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteStep, setInviteStep] = useState(1)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<Partial<UserUpdatePayload>>({})
  const [inviteData, setInviteData] = useState({ firstname: "", lastname: "", email: "", phone: "", role: "ADMIN" as UserRole })

  const activeUsers = users.filter((u) => u.active)
  const inactiveUsers = users.filter((u) => !u.active)

  const handleOpenSheet = (user: User) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      role: user.role,
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone || "",
    })
    setSheetOpen(true)
  }

  const handleSave = () => {
    if (!editingUser) return

    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUser.id
          ? { ...u, ...formData, updatedAt: new Date().toISOString() }
          : u
      )
    )
    toast.success("Utilisateur mis à jour avec succès")
    setSheetOpen(false)
    setEditingUser(null)
    setFormData({})
  }

  const handleToggleActive = (id: string, active: boolean) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, active, updatedAt: new Date().toISOString() } : u
      )
    )
    toast.success(active ? "Utilisateur réactivé" : "Utilisateur désactivé")
  }

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
    toast.success("Utilisateur supprimé avec succès")
  }

  const handleInvite = () => {
    if (!inviteData.email || !inviteData.firstname || !inviteData.lastname) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    const newUser: User = {
      id: String(Date.now()),
      email: inviteData.email,
      role: inviteData.role,
      active: true,
      firstname: inviteData.firstname,
      lastname: inviteData.lastname,
      phone: inviteData.phone || null,
      lastLoging: null,
      createdBy: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setUsers((prev) => [...prev, newUser])
    toast.success("Invitation envoyée avec succès")
    setInviteDialogOpen(false)
    setInviteStep(1)
    setInviteData({ firstname: "", lastname: "", email: "", phone: "", role: "ADMIN" })
  }

  const getInitials = (firstname: string, lastname: string) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase()
  }

  const formatLastLogin = (date: string | null) => {
    if (!date) return "Jamais connecté"
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })
  }

  const formatCreatedBy = (id: string | null) => {
    if (!id) return "—"
    return `${id.slice(0, 8)}…`
  }

  const renderUserTable = (userList: User[]) => (
    <ScrollArea className="h-[300px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Utilisateur</TableHead>
            <TableHead className="hidden sm:table-cell">Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead className="hidden md:table-cell">Dernière connexion</TableHead>
            <TableHead className="hidden lg:table-cell">Créé par</TableHead>
            <TableHead className="w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userList.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {getInitials(user.firstname, user.lastname)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">
                    {user.firstname} {user.lastname}
                  </span>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">
                {user.email}
              </TableCell>
              <TableCell>
                <RoleBadge role={user.role} />
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                {formatLastLogin(user.lastLoging)}
              </TableCell>
              <TableCell className="hidden lg:table-cell font-mono text-xs text-muted-foreground">
                {formatCreatedBy(user.createdBy)}
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
                    <DropdownMenuItem onClick={() => handleOpenSheet(user)}>
                      <Pencil className="mr-2 size-4" />
                      Modifier
                    </DropdownMenuItem>
                    <ConfirmDialog
                      title={user.active ? "Désactiver l'utilisateur" : "Réactiver l'utilisateur"}
                      description={
                        user.active
                          ? `L'utilisateur ${user.firstname} ${user.lastname} ne pourra plus se connecter.`
                          : `L'utilisateur ${user.firstname} ${user.lastname} pourra à nouveau se connecter.`
                      }
                      confirmLabel={user.active ? "Désactiver" : "Réactiver"}
                      variant={user.active ? "destructive" : "default"}
                      onConfirm={() => handleToggleActive(user.id, !user.active)}
                      trigger={
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          {user.active ? (
                            <>
                              <UserX className="mr-2 size-4" />
                              Désactiver
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 size-4" />
                              Réactiver
                            </>
                          )}
                        </DropdownMenuItem>
                      }
                    />
                    <ConfirmDialog
                      title="Supprimer l'utilisateur"
                      description={`Êtes-vous sûr de vouloir supprimer définitivement ${user.firstname} ${user.lastname} ? Cette action est irréversible.`}
                      confirmLabel="Supprimer"
                      variant="destructive"
                      onConfirm={() => handleDelete(user.id)}
                      trigger={
                        <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
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
  )

  return (
    <div className={cn("glass-card p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold tracking-tight">Gestion des rôles</h2>
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 size-4" />
              Inviter un admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Inviter un administrateur</DialogTitle>
              <DialogDescription>
                Étape {inviteStep} sur 3
              </DialogDescription>
            </DialogHeader>

            {/* Indicateur d'étapes */}
            <div className="flex items-center gap-2 py-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={cn(
                      "size-8 rounded-full flex items-center justify-center text-sm font-medium",
                      inviteStep >= step
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <ChevronRight className={cn(
                      "size-4 mx-1",
                      inviteStep > step ? "text-primary" : "text-muted-foreground"
                    )} />
                  )}
                </div>
              ))}
            </div>

            {inviteStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstname">Prénom *</Label>
                    <Input
                      id="firstname"
                      value={inviteData.firstname}
                      onChange={(e) => setInviteData({ ...inviteData, firstname: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastname">Nom *</Label>
                    <Input
                      id="lastname"
                      value={inviteData.lastname}
                      onChange={(e) => setInviteData({ ...inviteData, lastname: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={inviteData.email}
                    onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={inviteData.phone}
                    onChange={(e) => setInviteData({ ...inviteData, phone: e.target.value })}
                  />
                </div>
              </div>
            )}

            {inviteStep === 2 && (
              <div className="space-y-4">
                <Label>Rôle à attribuer</Label>
                <Select
                  value={inviteData.role}
                  onValueChange={(value) => setInviteData({ ...inviteData, role: value as UserRole })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                    <SelectItem value="ADMIN">Admin Culture</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {inviteData.role === "SUPER_ADMIN"
                    ? "Accès complet à la plateforme et à la configuration système."
                    : "Accès à la gestion du programme culturel et des notifications."}
                </p>
              </div>
            )}

            {inviteStep === 3 && (
              <div className="space-y-4">
                <p className="text-sm">Récapitulatif de l'invitation :</p>
                <div className="rounded-lg border p-4 space-y-2">
                  <p><strong>Nom :</strong> {inviteData.firstname} {inviteData.lastname}</p>
                  <p><strong>Email :</strong> {inviteData.email}</p>
                  {inviteData.phone && <p><strong>Téléphone :</strong> {inviteData.phone}</p>}
                  <p><strong>Rôle :</strong> <RoleBadge role={inviteData.role} /></p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Un email d'invitation sera envoyé à {inviteData.email} avec un lien pour créer son mot de passe.
                </p>
              </div>
            )}

            <DialogFooter>
              {inviteStep > 1 && (
                <Button variant="outline" onClick={() => setInviteStep(inviteStep - 1)}>
                  Précédent
                </Button>
              )}
              {inviteStep < 3 ? (
                <Button onClick={() => setInviteStep(inviteStep + 1)}>
                  Suivant
                </Button>
              ) : (
                <Button onClick={handleInvite}>
                  Envoyer l'invitation
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">
            Actifs
            <Badge variant="secondary" className="ml-2">{activeUsers.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Désactivés
            <Badge variant="secondary" className="ml-2">{inactiveUsers.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          {activeUsers.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Aucun utilisateur actif"
              description="Invitez des administrateurs pour gérer la plateforme."
              action={{ label: "Inviter un admin", onClick: () => setInviteDialogOpen(true) }}
            />
          ) : (
            renderUserTable(activeUsers)
          )}
        </TabsContent>

        <TabsContent value="inactive" className="mt-4">
          {inactiveUsers.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Aucun utilisateur désactivé"
              description="Les utilisateurs désactivés apparaîtront ici."
            />
          ) : (
            renderUserTable(inactiveUsers)
          )}
        </TabsContent>
      </Tabs>

      {/* Sheet de modification */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Modifier l'utilisateur</SheetTitle>
            <SheetDescription>
              Modifiez les informations de {editingUser?.firstname} {editingUser?.lastname}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 py-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-firstname">Prénom</Label>
                <Input
                  id="edit-firstname"
                  value={formData.firstname || ""}
                  onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lastname">Nom</Label>
                <Input
                  id="edit-lastname"
                  value={formData.lastname || ""}
                  onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Téléphone</Label>
              <Input
                id="edit-phone"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role">Rôle</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
              >
                <SelectTrigger id="edit-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  <SelectItem value="ADMIN">Admin Culture</SelectItem>
                </SelectContent>
              </Select>
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
