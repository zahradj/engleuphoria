/**
 * Market partitioning between the Algerian (DZ) and International (INTL) marketplaces.
 *
 * The active region for a session is determined by the hostname so we can run
 * both markets out of one codebase. New users are tagged with this region in
 * the database at signup; signed-in users are bound to whatever the DB stores.
 */
export type MarketRegion = 'DZ' | 'INTL';

export function detectMarketRegion(hostname?: string): MarketRegion {
  const host = (hostname ?? (typeof window !== 'undefined' ? window.location.hostname : '')).toLowerCase();
  if (!host) return 'INTL';
  if (host.endsWith('.dz')) return 'DZ';
  if (host.startsWith('dz.')) return 'DZ';
  if (host.includes('engleuphoria.dz')) return 'DZ';
  return 'INTL';
}

export const MARKET_META: Record<MarketRegion, { label: string; currency: string; symbol: string; locale: string }> = {
  DZ:   { label: 'Algeria',       currency: 'DZD', symbol: 'DA', locale: 'fr-DZ' },
  INTL: { label: 'International', currency: 'EUR', symbol: '€',  locale: 'en-GB' },
};
