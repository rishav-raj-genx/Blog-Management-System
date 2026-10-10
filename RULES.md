# Project Rules

These rules apply to all changes in the Blog Management System.

## Code and architecture

- Keep frontend code in `frontend/` and backend code in `backend/`.
- Use the existing React and Vite conventions in the frontend.
- Keep API behavior and authorization decisions in the backend.
- Use clear, descriptive names and small, focused functions and components.
- Avoid duplicating validation, authorization, or business logic.
- Preserve existing public API response shapes unless a change is intentional
  and documented.

## Security

- Never commit credentials, secrets, private keys, or real user data.
- Treat all client input as untrusted and validate it on the server.
- Enforce ownership and admin permissions on every protected operation.
- Do not expose JWT secrets, database credentials, or internal error details.
- Use environment variables for deployment-specific configuration.

## Git and documentation

- Make focused commits with clear messages.
- Do not rewrite shared history or force-push without explicit team approval.
- Update the README or relevant documentation when behavior or setup changes.
- Do not add generated output, dependency directories, or local configuration
  files to the repository.
- Review the complete diff before opening a pull request.

## Validation

At minimum, frontend changes should pass:

```bash
cd frontend
pnpm lint
pnpm build
```

Backend changes should be checked through the affected API flows until an
automated backend test suite is available.
