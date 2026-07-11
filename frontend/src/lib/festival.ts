// Dates du festival Vodun Days : 8, 9 et 10 janvier chaque année.
// Après le 10 janvier, on pointe automatiquement vers l'édition suivante.

export function getFestivalYear(): number {
  const now = new Date();
  const cutoff = new Date(now.getFullYear(), 0, 10, 23, 59, 59);
  return now > cutoff ? now.getFullYear() + 1 : now.getFullYear();
}

export function getFestivalStartDate(): Date {
  return new Date(getFestivalYear(), 0, 8);
}
