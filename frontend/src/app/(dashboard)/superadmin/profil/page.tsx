import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ProfileForm } from "../../components/ProfileForm"

export default function SuperAdminProfilPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/superadmin"
          className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="size-3.5" />
          Retour au tableau de bord
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Mon profil</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gérez vos informations personnelles et vos identifiants de connexion.
        </p>
      </div>
      <ProfileForm />
    </div>
  )
}
