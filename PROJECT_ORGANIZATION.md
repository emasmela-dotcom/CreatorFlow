# CreatorFlow Project Organization

## Important Rule: Keep Everything Within the Project

**When working on CreatorFlow, ALL features, bots, and functionality should be created WITHIN this project, not as separate projects.**

## Current Bot Structure

Bots are integrated into CreatorFlow at:
- **API Routes:** `src/app/api/bots/`
- **Components:** `src/components/bots/`
- **Documentation:** `BOT_SYSTEM_DOCUMENTATION.md`, `BOT_USAGE_GUIDE.md`, `BOT_TESTING_GUIDE.md`

## Existing Bots in CreatorFlow

1. Content Assistant Bot
2. Content Curation Bot
3. Engagement Analyzer Bot
4. Analytics Coach Bot
5. Trend Scout Bot
6. Scheduling Assistant Bot

## Archived Separate Bot Projects

The following bots were incorrectly created as separate projects in `digital-hermit/projects/`:
- content-writer-bot
- customer-service-bot
- email-sorter-bot
- expense-tracker-bot
- invoice-generator-bot
- meeting-scheduler-bot
- product-recommendation-bot
- sales-lead-qualifier-bot
- social-media-manager-bot
- website-chat-bot

**These should have been created within CreatorFlow from the start.**

## Going Forward

✅ **DO:** Create all features, bots, and functionality within CreatorFlow
❌ **DON'T:** Create separate projects for features that belong to CreatorFlow

## Project Structure

```
CreatorFlow/
├── src/
│   ├── app/
│   │   └── api/
│   │       └── bots/          ← All bot APIs here
│   └── components/
│       └── bots/              ← All bot components here
├── BOT_SYSTEM_DOCUMENTATION.md
├── BOT_USAGE_GUIDE.md
└── BOT_TESTING_GUIDE.md
```

