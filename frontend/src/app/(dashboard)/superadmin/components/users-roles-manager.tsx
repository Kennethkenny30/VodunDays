"use client"

import { useState, useEffect, useCallback } from "react"
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
import { Plus, MoreHorizontal, Pencil, UserX, UserCheck, Trash2, Users, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"
import type { User, UserRole, UserUpdatePayload, UserCreatePayload } from "@/lib/types/api"
import { getUsers, updateUser, deleteUser, toggleUserActive } from "@/lib/api/users"
import { api } from "@/lib/api/client"

interface UsersRolesManagerProps {
  className?: string
}

export function UsersRolesManager({ className }: UsersRolesManagerProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [sheetOpen, setSheetOpen] = useState(false)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteStep, setInviteStep] = useState(1)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<Partial<UserUpdatePayload>>({})
  const [inviteData, setInviteData] = useState<UserCreatePayload & { confirmPassword: string }>({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "ADMIN" as UserRole,
  })

  // ─── Chargement ─────────────────────────────────────────────────────────────

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getUsers()
      if (res.success) {
        setUsers(res.data)
      } else {
        toast.error(res.message || "Impossible de charger les utilisateurs")
      }
    } catch {
      toast.error("Erreur réseau lors du chargement des utilisateurs")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const activeUsers = users.filter((u) => u.active)
  const inactiveUsers = users.filter((u) => !u.active)

  // ─── Édition ────────────────────────────────────────────────────────────────

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

  const handleSave = async () => {
    if (!editingUser) return
    setSaving(true)
    try {
      const res = await updateUser(editingUser.id, formData)
      if (res.success) {
        setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? res.data : u)))
        toast.success("Utilisateur mis à jour avec succès")
        setSheetOpen(false)
        setEditingUser(null)
        setFormData({})
      } else {
        toast.error(res.message || "Erreur lors de la mise à jour")
      }
    } catch {
      toast.error("Erreur réseau")
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      const res = await toggleUserActive(id, active)
      if (res.success) {
        setUsers((prev) => prev.map((u) => (u.id === id ? res.data : u)))
        toast.success(active ? "Utilisateur réactivé" : "Utilisateur désactivé")
      } else {
        toast.error(res.message || "Erreur")
      }
    } catch {
      toast.error("Erreur réseau")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteUser(id)
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u.id !== id))
        toast.success("Utilisateur supprimé avec succès")
      } else {
        toast.error(res.message || "Erreur lors de la suppression")
      }
    } catch {
      toast.error("Erreur réseau")
    }
  }

  const handleInvite = async () => {
    if (!inviteData.email || !inviteData.firstname || !inviteData.lastname || !inviteData.password) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }
    if (inviteData.password !== inviteData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas")
      return
    }
    if (inviteData.password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères")
      return
    }

    setSaving(true)
    try {
      const { confirmPassword: _, ...payload } = inviteData
      const res = await api.post<{ user: User }>("/auth/register", payload)
      if (res.success) {
        setUsers((prev) => [...prev, res.data.user])
        toast.success(`Compte créé pour ${inviteData.firstname} ${inviteData.lastname}`)
        setInviteDialogOpen(false)
        setInviteStep(1)
        setInviteData({ firstname: "", lastname: "", email: "", phone: "", password: "", confirmPassword: "", role: "ADMIN" })
      } else {
        toast.error(res.message || "Erreur lors de la création")
      }
    } catch {
      toast.error("Erreur réseau")
    } finally {
      setSaving(false)
    }
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const getInitials = (firstname: string, lastname: string) =>
    `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase()

  const formatLastLogin = (date: string | null) => {
    if (!date) return "Jamais connecté"
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })
  }

  // ─── Table ────────────────────────────────────────────────────────────────

  const renderUserTable = (userList: User[]) => (
    <ScrollArea className="h-[300px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Utilisateur</TableHead>
            <TableHead className="hidden sm:table-cell">Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead className="hidden md:table-cell">Dernière connexion</TableHead>
            <TableHead className="w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                Aucun utilisateur
              </TableCell>
            </TableRow>
          ) : (
            userList.map((user) => (
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
                            ? `${user.firstname} ${user.lastname} ne pourra plus se connecter.`
                            : `${user.firstname} ${user.lastname} pourra à nouveau se connecter.`
                        }
                        confirmLabel={user.active ? "Désactiver" : "Réactiver"}
                        variant={user.active ? "destructive" : "default"}
                        onConfirm={() => handleToggleActive(user.id, !user.active)}
                        trigger={
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            {user.active ? (
                              <><UserX className="mr-2 size-4" />Désactiver</>
                            ) : (
                              <><UserCheck className="mr-2 size-4" />Réactiver</>
                            )}
                          </DropdownMenuItem>
                        }
                      />
                      <ConfirmDialog
                        title="Supprimer l'utilisateur"
                        description={`Cette action est irréversible. Le compte de ${user.firstname} ${user.lastname} sera définitivement supprimé.`}
                        confirmLabel="Supprimer"
                        variant="destructive"
                        onConfirm={() => handleDelete(user.id)}
                        trigger={
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 size-4" />
                            Supprimer
                          </DropdownMenuItem>
                        }
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  )

  // ─── Render ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground gap-2">
        <Loader2 className="size-4 animate-spin" />
        Chargement des utilisateurs…
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="size-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Gestion des utilisateurs</h2>
          <Badge variant="secondary">{users.length}</Badge>
        </div>
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 size-4" />
              Nouveau compte
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Créer un compte administrateur</DialogTitle>
              <DialogDescription>
                {inviteStep === 1 ? "Informations personnelles" : "Accès et sécurité"}
              </DialogDescription>
            </DialogHeader>

            {inviteStep === 1 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Prénom *</Label>
                    <Input
                      value={inviteData.firstname}
                      onChange={(e) => setInviteData((d) => ({ ...d, firstname: e.target.value }))}
                      placeholder="Kofi"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom *</Label>
                    <Input
                      value={inviteData.lastname}
                      onChange={(e) => setInviteData((d) => ({ ...d, lastname: e.target.value }))}
                      placeholder="Ahouangan"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={inviteData.email}
                    onChange={(e) => setInviteData((d) => ({ ...d, email: e.target.value }))}
                    placeholder="admin@vodundays.bj"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input
                    value={inviteData.phone}
                    onChange={(e) => setInviteData((d) => ({ ...d, phone: e.target.value }))}
                    placeholder="+229 97 00 00 00"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Rôle *</Label>
                  <Select
                    value={inviteData.role}
                    onValueChange={(v) => setInviteData((d) => ({ ...d, role: v as UserRole }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin Culture</SelectItem>
                      <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Mot de passe *</Label>
                  <Input
                    type="password"
                    value={inviteData.password}
                    onChange={(e) => setInviteData((d) => ({ ...d, password: e.target.value }))}
                    placeholder="Minimum 8 caractères"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Confirmer le mot de passe *</Label>
                  <Input
                    type="password"
                    value={inviteData.confirmPassword}
                    onChange={(e) => setInviteData((d) => ({ ...d, confirmPassword: e.target.value }))}
                    placeholder="Répéter le mot de passe"
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              {inviteStep === 2 && (
                <Button variant="ghost" onClick={() => setInviteStep(1)}>
                  Retour
                </Button>
              )}
              {inviteStep === 1 ? (
                <Button
                  onClick={() => setInviteStep(2)}
                  disabled={!inviteData.firstname || !inviteData.lastname || !inviteData.email}
                >
                  Suivant
                </Button>
              ) : (
                <Button onClick={handleInvite} disabled={saving}>
                  {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                  Créer le compte
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs actifs / inactifs */}
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
          {activeUsers.length === 0
            ? <EmptyState title="Aucun utilisateur actif" description="Créez un premier compte administrateur." icon={Users} />
            : renderUserTable(activeUsers)
          }
        </TabsContent>
        <TabsContent value="inactive" className="mt-4">
          {inactiveUsers.length === 0
            ? <EmptyState title="Aucun compte désactivé" description="Tous les comptes sont actifs." icon={Users} />
            : renderUserTable(inactiveUsers)
          }
        </TabsContent>
      </Tabs>

      {/* Sheet d'édition */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Modifier l'utilisateur</SheetTitle>
            <SheetDescription>
              Modifiez les informations du compte.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Prénom</Label>
                <Input
                  value={formData.firstname ?? ""}
                  onChange={(e) => setFormData((d) => ({ ...d, firstname: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input
                  value={formData.lastname ?? ""}
                  onChange={(e) => setFormData((d) => ({ ...d, lastname: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email ?? ""}
                onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Téléphone</Label>
              <Input
                value={formData.phone ?? ""}
                onChange={(e) => setFormData((d) => ({ ...d, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Rôle</Label>
              <Select
                value={formData.role ?? "ADMIN"}
                onValueChange={(v) => setFormData((d) => ({ ...d, role: v as UserRole }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin Culture</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter>
            <Button variant="ghost" onClick={() => setSheetOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              Enregistrer
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
