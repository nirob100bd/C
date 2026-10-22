/* ==========================================================================
   C-VERSE: CINEMATIC INTERACTIVE VISUALIZERS
   - Pointer Visualizer (Animated SVG Bezier Arrows, Dereferencing, Arithmetic)
   - Call Stack & Recursion Visualizer (Push/Pop Stack Frames)
   - Secret Vault 4-Digit Loop Cracker Challenge
   - Warehouse Variable & Binary Inspector
   - Caesar Cipher & Null-Terminator (\0) Memory Strip
   - Heap vs. Stack Dynamic Memory Allocator (malloc/calloc/realloc/free)
   - Struct & Persistent File I/O (todos.txt) Inspector
   ========================================================================== */

class CVerseVisualizers {
  constructor() {
    // 1. Pointer Visualizer State
    this.ramCells = [
      { index: 0, name: 'arr[0]', type: 'int', addr: '0x7fff5fbff8a0', value: 10 },
      { index: 1, name: 'arr[1]', type: 'int', addr: '0x7fff5fbff8a4', value: 20 },
      { index: 2, name: 'arr[2]', type: 'int', addr: '0x7fff5fbff8a8', value: 30 },
      { index: 3, name: 'arr[3]', type: 'int', addr: '0x7fff5fbff8ac', value: 40 },
      { index: 4, name: 'arr[4]', type: 'int', addr: '0x7fff5fbff8b0', value: 50 },
      { index: 5, name: 'shield', type: 'int', addr: '0x7fff5fbff8b4', value: 100 }
    ];
    this.ptrTargetIndex = 0; // index into ramCells, or -1 for NULL
    this.doublePtrActive = false;
    this.twoPointerMode = false;
    this.leftPtrIndex = 0;
    this.rightPtrIndex = 4;
    this.lastPtrLog = 'int *ptr = &arr[0]; // ptr holds 0x7fff5fbff8a0';

    // 2. Call Stack State
    this.stackFrames = [
      { fn: 'main()', args: 'void', local: 'int result = ?', retAddr: '0x401120 (OS Kernel)', status: 'active' }
    ];
    this.recursionN = 4;
    this.isAnimatingStack = false;

    // 3. Secret Vault State (Module 2 Challenge)
    this.vaultSecret = '4826';
    this.vaultTriesLeft = 5;
    this.vaultHistory = [];
    this.vaultUnlocked = false;
    this.vaultLoopRunning = false;

    // 4. Heap Allocator State (Module 6)
    this.heapBlocks = [
      { id: 1, label: 'grades[0..3]', func: 'calloc(4, 4)', addr: '0x5555555592a0', bytes: 16, values: '[88, 94, 79, 97]', status: 'allocated' }
    ];
    this.heapNextOffset = 0x92b0;

    // 5. Caesar Cipher State (Module 4)
    this.cipherPlaintext = 'CVERSE AGENT';
    this.cipherShift = 3;

    // 6. Module 7 Struct & File I/O State
    this.todoStructs = [
      { id: 101, title: 'Master C Pointers & Hex Addresses', priority: 1, completed: 1 },
      { id: 102, title: 'Eliminate Heap Leaks with free()', priority: 1, completed: 1 },
      { id: 103, title: 'Ship Persistent File I/O Capstone', priority: 2, completed: 1 }
    ];
  }

  /* ========================================================================
     1. POINTER VISUALIZER (SVG BEZIER ARROWS & LIVE RAM BLOCKS)
     ======================================================================== */
  renderPointerVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const targetCell = this.ptrTargetIndex >= 0 ? this.ramCells[this.ptrTargetIndex] : null;
    const ptrValueStr = targetCell ? targetCell.addr : '0x000000000000 (NULL)';
    const derefValueStr = targetCell ? targetCell.value : 'SEGFAULT (Cannot deref NULL)';

    container.innerHTML = `
      <div class="glass-panel rounded-3xl p-6 lg:p-8 border border-cyan-500/25 relative overflow-hidden">
        <!-- Header Bar -->
        <div class="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono-code mb-2">
              <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              LIVE 64-BIT RAM ADDRESS SPACE • 0x7fff5fbff8a0
            </div>
            <h3 class="text-xl lg:text-2xl font-bold text-white tracking-tight">
              Interactive Pointer &amp; Memory Address Visualizer
            </h3>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button onclick="window.cverseVis.runArrayReverseDemo('${containerId}')" class="magnetic-btn px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 border border-emerald-400/40 text-emerald-300 text-xs font-mono-code font-semibold transition flex items-center gap-2">
              <span>⚡ Animate 2-Pointer Array Reversal</span>
            </button>
            <button onclick="window.cverseVis.toggleDoublePointer('${containerId}')" class="magnetic-btn px-3.5 py-2 rounded-xl ${this.doublePtrActive ? 'bg-purple-500/30 border-purple-400 text-purple-200' : 'bg-white/5 border-white/10 text-slate-300'} border text-xs font-mono-code transition">
              ${this.doublePtrActive ? '✓ int **pptr Active' : '+ Toggle int **pptr'}
            </button>
          </div>
        </div>

        <!-- Live C Instruction Telemetry Banner -->
        <div class="mb-6 px-4 py-3 rounded-2xl bg-slate-950/90 border border-white/10 flex flex-wrap items-center justify-between gap-3 font-mono-code text-xs">
          <div class="flex items-center gap-2.5">
            <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">EXECUTED</span>
            <code class="text-cyan-300 text-sm">${this.lastPtrLog}</code>
          </div>
          <div class="text-slate-400">
            sizeof(int) = <span class="text-white">4 bytes</span> • sizeof(int *) = <span class="text-white">8 bytes</span>
          </div>
        </div>

        <!-- Interactive SVG Canvas + Pointer & RAM Grid -->
        <div class="relative" id="${containerId}-stage">
          <!-- Dynamic SVG Overlay for Animated Bezier Arrows -->
          <svg id="${containerId}-svg" class="w-full h-32 lg:h-36 overflow-visible pointer-events-none select-none" viewBox="0 0 900 130" preserveAspectRatio="none">
            <defs>
              <linearGradient id="ptrGrad-${containerId}" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#10b981" />
                <stop offset="50%" stop-color="#06b6d4" />
                <stop offset="100%" stop-color="#38bdf8" />
              </linearGradient>
              <linearGradient id="pptrGrad-${containerId}" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#a855f7" />
                <stop offset="100%" stop-color="#10b981" />
              </linearGradient>
              <marker id="arrowHead-${containerId}" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto">
                <path d="M0,1 L9,5 L0,9 Z" fill="#06b6d4" />
              </marker>
              <marker id="arrowHeadPurple-${containerId}" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto">
                <path d="M0,1 L9,5 L0,9 Z" fill="#a855f7" />
              </marker>
            </defs>
            ${this.buildPointerSvgPaths(containerId)}
          </svg>

          <!-- Pointer Registers Row (Top) & Contiguous RAM Blocks (Bottom) -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center mb-6">
            <!-- Double Pointer Box (Optional) -->
            <div class="lg:col-span-4 ${this.doublePtrActive ? 'opacity-100 scale-100' : 'opacity-40 scale-95'} transition-all duration-300 rounded-2xl p-4 bg-purple-950/30 border ${this.doublePtrActive ? 'border-purple-400/50 shadow-lg shadow-purple-500/10' : 'border-white/10'}">
              <div class="flex items-center justify-between text-xs font-mono-code text-purple-300 mb-1">
                <span>int **pptr (Double Ptr)</span>
                <span class="text-slate-400">@ 0x7fff5fbff888</span>
              </div>
              <div class="font-mono-code text-sm font-bold text-white truncate">
                ${this.doublePtrActive ? '0x7fff5fbff890 (&ptr)' : 'Inactive (Click + Toggle)'}
              </div>
              <div class="text-[11px] text-purple-300/80 mt-1 font-mono-code">
                ${this.doublePtrActive && targetCell ? `**pptr == ${targetCell.value}` : 'Points to pointer ptr'}
              </div>
            </div>

            <!-- Primary Pointer Box (int *ptr) -->
            <div class="lg:col-span-4 rounded-2xl p-4 bg-emerald-950/30 border-2 border-emerald-400/60 shadow-lg shadow-emerald-500/15">
              <div class="flex items-center justify-between text-xs font-mono-code text-emerald-300 mb-1">
                <span class="font-bold">int *ptr (Pointer Variable)</span>
                <span class="text-slate-400">@ 0x7fff5fbff890</span>
              </div>
              <div class="font-mono-code text-base font-bold text-cyan-300 tracking-tight">
                ${ptrValueStr}
              </div>
              <div class="flex items-center justify-between text-xs font-mono-code mt-1.5 pt-1.5 border-t border-white/10">
                <span class="text-slate-400">Dereferenced <code class="text-emerald-300">*ptr</code>:</span>
                <span class="font-bold ${targetCell ? 'text-emerald-400' : 'text-rose-400'}">${derefValueStr}</span>
              </div>
            </div>

            <!-- Quick Dereference Mutation Box -->
            <div class="lg:col-span-4 rounded-2xl p-4 bg-slate-900/80 border border-white/10">
              <div class="text-xs font-mono-code text-slate-400 mb-2">
                LIVE DEREFERENCE WRITE (<code class="text-cyan-300">*ptr = new_val;</code>)
              </div>
              <div class="flex items-center gap-2">
                <input id="${containerId}-deref-input" type="number" value="${targetCell ? targetCell.value + 15 : 99}" class="w-24 px-3 py-1.5 rounded-xl bg-slate-950 border border-white/15 text-white font-mono-code text-sm focus:outline-none focus:border-cyan-400" />
                <button onclick="window.cverseVis.mutateViaPointer('${containerId}')" class="magnetic-btn flex-1 px-3 py-1.5 rounded-xl btn-emerald-glow text-slate-950 font-bold text-xs font-mono-code">
                  Execute *ptr = val
                </button>
              </div>
            </div>
          </div>

          <!-- 6 Contiguous RAM Memory Blocks -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            ${this.ramCells
              .map((cell, idx) => {
                const isTargeted = this.ptrTargetIndex === idx;
                const isLeft = this.twoPointerMode && this.leftPtrIndex === idx;
                const isRight = this.twoPointerMode && this.rightPtrIndex === idx;
                return `
                  <div id="${containerId}-cell-${idx}" onclick="window.cverseVis.pointToCell(${idx}, '${containerId}')"
                    class="ram-cell cursor-pointer rounded-2xl p-3.5 border transition-all ${
                      isTargeted
                        ? 'bg-cyan-500/15 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-[1.03]'
                        : isLeft || isRight
                        ? 'bg-emerald-500/15 border-emerald-400 shadow-md shadow-emerald-500/15'
                        : 'bg-slate-900/75 border-white/10 hover:border-white/25'
                    }">
                    <div class="flex items-center justify-between text-[11px] font-mono-code mb-1">
                      <span class="px-1.5 py-0.5 rounded ${isTargeted ? 'bg-cyan-400 text-slate-950 font-bold' : 'bg-white/10 text-slate-300'}">${cell.name}</span>
                      <span class="text-slate-400">${cell.type}</span>
                    </div>
                    <div class="my-2 text-center font-mono-code text-2xl font-extrabold ${isTargeted ? 'text-cyan-300' : 'text-white'}">
                      ${cell.value}
                    </div>
                    <div class="text-[10px] font-mono-code text-center py-1 rounded bg-slate-950/80 text-emerald-400/90 border border-white/5">
                      ${cell.addr}
                    </div>
                    <div class="mt-1.5 text-[10px] font-mono-code text-center text-slate-400">
                      ${isTargeted ? '🎯 *ptr points here' : isLeft ? '⬅ *left' : isRight ? '➡ *right' : 'Click to point &'}
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>

        <!-- Pointer Arithmetic & Address Controls Bar -->
        <div class="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs font-mono-code text-slate-400 mr-1">Pointer Arithmetic:</span>
            <button onclick="window.cverseVis.stepPointer(-1, '${containerId}')" class="magnetic-btn px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono-code text-cyan-300">
              ⬅ ptr-- (-4 Bytes)
            </button>
            <button onclick="window.cverseVis.stepPointer(1, '${containerId}')" class="magnetic-btn px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono-code text-cyan-300">
              ptr++ (+4 Bytes) ➡
            </button>
            <button onclick="window.cverseVis.stepPointer(2, '${containerId}')" class="magnetic-btn px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono-code text-emerald-300">
              ptr + 2 (+8 Bytes)
            </button>
            <button onclick="window.cverseVis.pointToCell(-1, '${containerId}')" class="magnetic-btn px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-mono-code text-rose-300">
              ptr = NULL (0x0)
            </button>
          </div>
          <div class="text-xs text-slate-400">
            💡 <strong class="text-slate-200">Pro Tip:</strong> Click any RAM block above to execute <code class="text-emerald-400 font-mono-code">ptr = &amp;block;</code>
          </div>
        </div>
      </div>
    `;

    if (window.cverseEffects) window.cverseEffects.bindMagneticButtons();
  }

  buildPointerSvgPaths(containerId) {
    // Coordinates in 900x130 viewBox
    // Primary pointer box sits around x=450, y=15
    // 6 RAM cells sit at xCenters: 75, 225, 375, 525, 675, 825, y=122
    const xCenters = [75, 225, 375, 525, 675, 825];
    let pathsHtml = '';

    if (this.doublePtrActive) {
      // Curve from pptr (x=160, y=28) to ptr (x=420, y=28)
      const dPptr = `M 160 35 C 240 5, 340 5, 420 35`;
      pathsHtml += `
        <path d="${dPptr}" fill="none" stroke="url(#pptrGrad-${containerId})" stroke-width="2.5" class="pointer-arrow-path" marker-end="url(#arrowHeadPurple-${containerId})" />
        <circle r="4" fill="#a855f7">
          <animateMotion dur="1.4s" repeatCount="indefinite" path="${dPptr}" />
        </circle>
        <text x="290" y="16" fill="#c084fc" font-size="11" font-family="JetBrains Mono" text-anchor="middle">pptr = &amp;ptr</text>
      `;
    }

    if (this.ptrTargetIndex >= 0 && this.ptrTargetIndex < xCenters.length) {
      const startX = 450;
      const startY = 38;
      const endX = xCenters[this.ptrTargetIndex];
      const endY = 122;
      const ctrlY1 = 75;
      const ctrlY2 = 85;
      const d = `M ${startX} ${startY} C ${startX} ${ctrlY1}, ${endX} ${ctrlY2}, ${endX} ${endY}`;

      pathsHtml += `
        <path d="${d}" fill="none" stroke="rgba(6, 182, 212, 0.2)" stroke-width="7" />
        <path d="${d}" fill="none" stroke="url(#ptrGrad-${containerId})" stroke-width="3" class="pointer-arrow-path" marker-end="url(#arrowHead-${containerId})" />
        <circle r="5" fill="#10b981">
          <animateMotion dur="1.1s" repeatCount="indefinite" path="${d}" />
        </circle>
        <text x="${(startX + endX) / 2}" y="72" fill="#34d399" font-size="11" font-family="JetBrains Mono" text-anchor="middle">
          *ptr ➔ ${this.ramCells[this.ptrTargetIndex].addr}
        </text>
      `;
    } else {
      pathsHtml += `
        <text x="450" y="78" fill="#fb7185" font-size="13" font-family="JetBrains Mono" text-anchor="middle">
          ⚠ ptr == NULL (0x0) — Points to no valid memory address
        </text>
      `;
    }

    return pathsHtml;
  }

  pointToCell(idx, containerId) {
    this.twoPointerMode = false;
    this.ptrTargetIndex = idx;
    if (idx >= 0) {
      const cell = this.ramCells[idx];
      this.lastPtrLog = `ptr = &${cell.name}; // ptr now stores ${cell.addr}`;
    } else {
      this.lastPtrLog = `ptr = NULL; // Safe sentinel address 0x0`;
    }
    if (window.cverseEffects) window.cverseEffects.playPointerPulse();
    if (window.cverseApp) window.cverseApp.unlockBadge('pointer_unlocked');
    this.renderPointerVisualizer(containerId);
  }

  stepPointer(delta, containerId) {
    this.twoPointerMode = false;
    if (this.ptrTargetIndex < 0) {
      this.ptrTargetIndex = 0;
    } else {
      this.ptrTargetIndex = (this.ptrTargetIndex + delta + this.ramCells.length) % this.ramCells.length;
    }
    const cell = this.ramCells[this.ptrTargetIndex];
    const sign = delta >= 0 ? `+ ${delta}` : `- ${Math.abs(delta)}`;
    this.lastPtrLog = `ptr = ptr ${sign}; // Advanced ${delta * 4} bytes to ${cell.addr} (${cell.name})`;
    if (window.cverseEffects) window.cverseEffects.playPointerPulse();
    if (window.cverseApp) window.cverseApp.unlockBadge('pointer_unlocked');
    this.renderPointerVisualizer(containerId);
  }

  mutateViaPointer(containerId) {
    if (this.ptrTargetIndex < 0) {
      this.lastPtrLog = `CRASH PREVENTED: Segmentation Fault! Cannot dereference NULL pointer (*ptr).`;
      if (window.cverseEffects) window.cverseEffects.playError();
      this.renderPointerVisualizer(containerId);
      return;
    }
    const input = document.getElementById(`${containerId}-deref-input`);
    const newVal = input ? parseInt(input.value, 10) || 0 : 99;
    const cell = this.ramCells[this.ptrTargetIndex];
    cell.value = newVal;
    this.lastPtrLog = `*ptr = ${newVal}; // Teleported to ${cell.addr} and overwrote ${cell.name} = ${newVal}!`;
    if (window.cverseEffects) window.cverseEffects.playCompileSuccess();
    if (window.cverseApp) window.cverseApp.unlockBadge('pointer_unlocked');
    this.renderPointerVisualizer(containerId);

    const cellEl = document.getElementById(`${containerId}-cell-${this.ptrTargetIndex}`);
    if (cellEl) {
      cellEl.classList.add('highlight-write');
    }
  }

  toggleDoublePointer(containerId) {
    this.doublePtrActive = !this.doublePtrActive;
    this.lastPtrLog = this.doublePtrActive
      ? `int **pptr = &ptr; // Double pointer holds address of ptr (0x7fff5fbff890)`
      : `// Double pointer inspection hidden`;
    if (window.cverseEffects) window.cverseEffects.playToggle();
    this.renderPointerVisualizer(containerId);
  }

  runArrayReverseDemo(containerId) {
    this.twoPointerMode = true;
    this.leftPtrIndex = 0;
    this.rightPtrIndex = 4;
    this.ptrTargetIndex = 0;

    // Swap step 1: arr[0] and arr[4]
    const swapPair = (i, j, stepLabel) => {
      this.leftPtrIndex = i;
      this.rightPtrIndex = j;
      this.ptrTargetIndex = i;
      const tmp = this.ramCells[i].value;
      this.ramCells[i].value = this.ramCells[j].value;
      this.ramCells[j].value = tmp;
      this.lastPtrLog = `${stepLabel}: Swapped *left (${this.ramCells[i].name}) <-> *right (${this.ramCells[j].name})`;
      if (window.cverseEffects) window.cverseEffects.playPointerPulse();
      this.renderPointerVisualizer(containerId);
    };

    swapPair(0, 4, 'Step 1/2 [left=0, right=4]');
    setTimeout(() => {
      swapPair(1, 3, 'Step 2/2 [left=1, right=3]');
    }, 650);
    setTimeout(() => {
      this.leftPtrIndex = 2;
      this.rightPtrIndex = 2;
      this.ptrTargetIndex = 2;
      this.lastPtrLog = `while (left < right) complete! Array reversed in-place with O(1) memory!`;
      if (window.cverseEffects) window.cverseEffects.playCompileSuccess();
      if (window.cverseApp) window.cverseApp.unlockBadge('pointer_unlocked');
      this.renderPointerVisualizer(containerId);
    }, 1300);
  }

  /* ========================================================================
     2. MODULE 1 LAB: WAREHOUSE VARIABLE & FORMAT SPECIFIER INSPECTOR
     ======================================================================== */
  renderWarehouseLab(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="glass-panel rounded-3xl p-6 lg:p-8 border border-emerald-500/25">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          <div>
            <span class="text-xs font-mono-code uppercase tracking-wider text-emerald-400">Module 1 Interactive Lab</span>
            <h3 class="text-xl font-bold text-white mt-0.5">High-Tech Warehouse Variable &amp; Binary Inspector</h3>
          </div>
          <span class="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono-code text-emerald-300">
            Live RAM Shelf Telemetry
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <!-- int box -->
          <div class="rounded-2xl p-4 bg-slate-900/80 border border-emerald-500/30">
            <div class="flex items-center justify-between text-xs font-mono-code text-emerald-400 mb-2">
              <span>📦 int age (4 Bytes)</span>
              <span>@ 0x7fff...8c0</span>
            </div>
            <input id="wh-int-input" type="number" value="21" oninput="window.cverseVis.updateWarehousePreview()"
              class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white font-mono-code text-lg font-bold mb-2 focus:outline-none focus:border-emerald-400" />
            <div class="text-[11px] font-mono-code text-slate-400">
              Specifier: <code class="text-emerald-300">%d</code> • Binary: <span id="wh-int-bin" class="text-cyan-300">00010101</span>
            </div>
          </div>

          <!-- float box -->
          <div class="rounded-2xl p-4 bg-slate-900/80 border border-cyan-500/30">
            <div class="flex items-center justify-between text-xs font-mono-code text-cyan-400 mb-2">
              <span>🧪 float bill (4 Bytes)</span>
              <span>@ 0x7fff...8bc</span>
            </div>
            <input id="wh-float-input" type="number" step="0.25" value="126.50" oninput="window.cverseVis.updateWarehousePreview()"
              class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white font-mono-code text-lg font-bold mb-2 focus:outline-none focus:border-cyan-400" />
            <div class="text-[11px] font-mono-code text-slate-400">
              Specifier: <code class="text-cyan-300">%.2f</code> • IEEE-754 Float
            </div>
          </div>

          <!-- char box -->
          <div class="rounded-2xl p-4 bg-slate-900/80 border border-purple-500/30">
            <div class="flex items-center justify-between text-xs font-mono-code text-purple-400 mb-2">
              <span>💎 char tier (1 Byte)</span>
              <span>@ 0x7fff...8bb</span>
            </div>
            <input id="wh-char-input" type="text" maxlength="1" value="S" oninput="window.cverseVis.updateWarehousePreview()"
              class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white font-mono-code text-lg font-bold mb-2 focus:outline-none focus:border-purple-400" />
            <div class="text-[11px] font-mono-code text-slate-400">
              Specifier: <code class="text-purple-300">%c</code> • ASCII Code: <span id="wh-char-ascii" class="text-purple-300">83</span>
            </div>
          </div>
        </div>

        <!-- Live printf Terminal Output Preview -->
        <div class="rounded-2xl p-4 bg-slate-950 border border-white/10 font-mono-code text-xs sm:text-sm">
          <div class="text-slate-400 mb-1">// Live C Statement:</div>
          <div id="wh-code-line" class="text-slate-200 mb-3">
            printf("Agent Age: %d | Bill: $%.2f | Rank Tier: '%c'\\n", age, bill, tier);
          </div>
          <div class="text-slate-400 mb-1">// Instant stdout Output:</div>
          <div id="wh-stdout-line" class="text-emerald-400 font-bold text-sm sm:text-base">
            Agent Age: 21 | Bill: $126.50 | Rank Tier: 'S' (ASCII 83)
          </div>
        </div>
      </div>
    `;
  }

  updateWarehousePreview() {
    const intEl = document.getElementById('wh-int-input');
    const floatEl = document.getElementById('wh-float-input');
    const charEl = document.getElementById('wh-char-input');
    if (!intEl || !floatEl || !charEl) return;

    const age = parseInt(intEl.value, 10) || 0;
    const bill = parseFloat(floatEl.value) || 0;
    const ch = (charEl.value || 'A')[0];
    const ascii = ch.charCodeAt(0);

    const binEl = document.getElementById('wh-int-bin');
    const asciiEl = document.getElementById('wh-char-ascii');
    const outEl = document.getElementById('wh-stdout-line');

    if (binEl) binEl.textContent = (age >>> 0).toString(2).padStart(8, '0').slice(-12);
    if (asciiEl) asciiEl.textContent = String(ascii);
    if (outEl) {
      outEl.textContent = `Agent Age: ${age} | Bill: $${bill.toFixed(2)} | Rank Tier: '${ch}' (ASCII ${ascii})`;
    }
  }

  /* ========================================================================
     3. MODULE 2 GAMIFIED CHALLENGE: THE SECRET VAULT (4-DIGIT CODE CRACKER)
     ======================================================================== */
  renderSecretVault(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="glass-panel rounded-3xl p-6 lg:p-8 border ${this.vaultUnlocked ? 'border-emerald-400/60 shadow-lg shadow-emerald-500/20' : 'border-cyan-500/30'}">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-mono-code mb-2">
              🔐 GAMIFIED CHALLENGE • MODULE 2
            </div>
            <h3 class="text-xl lg:text-2xl font-bold text-white">The Secret Vault: 4-Digit Loop Cracker</h3>
            <p class="text-xs sm:text-sm text-slate-300 mt-1">
              Crack the 4-digit numeric PIN within <strong class="text-white">5 tries</strong> using conditional hints—or deploy a C <code class="text-cyan-300 font-mono-code">for</code> loop brute-force script!
            </p>
          </div>
          <div class="flex items-center gap-3">
            <div class="px-4 py-2 rounded-2xl bg-slate-950 border border-white/10 font-mono-code text-xs">
              Tries Remaining: <span class="text-lg font-bold ${this.vaultTriesLeft > 2 ? 'text-emerald-400' : 'text-rose-400'}">${this.vaultTriesLeft}/5</span>
            </div>
            <button onclick="window.cverseVis.resetVault('${containerId}')" class="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono-code text-slate-300">
              Reset Vault
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <!-- Left: Vault Dial & Manual / Loop Controls -->
          <div class="lg:col-span-7 space-y-4">
            <div class="p-4 rounded-2xl bg-slate-950/90 border border-white/10">
              <div class="text-xs font-mono-code text-cyan-300 mb-2">
                📡 TELEMETRY HINT: First digit is <span class="text-white font-bold">${this.vaultSecret[0]}</span>, code is EVEN, and lies between <span class="text-white font-bold">${Math.max(1000, parseInt(this.vaultSecret, 10) - 20)}</span> and <span class="text-white font-bold">${Math.min(9999, parseInt(this.vaultSecret, 10) + 20)}</span>!
              </div>
              <div class="flex flex-wrap items-center gap-3 mt-3">
                <input id="${containerId}-pin-input" type="text" maxlength="4" placeholder="4826" value="${this.vaultUnlocked ? this.vaultSecret : ''}"
                  class="w-36 px-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-white font-mono-code text-xl font-extrabold tracking-widest text-center focus:outline-none focus:border-emerald-400" />
                <button onclick="window.cverseVis.submitVaultGuess('${containerId}')" ${this.vaultUnlocked ? 'disabled' : ''}
                  class="magnetic-btn px-5 py-2.5 rounded-xl btn-emerald-glow text-slate-950 font-bold text-xs sm:text-sm font-mono-code">
                  ${this.vaultUnlocked ? '🔓 VAULT UNLOCKED!' : 'Test 4-Digit Code'}
                </button>
                <button onclick="window.cverseVis.runVaultLoopCracker('${containerId}')"
                  class="magnetic-btn px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-200 font-mono-code text-xs font-semibold">
                  ⚡ Run C for-loop Cracker
                </button>
              </div>
            </div>

            <!-- Attempt History -->
            <div class="space-y-2">
              ${
                this.vaultHistory.length === 0
                  ? `<div class="text-xs font-mono-code text-slate-400 py-3 px-4 rounded-xl bg-white/5 border border-white/5">
                       No attempts yet. Enter a 4-digit guess or click "Run C for-loop Cracker" to watch C iteration crack the lock!
                     </div>`
                  : this.vaultHistory
                      .map(
                        (item, idx) => `
                    <div class="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 font-mono-code text-xs">
                      <span class="text-slate-400">Try #${idx + 1}</span>
                      <div class="flex items-center gap-1.5">
                        ${item.digits
                          .map(
                            (d) =>
                              `<span class="vault-digit w-7 h-7 rounded-lg border flex items-center justify-center font-bold ${d.status}">${d.ch}</span>`
                          )
                          .join('')}
                      </div>
                      <span class="${item.hintColor} font-semibold">${item.hint}</span>
                    </div>
                  `
                      )
                      .join('')
              }
            </div>
          </div>

          <!-- Right: Live C Loop Code Visual -->
          <div class="lg:col-span-5 rounded-2xl p-4 bg-slate-950 border border-white/10 font-mono-code text-xs leading-relaxed">
            <div class="flex items-center justify-between text-slate-400 pb-2 mb-2 border-b border-white/10">
              <span>vault_cracker.c</span>
              <span id="${containerId}-loop-counter" class="text-emerald-400">${this.vaultUnlocked ? `Matched @ ${this.vaultSecret}!` : 'Ready'}</span>
            </div>
            <pre class="text-slate-300 overflow-x-auto"><code><span class="tok-kw">for</span> (<span class="tok-type">int</span> pin = <span class="tok-num">1000</span>; pin &lt;= <span class="tok-num">9999</span>; pin++) {
    <span class="tok-kw">if</span> (pin == SECRET_VAULT) {
        <span class="tok-fn">printf</span>(<span class="tok-str">"UNLOCKED: %d\\n"</span>, pin);
        <span class="tok-kw">break</span>; <span class="tok-com">// Exit loop!</span>
    }
}</code></pre>
          </div>
        </div>
      </div>
    `;
  }

  submitVaultGuess(containerId) {
    if (this.vaultUnlocked) return;
    const input = document.getElementById(`${containerId}-pin-input`);
    if (!input) return;
    const guess = (input.value || '').trim();
    if (!/^\d{4}$/.test(guess)) {
      input.value = '4826';
      return;
    }

    const digits = guess.split('').map((ch, idx) => {
      if (ch === this.vaultSecret[idx]) return { ch, status: 'correct' };
      if (this.vaultSecret.includes(ch)) return { ch, status: 'close' };
      return { ch, status: 'wrong' };
    });

    const numGuess = parseInt(guess, 10);
    const numSecret = parseInt(this.vaultSecret, 10);

    if (numGuess === numSecret) {
      this.vaultUnlocked = true;
      this.vaultHistory.push({ digits, hint: '🔓 VAULT CRACKED! (+150 XP)', hintColor: 'text-emerald-400' });
      if (window.cverseEffects) {
        window.cverseEffects.playUnlock();
        window.cverseEffects.triggerConfetti();
      }
      if (window.cverseApp) {
        window.cverseApp.unlockBadge('vault_breaker');
      }
    } else {
      this.vaultTriesLeft = Math.max(0, this.vaultTriesLeft - 1);
      const dir = numGuess < numSecret ? '⬆ Go HIGHER' : '⬇ Go LOWER';
      this.vaultHistory.push({
        digits,
        hint: this.vaultTriesLeft === 0 ? `Revealed: ${this.vaultSecret}` : dir,
        hintColor: numGuess < numSecret ? 'text-cyan-300' : 'text-amber-300'
      });
      if (this.vaultTriesLeft === 0) {
        this.vaultTriesLeft = 5;
        this.vaultHistory = [];
      }
      if (window.cverseEffects) window.cverseEffects.playClick();
    }

    this.renderSecretVault(containerId);
  }

  runVaultLoopCracker(containerId) {
    if (this.vaultLoopRunning) return;
    this.vaultLoopRunning = true;
    const counterEl = document.getElementById(`${containerId}-loop-counter`);
    const inputEl = document.getElementById(`${containerId}-pin-input`);
    const target = parseInt(this.vaultSecret, 10);
    let current = 1000;
    const step = Math.ceil((target - 1000) / 14);

    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
        this.vaultLoopRunning = false;
        if (inputEl) inputEl.value = String(target);
        this.submitVaultGuess(containerId);
        return;
      }
      if (counterEl) counterEl.textContent = `Testing pin == ${current}...`;
      if (inputEl) inputEl.value = String(current);
      if (window.cverseEffects) window.cverseEffects.playClick();
    }, 55);
  }

  resetVault(containerId) {
    const pool = ['4826', '7264', '3942', '8416', '5280'];
    this.vaultSecret = pool[Math.floor(Math.random() * pool.length)];
    this.vaultTriesLeft = 5;
    this.vaultHistory = [];
    this.vaultUnlocked = false;
    this.renderSecretVault(containerId);
  }

  /* ========================================================================
     4. MODULE 3 LAB: ANIMATED CALL STACK & RECURSION VISUALIZER
     ======================================================================== */
  renderCallStackVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="glass-panel rounded-3xl p-6 lg:p-8 border border-purple-500/30">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          <div>
            <span class="text-xs font-mono-code uppercase tracking-wider text-purple-400">Module 3 Interactive Visual Aid</span>
            <h3 class="text-xl lg:text-2xl font-bold text-white mt-0.5">Live LIFO Call Stack &amp; Recursion Animator</h3>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="text-xs font-mono-code text-slate-300">n =</label>
            <select id="${containerId}-n-select" onchange="window.cverseVis.setRecursionN(this.value, '${containerId}')"
              class="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-white font-mono-code text-xs">
              <option value="3" ${this.recursionN === 3 ? 'selected' : ''}>factorial(3)</option>
              <option value="4" ${this.recursionN === 4 ? 'selected' : ''}>factorial(4)</option>
              <option value="5" ${this.recursionN === 5 ? 'selected' : ''}>factorial(5)</option>
            </select>
            <button onclick="window.cverseVis.animateFactorialStack('${containerId}')" class="magnetic-btn px-4 py-2 rounded-xl btn-emerald-glow text-slate-950 font-bold text-xs font-mono-code">
              ▶ Animate Stack Push &amp; Pop
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- Left: Recursive C Code -->
          <div class="lg:col-span-5 rounded-2xl p-4 bg-slate-950 border border-white/10 font-mono-code text-xs leading-relaxed">
            <div class="text-slate-400 pb-2 mb-2 border-b border-white/10 flex justify-between">
              <span>recursion_stack.c</span>
              <span class="text-purple-400">LIFO Stack Growth</span>
            </div>
            <pre class="text-slate-200"><code><span class="tok-type">int</span> <span class="tok-fn">factorial</span>(<span class="tok-type">int</span> n) {
    <span class="tok-com">// 1. Base Case stops stack growth</span>
    <span class="tok-kw">if</span> (n &lt;= <span class="tok-num">1</span>) {
        <span class="tok-kw">return</span> <span class="tok-num">1</span>;
    }
    <span class="tok-com">// 2. Push new frame for (n - 1)</span>
    <span class="tok-kw">return</span> n * <span class="tok-fn">factorial</span>(n - <span class="tok-num">1</span>);
}</code></pre>
            <div class="mt-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-200 text-xs">
              💡 Watch how each recursive call pushes a fresh stack frame onto RAM, hits the Base Case (<code class="text-emerald-300">n == 1</code>), and unwinds!
            </div>
          </div>

          <!-- Right: Animated Stack Frames Column -->
          <div class="lg:col-span-7">
            <div class="flex items-center justify-between text-xs font-mono-code text-slate-400 mb-2 px-1">
              <span>🥞 ACTIVE CALL STACK FRAMES (TOP OF STACK FIRST)</span>
              <span>RSP Register: <strong class="text-cyan-300">0x7fff5fbff${(0x8c0 - this.stackFrames.length * 16).toString(16)}</strong></span>
            </div>
            <div id="${containerId}-frames" class="space-y-2.5 min-h-[240px] flex flex-col justify-end p-4 rounded-2xl bg-slate-950/80 border border-white/10">
              ${this.stackFrames
                .slice()
                .reverse()
                .map(
                  (f, idx) => `
                <div class="stack-frame-enter rounded-xl p-3.5 border ${
                  idx === 0
                    ? 'bg-purple-500/15 border-purple-400 shadow-lg shadow-purple-500/10'
                    : 'bg-slate-900/80 border-white/10'
                } flex flex-wrap items-center justify-between gap-2 font-mono-code text-xs">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded ${idx === 0 ? 'bg-emerald-400 text-slate-950 font-bold' : 'bg-white/10 text-slate-300'}">
                      ${idx === 0 ? 'TOP (RSP)' : `Frame #${this.stackFrames.length - idx}`}
                    </span>
                    <span class="text-white font-bold text-sm">${f.fn}</span>
                  </div>
                  <div class="text-cyan-300">${f.local}</div>
                  <div class="text-slate-400 text-[11px]">Ret: ${f.retAddr}</div>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setRecursionN(val, containerId) {
    this.recursionN = parseInt(val, 10) || 4;
    this.animateFactorialStack(containerId);
  }

  animateFactorialStack(containerId) {
    if (this.isAnimatingStack) return;
    this.isAnimatingStack = true;
    const n = this.recursionN;
    this.stackFrames = [
      { fn: 'main()', args: 'void', local: `Calls factorial(${n})`, retAddr: '0x401120 (OS)', status: 'active' }
    ];
    this.renderCallStackVisualizer(containerId);

    const steps = [];
    // Push frames down to 1
    for (let k = n; k >= 1; k--) {
      steps.push({
        action: 'push',
        frame: {
          fn: `factorial(${k})`,
          args: `n = ${k}`,
          local: k === 1 ? '🎯 BASE CASE! returns 1' : `Waiting for ${k} * factorial(${k - 1})`,
          retAddr: `0x4012a${k}`
        }
      });
    }
    // Pop frames and compute product
    let acc = 1;
    for (let k = 1; k <= n; k++) {
      acc *= k;
      steps.push({
        action: 'pop',
        k,
        acc
      });
    }

    let stepIdx = 0;
    const timer = setInterval(() => {
      if (stepIdx >= steps.length) {
        clearInterval(timer);
        this.isAnimatingStack = false;
        if (window.cverseEffects) window.cverseEffects.playCompileSuccess();
        if (window.cverseApp) window.cverseApp.unlockBadge('stack_master');
        return;
      }

      const st = steps[stepIdx++];
      if (st.action === 'push') {
        this.stackFrames.push(st.frame);
        if (window.cverseEffects) window.cverseEffects.playPointerPulse();
      } else {
        this.stackFrames.pop();
        const top = this.stackFrames[this.stackFrames.length - 1];
        if (top) {
          top.local = `Resolved return value: ${st.acc}`;
        }
        if (window.cverseEffects) window.cverseEffects.playClick();
      }
      this.renderCallStackVisualizer(containerId);
    }, 520);
  }

  /* ========================================================================
     5. MODULE 4 LAB: CONTIGUOUS STRING ARRAY (\0) & CAESAR CIPHER MATRIX
     ======================================================================== */
  renderCaesarMatrix(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const shift = ((this.cipherShift % 26) + 26) % 26;
    const chars = this.cipherPlaintext.slice(0, 12).toUpperCase().split('');
    const encrypted = chars.map((ch) => {
      if (ch >= 'A' && ch <= 'Z') {
        return String.fromCharCode(((ch.charCodeAt(0) - 65 + shift) % 26) + 65);
      }
      return ch;
    });

    // Append explicit '\0' null terminator cell
    const displayCells = [...encrypted, '\\0'];

    container.innerHTML = `
      <div class="glass-panel rounded-3xl p-6 lg:p-8 border border-emerald-500/25">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          <div>
            <span class="text-xs font-mono-code uppercase tracking-wider text-emerald-400">Module 4 Interactive Lab</span>
            <h3 class="text-xl lg:text-2xl font-bold text-white mt-0.5">Contiguous C String RAM Strip &amp; Caesar Cipher Shifter</h3>
          </div>
          <span class="px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono-code">
            Includes Mandatory '\\0' Null Byte Caboose
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
          <div class="md:col-span-7">
            <label class="block text-xs font-mono-code text-slate-400 mb-1.5">Plaintext char message[] (Max 12 chars):</label>
            <input type="text" maxlength="12" value="${this.cipherPlaintext}"
              oninput="window.cverseVis.updateCipher(this.value, null, '${containerId}')"
              class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white font-mono-code text-sm uppercase tracking-wider focus:outline-none focus:border-emerald-400" />
          </div>
          <div class="md:col-span-5">
            <label class="block text-xs font-mono-code text-slate-400 mb-1.5">Caesar Shift Key (+${shift} ASCII offset):</label>
            <div class="flex items-center gap-3">
              <input type="range" min="0" max="25" value="${shift}"
                oninput="window.cverseVis.updateCipher(null, this.value, '${containerId}')"
                class="w-full accent-emerald-400 cursor-pointer" />
              <span class="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono-code text-xs font-bold">+${shift}</span>
            </div>
          </div>
        </div>

        <!-- Contiguous Byte Cells in RAM -->
        <div class="overflow-x-auto pb-2">
          <div class="inline-flex items-center gap-2 min-w-full">
            ${displayCells
              .map((ch, idx) => {
                const isNull = ch === '\\0';
                const ascii = isNull ? 0 : ch.charCodeAt(0);
                return `
                  <div class="flex-1 min-w-[64px] rounded-2xl p-2.5 border text-center font-mono-code ${
                    isNull
                      ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                      : 'bg-slate-900/90 border-white/10 text-white'
                  }">
                    <div class="text-[10px] text-slate-400">[${idx}]</div>
                    <div class="text-lg font-extrabold my-1 ${isNull ? 'text-rose-400' : 'text-emerald-300'}">'${ch}'</div>
                    <div class="text-[10px] px-1 py-0.5 rounded bg-slate-950 text-cyan-300">ASCII ${ascii}</div>
                    <div class="text-[9px] text-slate-500 mt-1">0x..8${idx.toString(16)}</div>
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>
      </div>
    `;
  }

  updateCipher(newText, newShift, containerId) {
    if (newText !== null) this.cipherPlaintext = newText || 'C';
    if (newShift !== null) this.cipherShift = parseInt(newShift, 10) || 0;
    if (window.cverseApp) window.cverseApp.unlockBadge('cipher_ghost');
    this.renderCaesarMatrix(containerId);
  }

  /* ========================================================================
     6. MODULE 6 LAB: STACK VS. HEAP ALLOCATOR (malloc / realloc / free)
     ======================================================================== */
  renderHeapAllocator(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const activeBytes = this.heapBlocks
      .filter((b) => b.status === 'allocated')
      .reduce((s, b) => s + b.bytes, 0);
    const leakedBytes = this.heapBlocks
      .filter((b) => b.status === 'leaked')
      .reduce((s, b) => s + b.bytes, 0);

    container.innerHTML = `
      <div class="glass-panel rounded-3xl p-6 lg:p-8 border border-purple-500/30">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          <div>
            <span class="text-xs font-mono-code uppercase tracking-wider text-purple-400">Module 6 Interactive Lab</span>
            <h3 class="text-xl lg:text-2xl font-bold text-white mt-0.5">Dynamic Heap Arena: malloc(), realloc() &amp; free()</h3>
          </div>
          <div class="flex flex-wrap items-center gap-2 font-mono-code text-xs">
            <span class="px-3 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
              Active Heap: ${activeBytes} B
            </span>
            <span class="px-3 py-1.5 rounded-xl ${
              leakedBytes > 0
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse'
                : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
            } border">
              ${leakedBytes > 0 ? `⚠ Leaked: ${leakedBytes} B` : '🛡 0 Bytes Leaked'}
            </span>
          </div>
        </div>

        <!-- Heap Controls -->
        <div class="flex flex-wrap items-center gap-2.5 mb-6">
          <button onclick="window.cverseVis.heapAllocate('malloc', '${containerId}')" class="magnetic-btn px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 font-mono-code text-xs font-semibold">
            + malloc(16) [Uninitialized]
          </button>
          <button onclick="window.cverseVis.heapAllocate('calloc', '${containerId}')" class="magnetic-btn px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 font-mono-code text-xs font-semibold">
            + calloc(4, sizeof(int)) [Zeroed]
          </button>
          <button onclick="window.cverseVis.heapReallocLast('${containerId}')" class="magnetic-btn px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-200 font-mono-code text-xs font-semibold">
            ⤢ realloc(ptr, 32)
          </button>
          <button onclick="window.cverseVis.heapFreeAll('${containerId}')" class="magnetic-btn px-4 py-2 rounded-xl btn-emerald-glow text-slate-950 font-mono-code text-xs font-bold">
            ✓ free(all) &amp; ptr = NULL
          </button>
        </div>

        <!-- Heap Blocks Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${this.heapBlocks
            .map(
              (b) => `
            <div class="rounded-2xl p-4 border font-mono-code transition-all ${
              b.status === 'allocated'
                ? 'bg-slate-900/90 border-cyan-400/40'
                : b.status === 'freed'
                ? 'bg-emerald-950/20 border-emerald-500/30 opacity-75'
                : 'bg-rose-950/30 border-rose-500/50'
            }">
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="font-bold text-white">${b.func}</span>
                <span class="px-2 py-0.5 rounded text-[10px] ${
                  b.status === 'allocated'
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'bg-emerald-500/20 text-emerald-300'
                }">${b.status.toUpperCase()}</span>
              </div>
              <div class="text-xs text-slate-400 mb-2">Addr: <span class="text-emerald-300">${b.addr}</span> (${b.bytes}B)</div>
              <div class="p-2 rounded-xl bg-slate-950 text-xs text-slate-200 mb-3 truncate">${b.values}</div>
              ${
                b.status === 'allocated'
                  ? `<button onclick="window.cverseVis.heapFreeOne(${b.id}, '${containerId}')" class="w-full py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                       Execute free(ptr);
                     </button>`
                  : `<div class="text-center text-[11px] text-emerald-400 py-1">✓ Returned to OS Heap</div>`
              }
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;
  }

  heapAllocate(mode, containerId) {
    const id = Date.now() + Math.floor(Math.random() * 100);
    const addr = `0x55555555${this.heapNextOffset.toString(16)}`;
    this.heapNextOffset += 16;
    this.heapBlocks.push({
      id,
      label: `block_${this.heapBlocks.length + 1}`,
      func: mode === 'calloc' ? 'calloc(4, 4)' : 'malloc(16)',
      addr,
      bytes: 16,
      values: mode === 'calloc' ? '[0, 0, 0, 0] (Zero-Init)' : '[0xfa21, 0x00b4, ...] (Garbage)',
      status: 'allocated'
    });
    if (window.cverseEffects) window.cverseEffects.playPointerPulse();
    this.renderHeapAllocator(containerId);
  }

  heapReallocLast(containerId) {
    const target = [...this.heapBlocks].reverse().find((b) => b.status === 'allocated');
    if (target) {
      target.bytes = 32;
      target.func = 'realloc(ptr, 32)';
      target.values = '[88, 94, 79, 97, 92, 100, 85, 90]';
      if (window.cverseEffects) window.cverseEffects.playCompileSuccess();
      this.renderHeapAllocator(containerId);
    }
  }

  heapFreeOne(id, containerId) {
    const block = this.heapBlocks.find((b) => b.id === id);
    if (block) {
      block.status = 'freed';
      block.values = 'FREED (ptr = NULL)';
    }
    if (window.cverseEffects) window.cverseEffects.playCompileSuccess();
    if (window.cverseApp) window.cverseApp.unlockBadge('zero_leaks');
    this.renderHeapAllocator(containerId);
  }

  heapFreeAll(containerId) {
    this.heapBlocks.forEach((b) => {
      b.status = 'freed';
      b.values = 'FREED (ptr = NULL)';
    });
    if (window.cverseEffects) window.cverseEffects.playCompileSuccess();
    if (window.cverseApp) window.cverseApp.unlockBadge('zero_leaks');
    this.renderHeapAllocator(containerId);
  }

  /* ========================================================================
     7. MODULE 7 LAB: STRUCT MEMORY & PERSISTENT FILE I/O (todos.txt)
     ======================================================================== */
  renderStructFileIO(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const fileContent = this.todoStructs
      .map((t) => `[${t.completed ? 'X' : ' '}] Task #${t.id} (P${t.priority}): ${t.title}`)
      .join('\n');

    if (window.cverseCompiler) {
      window.cverseCompiler.virtualFS['todos.txt'] = fileContent + '\n';
    }

    container.innerHTML = `
      <div class="glass-panel rounded-3xl p-6 lg:p-8 border border-emerald-500/30">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          <div>
            <span class="text-xs font-mono-code uppercase tracking-wider text-emerald-400">Module 7 Capstone Lab</span>
            <h3 class="text-xl lg:text-2xl font-bold text-white mt-0.5">Live <code class="text-cyan-300">typedef struct Task</code> &amp; Persistent <code class="text-emerald-300">FILE *fp</code> Stream</h3>
          </div>
          <span class="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-mono-code">
            Disk Stream: todos.txt (Synced)
          </span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Left: Interactive Struct Array in RAM -->
          <div class="lg:col-span-7 space-y-3">
            <div class="flex items-center justify-between text-xs font-mono-code text-slate-400">
              <span>RAM: Task list[${this.todoStructs.length}] (Click task to toggle ptr-&gt;completed)</span>
              <span>sizeof(Task) = 60B</span>
            </div>
            ${this.todoStructs
              .map(
                (t, idx) => `
              <div onclick="window.cverseVis.toggleTodoStruct(${idx}, '${containerId}')"
                class="cursor-pointer rounded-2xl p-3.5 bg-slate-900/90 border ${
                  t.completed ? 'border-emerald-500/40' : 'border-white/10'
                } hover:border-cyan-400/50 transition flex items-center justify-between gap-3 font-mono-code text-xs">
                <div class="flex items-center gap-3">
                  <span class="w-6 h-6 rounded-lg flex items-center justify-center font-bold ${
                    t.completed ? 'bg-emerald-500 text-slate-950' : 'bg-white/10 text-slate-400'
                  }">${t.completed ? '✓' : ' '}</span>
                  <div>
                    <div class="text-white font-bold">${t.title}</div>
                    <div class="text-[11px] text-slate-400">
                      struct { .id = ${t.id}, .priority = ${t.priority}, .completed = ${t.completed} }
                    </div>
                  </div>
                </div>
                <span class="text-cyan-300 text-[11px]">ptr-&gt;completed</span>
              </div>
            `
              )
              .join('')}

            <!-- Add New Struct Record -->
            <div class="flex items-center gap-2 pt-2">
              <input id="${containerId}-todo-input" type="text" placeholder="Add new struct Task title..."
                class="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-white/15 text-white font-mono-code text-xs focus:outline-none focus:border-emerald-400" />
              <button onclick="window.cverseVis.addTodoStruct('${containerId}')" class="magnetic-btn px-4 py-2 rounded-xl btn-emerald-glow text-slate-950 font-mono-code text-xs font-bold">
                + fprintf() to Disk
              </button>
            </div>
          </div>

          <!-- Right: Persistent Virtual Disk File (todos.txt) -->
          <div class="lg:col-span-5 rounded-2xl p-4 bg-slate-950 border border-emerald-500/30 font-mono-code text-xs flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between text-emerald-400 pb-2 mb-3 border-b border-white/10">
                <span>💾 Virtual Disk: /home/user/todos.txt</span>
                <span>FILE *fp ("w")</span>
              </div>
              <pre class="text-slate-200 whitespace-pre-wrap leading-relaxed">${fileContent}</pre>
            </div>
            <div class="mt-4 pt-3 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Status: fclose(fp) flushed buffer</span>
              <span class="text-emerald-400">${fileContent.length} bytes on disk</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  toggleTodoStruct(idx, containerId) {
    if (this.todoStructs[idx]) {
      this.todoStructs[idx].completed = this.todoStructs[idx].completed ? 0 : 1;
      if (window.cverseEffects) window.cverseEffects.playClick();
      if (window.cverseApp) window.cverseApp.unlockBadge('capstone_architect');
      this.renderStructFileIO(containerId);
    }
  }

  addTodoStruct(containerId) {
    const input = document.getElementById(`${containerId}-todo-input`);
    const title = input && input.value.trim() ? input.value.trim() : 'Optimize Kernel Ring Buffer';
    this.todoStructs.push({
      id: 101 + this.todoStructs.length,
      title,
      priority: 1,
      completed: 1
    });
    if (window.cverseEffects) window.cverseEffects.playCompileSuccess();
    if (window.cverseApp) window.cverseApp.unlockBadge('capstone_architect');
    this.renderStructFileIO(containerId);
  }
}

window.cverseVis = new CVerseVisualizers();
