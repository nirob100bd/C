/* ==========================================================================
   C-VERSE: MAIN APPLICATION CONTROLLER, STATE PERSISTENCE & IDE PLAYGROUND
   ========================================================================== */

class CVerseApp {
  constructor() {
    this.storageKey = 'cverse_state_v1';
    this.state = {
      xp: 120,
      streak: 3,
      lastVisit: new Date().toISOString().slice(0, 10),
      eli5Mode: false,
      activeModuleId: 1,
      completedModules: [],
      completedProjects: [],
      unlockedBadges: ['first_compile'],
      quizAnswers: {}, // { '1-0': 1, ... }
      savedCode: {}
    };
    this.currentPlaygroundModId = 1;
  }

  init() {
    this.loadState();
    this.checkDailyStreak();
    window.cverseEffects.init();

    // Render all dynamic sections
    this.updateHeaderGamification();
    this.renderModuleSelectorTabs();
    this.renderActiveModule(this.state.activeModuleId, false);
    this.renderStandalonePointerVisualizer();
    this.initPlayground(1);
    this.renderBadgesGallery();
    this.renderCurriculumRoadmap();

    // Re-bind scrollytelling observer
    setTimeout(() => {
      window.cverseEffects.observeReveals();
    }, 100);
  }

  /* ------------------------------------------------------------------------
     1. LOCALSTORAGE PERSISTENCE & STREAK MANAGEMENT
     ------------------------------------------------------------------------ */
  loadState() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.state = { ...this.state, ...parsed };
      }
    } catch (_) {}
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (_) {}
  }

  checkDailyStreak() {
    const today = new Date().toISOString().slice(0, 10);
    if (this.state.lastVisit !== today) {
      this.state.streak = (this.state.streak || 1) + 1;
      this.state.lastVisit = today;
      this.saveState();
    }
  }

  resetProgress() {
    localStorage.removeItem(this.storageKey);
    this.state = {
      xp: 0,
      streak: 1,
      lastVisit: new Date().toISOString().slice(0, 10),
      eli5Mode: false,
      activeModuleId: 1,
      completedModules: [],
      completedProjects: [],
      unlockedBadges: [],
      quizAnswers: {},
      savedCode: {}
    };
    this.saveState();
    this.updateHeaderGamification();
    this.renderModuleSelectorTabs();
    this.renderActiveModule(1, false);
    this.renderBadgesGallery();
    this.renderCurriculumRoadmap();
    this.showToast('Progress Reset', 'All local progress has been reset to Zero.', '🔄');
  }

  unlockAllDemo() {
    this.state.xp = 1750;
    this.state.streak = 14;
    this.state.completedModules = [1, 2, 3, 4, 5, 6, 7];
    this.state.completedProjects = [1, 2, 3, 4, 5, 6, 7];
    this.state.unlockedBadges = window.CVERSE_DATA.badges.map((b) => b.id);
    this.saveState();
    this.updateHeaderGamification();
    this.renderModuleSelectorTabs();
    this.renderActiveModule(this.state.activeModuleId, false);
    this.renderBadgesGallery();
    this.renderCurriculumRoadmap();
    window.cverseEffects.playUnlock();
    window.cverseEffects.triggerConfetti();
    this.showToast('Kernel Wizard Mode Activated!', 'All 7 Modules, Badges & 1,750 XP Unlocked!', '👑');
  }

  /* ------------------------------------------------------------------------
     2. GAMIFICATION: RANKS, XP, BADGES & TOASTS
     ------------------------------------------------------------------------ */
  getCurrentRankInfo() {
    const ranks = window.CVERSE_DATA.ranks;
    let current = ranks[0];
    let next = null;
    for (let i = 0; i < ranks.length; i++) {
      if (this.state.xp >= ranks[i].minXP) {
        current = ranks[i];
        next = ranks[i + 1] || null;
      }
    }
    let progressPct = 100;
    if (next) {
      const span = next.minXP - current.minXP;
      const gained = this.state.xp - current.minXP;
      progressPct = Math.min(100, Math.max(4, Math.round((gained / span) * 100)));
    }
    return { current, next, progressPct };
  }

  awardXP(amount, reason = 'Challenge Completed') {
    const beforeRank = this.getCurrentRankInfo().current.id;
    this.state.xp += amount;
    this.saveState();
    const afterRankInfo = this.getCurrentRankInfo();
    this.updateHeaderGamification();

    if (afterRankInfo.current.id !== beforeRank) {
      window.cverseEffects.playUnlock();
      window.cverseEffects.triggerConfetti();
      this.showUnlockModal(
        `RANK UP: ${afterRankInfo.current.title}!`,
        afterRankInfo.current.desc,
        afterRankInfo.current.badge,
        `+${amount} XP (${reason})`
      );
    } else {
      this.showToast(`+${amount} XP Earned!`, reason, '⚡');
    }
  }

  unlockBadge(badgeId) {
    if (this.state.unlockedBadges.includes(badgeId)) return;
    const badge = window.CVERSE_DATA.badges.find((b) => b.id === badgeId);
    if (!badge) return;

    this.state.unlockedBadges.push(badgeId);
    this.state.xp += badge.xp;
    this.saveState();
    this.updateHeaderGamification();
    this.renderBadgesGallery();

    window.cverseEffects.playUnlock();
    window.cverseEffects.triggerConfetti();
    this.showToast(`Badge Unlocked: ${badge.title}`, `${badge.desc} (+${badge.xp} XP)`, badge.icon);
  }

  updateHeaderGamification() {
    const { current, next, progressPct } = this.getCurrentRankInfo();

    const rankBadgeEl = document.getElementById('nav-rank-badge');
    const rankTitleEl = document.getElementById('nav-rank-title');
    const xpValueEl = document.getElementById('nav-xp-value');
    const xpBarEl = document.getElementById('nav-xp-bar');
    const streakEl = document.getElementById('nav-streak-count');
    const eli5Btn = document.getElementById('nav-eli5-toggle');

    if (rankBadgeEl) rankBadgeEl.textContent = current.badge;
    if (rankTitleEl) rankTitleEl.textContent = current.title;
    if (xpValueEl) {
      xpValueEl.textContent = next ? `${this.state.xp} / ${next.minXP} XP` : `${this.state.xp} XP (MAX)`;
    }
    if (xpBarEl) xpBarEl.style.width = `${progressPct}%`;
    if (streakEl) streakEl.textContent = `${this.state.streak}d`;

    if (eli5Btn) {
      if (this.state.eli5Mode) {
        eli5Btn.className =
          'magnetic-btn px-3.5 py-1.5 rounded-full bg-purple-500/25 border border-purple-400 text-purple-200 text-xs font-semibold flex items-center gap-1.5 eli5-active-badge transition';
        eli5Btn.innerHTML = `<span>🧠 ELI5 Mode: ON</span>`;
      } else {
        eli5Btn.className =
          'magnetic-btn px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition';
        eli5Btn.innerHTML = `<span>🧠 ELI5 Mode: OFF</span>`;
      }
    }

    // Update Hero Stats
    const statCompleted = document.getElementById('stat-modules-completed');
    const statBadges = document.getElementById('stat-badges-unlocked');
    if (statCompleted) statCompleted.textContent = `${this.state.completedModules.length}/7`;
    if (statBadges) statBadges.textContent = `${this.state.unlockedBadges.length}/${window.CVERSE_DATA.badges.length}`;
  }

  toggleELI5Mode() {
    this.state.eli5Mode = !this.state.eli5Mode;
    this.saveState();
    window.cverseEffects.playToggle();
    if (this.state.eli5Mode) {
      this.unlockBadge('eli5_explorer');
    }
    this.updateHeaderGamification();
    this.renderActiveModule(this.state.activeModuleId, false);
  }

  toggleSoundFX() {
    window.cverseEffects.soundEnabled = !window.cverseEffects.soundEnabled;
    const btn = document.getElementById('nav-sound-btn');
    if (btn) {
      btn.textContent = window.cverseEffects.soundEnabled ? '🔊' : '🔇';
      btn.title = window.cverseEffects.soundEnabled ? 'Sound FX: ON' : 'Sound FX: Muted';
    }
    if (window.cverseEffects.soundEnabled) {
      window.cverseEffects.playClick();
    }
  }

  /* ------------------------------------------------------------------------
     3. CURRICULUM ROADMAP & MODULE DEEP-DIVE RENDERING
     ------------------------------------------------------------------------ */
  renderCurriculumRoadmap() {
    const grid = document.getElementById('curriculum-roadmap-grid');
    if (!grid) return;

    const modules = window.CVERSE_DATA.modules;
    grid.innerHTML = modules
      .map((m) => {
        const isDone = this.state.completedModules.includes(m.id);
        const isActive = this.state.activeModuleId === m.id;
        const accentMap = {
          emerald: 'from-emerald-500/20 to-cyan-500/5 border-emerald-500/30 text-emerald-400',
          cyan: 'from-cyan-500/20 to-blue-500/5 border-cyan-500/30 text-cyan-400',
          purple: 'from-purple-500/20 to-pink-500/5 border-purple-500/30 text-purple-400'
        };
        const badgeStyle = accentMap[m.accent] || accentMap.emerald;

        return `
          <div onclick="window.cverseApp.selectModuleAndScroll(${m.id})"
            class="spotlight-card glass-panel rounded-3xl p-6 cursor-pointer border transition-all ${
              isActive
                ? 'border-emerald-400/70 ring-1 ring-emerald-400/30'
                : isDone
                ? 'border-emerald-500/35'
                : 'border-white/10'
            } flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between gap-2 mb-4">
                <span class="px-3 py-1 rounded-full bg-gradient-to-r ${badgeStyle} border text-xs font-mono-code font-bold">
                  ${m.code}
                </span>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-mono-code text-slate-400">⏱ ${m.readTime}</span>
                  ${
                    isDone
                      ? `<span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono-code font-bold">✓ Mastered</span>`
                      : `<span class="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-mono-code">+${m.xpReward} XP</span>`
                  }
                </div>
              </div>

              <h3 class="text-xl font-bold text-white mb-1">${m.title}</h3>
              <p class="text-sm text-cyan-300/90 font-medium mb-3">${m.subtitle}</p>
              <p class="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-2">
                ${m.eli5Summary.analogy}
              </p>
            </div>

            <div class="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono-code">
              <span class="text-slate-400 truncate max-w-[70%]">🛠 ${m.project.title}</span>
              <span class="text-emerald-400 font-semibold flex items-center gap-1">
                Explore <span>→</span>
              </span>
            </div>
          </div>
        `;
      })
      .join('');
  }

  renderModuleSelectorTabs() {
    const bar = document.getElementById('module-tabs-bar');
    if (!bar) return;

    bar.innerHTML = window.CVERSE_DATA.modules
      .map((m) => {
        const active = this.state.activeModuleId === m.id;
        const done = this.state.completedModules.includes(m.id);
        return `
          <button onclick="window.cverseApp.renderActiveModule(${m.id}, true)"
            class="magnetic-btn px-4 py-2.5 rounded-2xl font-mono-code text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              active
                ? 'btn-emerald-glow text-slate-950 shadow-lg'
                : done
                ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40'
                : 'bg-slate-900/80 border border-white/10 text-slate-300 hover:border-white/25 hover:text-white'
            }">
            <span>${done ? '✓' : `0${m.id}`}</span>
            <span>${m.title}</span>
          </button>
        `;
      })
      .join('');

    window.cverseEffects.bindMagneticButtons();
  }

  selectModuleAndScroll(modId) {
    this.renderActiveModule(modId, true);
    const section = document.getElementById('curriculum-workspace');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  renderActiveModule(modId, playAudio = true) {
    const mod = window.CVERSE_DATA.modules.find((m) => m.id === modId) || window.CVERSE_DATA.modules[0];
    this.state.activeModuleId = mod.id;
    this.saveState();
    if (playAudio) window.cverseEffects.playClick();

    this.renderModuleSelectorTabs();
    this.renderCurriculumRoadmap();

    const container = document.getElementById('active-module-container');
    if (!container) return;

    const isDone = this.state.completedModules.includes(mod.id);
    const isEli5 = this.state.eli5Mode;

    container.innerHTML = `
      <!-- Module Top Hero Banner -->
      <div class="glass-panel-heavy rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/15 mb-8 relative overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div class="flex flex-wrap items-center gap-3">
            <span class="px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 font-mono-code text-xs font-bold">
              ${mod.code} • ZERO TO ADVANCED CURRICULUM
            </span>
            <span class="text-xs font-mono-code text-slate-400">⏱ ${mod.readTime} interactive lesson</span>
            ${
              isDone
                ? `<span class="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-mono-code text-xs font-extrabold">✓ MODULE COMPLETED</span>`
                : `<span class="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-mono-code text-xs">+${mod.xpReward} XP Reward</span>`
            }
          </div>

          <!-- Per-Module ELI5 Toggle Switch -->
          <button onclick="window.cverseApp.toggleELI5Mode()"
            class="magnetic-btn px-4 py-2 rounded-2xl border text-xs font-mono-code font-bold transition-all flex items-center gap-2 ${
              isEli5
                ? 'bg-purple-500/30 border-purple-400 text-purple-100 eli5-active-badge'
                : 'bg-slate-900/90 border-white/15 text-slate-200 hover:border-purple-400/50'
            }">
            <span class="text-base">${isEli5 ? '🧸' : '🔬'}</span>
            <span>${isEli5 ? 'ELI5 Analogy Mode: ACTIVE (Click for CS Rigor)' : 'Explain Like I\'m 5 (ELI5): OFF (Click to Simplify)'}</span>
          </button>
        </div>

        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3">
          Module ${mod.id}: <span class="text-gradient-cyber">${mod.title}</span> — ${mod.subtitle}
        </h2>
        <p class="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed italic border-l-2 border-emerald-400 pl-4 my-4">
          "${mod.heroQuote}"
        </p>

        <!-- Prominent ELI5 Mental Model Callout Box -->
        <div class="mt-6 rounded-2xl p-5 eli5-box flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-2xl shrink-0">
              ${mod.eli5Summary.icon}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono-code uppercase tracking-wider text-purple-300 font-bold">ELI5 Mental Model</span>
                <span class="px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 text-[10px] font-mono-code">${mod.eli5Summary.title}</span>
              </div>
              <p class="text-sm text-slate-100 mt-1 leading-relaxed">${mod.eli5Summary.analogy}</p>
            </div>
          </div>
          <button onclick="window.cverseApp.loadModuleProjectIntoIDE(${mod.id})"
            class="magnetic-btn shrink-0 px-4 py-2.5 rounded-xl btn-emerald-glow text-slate-950 font-mono-code text-xs font-bold">
            ⚡ Jump to Module ${mod.id} Project
          </button>
        </div>
      </div>

      <!-- 3 Core Concept Deep-Dive Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        ${mod.concepts
          .map(
            (c, idx) => `
          <div class="spotlight-card glass-panel rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between gap-2 mb-3">
                <span class="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono-code text-xs">
                  ${c.badge}
                </span>
                <span class="text-xs font-mono-code ${isEli5 ? 'text-purple-300 font-bold' : 'text-emerald-400'}">
                  ${isEli5 ? '🧠 ELI5 Analogy View' : '⚙️ Systems CS Theory'}
                </span>
              </div>
              <h3 class="text-lg font-bold text-white mb-3">${c.title}</h3>

              <!-- Theory vs ELI5 Toggleable Body -->
              <div class="p-3.5 rounded-2xl mb-4 ${
                isEli5
                  ? 'bg-purple-950/35 border border-purple-500/30 text-purple-100'
                  : 'bg-slate-900/70 border border-white/5 text-slate-300'
              } text-xs sm:text-sm leading-relaxed">
                ${isEli5 ? c.eli5Analogy : c.csTheory}
              </div>

              <!-- Secondary Peek (Always lets learner see both if curious!) -->
              <div class="mb-4 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-400">
                <strong class="text-slate-200">${isEli5 ? '🔬 Under the Hood (CS):' : '🧸 Quick ELI5 Analogy:'}</strong>
                ${isEli5 ? c.csTheory : c.eli5Analogy}
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between text-[11px] font-mono-code text-slate-400 mb-1.5">
                <span>snippet_0${idx + 1}.c</span>
                <button onclick="window.cverseApp.runSnippetInPlayground(${mod.id}, ${idx})" class="text-emerald-400 hover:underline font-semibold">
                  ▶ Load in IDE
                </button>
              </div>
              <pre class="p-3.5 rounded-2xl bg-slate-950 border border-white/10 font-mono-code text-xs text-slate-200 overflow-x-auto leading-relaxed"><code>${window.cverseCompiler.highlightC(c.codeSnippet)}</code></pre>
            </div>
          </div>
        `
          )
          .join('')}
      </div>

      <!-- Module Interactive Visual Aid / Simulator Container -->
      <div id="module-interactive-lab" class="mb-8"></div>

      <!-- Hands-On Project + Interactive Module Mastery Quiz Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Left: Hands-On Project Launchpad (5 cols) -->
        <div class="lg:col-span-5 glass-panel rounded-3xl p-6 lg:p-8 border border-emerald-500/30 flex flex-col justify-between">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-mono-code mb-3">
              🛠 HANDS-ON CAPSTONE LAB • MODULE ${mod.id}
            </div>
            <h3 class="text-2xl font-bold text-white mb-2">${mod.project.title}</h3>
            <p class="text-sm text-slate-300 leading-relaxed mb-5">
              ${mod.project.description}
            </p>
            <div class="mb-5">
              <div class="text-xs font-mono-code text-slate-400 mb-1.5">Starter Blueprint Preview:</div>
              <pre class="p-4 rounded-2xl bg-slate-950 border border-white/10 font-mono-code text-xs text-slate-300 max-h-56 overflow-y-auto"><code>${window.cverseCompiler.highlightC(mod.project.starterCode)}</code></pre>
            </div>
          </div>

          <div class="space-y-3">
            <button onclick="window.cverseApp.loadModuleProjectIntoIDE(${mod.id})"
              class="magnetic-btn w-full py-3.5 px-5 rounded-2xl btn-emerald-glow text-slate-950 font-mono-code text-sm font-extrabold flex items-center justify-center gap-2">
              <span>🚀 Open &amp; Execute in C Playground</span>
            </button>
            <button onclick="window.cverseApp.completeModule(${mod.id})"
              class="magnetic-btn w-full py-2.5 px-4 rounded-xl ${
                isDone
                  ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300'
                  : 'bg-white/5 hover:bg-white/10 border border-white/15 text-white'
              } font-mono-code text-xs font-semibold">
              ${isDone ? '✓ Module & Project Mastered!' : `✓ Mark Module ${mod.id} Complete (+${mod.xpReward} XP)`}
            </button>
          </div>
        </div>

        <!-- Right: Interactive 3-Question Mastery Quiz (7 cols) -->
        <div class="lg:col-span-7 glass-panel rounded-3xl p-6 lg:p-8 border border-cyan-500/25">
          <div class="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
            <div>
              <span class="text-xs font-mono-code uppercase tracking-wider text-cyan-400">Module ${mod.id} Verification</span>
              <h3 class="text-xl font-bold text-white mt-0.5">Interactive Systems Mastery Quiz</h3>
            </div>
            <span class="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono-code text-xs">
              +50 XP per Correct Answer
            </span>
          </div>

          <div class="space-y-6">
            ${mod.quiz
              .map((qItem, qIdx) => {
                const key = `${mod.id}-${qIdx}`;
                const chosen = this.state.quizAnswers[key];
                const hasAnswered = chosen !== undefined;
                const isCorrect = chosen === qItem.correct;

                return `
                  <div class="p-4 rounded-2xl bg-slate-900/75 border border-white/10">
                    <div class="text-sm font-bold text-white mb-3">
                      <span class="text-cyan-400 font-mono-code mr-1.5">Q${qIdx + 1}.</span> ${qItem.q}
                    </div>
                    <div class="grid grid-cols-1 gap-2">
                      ${qItem.options
                        .map((opt, oIdx) => {
                          let btnStyle = 'bg-slate-950/80 border-white/10 text-slate-300 hover:border-cyan-400/50';
                          if (hasAnswered) {
                            if (oIdx === qItem.correct) {
                              btnStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-semibold';
                            } else if (oIdx === chosen) {
                              btnStyle = 'bg-rose-500/20 border-rose-400 text-rose-200';
                            }
                          }
                          return `
                            <button onclick="window.cverseApp.answerQuiz(${mod.id}, ${qIdx}, ${oIdx})"
                              class="text-left px-4 py-2.5 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between gap-3 ${btnStyle}">
                              <span><strong class="font-mono-code mr-2">${String.fromCharCode(65 + oIdx)}.</strong> ${opt}</span>
                              ${
                                hasAnswered && oIdx === qItem.correct
                                  ? '<span class="text-emerald-400 font-mono-code text-xs shrink-0">✓ Correct</span>'
                                  : hasAnswered && oIdx === chosen && oIdx !== qItem.correct
                                  ? '<span class="text-rose-400 font-mono-code text-xs shrink-0">✗ Try Again</span>'
                                  : ''
                              }
                            </button>
                          `;
                        })
                        .join('')}
                    </div>
                    ${
                      hasAnswered
                        ? `<div class="mt-3 p-3 rounded-xl ${
                            isCorrect ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-200' : 'bg-amber-950/40 border border-amber-500/30 text-amber-200'
                          } text-xs leading-relaxed">
                            <strong>${isCorrect ? '🎯 Spot On!' : '💡 Systems Insight:'}</strong> ${qItem.explanation}
                          </div>`
                        : ''
                    }
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>
      </div>
    `;

    // Render the specific interactive visualizer for this module
    this.mountModuleVisualizer(mod.visualizerType, 'module-interactive-lab');
    window.cverseEffects.bindMagneticButtons();
  }

  mountModuleVisualizer(type, targetId) {
    switch (type) {
      case 'warehouse_variables':
        window.cverseVis.renderWarehouseLab(targetId);
        break;
      case 'secret_vault':
        window.cverseVis.renderSecretVault(targetId);
        break;
      case 'call_stack':
        window.cverseVis.renderCallStackVisualizer(targetId);
        break;
      case 'caesar_matrix':
        window.cverseVis.renderCaesarMatrix(targetId);
        break;
      case 'pointer_visualizer':
        window.cverseVis.renderPointerVisualizer(targetId);
        break;
      case 'heap_allocator':
        window.cverseVis.renderHeapAllocator(targetId);
        break;
      case 'struct_file_io':
        window.cverseVis.renderStructFileIO(targetId);
        break;
    }
  }

  renderStandalonePointerVisualizer() {
    window.cverseVis.renderPointerVisualizer('standalone-pointer-lab');
  }

  answerQuiz(modId, qIdx, optionIdx) {
    const mod = window.CVERSE_DATA.modules.find((m) => m.id === modId);
    if (!mod) return;
    const key = `${modId}-${qIdx}`;
    const alreadyCorrect = this.state.quizAnswers[key] === mod.quiz[qIdx].correct;

    this.state.quizAnswers[key] = optionIdx;
    this.saveState();

    if (optionIdx === mod.quiz[qIdx].correct) {
      window.cverseEffects.playCompileSuccess();
      if (!alreadyCorrect) {
        this.awardXP(50, `Module ${modId} Quiz Q${qIdx + 1} Correct`);
      }
      // Check if all 3 quiz questions in this module are answered correctly
      const allCorrect = mod.quiz.every((q, i) => this.state.quizAnswers[`${modId}-${i}`] === q.correct);
      if (allCorrect && !this.state.completedModules.includes(modId)) {
        this.completeModule(modId);
      }
    } else {
      window.cverseEffects.playError();
    }

    this.renderActiveModule(modId, false);
  }

  completeModule(modId) {
    const mod = window.CVERSE_DATA.modules.find((m) => m.id === modId);
    if (!mod) return;

    if (!this.state.completedModules.includes(modId)) {
      this.state.completedModules.push(modId);
      this.saveState();
      this.awardXP(mod.xpReward, `Completed Module ${modId}: ${mod.title}`);
    }

    // Unlock corresponding module badges
    if (modId === 1) this.unlockBadge('mod1_master');
    if (modId === 2) this.unlockBadge('mod2_master');
    if (modId === 3) this.unlockBadge('stack_master');
    if (modId === 4) this.unlockBadge('cipher_ghost');
    if (modId === 5) this.unlockBadge('mod5_master');
    if (modId === 6) this.unlockBadge('zero_leaks');
    if (modId === 7) this.unlockBadge('capstone_architect');

    if (this.state.completedModules.length >= 7) {
      this.unlockBadge('kernel_wizard');
    }

    window.cverseEffects.triggerConfetti();
    this.renderModuleSelectorTabs();
    this.renderActiveModule(modId, false);
    this.renderCurriculumRoadmap();
  }

  /* ------------------------------------------------------------------------
     4. INTERACTIVE C PLAYGROUND IDE & COMPILER CONTROLLER
     ------------------------------------------------------------------------ */
  initPlayground(modId = 1) {
    this.currentPlaygroundModId = modId;
    const mod = window.CVERSE_DATA.modules.find((m) => m.id === modId) || window.CVERSE_DATA.modules[0];

    const presetSelect = document.getElementById('ide-preset-select');
    if (presetSelect) {
      presetSelect.innerHTML = window.CVERSE_DATA.modules
        .map(
          (m) =>
            `<option value="${m.id}" ${m.id === modId ? 'selected' : ''}>Module ${m.id}: ${m.project.title}</option>`
        )
        .join('');
    }

    const textarea = document.getElementById('ide-code-textarea');
    const stdinInput = document.getElementById('ide-stdin-input');

    if (textarea) {
      textarea.value = this.state.savedCode[modId] || mod.project.starterCode;
      this.syncEditorHighlight();

      if (!textarea.dataset.boundEvents) {
        textarea.dataset.boundEvents = 'true';
        textarea.addEventListener('input', () => {
          this.state.savedCode[this.currentPlaygroundModId] = textarea.value;
          this.saveState();
          this.syncEditorHighlight();
        });
        textarea.addEventListener('scroll', () => {
          const pre = document.getElementById('ide-code-highlight');
          if (pre) {
            pre.scrollTop = textarea.scrollTop;
            pre.scrollLeft = textarea.scrollLeft;
          }
        });
        textarea.addEventListener('keydown', (e) => {
          if (e.key === 'Tab') {
            e.preventDefault();
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            textarea.value = textarea.value.substring(0, start) + '    ' + textarea.value.substring(end);
            textarea.selectionStart = textarea.selectionEnd = start + 4;
            this.syncEditorHighlight();
          } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            this.runPlaygroundCode();
          }
        });
      }
    }

    if (stdinInput) {
      stdinInput.value = mod.project.defaultStdin || '';
    }

    // Run initial simulation so output and memory table are populated immediately
    this.runPlaygroundCode(false);
  }

  syncEditorHighlight() {
    const textarea = document.getElementById('ide-code-textarea');
    const highlightPre = document.getElementById('ide-code-highlight');
    const lineNumsEl = document.getElementById('ide-line-numbers');
    if (!textarea || !highlightPre) return;

    const code = textarea.value;
    highlightPre.innerHTML = window.cverseCompiler.highlightC(code) + '\n';

    const linesCount = Math.max(1, code.split('\n').length);
    if (lineNumsEl) {
      lineNumsEl.innerHTML = Array.from({ length: linesCount }, (_, i) => `<div>${i + 1}</div>`).join('');
    }

    // Update live diagnostic badge
    const diags = window.cverseCompiler.analyzeDiagnostics(code);
    const diagBadge = document.getElementById('ide-diag-badge');
    if (diagBadge) {
      const errs = diags.filter((d) => d.type === 'error');
      const warns = diags.filter((d) => d.type === 'warning');
      if (errs.length > 0) {
        diagBadge.className = 'px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono-code text-xs';
        diagBadge.textContent = `✗ ${errs.length} Syntax Error(s) (Line ${errs[0].line})`;
      } else if (warns.length > 0) {
        diagBadge.className = 'px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono-code text-xs';
        diagBadge.textContent = `⚠ ${warns.length} Compiler Warning (Line ${warns[0].line})`;
      } else {
        diagBadge.className = 'px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono-code text-xs';
        diagBadge.textContent = '✓ GCC C17 Diagnostics: 0 Errors';
      }
    }
  }

  selectPlaygroundPreset(modIdStr) {
    const modId = parseInt(modIdStr, 10) || 1;
    this.initPlayground(modId);
    window.cverseEffects.playClick();
  }

  resetPlaygroundTemplate() {
    const mod = window.CVERSE_DATA.modules.find((m) => m.id === this.currentPlaygroundModId) || window.CVERSE_DATA.modules[0];
    delete this.state.savedCode[this.currentPlaygroundModId];
    this.saveState();
    const textarea = document.getElementById('ide-code-textarea');
    if (textarea) {
      textarea.value = mod.project.starterCode;
      this.syncEditorHighlight();
      this.runPlaygroundCode(true);
    }
  }

  loadModuleProjectIntoIDE(modId) {
    this.initPlayground(modId);
    const ideSection = document.getElementById('playground-section');
    if (ideSection) {
      ideSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => {
      this.runPlaygroundCode(true);
    }, 350);
  }

  runSnippetInPlayground(modId, conceptIdx) {
    const mod = window.CVERSE_DATA.modules.find((m) => m.id === modId);
    if (!mod || !mod.concepts[conceptIdx]) return;
    const snippet = mod.concepts[conceptIdx].codeSnippet;
    const fullCode = snippet.includes('main')
      ? snippet
      : `#include <stdio.h>\n\nint main(void) {\n    ${snippet.split('\n').join('\n    ')}\n    return 0;\n}`;

    const textarea = document.getElementById('ide-code-textarea');
    if (textarea) {
      textarea.value = fullCode;
      this.syncEditorHighlight();
    }
    const ideSection = document.getElementById('playground-section');
    if (ideSection) {
      ideSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => {
      this.runPlaygroundCode(true);
    }, 350);
  }

  runPlaygroundCode(interactiveFeedback = true) {
    const textarea = document.getElementById('ide-code-textarea');
    const stdinInput = document.getElementById('ide-stdin-input');
    const termOut = document.getElementById('ide-terminal-output');
    const memBody = document.getElementById('ide-memory-table-body');
    const metricsEl = document.getElementById('ide-exec-metrics');

    if (!textarea || !termOut) return;
    const res = window.cverseCompiler.execute(textarea.value, stdinInput ? stdinInput.value : '');

    if (res.success) {
      termOut.className = 'font-mono-code text-xs sm:text-sm text-emerald-300 whitespace-pre-wrap leading-relaxed';
      termOut.textContent = res.stdout;
      if (interactiveFeedback) {
        window.cverseEffects.playCompileSuccess();
        this.unlockBadge('first_compile');
        if (!this.state.completedProjects.includes(this.currentPlaygroundModId)) {
          this.state.completedProjects.push(this.currentPlaygroundModId);
          this.awardXP(40, `Executed Module ${this.currentPlaygroundModId} Code in IDE`);
        }
      }
    } else {
      termOut.className = 'font-mono-code text-xs sm:text-sm text-rose-400 whitespace-pre-wrap leading-relaxed';
      termOut.textContent = res.stdout;
      if (interactiveFeedback) window.cverseEffects.playError();
    }

    if (metricsEl) {
      metricsEl.innerHTML = `
        <span>⏱ ${res.execTimeMs}ms</span>
        <span>•</span>
        <span>Stack: <strong class="text-cyan-300">${res.stackBytes}B</strong></span>
        <span>•</span>
        <span>Heap: <strong class="text-purple-300">${res.heapBytes}B</strong></span>
        ${
          res.leakedBytes > 0
            ? `<span class="text-rose-400 font-bold">• ⚠ Leak: ${res.leakedBytes}B</span>`
            : `<span class="text-emerald-400">• 0 Leaks</span>`
        }
      `;
    }

    if (memBody) {
      if (res.memoryTable.length === 0) {
        memBody.innerHTML = `<tr><td colspan="4" class="py-4 text-center text-slate-500">No active variables inspected</td></tr>`;
      } else {
        memBody.innerHTML = res.memoryTable
          .map(
            (row) => `
          <tr class="border-b border-white/5 hover:bg-white/[0.03]">
            <td class="py-2 px-3 font-bold text-white">${row.name}</td>
            <td class="py-2 px-3 text-cyan-300">${row.type} <span class="text-slate-500">(${row.bytes}B)</span></td>
            <td class="py-2 px-3 text-emerald-400">${row.address}</td>
            <td class="py-2 px-3 text-amber-300 font-bold">${row.value}</td>
          </tr>
        `
          )
          .join('');
      }
    }
  }

  /* ------------------------------------------------------------------------
     5. DIGITAL BADGES GALLERY & MODAL NOTIFICATIONS
     ------------------------------------------------------------------------ */
  renderBadgesGallery() {
    const grid = document.getElementById('badges-gallery-grid');
    if (!grid) return;

    grid.innerHTML = window.CVERSE_DATA.badges
      .map((b) => {
        const unlocked = this.state.unlockedBadges.includes(b.id);
        return `
          <div class="spotlight-card glass-panel rounded-2xl p-4 border transition-all ${
            unlocked
              ? 'border-emerald-400/50 bg-emerald-950/20 shadow-lg shadow-emerald-500/10'
              : 'border-white/5 opacity-55 grayscale'
          } flex items-start gap-3.5">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
              unlocked ? 'bg-emerald-500/20 border border-emerald-400/40' : 'bg-white/5 border border-white/10'
            }">
              ${b.icon}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h4 class="text-sm font-bold text-white">${b.title}</h4>
                <span class="px-2 py-0.5 rounded text-[10px] font-mono-code ${
                  unlocked ? 'bg-emerald-400 text-slate-950 font-bold' : 'bg-white/10 text-slate-400'
                }">
                  ${unlocked ? 'UNLOCKED' : `+${b.xp} XP`}
                </span>
              </div>
              <p class="text-xs text-slate-300 mt-1 leading-relaxed">${b.desc}</p>
            </div>
          </div>
        `;
      })
      .join('');
  }

  showToast(title, subtitle, icon = '⚡') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className =
      'glass-panel-heavy rounded-2xl p-4 border border-emerald-400/50 shadow-2xl flex items-center gap-3.5 transform transition-all duration-300 translate-y-4 opacity-0 max-w-sm';
    toast.innerHTML = `
      <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-xl shrink-0">
        ${icon}
      </div>
      <div>
        <div class="text-xs font-mono-code uppercase tracking-wider text-emerald-400 font-bold">${title}</div>
        <div class="text-xs text-slate-200 mt-0.5">${subtitle}</div>
      </div>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('translate-y-4', 'opacity-0');
      setTimeout(() => toast.remove(), 350);
    }, 3600);
  }

  showUnlockModal(title, desc, icon, xpTag) {
    const modal = document.getElementById('unlock-modal');
    if (!modal) return;
    document.getElementById('unlock-modal-icon').textContent = icon;
    document.getElementById('unlock-modal-title').textContent = title;
    document.getElementById('unlock-modal-desc').textContent = desc;
    document.getElementById('unlock-modal-xp').textContent = xpTag;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  closeUnlockModal() {
    const modal = document.getElementById('unlock-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

window.cverseApp = new CVerseApp();
document.addEventListener('DOMContentLoaded', () => {
  window.cverseApp.init();
});
