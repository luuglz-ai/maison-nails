
// ===============================
// CONEXIÓN CON SUPABASE
// ===============================

const SUPABASE_URL = "https://fuqwarjrhcixwdwwodee.supabase.co";

const SUPABASE_KEY = "sb_publishable_CBox1zpwBbilJL982LOgwQ_sjLX-I5Z"; 

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const formulario = document.getElementById("formulario-reserva");

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const servicio = document.getElementById("servicio").value;
    const fecha = document.getElementById("fecha").value;
    const horario = document.getElementById("horario").value;
    const mensajeExtra = document.getElementById("mensaje").value;

    const mensaje = `¡Hola! Quiero solicitar un turno en Maison Nails 💅

Nombre: ${nombre}
Servicio: ${servicio}
Fecha preferida: ${fecha}
Horario preferido: ${horario}
Mensaje adicional: ${mensajeExtra || "Ninguno"}`;

    const telefono = "549XXXXXXXXXX";
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");
});


// ENCABEZADO DINÁMICO

const header = document.querySelector("header");

function actualizarHeader() {

    if (window.scrollY > 50) {
        header.classList.add("header-compacto");
    } else {
        header.classList.remove("header-compacto");
    }

}

window.addEventListener("scroll", actualizarHeader);

actualizarHeader();

// MENÚ HAMBURGUESA

const menuToggle = document.querySelector(".menu-toggle");
const menuPrincipal = document.querySelector("#menu-principal");
const iconoMenu = menuToggle.querySelector("i");

menuToggle.addEventListener("click", function () {

    const estaAbierto = menuPrincipal.classList.toggle("menu-abierto");

    menuToggle.setAttribute("aria-expanded", estaAbierto);

    menuToggle.setAttribute(
        "aria-label",
        estaAbierto ? "Cerrar menú" : "Abrir menú"
    );

    iconoMenu.classList.toggle("fa-bars", !estaAbierto);
    iconoMenu.classList.toggle("fa-xmark", estaAbierto);

});

// CERRAR EL MENÚ AL SELECCIONAR UNA OPCIÓN

const enlacesMenu = menuPrincipal.querySelectorAll("a");

enlacesMenu.forEach(function(enlace) {

    enlace.addEventListener("click", function() {

        menuPrincipal.classList.remove("menu-abierto");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menú");

        iconoMenu.classList.remove("fa-xmark");
        iconoMenu.classList.add("fa-bars");

    });

});

// ===============================
// SUSCRIPCIÓN A MAISON CLUB
// ===============================

const formularioNewsletter = document.getElementById("formulario-newsletter");

console.log("Newsletter encontrada:", formularioNewsletter);

formularioNewsletter.addEventListener("submit", async function(event) {

    // Evito que la página se recargue al enviar el formulario
    event.preventDefault();

    // Obtengo los datos del formulario
    const email = document.getElementById("email-newsletter").value.trim();
    const consentimiento = document.getElementById("consentimiento-newsletter").checked;

    // Compruebo que la persona haya aceptado recibir novedades
    if (!consentimiento) {
        alert("Debés aceptar recibir novedades para suscribirte.");
        return;
    }

    // Envio los datos a Supabase

    const { error } = await supabaseClient
        .from("suscriptores")
        .insert([
            {
                email: email,
                consentimiento: consentimiento
            }
        ]);

    // Compruebo el resultado
    
if (error) {
    console.error("Error de suscripción:", error);

    const mensajeNewsletter = document.getElementById("mensaje-newsletter");

    if (error.code === "23505") {
        mensajeNewsletter.textContent =
            "Este correo electrónico ya está registrado en The Maison Club.";
    } else {
        mensajeNewsletter.textContent =
            "No pudimos completar tu suscripción. Por favor, intentá nuevamente.";
    }

    mensajeNewsletter.classList.add("error");
    mensajeNewsletter.hidden = false;

    return;
} 

    // Si Supabase confirmó el registro

   const mensajeNewsletter = document.getElementById("mensaje-newsletter");

mensajeNewsletter.textContent =
    "¡Bienvenida a The Maison Club! ♡ Tu correo fue registrado correctamente. Gracias por formar parte de nuestro espacio.";

mensajeNewsletter.classList.remove("error");
mensajeNewsletter.hidden = false;

formularioNewsletter.reset();

console.log("MAISON NAILS: JavaScript llegó hasta el final"); 
});