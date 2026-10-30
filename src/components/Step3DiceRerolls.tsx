/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Dices, RefreshCw, Plus, Minus } from 'lucide-react';

interface Step3Props {
  diceCount: number;
  setDiceCount: (count: number) => void;
  rerollsCount: number;
  setRerollsCount: (count: number) => void;
}

export const Step3DiceRerolls: React.FC<Step3Props> = ({
  diceCount,
  setDiceCount,
  rerollsCount,
  setRerollsCount,
}) => {
  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Dices className="w-5 h-5 text-red-600 dark:text-red-400" />
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif">
            Dados de Ataque & Rerrolagens
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Número de Dados */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">
              Dados Rolados (d20)
            </span>
            <span className="text-xs font-mono font-bold text-red-700 dark:text-amber-400">
              {diceCount}d20
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setDiceCount(Math.max(1, diceCount - 1))}
              aria-label="Diminuir quantidade de dados rolados"
              className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center font-bold text-sm active:scale-95 disabled:opacity-30"
              disabled={diceCount <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="flex-1 py-1.5 px-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 text-center">
              <div className="text-xl font-bold font-mono text-stone-900 dark:text-stone-100">{diceCount}d20</div>
            </div>

            <button
              type="button"
              onClick={() => setDiceCount(Math.min(6, diceCount + 1))}
              aria-label="Aumentar quantidade de dados rolados"
              className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center font-bold text-sm active:scale-95 disabled:opacity-30"
              disabled={diceCount >= 6}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Quick choices 1 to 6 */}
          <div className="grid grid-cols-6 gap-1.5">
            {[1, 2, 3, 4, 5, 6].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDiceCount(d)}
                className={`py-1 text-xs font-mono rounded-lg border transition-all text-center ${
                  diceCount === d
                    ? 'bg-red-700 border-red-600 text-white font-bold shadow-sm'
                    : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {/* Número de Rerrolagens */}
        <div className="space-y-3 sm:border-l sm:border-stone-200 dark:sm:border-stone-800 sm:pl-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">
              Rerrolagens
            </span>
            <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
              {rerollsCount === 0 ? '0' : `${rerollsCount}x`}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setRerollsCount(Math.max(0, rerollsCount - 1))}
              aria-label="Diminuir número de rerrolagens"
              className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center font-bold text-sm active:scale-95 disabled:opacity-30"
              disabled={rerollsCount <= 0}
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="flex-1 py-1.5 px-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 text-center">
              <div className="text-xl font-bold font-mono text-stone-900 dark:text-stone-100">{rerollsCount}x</div>
            </div>

            <button
              type="button"
              onClick={() => setRerollsCount(Math.min(5, rerollsCount + 1))}
              aria-label="Aumentar número de rerrolagens"
              className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center font-bold text-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Quick choices 0 to 3 */}
          <div className="grid grid-cols-4 gap-1.5">
            {[0, 1, 2, 3].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRerollsCount(r)}
                className={`py-1 text-xs font-mono rounded-lg border transition-all text-center ${
                  rerollsCount === r
                    ? 'bg-red-700 border-red-600 text-white font-bold shadow-sm'
                    : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                }`}
              >
                {r === 0 ? '0' : `${r}x`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
