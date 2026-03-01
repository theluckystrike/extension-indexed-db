# extension-indexed-db — IndexedDB Wrapper for Extensions
> **Built by [Zovo](https://zovo.one)** | `npm i extension-indexed-db`

Schema definition, typed CRUD, index queries, cursor pagination, and batch operations. Replaces the 10MB storage.local limit.

```typescript
import { ExtensionDB } from 'extension-indexed-db';
const db = new ExtensionDB('myapp', 1);
db.defineStore('notes', 'id', [{ name: 'tag', keyPath: 'tag' }]);
await db.open();
await db.put('notes', { id: '1', text: 'Hello', tag: 'work' });
const page = await db.paginate('notes', 0, 20);
```
MIT License
