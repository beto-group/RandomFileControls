# Contribution Guidelines

We welcome contributions to this Datacore component!

## Local Development Workflow

1. This component runs locally within the Datacore environment.
2. Ensure you have the `Datacore` plugin active.
3. Make changes in `src/App.jsx` or `src/index.jsx`.
4. The component uses an HMR polling daemon. Trigger a hot reload by modifying `data/mcp_commands.json` (e.g., set `"action": "reload"` and `"executed": false`).

## Pull Request Process

1. Ensure the code is properly formatted and adheres to BetoOS styling (no emojis in UI, use Obsidian CSS variables).
2. Do not commit any personal environment paths or secrets (run "Beto Clean").
3. Update `README.md` if the component's features or directory structure change.
4. Submit your PR against the `main` branch.
