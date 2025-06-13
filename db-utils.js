// Shared IndexedDB utility functions for extension
// Note: Content scripts and extension scripts have separate IndexedDB databases.

const STORE_NAME = 'cssByHost';
const DB_NAME = 'customIceDB';
const KEY_NAME = 'hostname';

// Promise-based IndexedDB open
function openDbPromise() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: KEY_NAME });
            }
        };
        request.onsuccess = function(event) {
            resolve(event.target.result);
        };
        request.onerror = function() {
            reject('IndexedDB error');
        };
    });
}

// Load CSS for a given hostname from IndexedDB
function loadCssForHost(hostname) {
    return openDbPromise().then(db => {
        return new Promise((resolve) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const getReq = store.get(hostname);
            getReq.onsuccess = () => {
                resolve(getReq.result ? getReq.result.css : '');
            };
            getReq.onerror = () => resolve('');
        });
    });
}

// Save CSS for a given hostname to IndexedDB
function saveCssForHost(hostname, css) {
    return openDbPromise().then(db => {
        return new Promise((resolve) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            store.put({ hostname, css });
            tx.oncomplete = () => resolve();
            tx.onerror = () => resolve();
        });
    });
}