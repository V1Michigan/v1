# V1 at Michigan

This is the code repository for the website. Serverless frontend built with Next.js + Tailwind CSS. Hosted on Netlify.

## How to work on this Project

1. First clone the repository: `git clone https://github.com/V1Michigan/v1.git`.
2. Make sure you enter the repository through terminal `cd <FilePath>/v1`.
3. Install dependencies: `yarn install`. **We DO NOT use npm for this.**
4. Begin Devving: `yarn dev`. This will allow you to access a dev version of the site @ `localhost:3000` that will update automatically as you save files.
5. Create a new branch for your NEW feature: `git checkout -b [FEATURE_NAME]`. If you want to go to an existing feature: `git checkout [FEATURE_NAME]`.
6. Ask another team member for the latest `.env` file.
7. When you finish a part of your feature and wish to push the changes to the remote repository:
8. `git add [changed_files]` (replace `changed_files` with the actual file names you changed)
9. `git commit -m "meaningful commit message goes here"`
10. `git push --set-upstream origin [FEATURE_NAME]` (the next time you push to this branch you can just say `git push`).

## Linting and Code Quality

We use ESLint + Prettier to lint our code and enforce consistent style. To make this process smoother, we've set up:

1. **Pre-commit hooks**: Automatically lint and format your code when you commit changes. This uses Husky and lint-staged to ensure code quality without disrupting your workflow.

2. **Non-blocking CI**: Our GitHub Actions workflow checks for linting issues but won't block builds due to formatting problems.

For manual linting:
- Use `yarn lint:check` to check for linting/style errors
- Use `yarn lint:fix` to automatically fix linting issues

We recommend using an [ESLint plugin for your editor](https://eslint.org/docs/user-guide/integrations) to lint and format your code as you write it.
- VSCode: [extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), [tutorial](https://www.digitalocean.com/community/tutorials/linting-and-formatting-with-eslint-in-vs-code)

See the [CONTRIBUTING.md](./CONTRIBUTING.md) file for more detailed information about code standards and workflow.
