/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Crosshair, Plus, Minus } from 'lucide-react';

interface AttackBonusProps {
  attackBonus: number;
  setAttackBonus: (val: number) => void;
}

export const AttackBonus: React.FC<AttackBonusProps> = ({
  attackBonus,
  setAttackBonus,
}) => {
  const quickBonuses = [0, 5, 10, 15, 20, 25, 30];

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Crosshair className="w-5 h-5 text-red-600 dark:text-red-400" />
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif">
            Bônus de Ataque
          </h2>
        </div>

        <span className="text-sm font-mono font-bold text-red-700 dark:text-amber-300 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-lg border border-stone-200 dark:border-stone-700">
          {attackBonus >= 0 ? `+${attackBonus}` : attackBonus}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAttackBonus(attackBonus - 1)}
            aria-label="Diminuir bônus de ataque"
            className="w-11 h-11 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center font-bold text-lg active:scale-95 transition-all"
          >
            <Minus className="w-5 h-5" />
          </button>

          <div className="relative flex-1">
            <input
              type="number"
              aria-label="Bônus de Ataque"
              value={attackBonus}
              onChange={(e) => setAttackBonus(parseInt(e.target.value) || 0)}
              className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-xl px-4 py-2.5 text-center text-2xl font-bold font-mono text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              placeholder="0"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-400 font-mono">
              {attackBonus >= 0 ? '+' : ''}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setAttackBonus(attackBonus + 1)}
            aria-label="Aumentar bônus de ataque"
            className="w-11 h-11 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center font-bold text-lg active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Quick shortcut chips */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          {quickBonuses.map((b) => {
            const isSelected = attackBonus === b;
            return (
              <button
                key={b}
                type="button"
                onClick={() => setAttackBonus(b)}
                className={`px-3 py-1 text-xs font-mono font-semibold rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-red-700 border-red-600 text-white shadow-sm'
                    : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                }`}
              >
                +{b}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
