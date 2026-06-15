/**
 * Retourne la valeur traduite d'un champ si disponible, sinon la valeur FR par défaut.
 * Repli systématique : jamais de chaîne vide due à une traduction manquante.
 */
export function localize<T extends Record<string, unknown>>(
  entity: T,
  field: keyof T & string,
  locale: string
): string {
  if (locale === 'en') {
    const enKey = (field + 'En') as keyof T;
    const enVal = entity[enKey];
    if (enVal && typeof enVal === 'string' && enVal.trim().length > 0) {
      return enVal;
    }
  }
  return ((entity[field] as string) ?? '');
}
