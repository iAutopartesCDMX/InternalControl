import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js"
import { auth, db } from "./firebase.js";
import { loginCheck } from "./loginCheck.js";
import { setupPosts } from "./postList.js";

import './signupForm.js'
import './signinForm.js'
//import './facebookLogin.js'
import './logout.js'
import './postList.js'
//import './googleLogin.js'
import "./z-generales.js"



//ESCUCHAS DE INICIO DE SESIÓN
const btniniciar = document.getElementById("btn-iniciar"); //Botón de iniciar sesión
const btnregistrar = document.getElementById("btn-registrar");

const inicarContenedor = document.getElementById("iniciar"); //Espacio para colocar formulario
const registrarContenedor = document.getElementById("registrar"); //Espacio para colocar formulario


// list for auth state changes
onAuthStateChanged(auth, async (user) => {
  if (user) {
    loginCheck(user);
    try {
      const querySnapshot = await getDocs(collection(db, "personal")); //Para desplegar BD
      setupPosts(querySnapshot.docs);
      
      console.log("Sí hay")
    } catch (error) {
      console.log(error)
    }
  } else {
    setupPosts([]);
    console.log("No hay")
    loginCheck(user);


    //DESPLEGAR INICIO DE SESIÓN AL CLICK --------------- 
      inicarContenedor.innerHTML = ``;
      btniniciar.classList.add("boton-activo")
      try {
        console.log("Auto-despliegue inicio de sesión"); //AUTODESPLIEGUE
        inicarContenedor.innerHTML += `  
          <form class="login-formulario" id="login-form" >
              <h2 class="login-titulo">¡Bienvenido de vuelta!</h2>
              <input 
                  type="text"
                  id="login-email"
                  class="input"
                  placeholder="Correo Electrónico *"
                  autofocus
                  required
              />
              <input 
                  id="login-password"
                  type="password"
                  class="input"
                  placeholder="Contraseña *"
                  required
              />
              <a href="" class="olvido">¿Olvidaste tu contraseña?</a>
              <input class="boton" type="submit" ></input>
          </form>`;
      } catch (error) {
      console.log(error);
      }
  }
});
btniniciar.addEventListener("click", async (e) => { //DESPLIGUE CON BOTÓN
  e.preventDefault();
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
});
btnregistrar.addEventListener("click", async (e) => {
  e.preventDefault();
  registrarContenedor.innerHTML = ``;
  inicarContenedor.innerHTML = ``;

  btnregistrar.classList.add("boton-activo")
  btniniciar.classList.remove("boton-activo")
  console.log("agregando clase de activo: REGISTRAR")

  try {
      console.log("Desplegando registro nuevo");
      registrarContenedor.innerHTML += `  
        <form class="login-formulario" id="signup-form" >
            <h2 class="login-titulo">¡Regístrate!</h2>
            <input 
                type="text"
                id="signup-email"
                class="input"
                placeholder="Correo Electrónico *"
                autofocus
                required
            />
            <input 
                type="password"
                id="signup-password"
                class="input"
                placeholder="Contraseña *"
                required
            />
            <input 
                type="password"
                id="signup2-password"
                class="input"
                placeholder="Confirma contraseña *"
                required
            />
            <input 
                type="text"
                id="nombre"
                class="input"
                placeholder="Nombre(s) *"
                required
            />
            <input 
                type="text"
                id="apellidoPaterno"
                class="input"
                placeholder="Apellido paterno *"
                required
            />
            <input 
                type="text"
                id="apellidoMaterno"
                class="input"
                placeholder="Apellido materno *"
                required
            />
            <a href="" class="seguimiento">¿Ya se había registrado?</a>
            <input class="boton" id="btn-agt-form" type="submit" ></input>
        </form>`;
  } catch (error) {
  console.log(error);
  }
});


/* FIN DE INICIO DE SESIÓN

FUNCIONES OPERATIVAS */ 
