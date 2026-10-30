/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Swords, Plus, Minus } from 'lucide-react';

interface Step4Props {
  attacksCount: number;
  setAttacksCount: (count: number) => void;
}

export const Step4Attacks: React.FC<Step4Props> = ({
  attacksCount,
  setAttacksCount,
}) => {
  const quickAttackCounts = [1, 2, 3, 4, 6, 8, 10, 12, 16];

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-red-600 dark:text-red-400" />
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif">
            Número de Ataques
          </h2>
        </div>
        <span className="text-xs font-mono font-bold text-red-700 dark:text-amber-400">
          {attacksCount} {attacksCount === 1 ? 'ataque' : 'ataques'}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAttacksCount(Math.max(1, attacksCount - 1))}
            aria-label="Diminuir número de ataques"
            className="w-11 h-11 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center font-bold text-lg active:scale-95 transition-all"
          >
            <Minus className="w-5 h-5" />
          </button>

          <div className="relative flex-1">
            <input
              type="number"
              min="1"
              aria-label="Número de Ataques por Turno"
              value={attacksCount}
              onChange={(e) => setAttacksCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-xl px-4 py-2.5 text-center text-2xl font-bold font-mono text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="1"
            />
          </div>

          <button
            type="button"
            onClick={() => setAttacksCount(attacksCount + 1)}
            aria-label="Aumentar número de ataques"
            className="w-11 h-11 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center font-bold text-lg active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Quick shortcut chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {quickAttackCounts.map((count) => {
            const isSelected = attacksCount === count;
            return (
              <button
                key={count}
                type="button"
                onClick={() => setAttacksCount(count)}
                className={`py-1 px-3 text-xs font-mono font-bold rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-red-700 border-red-600 text-white shadow-sm'
                    : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                }`}
              >
                {count}x
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
