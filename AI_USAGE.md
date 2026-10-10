# AI Usage

AI tools may be used as development assistants for this project, but the
contributor remains responsible for every change that is submitted.

## Appropriate uses

AI assistance can help with:

- Exploring the codebase and explaining existing behavior.
- Drafting documentation, tests, and small implementation changes.
- Suggesting debugging steps or alternative approaches.
- Reviewing code for readability, correctness, and common security issues.

## Required review

Before accepting AI-generated output, contributors must:

- Understand what the code does and why it is needed.
- Check that it follows [RULES.md](./RULES.md) and existing project patterns.
- Verify authentication, authorization, validation, and error-handling paths.
- Run the relevant lint, build, and test or manual verification commands.
- Review the final diff and remove unnecessary or speculative changes.

AI output must not be treated as authoritative. It can be incomplete,
incorrect, outdated, or unaware of project-specific requirements.

## Privacy and security

- Do not send passwords, tokens, private keys, database credentials, personal
  data, or other confidential information to AI tools.
- Use representative or redacted examples when discussing sensitive data.
- Do not allow an AI tool to commit secrets or bypass repository security rules.
- Review dependencies, shell commands, and generated configuration carefully
  before running or committing them.

## Attribution and transparency

Contributors should disclose meaningful AI assistance when required by a
course, employer, project, or review process. AI assistance does not replace
human authorship, testing, code review, or responsibility for the submitted
work.
