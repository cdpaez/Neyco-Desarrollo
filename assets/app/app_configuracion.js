// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCM6RXotJnksKJaVTuOfI_vtzUio6S_DGE",
  authDomain: "adm-database-bodega.firebaseapp.com",
  projectId: "adm-database-bodega",
  storageBucket: "adm-database-bodega.appspot.com",
  messagingSenderId: "633781104175",
  appId: "1:633781104175:web:663ce6a7cb8188bdb0e0da"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//logica para autorizar usuarios en firebase

const submit = document.getElementById('boton-inicio-sesion');

submit.addEventListener('click', (event)=>{
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        alert('creating account...')
        window.location.href = "registro.html";
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(`mensaje de ${errorMessage}, codigo de error ${errorCode}`);
        // ..
    });

});
