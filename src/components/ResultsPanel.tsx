/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CalculatorResults } from '../utils/calculator';
import { Sparkles, HelpCircle, ChevronRight, Check } from 'lucide-react';

interface ResultsPanelProps {
  results: CalculatorResults;
  attacksCount: number;
  threatMargin: number;
  criticalMultiplier: number;
  enemyDefense: number;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  results,
  attacksCount,
  threatMargin,
  criticalMultiplier,
  enemyDefense,
}) => {
  const [showFormulas, setShowFormulas] = useState(false);

  return (
    <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xl relative overflow-hidden transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200 dark:border-stone-800">
        <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif tracking-wide">
          Resultados do Combate
        </h2>

        <button
          type="button"
          onClick={() => setShowFormulas(!showFormulas)}
          className="text-xs font-semibold text-stone-600 hover:text-red-700 dark:text-stone-400 dark:hover:text-amber-300 flex items-center gap-1.5 transition-colors"
          aria-expanded={showFormulas}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{showFormulas ? 'Ocultar Fórmulas' : 'Fórmulas'}</span>
        </button>
      </div>

      {/* Hero Metric: DPR */}
      <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-stone-950 border border-red-200 dark:border-red-900/60 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400 font-mono">
            Dano Médio por Turno (DPR)
          </span>
          <span className="text-xs text-stone-600 dark:text-stone-400 font-mono">
            {attacksCount} {attacksCount === 1 ? 'ataque' : 'ataques'}
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-red-800 dark:text-amber-300 tracking-tight">
            {results.averageDamagePerTurn.toFixed(2)}
          </div>
          <div className="text-xs text-stone-500 dark:text-stone-400 font-mono text-right">
            {results.averageDamagePerAttack.toFixed(2)} / golpe
          </div>
        </div>
      </div>

      {/* Grid for Results */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Dano Médio */}
        <div className="bg-stone-50 dark:bg-stone-950/70 border border-stone-200 dark:border-stone-800/80 rounded-xl p-3 shadow-sm">
          <div className="text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
            Dano Normal
          </div>
          <div className="text-xl font-bold font-mono text-stone-900 dark:text-stone-100">
            {results.averageDamage.toFixed(2)}
          </div>
        </div>

        {/* Dano Médio Crítico */}
        <div className="bg-stone-50 dark:bg-stone-950/70 border border-red-200 dark:border-red-950/60 rounded-xl p-3 shadow-sm">
          <div className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">
            Dano no Crítico (x{criticalMultiplier})
          </div>
          <div className="text-xl font-bold font-mono text-amber-800 dark:text-amber-400">
            {results.averageCriticalDamage.toFixed(2)}
          </div>
        </div>

        {/* Chance de Acerto Crítico */}
        <div className="bg-stone-50 dark:bg-stone-950/70 border border-stone-200 dark:border-stone-800/80 rounded-xl p-3 shadow-sm">
          <div className="text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
            Chance de Crítico
          </div>
          <div className="text-xl font-bold font-mono text-red-700 dark:text-red-400">
            {(results.criticalChance * 100).toFixed(1)}%
          </div>
          <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div
              className="bg-red-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, results.criticalChance * 100)}%` }}
            />
          </div>
        </div>

        {/* Chance de Acerto Total */}
        <div className="bg-stone-50 dark:bg-stone-950/70 border border-stone-200 dark:border-stone-800/80 rounded-xl p-3 shadow-sm">
          <div className="text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
            Chance de Acerto
          </div>
          <div className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
            {(results.totalHitChance * 100).toFixed(1)}%
          </div>
          <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, results.totalHitChance * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Dano Médio por Ataque */}
      <div className="bg-stone-50 dark:bg-stone-950/80 border border-stone-200 dark:border-stone-800/80 rounded-xl p-3 flex items-center justify-between gap-3 shadow-sm">
        <div className="text-xs font-medium text-stone-700 dark:text-stone-300">
          Dano Médio por Ataque
        </div>
        <div className="text-lg font-bold font-mono text-amber-800 dark:text-amber-200">
          {results.averageDamagePerAttack.toFixed(2)}
        </div>
      </div>

      {/* Detailed Math Breakdown Drawer */}
      {showFormulas && (
        <div className="mt-4 p-4 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs sm:text-sm space-y-3 text-stone-800 dark:text-stone-300 font-mono shadow-sm">
          <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2 font-sans border-b border-stone-200 dark:border-stone-800 pb-2">
            <Sparkles className="w-4 h-4" />
            Memória de Cálculo (Lógica da Planilha T20):
          </div>

          <div className="space-y-2 text-xs sm:text-sm">
            <p>
              <strong className="text-stone-900 dark:text-stone-100">A. Dano Médio:</strong>{' '}
              {results.baseWeaponAverage.toFixed(1)} (arma)
              {results.extraDamageAverage > 0 ? ` + ${results.extraDamageAverage.toFixed(1)} (extra)` : ''}
              {results.specialCritTotalNormal > 0 ? ` + ${results.specialCritTotalNormal.toFixed(1)} (esp.)` : ''}
              {` + bônus - ${results.effectiveRD} (RD) = `}
              <span className="text-amber-800 dark:text-amber-300 font-bold">{results.averageDamage.toFixed(2)}</span>
            </p>

            <p>
              <strong className="text-stone-900 dark:text-stone-100">B. Dano Médio Crítico:</strong>{' '}
              ({results.baseWeaponAverage.toFixed(1)} x {criticalMultiplier})
              {results.specialCritTotalNormal > 0 ? ` + (${results.specialCritTotalNormal.toFixed(1)} x ${criticalMultiplier} esp.)` : ''}
              {results.extraDamageAverage > 0 ? ` + ${results.extraDamageAverage.toFixed(1)} (extra)` : ''}
              {` + bônus - ${results.effectiveRD} (RD) = `}
              <span className="text-amber-800 dark:text-amber-300 font-bold">{results.averageCriticalDamage.toFixed(2)}</span>
            </p>

            <p>
              <strong className="text-stone-900 dark:text-stone-100">C. Chance de Crítico:</strong>{' '}
              Margem {threatMargin}-20 &rarr; <span className="text-red-700 dark:text-red-400 font-bold">{(results.criticalChance * 100).toFixed(2)}%</span>
            </p>

            <p>
              <strong className="text-stone-900 dark:text-stone-100">D. Chance de Acerto Total:</strong>{' '}
              {enemyDefense <= 0 ? 'Defesa 0 (100% de base)' : `Contra Defesa ${enemyDefense}`} &rarr;{' '}
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">{(results.totalHitChance * 100).toFixed(2)}%</span>{' '}
              (Normal: {(results.normalHitChance * 100).toFixed(2)}%)
            </p>

            <p>
              <strong className="text-stone-900 dark:text-stone-100">E. Dano por Ataque:</strong>{' '}
              ({(results.normalHitChance * 100).toFixed(1)}% x {results.averageDamage.toFixed(2)}) + ({(results.criticalChance * 100).toFixed(1)}% x {results.averageCriticalDamage.toFixed(2)}) ={' '}
              <span className="text-amber-800 dark:text-amber-300 font-bold">{results.averageDamagePerAttack.toFixed(2)}</span>
            </p>

            <p>
              <strong className="text-stone-900 dark:text-stone-100">F. Dano por Turno:</strong>{' '}
              {results.averageDamagePerAttack.toFixed(2)} x {attacksCount} ataques ={' '}
              <span className="text-amber-800 dark:text-amber-300 font-bold">{results.averageDamagePerTurn.toFixed(2)}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
