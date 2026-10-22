# C-Verse: Zero to Advanced C Programming (`C17 Kernel Edition`)

**C-Verse** is an interactive, Apple-inspired Single-Page Web Application designed to take learners from zero programming knowledge to advanced systems architecture in C (`C17`). It pairs rigorous computer science education with scroll-driven storytelling, magnetic micro-interactions, real-time hexadecimal RAM & pointer visualizers, and gamified progression.

---

## ✨ Key Highlights & Architecture

### 1. Apple-Grade Motion & Aesthetics
- **Deep Obsidian Dark Mode (`#050814`)** paired with glowing Neon Emerald (`#10b981`), Electric Cyan (`#06b6d4`), and Soft Purple (`#8b5cf6`) accents.
- **Frosted Glassmorphism (`backdrop-filter: blur(16px)`)**, cursor-reactive spotlight borders, and magnetic button micro-interactions.
- **Scroll-Driven Storytelling (`IntersectionObserver`)** with smooth `cubic-bezier(0.16, 1, 0.3, 1)` reveal transitions and a top scroll progress indicator.
- **Physics-Based Particle Confetti & Web Audio Synthesizer** for tactile feedback on compiling code, cracking the Secret Vault, and unlocking ranks/badges.

### 2. Interactive Visualizers & Labs
- **The Pointer Visualizer (Module 5 & Dedicated Lab):** Watch animated SVG Bezier curves connect `int *ptr` and `int **pptr` to live 64-bit hexadecimal RAM cells (`0x7fff5fbff8a0`), execute live dereference mutations (`*ptr = val`), step through pointer arithmetic (`ptr++`, `ptr--`), and animate two-pointer in-place array reversal.
- **Live LIFO Call Stack & Recursion Animator (Module 3):** Watch stack frames push and pop with `RSP` register telemetry during recursive `factorial(n)` calls.
- **The Secret Vault 4-Digit Loop Cracker (Module 2 Gamified Challenge):** Crack a 4-digit vault code within 5 tries using binary-search telemetry hints or deploy an animated C `for`-loop brute-force solver.
- **Dynamic Heap Arena (Module 6):** Allocate, resize, and free Heap blocks (`malloc`, `calloc`, `realloc`, `free`) while monitoring for memory leaks.
- **Struct & Persistent File I/O Inspector (Module 7):** Mutate `typedef struct Task` records via `ptr->completed` and inspect the synced `/home/user/todos.txt` virtual disk stream.

### 3. Complete 7-Module Curriculum (Zero to Advanced)
1. **Module 1: Awakening (Basics & Syntax)** — Compilation pipeline, `printf`, `scanf`, `int`/`float`/`char`, and *The Smart Tip & Age Calculator*.
2. **Module 2: The Flow State (Logic & Control)** — `if/else`, `switch`, `for`/`while`/`do-while`, `break`/`continue`, *The Secret Vault*, and *Interactive CLI Calculator*.
3. **Module 3: Modular Magic (Functions & Scope)** — Prototypes, Call Stack frames, Recursion, and *Rock, Paper, Scissors Arena*.
4. **Module 4: The Data Matrix (Arrays & Strings)** — Contiguous 1D/2D arrays, `\0` null terminator, and *The Secret Agent Caesar Cipher*.
5. **Module 5: The Master Key (Pointers — Unlocked!)** — `&` address-of, `*` dereference, pointer arithmetic, and *In-Place Array Reverser using Pointers*.
6. **Module 6: Raw Power (Dynamic Memory Allocation)** — Stack vs. Heap, `malloc`, `calloc`, `realloc`, `free`, and *Dynamic Student Grade Management System*.
7. **Module 7: Architecting Systems (Structs & File I/O)** — `struct`, `typedef`, `->` operator, `FILE *` streams, and *Mini To-Do List Capstone with Persistent File Storage*.

### 4. Dual-Mode Pedagogy: CS Rigor + "Explain Like I'm 5 (ELI5)"
- Every module features a 1-click **ELI5 Mode Toggle** that transforms dense systems theory into intuitive visual analogies (e.g., *High-Tech Robotic Warehouse*, *Cafeteria Trays & Russian Dolls*, *Treasure Chest & GPS Map*, *Renting U-Haul Storage Units*).
