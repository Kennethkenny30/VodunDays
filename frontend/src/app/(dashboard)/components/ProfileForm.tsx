"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Loader2, User, Lock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RoleBadge } from "@/components/dashboard/role-badge"
import { useSession } from "@/hooks/useSession"
import { updateMe } from "@/lib/auth/auth"
import { saveSession, getDisplayName, getInitials } from "@/lib/auth/session"

const inputCn = cn(
  "h-10 text-[13px] bg-white/[0.04] border-white/[0.1] rounded-xl",
  "placeholder:text-muted-foreground/30",
  "focus:border-[var(--vd-gold)]/40 focus:bg-white/[0.06]",
  "transition-all duration-200"
)

const labelCn = "text-[13px] font-medium text-foreground/80"

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <span className="inline-flex items-center justify-center size-7 rounded-lg bg-[var(--vd-gold)]/12 border border-[var(--vd-gold)]/25">
        <Icon className="size-3.5 text-[var(--vd-gold)]" />
      </span>
      <h3 className="text-[13px] font-semibold text-foreground/80 tracking-wide">{title}</h3>
    </div>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="text-[11px] text-destructive flex items-center gap-1.5 font-medium mt-1">
      <AlertCircle className="size-3 shrink-0" />
      {message}
    </p>
  )
}

export function ProfileForm() {
  const { user, refetch } = useSession()

  const [infoForm, setInfoForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  })
  const [infoLoading, setInfoLoading] = useState(false)
  const [infoError, setInfoError] = useState("")

  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState("")

  // Synchronise les champs quand l'utilisateur est chargé
  useEffect(() => {
    if (user) {
      setInfoForm({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone ?? "",
      })
    }
  }, [user])

  async function handleInfoSubmit(e: React.FormEvent) {
    e.preventDefault()
    setInfoError("")
    setInfoLoading(true)
    try {
      const res = await updateMe({
        firstname: infoForm.firstname,
        lastname: infoForm.lastname,
        email: infoForm.email,
        phone: infoForm.phone,
      })
      if (res.success) {
        saveSession(res.data.user)
        await refetch()
        toast.success("Informations mises à jour")
      } else {
        setInfoError(res.message || "Erreur lors de la mise à jour")
      }
    } catch {
      setInfoError("Une erreur est survenue, veuillez réessayer")
    } finally {
      setInfoLoading(false)
    }
  }

  async function handlePwSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPwError("")
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError("Les mots de passe ne correspondent pas")
      return
    }
    if (pwForm.newPassword.length < 8) {
      setPwError("Le nouveau mot de passe doit contenir au moins 8 caractères")
      return
    }
    setPwLoading(true)
    try {
      const res = await updateMe({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      })
      if (res.success) {
        setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
        toast.success("Mot de passe modifié avec succès")
      } else {
        setPwError(res.message || "Erreur lors du changement de mot de passe")
      }
    } catch {
      setPwError("Une erreur est survenue, veuillez réessayer")
    } finally {
      setPwLoading(false)
    }
  }

  return (
    <div className="space-y-5 max-w-2xl">

      {/* En-tête profil */}
      <div className="flex items-center gap-5 p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
        <Avatar className="size-16 shrink-0">
          <AvatarFallback className="text-xl font-semibold bg-[var(--vd-gold)]/10 text-[var(--vd-gold)] border border-[var(--vd-gold)]/20">
            {getInitials(user)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-lg font-semibold truncate">{getDisplayName(user)}</p>
          <p className="text-sm text-muted-foreground truncate mt-0.5">{user?.email}</p>
          {user?.role && <RoleBadge role={user.role} className="mt-2" />}
        </div>
      </div>

      {/* Informations personnelles */}
      <Card className="rounded-2xl border border-white/[0.08] bg-white/[0.02]">
        <CardContent className="p-5">
          <SectionHeader icon={User} title="Informations personnelles" />
          <form onSubmit={handleInfoSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstname" className={labelCn}>
                  Prénom <span className="text-[var(--vd-gold)]">*</span>
                </Label>
                <Input
                  id="firstname"
                  className={inputCn}
                  placeholder="Jean"
                  value={infoForm.firstname}
                  onChange={(e) => setInfoForm((f) => ({ ...f, firstname: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastname" className={labelCn}>
                  Nom <span className="text-[var(--vd-gold)]">*</span>
                </Label>
                <Input
                  id="lastname"
                  className={inputCn}
                  placeholder="Dupont"
                  value={infoForm.lastname}
                  onChange={(e) => setInfoForm((f) => ({ ...f, lastname: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className={labelCn}>
                Adresse email <span className="text-[var(--vd-gold)]">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                className={inputCn}
                placeholder="jean.dupont@exemple.com"
                value={infoForm.email}
                onChange={(e) => setInfoForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className={labelCn}>
                Téléphone
                <span className="ml-1.5 text-[11px] text-muted-foreground/50 font-normal">(optionnel)</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                className={inputCn}
                placeholder="+229 97 00 00 00"
                value={infoForm.phone}
                onChange={(e) => setInfoForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </div>

            {infoError && <FieldError message={infoError} />}

            <div className="flex justify-end pt-1">
              <Button
                type="submit"
                disabled={infoLoading}
                className="h-9 px-5 text-[13px] font-semibold rounded-lg bg-[var(--vd-gold)] text-[var(--vd-deep)] hover:bg-[var(--vd-gold)]/90 shadow-[0_0_16px_var(--vd-gold)/20] transition-all"
              >
                {infoLoading && <Loader2 className="size-3.5 animate-spin mr-2" />}
                Enregistrer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Securite */}
      <Card className="rounded-2xl border border-white/[0.08] bg-white/[0.02]">
        <CardContent className="p-5">
          <SectionHeader icon={Lock} title="Securite - Changer le mot de passe" />
          <form onSubmit={handlePwSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword" className={labelCn}>
                Mot de passe actuel <span className="text-[var(--vd-gold)]">*</span>
              </Label>
              <Input
                id="currentPassword"
                type="password"
                className={inputCn}
                placeholder="••••••••"
                value={pwForm.currentPassword}
                onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="newPassword" className={labelCn}>
                  Nouveau mot de passe <span className="text-[var(--vd-gold)]">*</span>
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  className={inputCn}
                  placeholder="••••••••"
                  value={pwForm.newPassword}
                  onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className={labelCn}>
                  Confirmer <span className="text-[var(--vd-gold)]">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  className={inputCn}
                  placeholder="••••••••"
                  value={pwForm.confirmPassword}
                  onChange={(e) => setPwForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                  required
                />
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground/50">
              Le mot de passe doit contenir au moins 8 caractères.
            </p>

            {pwError && <FieldError message={pwError} />}

            <div className="flex justify-end pt-1">
              <Button
                type="submit"
                disabled={pwLoading}
                className="h-9 px-5 text-[13px] font-semibold rounded-lg bg-[var(--vd-gold)] text-[var(--vd-deep)] hover:bg-[var(--vd-gold)]/90 shadow-[0_0_16px_var(--vd-gold)/20] transition-all"
              >
                {pwLoading && <Loader2 className="size-3.5 animate-spin mr-2" />}
                Modifier le mot de passe
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

    </div>
  )
}
