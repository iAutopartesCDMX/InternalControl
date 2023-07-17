import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { auth } from "./firebase.js";
import { showMessage } from "./showMessage.js";

const signInForm = document.querySelector("#iniciar");

signInForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  //console.log("sí pasa el submit")

  const login = document.getElementById("login-form"); //ES LA FUNCIÓN QUE GENERARÁ LA VENTANA DE ELEMENTOS EN BASE DE DATOS DONDE SE HA COLCAOD ESE ID EN EL HTML
  //console.log("Contenedor:", login)

  const email = login["login-email"].value;
  //console.log("Correo:",email)
  const password = login["login-password"].value;
  //console.log("Contraseña:",password)

  try {
    const userCredentials = await signInWithEmailAndPassword(auth, email, password)
    console.log("CREDENCIALES:",userCredentials)
    // reset the form
    login.reset();
    console.log("reinicia formulario")

    // show welcome message
    showMessage("Bienvenido " + userCredentials.user.email);
  } catch (error) {
    if (error.code === 'auth/wrong-password') {
      showMessage("Contraseña Incorrecta", "error")
    } else if (error.code === 'auth/user-not-found') {
      showMessage("Usuario no encontrado", "error")
    } else {
      showMessage("Algo salió mal", "error")
    }
  }
});