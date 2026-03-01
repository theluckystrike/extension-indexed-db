/**
 * Extension DB — IndexedDB wrapper with migrations and typed queries
 */
export class ExtensionDB {
    private dbName: string;
    private version: number;
    private db: IDBDatabase | null = null;
    private stores: Array<{ name: string; keyPath: string; indexes?: Array<{ name: string; keyPath: string; unique?: boolean }> }> = [];

    constructor(name: string, version: number = 1) { this.dbName = name; this.version = version; }

    /** Define an object store */
    defineStore(name: string, keyPath: string, indexes?: Array<{ name: string; keyPath: string; unique?: boolean }>): this {
        this.stores.push({ name, keyPath, indexes }); return this;
    }

    /** Open database connection */
    async open(): Promise<this> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                this.stores.forEach((s) => {
                    if (!db.objectStoreNames.contains(s.name)) {
                        const store = db.createObjectStore(s.name, { keyPath: s.keyPath, autoIncrement: s.keyPath === 'id' });
                        s.indexes?.forEach((idx) => store.createIndex(idx.name, idx.keyPath, { unique: idx.unique }));
                    }
                });
            };
            request.onsuccess = () => { this.db = request.result; resolve(this); };
            request.onerror = () => reject(request.error);
        });
    }

    /** Put a record */
    async put<T>(storeName: string, record: T): Promise<IDBValidKey> {
        return this.tx(storeName, 'readwrite', (store) => store.put(record));
    }

    /** Get a record by key */
    async get<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
        return this.tx(storeName, 'readonly', (store) => store.get(key));
    }

    /** Get all records */
    async getAll<T>(storeName: string): Promise<T[]> {
        return this.tx(storeName, 'readonly', (store) => store.getAll());
    }

    /** Delete a record */
    async delete(storeName: string, key: IDBValidKey): Promise<void> {
        return this.tx(storeName, 'readwrite', (store) => store.delete(key));
    }

    /** Clear an object store */
    async clear(storeName: string): Promise<void> {
        return this.tx(storeName, 'readwrite', (store) => store.clear());
    }

    /** Count records */
    async count(storeName: string): Promise<number> {
        return this.tx(storeName, 'readonly', (store) => store.count());
    }

    /** Query by index */
    async getByIndex<T>(storeName: string, indexName: string, value: IDBValidKey): Promise<T[]> {
        return this.tx(storeName, 'readonly', (store) => store.index(indexName).getAll(value));
    }

    /** Paginated cursor query */
    async paginate<T>(storeName: string, page: number, pageSize: number): Promise<{ data: T[]; total: number }> {
        const total = await this.count(storeName);
        const data: T[] = [];
        return new Promise((resolve) => {
            const tx = this.db!.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            let skipped = 0; const skip = page * pageSize;
            const cursor = store.openCursor();
            cursor.onsuccess = () => {
                const c = cursor.result;
                if (!c || data.length >= pageSize) { resolve({ data, total }); return; }
                if (skipped < skip) { skipped++; c.continue(); return; }
                data.push(c.value as T); c.continue();
            };
        });
    }

    /** Batch put */
    async putBatch<T>(storeName: string, records: T[]): Promise<void> {
        const tx = this.db!.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        records.forEach((r) => store.put(r));
        return new Promise((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); });
    }

    /** Close database */
    close(): void { this.db?.close(); this.db = null; }

    private tx<T>(storeName: string, mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest): Promise<T> {
        return new Promise((resolve, reject) => {
            const tx = this.db!.transaction(storeName, mode);
            const req = operation(tx.objectStore(storeName));
            req.onsuccess = () => resolve(req.result as T);
            req.onerror = () => reject(req.error);
        });
    }
}
