var peticion_registros = indexedDB.open('registros', 1);


peticion_registros.onupgradeneeded = function(ev) {
    var db_registros = ev.target.result;
    var almacenDeObjetos = db_registros.createObjectStore('usuarios', { keyPath: 'email' });
    almacenDeObjetos.createIndex('email', 'email', { unique: false });
    almacenDeObjetos.createIndex('nombre', 'nombre', { unique: false });
    almacenDeObjetos.createIndex('password', 'password', { unique: false });
};

peticion_registros.onsuccess = function(ev) {
    var db_registros = ev.target.result;
    var formulario = document.getElementById('form');

    formulario.addEventListener('submit', function(ev) {
        ev.preventDefault();
        var password1 = document.getElementById('password1').value;
        var password2 = document.getElementById('password2').value;
        if(password1 !== password2){
            alert('Las contrasenas no coinciden')
        }else{

            //variables que se almacenan en la base de datos
            var password = password1;
            var transaccion = db_registros.transaction(['usuarios'], 'readwrite');
            var almacenDeObjetos = transaccion.objectStore('usuarios');
            var nombre = document.getElementById('nombre').value;
            var email = document.getElementById('email').value;
            var rol = document.getElementById('roles').value;

            // variable en formato objeto lista para ser almacenada
            var registro = { nombre: nombre, password: password, email: email, rol: rol };
            var peticion_registros = almacenDeObjetos.put(registro);


            //resultado de la peticion a la base de datos
            peticion_registros.onsuccess = function(ev) {
                alert('Usuario agregado exitosamente');

                // Almacenar la información de sesión en sessionStorage

                console.log('Registro agregado correctamente', ev.target.result);
            };
            peticion_registros.onerror = function(ev) {
                console.error('Error al agregar el registro:', ev.target.error);
            };
        }
        formulario.reset();
    });
};