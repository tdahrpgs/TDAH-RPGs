/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldAlert, Plus, Minus } from 'lucide-react';

interface Step5Props {
  rdReduction: number;
  setRdReduction: (val: number) => void;
}

export const Step5Penetration: React.FC<Step5Props> = ({
  rdReduction,
  setRdReduction,
}) => {
  const commonPenetrations = [
    { val: 0, label: '0 (Nenhuma)' },
    { val: 5, label: '5 (Penetrante)' },
    { val: 10, label: '10 (Aço Rubi)' },
    { val: 20, label: '20 (Energética)' },
  ];

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif">
            Penetração de RD
          </h2>
        </div>
        <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
          {rdReduction > 0 ? `Ignora ${rdReduction} RD` : '0'}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setRdReduction(Math.max(0, rdReduction - 1))}
            aria-label="Diminuir redução de RD"
            className="w-11 h-11 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center font-bold text-lg active:scale-95 transition-all"
          >
            <Minus className="w-5 h-5" />
          </button>

          <div className="relative flex-1">
            <input
              type="number"
              aria-label="Penetração de RD"
              value={rdReduction}
              onChange={(e) => setRdReduction(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-xl px-4 py-2.5 text-center text-2xl font-bold font-mono text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="0"
            />
          </div>

          <button
            type="button"
            onClick={() => setRdReduction(rdReduction + 1)}
            aria-label="Aumentar redução de RD"
            className="w-11 h-11 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center font-bold text-lg active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Quick choices */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {commonPenetrations.map((item) => {
            const isSelected = rdReduction === item.val;
            return (
              <button
                key={item.val}
                type="button"
                onClick={() => setRdReduction(item.val)}
                className={`py-2 px-2.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                  isSelected
                    ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 dark:border-amber-500 text-amber-900 dark:text-amber-200 shadow-sm'
                    : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
