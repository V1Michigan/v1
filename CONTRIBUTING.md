# Contributing to V1 @ Michigan

Thank you for your interest in contributing to the V1 @ Michigan codebase! This guide will help you set up your development environment and understand our code standards.

## Development Setup

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Create a `.env.local` file with the required environment variables (ask a team member for these)
4. Run the development server with `pnpm dev`

## Pre-commit Hooks

This project uses Husky and lint-staged to automatically format and lint code before committing. This helps maintain code quality and consistency across the codebase.

### What happens when you commit?

When you run `git commit`, the following happens automatically:

1. Husky triggers the pre-commit hook
2. lint-staged runs on your staged files
3. ESLint fixes any auto-fixable linting issues
4. Prettier formats your code according to our style rules
5. If any issues can't be auto-fixed, the commit will fail with an explanation

### Bypassing pre-commit hooks (use sparingly)

In rare cases when you need to bypass the pre-commit hooks (e.g., for a WIP commit), you can use:

```
git commit --no-verify
```

However, please use this sparingly, as the CI pipeline will still check for linting issues.

## Code Style

We follow the Airbnb JavaScript Style Guide with some custom rules. The ESLint and Prettier configurations enforce these standards.

Key points:
- Use double quotes for strings
- Use camelCase for variables and functions
- Use PascalCase for components and types
- Add JSDoc comments for complex functions

## Package Manager

This project uses `pnpm` as the package manager. Please do not use npm or yarn for installing dependencies.

## Pull Request Process

1. Create a new branch for your feature or bugfix
2. Make your changes with appropriate tests
3. Submit a PR against the main branch
4. Request review from at least one team member

Thank you for contributing to V1 @ Michigan!
