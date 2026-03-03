# extension-indexed-db

A simplified IndexedDB wrapper for Chrome extensions with Promise-based API.

## Overview

extension-indexed-db provides a clean, Promise-based API for working with IndexedDB in Chrome extensions. It simplifies the complex native IndexedDB API while maintaining full functionality.

## Installation

```bash
npm install extension-indexed-db
```

## Quick Start

```javascript
import { openDB } from 'extension-indexed-db';

// Open or create database
const db = await openDB('my-extension-db', 1, {
  upgrade(db) {
    // Create object store
    if (!db.objectStoreNames.contains('settings')) {
      db.createObjectStore('settings', { keyPath: 'id' });
    }
  },
});

// Save data
await db.put('settings', { id: 'theme', value: 'dark' });

// Get data
const theme = await db.get('settings', 'theme');

// Get all data
const allSettings = await db.getAll('settings');

// Delete data
await db.delete('settings', 'theme');
```

## API

### openDB(name, version, upgrade?)

Opens or creates an IndexedDB database.

| Param | Type | Description |
|-------|------|-------------|
| name | string | Database name |
| version | number | Database version |
| upgrade | function | Upgrade callback for schema changes |

### db.put(store, value)

Stores a value in an object store.

### db.get(store, key)

Retrieves a value by key.

### db.getAll(store)

Retrieves all values from an object store.

### db.delete(store, key)

Deletes a value by key.

### db.clear(store)

Clears all values in an object store.

## Extension Manifest (MV3)

Add to your `manifest.json`:

```json
{
  "permissions": ["storage"]
}
```

Note: IndexedDB doesn't require additional permissions in MV3.

## Browser Support

- Chrome 90+ (MV3)
- Edge 90+
- Firefox 90+

## License

MIT
