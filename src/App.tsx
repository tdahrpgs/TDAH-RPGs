/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { AttackBonus } from './components/AttackBonus';
import { Step1Damage } from './components/Step1Damage';
import { Step2Crit } from './components/Step2Crit';
import { Step3DiceRerolls } from './components/Step3DiceRerolls';
import { Step4Attacks } from './components/Step4Attacks';
import { Step5Penetration } from './components/Step5Penetration';
import { EnemyStats } from './components/EnemyStats';
import { ResultsPanel } from './components/ResultsPanel';
import { calculateT20Damage, ExtraDicePool } from './utils/calculator';
import { PresetBuild } from './utils/presetBuilds';
import { loadUserBuilds, addUserBuild, removeUserBuild } from './utils/savedBuilds';
import { getThreatByND } from './utils/threats';
import { ThreatCombatAnalysis } from './components/ThreatCombatAnalysis';
import { BuildsTab } from './components/BuildsTab';
import { ArrowRight, ArrowLeft, Flame, Swords, ShieldAlert, Sparkles, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'character' | 'threat' | 'builds'>('character');
  const [activeBuildId, setActiveBuildId] = useState<string | undefined>();
  const [userBuilds, setUserBuilds] = useState<PresetBuild[]>(() => loadUserBuilds());

  // ★ Bônus de Ataque do Personagem (Primeira estatística do Personagem & Ataque)
  const [attackBonus, setAttackBonus] = useState<number>(0);

  // 1. Passos de Dano, Dano Extra e Bônus Numéricos
  const [baseDamageIndex, setBaseDamageIndex] = useState<number>(5); // 1d8
  const [stepModifier, setStepModifier] = useState<number>(0);
  const [extraDicePools, setExtraDicePools] = useState<ExtraDicePool[]>([]);
  const [numericBonus, setNumericBonus] = useState<number>(5);

  // 2. Margem de Ameaça e Multiplicador (Margem mínima 2, multiplicador livre)
  const [threatMargin, setThreatMargin] = useState<number>(20);
  const [criticalMultiplier, setCriticalMultiplier] = useState<number>(2);

  // Caso Especial: Danos Extras que Multiplicam no Crítico (dados ou bônus numéricos especiais)
  const [critExtraDicePools, setCritExtraDicePools] = useState<ExtraDicePool[]>([]);
  const [critNumericBonus, setCritNumericBonus] = useState<number>(0);

  // 3. Número de Dados e Número de Rerrolagens (Pesca de Crítico otimizada)
  const [diceCount, setDiceCount] = useState<number>(1);
  const [rerollsCount, setRerollsCount] = useState<number>(0);

  // 4. Número de Ataques (Sem limite de 10)
  const [attacksCount, setAttacksCount] = useState<number>(1);

  // 5. Redução de RD / Penetração
  const [rdReduction, setRdReduction] = useState<number>(0);

  // Estatísticas da Ameaça (Menu com NDs da Tabela 2-3 A e patamares de RD)
  const [selectedND, setSelectedND] = useState<string>('0');
  const [enemyDefense, setEnemyDefense] = useState<number>(0);
  const [enemyRD, setEnemyRD] = useState<number>(0);

  // Compute results
  const results = useMemo(() => {
    return calculateT20Damage({
      baseDamageIndex,
      stepModifier,
      extraDicePools,
      numericBonus,
      critExtraDicePools,
      critNumericBonus,
      threatMargin,
      criticalMultiplier,
      diceCount,
      rerollsCount,
      attacksCount,
      rdReduction,
      enemyDefense,
      enemyRD,
      attackBonus,
    });
  }, [
    baseDamageIndex,
    stepModifier,
    extraDicePools,
    numericBonus,
    critExtraDicePools,
    critNumericBonus,
    threatMargin,
    criticalMultiplier,
    diceCount,
    rerollsCount,
    attacksCount,
    rdReduction,
    enemyDefense,
    enemyRD,
    attackBonus,
  ]);

  const currentThreat = useMemo(() => getThreatByND(selectedND), [selectedND]);

  const handleReset = () => {
    setActiveBuildId(undefined);
    setAttackBonus(0);
    setBaseDamageIndex(5);
    setStepModifier(0);
    setExtraDicePools([]);
    setNumericBonus(0);
    setCritExtraDicePools([]);
    setCritNumericBonus(0);
    setThreatMargin(20);
    setCriticalMultiplier(2);
    setDiceCount(1);
    setRerollsCount(0);
    setAttacksCount(1);
    setRdReduction(0);
    setSelectedND('0');
    setEnemyDefense(0);
    setEnemyRD(0);
  };

  const handleSelectBuild = (build: PresetBuild) => {
    setActiveBuildId(build.id);
    setAttackBonus(build.attackBonus);
    setBaseDamageIndex(build.baseDamageIndex);
    setStepModifier(build.stepModifier);
    setExtraDicePools(build.extraDicePools);
    setNumericBonus(build.numericBonus);
    setCritNumericBonus(build.critNumericBonus);
    setCritExtraDicePools(build.critExtraDicePools);
    setThreatMargin(build.threatMargin);
    setCriticalMultiplier(build.criticalMultiplier);
    setDiceCount(build.diceCount);
    setRerollsCount(build.rerollsCount);
    setAttacksCount(build.attacksCount);
    setRdReduction(build.rdReduction);
    setSelectedND(build.selectedND);
    setEnemyDefense(build.enemyDefense);
    setEnemyRD(build.enemyRD);
  };

  const handleSaveUserBuild = (name: string, level = 10) => {
    const newBuild: PresetBuild = {
      id: `user-${Date.now()}`,
      name,
      tagline: `x${criticalMultiplier} • ${attacksCount} ataques • ND ${selectedND}`,
      level,
      tier: currentThreat ? currentThreat.tier : 'Personalizado',
      attackBonus,
      baseDamageIndex,
      baseDamageLabel: results.baseWeaponLabel,
      stepModifier,
      numericBonus,
      critNumericBonus,
      critExtraDicePools,
      extraDicePools,
      threatMargin,
      criticalMultiplier,
      diceCount,
      rerollsCount,
      attacksCount,
      rdReduction,
      selectedND,
      enemyDefense,
      enemyRD,
      statsSummary: [
        `Ataque: +${attackBonus}`,
        `Margem: ${threatMargin}-20`,
        `Crítico: x${criticalMultiplier}`,
        `Arma: ${results.baseWeaponLabel} (+${stepModifier})`,
        `Bônus: +${numericBonus}${critNumericBonus > 0 ? ` (+${critNumericBonus} esp)` : ''}`,
        `Ataques: ${attacksCount}x`,
        `Alvo: ND ${selectedND}`,
      ],
    };

    const updated = addUserBuild(newBuild);
    setUserBuilds(updated);
    setActiveBuildId(newBuild.id);
  };

  const handleDeleteUserBuild = (id: string) => {
    const updated = removeUserBuild(id);
    setUserBuilds(updated);
    if (activeBuildId === id) {
      setActiveBuildId(undefined);
    }
  };

  const switchToThreatTab = () => {
    setActiveTab('threat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchToCharacterTab = () => {
    setActiveTab('character');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchToBuildsTab = () => {
    setActiveTab('builds');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans pb-24 lg:pb-12 selection:bg-red-800 selection:text-white transition-colors">
      {/* App Header */}
      <Header
        onReset={handleReset}
        onOpenBuildsTab={switchToBuildsTab}
        savedBuildsCount={userBuilds.length}
      />

      {/* Main Tabbed Container */}
      <main className="max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 pb-8 flex-1">
        {/* Navigation Tabs Bar */}
        <nav aria-label="Navegação Principal" className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-5 p-1 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm transition-colors">
          <button
            type="button"
            onClick={() => setActiveTab('character')}
            className={`flex items-center justify-center gap-2 py-2 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'character'
                ? 'bg-red-700 dark:bg-red-900 text-white shadow-sm font-bold'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800'
            }`}
          >
            <Swords className={`w-4 h-4 shrink-0 ${activeTab === 'character' ? 'text-amber-300' : 'text-stone-400'}`} />
            <span className="truncate">Personagem</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('threat')}
            className={`flex items-center justify-center gap-2 py-2 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'threat'
                ? 'bg-red-700 dark:bg-red-900 text-white shadow-sm font-bold'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800'
            }`}
          >
            <ShieldAlert className={`w-4 h-4 shrink-0 ${activeTab === 'threat' ? 'text-amber-300' : 'text-stone-400'}`} />
            <span className="truncate">Ameaça & Resultados</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('builds')}
            className={`flex items-center justify-center gap-2 py-2 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'builds'
                ? 'bg-red-700 dark:bg-red-900 text-white shadow-sm font-bold'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800'
            }`}
          >
            <Layers className={`w-4 h-4 shrink-0 ${activeTab === 'builds' ? 'text-amber-300' : 'text-stone-400'}`} />
            <span className="truncate">Builds</span>
            {userBuilds.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-bold font-mono">
                {userBuilds.length}
              </span>
            )}
          </button>
        </nav>

        {/* TAB 1: Personagem & Ataque */}
        {activeTab === 'character' && (
          <div className="space-y-5 max-w-4xl mx-auto">
            {/* Context bar / info */}
            <div className="flex items-center justify-between px-1 text-sm text-stone-700 dark:text-stone-300">
              <span className="flex items-center gap-2 font-medium">
                <Swords className="w-4 h-4 text-red-600 dark:text-red-400" />
                Parâmetros do Personagem & Ataque
              </span>
              <span className="font-mono text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 bg-stone-200/80 dark:bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-300 dark:border-stone-800">
                Arma: {results.finalWeaponLabel} (méd. {results.baseWeaponAverage.toFixed(1)})
              </span>
            </div>

            {/* ★ Bônus de Ataque do Personagem */}
            <AttackBonus
              attackBonus={attackBonus}
              setAttackBonus={setAttackBonus}
            />

            {/* 1. Passos de Dano, Dano Extra e Bônus Numéricos */}
            <Step1Damage
              baseDamageIndex={baseDamageIndex}
              setBaseDamageIndex={setBaseDamageIndex}
              stepModifier={stepModifier}
              setStepModifier={setStepModifier}
              extraDicePools={extraDicePools}
              setExtraDicePools={setExtraDicePools}
              numericBonus={numericBonus}
              setNumericBonus={setNumericBonus}
              criticalMultiplier={criticalMultiplier}
              critExtraDicePools={critExtraDicePools}
              setCritExtraDicePools={setCritExtraDicePools}
              critNumericBonus={critNumericBonus}
              setCritNumericBonus={setCritNumericBonus}
            />

            {/* 2. Margem de Ameaça e Multiplicador */}
            <Step2Crit
              threatMargin={threatMargin}
              setThreatMargin={setThreatMargin}
              criticalMultiplier={criticalMultiplier}
              setCriticalMultiplier={setCriticalMultiplier}
            />

            {/* 3. Número de Dados e Número de Rerrolagens (Pesca de Crítico) */}
            <Step3DiceRerolls
              diceCount={diceCount}
              setDiceCount={setDiceCount}
              rerollsCount={rerollsCount}
              setRerollsCount={setRerollsCount}
            />

            {/* 4. Número de Ataques */}
            <Step4Attacks
              attacksCount={attacksCount}
              setAttacksCount={setAttacksCount}
            />

            {/* 5. Redução de RD / Penetração */}
            <Step5Penetration
              rdReduction={rdReduction}
              setRdReduction={setRdReduction}
            />

            {/* Navigation to Tab 2 */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={switchToThreatTab}
                className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm active:scale-95 transition-all"
              >
                <span>Ver Resultados do Combate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Ameaça & Resultados */}
        {activeTab === 'threat' && (
          <div className="space-y-5">
            {/* Quick Context bar */}
            <div className="flex items-center justify-between px-1 text-sm text-stone-700 dark:text-stone-300">
              <span className="flex items-center gap-2 font-medium">
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Ameaça Solo & Resultados do Combate
              </span>
              <button
                type="button"
                onClick={switchToCharacterTab}
                className="text-xs sm:text-sm text-amber-700 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 hover:underline flex items-center gap-1.5 font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                Ajustar Personagem
              </button>
            </div>

            {/* 2-Column Responsive Layout on Desktop */}
            <div className="lg:grid lg:grid-cols-12 lg:gap-6 items-start space-y-5 lg:space-y-0">
              {/* Left Column: Enemy Stats & Combat Tactical Analysis */}
              <div className="lg:col-span-7 space-y-5">
                {/* 1. Seleção de ND da Ameaça e Ficha Oficial da Tabela 2-3 A */}
                <EnemyStats
                  enemyDefense={enemyDefense}
                  setEnemyDefense={setEnemyDefense}
                  enemyRD={enemyRD}
                  setEnemyRD={setEnemyRD}
                  selectedND={selectedND}
                  setSelectedND={setSelectedND}
                />

                {/* 2. Análise Tática de Combate, Time-To-Kill e Progressão de Vida */}
                <ThreatCombatAnalysis
                  threat={currentThreat}
                  results={results}
                  attacksCount={attacksCount}
                />
              </div>

              {/* Right Column (Sticky on Desktop): Results Panel */}
              <div id="results-section" className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
                <ResultsPanel
                  results={results}
                  attacksCount={attacksCount}
                  threatMargin={threatMargin}
                  criticalMultiplier={criticalMultiplier}
                  enemyDefense={enemyDefense}
                />

                {/* Back to Character Settings button */}
                <button
                  type="button"
                  onClick={switchToCharacterTab}
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-stone-100 dark:bg-stone-900 dark:hover:bg-stone-800 border border-stone-300 dark:border-stone-800 text-stone-800 dark:text-stone-200 text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                  <span>Voltar para Parâmetros do Personagem</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Builds & Comparador */}
        {activeTab === 'builds' && (
          <BuildsTab
            currentBuildData={{
              attackBonus,
              baseDamageIndex,
              baseDamageLabel: results.baseWeaponLabel,
              stepModifier,
              numericBonus,
              critNumericBonus,
              critExtraDicePools,
              extraDicePools,
              threatMargin,
              criticalMultiplier,
              diceCount,
              rerollsCount,
              attacksCount,
              rdReduction,
              selectedND,
              enemyDefense,
              enemyRD,
            }}
            userBuilds={userBuilds}
            onSaveBuild={handleSaveUserBuild}
            onDeleteBuild={handleDeleteUserBuild}
            onSelectBuild={handleSelectBuild}
            activeBuildId={activeBuildId}
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Footer com Licença e Avisos Legais */}
        <footer className="mt-14 pt-6 pb-2 border-t border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 text-xs">
          <div className="flex items-center gap-2 mb-2.5 font-semibold text-stone-800 dark:text-stone-200 text-sm">
            <span role="img" aria-label="Pergaminho">📜</span>
            <span>Licença e Avisos Legais</span>
          </div>
          <ul className="space-y-1.5 list-disc list-inside leading-relaxed text-stone-600 dark:text-stone-400">
            <li>
              O sistema <strong className="font-semibold text-stone-700 dark:text-stone-300">Tormenta 20</strong> é uma criação de Marcelo Cassaro, Guilherme Dei Svaldi, Leonel Caldela, J.M. Trevisan e Rogério Saladino, publicado e de propriedade da <strong className="font-semibold text-stone-700 dark:text-stone-300">Jambô Editora</strong>.
            </li>
            <li>
              Esta calculadora é um projeto independente da comunidade criado por <strong className="font-semibold text-stone-700 dark:text-stone-300">TDAH RPGs</strong> para fins educacionais e auxílio a mestres e jogadores de mesa.
            </li>
          </ul>
        </footer>
      </main>

      {/* Floating Bottom Bar for Mobile Only (Hidden on Desktop) */}
      <aside
        aria-label="Resumo Rápido de Dano"
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-stone-900/95 border-t border-stone-300 dark:border-red-900/40 backdrop-blur-md px-4 py-3 shadow-2xl transition-colors"
      >
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-700/60 flex items-center justify-center text-red-700 dark:text-amber-400">
              <Flame className="w-5 h-5 fill-red-500/20 dark:fill-amber-500/20" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-stone-600 dark:text-stone-400 font-mono font-semibold">
                DPR Médio
              </div>
              <div className="text-lg font-extrabold font-mono text-red-700 dark:text-amber-300 leading-tight">
                {results.averageDamagePerTurn.toFixed(1)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={switchToCharacterTab}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'character'
                  ? 'bg-red-700 dark:bg-red-900 text-white font-bold shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>Arma</span>
            </button>

            <button
              type="button"
              onClick={switchToThreatTab}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'threat'
                  ? 'bg-red-700 dark:bg-red-900 text-white font-bold shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Ameaça</span>
            </button>

            <button
              type="button"
              onClick={switchToBuildsTab}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'builds'
                  ? 'bg-red-700 dark:bg-red-900 text-white font-bold shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Builds</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
