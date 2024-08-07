document.addEventListener('DOMContentLoaded', () => {
    
});

/*
#######################################
# Iniciar la base de datos inventario #
#######################################
*/
let request_openDB_inventario = indexedDB.open("inventario");
    /*
    -----------------------------------
    ---- si la peticion es exitosa-----
    -----------------------------------
    */
request_openDB_inventario.onsuccess = (event) => {

    let dbrequest_openDB = event.target.result;
    console.log('dbrequest_openDB', dbrequest_openDB);

    let btn_buscar = document.getElementById('btn_buscar').addEventListener('click', function () {
        var codigo = document.getElementById("codigoInput").value.trim();
        if (codigo === "") {
            alert('No ingresaste ningun código');
            console.log("Ingrese un código para buscar.");
            return;
        }
        let transaction = dbrequest_openDB.transaction(["prd inventario"], "readonly");
        let store = transaction.objectStore("prd inventario");
        
        let index = store.index("codigo");
        console.log('index',index);
        let requestGetProduct = index.getAll(codigo);
        console.log('requestGetProduct', requestGetProduct);
        
            /*
            -----------------------------------
            ---- si la peticion es exitosa-----
            -----------------------------------
            */
            requestGetProduct.onsuccess = (event) => {
                let dbrequestGetProduct = event.target.result;
                console.log('dbrequestGetProduct', dbrequestGetProduct);
                if (!dbrequestGetProduct || dbrequestGetProduct.length === 0) { 
                    alert('No existe el producto buscado');
                    console.log("No se encontraron productos con el código ingresado.");
                    // Aquí puedes mostrar un mensaje al usuario informándole que no se encontraron productos
                    return;
                }
                dbrequestGetProduct.forEach((producto) => {
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
                    
                    var mostrar = [{
                        codigo: producto.codigo,
                        nombre: producto.nombre,
                        descripcion: producto.descripcion,
                        cantidad: producto.cantidad,
                        precio: producto.precio,
                        proveedor: producto.proveedor,
                        pais: producto.pais
                    }];
                    console.log('producto', typeof (producto.codigo));
                    console.log('mostrar', typeof (mostrar));
                    console.log('mostrar', mostrar);

                    var addButton = document.createElement("button");
                    addButton.textContent = "Agregar";
                    //funcion que agrega objetos a la tabla cotizacion
                    addButton.addEventListener("click", function () {
                        agregarProductos(mostrar);
                        row.remove(); // Eliminar la fila de la tabla
                        
                    });
                    actionCell.appendChild(addButton);
                });
            };
        
    });
}

function agregarProductos(producto) {
    console.log(producto);
    var tbody = document.getElementById('productTableBody');

    producto.forEach(item => {
        const fila = document.createElement('tr');

        const celdaCodigo = document.createElement('td');
        celdaCodigo.textContent = item.codigo;
        fila.appendChild(celdaCodigo);

        const celdanombre = document.createElement('td');
        celdanombre.textContent = item.nombre;
        fila.appendChild(celdanombre);

        const celdaDescripcion = document.createElement('td');
        celdaDescripcion.textContent = item.descripcion;
        fila.appendChild(celdaDescripcion);

        const celdaCantidad = document.createElement('td');
        celdaCantidad.textContent = item.cantidad;
        fila.appendChild(celdaCantidad);

        const celdaPrecio = document.createElement('td');
        celdaPrecio.textContent = item.precio;
        fila.appendChild(celdaPrecio);

        const celdaProveedor = document.createElement('td');
        celdaProveedor.textContent = item.proveedor;
        fila.appendChild(celdaProveedor);

        const celdaPais = document.createElement('td');
        celdaPais.textContent = item.pais;
        fila.appendChild(celdaPais);
        
        tbody.appendChild(fila);

        /*
        ###################################
        # boton eliminar y comentario     #
        ###################################
        */

        // Crear la celda de acción con el botón de comentar
        var celdaAccion = document.createElement('td');
        var comentariotextarea = document.createElement('textarea');
        comentariotextarea.placeholder = 'comentarios...';
        comentariotextarea.addEventListener('change', function () {
            comentariotextarea.textContent = comentariotextarea.value;
            console.log('comentarios: ' + comentariotextarea.value);
        });
        celdaAccion.appendChild(comentariotextarea);
        fila.appendChild(celdaAccion);

        tbody.appendChild(fila);


        // Crear la celda de acción con el botón de eliminar
        var celdaAccion = document.createElement('td');
        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', function() {
            tbody.removeChild(fila);
        });
        celdaAccion.appendChild(deleteButton);
        fila.appendChild(celdaAccion);

        tbody.appendChild(fila);
    })
}

/*
        ###################################
        # crear tablas para BD cotizador  #
        ###################################
*/

let request_openDB_cotizador = indexedDB.open('Cotizador', 2);

request_openDB_cotizador.onerror = (event) => {
    console.error('Database error:', event.target.errorCode);
};

request_openDB_cotizador.onupgradeneeded = (event) => {
    const dbrequest_openDB_cotizador = event.target.result;
    const objectStore = dbrequest_openDB_cotizador.createObjectStore('tablas de productos', { keyPath: 'id', autoIncrement: true });
};
/*
-----------------------------------
---- si la peticion es exitosa-----
-----------------------------------
*/
//corregir algunas cosas previas
request_openDB_cotizador.onsuccess = (event) => {
    const dbrequest_openDB_cotizador = event.target.result;
    var btn_agregarTablaProcura = document.getElementById('btn_procura');

    btn_agregarTablaProcura.addEventListener('click', () => {

        const transaction = dbrequest_openDB_cotizador.transaction('tablas de productos', 'readwrite');
        const store = transaction.objectStore('tablas de productos');
        // Recorrer las filas de la tabla y agregar los datos a un array
        const filas = document.getElementById('productTable').getElementsByTagName('tbody')[0].rows;
        
        if (filas.length == 0) {
            alert('no hay datos');
            return;
        }
        
        const tableData = [];
        for (let i = 0; i < filas.length; i++) {

            const fila = filas[i];
            
            const codigo = fila.cells[0].textContent;
            const nombre = fila.cells[1].textContent;
            const descripcion = fila.cells[2].textContent;
            const cantidad = fila.cells[3].textContent;
            const precio = fila.cells[4].textContent;
            const proveedor = fila.cells[5].textContent;
            const pais = fila.cells[6].textContent;
            const comentario = fila.cells[7].textContent;

            const data = { codigo, nombre, descripcion, cantidad, precio, proveedor, pais, comentario };
            tableData.push(data);
            
        }
        // Guardar el array en IndexedDB
        store.put(tableData);

        console.log(typeof (tableData));
        console.log(tableData);
        document.getElementById('productTableBody').innerHTML = ""; 
    })
    
}
