/**
 * Retourne la valeur traduite d'un champ si disponible, sinon la valeur FR par défaut.
 * Repli systématique : jamais de chaîne vide due à une traduction manquante.
 */
export function localize<T extends object>(
  entity: T,
  field: keyof T & string,
  locale: string
): string {
  const rec = entity as Record<string, unknown>;
  if (locale === 'en') {
    const enVal = rec[field + 'En'];
    if (enVal && typeof enVal === 'string' && enVal.trim().length > 0) {
      return enVal;
    }
  }
  return (rec[field] as string) ?? '';
}
