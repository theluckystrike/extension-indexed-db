# extension-indexed-db

A typed IndexedDB wrapper for Chrome extensions with migrations, cursor pagination, and batch operations.

## Overview

extension-indexed-db provides a Promise-based API for IndexedDB in Chrome extensions. It includes schema definition, migrations, typed queries, cursor-based pagination, and batch operations. Built for Manifest V3.

## Installation

```bash
npm install extension-indexed-db
```

## Quick Start

```typescript
import { ExtensionDB } from 'extension-indexed-db';

// Define database schema
const db = new ExtensionDB('my-extension-db', 1)
  .defineStore('users', 'id', [
    { name: 'email', keyPath: 'email', unique: true }
  ])
  .defineStore('settings', 'key');

// Open database
await db.open();

// Put a record
await db.put('users', { id: 1, name: 'Alice', email: 'alice@example.com' });

// Get a record
const user = await db.get('users', 1);

// Get all records
const allUsers = await db.getAll('users');

// Query by index
const byEmail = await db.getByIndex('users', 'email', 'alice@example.com');

// Paginated query
const page = await db.paginate('users', 0, 10);

// Batch put
await db.putBatch('users', [
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Carol', email: 'carol@example.com' }
]);

// Count records
const count = await db.count('users');

// Delete a record
await db.delete('users', 1);

// Clear store
await db.clear('settings');

// Close database
db.close();
```

## API Reference

### Constructor

```typescript
new ExtensionDB(name: string, version: number = 1)
```

Creates a new database instance.

### defineStore

```typescript
defineStore(
  name: string,
  keyPath: string,
  indexes?: Array<{ name: string; keyPath: string; unique?: boolean }>
): this
```

Defines an object store with optional indexes. Must be called before `open()`.

### open

```typescript
open(): Promise<this>
```

Opens the database connection. Creates stores and indexes defined via `defineStore`.

### put

```typescript
put<T>(storeName: string, record: T): Promise<IDBValidKey>
```

Stores a record in the object store.

### get

```typescript
get<T>(storeName: string, key: IDBValidKey): Promise<T | undefined>
```

Retrieves a record by key.

### getAll

```typescript
getAll<T>(storeName: string): Promise<T[]>
```

Retrieves all records from an object store.

### getByIndex

```typescript
getByIndex<T>(storeName: string, indexName: string, value: IDBValidKey): Promise<T[]>
```

Queries records by index value.

### paginate

```typescript
paginate<T>(storeName: string, page: number, pageSize: number): Promise<{ data: T[]; total: number }>
```

Retrieves a page of records using cursor pagination.

### putBatch

```typescript
putBatch<T>(storeName: string, records: T[]): Promise<void>
```

Batch inserts or updates multiple records in a single transaction.

### delete

```typescript
delete(storeName: string, key: IDBValidKey): Promise<void>
```

Deletes a record by key.

### clear

```typescript
clear(storeName: string): Promise<void>
```

Removes all records from an object store.

### count

```typescript
count(storeName: string): Promise<number>
```

Returns the total number of records in an object store.

### close

```typescript
close(): void
```

Closes the database connection.

## Extension Manifest

Add to your `manifest.json`:

```json
{
  "permissions": ["storage"]
}
```

IndexedDB does not require additional permissions in Manifest V3.

## Browser Support

- Chrome 90 and above
- Edge 90 and above
- Firefox 90 and above

## About

Maintained by theluckystrike. Part of the zovo.one ecosystem.

## License

MIT
