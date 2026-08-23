# Project notes for Claude / AI agents

## Authorship policy

- **Do not list Claude (or any AI agent) as an author or co-author** on commits or
  pull requests. All work is attributed to Chris Bowers (`CBowers28`,
  `148987810+CBowers28@users.noreply.github.com`).
- **Never add a `Co-Authored-By: Claude ...` trailer** (or any
  `noreply@anthropic.com` co-author) to commit messages.
- **Do not add "Generated with Claude Code" / "🤖 Generated with ..."** lines to
  commit messages or PR descriptions.
- Keep commit messages and PR descriptions focused on the change itself.

This is enforced in tooling via `.claude/settings.json`
(`"includeCoAuthoredBy": false`), but follow the policy regardless of which tool
or environment is used.
