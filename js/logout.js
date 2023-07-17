import { signOut } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { auth } from "./firebase.js";

const logout = document.getElementById("logout");
const postList = document.getElementById("posts");

logout.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    await signOut(auth)
    console.log("Se ha cerrado sesión");

    const footer = document.getElementById("footer")
    footer.classList.remove("footer-obligado")
    footer.classList.add("footer") //Iniciada la sesión, se obliga al footer mantenerse abajo

    //Limpiar personalizado
    postList.innerHTML = ``;

  } catch (error) {
    console.log(error)
  }
});