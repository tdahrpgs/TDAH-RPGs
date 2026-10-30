/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  T20_DAMAGE_STEPS,
  DAMAGE_LABEL_AVERAGES,
  getSteppedDamage,
  getDiceAverage,
  calculateProbabilities,
  calculateT20Damage,
} from './calculator';

test('T20 damage steps table contains standard weapon progressions', () => {
  assert.equal(T20_DAMAGE_STEPS.find(s => s.label === '1d8')?.average, 4.5);
  assert.equal(T20_DAMAGE_STEPS.find(s => s.label === '2d6')?.average, 7.0);
  assert.equal(DAMAGE_LABEL_AVERAGES['4d12'], 26.0);
});

test('getSteppedDamage shifts steps properly', () => {
  // 1d8 is at index 5
  const step0 = getSteppedDamage(5, 0);
  assert.equal(step0.label, '1d8');
  assert.equal(step0.average, 4.5);

  const stepPlus1 = getSteppedDamage(5, 1);
  assert.equal(stepPlus1.label, '1d10');
  assert.equal(stepPlus1.average, 5.5);

  const stepPlus2 = getSteppedDamage(5, 2);
  assert.equal(stepPlus2.label, '1d12');

  const stepMinus1 = getSteppedDamage(5, -1);
  assert.equal(stepMinus1.label, '1d6');
});

test('getDiceAverage correctly computes averages', () => {
  assert.equal(getDiceAverage(1, 6), 3.5);
  assert.equal(getDiceAverage(2, 6), 7.0);
  assert.equal(getDiceAverage(1, 8), 4.5);
  assert.equal(getDiceAverage(0, 6), 0);
});

test('calculateProbabilities exactly matches spreadsheet test case (Atk 0 vs Def 16, Margem 20)', () => {
  const res = calculateProbabilities({
    attackBonus: 0,
    enemyDefense: 16,
    threatMargin: 20,
    diceCount: 1,
    rerollsCount: 0,
  });

  // Roll >= 16 hits: 16, 17, 18, 19, 20 (5 outcomes / 20 = 25%)
  assert.equal(Math.round(res.totalHitChance * 100), 25);
  // Threat >= 20: roll 20 (1 outcome / 20 = 5%)
  assert.equal(Math.round(res.criticalChance * 100), 5);
  assert.equal(Math.round(res.normalHitChance * 100), 20);
});

test('calculateProbabilities with 2 dice (advantage) improves hit and crit chances', () => {
  const res = calculateProbabilities({
    attackBonus: 0,
    enemyDefense: 16,
    threatMargin: 20,
    diceCount: 2,
    rerollsCount: 0,
  });

  // 1 - (15/20)^2 = 1 - 0.5625 = 43.75%
  assert.equal(Math.round(res.totalHitChance * 10000) / 100, 43.75);
  // 1 - (19/20)^2 = 1 - 0.9025 = 9.75%
  assert.equal(Math.round(res.criticalChance * 10000) / 100, 9.75);
});

test('calculateT20Damage calculates full results with enemy defense 0 (uncontested baseline)', () => {
  // Weapon 1d8 (idx 5), +0 steps, 0 extra, +5 numeric bonus, x2 crit, 1 attack
  const results = calculateT20Damage({
    baseDamageIndex: 5, // 1d8 = 4.5
    stepModifier: 0,
    extraDiceCount: 0,
    extraDiceSides: 6,
    numericBonus: 5,
    threatMargin: 20,
    criticalMultiplier: 2,
    diceCount: 1,
    rerollsCount: 0,
    attacksCount: 1,
    rdReduction: 0,
    enemyDefense: 0, // 0 as requested for phase 1 baseline
    enemyRD: 0,
    attackBonus: 0,
  });

  // Dano Normal: 4.5 + 5 = 9.5
  assert.equal(results.averageDamage, 9.5);
  // Dano Crítico: (4.5 * 2) + 5 = 14.0
  assert.equal(results.averageCriticalDamage, 14.0);
  // Baseline hit chance is 100% when defense is 0
  assert.equal(results.totalHitChance, 1.0);
  // Crit chance for margin 20 is 5%
  assert.equal(results.criticalChance, 0.05);
  // Normal hit is 95%
  assert.equal(results.normalHitChance, 0.95);
  // Dano Médio por Ataque: 0.95 * 9.5 + 0.05 * 14.0 = 9.025 + 0.70 = 9.725
  assert.equal(results.averageDamagePerAttack, 9.725);
  // Dano Médio por Turno (1 attack): 9.725
  assert.equal(results.averageDamagePerTurn, 9.725);
});

test('calculateT20Damage applies extra dice and RD reduction correctly according to Tabela 3-2', () => {
  // 1d8 (idx 5), +3 steps -> 3d6 (avg 10.5 according to Tabela 3-2 row 4)
  // Extra 1d6 (3.5), bonus 4, enemy RD 10, penetration 5 => effective RD 5
  const results = calculateT20Damage({
    baseDamageIndex: 5, // 1d8
    stepModifier: 3, // +3 steps -> 3d6 (avg 10.5)
    extraDiceCount: 1, // 1d6
    extraDiceSides: 6,
    numericBonus: 4,
    threatMargin: 19, // 19-20 (10% crit)
    criticalMultiplier: 3,
    diceCount: 1,
    rerollsCount: 0,
    attacksCount: 2, // 2 attacks per turn
    rdReduction: 5,
    enemyDefense: 0,
    enemyRD: 10,
    attackBonus: 0,
  });

  // Effective RD = 10 - 5 = 5
  assert.equal(results.effectiveRD, 5);
  // Final weapon 3d6 avg = 10.5
  assert.equal(results.baseWeaponAverage, 10.5);
  assert.equal(results.finalWeaponLabel, '3d6');
  // Extra dice avg = 3.5
  assert.equal(results.extraDamageAverage, 3.5);
  // Normal Damage: 10.5 + 3.5 + 4 - 5 = 13.0
  assert.equal(results.averageDamage, 13.0);
  // Critical Damage: (10.5 * 3) + 3.5 + 4 - 5 = 31.5 + 3.5 + 4 - 5 = 34.0
  assert.equal(results.averageCriticalDamage, 34.0);
  // Turn damage is 2 * attack damage
  assert.equal(results.averageDamagePerTurn, results.averageDamagePerAttack * 2);
});

test('calculateProbabilities supports threatMargin minimum of 2', () => {
  const res = calculateProbabilities({
    attackBonus: 0,
    enemyDefense: 0,
    threatMargin: 2, // 2-20 crits (19 numbers on d20 = 95%)
    diceCount: 1,
    rerollsCount: 0,
  });

  assert.equal(res.criticalChance, 0.95);
  assert.equal(res.totalHitChance, 1.0);
});

test('calculateProbabilities supports diceCount up to 6', () => {
  const res = calculateProbabilities({
    attackBonus: 0,
    enemyDefense: 0,
    threatMargin: 20, // 20 crits
    diceCount: 6, // 6d20 take best
    rerollsCount: 0,
  });

  // 1 - (19/20)^6 = 1 - 0.735091890625 = 0.264908 (26.49%)
  assert.equal(Math.round(res.criticalChance * 100), 26);
});

test('calculateT20Damage supports multiple simultaneous extra dice pools (d4 to d12)', () => {
  // Weapon 1d8 (4.5), +0 steps
  // Extra dice: 2d6 (7.0) + 1d8 (4.5) + 1d4 (2.5) + 1d12 (6.5) = 20.5 extra average!
  // Numeric bonus: 5
  const results = calculateT20Damage({
    baseDamageIndex: 5, // 1d8
    stepModifier: 0,
    extraDicePools: [
      { id: '1', count: 2, sides: 6, label: 'Fogo' },
      { id: '2', count: 1, sides: 8, label: 'Sagrado' },
      { id: '3', count: 1, sides: 4, label: 'Veneno' },
      { id: '4', count: 1, sides: 12, label: 'Relâmpago' },
    ],
    numericBonus: 5,
    threatMargin: 20,
    criticalMultiplier: 2,
    diceCount: 1,
    rerollsCount: 0,
    attacksCount: 1,
    rdReduction: 0,
    enemyDefense: 0,
    enemyRD: 0,
    attackBonus: 0,
  });

  assert.equal(results.extraDamageAverage, 20.5);
  // Normal damage = 4.5 + 20.5 + 5 = 30.0
  assert.equal(results.averageDamage, 30.0);
  // Critical damage = (4.5 * 2) + 20.5 + 5 = 9.0 + 20.5 + 5 = 34.5
  assert.equal(results.averageCriticalDamage, 34.5);
  assert.ok(results.extraDiceDescription.includes('2d6'));
  assert.ok(results.extraDiceDescription.includes('1d8'));
});

test('calculateT20Damage supports special extra dice and numeric bonuses that multiply on crit', () => {
  // Weapon 1d8 (4.5), critical multiplier x3
  // Special crit extra dice: 2d6 (7.0)
  // Special crit numeric bonus: +5
  // Standard numeric bonus: +4
  // Standard extra dice: 1d6 (3.5)
  // No RD
  const results = calculateT20Damage({
    baseDamageIndex: 5, // 1d8 = 4.5
    stepModifier: 0,
    extraDicePools: [{ id: 'std-1', count: 1, sides: 6, label: 'Fogo' }], // 3.5 (standard, does NOT multiply on crit)
    numericBonus: 4, // 4 (standard, does NOT multiply on crit)
    critExtraDicePools: [{ id: 'spec-1', count: 2, sides: 6, label: 'Golpe Pessoal' }], // 7.0 (multiplies on crit!)
    critNumericBonus: 5, // 5 (multiplies on crit!)
    threatMargin: 20,
    criticalMultiplier: 3,
    diceCount: 1,
    rerollsCount: 0,
    attacksCount: 1,
    rdReduction: 0,
    enemyDefense: 0,
    enemyRD: 0,
    attackBonus: 0,
  });

  // Normal damage:
  // Weapon (4.5) + Std Extra (3.5) + Std Bonus (4) + Special Dice (7.0) + Special Bonus (5) = 24.0
  assert.equal(results.averageDamage, 24.0);

  // Critical damage:
  // Weapon x3 (4.5 * 3 = 13.5)
  // + Special Dice x3 (7.0 * 3 = 21.0)
  // + Special Bonus x3 (5 * 3 = 15.0)
  // + Std Extra (3.5)
  // + Std Bonus (4)
  // = 13.5 + 21.0 + 15.0 + 3.5 + 4 = 57.0!
  assert.equal(results.averageCriticalDamage, 57.0);
  assert.equal(results.specialCritTotalNormal, 12.0); // 7 + 5
  assert.equal(results.specialCritTotalCritical, 36.0); // (7 + 5) * 3
});

test('calculateProbabilities with rerolls defaults to crit-fishing (onNonCrit)', () => {
  // Baseline: Margem 20, 1 die => 5% crit (0.05)
  // With 1 reroll fishing for crit: 1 - (1 - 0.05)^2 = 1 - 0.9025 = 9.75% crit
  const res = calculateProbabilities({
    attackBonus: 0,
    enemyDefense: 0,
    threatMargin: 20,
    diceCount: 1,
    rerollsCount: 1,
  });

  assert.equal(res.criticalChance, 0.0975);
  assert.equal(res.totalHitChance, 1.0);
});

test('Preset Build 1: Lutador Campeão de Dojo Lv20 calculates massive DPR', () => {
  const results = calculateT20Damage({
    baseDamageIndex: 11, // 2d8
    stepModifier: 4, // +4 passos
    numericBonus: 38,
    critNumericBonus: 10,
    threatMargin: 16,
    criticalMultiplier: 9,
    diceCount: 3,
    rerollsCount: 2,
    attacksCount: 16,
    rdReduction: 20,
    enemyDefense: 70, // ND S+
    enemyRD: 20, // ND S+
    attackBonus: 56,
  });

  // Effective RD = 20 - 20 = 0
  assert.equal(results.effectiveRD, 0);
  assert.ok(results.averageDamagePerTurn > 0);
  assert.ok(results.criticalChance > 0.8); // High crit chance with 3 dice + 2 rerolls
});

test('Preset Build 2: Magimarcialista de Crítico Lv11 calculates correctly against ND 11', () => {
  const results = calculateT20Damage({
    baseDamageIndex: 8, // 1d12
    stepModifier: 3, // 1d12 + 3 passos -> 4d8 (18.0)
    numericBonus: 4,
    critNumericBonus: 0,
    threatMargin: 16,
    criticalMultiplier: 5,
    diceCount: 2,
    rerollsCount: 2,
    attacksCount: 4,
    rdReduction: 0,
    enemyDefense: 41, // ND 11
    enemyRD: 10, // ND 11
    attackBonus: 33,
  });

  assert.equal(results.finalWeaponLabel, '4d8');
  assert.equal(results.baseWeaponAverage, 18.0);
  assert.equal(results.effectiveRD, 10);
  // Normal damage = 18 + 4 - 10 = 12
  assert.equal(results.averageDamage, 12.0);
  // Critical damage = (18 * 5) + 4 - 10 = 90 + 4 - 10 = 84.0
  assert.equal(results.averageCriticalDamage, 84.0);
  assert.ok(results.averageDamagePerTurn > 0);
});

test('Preset Build 3: Guerreiro de Manobra Lv1 calculates correctly against ND 1', () => {
  const results = calculateT20Damage({
    baseDamageIndex: 9, // 2d6
    stepModifier: 1, // 2d6 + 1 passo -> 3d6 (10.5)
    numericBonus: 5,
    critNumericBonus: 0,
    threatMargin: 19,
    criticalMultiplier: 2,
    diceCount: 1,
    rerollsCount: 0,
    attacksCount: 1,
    rdReduction: 0,
    enemyDefense: 16, // ND 1
    enemyRD: 0, // ND 1
    attackBonus: 9,
  });

  assert.equal(results.finalWeaponLabel, '3d6');
  assert.equal(results.baseWeaponAverage, 10.5);
  assert.equal(results.effectiveRD, 0);
  // Normal damage = 10.5 + 5 = 15.5
  assert.equal(results.averageDamage, 15.5);
  // Critical damage = (10.5 * 2) + 5 = 21 + 5 = 26.0
  assert.equal(results.averageCriticalDamage, 26.0);
  // Roll to hit: target 16 - 9 = 7 (rolls 7 to 20 hit = 14/20 = 70%)
  assert.equal(results.totalHitChance, 0.7);
  // Threat: 19-20 = 2/20 = 10%
  assert.equal(results.criticalChance, 0.1);
  assert.ok(results.averageDamagePerTurn > 0);
});


