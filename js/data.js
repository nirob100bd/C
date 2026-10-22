/* ==========================================================================
   C-VERSE: CURRICULUM, GAMIFICATION & CODE TEMPLATES DATA
   Modules 1 to 7 (Zero to Advanced C Programming)
   ========================================================================== */

window.CVERSE_DATA = {
  ranks: [
    { id: 'rank_1', title: 'Script Kiddie', minXP: 0, color: '#94a3b8', badge: '🌱', desc: 'Taking your first steps into bare-metal computing.' },
    { id: 'rank_2', title: 'Syntax Apprentice', minXP: 150, color: '#38bdf8', badge: '⚡', desc: 'Commanding variables, format specifiers, and standard I/O.' },
    { id: 'rank_3', title: 'Control Flow Tactician', minXP: 350, color: '#10b981', badge: '🧭', desc: 'Bending execution loops and conditional branches to your will.' },
    { id: 'rank_4', title: 'Stack Navigator', minXP: 600, color: '#a855f7', badge: '🥞', desc: 'Orchestrating function frames, recursion, and contiguous arrays.' },
    { id: 'rank_5', title: 'Pointer Sovereign', minXP: 900, color: '#06b6d4', badge: '🎯', desc: 'Direct mastery over raw hexadecimal RAM addresses and dereferencing.' },
    { id: 'rank_6', title: 'Heap Architect', minXP: 1250, color: '#f59e0b', badge: '🏗️', desc: 'Zero-leak dynamic memory allocation across the system heap.' },
    { id: 'rank_7', title: 'Kernel Wizard', minXP: 1600, color: '#ec4899', badge: '👑', desc: 'Supreme architect of C structs, persistent file I/O, and low-level systems.' }
  ],

  badges: [
    { id: 'first_compile', title: 'Hello, Bare Metal', desc: 'Executed your first C program in the C-Verse IDE Playground.', icon: '🚀', xp: 50 },
    { id: 'eli5_explorer', title: 'Analogy Alchemist', desc: 'Toggled "Explain Like I\'m 5 (ELI5)" mode to see the big picture.', icon: '🧠', xp: 40 },
    { id: 'mod1_master', title: 'Warehouse Foreman', desc: 'Completed Module 1: Awakening & The Smart Tip Calculator.', icon: '📦', xp: 100 },
    { id: 'vault_breaker', title: 'Vault Breaker', desc: 'Cracked the 4-digit Secret Vault code in 5 tries or fewer!', icon: '🔓', xp: 150 },
    { id: 'mod2_master', title: 'Flow State Master', desc: 'Completed Module 2: Logic, Loops & Interactive CLI Calculator.', icon: '🌊', xp: 100 },
    { id: 'stack_master', title: 'Recursion Weaver', desc: 'Completed Module 3 & mastered the Call Stack Visualizer.', icon: '🌀', xp: 120 },
    { id: 'cipher_ghost', title: 'Cipher Ghost', desc: 'Completed Module 4 & encrypted classified strings with Caesar Cipher.', icon: '🕵️', xp: 120 },
    { id: 'pointer_unlocked', title: 'The Master Key', desc: 'Manipulated live memory addresses in the Pointer Visualizer.', icon: '🔑', xp: 150 },
    { id: 'mod5_master', title: 'Pointer Sovereign', desc: 'Completed Module 5 & reversed an array in-place using pointers.', icon: '🎯', xp: 150 },
    { id: 'zero_leaks', title: 'Zero Memory Leaks', desc: 'Allocated and cleanly freed Heap memory in Module 6 without leaking a byte.', icon: '🛡️', xp: 150 },
    { id: 'capstone_architect', title: 'Systems Architect', desc: 'Built the Module 7 Persistent File I/O To-Do Capstone App.', icon: '🏛️', xp: 200 },
    { id: 'kernel_wizard', title: 'Kernel Wizard', desc: 'Completed all 7 C-Verse Modules and achieved supreme mastery.', icon: '👑', xp: 300 }
  ],

  modules: [
    {
      id: 1,
      slug: 'awakening',
      code: 'MOD_01',
      title: 'Awakening',
      subtitle: 'Basics, Variables & Standard I/O',
      accent: 'emerald',
      xpReward: 150,
      readTime: '12 min',
      unlockedByDefault: true,
      heroQuote: 'Before Python, before JavaScript, before operating systems had names—there was C. Every byte is yours to command.',
      concepts: [
        {
          title: 'What is C & The Compilation Pipeline',
          badge: '0x01 • Architecture',
          csTheory: 'C is a statically-typed, compiled systems language created by Dennis Ritchie at Bell Labs (1972). Unlike interpreted languages that rely on heavy virtual machines, your C source code (.c) passes through four stages—Preprocessor, Compiler, Assembler, and Linker—to become native machine instructions that execute directly on CPU silicon.',
          eli5Analogy: 'Imagine writing a recipe. Python hires a live translator to read your recipe line-by-line to the chef while cooking (slow!). C translates your entire recipe book into lightning-fast robot brain signals BEFORE the kitchen even opens.',
          codeSnippet: `#include <stdio.h>\n\nint main(void) {\n    printf("System online. Welcome to C-Verse!\\n");\n    return 0; // 0 tells the OS: "Zero errors!"\n}`
        },
        {
          title: 'Variables: Typed Memory Containers',
          badge: '0x02 • RAM Layout',
          csTheory: 'In C, every variable must declare its exact data type before use so the compiler knows how many bytes of RAM to reserve on the stack: `int` (4 bytes, 32-bit signed integer), `float` (4 bytes, IEEE-754 single precision), `double` (8 bytes), and `char` (1 byte, ASCII integer 0–127).',
          eli5Analogy: 'Variables are labeled storage boxes in a high-tech automated warehouse. An `int` is a medium sturdy crate for whole numbers (like 42), a `float` is a liquid tank for decimals (like 19.99), and a `char` is a tiny jewelry box that holds exactly one letter (like \'A\').',
          codeSnippet: `int age = 21;          // 4 bytes @ 0x7fff5fbff8c0\nfloat bill = 48.50f;   // 4 bytes @ 0x7fff5fbff8bc\nchar grade = 'A';      // 1 byte  @ 0x7fff5fbff8bb (ASCII 65)`
        },
        {
          title: 'printf, scanf & Format Specifiers',
          badge: '0x03 • Standard I/O',
          csTheory: 'Standard I/O (`<stdio.h>`) uses format specifiers to interpret raw binary bits correctly: `%d` for `int`, `%f` (or `%.2f`) for `float`, and `%c` for `char`. Notice that `scanf` requires the `&` (address-of) operator so it knows which exact memory box to deposit user input into!',
          eli5Analogy: 'Format specifiers (`%d`, `%f`, `%c`) are customs declarations! When `printf` ships data to your screen, `%d` says "open this parcel as a whole number." When `scanf` receives a delivery from the keyboard, `&age` gives the courier the exact GPS coordinates of your `age` box!',
          codeSnippet: `int birth_year = 2004;\nfloat tip_pct = 18.5f;\nprintf("Born: %d | Tip: %.1f%%\\n", birth_year, tip_pct);\n// scanf("%d", &birth_year); // & gives the box's RAM address!`
        }
      ],
      eli5Summary: {
        title: 'The High-Tech Robotic Warehouse',
        analogy: 'Think of your computer\'s RAM as a massive Amazon fulfillment warehouse with billions of numbered shelves. When you write `int score = 100;`, you tell the warehouse robot: "Reserve a 4-slot crate, slap the label `score` on the front, and place the number `100` inside!"',
        icon: '📦'
      },
      visualizerType: 'warehouse_variables',
      project: {
        title: 'The Smart Tip & Age Calculator',
        description: 'Build a dual-purpose utility that computes dine-in restaurant tip splits with precision formatting (`%.2f`) and calculates chronological age metrics in years, days, and hours.',
        starterCode: `#include <stdio.h>

int main(void) {
    // === MODULE 1 PROJECT: SMART TIP & AGE CALCULATOR ===
    int birth_year = 2003;
    int current_year = 2026;
    int diners = 3;
    float bill_amount = 126.00f;
    float tip_percent = 18.0f;

    // 1. Calculate Age Metrics
    int age_years = current_year - birth_year;
    int age_days = age_years * 365;
    int age_hours = age_days * 24;

    // 2. Calculate Smart Tip & Per-Person Split
    float tip_total = bill_amount * (tip_percent / 100.0f);
    float grand_total = bill_amount + tip_total;
    float per_person = grand_total / diners;

    printf("=== C-VERSE SMART BIO & BILL ENGINE ===\\n");
    printf("Chronological Age : %d years (%d days | %d hours)\\n", age_years, age_days, age_hours);
    printf("Base Subtotal     : $%.2f\\n", bill_amount);
    printf("Tip Amount (%.0f%%)  : $%.2f\\n", tip_percent, tip_total);
    printf("Grand Total       : $%.2f\\n", grand_total);
    printf("Split (%d Diners)  : $%.2f per person\\n", diners, per_person);

    return 0;
}`,
        defaultStdin: '2003 126.00 18 3'
      },
      quiz: [
        {
          q: 'Why does `scanf("%d", &age)` require the `&` symbol before the variable name?',
          options: [
            'It converts the integer into a floating-point number.',
            'It provides the exact memory address of `age` so `scanf` can write directly into that RAM location.',
            'It tells the compiler that `age` is a constant.',
            'It prints the value of `age` to the terminal.'
          ],
          correct: 1,
          explanation: '`&age` evaluates to the memory address where `age` lives in RAM, allowing `scanf()` to deposit user input directly into that box.'
        },
        {
          q: 'How many bytes of memory does a standard 32-bit `int` occupy vs a `char` in C?',
          options: [
            'int = 8 bytes, char = 4 bytes',
            'int = 4 bytes, char = 1 byte',
            'int = 2 bytes, char = 2 bytes',
            'They both dynamically resize depending on the number stored.'
          ],
          correct: 1,
          explanation: 'On modern architectures, `int` is 4 bytes (32 bits) and `char` is guaranteed by the C standard to be exactly 1 byte (8 bits).'
        },
        {
          q: 'Which format specifier prints a `float` rounded to exactly 2 decimal places?',
          options: ['%2d', '%.2f', '%f.2', '%c2'],
          correct: 1,
          explanation: '`%.2f` formats a floating-point number to two digits after the decimal point (ideal for currency!).'
        }
      ]
    },

    {
      id: 2,
      slug: 'flow-state',
      code: 'MOD_02',
      title: 'The Flow State',
      subtitle: 'Conditionals, Loops & Branching Logic',
      accent: 'cyan',
      xpReward: 175,
      readTime: '15 min',
      unlockedByDefault: true,
      heroQuote: 'A program without control flow is a train on a straight track. Add conditionals and loops, and it becomes an autonomous cybernetic brain.',
      concepts: [
        {
          title: 'Conditionals: if, else if, else & switch',
          badge: '0x04 • Branching',
          csTheory: 'In C, any zero value (`0`) evaluates to FALSE, and any non-zero value evaluates to TRUE. `if / else if / else` evaluates boolean expressions using relational (`==`, `!=`, `<`, `>`) and logical (`&&`, `||`, `!`) operators. For discrete integer/char states, `switch` compiles into an ultra-fast jump table.',
          eli5Analogy: 'Conditionals are railway track switches! The CPU train approaches a junction: if your ticket says VIP (`score >= 90`), the track flips left to the Emerald Lounge; otherwise (`else`), it routes you to Standard Seating.',
          codeSnippet: `int clearance = 4;\nif (clearance >= 5) {\n    printf("Access Granted: Root Vault\\n");\n} else if (clearance >= 3) {\n    printf("Access Granted: Sector B\\n");\n} else {\n    printf("Access Denied: Intruder Alert!\\n");\n}`
        },
        {
          title: 'Iteration: for, while & do-while Loops',
          badge: '0x05 • Iteration',
          csTheory: 'Loops repeat instruction blocks at millions of cycles per second. Use `for(init; condition; update)` when the iteration count is known, `while(condition)` for state-driven loops, and `do { ... } while(condition);` when the body must execute at least once.',
          eli5Analogy: 'A `for` loop is a fitness trainer shouting: "Start at rep 1 (`i = 1`); keep going while `i <= 10`; add 1 to your counter after each pushup (`i++`)!"',
          codeSnippet: `int sum = 0;\nfor (int i = 1; i <= 5; i++) {\n    sum += i;\n    printf("Cycle %d -> Running Sum: %d\\n", i, sum);\n}`
        },
        {
          title: 'Loop Control: break & continue',
          badge: '0x06 • Jump Control',
          csTheory: '`break` immediately terminates the innermost enclosing loop or `switch` statement, jumping to the instruction following the block. `continue` skips the remainder of the current loop iteration and jumps straight to the next cycle check.',
          eli5Analogy: '`break` is pulling the emergency stop cord to exit the rollercoaster immediately. `continue` is skipping one bruised apple on a conveyor belt and moving straight to the next apple.',
          codeSnippet: `for (int code = 1000; code <= 9999; code++) {\n    if (code % 2 != 0) continue; // Skip odd codes\n    if (code == 4826) {\n        printf("VAULT UNLOCKED AT CODE: %d!\\n", code);\n        break; // Stop searching immediately!\n    }\n}`
        }
      ],
      eli5Summary: {
        title: 'The Cybernetic Railway Switchyard',
        analogy: '`if/else` steers your code down different tracks based on live sensors, while `for` and `while` loops act like high-speed circular test tracks—running tasks thousands of times until the exact target condition unlocks the exit gate (`break`)!',
        icon: '🛤️'
      },
      visualizerType: 'secret_vault',
      project: {
        title: 'Interactive CLI Calculator',
        description: 'Architect a multi-operation command-line scientific & arithmetic calculator supporting `+`, `-`, `*`, `/`, and power sequences using `switch` control flow and zero-division guards.',
        starterCode: `#include <stdio.h>

int main(void) {
    // === MODULE 2 PROJECT: INTERACTIVE CLI CALCULATOR ===
    double num1 = 42.0;
    double num2 = 6.0;
    char op = '*';
    double result = 0.0;

    printf("=== C-VERSE PRECISION CLI CALCULATOR ===\\n");
    printf("Expression: %.2f %c %.2f\\n", num1, op, num2);

    switch (op) {
        case '+':
            result = num1 + num2;
            printf("Result    : %.2f\\n", result);
            break;
        case '-':
            result = num1 - num2;
            printf("Result    : %.2f\\n", result);
            break;
        case '*':
            result = num1 * num2;
            printf("Result    : %.2f\\n", result);
            break;
        case '/':
            if (num2 == 0.0) {
                printf("Error     : CRITICAL - Division by zero prevented!\\n");
            } else {
                result = num1 / num2;
                printf("Result    : %.2f\\n", result);
            }
            break;
        default:
            printf("Error     : Unknown operator '%c'\\n", op);
    }

    // Bonus Loop: Power table of 2 using a for-loop
    printf("\\n--- Binary Power Sequence (2^1 to 2^6) ---\\n");
    int power = 1;
    for (int exp = 1; exp <= 6; exp++) {
        power = power * 2;
        printf("2^%d = %d\\n", exp, power);
    }

    return 0;
}`,
        defaultStdin: '42.0 * 6.0'
      },
      quiz: [
        {
          q: 'What happens if you omit the `break;` statement inside a `switch` case in C?',
          options: [
            'The compiler refuses to compile the program.',
            'Execution "falls through" and runs the code in the next case block below it!',
            'The program automatically returns from `main()`.',
            'It repeats the same case in an infinite loop.'
          ],
          correct: 1,
          explanation: 'Without `break`, C exhibits "fall-through" behavior, continuing execution into subsequent `case` labels until it hits a `break` or the end of the `switch` block.'
        },
        {
          q: 'Which loop guarantees that its body will execute AT LEAST once, even if the condition is initially false?',
          options: ['for loop', 'while loop', 'do-while loop', 'switch loop'],
          correct: 2,
          explanation: 'A `do { ... } while (condition);` loop checks its condition at the bottom of the loop after executing the body once.'
        },
        {
          q: 'In C, what is the difference between `=` and `==` inside `if (x = 5)` vs `if (x == 5)`?',
          options: [
            'There is no difference; both compare `x` to 5.',
            '`=` assigns 5 to `x` (and evaluates to true since 5 is non-zero!), whereas `==` compares equality.',
            '`==` assigns 5 to `x`, whereas `=` checks equality.',
            '`=` is only for floats, `==` is for ints.'
          ],
          correct: 1,
          explanation: 'A classic C bug! `if (x = 5)` overwrites `x` with 5 and evaluates to true (5 != 0). Always use `==` for equality comparisons.'
        }
      ]
    },

    {
      id: 3,
      slug: 'modular-magic',
      code: 'MOD_03',
      title: 'Modular Magic',
      subtitle: 'Functions, Stack Frames & Recursion',
      accent: 'purple',
      xpReward: 200,
      readTime: '18 min',
      unlockedByDefault: true,
      heroQuote: 'Master the Call Stack, and you understand how every function call births a temporary universe in RAM—and vanishes the microsecond it returns.',
      concepts: [
        {
          title: 'Declaration vs. Definition & Return Types',
          badge: '0x07 • Modularity',
          csTheory: 'A function prototype (declaration) tells the compiler a function\'s signature (`int add(int a, int b);`) before `main()`, while the definition contains the actual implementation body. Functions that return nothing use the `void` return type.',
          eli5Analogy: 'A function declaration is a movie trailer: it tells the cinema what the movie is called and who stars in it. The function definition is the actual 2-hour movie reel!',
          codeSnippet: `// Prototype (Declaration)\nint compute_damage(int base, int multiplier);\n\nint main(void) {\n    int hit = compute_damage(25, 3);\n    printf("Critical Hit: %d HP\\n", hit);\n    return 0;\n}\n\n// Definition\nint compute_damage(int base, int multiplier) {\n    return base * multiplier;\n}`
        },
        {
          title: 'The Call Stack & Lexical Scope',
          badge: '0x08 • Stack Frames',
          csTheory: 'Every time a function is called, the CPU pushes a new **Stack Frame** onto the Call Stack containing its parameters, local variables, and return address. When the function hits `return`, its stack frame is popped and its local variables cease to exist.',
          eli5Analogy: 'Think of the Call Stack like a stack of cafeteria trays. Calling a function places a fresh tray on top with its own sticky notes (local variables). When the function finishes, that top tray is whisked away!',
          codeSnippet: `int boost(int x) {\n    int bonus = 10; // Lives ONLY inside boost()'s stack frame\n    return x + bonus;\n}`
        },
        {
          title: 'Recursion: Functions Calling Themselves',
          badge: '0x09 • Self-Reference',
          csTheory: 'Recursion occurs when a function calls itself to solve a smaller instance of the same problem. Every recursive function MUST have a **Base Case** (stopping condition) and a **Recursive Step**; without a base case, stack frames accumulate until a **Stack Overflow** crashes the process!',
          eli5Analogy: 'Recursion is opening Russian nesting dolls. Each doll opens a smaller version of itself (`factorial(n-1)`) until you reach the tiny solid wooden doll at the center (the **Base Case**, `n == 1`), then you snap them all back together!',
          codeSnippet: `int factorial(int n) {\n    if (n <= 1) return 1; // Base Case: stops stack growth!\n    return n * factorial(n - 1); // Recursive Step\n}`
        }
      ],
      eli5Summary: {
        title: 'Cafeteria Trays & Russian Nesting Dolls',
        analogy: 'Every function gets its own private tray on the Call Stack. Even if two functions both have a variable named `score`, they never collide because they live on separate trays! And recursion is simply stacking trays until you hit the smallest problem, then collecting the answers on the way back down.',
        icon: '🥞'
      },
      visualizerType: 'call_stack',
      project: {
        title: 'Rock, Paper, Scissors Arena + Recursive Factorial',
        description: 'Build a modular multi-round Rock, Paper, Scissors combat engine using dedicated helper functions (`judge_round`, `move_name`) and a recursive combo multiplier.',
        starterCode: `#include <stdio.h>

// Helper function: Returns 1 if Player wins, -1 if CPU wins, 0 for Draw
// Moves: 0 = Rock, 1 = Paper, 2 = Scissors
int judge_round(int player, int cpu) {
    if (player == cpu) return 0;
    if ((player == 0 && cpu == 2) ||
        (player == 1 && cpu == 0) ||
        (player == 2 && cpu == 1)) {
        return 1;
    }
    return -1;
}

// Recursive function: Calculates combo bonus (n!)
int factorial_bonus(int streak) {
    if (streak <= 1) return 1;
    return streak * factorial_bonus(streak - 1);
}

int main(void) {
    // === MODULE 3 PROJECT: MODULAR RPS ARENA ===
    int player_moves[3] = {0, 1, 2}; // Rock, Paper, Scissors
    int cpu_moves[3]    = {2, 0, 2}; // Scissors, Rock, Scissors
    int player_score = 0;
    int cpu_score = 0;

    printf("=== C-VERSE ROCK-PAPER-SCISSORS TOURNAMENT ===\\n");

    for (int round = 0; round < 3; round++) {
        int p = player_moves[round];
        int c = cpu_moves[round];
        int outcome = judge_round(p, c);

        if (outcome == 1) {
            player_score++;
            printf("Round %d: Player (%d) beats CPU (%d) -> PLAYER WINS!\\n", round + 1, p, c);
        } else if (outcome == -1) {
            cpu_score++;
            printf("Round %d: CPU (%d) beats Player (%d) -> CPU WINS!\\n", round + 1, c, p);
        } else {
            printf("Round %d: Both chose (%d) -> TACTICAL DRAW!\\n", round + 1, p);
        }
    }

    int bonus_xp = factorial_bonus(player_score + 2);
    printf("\\nFinal Score -> Player: %d | CPU: %d\\n", player_score, cpu_score);
    printf("Recursive Streak Multiplier (4!): %d XP Bonus\\n", bonus_xp);

    return 0;
}`,
        defaultStdin: '0 1 2'
      },
      quiz: [
        {
          q: 'What happens to a function\'s local variables when the function executes `return`?',
          options: [
            'They are saved permanently on the hard drive.',
            'Their stack frame is popped from the Call Stack and the memory is reclaimed immediately.',
            'They automatically become global variables.',
            'They leak memory until you call `free()`.'
          ],
          correct: 1,
          explanation: 'Local variables have automatic storage duration on the Call Stack; when the function returns, its stack frame is popped instantly.'
        },
        {
          q: 'What is the result of calling a recursive function that lacks a reachable Base Case?',
          options: [
            'It returns 0 automatically after 10 calls.',
            'Stack Overflow: infinite stack frames exhaust the stack memory region.',
            'The C compiler automatically adds a `break` statement.',
            'It converts the recursion into a `switch` statement.'
          ],
          correct: 1,
          explanation: 'Without a base case, every recursive call pushes a new stack frame until the Call Stack collides with its limit, causing a Stack Overflow.'
        },
        {
          q: 'By default in C, how are primitive arguments (like `int x`) passed to functions?',
          options: [
            'Pass-by-value (the function receives a copy of the value in its own stack frame).',
            'Pass-by-reference (the caller\'s variable is always modified).',
            'Pass-by-cloud.',
            'Pass-by-global-scope.'
          ],
          correct: 0,
          explanation: 'C is strictly pass-by-value! To let a function modify the caller\'s variable, you must pass a pointer (its memory address), which you\'ll master in Module 5.'
        }
      ]
    },

    {
      id: 4,
      slug: 'data-matrix',
      code: 'MOD_04',
      title: 'The Data Matrix',
      subtitle: 'Contiguous Arrays, Strings & Ciphers',
      accent: 'emerald',
      xpReward: 200,
      readTime: '16 min',
      unlockedByDefault: true,
      heroQuote: 'In C, there is no magic "String" object—only raw, contiguous strips of bytes terminated by a silent zero (`\\0`).',
      concepts: [
        {
          title: '1D & 2D Arrays: Contiguous RAM Strips',
          badge: '0x0A • Contiguity',
          csTheory: 'An array `int arr[5]` allocates 5 consecutive 4-byte integers in RAM (20 bytes total) with zero gaps. Because they sit side-by-side, accessing `arr[i]` takes $O(1)$ constant time by computing `base_address + (i * sizeof(int))`. Indexing starts at `0` and goes to `N - 1`.',
          eli5Analogy: 'An array is a row of numbered gym lockers welded together in a single metal frame, starting at Locker #0. Because Locker #0, #1, #2, and #3 touch each other, you can jump to Locker #3 blindfolded just by taking 3 equal steps from the start!',
          codeSnippet: `int vault_pins[4] = {10, 20, 30, 40};\n// vault_pins[0] is at 0x7fff...80\n// vault_pins[1] is at 0x7fff...84 (+4 bytes!)\nprintf("Third locker: %d\\n", vault_pins[2]); // Prints 30`
        },
        {
          title: 'C Strings & The Null Terminator (\\0)',
          badge: '0x0B • ASCII Arrays',
          csTheory: 'A string in C is simply a 1D `char` array terminated by the null character `\'\\0\'` (ASCII byte `0x00`). Thus, storing `"C-VERSE"` (7 letters) requires a `char` array of at least size **8** so the final byte can hold `\'\\0\'`. Functions like `printf("%s")` and `strlen()` keep reading bytes in RAM until they hit `\'\\0\'`!',
          eli5Analogy: 'A C string is a freight train of letter cars, and `\'\\0\'` is the bright red caboose at the end! If you forget the `\'\\0\'` caboose, `printf` keeps reading random garbage memory tracks past your train until it crashes!',
          codeSnippet: `char codename[6] = {'G', 'H', 'O', 'S', 'T', '\\0'};\n// Shorthand string literal (automatically adds '\\0'):\nchar agent[] = "CIPHER"; // Size in RAM: 7 bytes!`
        },
        {
          title: 'ASCII Arithmetic & String Manipulation',
          badge: '0x0C • Cryptography',
          csTheory: 'Because every `char` is stored as a 1-byte numeric ASCII code (`\'A\'` = 65, `\'Z\'` = 90, `\'a\'` = 97), you can perform mathematical transformations directly on characters! Modular arithmetic `(ch - \'A\' + shift) % 26 + \'A\'` wraps letters cleanly around the alphabet.',
          eli5Analogy: 'Every letter wears a secret jersey number (`\'A\'` is #65, `\'B\'` is #66). Adding `+3` to `\'A\'` turns #65 into #68, which is `\'D\'`—instant spy encryption!',
          codeSnippet: `char letter = 'A'; // ASCII 65\nchar shifted = ((letter - 'A' + 3) % 26) + 'A';\nprintf("Original: %c (%d) -> Encrypted: %c (%d)\\n", letter, letter, shifted, shifted);`
        }
      ],
      eli5Summary: {
        title: 'Welded Gym Lockers & The \\0 Red Caboose',
        analogy: 'Arrays weld variables side-by-side in RAM so your CPU can blitz through thousands of items in microseconds. Strings are just `char` locker rows where the last locker holds a red stop sign (`\\0`) telling the computer: "End of word!"',
        icon: '🔐'
      },
      visualizerType: 'caesar_matrix',
      project: {
        title: 'The Secret Agent Cipher (Caesar Cipher)',
        description: 'Construct a tactical cryptographic engine that encrypts and decrypts classified ASCII transmissions in-place by iterating up to the `\\0` null terminator.',
        starterCode: `#include <stdio.h>

int main(void) {
    // === MODULE 4 PROJECT: THE SECRET AGENT CAESAR CIPHER ===
    char message[] = "ATTACK AT DAWN";
    int shift = 3;

    printf("=== C-VERSE CRYPTOGRAPHIC INTERCEPT TERMINAL ===\\n");
    printf("Plaintext  : %s\\n", message);
    printf("Shift Key  : +%d\\n", shift);

    // 1. Encrypt in-place until we hit the '\\0' null terminator
    for (int i = 0; message[i] != '\\0'; i++) {
        char ch = message[i];
        if (ch >= 'A' && ch <= 'Z') {
            message[i] = ((ch - 'A' + shift) % 26) + 'A';
        }
    }
    printf("Ciphertext : %s\\n", message);

    // 2. Decrypt back to verify integrity
    for (int i = 0; message[i] != '\\0'; i++) {
        char ch = message[i];
        if (ch >= 'A' && ch <= 'Z') {
            message[i] = ((ch - 'A' - shift + 26) % 26) + 'A';
        }
    }
    printf("Decrypted  : %s (Verified!)\\n", message);

    return 0;
}`,
        defaultStdin: 'ATTACK AT DAWN'
      },
      quiz: [
        {
          q: 'How many bytes of RAM are required to store the C string `"KERNEL"` safely?',
          options: [
            '6 bytes (one for each letter)',
            '7 bytes (6 letters + 1 byte for the `\\0` null terminator)',
            '4 bytes',
            '12 bytes'
          ],
          correct: 1,
          explanation: '`"KERNEL"` has 6 characters, plus C automatically appends the hidden `\'\\0\'` null byte at index 6, requiring 7 bytes total.'
        },
        {
          q: 'Given `int nums[4] = {10, 20, 30, 40};`, what is the valid index range?',
          options: [
            '1 to 4',
            '0 to 3',
            '0 to 4',
            '-1 to 3'
          ],
          correct: 1,
          explanation: 'C arrays are 0-indexed. An array of length 4 has valid indices `0, 1, 2, 3`. Accessing `nums[4]` reads out-of-bounds memory!'
        },
        {
          q: 'If `int arr[3]` starts at memory address `0x7fff1000` and `sizeof(int)` is 4 bytes, what is the address of `arr[2]`?',
          options: [
            '0x7fff1002',
            '0x7fff1008',
            '0x7fff1004',
            '0x7fff2000'
          ],
          correct: 1,
          explanation: 'Each `int` takes 4 bytes. `arr[0]` is at `1000`, `arr[1]` is at `1004`, and `arr[2]` is at `1000 + (2 * 4) = 0x7fff1008`!'
        }
      ]
    },

    {
      id: 5,
      slug: 'master-key',
      code: 'MOD_05',
      title: 'The Master Key',
      subtitle: 'Pointers, Dereferencing & Memory Addresses',
      accent: 'cyan',
      xpReward: 250,
      readTime: '22 min',
      unlockedByDefault: true,
      heroQuote: 'This is the moment C programmers separate from the rest of the world. Pointers are not scary—they are simply variables that hold GPS coordinates in RAM.',
      concepts: [
        {
          title: 'The Address-Of (&) and Pointer Declaration (*)',
          badge: '0x0D • Hex Coordinates',
          csTheory: 'Every byte in RAM has a unique numeric address (e.g., `0x7fff5fbff8c0`). The `&` operator returns the address of a variable. A **Pointer** (`int *ptr = &x;`) is an 8-byte variable on 64-bit systems whose value is the memory address of another variable.',
          eli5Analogy: 'A regular variable (`int treasure = 500;`) is a heavy chest buried on an island. A pointer (`int *map = &treasure;`) is a piece of parchment with the exact GPS coordinates (`0x7fff...`) of where that chest is buried!',
          codeSnippet: `int shield = 100;       // Value: 100 | Address: 0x7fff5fbff8a0\nint *ptr = &shield;     // ptr stores 0x7fff5fbff8a0!\nprintf("Shield Addr: %p | Value via ptr: %d\\n", (void*)ptr, *ptr);`
        },
        {
          title: 'The Dereference Operator (*): Teleporting to Target RAM',
          badge: '0x0E • Dereferencing',
          csTheory: 'Once `ptr` holds the address of `shield`, placing `*` in front of `ptr` (`*ptr`) **dereferences** it—following the arrow in RAM to read or overwrite the target memory cell directly! Executing `*ptr = 250;` mutates `shield` to `250` without touching the identifier `shield`.',
          eli5Analogy: 'Writing `ptr` looks at the GPS coordinates written on the map. Writing `*ptr` ("dereferencing") means **teleporting** to those GPS coordinates and opening the chest itself!',
          codeSnippet: `int hp = 100;\nint *p = &hp;\n*p = 999; // Teleports to hp's RAM cell and writes 999!\nprintf("hp is now: %d\\n", hp); // Prints 999!`
        },
        {
          title: 'Pointer Arithmetic & Pass-by-Reference',
          badge: '0x0F • Two-Pointer Ops',
          csTheory: 'Adding `1` to an `int *` (`ptr + 1` or `ptr++`) advances the address by `sizeof(int)` (4 bytes), pointing cleanly to the next element in an array! Passing pointers into functions (`void swap(int *a, int *b)`) lets functions mutate caller variables directly in-place.',
          eli5Analogy: 'Instead of photocopying an entire 1,000-page encyclopedia to hand to your coworker (Pass-by-Value), you hand them a sticky note with the bookshelf number (Pass-by-Pointer) so they can edit the real book in place!',
          codeSnippet: `void swap(int *a, int *b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}`
        }
      ],
      eli5Summary: {
        title: 'The Treasure Chest & The GPS Map',
        analogy: 'Never confuse the two symbols again: `&x` means **"Give me the GPS coordinates of `x`"**, and `*ptr` means **"Follow the GPS coordinates inside `ptr` and open the box there!"** That is 100% of pointers!',
        icon: '🎯'
      },
      visualizerType: 'pointer_visualizer',
      project: {
        title: 'In-Place Array Reverser using Pointers',
        description: 'Use two converging memory pointers (`*left` at the start address and `*right` at the end address) to reverse an array in-place in $O(1)$ extra space.',
        starterCode: `#include <stdio.h>

int main(void) {
    // === MODULE 5 PROJECT: IN-PLACE POINTER ARRAY REVERSER ===
    int data[6] = {10, 20, 30, 40, 50, 60};
    int n = 6;

    printf("=== C-VERSE POINTER ENGINE: IN-PLACE REVERSAL ===\\n");
    printf("Original Array : ");
    for (int i = 0; i < n; i++) {
        printf("%d ", data[i]);
    }
    printf("\\n");

    // Initialize left pointer to start, right pointer to end
    int *left = &data[0];
    int *right = &data[n - 1];

    // Converge pointers toward center and swap via dereferencing
    while (left < right) {
        int temp = *left;
        *left = *right;
        *right = temp;

        left++;   // Advance 4 bytes forward
        right--;  // Retreat 4 bytes backward
    }

    printf("Reversed Array : ");
    for (int i = 0; i < n; i++) {
        printf("%d ", data[i]);
    }
    printf("\\nPointer Status : Completed with O(1) extra memory!\\n");

    return 0;
}`,
        defaultStdin: ''
      },
      quiz: [
        {
          q: 'If `int x = 50;` and `int *p = &x;`, what does `*p = 75;` do?',
          options: [
            'It changes the memory address of `x` to `0x00000075`.',
            'It follows the address stored in `p` and overwrites the value of `x` to `75`.',
            'It creates a new variable named `p75`.',
            'It causes a compilation error.'
          ],
          correct: 1,
          explanation: 'The dereference operator `*p` accesses the target memory cell that `p` points to (`x`), updating `x` to 75.'
        },
        {
          q: 'If `int *ptr` holds address `0x7fff0000` (where `sizeof(int)` is 4), what address does `ptr + 1` evaluate to?',
          options: [
            '0x7fff0001',
            '0x7fff0004',
            '0x7fff0008',
            '0x7fff1000'
          ],
          correct: 1,
          explanation: 'Pointer arithmetic scales automatically by `sizeof(*ptr)`. Since `int` is 4 bytes, `ptr + 1` steps forward by 4 bytes to `0x7fff0004`.'
        },
        {
          q: 'What is `NULL` in C pointers?',
          options: [
            'A pointer initialized to address `0x0` indicating it intentionally points to nothing.',
            'A pointer that automatically allocates heap memory.',
            'A syntax keyword used to delete source code.',
            'An array of strings.'
          ],
          correct: 0,
          explanation: '`NULL` (`(void*)0`) is a sentinel address indicating a pointer does not currently point to a valid memory object. Always check `if (ptr != NULL)` before dereferencing!'
        }
      ]
    },

    {
      id: 6,
      slug: 'raw-power',
      code: 'MOD_06',
      title: 'Raw Power',
      subtitle: 'Dynamic Memory Allocation (Stack vs. Heap)',
      accent: 'purple',
      xpReward: 250,
      readTime: '20 min',
      unlockedByDefault: true,
      heroQuote: 'Stack memory is automatic but tiny. The Heap is a vast ocean of gigabytes that bends to your runtime commands—if you remember to free what you claim.',
      concepts: [
        {
          title: 'Stack vs. Heap Memory Architecture',
          badge: '0x10 • Memory Segments',
          csTheory: 'The **Stack** is fast, LIFO-managed, and fixed at compile time (usually 1–8 MB). The **Heap** is a vast pool of dynamic RAM where you can request exact byte sizes at runtime while the program is running—essential when you don\'t know how many users, grades, or packets will arrive ahead of time.',
          eli5Analogy: 'The Stack is your backpack: super fast to grab things from, but tiny and emptied every night. The Heap is a giant U-Haul self-storage facility where you can rent as many huge storage units as you need on the fly!',
          codeSnippet: `// Stack: Fixed size known at compile-time\nint stack_arr[10];\n\n// Heap: Dynamic size decided at runtime!\nint n = 500;\nint *heap_arr = (int*)malloc(n * sizeof(int));`
        },
        {
          title: 'malloc(), calloc(), and realloc()',
          badge: '0x11 • `<stdlib.h>` API',
          csTheory: '`malloc(bytes)` allocates uninitialized heap bytes and returns a pointer to the first byte. `calloc(count, size)` allocates AND zero-initializes every byte to `0`. `realloc(ptr, new_bytes)` dynamically grows or shrinks an existing allocation while preserving its contents.',
          eli5Analogy: '`malloc` rents a storage unit as-is (might still have dusty boxes from the previous tenant). `calloc` rents the unit AND hires cleaners to sweep every inch to `0` before handing you the key! `realloc` knocks down a wall to expand your unit when you buy more stuff.',
          codeSnippet: `int *grades = (int*)calloc(5, sizeof(int)); // 5 ints zeroed to 0\ngrades = (int*)realloc(grades, 10 * sizeof(int)); // Expanded to 10 ints!`
        },
        {
          title: 'free() & Preventing Memory Leaks',
          badge: '0x12 • Zero-Leak Hygiene',
          csTheory: 'Unlike Java or Python, C has **no garbage collector**. Every `malloc`/`calloc` MUST be paired with `free(ptr);` when you\'re done, followed by `ptr = NULL;` (to prevent dangling pointers). Forgetting `free()` causes a **Memory Leak**, slowly starving the OS of RAM.',
          eli5Analogy: 'If you rent Heap storage units and throw away the keys without returning them to the front desk (`free(ptr)`), the storage facility stays locked forever until the whole city runs out of space!',
          codeSnippet: `free(grades);   // Return the Heap block to the OS!\ngrades = NULL;  // Prevent dangling-pointer bugs!`
        }
      ],
      eli5Summary: {
        title: 'Renting U-Haul Storage Units on the Heap',
        analogy: 'Heap memory is renting storage units on demand (`malloc`), sweeping them clean (`calloc`), expanding them (`realloc`), and—most importantly—returning the key to the office (`free`) when you move out so you never get charged for a Memory Leak!',
        icon: '🏗️'
      },
      visualizerType: 'heap_allocator',
      project: {
        title: 'Dynamic Student Grade Management System',
        description: 'Build a zero-leak Heap-allocated student analytics system using `calloc`, `realloc`, and `free` that computes cohort averages and highest honours.',
        starterCode: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    // === MODULE 6 PROJECT: DYNAMIC STUDENT GRADE SYSTEM ===
    int count = 4;

    // 1. Dynamically allocate heap memory for 4 student grades
    int *grades = (int*)calloc(count, sizeof(int));
    if (grades == NULL) {
        printf("CRITICAL: Heap allocation failed!\\n");
        return 1;
    }

    grades[0] = 88;
    grades[1] = 94;
    grades[2] = 79;
    grades[3] = 97;

    // 2. A 5th transfer student arrives -> resize on the fly with realloc!
    count = 5;
    grades = (int*)realloc(grades, count * sizeof(int));
    grades[4] = 92;

    printf("=== C-VERSE DYNAMIC HEAP GRADE ANALYTICS ===\\n");
    printf("Heap Block Address : 0x5555555592a0 (%d bytes allocated)\\n", count * 4);

    int sum = 0;
    int top_score = grades[0];
    for (int i = 0; i < count; i++) {
        printf("Student #%d Grade   : %d%%\\n", i + 1, grades[i]);
        sum += grades[i];
        if (grades[i] > top_score) {
            top_score = grades[i];
        }
    }

    float average = (float)sum / count;
    printf("--------------------------------------------\\n");
    printf("Cohort Average     : %.2f%% | Top Honours: %d%%\\n", average, top_score);

    // 3. Cleanly release Heap memory to prevent Memory Leaks!
    free(grades);
    grades = NULL;
    printf("Heap Hygiene       : Memory freed cleanly (0 bytes leaked!)\\n");

    return 0;
}`,
        defaultStdin: ''
      },
      quiz: [
        {
          q: 'What is the key difference between `malloc()` and `calloc()`?',
          options: [
            '`malloc()` allocates on the Stack, while `calloc()` allocates on the Heap.',
            '`calloc()` initializes all allocated bytes to zero (`0`), whereas `malloc()` leaves them uninitialized.',
            '`malloc()` automatically frees memory, while `calloc()` does not.',
            '`calloc()` can only allocate `char` arrays.'
          ],
          correct: 1,
          explanation: '`calloc(count, size)` both allocates the requested memory on the Heap and clears every byte to `0`.'
        },
        {
          q: 'What happens if a function allocates memory with `malloc()` and returns without freeing it or returning the pointer?',
          options: [
            'The C garbage collector cleans it up after 5 seconds.',
            'A Memory Leak occurs: the Heap block remains allocated but unreachable until the program terminates.',
            'The memory automatically moves to the Call Stack.',
            'The compiler deletes the function.'
          ],
          correct: 1,
          explanation: 'Once the local pointer variable is popped off the Stack without freeing or saving the address, the Heap block is orphaned—a textbook Memory Leak.'
        },
        {
          q: 'Why is it best practice to set `ptr = NULL;` immediately after calling `free(ptr);`?',
          options: [
            'To prevent a "dangling pointer" that still holds the old freed address and could be accidentally dereferenced.',
            'To double the speed of the CPU.',
            'Because `free()` does not work unless followed by `NULL`.',
            'To convert the pointer into an integer.'
          ],
          correct: 0,
          explanation: 'After `free(ptr)`, `ptr` still holds the old hex address (a dangling pointer). Setting `ptr = NULL` ensures any accidental reuse is immediately caught.'
        }
      ]
    },

    {
      id: 7,
      slug: 'architecting-systems',
      code: 'MOD_07',
      title: 'Architecting Systems',
      subtitle: 'Structs, typedef & Persistent File I/O',
      accent: 'emerald',
      xpReward: 300,
      readTime: '25 min',
      unlockedByDefault: true,
      heroQuote: 'Combine custom composite data structures with persistent disk streams, and you have the blueprint for databases, compilers, and operating system kernels.',
      concepts: [
        {
          title: 'Composite Blueprints: struct & typedef',
          badge: '0x13 • Custom Types',
          csTheory: 'While arrays group elements of the *same* type, a `struct` packs variables of *different* types (`int id`, `char title[32]`, `int completed`) into a single contiguous memory block. Pairing `typedef struct { ... } Task;` creates a clean first-class type alias.',
          eli5Analogy: 'An array is an egg carton (every slot holds an egg). A `struct` is a custom Bento lunchbox with molded compartments—one slot for rice (`int id`), one for sushi (`char title[]`), and one for sauce (`int priority`)!',
          codeSnippet: `typedef struct {\n    int id;\n    char title[40];\n    int done;\n} TodoItem;\n\nTodoItem t1 = {1, "Master C Pointers", 1};`
        },
        {
          title: 'Pointers to Structs & The Arrow Operator (->)',
          badge: '0x14 • Struct Pointers',
          csTheory: 'Passing large structs to functions by value copies the entire struct. Instead, Systems Engineers pass a pointer (`TodoItem *ptr = &t1;`) and use the sleek arrow operator `ptr->done = 1;` (which is shorthand for `(*ptr).done = 1;`).',
          eli5Analogy: 'The dot `.` operator opens a Bento box sitting right in your hands (`t1.done`). The arrow `->` operator fires a laser pointer at a Bento box across the room (`ptr->done`) and flips its lid open remotely!',
          codeSnippet: `TodoItem task = {101, "Deploy Kernel Patch", 0};\nTodoItem *p = &task;\np->done = 1; // Equivalent to (*p).done = 1`
        },
        {
          title: 'Persistent File I/O: fopen, fprintf, fscanf & fclose',
          badge: '0x15 • Disk Streams',
          csTheory: 'RAM is volatile—when your program exits, Stack and Heap vanish. To persist data permanently on disk, C uses a `FILE *` stream pointer via `fopen("todos.txt", "w")` (write), `"r"` (read), or `"a"` (append), writes formatted data with `fprintf()`, and flushes the buffer with `fclose()`.',
          eli5Analogy: 'RAM is a whiteboard that gets wiped clean when the power turns off. File I/O (`fopen` + `fprintf`) is engraving your work into a permanent hardcover ledger stored inside a fireproof vault (`todos.txt`), then locking the vault door (`fclose`)!',
          codeSnippet: `FILE *fp = fopen("todos.txt", "w");\nif (fp != NULL) {\n    fprintf(fp, "[X] #1: Build C-Verse Capstone\\n");\n    fclose(fp); // Flushes disk buffer & releases file handle!\n}`
        }
      ],
      eli5Summary: {
        title: 'Custom Bento Boxes & The Permanent Disk Vault',
        analogy: '`struct` lets you invent your own custom data blueprints (like a `Task` or `Player`), `->` lets you update them at lightning speed via pointers, and `FILE *` saves them permanently to disk so your data survives even after the program finishes!',
        icon: '🏛️'
      },
      visualizerType: 'struct_file_io',
      project: {
        title: 'Capstone: Mini To-Do List with Persistent File Storage',
        description: 'Architect a complete C Systems Capstone using `typedef struct`, pointer arrow operators (`->`), and `FILE *` disk streams (`fopen`, `fprintf`, `fclose`) to persist tasks into `todos.txt`.',
        starterCode: `#include <stdio.h>

typedef struct {
    int id;
    char title[48];
    int priority;
    int completed;
} Task;

int main(void) {
    // === MODULE 7 CAPSTONE: PERSISTENT STRUCT TO-DO ENGINE ===
    Task list[3] = {
        {101, "Master C Pointers & Hex Addresses", 1, 1},
        {102, "Eliminate Heap Memory Leaks with free()", 1, 1},
        {103, "Ship Persistent File I/O Capstone", 2, 0}
    };

    // Use a struct pointer & arrow operator (->) to complete Task #3!
    Task *capstone_ptr = &list[2];
    capstone_ptr->completed = 1;

    printf("=== C-VERSE CAPSTONE: PERSISTENT TO-DO SYSTEM ===\\n");

    // Open virtual disk file "todos.txt" for writing
    FILE *fp = fopen("todos.txt", "w");
    if (fp == NULL) {
        printf("Error: Could not open todos.txt for writing!\\n");
        return 1;
    }

    for (int i = 0; i < 3; i++) {
        char status = list[i].completed ? 'X' : ' ';
        printf("[%c] Task #%d (P%d): %s\\n", status, list[i].id, list[i].priority, list[i].title);
        fprintf(fp, "[%c] Task #%d (P%d): %s\\n", status, list[i].id, list[i].priority, list[i].title);
    }

    fclose(fp);
    printf("-------------------------------------------------\\n");
    printf("Disk Sync : 3 struct records persisted to 'todos.txt'!\\n");
    printf("Status    : ZERO TO ADVANCED C CURRICULUM COMPLETE!\\n");

    return 0;
}`,
        defaultStdin: ''
      },
      quiz: [
        {
          q: 'If `Task *ptr = &my_task;`, which syntax correctly accesses the `completed` field via the pointer?',
          options: [
            'ptr.completed',
            'ptr->completed (or (*ptr).completed)',
            '&ptr*completed',
            'Task::completed'
          ],
          correct: 1,
          explanation: 'When accessing a struct member through a pointer, C uses the arrow operator `ptr->member` (which is syntactic sugar for `(*ptr).member`).'
        },
        {
          q: 'What happens when you open an existing file with `fopen("todos.txt", "w")` vs `"a"`?',
          options: [
            '`"w"` overwrites (truncates) the file from scratch, while `"a"` appends new data to the end of the file.',
            '`"w"` is read-only, while `"a"` deletes the file.',
            'Both do the exact same thing.',
            '`"w"` writes to RAM only, while `"a"` writes to disk.'
          ],
          correct: 0,
          explanation: 'Mode `"w"` creates an empty file for writing (truncating existing content), whereas `"a"` (append) preserves existing content and writes at the end.'
        },
        {
          q: 'Why is calling `fclose(fp)` essential after writing to a file?',
          options: [
            'It flushes any unwritten buffered data from RAM to disk and releases the OS file descriptor.',
            'It deletes the file from the hard drive.',
            'It converts the file into an integer array.',
            'It is optional and has no effect.'
          ],
          correct: 0,
          explanation: 'Standard I/O buffers disk writes in RAM for performance. Calling `fclose(fp)` ensures all buffered bytes are flushed to disk and releases the OS file handle.'
        }
      ]
    }
  ]
};
