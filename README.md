# Tracker Expense

<div align="center">

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-4C0827?style=for-the-badge)](LICENSE)

> A lightweight 2-file daily expense tracker built with Vanilla JavaScript (ES6+) and Tailwind CSS for logging spending, managing custom categories, and monitoring live totals.

</div>

---

## Overview

**Tracker Expense** is a client-side personal finance web application designed to keep daily spending organized without external frameworks or build steps. Users can log expenses with inline validation, create personalized categories on the fly, filter entries dynamically, and customize which category subtotals appear in the summary header.

## Tech Stack & Tools

- **Languages:** HTML5, JavaScript (ES6+)
- **Styling:** Tailwind CSS (CDN with custom theme palette)
- **Key JavaScript Concepts:** Function Declarations & Arrow Functions, Object Destructuring, Spread Operator (`...`), `.filter()`, `.map()`, `.find()`, `.reduce()`, `Number()` conversion, and Strict Equality (`===` / `!==`)

## Key Features

- **Add & Validate Expenses:** Rejects empty titles, missing categories, and non-positive amounts with clear on-page error feedback.
- **Custom Category Dropdown:** Styled dropdown menu supporting user-added categories alongside pre-loaded starter categories (`Food`, `Transport`, `Subscription`, `Toiletries`).
- **Dynamic Filtering:** Displays `All` plus the first two active categories and groups additional categories into a uniform `Other` dropdown.
- **Customizable Summary Totals:** Automatically updates the running total and item count, with a `Customize` tray allowing users to toggle which category subtotals are displayed.
- **Responsive Two-Column Layout:** Balanced floating cards styled with a custom Coffee Bean, Midnight Violet, Crimson Violet, and Soft Linen palette.

## Repository Structure

```text
Tracker-Expense/
├── index.html      # Semantic markup and Tailwind CSS layout
├── script.js       # Expense state, ES6 array operations, and DOM rendering
├── .gitignore      # Ignored environment, build, and editor files
├── LICENSE         # MIT License
└── README.md       # Project documentation
```

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rpprudenciado/Tracker-Expense.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd Tracker-Expense
   ```

3. **Run locally:**
   Open `index.html` directly in any modern web browser (no build step or server required).

## Security & Privacy

- Runs entirely in the browser with no backend, API keys, or external data collection.
- User input is escaped before rendering to prevent HTML injection.

## Academic & Project Attribution

- **Proponent:** Rhona-Mae P. Prudenciado
- **Course / Degree:** Web Programming (WEBPROG) / BSIT
- **Institution:** Asia Pacific College (APC)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
