const missatge = document.getElementById("missatge");
const boto = document.getElementById("boto");
function provar() {
  try {
    const entrada = prompt("Escriu 1 per anar bé o 2 per veure un error:");
    if (entrada === "1") {
      console.log("Hola! Tot ha anat molt bé.");
      missatge.textContent = "Hola! Tot ha anat molt bé.";
    } else if (entrada === "2") {
      throw new Error("Hi ha hagut un error intern al codi.");
    } else {
      throw new Error("Aquesta opció no val. Només pots escriure 1 o 2.");
    }
  } catch (error) {
    console.log("Error: " + error.message);
    missatge.textContent = "Error: " + error.message;
  }
}
boto.addEventListener("click", provar);
