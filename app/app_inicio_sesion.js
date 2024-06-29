var peticion = indexedDB.open('registros', 1);

peticion.onsuccess = function(ev) {
    var db = ev.target.result;
    var formulario = document.getElementById('form1');

    formulario.addEventListener('submit', function(ev) {
        ev.preventDefault();
        
        var transaccion = db.transaction(['usuarios'], 'readonly');
        var almacenDeObjetos = transaccion.objectStore('usuarios');
        
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        var index = almacenDeObjetos.index('email'); // Acceder al índice 'email'
        console.log('email con el cual realizo la busqueda', email);
        var peticion = almacenDeObjetos.get(email);
        console.log('esta es una peticion',peticion);
        peticion.onsuccess = function(event) {
            var usuario = event.target.result;
            console.log('datos que estoy obteniendo',usuario);
            
            var peticion_obtener = index.get(email);
            console.log('resultado de index.get', peticion_obtener);
            if (usuario && usuario.email === email && usuario.password === password) {

                if(usuario.rol === 'admin'){

                    window.location.href = 'inventario.html';
                    console.log('bienvenido admin')

                } else if (usuario.rol === 'cotizador') {
                    
                    console.log('bienvenido cotizador');
                    window.location.href = 'cotizador.html';

                } else if (usuario.rol === 'procura') {
                    
                    console.log('bienvenido procurador');
                    window.location.href = 'procura.html';
                    
                }
                
            } else {
                alert('Email o contraseña incorrectos');
            }
        };
        
        peticion.onerror = function(event) {
            console.error('Error al obtener el usuario:', event.target.error);
        };
    });
};