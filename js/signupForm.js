// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { auth } from "./firebase.js";
// Your web app's Firebase configuration
const firebaseConfig = {
  // Put you credentials here
  apiKey: "AIzaSyCJu5AFtATruWMJouaP9LB4lrbIv2tAOgY",
  authDomain: "agentes-de-excelencia.firebaseapp.com",
  databaseURL: "https://agentes-de-excelencia-default-rtdb.firebaseio.com",
  projectId: "agentes-de-excelencia",
  storageBucket: "agentes-de-excelencia.appspot.com",
  messagingSenderId: "1013460803165",
  appId: "1:1013460803165:web:f7a3a5789a2d47e816b7b4"
    
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore();
/* 
Se ha vuelto a desplegar ** firebaseConfig ** pues las diferentes versiones 
para el uso de auth y para el registro de nuevos datos se interfieren
entre sí
*/


import { showMessage } from "./showMessage.js";
//import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
//import { auth, saveRegis } from "./firebase.js";

//REGISTRO DE PERSONAL
const saveRegis = (email, nombre, apellidoPaterno, apellidoMaterno) =>
  addDoc(collection(db,"registro"), {email, nombre, apellidoPaterno, apellidoMaterno});


//ESCUCHA DE DOCUMENTO
const signUpForm = document.querySelector("#registrar");

const btniniciar = document.getElementById("btn-iniciar"); //Botón de iniciar sesión
const btnregistrar = document.getElementById("btn-registrar");
const inicarContenedor = document.getElementById("iniciar"); //Espacio para colocar formulario
const registrarContenedor = document.getElementById("registrar"); //Espacio para colocar formulario


signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const signup = document.getElementById("signup-form"); //ES LA FUNCIÓN QUE GENERARÁ LA VENTANA DE ELEMENTOS EN BASE DE DATOS DONDE SE HA COLCAOD ESE ID EN EL HTML
  //console.log("Contenedor:", login)
  
  //DATOS DE AUTH ==> Serán aprobados por admin
  const email = signup["signup-email"].value;
  const password = signup["signup-password"].value;
  const confirmation = signup["signup2-password"].value;


  //DATOS PARA REGISTRO
  const nombre = signup["nombre"].value;
  const apellidoPaterno = signup["apellidoPaterno"].value;
  const apellidoMaterno = signup["apellidoMaterno"].value;
  
  //REGISTRAR NUEVA INFORMACIÓN EN "REGISTRO"
  try {
    if (password === confirmation) {
      const registro = await saveRegis (email, nombre, apellidoPaterno, apellidoMaterno)
      console.log("Registrando información en la nube: " + registro)
    }
  } catch (error){
    console.log("Error registrando información", error)
  }
  

  try {
    if (password === confirmation) { //DESPUÉS DE ACEPTADO EL FORMULARIO     
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      console.log(userCredential)

      // reset the form
      signup.reset();
      // show welcome message
      showMessage("Registrado: " + nombre);


      //REGRESAR ACTIVO A ** INICIAR SESIÓN **
      inicarContenedor.innerHTML = ``;
      registrarContenedor.innerHTML = ``;
      btniniciar.classList.add("boton-activo")
      btnregistrar.classList.remove("boton-activo")
      console.log("agregando clase de activo")
      try {
          console.log("Desplegando inicio de sesión");
          inicarContenedor.innerHTML += `  
            <form class="login-formulario" id="login-form" >
                <h2 class="login-titulo">¡Bienvenida de vuelta!</h2>
                <input 
                    type="text"
                    id="login-email"
                    class="input"
                    placeholder="Correo Electrónico *"
                    autofocus
                    required
                />
                <input 
                    type="password"
                    id="login-password"
                    type="password"
                    class="input"
                    placeholder="Contraseña *"
                    required
                />
                <a href="" class="olvido">¿Olvidaste tu contraseña?</a>
                <input class="boton" id="btn-agt-form" type="submit" ></input>
            </form>`;
      } catch (error) {
      console.log(error);
      }


      //VENTANA MODAAL INFORMATIVA post registro
      const modal = document.querySelector('.modal');
      const closeModal = document.querySelector('.modal_x');
      modal.classList.add('modal--show');

      closeModal.addEventListener('click', (e)=>{
        e.preventDefault();
        modal.classList.remove('modal--show');
      });
    

    } else {
      showMessage("Las contraseñas no coinciden", "error")
    }
    

  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      showMessage("Email no disponible", "error")

    } else if (error.code === 'auth/invalid-email') {
      showMessage("Email inválido", "error")

    } else if (error.code === 'auth/weak-password') {
      showMessage("Contraseña débil", "error")

    } else if (error.code) {
      console.log(error)
      showMessage("Algo salió mal", "error")
    }
  }

});