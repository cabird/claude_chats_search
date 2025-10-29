// IndexedDB utilities for storing conversation data
App.StorageUtils = {
    DB_NAME: 'ClaudeConversationsDB',
    DB_VERSION: 1,
    STORE_NAME: 'conversations',

    // Open/create the database
    openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                // Create object store if it doesn't exist
                if (!db.objectStoreNames.contains(this.STORE_NAME)) {
                    db.createObjectStore(this.STORE_NAME);
                }
            };
        });
    },

    // Save conversations to IndexedDB (replaces existing data)
    async saveConversations(conversations) {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.STORE_NAME], 'readwrite');
            const store = transaction.objectStore(this.STORE_NAME);

            // Clear existing data first
            const clearRequest = store.clear();

            clearRequest.onsuccess = () => {
                // Add new data
                const addRequest = store.put(conversations, 'data');
                addRequest.onsuccess = () => resolve();
                addRequest.onerror = () => reject(addRequest.error);
            };

            clearRequest.onerror = () => reject(clearRequest.error);
            transaction.oncomplete = () => db.close();
        });
    },

    // Load conversations from IndexedDB
    async loadConversations() {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.STORE_NAME], 'readonly');
            const store = transaction.objectStore(this.STORE_NAME);
            const request = store.get('data');

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
            transaction.oncomplete = () => db.close();
        });
    },

    // Check if data exists in IndexedDB
    async hasStoredData() {
        try {
            const data = await this.loadConversations();
            return data && Array.isArray(data) && data.length > 0;
        } catch (error) {
            console.error('Error checking stored data:', error);
            return false;
        }
    },

    // Delete all data from IndexedDB
    async clearAllData() {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.STORE_NAME], 'readwrite');
            const store = transaction.objectStore(this.STORE_NAME);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
            transaction.oncomplete = () => db.close();
        });
    }
};
