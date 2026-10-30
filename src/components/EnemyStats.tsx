/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, Table, Eye, X, ChevronDown, Sparkles, Heart, Swords, Zap, Flame } from 'lucide-react';
import { T20_THREATS, CreatureThreat, getThreatByND, getTierColor } from '../utils/threats';
import tabela23AImg from '../assets/tabela_2_3_a.png';

interface EnemyStatsProps {
  enemyDefense: number;
  setEnemyDefense: (val: number) => void;
  enemyRD: number;
  setEnemyRD: (val: number) => void;
  selectedND: string;
  setSelectedND: (nd: string) => void;
}

export const EnemyStats: React.FC<EnemyStatsProps> = ({
  enemyDefense,
  setEnemyDefense,
  enemyRD,
  setEnemyRD,
  selectedND,
  setSelectedND,
}) => {
  const [showTableModal, setShowTableModal] = useState(false);
  const [isManualCustom, setIsManualCustom] = useState(false);

  const currentThreat = getThreatByND(selectedND);
  const tierColor = currentThreat ? getTierColor(currentThreat.tier) : null;

  const handleSelectND = (nd: string) => {
    setSelectedND(nd);
    setIsManualCustom(false);

    if (nd === '0') {
      // Baseline 0
      setEnemyDefense(0);
      setEnemyRD(0);
      return;
    }

    const threat = getThreatByND(nd);
    if (threat) {
      setEnemyDefense(threat.defense);
      setEnemyRD(threat.rd);
    }
  };

  const tiers = ['Iniciante', 'Veterano', 'Campeão', 'Lenda', 'L+'] as const;

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif">
            Ameaça (Inimigo)
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowTableModal(true)}
          className="text-xs px-2.5 py-1 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors font-medium flex items-center gap-1.5"
          title="Ver imagem oficial da Tabela 2-3 A"
        >
          <Table className="w-3.5 h-3.5" />
          <span>Tabela 2-3 A</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* ND Selector Menu */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">
              Nível de Desafio (ND)
            </span>
            <button
              type="button"
              onClick={() => handleSelectND('0')}
              className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-all font-semibold ${
                selectedND === '0'
                  ? 'bg-red-700 border-red-600 text-white shadow-sm'
                  : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
              }`}
            >
              Defesa 0 (Livre)
            </button>
          </div>

          {/* Quick ND tabs by Tier */}
          <div className="space-y-2">
            {tiers.map((tier) => {
              const threatsInTier = T20_THREATS.filter((t) => t.tier === tier);
              const color = getTierColor(tier);

              return (
                <div key={tier} className="flex flex-col sm:flex-row sm:items-center gap-2 p-1.5 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800/60">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${color.bg} ${color.text} shrink-0 text-center sm:text-left min-w-[75px]`}>
                    {tier}
                  </span>

                  <div className="flex items-center gap-1 flex-wrap flex-1">
                    {threatsInTier.map((t) => {
                      const isSelected = selectedND === t.nd && !isManualCustom;
                      return (
                        <button
                          key={t.nd}
                          type="button"
                          onClick={() => handleSelectND(t.nd)}
                          className={`px-2 py-1 text-xs font-mono font-bold rounded-md border transition-all text-center min-w-[34px] ${
                            isSelected
                              ? 'bg-red-700 border-red-500 text-white shadow-sm'
                              : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                          }`}
                          title={`ND ${t.nd}: Defesa ${t.defense}, RD ${t.rd}, PV ${t.pv}`}
                        >
                          {t.nd}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Threat Summary & Manual Override */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-stone-200 dark:border-stone-800">
          {/* Defesa do Inimigo */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Defesa da Ameaça
              </label>
              {currentThreat && (
                <span className="text-xs font-mono text-stone-500">
                  ND {currentThreat.nd} (Def {currentThreat.defense})
                </span>
              )}
            </div>

            <input
              type="number"
              min="0"
              aria-label="Defesa do Inimigo"
              value={enemyDefense}
              onChange={(e) => {
                setIsManualCustom(true);
                setEnemyDefense(Math.max(0, parseInt(e.target.value) || 0));
              }}
              className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-2 text-center text-xl font-bold font-mono text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="0"
            />
          </div>

          {/* RD do Inimigo */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Redução de Dano (RD)
              </label>
              {currentThreat && (
                <span className="text-xs font-mono text-stone-500">
                  RD {currentThreat.rd}
                </span>
              )}
            </div>

            <input
              type="number"
              min="0"
              aria-label="Redução de Dano do Inimigo"
              value={enemyRD}
              onChange={(e) => {
                setIsManualCustom(true);
                setEnemyRD(Math.max(0, parseInt(e.target.value) || 0));
              }}
              className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-2 text-center text-xl font-bold font-mono text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="0"
            />
          </div>
        </div>

        {/* Threat Full Parameters Sheet from Tabela 2-3 A */}
        {currentThreat && (
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800/80 pb-2.5">
              <div className="flex items-center gap-2.5">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono uppercase ${tierColor?.bg} ${tierColor?.text} border ${tierColor?.border}`}>
                  ND {currentThreat.nd} • Patamar {currentThreat.tier}
                </span>
                <span className="text-sm font-serif font-bold text-stone-900 dark:text-stone-100">
                  Ficha Oficial da Criatura Solo (Tabela 2-3 A)
                </span>
              </div>
              <span className="text-xs text-stone-600 dark:text-stone-400 font-mono hidden sm:inline">
                Ameaças de Arton / Livro Básico
              </span>
            </div>

            {/* 6 Grid items for all 6 parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
              {/* Defesa */}
              <div className="p-3 rounded-xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 flex flex-col justify-between shadow-sm">
                <span className="text-xs text-stone-600 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5 font-sans font-semibold">
                  <Shield className="w-3.5 h-3.5 text-red-600 dark:text-red-400" /> Defesa
                </span>
                <div className="text-lg font-bold text-stone-900 dark:text-stone-100 mt-1">
                  {currentThreat.defense}
                </div>
                <span className="text-xs text-stone-600 dark:text-stone-400 font-sans mt-0.5">
                  {isManualCustom ? `Manual: ${enemyDefense}` : 'Oficial da tabela'}
                </span>
              </div>

              {/* RD */}
              <div className="p-3 rounded-xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 flex flex-col justify-between shadow-sm">
                <span className="text-xs text-stone-600 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5 font-sans font-semibold">
                  <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Redução de Dano
                </span>
                <div className="text-lg font-bold text-amber-800 dark:text-amber-300 mt-1">
                  RD {currentThreat.rd}
                </div>
                <span className="text-xs text-stone-600 dark:text-stone-400 font-sans mt-0.5">
                  {isManualCustom ? `Manual: RD ${enemyRD}` : `Patamar ${currentThreat.tier}`}
                </span>
              </div>

              {/* Pontos de Vida (PV) */}
              <div className="p-3 rounded-xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 flex flex-col justify-between shadow-sm">
                <span className="text-xs text-stone-600 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5 font-sans font-semibold">
                  <Heart className="w-3.5 h-3.5 text-red-600 dark:text-red-500" /> Pontos de Vida
                </span>
                <div className="text-lg font-bold text-red-700 dark:text-red-400 mt-1">
                  {currentThreat.pv.toLocaleString('pt-BR')} PV
                </div>
                <span className="text-xs text-stone-600 dark:text-stone-400 font-sans mt-0.5">
                  Criatura Solo
                </span>
              </div>

              {/* Bônus de Ataque */}
              <div className="p-3 rounded-xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 flex flex-col justify-between shadow-sm">
                <span className="text-xs text-stone-600 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5 font-sans font-semibold">
                  <Swords className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Teste de Ataque
                </span>
                <div className="text-lg font-bold text-amber-800 dark:text-amber-200 mt-1">
                  +{currentThreat.attackValue}
                </div>
                <span className="text-xs text-stone-600 dark:text-stone-400 font-sans mt-0.5">
                  Ataque da criatura
                </span>
              </div>

              {/* Dano Médio da Criatura */}
              <div className="p-3 rounded-xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 flex flex-col justify-between shadow-sm">
                <span className="text-xs text-stone-600 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5 font-sans font-semibold">
                  <Flame className="w-3.5 h-3.5 text-red-600 dark:text-red-400" /> Dano da Criatura
                </span>
                <div className="text-lg font-bold text-stone-900 dark:text-stone-100 mt-1">
                  {currentThreat.averageDamage} <span className="text-xs text-stone-600 dark:text-stone-400 font-normal">médio</span>
                </div>
                <span className="text-xs text-stone-600 dark:text-stone-400 font-sans mt-0.5">
                  Por rodada contra o grupo
                </span>
              </div>

              {/* CD Padrão */}
              <div className="p-3 rounded-xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 flex flex-col justify-between shadow-sm">
                <span className="text-xs text-stone-600 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5 font-sans font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> CD de Habilidades
                </span>
                <div className="text-lg font-bold text-purple-700 dark:text-purple-300 mt-1">
                  CD {currentThreat.standardDC}
                </div>
                <span className="text-xs text-stone-600 dark:text-stone-400 font-sans mt-0.5">
                  Resistência contra magias
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal showing Tabela 2-3 A official image */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950">
              <div className="flex items-center gap-2">
                <Table className="w-5 h-5 text-red-600 dark:text-red-500" />
                <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base">
                  Tabela 2-3 A: Parâmetros de Criaturas Solos (T20 / Ameaças de Arton)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white"
                aria-label="Fechar tabela"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-stone-100 dark:bg-stone-950 flex flex-col items-center">
              <img
                src={tabela23AImg}
                alt="Tabela 2-3 A: Parâmetros de Criaturas Solos"
                className="w-full max-h-[70vh] object-contain rounded-lg border border-stone-300 dark:border-stone-800 shadow"
              />
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2.5 text-center font-medium">
                Valores de Defesa sincronizados automaticamente pelo ND selecionado. RD configurada conforme patamar: Iniciante (0), Veterano (5), Campeão (10) e Lenda/L+ (20).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
