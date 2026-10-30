/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RotateCcw, Layers, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import logoImg from '../assets/logo_TDAH.png';

interface HeaderProps {
  onReset: () => void;
  onOpenBuildsTab: () => void;
  savedBuildsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onOpenBuildsTab,
  savedBuildsCount,
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-white/95 dark:bg-stone-900/95 border-b border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 px-4 py-3 sticky top-0 z-40 shadow-sm backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* App Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-center shadow-sm overflow-hidden shrink-0">
            <img
              src={logoImg}
              alt="TDAH RPGs"
              className="w-full h-full object-contain p-0.5"
            />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100 font-serif leading-tight">
              Calculadora de Dano T20
            </h1>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              por TDAH RPGs
            </span>
          </div>
        </div>

        {/* Right Actions: Theme Toggle, Builds Shortcut & Reset */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
            className="px-3 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 dark:border-stone-700 dark:text-stone-200 active:scale-95 shadow-sm"
            title={isDark ? 'Mudar para Modo Claro (Acessibilidade)' : 'Mudar para Modo Escuro'}
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline font-semibold">Modo Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline font-semibold">Modo Escuro</span>
              </>
            )}
          </button>

          {/* Builds Button */}
          <button
            type="button"
            onClick={onOpenBuildsTab}
            className="text-xs px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 dark:border-stone-700 dark:text-stone-200 font-medium transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
            title="Acessar Builds Salvas e Comparador de Desempenho"
          >
            <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="font-semibold">Builds</span>
            {savedBuildsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-stone-950 text-xs font-bold flex items-center justify-center font-mono">
                {savedBuildsCount}
              </span>
            )}
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 hover:text-stone-900 dark:bg-stone-800 dark:hover:bg-stone-700 dark:border-stone-700 dark:text-stone-300 dark:hover:text-stone-100 transition-colors active:scale-95 shadow-sm"
            title="Redefinir calculadora para valores padrão"
            aria-label="Redefinir calculadora"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
