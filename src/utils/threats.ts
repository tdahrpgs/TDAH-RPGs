/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CreatureTier = 'Iniciante' | 'Veterano' | 'Campeão' | 'Lenda' | 'L+';

export interface CreatureThreat {
  nd: string;
  tier: CreatureTier;
  defense: number;
  rd: number;
  pv: number;
  attackValue: number;
  averageDamage: number;
  standardDC: number;
}

/**
 * Official T20 Creature Parameters (Tabela 2-3 A: Parâmetros de Criaturas - Solos)
 * RD progression per tier requested by user:
 * - Iniciante: 0
 * - Veterano: 5
 * - Campeão: 10
 * - Lenda / L+: 20
 */
export const T20_THREATS: CreatureThreat[] = [
  // Iniciante (RD 0)
  { nd: '1/4', tier: 'Iniciante', defense: 11, rd: 0, pv: 7, attackValue: 6, averageDamage: 8, standardDC: 12 },
  { nd: '1/2', tier: 'Iniciante', defense: 14, rd: 0, pv: 15, attackValue: 7, averageDamage: 10, standardDC: 13 },
  { nd: '1', tier: 'Iniciante', defense: 16, rd: 0, pv: 35, attackValue: 9, averageDamage: 15, standardDC: 14 },
  { nd: '2', tier: 'Iniciante', defense: 19, rd: 0, pv: 70, attackValue: 12, averageDamage: 18, standardDC: 16 },
  { nd: '3', tier: 'Iniciante', defense: 21, rd: 0, pv: 105, attackValue: 14, averageDamage: 21, standardDC: 17 },
  { nd: '4', tier: 'Iniciante', defense: 23, rd: 0, pv: 140, attackValue: 16, averageDamage: 24, standardDC: 18 },

  // Veterano (RD 5)
  { nd: '5', tier: 'Veterano', defense: 24, rd: 5, pv: 200, attackValue: 17, averageDamage: 40, standardDC: 20 },
  { nd: '6', tier: 'Veterano', defense: 27, rd: 5, pv: 240, attackValue: 20, averageDamage: 56, standardDC: 22 },
  { nd: '7', tier: 'Veterano', defense: 31, rd: 5, pv: 280, attackValue: 24, averageDamage: 62, standardDC: 24 },
  { nd: '8', tier: 'Veterano', defense: 33, rd: 5, pv: 320, attackValue: 26, averageDamage: 68, standardDC: 26 },
  { nd: '9', tier: 'Veterano', defense: 34, rd: 5, pv: 360, attackValue: 27, averageDamage: 74, standardDC: 28 },
  { nd: '10', tier: 'Veterano', defense: 36, rd: 5, pv: 400, attackValue: 29, averageDamage: 80, standardDC: 30 },

  // Campeão (RD 10)
  { nd: '11', tier: 'Campeão', defense: 41, rd: 10, pv: 550, attackValue: 34, averageDamage: 130, standardDC: 31 },
  { nd: '12', tier: 'Campeão', defense: 43, rd: 10, pv: 600, attackValue: 36, averageDamage: 144, standardDC: 33 },
  { nd: '13', tier: 'Campeão', defense: 44, rd: 10, pv: 650, attackValue: 37, averageDamage: 158, standardDC: 35 },
  { nd: '14', tier: 'Campeão', defense: 46, rd: 10, pv: 700, attackValue: 39, averageDamage: 172, standardDC: 38 },
  { nd: '15', tier: 'Campeão', defense: 50, rd: 10, pv: 750, attackValue: 43, averageDamage: 186, standardDC: 40 },
  { nd: '16', tier: 'Campeão', defense: 53, rd: 10, pv: 800, attackValue: 46, averageDamage: 200, standardDC: 42 },

  // Lenda (RD 20)
  { nd: '17', tier: 'Lenda', defense: 54, rd: 20, pv: 1020, attackValue: 47, averageDamage: 270, standardDC: 44 },
  { nd: '18', tier: 'Lenda', defense: 56, rd: 20, pv: 1080, attackValue: 49, averageDamage: 288, standardDC: 47 },
  { nd: '19', tier: 'Lenda', defense: 59, rd: 20, pv: 1140, attackValue: 52, averageDamage: 306, standardDC: 47 },
  { nd: '20', tier: 'Lenda', defense: 61, rd: 20, pv: 1200, attackValue: 54, averageDamage: 324, standardDC: 49 },

  // L+ (RD 20)
  { nd: 'S', tier: 'L+', defense: 65, rd: 20, pv: 2500, attackValue: 58, averageDamage: 360, standardDC: 51 },
  { nd: 'S+', tier: 'L+', defense: 70, rd: 20, pv: 4000, attackValue: 65, averageDamage: 500, standardDC: 55 },
];

export function getThreatByND(nd: string): CreatureThreat | undefined {
  return T20_THREATS.find((t) => t.nd === nd);
}

export function getTierColor(tier: CreatureTier): {
  bg: string;
  border: string;
  text: string;
} {
  switch (tier) {
    case 'Iniciante':
      return { bg: 'bg-emerald-950/60', border: 'border-emerald-700/60', text: 'text-emerald-300' };
    case 'Veterano':
      return { bg: 'bg-blue-950/60', border: 'border-blue-700/60', text: 'text-blue-300' };
    case 'Campeão':
      return { bg: 'bg-amber-950/60', border: 'border-amber-700/60', text: 'text-amber-300' };
    case 'Lenda':
      return { bg: 'bg-purple-950/60', border: 'border-purple-700/60', text: 'text-purple-300' };
    case 'L+':
      return { bg: 'bg-red-950/60', border: 'border-red-700/60', text: 'text-red-300' };
    default:
      return { bg: 'bg-stone-900', border: 'border-stone-700', text: 'text-stone-300' };
  }
}
