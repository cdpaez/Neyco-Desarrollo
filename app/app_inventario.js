// Abrir o crear la base de datos
var request = window.indexedDB.open("inventario", 1);
var db;

request.onerror = function (ev) {
  console.log("Error al abrir la base de datos");
};

request.onupgradeneeded = function(ev) {
    var db = ev.target.result;
    var objectStore = db.createObjectStore("prd inventario", { keyPath: "codigo"});
    objectStore.createIndex('codigo','codigo',{unique:false});
};

request.onsuccess = function(ev) {
    db = request.result;
    console.log("Base de datos abierta correctamente");
    mostrarProductos();
};

function agregarDatos() {
    var codigo = document.getElementById("codigo").value;
    var nombre = document.getElementById("nombre").value;
    var descripcion = document.getElementById("descripcion").value;
    var cantidad = document.getElementById("cantidad").value;
    var precio = document.getElementById("precio").value;
    var proveedor = document.getElementById("proveedor").value;
    var pais = document.getElementById("pais").value;

  var transaction = db.transaction(["prd inventario"], "readwrite");
  var objectStore = transaction.objectStore("prd inventario");

    var request = objectStore.put({ codigo: codigo, nombre: nombre, descripcion: descripcion, cantidad: cantidad, precio: precio, proveedor: proveedor, pais: pais });

  request.onsuccess = function(ev) {
    console.log("Datos agregados correctamente");
    // Puedes realizar aquí cualquier acción adicional después de agregar los datos
  };

  request.onerror = function(ev) {
    console.log("Error al agregar los datos");
  };
}
function mostrarProductos() {
    // Crear una transacción de solo lectura
    var transaction = db.transaction(["prd inventario"], "readonly");
    var objectStore = transaction.objectStore("prd inventario");
    var productTableBody = document.getElementById("productTableBody");

    // Limpiar el cuerpo de la tabla antes de agregar los nuevos datos
    productTableBody.innerHTML = "";

    // Recuperar todos los objetos del almacén de objetos "productos"
    var getAllRequest = objectStore.getAll();

    getAllRequest.onsuccess = function(event) {
        var productos = getAllRequest.result;

        // Iterar sobre los productos y agregarlos a la tabla
        productos.forEach(function(producto) {
            var row = productTableBody.insertRow();


            var codigoCell = row.insertCell(0);
            var nombreCell = row.insertCell(1);
            var descripcionCell = row.insertCell(2);
            var cantidadCell = row.insertCell(3);
            var precioCell = row.insertCell(4);
            var proveedorCell = row.insertCell(5);
            var paisCell = row.insertCell(6);
            var actionCell = row.insertCell(7);

            codigoCell.textContent = producto.codigo;
            nombreCell.textContent = producto.nombre;
            descripcionCell.textContent = producto.descripcion;
            cantidadCell.textContent = producto.cantidad;
            precioCell.textContent = producto.precio;
            proveedorCell.textContent = producto.proveedor;
            paisCell.textContent = producto.pais;

            var deleteButton = document.createElement("button");
                deleteButton.textContent = "Eliminar";
                deleteButton.addEventListener("click", function() {
                    eliminarProducto(producto.codigo);
                    row.remove(); // Eliminar la fila de la tabla
                });

            actionCell.appendChild(deleteButton);
        });
    };
}
function eliminarProducto(codigo) {
    var transaction = db.transaction(["prd inventario"], "readwrite");
    var objectStore = transaction.objectStore("prd inventario");
    var deleteRequest = objectStore.delete(codigo);

    deleteRequest.onsuccess = function(event) {
        console.log("Producto eliminado correctamente");
        location.reload();
    };

    deleteRequest.onerror = function(event) {
        console.log("Error al eliminar el producto");
    };
}
function buscarProducto() {
    var codigo = document.getElementById("codigoInput").value.trim();

    if (codigo === "") {
        alert('Ingrese un codigo para buscar');
        console.log("Ingrese un código para buscar.");
        return;
    }

    var transaction = db.transaction(["prd inventario"], "readonly");
    var objectStore = transaction.objectStore("prd inventario");
    var searchResultTableBody = document.getElementById("searchResultTableBody");

    searchResultTableBody.innerHTML = "";

    var index = objectStore.index("codigo");
    var getRequest = index.getAll(codigo);

    getRequest.onsuccess = function(event) {
        var productos = getRequest.result;

        productos.forEach(function(producto) {
            var row = searchResultTableBody.insertRow();
            var codigoCell = row.insertCell(0);
            var nombreCell = row.insertCell(1);
            var descripcionCell = row.insertCell(2);
            var cantidadCell = row.insertCell(3);
            var precioCell = row.insertCell(4);
            var proveedorCell = row.insertCell(5);
            var paisCell = row.insertCell(6);
            var actionCell = row.insertCell(7);

            codigoCell.textContent = producto.codigo;
            nombreCell.textContent = producto.nombre;
            descripcionCell.textContent = producto.descripcion;
            cantidadCell.textContent = producto.cantidad;
            precioCell.textContent = producto.precio;
            proveedorCell.textContent = producto.proveedor;
            paisCell.textContent = producto.pais;

            var deleteButton = document.createElement("button");
            deleteButton.textContent = "Eliminar";
            deleteButton.addEventListener("click", function() {
                eliminarProducto(producto.codigo);
                row.remove(); // Eliminar la fila de la tabla
            });

            actionCell.appendChild(deleteButton);
        });

        if (productos.length === 0) {
            console.log("No se encontraron productos con el código proporcionado.");
        }
    };
}