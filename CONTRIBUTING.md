# Contributing to extension-indexed-db

## Reporting Issues

Before reporting a bug or requesting a feature, please search existing issues to avoid duplicates. When reporting a bug, include:

- A clear description of the issue
- Steps to reproduce the problem
- Your environment details (Node version, browser, extension version)
- A minimal code sample that demonstrates the issue

Use the issue templates provided in the repository to ensure all necessary information is included.

## Development Workflow

1. Fork the repository and create your branch from `main`
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Make your changes following the code style guidelines
5. Build the project: `npm run build`
6. Test your changes thoroughly
7. Commit with a clear, descriptive message
8. Push to your fork and submit a pull request

## Code Style

- Use TypeScript for all new code
- Follow the existing code conventions in the project
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions focused and reasonably sized

## Testing

Ensure your changes work correctly:

- Test in Chrome or a Chromium-based browser
- Test with a real Chrome extension if possible
- Verify all API methods work as expected

The project uses TypeScript. Run `npm run build` to compile and check for errors.

## License

By contributing to extension-indexed-db, you agree that your contributions will be licensed under the MIT License.
