/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { T20_BASE_WEAPONS, getSteppedDamage, getDiceAverage, ExtraDicePool } from '../utils/calculator';
import { Flame, Sparkles, Plus, Minus, Dices, ChevronDown, Zap, Table, Trash2, X } from 'lucide-react';

interface Step1Props {
  baseDamageIndex: number;
  setBaseDamageIndex: (index: number) => void;
  stepModifier: number;
  setStepModifier: (steps: number) => void;
  extraDicePools: ExtraDicePool[];
  setExtraDicePools: React.Dispatch<React.SetStateAction<ExtraDicePool[]>>;
  numericBonus: number;
  setNumericBonus: (bonus: number) => void;

  // Danos Extras que Multiplicam no Crítico (Especial)
  criticalMultiplier: number;
  critExtraDicePools: ExtraDicePool[];
  setCritExtraDicePools: React.Dispatch<React.SetStateAction<ExtraDicePool[]>>;
  critNumericBonus: number;
  setCritNumericBonus: (bonus: number) => void;
}

export const Step1Damage: React.FC<Step1Props> = ({
  baseDamageIndex,
  setBaseDamageIndex,
  stepModifier,
  setStepModifier,
  extraDicePools,
  setExtraDicePools,
  numericBonus,
  setNumericBonus,
  criticalMultiplier,
  critExtraDicePools,
  setCritExtraDicePools,
  critNumericBonus,
  setCritNumericBonus,
}) => {
  const [showTableModal, setShowTableModal] = useState(false);
  const [isCritSpecialOpen, setIsCritSpecialOpen] = useState(false);

  const currentStep = getSteppedDamage(baseDamageIndex, stepModifier);
  const baseWeapon = T20_BASE_WEAPONS[baseDamageIndex] || T20_BASE_WEAPONS[5];

  const allowedSides = [4, 6, 8, 10, 12];

  // Helper to adjust normal extra dice count for a specific die type
  const adjustDiceType = (sides: number, delta: number) => {
    setExtraDicePools((prev) => {
      const existingIdx = prev.findIndex((p) => p.sides === sides);
      if (existingIdx >= 0) {
        const updated = [...prev];
        const newCount = Math.max(0, updated[existingIdx].count + delta);
        if (newCount === 0) {
          updated.splice(existingIdx, 1);
        } else {
          updated[existingIdx] = { ...updated[existingIdx], count: newCount };
        }
        return updated;
      } else if (delta > 0) {
        return [...prev, { id: `${sides}-${Date.now()}`, count: delta, sides }];
      }
      return prev;
    });
  };

  const getGenericCount = (sides: number) => {
    return extraDicePools
      .filter((p) => p.sides === sides)
      .reduce((sum, p) => sum + p.count, 0);
  };

  // Helper to adjust special crit-multiplying extra dice count
  const adjustCritDiceType = (sides: number, delta: number) => {
    setCritExtraDicePools((prev) => {
      const existingIdx = prev.findIndex((p) => p.sides === sides);
      if (existingIdx >= 0) {
        const updated = [...prev];
        const newCount = Math.max(0, updated[existingIdx].count + delta);
        if (newCount === 0) {
          updated.splice(existingIdx, 1);
        } else {
          updated[existingIdx] = { ...updated[existingIdx], count: newCount };
        }
        return updated;
      } else if (delta > 0) {
        return [...prev, { id: `crit-${sides}-${Date.now()}`, count: delta, sides }];
      }
      return prev;
    });
  };

  const getCritDiceCount = (sides: number) => {
    return critExtraDicePools
      .filter((p) => p.sides === sides)
      .reduce((sum, p) => sum + p.count, 0);
  };

  // Sums
  const totalExtraAverage = extraDicePools.reduce(
    (sum, p) => sum + getDiceAverage(p.count, p.sides),
    0
  );

  const critDiceAverage = critExtraDicePools.reduce(
    (sum, p) => sum + getDiceAverage(p.count, p.sides),
    0
  );
  const totalSpecialCritNormal = critDiceAverage + critNumericBonus;
  const totalSpecialCritCritical = totalSpecialCritNormal * criticalMultiplier;
  const hasActiveSpecial = critExtraDicePools.length > 0 || critNumericBonus !== 0;

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Dices className="w-5 h-5 text-red-600 dark:text-red-400" />
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif">
            Dano da Arma & Bônus
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowTableModal(true)}
          className="text-xs px-2.5 py-1 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors font-medium flex items-center gap-1.5"
          title="Ver Tabela 3-2: Dano de Armas"
        >
          <Table className="w-3.5 h-3.5" />
          <span>Tabela 3-2</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* 1. Dano Base e Passos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">
              Dano Base
            </span>
            <span className="text-xs font-mono font-bold text-red-700 dark:text-amber-400">
              {currentStep.label} (méd. {currentStep.average.toFixed(1)})
            </span>
          </div>

          {/* Base weapon buttons */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
            {T20_BASE_WEAPONS.map((item, idx) => {
              const isSelected = baseDamageIndex === idx;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setBaseDamageIndex(idx)}
                  className={`py-1.5 px-1 text-xs font-mono rounded-lg border transition-all text-center ${
                    isSelected
                      ? 'bg-red-700 border-red-600 text-white font-bold shadow-sm'
                      : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                  }`}
                  title={`${item.label} (Média ${item.baseAverage.toFixed(1)})`}
                >
                  <div className="font-bold">{item.label}</div>
                  <div className={`text-[10px] ${isSelected ? 'text-red-100' : 'text-stone-400'}`}>
                    {item.baseAverage.toFixed(1)}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Stepper for Passos de Dano */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <span className="text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300">
              Passos de Dano:
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStepModifier(Math.max(-2, stepModifier - 1))}
                aria-label="Diminuir passo de dano"
                className="w-9 h-9 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center font-bold text-sm active:scale-95 disabled:opacity-40"
                disabled={stepModifier <= -2}
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="px-3 py-1.5 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-center min-w-[80px]">
                <span className={`text-xs sm:text-sm font-bold font-mono ${stepModifier > 0 ? 'text-amber-700 dark:text-amber-400' : stepModifier < 0 ? 'text-red-700 dark:text-red-400' : 'text-stone-700 dark:text-stone-300'}`}>
                  {stepModifier > 0 ? `+${stepModifier}` : stepModifier} {Math.abs(stepModifier) === 1 ? 'passo' : 'passos'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setStepModifier(stepModifier + 1)}
                aria-label="Aumentar passo de dano"
                className="w-9 h-9 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center font-bold text-sm active:scale-95"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ★ Danos Extras que Multiplicam no Crítico (Normalmente Minimizada) */}
        <div className="rounded-xl border border-stone-300 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/70 overflow-hidden transition-all shadow-sm">
          <button
            type="button"
            onClick={() => setIsCritSpecialOpen(!isCritSpecialOpen)}
            className="w-full p-3.5 px-4 flex items-center justify-between text-left hover:bg-stone-100 dark:hover:bg-stone-900/80 transition-colors"
            aria-expanded={isCritSpecialOpen}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-500/15 border border-amber-300 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 flex items-center justify-center text-xs shrink-0 font-bold">
                <Zap className="w-3.5 h-3.5" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    Danos Extras que Multiplicam no Crítico
                  </span>
                  <span className="text-xs uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 font-mono font-bold border border-amber-300 dark:border-amber-500/30">
                    Especial
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 truncate mt-0.5">
                  {isCritSpecialOpen
                    ? 'Clique para recolher esta opção'
                    : hasActiveSpecial
                    ? `Ativo: +${totalSpecialCritNormal.toFixed(1)} normal | +${totalSpecialCritCritical.toFixed(1)} no crítico`
                    : 'Clique para expandir dados ou bônus que multiplicam no crítico'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 ml-2">
              {hasActiveSpecial && (
                <span className="text-xs font-mono font-bold text-amber-900 dark:text-amber-300 px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-600/30">
                  +{totalSpecialCritNormal.toFixed(1)} (x{criticalMultiplier})
                </span>
              )}
              <ChevronDown
                className={`w-5 h-5 text-stone-600 dark:text-stone-400 transition-transform duration-200 ${
                  isCritSpecialOpen ? 'rotate-180 text-amber-600 dark:text-amber-300' : ''
                }`}
              />
            </div>
          </button>

          {/* Expanded Content */}
          {isCritSpecialOpen && (
            <div className="p-4 pt-3 border-t border-stone-200 dark:border-stone-800/80 space-y-4 bg-white dark:bg-stone-950/40">
              <div className="flex items-center justify-between text-xs sm:text-sm text-stone-700 dark:text-stone-300 border-b border-stone-200 dark:border-stone-800/60 pb-2">
                <span>
                  Multiplica por <strong className="text-amber-700 dark:text-amber-300 font-mono font-bold">x{criticalMultiplier}</strong> no crítico:
                </span>
                {hasActiveSpecial && (
                  <button
                    type="button"
                    onClick={() => {
                      setCritExtraDicePools([]);
                      setCritNumericBonus(0);
                    }}
                    className="text-stone-600 hover:text-red-600 dark:text-stone-400 dark:hover:text-red-400 flex items-center gap-1.5 transition-colors text-xs font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Zerar especiais
                  </button>
                )}
              </div>

              {/* Dados Especiais que Multiplicam no Crítico (d4 a d12) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200">
                    Dados Especiais (Multiplicam no Crítico):
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-amber-700 dark:text-amber-300">
                    {critDiceAverage > 0 ? `+${critDiceAverage.toFixed(1)} méd.` : '0'}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {allowedSides.map((sides) => {
                    const count = getCritDiceCount(sides);
                    return (
                      <div
                        key={sides}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          count > 0
                            ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-500/50 shadow-sm'
                            : 'bg-stone-50 dark:bg-stone-900/80 border-stone-200 dark:border-stone-800'
                        }`}
                      >
                        <div className="text-xs sm:text-sm font-mono font-bold text-amber-800 dark:text-amber-300 mb-1">
                          d{sides}
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => adjustCritDiceType(sides, -1)}
                            disabled={count === 0}
                            aria-label={`Diminuir dado d${sides}`}
                            className="w-7 h-7 rounded-lg bg-white hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 disabled:opacity-30 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center text-xs font-bold"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 font-mono font-bold text-sm text-stone-900 dark:text-stone-100">
                            {count}
                          </span>
                          <button
                            type="button"
                            onClick={() => adjustCritDiceType(sides, 1)}
                            aria-label={`Aumentar dado d${sides}`}
                            className="w-7 h-7 rounded-lg bg-white hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center text-xs font-bold"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bônus Numérico Especial que Multiplica no Crítico */}
              <div className="pt-3 border-t border-stone-200 dark:border-stone-800/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200">
                    Bônus Numérico Especial (Multiplica no Crítico):
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-amber-700 dark:text-amber-300">
                    {critNumericBonus !== 0 ? `+${critNumericBonus}` : '+0'}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCritNumericBonus(critNumericBonus - 1)}
                    aria-label="Diminuir bônus numérico especial"
                    className="w-9 h-9 rounded-lg bg-white hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center text-xs font-bold shadow-sm"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <input
                    type="number"
                    value={critNumericBonus}
                    onChange={(e) => setCritNumericBonus(Number(e.target.value) || 0)}
                    aria-label="Bônus numérico especial que multiplica no crítico"
                    className="w-20 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg px-2.5 py-1.5 text-center font-mono font-bold text-sm text-amber-800 dark:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                  />

                  <button
                    type="button"
                    onClick={() => setCritNumericBonus(critNumericBonus + 1)}
                    aria-label="Aumentar bônus numérico especial"
                    className="w-9 h-9 rounded-lg bg-white hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center text-xs font-bold shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {/* Quick buttons */}
                  <div className="flex items-center gap-1.5 ml-auto flex-wrap">
                    {[0, 2, 5, 10].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setCritNumericBonus(b)}
                        className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-all ${
                          critNumericBonus === b
                            ? 'bg-amber-600 border-amber-500 text-white font-bold shadow-sm'
                            : 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                      >
                        {b === 0 ? '0' : `+${b}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary line */}
              <div className="pt-2.5 border-t border-stone-200 dark:border-stone-800/60 flex items-center justify-between text-xs sm:text-sm font-mono text-stone-700 dark:text-stone-300">
                <span>Total Especial:</span>
                <span>
                  Normal: <strong className="text-amber-700 dark:text-amber-300 font-bold">+{totalSpecialCritNormal.toFixed(1)}</strong> | No Crítico: <strong className="text-amber-800 dark:text-amber-400 font-bold">+{totalSpecialCritCritical.toFixed(1)}</strong>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 2. Dano Extra Simultâneo (d4 a d12) */}
        <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Dados Extras (Não multiplicam no crítico)
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                {totalExtraAverage > 0 ? `+${totalExtraAverage.toFixed(1)} méd.` : '+0'}
              </span>
              {extraDicePools.length > 0 && (
                <button
                  type="button"
                  onClick={() => setExtraDicePools([])}
                  className="text-xs text-stone-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* Quick Dice Steppers for d4, d6, d8, d10, d12 */}
          <div className="grid grid-cols-5 gap-2">
            {allowedSides.map((sides) => {
              const count = getGenericCount(sides);
              return (
                <div
                  key={sides}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    count > 0
                      ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-600/50 shadow-sm'
                      : 'bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <div className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300 mb-1">
                    d{sides}
                  </div>

                  <div className="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      onClick={() => adjustDiceType(sides, -1)}
                      aria-label={`Diminuir d${sides}`}
                      className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center text-xs active:scale-95 disabled:opacity-30 font-bold"
                      disabled={count === 0}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <span className={`w-5 text-center font-mono font-bold text-sm ${count > 0 ? 'text-amber-800 dark:text-amber-200' : 'text-stone-400'}`}>
                      {count}
                    </span>

                    <button
                      type="button"
                      onClick={() => adjustDiceType(sides, 1)}
                      aria-label={`Aumentar d${sides}`}
                      className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center text-xs active:scale-95 font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Bônus Numérico Fixo */}
        <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Bônus Numérico Fixo (+X)
            </span>
            <span className="text-xs font-mono font-bold text-stone-700 dark:text-amber-300">
              {numericBonus >= 0 ? `+${numericBonus}` : numericBonus}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-2.5">
            <button
              type="button"
              onClick={() => setNumericBonus(numericBonus - 1)}
              aria-label="Diminuir bônus numérico"
              className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center font-bold text-sm active:scale-95"
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="flex-1 py-1 px-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 text-center">
              <input
                type="number"
                aria-label="Bônus Numérico"
                value={numericBonus}
                onChange={(e) => setNumericBonus(Number(e.target.value) || 0)}
                className="w-full text-center text-xl font-bold font-mono text-stone-900 dark:text-stone-100 bg-transparent focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setNumericBonus(numericBonus + 1)}
              aria-label="Aumentar bônus numérico"
              className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center font-bold text-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Quick choice buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[0, 2, 4, 6, 8, 10, 15, 20].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setNumericBonus(b)}
                className={`flex-1 min-w-[36px] py-1 text-xs font-mono rounded-lg border transition-all ${
                  numericBonus === b
                    ? 'bg-red-700 border-red-600 text-white font-bold shadow-sm'
                    : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                }`}
              >
                {b === 0 ? '0' : `+${b}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela 3-2 Modal */}
      {showTableModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="tabela-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800">
              <h3 id="tabela-dialog-title" className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 font-serif flex items-center gap-2">
                <Table className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                Tabela 3-2: Dano de Armas (Tormenta 20)
              </h3>
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                aria-label="Fechar modal da tabela"
                className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 flex flex-col items-center bg-stone-100 dark:bg-stone-950">
              <img
                src="/public/assets/aistudio/Calculadora_de_Cr_tico_e_Tabelas_b88aa7e8"
                alt="Tabela 3-2: Dano de Armas oficial do Tormenta 20"
                className="max-w-full rounded-lg border border-stone-300 dark:border-stone-800 shadow-md object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('image_56c035ff.png')) {
                    target.src = '/public/assets/aistudio/image_56c035ff.png';
                  }
                }}
              />
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 text-right">
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                className="px-5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-sm font-semibold shadow-sm"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
