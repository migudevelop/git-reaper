# Git Reaper

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E=18.0.0-brightgreen.svg)](https://nodejs.org/)

## Description

Git Reaper is a command-line interface (CLI) tool designed to help developers manage their local Git branches efficiently. It allows users to list, review, and delete old or unused branches with ease, ensuring a cleaner and more organized workspace.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [License](#license)

---

## Features

- List all local Git branches with detailed information.
- Interactive selection and deletion of branches.
- Confirmation prompts to prevent accidental deletions.
- Colorful and user-friendly CLI output.
- Easy integration with existing Git workflows.

---

## Technologies Used

- **Node.js** (>= 18.x)
- **Commander.js** – CLI command parser
- **Clack** – Interactive CLI prompts
- **Colorette** – Terminal string styling
- **Git** – Underlying version control system

---

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **(Optional) Link the CLI globally:**
   ```bash
   npm link
   ```

---

## Usage

### Run the CLI

```bash
npx git-reaper
# or, if linked globally:
git-reaper
```

### List all branches

```bash
git-reaper
```

### Delete branches interactively

```bash
git-reaper --delete
```

---

## Examples

### Listing Branches

```bash
$ git-reaper
* main (a1b2c3d): Initial commit - John Doe (2 weeks ago) (current branch)
  feature/login (d4e5f6g): Add login page - Jane Smith (1 week ago)
  fix/typo (h7i8j9k): Fix typo in README - John Doe (3 days ago)
```

### Deleting Branches

```bash
$ git-reaper --delete
? Select branches to delete:
  ◯ feature/login (d4e5f6g): Add login page - Jane Smith (1 week ago)
  ◯ fix/typo (h7i8j9k): Fix typo in README - John Doe (3 days ago)
✔ Are you sure you want to delete the selected branches? (y/N)
Branches deleted successfully.
```

---

## License

This project is licensed under the [MIT License](LICENSE).

---
