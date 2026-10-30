/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PresetBuild, PRESET_BUILDS } from '../utils/presetBuilds';
import { calculateT20Damage } from '../utils/calculator';
import { getThreatByND } from '../utils/threats';
import {
  BookmarkPlus,
  BookmarkCheck,
  Trash2,
  Check,
  BarChart3,
  Swords,
  Sparkles,
  Zap,
  ArrowRight,
  Shield,
  Layers,
  Crown,
  HelpCircle,
  X,
} from 'lucide-react';

interface BuildsTabProps {
  currentBuildData: Omit<PresetBuild, 'id' | 'name' | 'tagline' | 'level' | 'tier' | 'statsSummary'>;
  userBuilds: PresetBuild[];
  onSaveBuild: (name: string, level?: number) => void;
  onDeleteBuild: (id: string) => void;
  onSelectBuild: (build: PresetBuild) => void;
  activeBuildId?: string;
  onNavigateToTab: (tab: 'character' | 'threat') => void;
}

export const BuildsTab: React.FC<BuildsTabProps> = ({
  currentBuildData,
  userBuilds,
  onSaveBuild,
  onDeleteBuild,
  onSelectBuild,
  activeBuildId,
  onNavigateToTab,
}) => {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newBuildName, setNewBuildName] = useState('');
  const [newBuildLevel, setNewBuildLevel] = useState<number>(1);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>(() => {
    // Default compare first preset build and second preset build
    return ['lutador-dojo-lv20', 'magimarcialista-crit-lv11'];
  });

  const allAvailableBuilds = [...userBuilds, ...PRESET_BUILDS];

  const handleOpenSaveModal = () => {
    setNewBuildName(`Minha Build #${userBuilds.length + 1}`);
    setNewBuildLevel(10);
    setShowSaveModal(true);
  };

  const handleConfirmSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBuildName.trim()) return;
    onSaveBuild(newBuildName.trim(), newBuildLevel);
    setShowSaveModal(false);
  };

  const toggleComparison = (id: string) => {
    setSelectedForComparison((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev; // Keep at least one
        return prev.filter((item) => item !== id);
      } else {
        if (prev.length >= 4) {
          // Max 4 for clean comparative display
          return [...prev.slice(1), id];
        }
        return [...prev, id];
      }
    });
  };

  // Compute calculated metrics for comparison
  const comparisonResults = selectedForComparison.map((id) => {
    const build = allAvailableBuilds.find((b) => b.id === id);
    if (!build) return null;

    const res = calculateT20Damage({
      baseDamageIndex: build.baseDamageIndex,
      stepModifier: build.stepModifier,
      extraDicePools: build.extraDicePools,
      numericBonus: build.numericBonus,
      critExtraDicePools: build.critExtraDicePools,
      critNumericBonus: build.critNumericBonus,
      threatMargin: build.threatMargin,
      criticalMultiplier: build.criticalMultiplier,
      diceCount: build.diceCount,
      rerollsCount: build.rerollsCount,
      attacksCount: build.attacksCount,
      rdReduction: build.rdReduction,
      enemyDefense: build.enemyDefense,
      enemyRD: build.enemyRD,
      attackBonus: build.attackBonus,
    });

    const threat = getThreatByND(build.selectedND);
    const ttkTurns = threat && res.averageDamagePerTurn > 0 ? (threat.pv / res.averageDamagePerTurn).toFixed(1) : '-';

    return {
      build,
      res,
      threat,
      ttkTurns,
    };
  }).filter(Boolean);

  const highestDpr = Math.max(...comparisonResults.map((c) => c?.res.averageDamagePerTurn || 0), 1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner with Action to Save Current Configuration */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-red-900/60 border border-amber-300 dark:border-red-700/60 flex items-center justify-center text-amber-800 dark:text-amber-300 shrink-0 shadow-sm">
            <BookmarkCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
              Gerenciador de Builds & Comparador
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
              Salve suas configurações personalizadas, alterne entre builds prontas e compare o DPR lado a lado.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenSaveModal}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-950/30 active:scale-95 transition-all"
        >
          <BookmarkPlus className="w-4 h-4" />
          <span>Salvar Build Atual</span>
        </button>
      </div>

      {/* SECTION 1: Minhas Builds Salvas */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm relative overflow-hidden transition-colors">
        <div className="flex items-center justify-between mb-4 border-b border-stone-200 dark:border-stone-800/80 pb-3">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 font-serif">
                Minhas Builds Salvas ({userBuilds.length})
              </h3>
            </div>
          </div>
        </div>

        {userBuilds.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-dashed border-stone-300 dark:border-stone-800 text-sm text-stone-600 dark:text-stone-400 space-y-3">
            <p>Você ainda não possui builds personalizadas salvas.</p>
            <button
              type="button"
              onClick={handleOpenSaveModal}
              className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-amber-300 font-semibold inline-flex items-center gap-2 text-sm shadow-sm transition-all"
            >
              <BookmarkPlus className="w-4 h-4" />
              <span>Salvar parâmetros atuais como build</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {userBuilds.map((build) => {
              const isActive = activeBuildId === build.id;
              const isCompared = selectedForComparison.includes(build.id);

              return (
                <div
                  key={build.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    isActive
                      ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-400 dark:border-amber-500/60 ring-1 ring-amber-400/40'
                      : 'bg-stone-50 dark:bg-stone-950/70 border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-700'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 font-serif">
                            {build.name}
                          </span>
                          {isActive && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 font-mono font-bold border border-amber-300 dark:border-amber-500/40">
                              Ativa
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-stone-600 dark:text-stone-400 font-mono">
                          Nv {build.level} • {build.tagline}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onDeleteBuild(build.id)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
                        title="Excluir build salva"
                        aria-label="Excluir build"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Stats pills */}
                    <div className="grid grid-cols-2 gap-1.5 text-xs font-mono text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900/70 p-3 rounded-xl border border-stone-200 dark:border-stone-800 mb-3 shadow-sm">
                      <div>• Atk: <span className="text-stone-900 dark:text-stone-100 font-bold">+{build.attackBonus}</span></div>
                      <div>• Crítico: <span className="text-red-700 dark:text-red-400 font-bold">{build.threatMargin}-20/x{build.criticalMultiplier}</span></div>
                      <div>• Arma: <span className="text-stone-900 dark:text-stone-100">{build.baseDamageLabel} (+{build.stepModifier})</span></div>
                      <div>• Ataques: <span className="text-stone-900 dark:text-stone-100 font-bold">{build.attacksCount}x</span></div>
                      <div>• Bônus: <span className="text-stone-900 dark:text-stone-100">+{build.numericBonus}</span></div>
                      <div>• Alvo: <span className="text-amber-800 dark:text-amber-300 font-bold">ND {build.selectedND}</span></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-stone-200 dark:border-stone-800/60 gap-2">
                    <label className="flex items-center gap-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300 cursor-pointer select-none font-medium">
                      <input
                        type="checkbox"
                        checked={isCompared}
                        onChange={() => toggleComparison(build.id)}
                        className="rounded border-stone-300 text-red-600 focus:ring-0 w-4 h-4"
                      />
                      <span>Comparar</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectBuild(build);
                        onNavigateToTab('character');
                      }}
                      className="text-xs sm:text-sm px-3.5 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-700 text-white font-semibold flex items-center gap-1.5 transition-colors active:scale-95 shadow-sm"
                    >
                      <span>Carregar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: Builds Prontas Oficiais */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm relative overflow-hidden transition-colors">
        <div className="flex items-center justify-between mb-4 border-b border-stone-200 dark:border-stone-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 font-serif">
              Builds Prontas de Exemplo
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {PRESET_BUILDS.map((build) => {
            const isActive = activeBuildId === build.id;
            const isCompared = selectedForComparison.includes(build.id);

            return (
              <div
                key={build.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-400 dark:border-amber-500/60 ring-1 ring-amber-400/40'
                    : 'bg-stone-50 dark:bg-stone-950/70 border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 font-serif">
                          {build.name}
                        </span>
                        {isActive && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 font-mono font-bold border border-amber-300 dark:border-amber-500/40">
                            Ativa
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-stone-600 dark:text-stone-400 font-mono">
                        Nv {build.level} • {build.tagline}
                      </span>
                    </div>

                    <span className="text-xs font-mono uppercase px-2 py-1 rounded-lg bg-stone-200 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 text-amber-800 dark:text-amber-300 shrink-0 font-bold">
                      ND {build.selectedND}
                    </span>
                  </div>

                  {/* Summary badges */}
                  <div className="grid grid-cols-2 gap-1.5 text-xs font-mono text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900/70 p-3 rounded-xl border border-stone-200 dark:border-stone-800 mb-3 shadow-sm">
                    <div>• Atk: <span className="text-stone-900 dark:text-stone-100 font-bold">+{build.attackBonus}</span></div>
                    <div>• Crítico: <span className="text-red-700 dark:text-red-400 font-bold">{build.threatMargin}-20/x{build.criticalMultiplier}</span></div>
                    <div>• Arma: <span className="text-stone-900 dark:text-stone-100">{build.baseDamageLabel} (+{build.stepModifier})</span></div>
                    <div>• Ataques: <span className="text-stone-900 dark:text-stone-100 font-bold">{build.attacksCount}x</span></div>
                    <div>• Bônus: <span className="text-stone-900 dark:text-stone-100">+{build.numericBonus}{build.critNumericBonus > 0 ? ` (+${build.critNumericBonus} esp)` : ''}</span></div>
                    <div>• Rerrolagens: <span className="text-stone-900 dark:text-stone-100">{build.rerollsCount}x (3d20)</span></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2.5 border-t border-stone-200 dark:border-stone-800/60 gap-2">
                  <label className="flex items-center gap-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300 cursor-pointer select-none font-medium">
                    <input
                      type="checkbox"
                      checked={isCompared}
                      onChange={() => toggleComparison(build.id)}
                      className="rounded border-stone-300 text-red-600 focus:ring-0 w-4 h-4"
                    />
                    <span>Comparar</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectBuild(build);
                      onNavigateToTab('threat');
                    }}
                    className="text-xs sm:text-sm px-3.5 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-700 text-white font-semibold flex items-center gap-1.5 transition-colors active:scale-95 shadow-sm"
                  >
                    <span>Carregar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Tabela Comparativa de Builds */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm relative overflow-hidden space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800/80 pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 font-serif">
              Comparador Lado a Lado
            </h3>
          </div>
          <span className="text-xs sm:text-sm font-mono text-stone-600 dark:text-stone-400 font-semibold">
            {comparisonResults.length} {comparisonResults.length === 1 ? 'build selecionada' : 'builds selecionadas'}
          </span>
        </div>

        {comparisonResults.length === 0 ? (
          <div className="p-8 text-center text-sm text-stone-600 dark:text-stone-400">
            Nenhuma build selecionada para comparação. Marque a caixa "Comparar" em pelo menos uma build.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm font-mono border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-400">
                  <th className="py-3 px-3.5 font-sans font-bold">Parâmetro / Estatística</th>
                  {comparisonResults.map((item) => (
                    <th key={item?.build.id} className="py-3 px-3.5 min-w-[170px]">
                      <div className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm truncate">
                        {item?.build.name}
                      </div>
                      <div className="text-xs text-stone-600 dark:text-stone-400 font-sans font-normal truncate mt-0.5">
                        Nv {item?.build.level} • ND {item?.build.selectedND}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800/60 text-stone-800 dark:text-stone-300">
                {/* DPR Hero Metric */}
                <tr className="bg-red-50 dark:bg-red-950/20">
                  <td className="py-3.5 px-3.5 font-sans font-bold text-red-800 dark:text-amber-300 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    Dano Médio / Turno (DPR)
                  </td>
                  {comparisonResults.map((item) => {
                    const isWinner = item?.res.averageDamagePerTurn === highestDpr;
                    return (
                      <td key={item?.build.id} className="py-3.5 px-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-extrabold text-red-800 dark:text-amber-300">
                            {item?.res.averageDamagePerTurn.toFixed(1)}
                          </span>
                          {isWinner && (
                            <span className="text-xs uppercase px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-sans font-bold flex items-center gap-1 shadow-sm">
                              <Crown className="w-3 h-3" /> Maior
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Dano Normal vs Dano Crítico */}
                <tr>
                  <td className="py-2.5 px-3.5 font-sans text-stone-600 dark:text-stone-400 font-medium">Dano Normal (Média)</td>
                  {comparisonResults.map((item) => (
                    <td key={item?.build.id} className="py-2.5 px-3.5 text-stone-900 dark:text-stone-200 font-semibold">
                      {item?.res.averageDamage.toFixed(1)}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-2.5 px-3.5 font-sans text-stone-600 dark:text-stone-400 font-medium">Dano Crítico (Média)</td>
                  {comparisonResults.map((item) => (
                    <td key={item?.build.id} className="py-2.5 px-3.5 text-amber-800 dark:text-amber-400 font-bold">
                      {item?.res.averageCriticalDamage.toFixed(1)}
                    </td>
                  ))}
                </tr>

                {/* Acerto e Crítico */}
                <tr>
                  <td className="py-2.5 px-3.5 font-sans text-stone-600 dark:text-stone-400 font-medium">Chance de Acerto Total</td>
                  {comparisonResults.map((item) => (
                    <td key={item?.build.id} className="py-2.5 px-3.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                      {((item?.res.totalHitChance || 0) * 100).toFixed(1)}%
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-2.5 px-3.5 font-sans text-stone-600 dark:text-stone-400 font-medium">Chance de Acerto Crítico</td>
                  {comparisonResults.map((item) => (
                    <td key={item?.build.id} className="py-2.5 px-3.5 text-red-700 dark:text-red-400 font-semibold">
                      {((item?.res.criticalChance || 0) * 100).toFixed(1)}%
                    </td>
                  ))}
                </tr>

                {/* Combate Ficha */}
                <tr>
                  <td className="py-2.5 px-3.5 font-sans text-stone-600 dark:text-stone-400 font-medium">Ataque vs Defesa</td>
                  {comparisonResults.map((item) => (
                    <td key={item?.build.id} className="py-2.5 px-3.5 text-stone-800 dark:text-stone-300">
                      +{item?.build.attackBonus} vs Def {item?.build.enemyDefense}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-2.5 px-3.5 font-sans text-stone-600 dark:text-stone-400 font-medium">Ataques por Turno</td>
                  {comparisonResults.map((item) => (
                    <td key={item?.build.id} className="py-2.5 px-3.5 text-stone-800 dark:text-stone-300 font-semibold">
                      {item?.build.attacksCount}x
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-2.5 px-3.5 font-sans text-stone-600 dark:text-stone-400 font-medium">Multiplicador Crítico</td>
                  {comparisonResults.map((item) => (
                    <td key={item?.build.id} className="py-2.5 px-3.5 text-stone-900 dark:text-stone-200">
                      x{item?.build.criticalMultiplier} ({item?.build.threatMargin}-20)
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-2.5 px-3.5 font-sans text-stone-600 dark:text-stone-400 font-medium">Turnos para Abater (TTK)</td>
                  {comparisonResults.map((item) => (
                    <td key={item?.build.id} className="py-2.5 px-3.5 text-amber-800 dark:text-amber-300 font-bold">
                      {item?.ttkTurns} {item?.ttkTurns === '1.0' ? '(OTK)' : 'turnos'}
                    </td>
                  ))}
                </tr>

                {/* Load button row */}
                <tr>
                  <td className="py-3 px-3.5 font-sans text-stone-600 dark:text-stone-500 font-medium">Ação</td>
                  {comparisonResults.map((item) => (
                    <td key={item?.build.id} className="py-3 px-3.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (item?.build) {
                            onSelectBuild(item.build);
                            onNavigateToTab('threat');
                          }
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-200 hover:text-stone-950 dark:hover:text-white border border-stone-300 dark:border-stone-700 transition-colors font-semibold shadow-sm"
                      >
                        Carregar no App
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Save Build Modal */}
      {showSaveModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base flex items-center gap-2">
                <BookmarkPlus className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                Salvar Configuração Atual
              </h4>
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSave} className="p-5 space-y-4">
              <div>
                <label className="text-sm font-semibold text-stone-800 dark:text-stone-300 block mb-1.5">
                  Nome da Build:
                </label>
                <input
                  type="text"
                  required
                  value={newBuildName}
                  onChange={(e) => setNewBuildName(e.target.value)}
                  placeholder="Ex: Guerreiro Crítico Lv8"
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-xl px-4 py-2.5 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-stone-800 dark:text-stone-300 block mb-1.5">
                  Nível do Personagem:
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={newBuildLevel}
                  onChange={(e) => setNewBuildLevel(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-xl px-4 py-2.5 text-stone-900 dark:text-stone-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-700 dark:text-stone-400 space-y-1 font-mono">
                <div>• Arma Atual: {currentBuildData.baseDamageLabel} (+{currentBuildData.stepModifier})</div>
                <div>• Ataque: +{currentBuildData.attackBonus} • Margem: {currentBuildData.threatMargin}-20/x{currentBuildData.criticalMultiplier}</div>
                <div>• Ataques: {currentBuildData.attacksCount}x • Redução RD: {currentBuildData.rdReduction}</div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm shadow-md transition-colors"
                >
                  Salvar Build
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
