let dbName = 'inventario';
let storeName = 'prd inventario';

let request = indexedDB.open(dbName);

request.onsuccess = function(event) {
    let db = event.target.result;
    let transaction = db.transaction(storeName, 'readonly');
    let objectStore = transaction.objectStore(storeName);

    let allRecords = objectStore.getAll();
    
    allRecords.onsuccess = function() {
        let data = allRecords.result;
        
        // Convertir los datos a formato JSON.
        let jsonData = JSON.stringify(data, null, 2);

        // Crear un enlace para descargar el archivo JSON.
        let blob = new Blob([jsonData], { type: 'application/json' });
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = dbName + '_' + storeName + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
};

request.onerror = function(event) {
    console.error('Error al abrir la base de datos:', event.target.errorCode);
};