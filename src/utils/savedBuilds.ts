/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PresetBuild, PRESET_BUILDS } from './presetBuilds';

const STORAGE_KEY = 't20_damage_user_builds';

export function loadUserBuilds(): PresetBuild[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Falha ao carregar builds do usuário:', err);
    return [];
  }
}

export function saveUserBuilds(builds: PresetBuild[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
  } catch (err) {
    console.error('Falha ao salvar builds do usuário:', err);
  }
}

export function addUserBuild(build: PresetBuild): PresetBuild[] {
  const current = loadUserBuilds();
  const updated = [build, ...current.filter((b) => b.id !== build.id)];
  saveUserBuilds(updated);
  return updated;
}

export function removeUserBuild(id: string): PresetBuild[] {
  const current = loadUserBuilds();
  const updated = current.filter((b) => b.id !== id);
  saveUserBuilds(updated);
  return updated;
}
