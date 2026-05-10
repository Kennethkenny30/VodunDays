"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface ConfirmDialogProps {
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  variant?: "default" | "destructive"
  requireTyping?: string // Texte à taper pour confirmer
  trigger: React.ReactNode
  className?: string
}

// Dialog de confirmation avec option de saisie obligatoire
export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
  variant = "default",
  requireTyping,
  trigger,
  className,
}: ConfirmDialogProps) {
  const [inputValue, setInputValue] = useState("")
  const [open, setOpen] = useState(false)

  const isConfirmEnabled = requireTyping ? inputValue === requireTyping : true

  const handleConfirm = () => {
    onConfirm()
    setInputValue("")
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className={className}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        {requireTyping && (
          <div className="space-y-2 py-2">
            <Label htmlFor="confirm-input" className="text-sm text-muted-foreground">
              Tapez <span className="font-mono font-semibold text-foreground">{requireTyping}</span> pour confirmer
            </Label>
            <Input
              id="confirm-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={requireTyping}
              className="font-mono"
            />
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setInputValue("")}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isConfirmEnabled}
            className={cn(
              variant === "destructive" && "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            )}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
