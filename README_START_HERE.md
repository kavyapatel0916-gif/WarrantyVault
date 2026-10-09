# WarrantyVault — Project Setup

This folder contains my project notes and the instructions I'll use in Antigravity. It doesn't contain the completed application yet. Antigravity should create the source code inside this same folder.

## Getting started

1. Extract the ZIP and open the `WarrantyVault_Human_Style` folder in Antigravity. You can rename the folder to `WarrantyVault` first.
2. Check that `AGENTS.md`, `docs/` and `prompts/` are inside the folder you opened. The `.agents` folder may be hidden.
3. Open `prompts/MASTER_PROMPT.md`, copy its contents and send them in Antigravity's Agent chat.
4. Let Antigravity create the project in stages. Review what it changes and give permissions only when you understand the commands.
5. Use `prompts/RESUME_PROMPT.md` if the session ends partway through.

Don't make a second `WarrantyVault/` folder inside this one. The project code should sit next to `docs/` and `prompts/`.

## What's in this folder

```text
WarrantyVault/
├── AGENTS.md                   # General project instructions
├── README_START_HERE.md        # How to use this pack
├── .agents/
│   └── rules/
│       ├── frontend-quality.md
│       └── secure-backend.md
├── docs/
│   ├── PROJECT_SPEC.md         # What the application should do
│   ├── ARCHITECTURE.md         # Proposed folders, models and routes
│   ├── IMPLEMENTATION_PLAN.md  # Work order and progress tracker
│   └── ACCEPTANCE_TESTS.md     # What I'll test before submission
└── prompts/
    ├── MASTER_PROMPT.md        # Paste this to start building
    └── RESUME_PROMPT.md        # Paste this to continue later
```

Antigravity should add `frontend/`, `backend/`, `docker-compose.yml`, `.env.example`, `README.md` and the source files when it starts implementation.

## What I need for college

- A working application, not just designs or documentation.
- MongoDB data that can be created, viewed, edited and deleted.
- Git commits showing the project's development.
- A Docker image for the application and a working Docker Compose setup.
- A live demonstration in mid-November 2026.

For the demo, I want to start Docker, register a user, add a product, upload a receipt, edit a warranty, save a repair record and show that data is still there after restarting the containers.

**A note about testing:** Antigravity may not have Docker or MongoDB available in its environment. If it can't run something, it should say so and give me the command to run myself. It shouldn't say a test passed unless it actually did.

Do not put real passwords, JWT secrets or personal receipts in Git. Don't delete Docker volumes when testing persistence.
