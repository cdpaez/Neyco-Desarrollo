var excelData = null;

// Función para manejar la selección de archivo
function seleccionarArchivo(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    
    reader.onload = function(e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, {type: 'array'});

        // Supongamos que queremos los datos de la primera hoja
        var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        excelData = XLSX.utils.sheet_to_json(firstSheet);

        console.log("Datos del archivo Excel leídos exitosamente.");
    };

    reader.readAsArrayBuffer(file);
}

// Función para almacenar datos en IndexedDB
function almacenarEnIndexedDB() {
    if (!excelData) {
        console.error("No hay datos para importar. Por favor, selecciona un archivo primero.");
        return;
    }

    var request = window.indexedDB.open("inventario", 1);

    request.onupgradeneeded = function(event) {
        var db = event.target.result;
        var objectStore = db.createObjectStore("prd inventario", { keyPath: "id", autoIncrement: true });
        objectStore.createIndex("codigo","codigo", { unique: false });
    };

    request.onsuccess = function(event) {
        var db = event.target.result;
        var transaction = db.transaction(["prd inventario"], "readwrite");
        var objectStore = transaction.objectStore("prd inventario");

        excelData.forEach(item => {
            objectStore.put(item);
        });

        transaction.oncomplete = function() {
            console.log("Todos los datos se han almacenado exitosamente.");
            alert("Datos importados exitosamente a la base de datos.");
        };

        transaction.onerror = function() {
            console.error("Error al almacenar los datos en IndexedDB.");
        };
    };

    request.onerror = function(event) {
        console.error("Error al abrir la base de datos.");
    };
}