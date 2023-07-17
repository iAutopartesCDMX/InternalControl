import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js"
import { auth, db } from "./firebase.js";

//https://www.youtube.com/watch?v=itNsRn1kjLU -------------------
import {
    onGetTasks,
    saveTask,
    deleteTask,
    getTask,
    updateTask,
    getTasks,
    updateFolio,
} from "./z-generales.js";

//import './logout.js'




//If para comprobar que su Auth tiene autoritzación de ver la bandeja id="btn-bandeja"
const btnBandeja = document.getElementById("btn-bandeja");
const bandeja = document.getElementById("bandeja");
var nuevas = 0;
var paso = 0;

window.addEventListener("DOMContentLoaded", async (e) => { //Cuando se haya cargado la página, se ejecutará un evento
    e.preventDefault();
    footer.classList.add("footer-obligado")
    try{
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                //Obtener el correo del usuario con AUTH
                console.log("Correo del usuario en línea: ",user.email)
                
                //Revisar los correos registrados del personal
                try{
                    const docs = await getDocs(collection(db, "personal")); 
                    docs.forEach((doc) => {
                        const task = doc.data();
                        //console.log(task.correo)

                        
                        //Detectar si el correo del usuario está en bd personal
                        if (task.correo === user.email) {
                            //console.log("Sí puede ver bandeja ", task.correo )
                            paso = 1; //En caso de que se quiera hacer algo más

                            const taskForm = document.getElementById("agt-form");
                            const tasksContainer = document.getElementById("bandeja"); //ES LA FUNCIÓN QUE GENERARÁ LA VENTANA DE ELEMENTOS EN BASE DE DATOS DONDE SE HA COLCAOD ESE ID EN EL HTML
                            const footer = document.getElementById("footer")
                            const nav = document.getElementById("main-links");
                            var contadorFolios = 0; //Contador general
                            var contadorPendientes = 0; //PENDIENTES
                            var contadorAsignados = 0;
                            var contadorRechazados = 0;//RESPONDIDOS
                            var contadorCerrados = 0;
                            var ultimoFolio = 0

                            //CÓDIGO PARA BANDEJA DE ENTRADA --------- 
                            onGetTasks((querySnapshot) => { //Este getTask se ve afectado por la función de "DOMContentLoaded", pues en cuanto carga
                                //la página, obtiene los datos TAMBIÉN CUANDO SE ACTUALICE LA BASE DE DATOS
                                    //console.log("Borrando contenido", querySnapshot.length)

                                tasksContainer.innerHTML = "";  //REINICIA LA TARJETA QUE MUESTRA DATOS ANTES DE COLOCAR LA ACTUALIZACIÓN DE DATOS
                                querySnapshot.forEach((doc) => { //FireBase llama Query Snapshot a objetos que se pueden recorrer. FOR EACH es para REVISAR LOS DATOS 1 A 1
                                    const task = doc.data(); //Por cada documento que recorra, queremos ver los datos obtenidos
                                    
                                    //REGISTRO ESPECÍFICO DE ENTRADAS
                                    contadorFolios ++;
                                    if(!task.estado){ //PENDIENTES
                                        contadorPendientes ++;
                                    }
                                    if(task.estado === "asignado"){ //ASIGNADOS
                                        contadorAsignados ++;
                                    }
                                    if(task.estado === "rechazado"){ //RECHAZADOS
                                        contadorRechazados ++;
                                    }
                                    if(task.estado === "cerrado"){ //ASIGNADOS Y CERRADOS
                                        contadorCerrados ++;
                                    }
                                    if (task.folio){

                                        if (task.folio > ultimoFolio){
                                            console.log("Último folio registrado ", ultimoFolio, " cambia a ", task.folio)
                                            ultimoFolio = task.folio;
                                        }
                                        
                                    }
                                    
                                    if (task.estado != "rechazado" && task.estado != "asignado" && task.estado != "cerrado" ){ 
                                        footer.classList.remove("footer-obligado")
                                        nuevas++;
                                        tasksContainer.innerHTML += `  
                                        <div class="tarjetas__titulo sombra separar-tarjetas">
                                        <h3 class="contenedor2" >${task.predio}</h3> 
                                
                                        <div class="layout">
                                            <div class="grow1">
                                            <p> <span>- Descripción:</span> ${task.descripcion}</p>
                                            <p> <span>- Ubicación:</span> ${task.referencia}</p>
                                            <p> <span>- Contacto:</span> ${task.contacto}</p>
                                            <p> <span>- Mail:</span> ${task.mail}</p>
                                            <p> <span>- Llegada:</span> ${task.fecha}</p>
                                            </div>
                                
                                            <div class="btns-taskContainer">
                                            <button class="btn btn-primary active-modal boton" data-id="${doc.id}">
                                                Rechazar
                                            </button>

                                            <button class="btn btn-secondary active-modalAsig boton" data-id="${doc.id}">
                                                Asignar
                                            </button>
                                            </div>
                                
                                        </div>
                                        </div>`;
                                        //con task.title obtiene los valres que están así guardados desde el DOC.data hecho que se guarda en la variable task
                                    }
                                });
                            

                                //RECHAZAR --------------- 
                                /* CÓDIGO PARA MODAL RECHAZAR*/
                                const btnsOpenModal = tasksContainer.querySelectorAll('.active-modal');
                                const modal = document.querySelector('.modal');
                                const btnsCloseModal = document.querySelectorAll('.modal_x');

                                var btnToDelete; /* Variable global que permite tener a la mano un elemento con
                                el ID del taskcontainer con el que se interactuó*/

                                btnsOpenModal.forEach((btn) =>
                                btn.addEventListener('click', (e)=>{
                                    e.preventDefault();

                                    modal.classList.add('modal--show');
                                    btnToDelete = btn.dataset.id; /*Variable global*/
                                    })
                                );

                                btnsCloseModal.forEach((btn2) =>
                                    btn2.addEventListener('click',  (e) => {
                                    e.preventDefault();

                                    modal.classList.remove('modal--show');
                                    })
                                );
                                
                                
                                //CLICK AL BOTÓN DE RECHAZAR Y ENTREGAR FORMULARIO
                                const btnrechazarForm = document.getElementById('btn-rechazar-form');
                                const rechazarForm = document.getElementById("rechazar-form");
                                const timestamp1 = Date.now();
                                const fechaRech = new Date(timestamp1);

                                //OBTENER ID DEL AGENTE
                                const usuario = user.email //Obtener correo del usuario en línea
                                var id_caracteres = usuario.indexOf("@") //Obtener carácteres del ID del correo
                                const usuario_id = (usuario.slice(0, id_caracteres))
                                    
                                var nuevoFolio = Math.floor(Math.random() * 100000)
                                    console.log("Folio rechazado registra:", nuevoFolio)

                                btnrechazarForm.addEventListener("click", async (e) =>{
                                e.preventDefault();
                                try {
                                    const RechazarIdAgente = usuario_id;
                                    const RechazarRazon = rechazarForm["rechazar-razon"];
                                    
                                    await updateTask(btnToDelete, {  /*Categoriza
                                    como rechazado el task y añade al expediente la información nueva*/
                                    estado: "rechazado",
                                    FechaRechazado: fechaRech, 
                                    RechazadoIdAgente: RechazarIdAgente,
                                    RechazadoRazon: RechazarRazon.value,
                                    folio: nuevoFolio,
                                    });
                                    
                                    rechazarForm.reset(); //Vacias los inputs una vez que se ha guardado la información
                                    modal.classList.remove('modal--show');
                                    btnToDelete = "";

                                    //ENVIAR CORREO DE AVISO -- pendiente
                    
                                    } catch (error) {
                                    console.log(error);
                                    //Recargar página para actualizar tarjetas
                                    window.location.reload()
                                    }
                                });

                                
                                //ASIGNAR --------------- 
                                /* CÓDIGO PARA MODAL ASIGNAR*/
                                const btnsOpenModalAsig = tasksContainer.querySelectorAll('.active-modalAsig');
                                const modalAsig = document.querySelector('.modalAsig');
                                const btnsCloseModalAsig = document.querySelectorAll('.modal_xAsig');

                                

                                var btnToAssign; /*Variable global de taskcontainer usado al asignar*/

                                btnsOpenModalAsig.forEach((btn3) =>
                                btn3.addEventListener('click', (e)=>{
                                    e.preventDefault();

                                    btnToAssign = btn3.dataset.id; /*Variable global*/
                                    modalAsig.classList.add('modal--showAsig');
                                    })
                                );

                                btnsCloseModalAsig.forEach((btn4) =>
                                btn4.addEventListener('click', (e) => {
                                    e.preventDefault();

                                    modalAsig.classList.remove('modal--showAsig');
                                    //console.log(btnToAssign)
                                })
                                );

                                //CLICK AL BOTÓN DE ASIGNAR Y ENTREGAR FORMULARIO
                                const btnasginarForm = document.getElementById('btn-asignar-form');
                                const asignarForm = document.getElementById("asignar-form");
                                const timestamp = Date.now();
                                const fechaAsig = (new Date(timestamp)).toString();


                                btnasginarForm.addEventListener("click", async (e) =>{
                                e.preventDefault();
                                try {
                                    //Asignar el elementos a una variable 
                                    const AsignarArea = asignarForm["asignar-area"]
                                    const AsignarIdAgente = usuario_id;
                                    console.log("asignado por ", AsignarIdAgente)
                                    const AsignarComments = asignarForm["asignar-comments"];
                                    //var nuevoFolio = ultimoFolio++;
                                    var nuevoFolio = Math.floor(Math.random() * 100000)
                                    console.log("Folio que se registra:", nuevoFolio)
                                    
                                    await updateTask(btnToAssign, {  /*Categoriza
                                    como asginado el task y añade al expediente la información nueva*/
                                    estado: "asignado",
                                    FechaAsignado: fechaAsig, 
                                    AsignarArea: AsignarArea.value,
                                    AsignarIdAgente: AsignarIdAgente,
                                    AsignarComments: AsignarComments.value,
                                    folio: nuevoFolio,
                                    });
                                    asignarForm.reset(); //Vacias los inputs una vez que se ha guardado la información
                                    modalAsig.classList.remove('modal--showAsig');
                                    btnToAssign = "";

                                    await updateFolio({ultFolio: nuevoFolio}) //Actualiza el valor del último folio que se tiene

                                } catch (error) {
                                    console.log(error);
                                } 
                                });

                            }); //END OF onGetTasks


                            

                            //PRUEBA DE REGISTRO 
                            var confirmacion = contadorPendientes + contadorAsignados + contadorRechazados + contadorCerrados;
                            console.log("TOTAL: ", contadorFolios)
                            console.log("PENDIENTES: ", contadorPendientes)
                            console.log("ASIGNADOS: ", contadorAsignados)
                            console.log("RECHAZADOS: ", contadorRechazados)
                            console.log("CERRADOS: ", contadorCerrados)
                            console.log("CONFIRMACIÓN: ", confirmacion)
                            
                          
                        }else {
                            //console.log("No se ha aprobado el registro por un admin")
                            bandeja.innerHTML = "<h3>Se necesita autorización previa </h3>";
                        };
                    }); //END OF docs.forEach((doc)

                    


                } catch(error){
                    console.log("Error obteniendo documentos", error)
                }
                
            } else {
              console.log("No se ha iniciado sesión")
              bandeja.innerHTML = "<h3>Inicie sesión antes</h3>";
            };
        }); //END OF onAuthStateChanged
    } catch(error){
        console.log(error)
    }
}); // END OF window.addEventListener
