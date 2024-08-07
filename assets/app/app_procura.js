/*var emergente = document.getElementById('emergente').addEventListener('click', () => {
    window.open("cotizador.html", "VentanaEmergente", "width=600,height=400");
})
*/
/*
#######################################
# Mostrar lista de cotizaciones en bd #
#######################################
*/
document.addEventListener('DOMContentLoaded', () => {
    abrirIndexedDB();
    function validarNumero() {
        const input = document.getElementById('clave');
        if (input.value < 1) {
            input.value = 1;
        }
    }
});

   

/*
#######################################
# cotizaciones de productos           #
#######################################
*/
let request_openDB_cotizador = indexedDB.open('Cotizador', 2);

request_openDB_cotizador.onsuccess = (event) => { 
    const dbrequest_openDB_cotizador = event.target.result;
    console.log('dbrequest_openDB_cotizador', dbrequest_openDB_cotizador);

    document.getElementById('buscarEnBD').addEventListener('click', () => {
        
        var clave = parseInt(document.getElementById('clave').value, 10);
        const transaction = dbrequest_openDB_cotizador.transaction('tablas de productos', 'readonly');
        const store = transaction.objectStore('tablas de productos');
        const request = store.get(clave);
    
        request.onsuccess = function(event) {
            const tableData = event.target.result;
            const resultadosDiv = document.getElementById('div-resultados');
            resultadosDiv.innerHTML = '';
    
            if (tableData) {
                const table = document.createElement('table');
                table.innerHTML = `
                    <thead>
                        <tr>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Proveedor</th>
                        <th>País</th>
                        <th>Comentario</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                `;
    
                const tbody = table.getElementsByTagName('tbody')[0];
                tableData.forEach(row => {
                    const nuevaFila = tbody.insertRow();
    
                    const celdacodigo = nuevaFila.insertCell(0);
                    const celdanombre = nuevaFila.insertCell(1);
                    const celdadescripcion = nuevaFila.insertCell(2);
                    const celdacantidad = nuevaFila.insertCell(3);
                    const celdaprecio = nuevaFila.insertCell(4);
                    const celdaproveedor = nuevaFila.insertCell(5);
                    const celdapais = nuevaFila.insertCell(6);
                    //const celdacomentario = nuevaFila.insertCell(7);

                    celdacodigo.textContent = row.codigo;
                    celdanombre.textContent = row.nombre;
                    celdadescripcion.textContent = row.descripcion;
                    celdacantidad.textContent = row.cantidad;
                    celdaprecio.textContent = row.precio;
                    celdaproveedor.textContent = row.proveedor;
                    celdapais.textContent = row.pais;
                    //celdacomentario.textContent = row.comentario;

                    // Crear la celda de acción con el botón de comentar
                    var celdaAccion = document.createElement('td');
                    var comentariotextarea = document.createElement('textarea');
                    comentariotextarea.placeholder = 'comentarios...';
                    comentariotextarea.textContent = row.comentario;
                    comentariotextarea.addEventListener('change', function () {
                        comentariotextarea.textContent = comentariotextarea.value;
                        console.log('comentarios: ' + comentariotextarea.value);
                    });
                    celdaAccion.appendChild(comentariotextarea);
                    nuevaFila.appendChild(celdaAccion);

                    tbody.appendChild(nuevaFila);
                });
    
                const heading = document.createElement('h3');
                heading.textContent = `Resultados para clave ${clave}`;
                resultadosDiv.appendChild(heading);
                resultadosDiv.appendChild(table);
                
            } else {
                resultadosDiv.textContent = `No se encontraron datos para la clave ${clave}`;
            }
        };
    
        request.onerror = function(event) {
            console.error('Error al obtener los datos:', event.target.errorCode);
        };
    });
}

function abrirIndexedDB() {
    var solicitud = window.indexedDB.open('Cotizador', 2);

    solicitud.onerror = function(evento) {
        console.error("Error al abrir la base de datos:", evento.target.errorCode);
    };

    solicitud.onsuccess = function(evento) {
        var db = evento.target.result;
        mostrarKeys(db);
    };

    solicitud.onupgradeneeded = function(evento) {
        var db = evento.target.result;
        db.createObjectStore('items', { keyPath: 'id', autoIncrement: true });
    };
}

// Obtén todas las keys del almacén de objetos y muéstralas en el div
function mostrarKeys(db) {
    var transaction = db.transaction(['tablas de productos'], 'readonly');
    var objectStore = transaction.objectStore('tablas de productos');
    var solicitud = objectStore.getAllKeys();

    solicitud.onsuccess = function(evento) {
        var keys = evento.target.result;
        var keyListDiv = document.getElementById('pendientes-tablas__body');
        keyListDiv.innerHTML = ''; // Limpiar el contenido anterior

        if (keys.length === 0) {
            keyListDiv.innerHTML = '<p>No hay keys en el almacén de objetos.</p>';
        } else {
            var tr = document.createElement('tbody');
            keys.forEach(function(key) {
                var td = document.createElement('tr');
                td.textContent = key;
                tr.appendChild(td);
            });
            keyListDiv.appendChild(tr);
        }
    };

    solicitud.onerror = function(evento) {
        console.error('Error al obtener las keys del almacén de objetos:', evento.target.error);
    };
}
