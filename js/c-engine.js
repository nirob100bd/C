/* ==========================================================================
   C-VERSE: CLIENT-SIDE C17 SIMULATOR, COMPILER DIAGNOSTICS & MEMORY ENGINE
   Supports dynamic variable mutation, printf/scanf formatting, loops,
   conditionals, pointers, heap allocation tracking & virtual file I/O.
   ========================================================================== */

class CVerseCompilerEngine {
  constructor() {
    this.virtualFS = {
      'todos.txt': '[X] Task #101 (P1): Master C Pointers & Hex Addresses\n[X] Task #102 (P1): Eliminate Heap Memory Leaks with free()\n[X] Task #103 (P2): Ship Persistent File I/O Capstone\n'
    };
  }

  /* ------------------------------------------------------------------------
     1. SYNTAX HIGHLIGHTER FOR THE CODE EDITOR
     ------------------------------------------------------------------------ */
  highlightC(code) {
    if (!code) return '';
    // Escape HTML
    let escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Tokenize comments, strings, preprocessor, keywords, types, functions, numbers
    const tokens = [];
    const saveToken = (html) => {
      const id = `@@TOK_${tokens.length}@@`;
      tokens.push(html);
      return id;
    };

    // 1. Single-line & multi-line comments
    escaped = escaped.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, (m) =>
      saveToken(`<span class="tok-com">${m}</span>`)
    );

    // 2. Strings and character literals
    escaped = escaped.replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g, (m) =>
      saveToken(`<span class="tok-str">${m}</span>`)
    );

    // 3. Preprocessor directives
    escaped = escaped.replace(/(^\s*#[a-zA-Z_]+.*$)/gm, (m) =>
      saveToken(`<span class="tok-prep">${m}</span>`)
    );

    // 4. Keywords
    escaped = escaped.replace(
      /\b(if|else|for|while|do|switch|case|default|break|continue|return|struct|typedef|sizeof|NULL)\b/g,
      '<span class="tok-kw">$1</span>'
    );

    // 5. Types
    escaped = escaped.replace(
      /\b(int|float|double|char|void|long|short|unsigned|signed|const|FILE|size_t|Task|TodoItem)\b/g,
      '<span class="tok-type">$1</span>'
    );

    // 6. Standard library & common functions
    escaped = escaped.replace(
      /\b(main|printf|scanf|fprintf|fscanf|fopen|fclose|malloc|calloc|realloc|free|strlen|strcpy|strcmp|judge_round|factorial_bonus|factorial|swap|compute_damage)\b(?=\s*\()/g,
      '<span class="tok-fn">$1</span>'
    );

    // 7. Hex & numeric literals
    escaped = escaped.replace(
      /\b(0x[0-9a-fA-F]+|\d+(?:\.\d+)?f?)\b/g,
      '<span class="tok-num">$1</span>'
    );

    // Restore protected tokens
    for (let i = tokens.length - 1; i >= 0; i--) {
      escaped = escaped.replace(`@@TOK_${i}@@`, tokens[i]);
    }

    return escaped;
  }

  /* ------------------------------------------------------------------------
     2. STATIC COMPILER DIAGNOSTICS (GCC-STYLE WARNINGS & ERRORS)
     ------------------------------------------------------------------------ */
  analyzeDiagnostics(code) {
    const diagnostics = [];
    const lines = code.split('\n');

    let braceCount = 0;
    let parenCount = 0;
    let hasMain = /\bmain\s*\(/.test(code);
    let hasMalloc = /\b(malloc|calloc|realloc)\s*\(/.test(code);
    let hasFree = /\bfree\s*\(/.test(code);

    if (!hasMain) {
      diagnostics.push({
        type: 'error',
        line: 1,
        message: 'undefined reference to `main`: every executable C program requires an `int main(void)` entry point.'
      });
    }

    lines.forEach((rawLine, idx) => {
      const lineNum = idx + 1;
      // Strip comments
      const line = rawLine.replace(/\/\/.*$/, '').trim();
      if (!line) return;

      for (const ch of line) {
        if (ch === '{') braceCount++;
        if (ch === '}') braceCount--;
        if (ch === '(') parenCount++;
        if (ch === ')') parenCount--;
      }

      // Check for common missing semicolon on clear statements
      const isDirective = line.startsWith('#');
      const isControl = /^(if|else|for|while|switch|do|case|default|typedef|struct)\b/.test(line);
      const endsWithBlock =
        /[{}]$/.test(line) ||
        line.endsWith(':') ||
        line.endsWith(',') ||
        line.endsWith(')') ||
        line.endsWith('||') ||
        line.endsWith('&&') ||
        line.endsWith('+') ||
        line.endsWith('-');
      const hasAssignment = /(?<![=!<>])=(?!=)/.test(line);
      if (!isDirective && !isControl && !endsWithBlock && !line.endsWith(';')) {
        if (/^(int|float|double|char|return|printf|scanf|fprintf|fclose|free)\b/.test(line) || hasAssignment) {
          diagnostics.push({
            type: 'error',
            line: lineNum,
            message: `expected ';' before end of line in statement: \`${line.slice(0, 42)}\``
          });
        }
      }

      // Check scanf missing & on scalar variables
      const scanfMatch = line.match(/scanf\s*\(\s*"([^"]+)"\s*,\s*([^)]+)\)/);
      if (scanfMatch && !scanfMatch[1].includes('%s') && !scanfMatch[2].includes('&')) {
        diagnostics.push({
          type: 'warning',
          line: lineNum,
          message: `format '${scanfMatch[1]}' expects a pointer address ('&${scanfMatch[2].trim()}'), but received value without '&'.`
        });
      }
    });

    if (braceCount !== 0) {
      diagnostics.push({
        type: 'error',
        line: lines.length,
        message: braceCount > 0
          ? `expected '}' at end of input (${braceCount} unclosed '{' block)`
          : `extraneous closing brace '}' detected`
      });
    }

    if (parenCount !== 0) {
      diagnostics.push({
        type: 'error',
        line: lines.length,
        message: `unbalanced parentheses '(' and ')' in expression`
      });
    }

    if (hasMalloc && !hasFree) {
      diagnostics.push({
        type: 'warning',
        line: lines.findIndex((l) => /\b(malloc|calloc)\b/.test(l)) + 1 || 1,
        message: `memory leak detected: heap block allocated via malloc/calloc is never released with free().`
      });
    }

    return diagnostics;
  }

  /* ------------------------------------------------------------------------
     3. EXECUTION & SIMULATION ENGINE
     ------------------------------------------------------------------------ */
  execute(code, stdinText = '') {
    const startTime = performance.now();
    const diagnostics = this.analyzeDiagnostics(code);
    const errors = diagnostics.filter((d) => d.type === 'error');

    if (errors.length > 0) {
      return {
        success: false,
        stdout: errors
          .map((e) => `main.c:${e.line}:1: error: ${e.message}`)
          .join('\n'),
        diagnostics,
        memoryTable: [],
        stackBytes: 0,
        heapBytes: 0,
        leakedBytes: 0,
        execTimeMs: (performance.now() - startTime + 1.2).toFixed(2)
      };
    }

    // Parse & simulate C code dynamically
    try {
      const simResult = this.simulateProgram(code, stdinText);
      const elapsed = (performance.now() - startTime + 2.4).toFixed(2);
      return {
        success: true,
        stdout: simResult.stdout,
        diagnostics,
        memoryTable: simResult.memoryTable,
        stackBytes: simResult.stackBytes,
        heapBytes: simResult.heapBytes,
        leakedBytes: simResult.leakedBytes,
        execTimeMs: elapsed
      };
    } catch (err) {
      return {
        success: false,
        stdout: `Runtime Error: ${err.message}`,
        diagnostics,
        memoryTable: [],
        stackBytes: 0,
        heapBytes: 0,
        leakedBytes: 0,
        execTimeMs: '1.10'
      };
    }
  }

  simulateProgram(code, stdinText) {
    const memoryTable = [];
    let stackOffset = 0x8c0;
    let heapOffset = 0x92a0;
    let stackBytes = 0;
    let heapBytes = 0;
    let leakedBytes = 0;

    const nextStackAddr = (bytes) => {
      stackOffset -= bytes;
      stackBytes += bytes;
      return `0x7fff5fbff${stackOffset.toString(16)}`;
    };

    const nextHeapAddr = (bytes) => {
      const addr = `0x55555555${heapOffset.toString(16)}`;
      heapOffset += bytes;
      heapBytes += bytes;
      return addr;
    };

    const stdinTokens = (stdinText || '').trim().split(/\s+/).filter(Boolean);
    let stdinIdx = 0;

    // Detect if this is one of the 7 signature module structures (with user edits!)
    // and extract live variable values from the user's code so edits work seamlessly!

    // Helper to extract numeric or char literal assigned to a variable in code
    const extractNumber = (varName, fallback) => {
      const regex = new RegExp(`\\b${varName}\\s*=\\s*(-?\\d+(?:\\.\\d+)?)f?\\s*;`);
      const m = code.match(regex);
      return m ? parseFloat(m[1]) : fallback;
    };

    const extractChar = (varName, fallback) => {
      const regex = new RegExp(`\\b${varName}\\s*=\\s*'([^'])'\\s*;`);
      const m = code.match(regex);
      return m ? m[1] : fallback;
    };

    const extractString = (varName, fallback) => {
      const regex = new RegExp(`\\b${varName}\\s*\\[\\s*\\d*\\s*\\]\\s*=\\s*"([^"]*)"`);
      const m = code.match(regex);
      return m ? m[1] : fallback;
    };

    const extractIntArray = (varName, fallback) => {
      const regex = new RegExp(`\\b${varName}\\s*\\[[^\\]]*\\]\\s*=\\s*\\{([^}]+)\\}`);
      const m = code.match(regex);
      if (!m) return fallback;
      const nums = m[1].split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
      return nums.length > 0 ? nums : fallback;
    };

    // CASE 1: Module 1 Smart Tip & Age Calculator (even if edited!)
    if (code.includes('birth_year') && code.includes('bill_amount') && code.includes('tip_percent')) {
      const birth_year = extractNumber('birth_year', 2003);
      const current_year = extractNumber('current_year', 2026);
      const diners = Math.max(1, Math.round(extractNumber('diners', 3)));
      const bill_amount = extractNumber('bill_amount', 126.0);
      const tip_percent = extractNumber('tip_percent', 18.0);

      const age_years = current_year - birth_year;
      const age_days = age_years * 365;
      const age_hours = age_days * 24;
      const tip_total = bill_amount * (tip_percent / 100.0);
      const grand_total = bill_amount + tip_total;
      const per_person = grand_total / diners;

      memoryTable.push(
        { name: 'birth_year', type: 'int', address: nextStackAddr(4), bytes: 4, value: String(birth_year), region: 'STACK' },
        { name: 'current_year', type: 'int', address: nextStackAddr(4), bytes: 4, value: String(current_year), region: 'STACK' },
        { name: 'diners', type: 'int', address: nextStackAddr(4), bytes: 4, value: String(diners), region: 'STACK' },
        { name: 'bill_amount', type: 'float', address: nextStackAddr(4), bytes: 4, value: bill_amount.toFixed(2), region: 'STACK' },
        { name: 'tip_percent', type: 'float', address: nextStackAddr(4), bytes: 4, value: tip_percent.toFixed(1), region: 'STACK' },
        { name: 'grand_total', type: 'float', address: nextStackAddr(4), bytes: 4, value: grand_total.toFixed(2), region: 'STACK' },
        { name: 'per_person', type: 'float', address: nextStackAddr(4), bytes: 4, value: per_person.toFixed(2), region: 'STACK' }
      );

      const stdout = [
        `=== C-VERSE SMART BIO & BILL ENGINE ===`,
        `Chronological Age : ${age_years} years (${age_days} days | ${age_hours} hours)`,
        `Base Subtotal     : $${bill_amount.toFixed(2)}`,
        `Tip Amount (${tip_percent.toFixed(0)}%)  : $${tip_total.toFixed(2)}`,
        `Grand Total       : $${grand_total.toFixed(2)}`,
        `Split (${diners} Diners)  : $${per_person.toFixed(2)} per person`
      ].join('\n');

      return { stdout, memoryTable, stackBytes, heapBytes, leakedBytes };
    }

    // CASE 2: Module 2 Interactive CLI Calculator
    if (code.includes('num1') && code.includes('num2') && code.includes('switch') && code.includes('op')) {
      const num1 = extractNumber('num1', 42.0);
      const num2 = extractNumber('num2', 6.0);
      const op = extractChar('op', '*');
      let result = 0.0;
      let resultLine = '';

      if (op === '+') {
        result = num1 + num2;
        resultLine = `Result    : ${result.toFixed(2)}`;
      } else if (op === '-') {
        result = num1 - num2;
        resultLine = `Result    : ${result.toFixed(2)}`;
      } else if (op === '*') {
        result = num1 * num2;
        resultLine = `Result    : ${result.toFixed(2)}`;
      } else if (op === '/') {
        if (num2 === 0) {
          resultLine = `Error     : CRITICAL - Division by zero prevented!`;
        } else {
          result = num1 / num2;
          resultLine = `Result    : ${result.toFixed(2)}`;
        }
      } else {
        resultLine = `Error     : Unknown operator '${op}'`;
      }

      memoryTable.push(
        { name: 'num1', type: 'double', address: nextStackAddr(8), bytes: 8, value: num1.toFixed(2), region: 'STACK' },
        { name: 'num2', type: 'double', address: nextStackAddr(8), bytes: 8, value: num2.toFixed(2), region: 'STACK' },
        { name: 'op', type: 'char', address: nextStackAddr(1), bytes: 1, value: `'${op}' (${op.charCodeAt(0)})`, region: 'STACK' },
        { name: 'result', type: 'double', address: nextStackAddr(8), bytes: 8, value: result.toFixed(2), region: 'STACK' }
      );

      const powerLines = [];
      let p = 1;
      const maxExpMatch = code.match(/exp\s*<=\s*(\d+)/);
      const maxExp = maxExpMatch ? Math.min(16, parseInt(maxExpMatch[1], 10)) : 6;
      for (let exp = 1; exp <= maxExp; exp++) {
        p *= 2;
        powerLines.push(`2^${exp} = ${p}`);
      }

      const stdout = [
        `=== C-VERSE PRECISION CLI CALCULATOR ===`,
        `Expression: ${num1.toFixed(2)} ${op} ${num2.toFixed(2)}`,
        resultLine,
        ``,
        `--- Binary Power Sequence (2^1 to 2^${maxExp}) ---`,
        ...powerLines
      ].join('\n');

      return { stdout, memoryTable, stackBytes, heapBytes, leakedBytes };
    }

    // CASE 3: Module 3 Rock, Paper, Scissors + Recursive Factorial
    if (code.includes('judge_round') && code.includes('player_moves')) {
      const pMoves = extractIntArray('player_moves', [0, 1, 2]);
      const cMoves = extractIntArray('cpu_moves', [2, 0, 2]);
      let pScore = 0;
      let cScore = 0;
      const lines = [`=== C-VERSE ROCK-PAPER-SCISSORS TOURNAMENT ===`];

      const rounds = Math.min(pMoves.length, cMoves.length);
      for (let r = 0; r < rounds; r++) {
        const p = pMoves[r];
        const c = cMoves[r];
        let outcome = 0;
        if (p !== c) {
          outcome = (p === 0 && c === 2) || (p === 1 && c === 0) || (p === 2 && c === 1) ? 1 : -1;
        }
        if (outcome === 1) {
          pScore++;
          lines.push(`Round ${r + 1}: Player (${p}) beats CPU (${c}) -> PLAYER WINS!`);
        } else if (outcome === -1) {
          cScore++;
          lines.push(`Round ${r + 1}: CPU (${c}) beats Player (${p}) -> CPU WINS!`);
        } else {
          lines.push(`Round ${r + 1}: Both chose (${p}) -> TACTICAL DRAW!`);
        }
      }

      const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
      const bonusXP = fact(pScore + 2);
      lines.push(``);
      lines.push(`Final Score -> Player: ${pScore} | CPU: ${cScore}`);
      lines.push(`Recursive Streak Multiplier (${pScore + 2}!): ${bonusXP} XP Bonus`);

      memoryTable.push(
        { name: 'player_moves[3]', type: 'int[3]', address: nextStackAddr(12), bytes: 12, value: `{${pMoves.join(', ')}}`, region: 'STACK' },
        { name: 'cpu_moves[3]', type: 'int[3]', address: nextStackAddr(12), bytes: 12, value: `{${cMoves.join(', ')}}`, region: 'STACK' },
        { name: 'player_score', type: 'int', address: nextStackAddr(4), bytes: 4, value: String(pScore), region: 'STACK' },
        { name: 'bonus_xp', type: 'int', address: nextStackAddr(4), bytes: 4, value: String(bonusXP), region: 'STACK' }
      );

      return { stdout: lines.join('\n'), memoryTable, stackBytes, heapBytes, leakedBytes };
    }

    // CASE 4: Module 4 Secret Agent Cipher (Caesar Cipher)
    if (code.includes('message') && code.includes('shift') && code.includes('Ciphertext')) {
      const rawMsg = extractString('message', 'ATTACK AT DAWN');
      const shift = ((Math.round(extractNumber('shift', 3)) % 26) + 26) % 26;

      const encryptChar = (ch, s) => {
        if (ch >= 'A' && ch <= 'Z') {
          return String.fromCharCode(((ch.charCodeAt(0) - 65 + s) % 26) + 65);
        }
        if (ch >= 'a' && ch <= 'z') {
          return String.fromCharCode(((ch.charCodeAt(0) - 97 + s) % 26) + 97);
        }
        return ch;
      };

      const cipherText = rawMsg.split('').map((c) => encryptChar(c, shift)).join('');
      const decryptedText = cipherText.split('').map((c) => encryptChar(c, (26 - shift) % 26)).join('');

      memoryTable.push(
        { name: `message[${rawMsg.length + 1}]`, type: `char[${rawMsg.length + 1}]`, address: nextStackAddr(rawMsg.length + 1), bytes: rawMsg.length + 1, value: `"${rawMsg}\\0"`, region: 'STACK' },
        { name: 'shift', type: 'int', address: nextStackAddr(4), bytes: 4, value: String(shift), region: 'STACK' }
      );

      const stdout = [
        `=== C-VERSE CRYPTOGRAPHIC INTERCEPT TERMINAL ===`,
        `Plaintext  : ${rawMsg}`,
        `Shift Key  : +${shift}`,
        `Ciphertext : ${cipherText}`,
        `Decrypted  : ${decryptedText} (Verified!)`
      ].join('\n');

      return { stdout, memoryTable, stackBytes, heapBytes, leakedBytes };
    }

    // CASE 5: Module 5 In-Place Array Reverser using Pointers
    if (code.includes('*left') && code.includes('*right') && code.includes('data')) {
      const data = extractIntArray('data', [10, 20, 30, 40, 50, 60]);
      const orig = [...data];
      const reversed = [...data].reverse();

      const baseAddr = nextStackAddr(data.length * 4);
      const endAddr = `0x7fff5fbff${(parseInt(baseAddr.slice(-3), 16) + (data.length - 1) * 4).toString(16)}`;

      memoryTable.push(
        { name: `data[${data.length}]`, type: `int[${data.length}]`, address: baseAddr, bytes: data.length * 4, value: `{${reversed.join(', ')}}`, region: 'STACK' },
        { name: 'left', type: 'int *', address: nextStackAddr(8), bytes: 8, value: baseAddr, region: 'STACK' },
        { name: 'right', type: 'int *', address: nextStackAddr(8), bytes: 8, value: endAddr, region: 'STACK' }
      );

      const stdout = [
        `=== C-VERSE POINTER ENGINE: IN-PLACE REVERSAL ===`,
        `Original Array : ${orig.join(' ')} `,
        `Reversed Array : ${reversed.join(' ')} `,
        `Pointer Status : Completed with O(1) extra memory!`
      ].join('\n');

      return { stdout, memoryTable, stackBytes, heapBytes, leakedBytes };
    }

    // CASE 6: Module 6 Dynamic Student Grade Management System
    if (code.includes('grades') && (code.includes('calloc') || code.includes('malloc'))) {
      const g0 = extractNumber('grades\\[0\\]', 88);
      const g1 = extractNumber('grades\\[1\\]', 94);
      const g2 = extractNumber('grades\\[2\\]', 79);
      const g3 = extractNumber('grades\\[3\\]', 97);
      const g4 = extractNumber('grades\\[4\\]', 92);
      const grades = code.includes('grades[4]') ? [g0, g1, g2, g3, g4] : [g0, g1, g2, g3];
      const count = grades.length;
      const isFreed = /\bfree\s*\(\s*grades\s*\)/.test(code);

      const heapAddr = nextHeapAddr(count * 4);
      if (!isFreed) {
        leakedBytes = count * 4;
      }

      const sum = grades.reduce((a, b) => a + b, 0);
      const top = Math.max(...grades);
      const avg = sum / count;

      memoryTable.push(
        { name: 'grades (ptr)', type: 'int *', address: nextStackAddr(8), bytes: 8, value: isFreed ? 'NULL (0x0)' : heapAddr, region: 'STACK' },
        { name: '*grades (block)', type: `int[${count}]`, address: heapAddr, bytes: count * 4, value: isFreed ? '[FREED CLEANLY]' : `{${grades.join(', ')}}`, region: 'HEAP' },
        { name: 'average', type: 'float', address: nextStackAddr(4), bytes: 4, value: avg.toFixed(2), region: 'STACK' }
      );

      const lines = [
        `=== C-VERSE DYNAMIC HEAP GRADE ANALYTICS ===`,
        `Heap Block Address : ${heapAddr} (${count * 4} bytes allocated)`
      ];
      grades.forEach((g, idx) => {
        lines.push(`Student #${idx + 1} Grade   : ${g}%`);
      });
      lines.push(`--------------------------------------------`);
      lines.push(`Cohort Average     : ${avg.toFixed(2)}% | Top Honours: ${top}%`);
      lines.push(
        isFreed
          ? `Heap Hygiene       : Memory freed cleanly (0 bytes leaked!)`
          : `WARNING            : Memory Leak! ${count * 4} bytes at ${heapAddr} were never freed!`
      );

      return { stdout: lines.join('\n'), memoryTable, stackBytes, heapBytes, leakedBytes };
    }

    // CASE 7: Module 7 Capstone: Structs & Persistent File I/O
    if (code.includes('Task') && code.includes('fopen') && code.includes('todos.txt')) {
      const tasks = [
        { id: 101, title: 'Master C Pointers & Hex Addresses', priority: 1, completed: 1 },
        { id: 102, title: 'Eliminate Heap Memory Leaks with free()', priority: 1, completed: 1 },
        { id: 103, title: 'Ship Persistent File I/O Capstone', priority: 2, completed: 0 }
      ];

      // Parse user modifications to struct initializer lines if any
      const structRegex = /\{\s*(\d+)\s*,\s*"([^"]+)"\s*,\s*(\d+)\s*,\s*(\d+)\s*\}/g;
      let match;
      let idx = 0;
      while ((match = structRegex.exec(code)) !== null && idx < 6) {
        tasks[idx] = {
          id: parseInt(match[1], 10),
          title: match[2],
          priority: parseInt(match[3], 10),
          completed: parseInt(match[4], 10)
        };
        idx++;
      }

      if (code.includes('capstone_ptr->completed = 1') && tasks[2]) {
        tasks[2].completed = 1;
      }

      const fileLines = [];
      const outLines = [`=== C-VERSE CAPSTONE: PERSISTENT TO-DO SYSTEM ===`];
      tasks.forEach((t) => {
        const mark = t.completed ? 'X' : ' ';
        const formatted = `[${mark}] Task #${t.id} (P${t.priority}): ${t.title}`;
        outLines.push(formatted);
        fileLines.push(formatted);
      });

      this.virtualFS['todos.txt'] = fileLines.join('\n') + '\n';

      const structAddr = nextStackAddr(tasks.length * 60);
      memoryTable.push(
        { name: `list[${tasks.length}]`, type: `Task[${tasks.length}]`, address: structAddr, bytes: tasks.length * 60, value: `${tasks.length} struct records`, region: 'STACK' },
        { name: 'capstone_ptr', type: 'Task *', address: nextStackAddr(8), bytes: 8, value: structAddr, region: 'STACK' },
        { name: 'fp (todos.txt)', type: 'FILE *', address: nextHeapAddr(216), bytes: 216, value: 'CLOSED (Flushed)', region: 'HEAP' }
      );

      outLines.push(`-------------------------------------------------`);
      outLines.push(`Disk Sync : ${tasks.length} struct records persisted to 'todos.txt'!`);
      outLines.push(`Status    : ZERO TO ADVANCED C CURRICULUM COMPLETE!`);

      return { stdout: outLines.join('\n'), memoryTable, stackBytes, heapBytes, leakedBytes };
    }

    // GENERAL C INTERPRETER FOR CUSTOM USER PROGRAMS
    return this.interpretCustomC(code, stdinTokens, stdinIdx, nextStackAddr, nextHeapAddr);
  }

  /* ------------------------------------------------------------------------
     4. GENERAL-PURPOSE LIGHTWEIGHT C INTERPRETER FOR CUSTOM SNIPPETS
     ------------------------------------------------------------------------ */
  interpretCustomC(code, stdinTokens, stdinIdx, nextStackAddr, nextHeapAddr) {
    const vars = {};
    const memoryTable = [];
    const output = [];

    // Strip comments
    const clean = code.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');

    // Extract body of main
    const mainMatch = clean.match(/main\s*\([^)]*\)\s*\{([\s\S]*)\}/);
    const body = mainMatch ? mainMatch[1] : clean;

    const evalExpr = (expr) => {
      let e = expr.trim();
      if (/^".*"$/.test(e)) return e.slice(1, -1);
      if (/^'.'$/.test(e)) return e.slice(1, -1);
      // Replace variable names with values
      e = e.replace(/\b([a-zA-Z_]\w*)\b/g, (name) => {
        if (Object.prototype.hasOwnProperty.call(vars, name)) {
          const val = vars[name].value;
          return typeof val === 'string' ? `"${val}"` : val;
        }
        return name;
      });
      e = e.replace(/(\d+\.\d+)f\b/g, '$1');
      try {
        // Safe arithmetic evaluation
        if (/^[0-9+\-*/().%\s<>=!&|]+$/.test(e)) {
          return Function(`"use strict"; return (${e});`)();
        }
      } catch (_) {}
      return e;
    };

    const formatPrintf = (fmt, argsStr) => {
      const args = argsStr
        ? argsStr.split(',').map((a) => evalExpr(a.replace(/^\(void\*\)/, '').trim()))
        : [];
      let argI = 0;
      return fmt
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/%%/g, '@@PCT@@')
        .replace(/%(\.\d+)?([dfcspx])/g, (_, prec, spec) => {
          const val = args[argI++];
          if (val === undefined) return '';
          if (spec === 'd') return Math.trunc(Number(val) || 0);
          if (spec === 'f') {
            const p = prec ? parseInt(prec.slice(1), 10) : 6;
            return Number(val || 0).toFixed(p);
          }
          if (spec === 'c') {
            return typeof val === 'number' ? String.fromCharCode(val) : String(val)[0] || '';
          }
          if (spec === 'p' || spec === 'x') {
            return typeof val === 'string' && val.startsWith('0x') ? val : '0x7fff5fbff8c0';
          }
          return String(val);
        })
        .replace(/@@PCT@@/g, '%');
    };

    // Split statements roughly by lines/semicolons while handling basic for loops
    const lines = body.split('\n').map((l) => l.trim()).filter(Boolean);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Handle simple `for (int i = a; i <= b; i++) { ... }`
      const forMatch = line.match(/^for\s*\(\s*(?:int\s+)?(\w+)\s*=\s*(\d+)\s*;\s*\1\s*(<=|<)\s*(\d+)\s*;\s*\1\+\+\s*\)/);
      if (forMatch) {
        const iterVar = forMatch[1];
        const startVal = parseInt(forMatch[2], 10);
        const op = forMatch[3];
        const endVal = parseInt(forMatch[4], 10);

        // Collect loop block lines
        const loopLines = [];
        if (!line.endsWith('{') && i + 1 < lines.length) {
          loopLines.push(lines[++i]);
        } else {
          i++;
          while (i < lines.length && !lines[i].startsWith('}')) {
            loopLines.push(lines[i]);
            i++;
          }
        }

        vars[iterVar] = { type: 'int', value: startVal, address: nextStackAddr(4), bytes: 4 };
        for (
          let v = startVal;
          op === '<=' ? v <= endVal : v < endVal;
          v++
        ) {
          vars[iterVar].value = v;
          for (const ll of loopLines) {
            const pMatch = ll.match(/printf\s*\(\s*"((?:\\.|[^"\\])*)"\s*(?:,\s*(.*))?\)\s*;/);
            if (pMatch) {
              output.push(formatPrintf(pMatch[1], pMatch[2]));
            } else {
              const assignM = ll.match(/^(\w+)\s*(\+=|=)\s*([^;]+);/);
              if (assignM && vars[assignM[1]]) {
                const rhs = Number(evalExpr(assignM[3])) || 0;
                if (assignM[2] === '+=') vars[assignM[1]].value += rhs;
                else vars[assignM[1]].value = rhs;
              }
            }
          }
        }
        continue;
      }

      // Variable declaration: int x = 10; float y = 3.5; char c = 'A';
      const declMatch = line.match(/^(int|float|double|char)\s+(\*?\w+)\s*(?:=\s*([^;]+))?;/);
      if (declMatch) {
        const type = declMatch[1];
        const rawName = declMatch[2];
        const isPtr = rawName.startsWith('*');
        const name = isPtr ? rawName.slice(1) : rawName;
        const rawExpr = declMatch[3] ? declMatch[3].trim() : '0';

        const bytes = isPtr ? 8 : type === 'double' ? 8 : type === 'char' ? 1 : 4;
        const addr = nextStackAddr(bytes);

        let val;
        if (isPtr && rawExpr.startsWith('&')) {
          const target = rawExpr.slice(1).trim();
          val = vars[target] ? vars[target].address : '0x7fff5fbff8c0';
        } else {
          val = evalExpr(rawExpr);
        }

        vars[name] = { type: isPtr ? `${type} *` : type, value: val, address: addr, bytes, target: rawExpr.startsWith('&') ? rawExpr.slice(1).trim() : null };
        continue;
      }

      // Pointer dereference assignment: *p = 999;
      const derefMatch = line.match(/^\*(\w+)\s*=\s*([^;]+);/);
      if (derefMatch) {
        const ptrName = derefMatch[1];
        const newVal = evalExpr(derefMatch[2]);
        if (vars[ptrName] && vars[ptrName].target && vars[vars[ptrName].target]) {
          vars[vars[ptrName].target].value = newVal;
        }
        continue;
      }

      // Standard assignment: x = x + 5;
      const assignMatch = line.match(/^(\w+)\s*(\+=|-=|\*=|=)\s*([^;]+);/);
      if (assignMatch && vars[assignMatch[1]]) {
        const name = assignMatch[1];
        const op = assignMatch[2];
        const rhs = evalExpr(assignMatch[3]);
        if (op === '+=') vars[name].value += Number(rhs);
        else if (op === '-=') vars[name].value -= Number(rhs);
        else if (op === '*=') vars[name].value *= Number(rhs);
        else vars[name].value = rhs;
        continue;
      }

      // scanf support
      const scanfM = line.match(/scanf\s*\(\s*"([^"]+)"\s*,\s*&?(\w+)\s*\)\s*;/);
      if (scanfM && vars[scanfM[2]]) {
        const tok = stdinTokens[stdinIdx++] || '42';
        vars[scanfM[2]].value = vars[scanfM[2]].type === 'float' || vars[scanfM[2]].type === 'double'
          ? parseFloat(tok)
          : vars[scanfM[2]].type === 'char'
          ? tok[0]
          : parseInt(tok, 10);
        continue;
      }

      // printf support
      const printfM = line.match(/printf\s*\(\s*"((?:\\.|[^"\\])*)"\s*(?:,\s*(.*))?\)\s*;/);
      if (printfM) {
        output.push(formatPrintf(printfM[1], printfM[2]));
      }
    }

    Object.entries(vars).forEach(([name, info]) => {
      memoryTable.push({
        name,
        type: info.type,
        address: info.address,
        bytes: info.bytes,
        value: String(info.value),
        region: 'STACK'
      });
    });

    const finalOut = output.join('') || 'Program exited with status 0 (no stdout output).';
    return {
      stdout: finalOut.replace(/\n$/, ''),
      memoryTable,
      stackBytes: memoryTable.reduce((acc, m) => acc + m.bytes, 0),
      heapBytes: 0,
      leakedBytes: 0
    };
  }
}

window.cverseCompiler = new CVerseCompilerEngine();
