/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Target, Zap, Plus, Minus } from 'lucide-react';

interface Step2Props {
  threatMargin: number;
  setThreatMargin: (margin: number) => void;
  criticalMultiplier: number;
  setCriticalMultiplier: (mult: number) => void;
}

export const Step2Crit: React.FC<Step2Props> = ({
  threatMargin,
  setThreatMargin,
  criticalMultiplier,
  setCriticalMultiplier,
}) => {
  const commonMargins = [20, 19, 18, 17, 15, 12, 5, 2];
  const quickMultipliers = [2, 3, 4, 5, 8, 10];

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-red-600 dark:text-red-400" />
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif">
            Margem de Ameaça & Multiplicador
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Margem de Ameaça */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">
              Margem de Ameaça
            </span>
            <span className="text-xs font-mono font-bold text-red-700 dark:text-amber-400">
              {threatMargin === 20 ? '20' : `${threatMargin}-20`} ({((21 - threatMargin) * 5)}%)
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setThreatMargin(Math.min(20, threatMargin + 1))}
              aria-label="Diminuir chance de crítico"
              className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center font-bold text-sm active:scale-95 disabled:opacity-30"
              disabled={threatMargin >= 20}
            >
              <Plus className="w-4 h-4" />
            </button>

            <div className="flex-1 py-1.5 px-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 text-center">
              <input
                type="number"
                min="2"
                max="20"
                aria-label="Margem de Ameaça"
                value={threatMargin}
                onChange={(e) => setThreatMargin(Math.max(2, Math.min(20, parseInt(e.target.value) || 20)))}
                className="w-full bg-transparent text-xl font-bold font-mono text-stone-900 dark:text-stone-100 text-center focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setThreatMargin(Math.max(2, threatMargin - 1))}
              aria-label="Aumentar chance de crítico"
              className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center font-bold text-sm active:scale-95 disabled:opacity-30"
              disabled={threatMargin <= 2}
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          {/* Quick presets */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
            {commonMargins.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setThreatMargin(m)}
                className={`py-1 text-xs font-mono font-bold rounded-lg border transition-all ${
                  threatMargin === m
                    ? 'bg-red-700 border-red-600 text-white shadow-sm'
                    : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Multiplicador de Crítico */}
        <div className="space-y-3 sm:border-l sm:border-stone-200 dark:sm:border-stone-800 sm:pl-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">
              Multiplicador de Crítico
            </span>
            <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
              x{criticalMultiplier}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setCriticalMultiplier(Math.max(1, criticalMultiplier - 1))}
              aria-label="Diminuir multiplicador de crítico"
              className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center font-bold text-sm active:scale-95"
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="relative flex-1">
              <input
                type="number"
                min="1"
                aria-label="Multiplicador de Crítico"
                value={criticalMultiplier}
                onChange={(e) => setCriticalMultiplier(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-2 text-center text-xl font-bold font-mono text-amber-800 dark:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="2"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-400 font-mono">
                x
              </span>
            </div>

            <button
              type="button"
              onClick={() => setCriticalMultiplier(criticalMultiplier + 1)}
              aria-label="Aumentar multiplicador de crítico"
              className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center font-bold text-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Quick shortcut chips */}
          <div className="grid grid-cols-6 gap-1.5">
            {quickMultipliers.map((mult) => {
              const isSelected = criticalMultiplier === mult;
              return (
                <button
                  key={mult}
                  type="button"
                  onClick={() => setCriticalMultiplier(mult)}
                  className={`py-1 text-xs font-bold font-mono rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-red-700 border-red-600 text-white shadow-sm'
                      : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                  }`}
                >
                  x{mult}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
