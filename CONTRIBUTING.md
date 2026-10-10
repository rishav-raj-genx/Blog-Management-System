# Contributing

Thank you for contributing to the Blog Management System. Contributions should
keep the application secure, maintainable, and consistent across the frontend
and backend.

## Getting started

1. Fork the repository and clone your fork.
2. Create a focused branch from `main`:
   ```bash
   git checkout -b feature/short-description
   ```
3. Follow the setup instructions in the root [README](./README.md).
4. Keep environment files local. Never commit secrets, tokens, or production
   connection strings.

## Making changes

- Keep each change focused on one feature, fix, or documentation improvement.
- Reuse existing components, helpers, and project patterns before adding new
  abstractions.
- Preserve the existing authentication and role-based access-control behavior.
- Validate and authorize requests on the server; do not rely only on frontend
  checks.
- Update documentation when setup, behavior, API endpoints, or configuration
  changes.
- Do not commit generated files, dependency caches, or local `.env` files.

## Checks before opening a pull request

Run the checks relevant to your change:

```bash
cd frontend
pnpm lint
pnpm build
```

The backend currently does not define an automated test script. For backend
changes, manually verify the affected API endpoints and include the verification
steps in the pull request description.

## Pull requests

Pull requests should:

- Explain what changed and why.
- Describe how the change was tested.
- Include screenshots or a short recording for visible UI changes.
- Call out API, database, environment-variable, or security impacts.
- Stay focused and avoid unrelated formatting or refactoring.

Maintainers may request changes when a contribution does not follow the
repository rules or introduces avoidable security, compatibility, or
maintainability risks.
