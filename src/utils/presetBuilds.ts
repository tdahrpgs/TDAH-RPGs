/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExtraDicePool } from './calculator';

export interface PresetBuild {
  id: string;
  name: string;
  tagline: string;
  level: number;
  tier: string;
  attackBonus: number;
  baseDamageIndex: number;
  baseDamageLabel: string;
  stepModifier: number;
  numericBonus: number;
  critNumericBonus: number;
  critExtraDicePools: ExtraDicePool[];
  extraDicePools: ExtraDicePool[];
  threatMargin: number;
  criticalMultiplier: number;
  diceCount: number;
  rerollsCount: number;
  attacksCount: number;
  rdReduction: number;
  selectedND: string;
  enemyDefense: number;
  enemyRD: number;
  statsSummary: string[];
}

export const PRESET_BUILDS: PresetBuild[] = [
  {
    id: 'lutador-dojo-lv20',
    name: 'Lutador Campeão de Dojo Lv20',
    tagline: 'Multiplicador x9 • 16 Ataques • ND S+',
    level: 20,
    tier: 'Lenda / L+',
    attackBonus: 56,
    baseDamageIndex: 11, // 2d8
    baseDamageLabel: '2d8',
    stepModifier: 4, // 2d8 com +4 passos (4d8/4d12)
    numericBonus: 38,
    critNumericBonus: 10,
    critExtraDicePools: [],
    extraDicePools: [],
    threatMargin: 16,
    criticalMultiplier: 9,
    diceCount: 3,
    rerollsCount: 2,
    attacksCount: 16,
    rdReduction: 20,
    selectedND: 'S+',
    enemyDefense: 70, // ND S+ defense
    enemyRD: 20, // ND S+ RD
    statsSummary: [
      'Ataque: +56',
      'Margem: 16-20',
      'Crítico: x9',
      'Passos: 2d8 (+4)',
      'Bônus: +38 (+10 esp.)',
      'Dados: 3d20 (2 rerrolagens)',
      'Ataques: 16x',
      'Penetração RD: 20',
      'Alvo: ND S+ (Def 70, RD 20)',
    ],
  },
  {
    id: 'magimarcialista-crit-lv11',
    name: 'Magimarcialista de Crítico Lv11',
    tagline: 'Multiplicador x5 • 4 Ataques • ND 11',
    level: 11,
    tier: 'Campeão',
    attackBonus: 33,
    baseDamageIndex: 8, // 1d12
    baseDamageLabel: '1d12',
    stepModifier: 3, // 1d12 com +3 passos (resulta em 4d8)
    numericBonus: 4,
    critNumericBonus: 0,
    critExtraDicePools: [],
    extraDicePools: [],
    threatMargin: 16,
    criticalMultiplier: 5,
    diceCount: 2,
    rerollsCount: 2,
    attacksCount: 4,
    rdReduction: 0,
    selectedND: '11',
    enemyDefense: 41, // ND 11 defense
    enemyRD: 10, // ND 11 RD
    statsSummary: [
      'Ataque: +33',
      'Margem: 16-20',
      'Crítico: x5',
      'Passos: 1d12 (+3 &rarr; 4d8)',
      'Bônus: +4',
      'Dados: 2d20 (2 rerrolagens)',
      'Ataques: 4x',
      'Penetração RD: 0',
      'Alvo: ND 11 (Def 41, RD 10)',
    ],
  },
  {
    id: 'guerreiro-manobra-lv1',
    name: 'Guerreiro de Manobra Lv1',
    tagline: 'Multiplicador x2 • Passos 3d6 • ND 1',
    level: 1,
    tier: 'Iniciante',
    attackBonus: 9,
    baseDamageIndex: 9, // 2d6
    baseDamageLabel: '2d6',
    stepModifier: 1, // 2d6 com +1 passo -> 3d6
    numericBonus: 5,
    critNumericBonus: 0,
    critExtraDicePools: [],
    extraDicePools: [],
    threatMargin: 19,
    criticalMultiplier: 2,
    diceCount: 1,
    rerollsCount: 0,
    attacksCount: 1,
    rdReduction: 0,
    selectedND: '1',
    enemyDefense: 16, // ND 1 defense
    enemyRD: 0, // ND 1 RD
    statsSummary: [
      'Ataque: +9',
      'Margem: 19-20',
      'Crítico: x2',
      'Passos: 2d6 (+1 &rarr; 3d6)',
      'Bônus: +5',
      'Dados: 1d20 (0 rerrolagens)',
      'Ataques: 1x',
      'Penetração RD: 0',
      'Alvo: ND 1 (Def 16, RD 0)',
    ],
  },
];
