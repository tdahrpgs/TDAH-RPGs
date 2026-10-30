# Calculadora de Dano & Combate — Tormenta 20 (T20)

Uma ferramenta web moderna, ágil e completa para cálculo de dano médio por turno (DPR), acerto crítico e simulação de combate contra criaturas e ameaças solos do sistema **Tormenta 20 (Edição Jogo do Ano)**.

Desenvolvido por **TDAH RPGs**.

---

## 🛡️ Destaques & Funcionalidades

- **Cálculo Fiel às Regras Oficiais de T20:**
  - **Passos de Dano:** Escala progressiva de dano da arma de 1d4 até 4d12 com suporte a aumentos e reduções de passos.
  - **Dados Extras & Bônus Numéricos:** Dados adicionais (d4 a d12) de magias, engenhocas ou habilidades (ex: *Golpe Divino*, *Ataque Furtivo*) e bônus numéricos fixos (+X) com separação para dados multiplicados no crítico ou aplicados apenas no acerto normal/crítico.
  - **Crítico Customizável:** Margem de ameaça (de 12 a 20) e multiplicadores de crítico de x2 a x6.
  - **Rerrolagens de Dados:** Vantagem em testes de ataque com 1d20, 2d20 ou 3d20 escolhendo o maior resultado.
  - **Múltiplos Ataques & Penetração:** Suporte a múltiplos ataques por turno (com ou sem penalidades) e redução de RD do alvo.

- **Estatísticas de Ameaças Solos por ND:**
  - Tabela completa de parâmetros oficiais para criaturas solos de **ND 1/4 até ND 20+** (Pontos de Vida, Defesa, Redução de Dano, Bônus de Ataque, Dano Médio e Testes de Resistência Fortitude, Reflexos e Vontade).
  - Possibilidade de ajustar manualmente a Defesa e a RD do alvo para simular condições de combate, debuffs ou criaturas customizadas.

- **Resultados de Combate & TTK (Time to Kill):**
  - **DPR (Dano Médio por Turno):** Expectativa matemática exata considerando chances de acerto normal, acerto crítico e mitigação de RD.
  - **Tempo para Abater:** Quantidade estimada de turnos para derrotar a ameaça selecionada.
  - **Progressão de Dano Turno a Turno:** Gráfico visual de desgaste dos pontos de vida da criatura ao longo do combate.
  - **Detalhamento de Fórmulas:** Visualização didática de cada etapa do cálculo disponível no modal de fórmulas.

- **Gerenciador de Builds & Comparador Lado a Lado:**
  - Salve suas próprias builds no navegador (localStorage).
  - Alterne instantaneamente entre as builds salvas e builds de exemplo prontas (ex: *Guerreiro Crítico*, *Lutador Pugilista*, *Ladino Furtivo*, *Paladino do Golpe Divino*, etc.).
  - Comparador de desempenho lado a lado comparando até 4 builds com destaque automático para a de maior DPR.

- **Visual Moderno & Acessibilidade:**
  - Alternador de **Modo Claro** e **Modo Escuro** com contraste otimizado (WCAG).
  - Layout limpo, responsivo e adaptado para smartphones, tablets e computadores.

- **Privacidade & Zero Dependências Externas:**
  - Roda **100% no navegador (Client-Side SPA)**.
  - **NÃO utiliza inteligência artificial (IA)** nem realiza chamadas a APIs externas.
  - **NÃO requer chaves de API**, cadastros, nem conexão com banco de dados.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior
- Gerenciador de pacotes `npm` (ou `pnpm` / `yarn` / `bun`)

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU_USUARIO/calculadora-dano-t20.git
   cd calculadora-dano-t20
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação no navegador em `http://localhost:3000`.

4. **Gerar build de produção:**
   ```bash
   npm run build
   ```
   Os arquivos compilados serão gerados na pasta `dist/` prontos para deploy estático (GitHub Pages, Vercel, Netlify, Cloudflare Pages, etc.).

---

## 🛠️ Tecnologias Utilizadas

- **React 19** com **TypeScript**
- **Vite** para empacotamento rápido
- **Tailwind CSS v4** para estilização utilitária e suporte a modo escuro
- **Lucide React** para iconografia leve e consistente

---

## 📂 Estrutura do Projeto

```text
├── public/                 # Favicon e arquivos estáticos
├── src/
│   ├── components/         # Componentes modulares da interface
│   │   ├── AttackBonus.tsx         # Bônus de ataque e dados de acerto
│   │   ├── BuildsTab.tsx           # Gerenciador e comparador de builds
│   │   ├── EnemyStats.tsx          # Parâmetros oficiais de ameaças por ND
│   │   ├── Header.tsx              # Cabeçalho com logo, título e tema
│   │   ├── ResultsPanel.tsx        # Métricas de dano, TTK e fórmulas
│   │   ├── Step1Damage.tsx         # Dano base, passos e dados extras
│   │   ├── Step2Crit.tsx           # Margem de ameaça e multiplicador
│   │   ├── Step3DiceRerolls.tsx    # Vantagem e rerrolagens de 1d20 a 3d20
│   │   ├── Step4Attacks.tsx        # Quantidade de ataques por turno
│   │   ├── Step5Penetration.tsx    # Redução de RD do alvo
│   │   └── ThreatCombatAnalysis.tsx # Simulação de combate e desgaste de PV
│   ├── context/
│   │   └── ThemeContext.tsx        # Contexto de tema claro/escuro
│   ├── utils/
│   │   ├── calculator.ts           # Motor matemático de dano e probabilidades
│   │   ├── damageSteps.ts          # Tabela de passos de dano de armas T20
│   │   ├── presetBuilds.ts         # Builds de exemplo pré-configuradas
│   │   └── threats.ts              # Parâmetros de Criaturas Solos por ND
│   ├── App.tsx                     # Componente raiz e navegação por abas
│   ├── index.css                   # Tailwind e estilos globais
│   └── main.tsx                    # Ponto de entrada React
├── index.html                      # HTML principal com metatags e favicon
├── package.json                    # Dependências e scripts
└── README.md                       # Documentação do projeto
```

---

## 📜 Licença e Avisos Legais

- O sistema **Tormenta 20** é uma criação de Marcelo Cassaro, Guilherme Dei Svaldi, Leonel Caldela, J.M. Trevisan e Rogério Saladino, publicado e de propriedade da **Jambô Editora**.
- Esta calculadora é um projeto independente da comunidade criado por **TDAH RPGs** para fins educacionais e auxílio a mestres e jogadores de mesa.
