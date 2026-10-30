/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DamageStep {
  label: string;
  diceCount: number;
  diceSides: number;
  bonus: number;
  average: number;
}

export interface BaseWeaponDefinition {
  id: string;
  label: string;
  baseAverage: number;
  progression: string[];
}

export const DAMAGE_LABEL_AVERAGES: Record<string, number> = {
  '1': 1.0,
  '1d2': 1.5,
  '1d3': 2.0,
  '1d4': 2.5,
  '1d6': 3.5,
  '1d8': 4.5,
  '2d4': 5.0,
  '1d10': 5.5,
  '1d12': 6.5,
  '2d6': 7.0,
  '3d4': 7.5,
  '2d8': 9.0,
  '3d6': 10.5,
  '2d10': 11.0,
  '3d8': 13.5,
  '4d6': 14.0,
  '3d10': 16.5,
  '4d8': 18.0,
  '4d10': 22.0,
  '4d12': 26.0,
};

/**
 * Official Tormenta 20 Damage Steps - Tabela 3-2: Dano de Armas
 * Rows represent the normal base weapon damage.
 * Index 0: -2 Passos | Index 1: -1 Passo | Index 2: Normal (0 Passos) | Index 3: +1 Passo | Index 4: +2 Passos | Index 5: +3 Passos...
 */
export const T20_BASE_WEAPONS: BaseWeaponDefinition[] = [
  { id: '1', label: '1', baseAverage: 1.0, progression: ['1', '1', '1', '1d2', '1d3', '1d4', '1d6', '1d8', '1d10', '1d12', '3d6', '4d6', '4d8', '4d10', '4d12'] },
  { id: '1d2', label: '1d2', baseAverage: 1.5, progression: ['1', '1', '1d2', '1d3', '1d4', '1d6', '1d8', '1d10', '1d12', '3d6', '4d6', '4d8', '4d10', '4d12'] },
  { id: '1d3', label: '1d3', baseAverage: 2.0, progression: ['1', '1d2', '1d3', '1d4', '1d6', '1d8', '1d10', '1d12', '3d6', '4d6', '4d8', '4d10', '4d12'] },
  { id: '1d4', label: '1d4', baseAverage: 2.5, progression: ['1d2', '1d3', '1d4', '1d6', '1d8', '1d10', '1d12', '3d6', '4d6', '4d8', '4d10', '4d12'] },
  { id: '1d6', label: '1d6', baseAverage: 3.5, progression: ['1d3', '1d4', '1d6', '1d8', '1d10', '1d12', '3d6', '4d6', '4d8', '4d10', '4d12'] },
  { id: '1d8', label: '1d8', baseAverage: 4.5, progression: ['1d4', '1d6', '1d8', '1d10', '1d12', '3d6', '4d6', '4d8', '4d10', '4d12'] },
  { id: '2d4', label: '2d4', baseAverage: 5.0, progression: ['1d4', '1d6', '2d4', '1d10', '1d12', '3d6', '4d6', '4d8', '4d10', '4d12'] },
  { id: '1d10', label: '1d10', baseAverage: 5.5, progression: ['1d6', '1d8', '1d10', '1d12', '3d6', '4d6', '4d8', '4d10', '4d12'] },
  { id: '1d12', label: '1d12', baseAverage: 6.5, progression: ['1d8', '1d10', '1d12', '3d6', '4d6', '4d8', '4d10', '4d12'] },
  { id: '2d6', label: '2d6', baseAverage: 7.0, progression: ['1d8', '1d10', '2d6', '3d6', '4d6', '4d8', '4d10', '4d12'] },
  { id: '3d4', label: '3d4', baseAverage: 7.5, progression: ['1d8', '1d10', '3d4', '3d6', '4d6', '4d8', '4d10', '4d12'] },
  { id: '2d8', label: '2d8', baseAverage: 9.0, progression: ['1d10', '2d6', '2d8', '3d8', '4d8', '4d10', '4d12'] },
  { id: '2d10', label: '2d10', baseAverage: 11.0, progression: ['2d6', '2d8', '2d10', '3d10', '4d10', '4d12'] },
];

export const T20_DAMAGE_STEPS = T20_BASE_WEAPONS.map((w) => ({
  label: w.label,
  diceCount: 0,
  diceSides: 0,
  bonus: 0,
  average: w.baseAverage,
}));

export interface ExtraDicePool {
  id: string;
  count: number;
  sides: number; // 4, 6, 8, 10, 12
  label?: string; // e.g. "Flamejante", "Ataque Furtivo", "Toque Chocante"
}

export interface CalculatorInputs {
  // 1. Passos de Dano, Dano Extra e Bônus Numéricos
  baseDamageIndex: number; // index in T20_DAMAGE_STEPS
  stepModifier: number; // e.g. +1 passo, +2 passos, -1 passo
  extraDicePools?: ExtraDicePool[]; // Multiple simultaneous extra dice pools (normal, do not multiply on crit)
  extraDiceCount?: number; // legacy fallback
  extraDiceSides?: number; // legacy fallback
  extraDiceAverageManual?: number; // optional manual override
  numericBonus: number; // e.g. +8 (standard numeric bonus)

  // Caso Especial: Danos Extras que MULTIPLICAM no Crítico (assim como a arma)
  critExtraDicePools?: ExtraDicePool[]; // Dados extras especiais que multiplicam no crítico
  critNumericBonus?: number; // Bônus numérico especial que multiplica no crítico

  // 2. Margem de Ameaça e Multiplicador
  threatMargin: number; // e.g. 20, 19, 18, 17...
  criticalMultiplier: number; // e.g. 2, 3, 4

  // 3. Número de Dados e Número de Rerrolagens
  diceCount: number; // Number of d20 rolled (take highest, 1 = normal, 2 = vantagem)
  rerollsCount: number; // Number of rerolls (always uses optimal crit-fishing strategy)
  rerollStrategy?: 'onMiss' | 'onNonCrit'; // retained for optional backwards compatibility, defaults to onNonCrit

  // 4. Número de Ataques
  attacksCount: number; // Number of attacks per turn (e.g. 1, 2, 3)

  // 5. Redução de RD / Penetração
  rdReduction: number; // DR Penetration

  // Threat / Target stats
  enemyDefense: number; // Defesa do Inimigo (default 0)
  enemyRD: number; // RD do Inimigo (default 0)
  attackBonus: number; // Bônus de Ataque (default 0)
  multiplyNumericOnCrit?: boolean; // T20 standard is false (only weapon dice multiply)
}

export interface CalculatorResults {
  baseWeaponLabel: string;
  finalWeaponLabel: string;
  baseWeaponAverage: number;
  extraDamageAverage: number;
  extraDiceDescription: string;
  
  // Danos Extras Especiais que Multiplicam no Crítico
  critExtraDiceAverage: number;
  critExtraDiceDescription: string;
  critNumericBonus: number;
  specialCritTotalNormal: number; // critExtraDiceAverage + critNumericBonus
  specialCritTotalCritical: number; // (critExtraDiceAverage + critNumericBonus) * criticalMultiplier

  effectiveRD: number;

  // A. Dano Médio
  averageDamage: number;
  // B. Dano Médio Crítico
  averageCriticalDamage: number;
  // C. Chance de Acerto Crítico (0 to 1)
  criticalChance: number;
  // D. Chance de Acerto Total (0 to 1)
  totalHitChance: number;
  // Normal Hit Chance (0 to 1)
  normalHitChance: number;
  // E. Dano Médio por Ataque
  averageDamagePerAttack: number;
  // F. Dano Médio por Turno
  averageDamagePerTurn: number;
}

/**
 * Resolves the effective damage step after applying step modifier, following Tabela 3-2.
 */
export function getSteppedDamage(base: number | string, stepModifier: number): DamageStep {
  let weapon: BaseWeaponDefinition | undefined;
  if (typeof base === 'string') {
    weapon = T20_BASE_WEAPONS.find((w) => w.id === base || w.label === base);
  } else {
    weapon = T20_BASE_WEAPONS[Math.max(0, Math.min(T20_BASE_WEAPONS.length - 1, base))];
  }
  if (!weapon) {
    weapon = T20_BASE_WEAPONS[5]; // default 1d8
  }

  // Normal is at index 2 (index 0: -2 passos, index 1: -1 passo, index 2: normal)
  const targetIndex = Math.max(0, Math.min(weapon.progression.length - 1, 2 + stepModifier));
  const label = weapon.progression[targetIndex];
  const average = DAMAGE_LABEL_AVERAGES[label] ?? weapon.baseAverage;

  return {
    label,
    diceCount: 0,
    diceSides: 0,
    bonus: 0,
    average,
  };
}

/**
 * Computes average of dice expression N d S
 */
export function getDiceAverage(count: number, sides: number): number {
  if (count <= 0 || sides <= 0) return 0;
  return count * ((sides + 1) / 2);
}

/**
 * Calculates hit and critical probabilities given attack bonus, defense, threat margin, dice pool and rerolls.
 */
export function calculateProbabilities(params: {
  attackBonus: number;
  enemyDefense: number;
  threatMargin: number;
  diceCount: number;
  rerollsCount: number;
  rerollStrategy?: 'onMiss' | 'onNonCrit';
}): {
  totalHitChance: number;
  criticalChance: number;
  normalHitChance: number;
} {
  // Always default to 'onNonCrit' (Pescar Crítico - optimal strategy that maximizes critical hit chance)
  const { attackBonus, enemyDefense, threatMargin, diceCount, rerollsCount, rerollStrategy = 'onNonCrit' } = params;
  const numDice = Math.max(1, Math.min(6, Math.floor(diceCount || 1)));
  const numRerolls = Math.max(0, Math.floor(rerollsCount || 0));
  const margin = Math.max(2, Math.min(20, Math.floor(threatMargin || 20)));
  const cleanNum = (n: number) => Math.round(n * 1000000) / 1000000;

  // If defense is 0 or negative, we assume uncontested baseline (100% hit rate)
  if (enemyDefense <= 0) {
    // Single pool threat probability:
    // Threat happens when max(d20) >= margin
    const probNoThreatSingle = (margin - 1) / 20;
    const probNoThreatPool = Math.pow(probNoThreatSingle, numDice);
    const critChanceSinglePool = 1 - probNoThreatPool;

    let finalCritChance = critChanceSinglePool;
    if (numRerolls > 0) {
      // With rerolls pursuing critical (pesca de crítico), player rerolls unless crit
      const nonCritPool = 1 - critChanceSinglePool;
      finalCritChance = 1 - Math.pow(nonCritPool, numRerolls + 1);
    }

    return {
      totalHitChance: 1.0,
      criticalChance: cleanNum(finalCritChance),
      normalHitChance: cleanNum(Math.max(0, 1.0 - finalCritChance)),
    };
  }

  // With enemyDefense > 0:
  // In T20:
  // roll + attackBonus >= enemyDefense <=> roll >= enemyDefense - attackBonus
  // Natural 1 is always a miss (rolls 1 miss, so min roll to hit is 2)
  // Natural 20 is always a hit (and critical)
  const targetRoll = enemyDefense - attackBonus;
  const minHitRoll = Math.max(2, Math.min(20, targetRoll));

  // Single die: missing faces are 1 .. (minHitRoll - 1)
  const missCountSingle = minHitRoll - 1;
  const probMissSingle = missCountSingle / 20;
  const probMissPool = Math.pow(probMissSingle, numDice);
  const probHitPool = 1 - probMissPool;

  // For critical:
  // Threat margin roll is >= margin.
  // In T20, threat must hit defense to crit, except natural 20 which always hits and crits.
  // Thus, critical roll threshold is min(20, Math.max(margin, minHitRoll))
  const critThreshold = Math.min(20, Math.max(margin, minHitRoll));
  const nonCritCountSingle = critThreshold - 1;
  const probNonCritSingle = nonCritCountSingle / 20;
  const probNonCritPool = Math.pow(probNonCritSingle, numDice);
  const probCritPool = 1 - probNonCritPool;

  // Now handle rerolls:
  if (numRerolls === 0) {
    const finalHit = probHitPool;
    const finalCrit = Math.min(finalHit, probCritPool);
    return {
      totalHitChance: cleanNum(finalHit),
      criticalChance: cleanNum(finalCrit),
      normalHitChance: cleanNum(Math.max(0, finalHit - finalCrit)),
    };
  }

  // Optimal / Standard: Pesca de Crítico (rerolls whenever not critical)
  if (rerollStrategy === 'onNonCrit') {
    const probNonCritSingleAttempt = 1 - probCritPool;
    const finalCrit = 1 - Math.pow(probNonCritSingleAttempt, numRerolls + 1);
    const finalMiss = Math.pow(probMissPool, numRerolls + 1);
    const finalHit = Math.max(finalCrit, 1 - finalMiss);
    return {
      totalHitChance: cleanNum(finalHit),
      criticalChance: cleanNum(Math.min(finalHit, finalCrit)),
      normalHitChance: cleanNum(Math.max(0, finalHit - finalCrit)),
    };
  }

  // Fallback for onMiss (reroll only on miss)
  const finalMiss = Math.pow(probMissPool, numRerolls + 1);
  const finalHit = 1 - finalMiss;
  let finalCrit = 0;
  if (probHitPool > 0) {
    finalCrit = probCritPool * (finalHit / probHitPool);
  }

  return {
    totalHitChance: cleanNum(finalHit),
    criticalChance: cleanNum(Math.min(finalHit, finalCrit)),
    normalHitChance: cleanNum(Math.max(0, finalHit - finalCrit)),
  };
}

/**
 * Calculates complete Tormenta 20 Damage and Attack statistics.
 */
export function calculateT20Damage(inputs: CalculatorInputs): CalculatorResults {
  const weapon = T20_BASE_WEAPONS[Math.max(0, Math.min(T20_BASE_WEAPONS.length - 1, inputs.baseDamageIndex))] || T20_BASE_WEAPONS[5];
  const finalStep = getSteppedDamage(inputs.baseDamageIndex, inputs.stepModifier);

  const baseWeaponAverage = finalStep.average;

  // 1. Dados Extras Padrão (NÃO multiplicam no crítico, ex: Ataque Furtivo, Arma Flamejante)
  let extraDamageAverage = 0;
  let extraDiceDescription = '0';

  if (inputs.extraDiceAverageManual !== undefined && !isNaN(inputs.extraDiceAverageManual)) {
    extraDamageAverage = inputs.extraDiceAverageManual;
    extraDiceDescription = `Manual (${extraDamageAverage.toFixed(1)})`;
  } else if (inputs.extraDicePools && inputs.extraDicePools.length > 0) {
    const validPools = inputs.extraDicePools.filter((p) => p.count > 0 && p.sides > 0);
    if (validPools.length > 0) {
      extraDamageAverage = validPools.reduce((sum, p) => sum + getDiceAverage(p.count, p.sides), 0);
      extraDiceDescription = validPools
        .map((p) => `${p.count}d${p.sides}${p.label ? ` (${p.label})` : ''}`)
        .join(' + ');
    }
  } else if (inputs.extraDiceCount && inputs.extraDiceCount > 0 && inputs.extraDiceSides) {
    extraDamageAverage = getDiceAverage(inputs.extraDiceCount, inputs.extraDiceSides);
    extraDiceDescription = `${inputs.extraDiceCount}d${inputs.extraDiceSides}`;
  }

  // 2. Danos Extras Especiais que MULTIPLICAM no Crítico (assim como a arma)
  let critExtraDiceAverage = 0;
  let critExtraDiceDescription = '0';
  if (inputs.critExtraDicePools && inputs.critExtraDicePools.length > 0) {
    const validCritPools = inputs.critExtraDicePools.filter((p) => p.count > 0 && p.sides > 0);
    if (validCritPools.length > 0) {
      critExtraDiceAverage = validCritPools.reduce((sum, p) => sum + getDiceAverage(p.count, p.sides), 0);
      critExtraDiceDescription = validCritPools
        .map((p) => `${p.count}d${p.sides}${p.label ? ` (${p.label})` : ''}`)
        .join(' + ');
    }
  }

  const critNumericBonus = Number(inputs.critNumericBonus) || 0;
  const specialCritTotalNormal = critExtraDiceAverage + critNumericBonus;

  const numericBonus = Number(inputs.numericBonus) || 0;
  const criticalMultiplier = Math.max(1, Number(inputs.criticalMultiplier) || 2);
  const attacksCount = Math.max(1, Number(inputs.attacksCount) || 1);
  const rdReduction = Math.max(0, Number(inputs.rdReduction) || 0);
  const enemyRD = Math.max(0, Number(inputs.enemyRD) || 0);

  const effectiveRD = Math.max(0, enemyRD - rdReduction);

  const specialCritTotalCritical = specialCritTotalNormal * criticalMultiplier;

  // Normal Hit Damage
  // Formula: max(0, Base Weapon Damage + Extra Dice + Numeric Bonus + Special Crit Extra - Effective RD)
  const averageDamage = Math.max(
    0,
    baseWeaponAverage + extraDamageAverage + numericBonus + specialCritTotalNormal - effectiveRD
  );

  // Critical Hit Damage
  // Weapon damage multiplies: baseWeaponAverage * criticalMultiplier
  // Special Crit Extra multiplies: (critExtraDiceAverage + critNumericBonus) * criticalMultiplier
  // Standard Numeric Bonus: multiplies if multiplyNumericOnCrit is true, else flat
  // Standard Extra Dice: flat (does NOT multiply)
  const criticalWeaponDamage = baseWeaponAverage * criticalMultiplier;
  const criticalNumeric = inputs.multiplyNumericOnCrit ? numericBonus * criticalMultiplier : numericBonus;

  const averageCriticalDamage = Math.max(
    0,
    criticalWeaponDamage +
    specialCritTotalCritical +
    extraDamageAverage +
    criticalNumeric -
    effectiveRD
  );

  // Hit & Crit Probabilities (defaults to onNonCrit - optimal crit fishing)
  const { totalHitChance, criticalChance, normalHitChance } = calculateProbabilities({
    attackBonus: inputs.attackBonus,
    enemyDefense: inputs.enemyDefense,
    threatMargin: inputs.threatMargin,
    diceCount: inputs.diceCount,
    rerollsCount: inputs.rerollsCount,
    rerollStrategy: inputs.rerollStrategy ?? 'onNonCrit',
  });

  // Expected Damage per Attack
  // Dano Médio por Ataque = (P_normal * Dano Normal) + (P_crit * Dano Crítico)
  const averageDamagePerAttack =
    normalHitChance * averageDamage + criticalChance * averageCriticalDamage;

  // Expected Damage per Turn
  // Dano Médio por Turno = Dano Médio por Ataque * Número de Ataques
  const averageDamagePerTurn = averageDamagePerAttack * attacksCount;

  return {
    baseWeaponLabel: weapon.label,
    finalWeaponLabel: finalStep.label,
    baseWeaponAverage,
    extraDamageAverage,
    extraDiceDescription,
    critExtraDiceAverage,
    critExtraDiceDescription,
    critNumericBonus,
    specialCritTotalNormal,
    specialCritTotalCritical,
    effectiveRD,
    averageDamage,
    averageCriticalDamage,
    criticalChance,
    totalHitChance,
    normalHitChance,
    averageDamagePerAttack,
    averageDamagePerTurn,
  };
}
