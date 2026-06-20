// Preload runs in the renderer's context before page scripts load, with access to Node
// and a bridge to the main process via contextBridge. It's empty for now — the renderer
// talks to the local Express server over fetch(), the same way it does in development,
// so there's no IPC to expose yet. This is the designated place to add it later (e.g.
// native file dialogs, a "reveal database file" button, etc.).
//
// Named .cjs, not .js, even though the rest of this project uses ES modules
// ("type": "module" in package.json) — Electron's preload context has limited and
// version-dependent support for ES modules, so CommonJS is the safe choice here.
