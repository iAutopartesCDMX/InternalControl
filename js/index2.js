//ESTE JS PRETENDE ATENDER LAS NECEDIADES DE REGISTROS.HTML


//https://www.youtube.com/watch?v=itNsRn1kjLU -------------------
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import { getDocs,collection } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
// https://firebase.google.com/docs/web/setup#available-libraries

import { db, deleteRegister, getRegister, savePersonal } from "./z-generales.js";
import { auth } from "./firebase.js";
import { showMessage } from "./showMessage.js";


const registrosContainer = document.getElementById("tasks-container"); //ES LA FUNCIÓN QUE GENERARÁ LA VENTANA DE ELEMENTOS EN BASE DE DATOS DONDE SE HA COLCAOD ESE ID EN EL HTML
const registroDB = await getDocs(collection(db, "registro")); //Para desplegar BD
const footer = document.getElementById("footer")

let id =""


//DESPLEGAR REGISTROS SI HAY NUEVOS
export const setupRegistros = (data) => {
    if (data.length) {
        //CÓDIGO PARA MOSTRAR REGISTROS --------- 
        registrosContainer.innerHTML = "";
        data.forEach((doc) => {
            const task = doc.data();
            registrosContainer.innerHTML += `  
            <div class="tarjetas__titulo sombra separar-tarjetas">
                <h3 class="contenedor2" >${task.nombre}</h3> 
        
                <div class="layout">
                    <div class="grow1">
                    <p> <span>- Correo:</span> ${task.email}</p>
                    <p> <span>- Apellido Paterno:</span> ${task.apellidoPaterno}</p>
                    <p> <span>- Apellido Materno:</span> ${task.apellidoMaterno}</p>
                    </div>
        
                    <div>
                    <button class="btn btn-primary btn-delete boton " data-id="${doc.id}">
                        Rechazar
                    </button>
        
                    <button class="btn btn-secondary btn-accept boton" data-id="${doc.id}">
                        Asignar
                    </button>
                </div>
            </div> `;
        console.log("Sí hay información de regitros")
        });
    } else{
        console.log("No hay registros")
        footer.classList.add("footer-obligado") //Si no hay registros nuevos, se obliga al footer mantenerse abajo
        registrosContainer.innerHTML = `
        <h3 >¡No hay nuevos registros!</h3> 
        `;
        
    }
};
setupRegistros (registroDB.docs);



//CÓDIGO PARA RESPONDER REGISTROS
//RECHAZA REGISTRO --------------- 
const btnsDelete = registrosContainer.querySelectorAll(".btn-delete"); //BORRAR SOLICITUDES
//Se le pide al documento SELECCIONAR TODOS LOS ELEMENTOS QUE TIENE esa clase de btn-delete y

btnsDelete.forEach((btn) => //Se recorren todos los botones
    btn.addEventListener("click", async ({ target: { dataset } }) => { //Se busca en evento CLICK buscando encontrar una interacción
    try {
        console.log("Borrando registro")
        //Borrar nuevo registro de "registro"
        await deleteRegister(dataset.id); //Con dataset.id se obtiene nada más el ID del dato del botón y se borra con DELETE TASK, objeto creado en firebase.js
        //Recargar página para actualizar tarjetas
        window.location.reload()
    } catch (error) {
        console.log(error);
    }
    })
);


    //ACEPTAR REGISTRO --------------- 
const btnsAccept = registrosContainer.querySelectorAll(".btn-accept"); //EDITAR LAS ENTRADAS EXISTENTES
btnsAccept.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
        e.preventDefault();
    try {
        const doc = await getRegister(e.target.dataset.id);  //Se muestran los datos que tiene ese ID
        const task = doc.data(); //Se guarda la infornación de doc en task
        console.log("Registrando a ",task.nombre, " con el correo ", task.email)
        
        //Modal para preguntar por el grado deseado de asignar
        const nombreModal = document.getElementById("nombre-nuevo-registro")
        const modal = document.querySelector('.modal');
        const closeModal = document.querySelector('.modal_x');
        modal.classList.add('modal--show');

        closeModal.addEventListener('click', (e)=>{
            e.preventDefault();
            modal.classList.remove('modal--show');
        });
        nombreModal.innerHTML =`
        <h2 class="modal__title">${task.nombre}</h2>
        `;
        

        //Esuchar información del modal
        const gradoForm = document.getElementById("grado-form")
        gradoForm.addEventListener("submit", async (t) => {  //AGREGAR NUEVAS ENTRADAS
            t.preventDefault();
            try{
                const grado = gradoForm["grado"].value;
                console.log("grado escogido: ", grado)

                //Reiniciar formulario de modal
                gradoForm.reset(); 
                modal.classList.remove('modal--show');

                //Crear usuario con auth
                const correo = task.email;
                const password = task.pass;
                //const userCredential = await createUserWithEmailAndPassword(auth, correo, password)
                        //console.log(userCredential)
                        
                        /*NO SE CREA LA SESIÓN AQUÍ PORQUE PROVOCA 
                        INTERFERENCIA CON EL AUTH ACTUAL DEL ADMINISTRADOR*/

                //asignar información a "personal"
                const apellidoMaterno = task.apellidoMaterno
                const apellidoPaterno = task.apellidoPaterno
                const nombre = task.nombre;
                        /*El correo ya tiene variable*/
                savePersonal (correo, nombre, apellidoPaterno, apellidoMaterno, grado)
                showMessage(nombre, " ha sido registrado");
                //Borrar información en "registro"
                const borrarRegistro = await deleteRegister(e.target.dataset.id); //Con dataset.id se obtiene nada más el ID del dato del botón y se borra con DELETE TASK, objeto creado en firebase.js
                    console.log("Borrando registro ", e.target.dataset.id)

                //Recargar página para actualizar tarjetas
                setTimeout(function(){
                    window.location.reload()
                }, 2000);
                

            } catch (error){
                if (error.code === 'auth/email-already-in-use') {
                    showMessage("Email ya se encuentra en uso", "error")
            
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
        
        
    } catch (error) {
        console.log("Error aceptando nuevo usuario",error);
    }
    });
});

  