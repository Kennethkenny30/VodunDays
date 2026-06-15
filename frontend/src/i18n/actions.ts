'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { LOCALES, type Locale } from './locale';

export async function setLocale(locale: Locale) {
  if (!(LOCALES as readonly string[]).includes(locale)) return;

  const cookieStore = await cookies();
  cookieStore.set('locale', locale, {
    maxAge: 365 * 24 * 3600,
    path: '/',
    sameSite: 'lax',
  });

  // Force re-rendu complet du layout pour appliquer la nouvelle locale
  revalidatePath('/', 'layout');
}
