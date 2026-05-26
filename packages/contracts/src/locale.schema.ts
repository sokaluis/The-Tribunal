import { z } from 'zod';

export const LocaleSchema = z.enum(['en', 'es']);
export type Locale = z.infer<typeof LocaleSchema>;

export const DEFAULT_LOCALE: Locale = 'en';
export const SUPPORTED_LOCALES: readonly Locale[] = ['en', 'es'] as const;

/**
 * Safely parse an unknown value into a valid {@link Locale}.
 * Returns {@link DEFAULT_LOCALE} ('en') for missing, unsupported, or invalid input.
 * This is the single trust-boundary validator for all locale parsing.
 */
export function parseLocale(input: unknown): Locale {
  const result = LocaleSchema.safeParse(input);
  return result.success ? result.data : DEFAULT_LOCALE;
}
