// Valoraciones
document.addEventListener("DOMContentLoaded", () => {
    const estrellas = document.querySelectorAll(".estrella");
    let valorSeleccionado = 0;

    estrellas.forEach((estrella, index) => {
        estrella.addEventListener("mouseover", () => {
            estrellas.forEach((e, i) => {
                e.style.color = i <= index ? "#ffc107" : "#ddd";
            });
        });

        estrella.addEventListener("mouseout", () => {
            estrellas.forEach((e, i) => {
                e.style.color = i < valorSeleccionado ? "#ffc107" : "#ddd";
            });
        });

        estrella.addEventListener("click", () => {
            valorSeleccionado = index + 1;
            estrellas.forEach((e, i) => {
                e.classList.toggle("selected", i < valorSeleccionado);
            });
        });
    });

    document.getElementById("enviarValoracion").addEventListener("click", () => {
        const comentario = document.getElementById("comentario").value.trim();
        if (valorSeleccionado > 0 || comentario) {
            alert(`Gracias por tu valoración de ${valorSeleccionado} estrellas y tu comentario: "${comentario}"`);
            // Lógica para enviar los datos al servidor
        } else {
            alert("Por favor, selecciona una valoración o escribe un comentario.");
        }
    });
});
