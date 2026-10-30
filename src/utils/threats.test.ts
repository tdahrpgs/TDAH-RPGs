/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { T20_THREATS, getThreatByND } from './threats';

test('T20 threats table has 24 NDs matching Tabela 2-3 A', () => {
  assert.equal(T20_THREATS.length, 24);
});

test('ND 1 has Defense 16, RD 0 and Tier Iniciante', () => {
  const nd1 = getThreatByND('1');
  assert.ok(nd1);
  assert.equal(nd1.defense, 16);
  assert.equal(nd1.rd, 0);
  assert.equal(nd1.tier, 'Iniciante');
});

test('Veterano tier (ND 5 to 10) has RD 5', () => {
  const nd5 = getThreatByND('5');
  assert.ok(nd5);
  assert.equal(nd5.defense, 24);
  assert.equal(nd5.rd, 5);
  assert.equal(nd5.tier, 'Veterano');

  const nd10 = getThreatByND('10');
  assert.ok(nd10);
  assert.equal(nd10.defense, 36);
  assert.equal(nd10.rd, 5);
});

test('Campeão tier (ND 11 to 16) has RD 10', () => {
  const nd11 = getThreatByND('11');
  assert.ok(nd11);
  assert.equal(nd11.defense, 41);
  assert.equal(nd11.rd, 10);
  assert.equal(nd11.tier, 'Campeão');

  const nd16 = getThreatByND('16');
  assert.ok(nd16);
  assert.equal(nd16.defense, 53);
  assert.equal(nd16.rd, 10);
});

test('Lenda and L+ tiers (ND 17 to S+) have RD 20', () => {
  const nd17 = getThreatByND('17');
  assert.ok(nd17);
  assert.equal(nd17.defense, 54);
  assert.equal(nd17.rd, 20);
  assert.equal(nd17.tier, 'Lenda');

  const ndS = getThreatByND('S');
  assert.ok(ndS);
  assert.equal(ndS.defense, 65);
  assert.equal(ndS.rd, 20);

  const ndSPlus = getThreatByND('S+');
  assert.ok(ndSPlus);
  assert.equal(ndSPlus.defense, 70);
  assert.equal(ndSPlus.rd, 20);
});
