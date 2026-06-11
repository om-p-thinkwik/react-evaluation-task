# Command Palette (Cmd/Ctrl + K)

A lightweight command palette built with React and TypeScript, inspired by tools like VS Code, Linear, and Raycast.

## Features

- Open palette using **Cmd + K** (Mac) or **Ctrl + K** (Windows/Linux)
- Auto-focused search input
- Debounced search for reduced API calls
- Async search with race-condition handling
- Keyboard navigation:
  - ↑ / ↓ to move between results
  - Enter to execute a command
  - Esc to close the palette
- Results grouped by category
- Loading, empty, no-results, and results states
- Automatic scrolling of highlighted items into view
- Visual indication for highlighted and selected commands

---

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS

---

## Running Locally

```bash
npm install
npm run dev
```

Application will start on:

```bash
http://localhost:5173
```

---

## Key Design Decisions

### 1. Debounced Search

Implemented a reusable `useDebounce` hook to avoid triggering a search request on every keystroke.

**Benefits**

- Reduces unnecessary API calls
- Improves perceived performance
- Keeps search logic reusable

---

### 2. Protection Against Stale Async Responses

The provided search API intentionally introduces variable delays.

A request ID mechanism is used to ensure that only the latest response updates the UI.

**Example**

```text
User types:
d → da → dash

Request(d) returns after Request(dash)

Older results are ignored.
```

This prevents stale responses from overwriting newer search results.

---

### 3. Grouped Result Rendering

Results are grouped using `Array.reduce()` based on the provided `group` property.

**Benefits**

- Better visual organization
- Easier navigation
- Matches the assignment requirements

---

### 4. Keyboard-First Experience

The component is designed primarily around keyboard interaction.

Supported actions:

- Cmd/Ctrl + K → Open palette
- ↑ / ↓ → Navigate
- Enter → Execute command
- Esc → Close palette

The currently highlighted item is automatically scrolled into view.

---

## States Covered

### Initial State

```text
Start typing to search commands...
```

### Loading State

```text
Loading...
```

### Results State

Grouped commands are displayed.

### Empty Results State

```text
No commands found
```
