import axios from "axios";

const TRANSLATE_EMAIL = process.env.TRANSLATE_EMAIL ?? "";
const TIMEOUT = 5000;

async function translateText(text) {
  if (!text?.trim()) return null;
  try {
    const params = new URLSearchParams({ q: text, langpair: "fr|en" });
    if (TRANSLATE_EMAIL) params.set("de", TRANSLATE_EMAIL);
    const { data } = await axios.get(
      `https://api.mymemory.translated.net/get?${params}`,
      { timeout: TIMEOUT }
    );
    return data?.responseData?.translatedText ?? null;
  } catch {
    return null;
  }
}

// fields: tableau de { field: string, text: string }
// retourne: { nameEn: "...", descriptionEn: "...", ... }
export async function translateFields(fields) {
  const toTranslate = fields.filter(({ text }) => text?.trim());
  if (!toTranslate.length) return {};

  const results = await Promise.all(
    toTranslate.map(async ({ field, text }) => ({
      key: `${field}En`,
      value: await translateText(text),
    }))
  );

  return Object.fromEntries(
    results.filter(({ value }) => value !== null).map(({ key, value }) => [key, value])
  );
}
