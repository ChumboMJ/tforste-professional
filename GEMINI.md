# Project Rules & Preferences

## Git Commit & Merge Guidelines
- **Descriptive Merge Commit Messages**: When merging branches into `main` (e.g. `git merge develop`), do not use default generic commit messages like `Merge branch 'develop'`. Always provide a descriptive commit message via `-m` that includes a short, high-level summary of the changes included in that merge.
  - **Format**: `git merge <branch> -m "Merge branch '<branch>': <short high-level summary of changes>"`
  - **Example**: `git merge develop -m "Merge branch 'develop': Release 70% code coverage quality gate & updated architecture docs"`

## CI/CD & Deployment Notification Guidelines
- **Direct GitHub Actions Links**: Whenever deploying to production or pushing to `main`, always provide a direct clickable markdown link to the GitHub Actions workflow runs page (`https://github.com/ChumboMJ/tforste-professional/actions`) so the user can easily monitor pipeline progress with a single click.

## CLI Command Approval Preferences
- **Auto-Approve npm & dotnet Commands**: Automatically execute development, build, and test commands (`npm` and `dotnet` commands such as `npm run build`, `npm test`, `dotnet test`, `dotnet build`) seamlessly without asking for manual confirmation prompts.

