/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CalculatorResults } from '../utils/calculator';
import { CreatureThreat } from '../utils/threats';
import { Heart, Swords, Shield, Zap, Skull, Clock, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ThreatCombatAnalysisProps {
  threat?: CreatureThreat;
  results: CalculatorResults;
  attacksCount: number;
}

export const ThreatCombatAnalysis: React.FC<ThreatCombatAnalysisProps> = ({
  threat,
  results,
  attacksCount,
}) => {
  if (!threat || threat.nd === '0') {
    return (
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 text-center text-sm text-stone-600 dark:text-stone-300 shadow-sm">
        <p>Selecione um ND da criatura para visualizar a ficha completa de combate e estimativa de abate.</p>
      </div>
    );
  }

  const dpr = Math.max(0.01, results.averageDamagePerTurn);
  const dmgPerAttack = Math.max(0.01, results.averageDamagePerAttack);

  // Turnos para abater (Time-to-Kill)
  const turnsToKill = threat.pv / dpr;
  const turnsCeil = Math.ceil(turnsToKill);
  const attacksToKill = Math.ceil(threat.pv / dmgPerAttack);

  // Dano estimado que a criatura causa de volta durante o combate
  const expectedEnemyDamageTaken = threat.averageDamage * Math.max(0, turnsCeil - 1);

  // Health progression per round (up to 4 rounds)
  const maxRounds = Math.min(5, Math.max(2, turnsCeil));
  const rounds = Array.from({ length: maxRounds }, (_, i) => {
    const roundNumber = i + 1;
    const accumulatedDamage = Math.min(threat.pv, dpr * roundNumber);
    const remainingPV = Math.max(0, threat.pv - accumulatedDamage);
    const remainingPercent = Math.max(0, Math.round((remainingPV / threat.pv) * 100));
    return {
      roundNumber,
      accumulatedDamage,
      remainingPV,
      remainingPercent,
    };
  });

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm space-y-4 transition-colors">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-red-600 dark:text-red-400" />
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif">
            Análise de Combate (TTK)
          </h3>
        </div>
        <span className="text-xs font-mono font-semibold text-stone-500 dark:text-stone-400">
          ND {threat.nd} · {threat.tier}
        </span>
      </div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-red-50 dark:bg-stone-950 border border-red-200 dark:border-red-900/60 p-3.5 rounded-xl shadow-sm">
          <div className="flex items-center gap-1.5 text-red-700 dark:text-red-400 text-xs font-semibold mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Turnos para Abater</span>
          </div>
          <div className="text-2xl font-bold font-mono text-red-800 dark:text-amber-300">
            {turnsToKill <= 1 ? (
              <span className="text-emerald-700 dark:text-emerald-400">1 Turno (OTK!)</span>
            ) : (
              `${turnsToKill.toFixed(1)} turnos`
            )}
          </div>
        </div>

        <div className="bg-stone-50 dark:bg-stone-950/70 border border-stone-200 dark:border-stone-800/80 p-3.5 rounded-xl shadow-sm">
          <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300 text-xs font-semibold mb-1">
            <Heart className="w-3.5 h-3.5 text-red-600 dark:text-red-500" />
            <span>Pontos de Vida (PV)</span>
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900 dark:text-stone-100">
            {threat.pv.toLocaleString('pt-BR')} <span className="text-xs font-normal text-stone-500">PV</span>
          </div>
        </div>

        <div className="bg-stone-50 dark:bg-stone-950/70 border border-stone-200 dark:border-stone-800/80 p-3.5 rounded-xl shadow-sm">
          <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 text-xs font-semibold mb-1">
            <Swords className="w-3.5 h-3.5" />
            <span>Retaliação da Ameaça</span>
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900 dark:text-stone-100">
            ~{threat.averageDamage} <span className="text-xs font-normal text-stone-500">/ rodada</span>
          </div>
        </div>
      </div>

      {/* Visual Health Breakdown Per Turn */}
      <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
            Progressão de PV por Rodada:
          </span>
          <span className="text-xs text-amber-700 dark:text-amber-300 font-mono font-medium">
            {turnsToKill <= 1 ? 'Abate no 1º turno' : `Abate na ${turnsCeil}ª rodada`}
          </span>
        </div>

        <div className="space-y-3">
          {rounds.map((r) => (
            <div key={r.roundNumber} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm font-mono">
                <span className="text-stone-800 dark:text-stone-200 font-semibold">
                  Rodada {r.roundNumber}:
                </span>
                <span className="text-stone-600 dark:text-stone-400">
                  {r.remainingPV > 0 ? (
                    <>
                      {r.remainingPV.toFixed(0)} PV restantes ({r.remainingPercent}%)
                    </>
                  ) : (
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Abatida! (0 PV)
                    </span>
                  )}
                </span>
              </div>

              <div className="w-full bg-stone-200 dark:bg-stone-900 h-2.5 rounded-full overflow-hidden border border-stone-300 dark:border-stone-800">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    r.remainingPercent === 0
                      ? 'bg-stone-400 dark:bg-stone-800'
                      : r.remainingPercent > 50
                      ? 'bg-red-600 dark:bg-red-500'
                      : r.remainingPercent > 20
                      ? 'bg-amber-600 dark:bg-amber-500'
                      : 'bg-red-800 dark:bg-red-700'
                  }`}
                  style={{ width: `${r.remainingPercent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tactical Assessment Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
        {/* Acerto e Defesa */}
        <div className="p-3 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800/80 flex items-start gap-2.5 shadow-sm">
          <div className="w-6 h-6 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center shrink-0 mt-0.5">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-stone-900 dark:text-stone-200 text-xs sm:text-sm">
              Precisão vs Defesa ({threat.defense})
            </div>
            <div className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
              Acerto Total: <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{(results.totalHitChance * 100).toFixed(1)}%</strong> | Crítico: <strong className="text-red-700 dark:text-red-400 font-bold">{(results.criticalChance * 100).toFixed(1)}%</strong>
            </div>
          </div>
        </div>

        {/* Efeito da RD */}
        <div className="p-3 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800/80 flex items-start gap-2.5 shadow-sm">
          <div className="w-6 h-6 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center shrink-0 mt-0.5">
            <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <div className="font-semibold text-stone-900 dark:text-stone-200 text-xs sm:text-sm">
              Resistências & Perigos
            </div>
            <div className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
              RD Efetiva: <strong className="text-amber-800 dark:text-amber-300 font-bold">{results.effectiveRD}</strong> (Base: {threat.rd}) • CD de Habilidades: <strong className="text-purple-700 dark:text-purple-300 font-bold">CD {threat.standardDC}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
