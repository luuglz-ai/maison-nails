
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

// window.addEventListener("scroll", actualizarHeader);

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

/* MI CUENTA — ABRIR Y CERRAR VENTANA */

const modalCuenta = document.getElementById("modal-cuenta");
const cerrarCuenta = document.getElementById("cerrar-cuenta");

cerrarCuenta.addEventListener("click", () => {
    modalCuenta.hidden = true;
    document.body.classList.remove("modal-abierto");
});

/* MI CUENTA — ABRIR VENTANA */

const abrirCuenta = document.querySelector(".mi-cuenta");

abrirCuenta.addEventListener("click", async (evento) => {
    evento.preventDefault();

    modalCuenta.hidden = false;
    document.body.classList.add("modal-abierto");

    await actualizarEstadoCuenta();
});


/* MI CUENTA — CAMBIAR ENTRE PESTAÑAS */

const pestanaLogin = document.getElementById("pestana-login");
const pestanaRegistro = document.getElementById("pestana-registro");

const formularioLogin = document.getElementById("formulario-login");
const formularioRegistro = document.getElementById("formulario-registro");

const mensajeCuenta = document.getElementById("mensaje-cuenta");

pestanaLogin.addEventListener("click", () => {
    formularioLogin.hidden = false;
    formularioRegistro.hidden = true;

    pestanaLogin.classList.add("pestana-activa");
    pestanaRegistro.classList.remove("pestana-activa");

    mensajeCuenta.textContent = "";
});

pestanaRegistro.addEventListener("click", () => {
    formularioLogin.hidden = true;
    formularioRegistro.hidden = false;

    pestanaRegistro.classList.add("pestana-activa");
    pestanaLogin.classList.remove("pestana-activa");

    mensajeCuenta.textContent = "";
});

/* MI CUENTA — REGISTRO DE USUARIOS */

formularioRegistro.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const email = document.getElementById("registro-email").value.trim();
    const password = document.getElementById("registro-password").value;

    mensajeCuenta.classList.remove("error");
    mensajeCuenta.textContent = "Estamos creando tu cuenta...";

    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        mensajeCuenta.classList.add("error");
        mensajeCuenta.textContent = error.message;
        return;
    }

    mensajeCuenta.textContent =
        "¡Gracias por unirte a Maison Nails! Revisá tu correo electrónico para confirmar tu cuenta.";

    formularioRegistro.reset();
});

/* MI CUENTA — INICIAR SESIÓN */

formularioLogin.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    mensajeCuenta.classList.remove("error");
    mensajeCuenta.textContent = "Estamos verificando tus datos...";

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        mensajeCuenta.classList.add("error");
        mensajeCuenta.textContent =
            "No pudimos iniciar sesión. Revisá tu correo y contraseña.";
        return;
    }

    mensajeCuenta.textContent = "¡Bienvenida a Maison Nails! Tu sesión se inició correctamente.";

    formularioLogin.reset();
    await actualizarEstadoCuenta();
});

/* MI CUENTA — MOSTRAR ESPACIO PERSONAL */

const panelUsuario = document.getElementById("panel-usuario");
const emailUsuario = document.getElementById("email-usuario");
const pestanasCuenta = document.querySelector(".cuenta-pestanas");


const indicadorSesion = document.getElementById("indicador-sesion");
async function actualizarEstadoCuenta() {

    const { data: { user } } = await supabaseClient.auth.getUser();

    if (user) {
        indicadorSesion.hidden = false; 
        // Usuario con sesión iniciada
        formularioLogin.hidden = true;
        formularioRegistro.hidden = true;
        pestanasCuenta.hidden = true;

        panelUsuario.hidden = false;
        emailUsuario.textContent = user.email;

    } else {
        indicadorSesion.hidden = true;
        // Usuario sin sesión iniciada
        panelUsuario.hidden = true;
        pestanasCuenta.hidden = false;

        formularioLogin.hidden = false;
        formularioRegistro.hidden = true;

        pestanaLogin.classList.add("pestana-activa");
        pestanaRegistro.classList.remove("pestana-activa");
    }
}

/* MI CUENTA — CERRAR SESIÓN */

const botonCerrarSesion = document.getElementById("cerrar-sesion");

botonCerrarSesion.addEventListener("click", async () => {

    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        mensajeCuenta.classList.add("error");
        mensajeCuenta.textContent =
            "No pudimos cerrar tu sesión. Intentá nuevamente.";
        return;
    }

    mensajeCuenta.classList.remove("error");
    mensajeCuenta.textContent = "";

    await actualizarEstadoCuenta();

});

/* COMPROBAR LA SESIÓN AL CARGAR LA PÁGINA */

actualizarEstadoCuenta();

/* DETECTAR CAMBIOS DE SESIÓN EN SUPABASE */

supabaseClient.auth.onAuthStateChange((evento, sesion) => {
    indicadorSesion.hidden = !sesion?.user;
});


/* CERRAR MI CUENTA AL HACER CLIC FUERA */

modalCuenta.addEventListener("click", (evento) => {
    if (evento.target === modalCuenta) {
        modalCuenta.hidden = true;
        document.body.classList.remove("modal-abierto");
    }
});

/* CERRAR MI CUENTA CON LA TECLA ESCAPE */

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !modalCuenta.hidden) {
        modalCuenta.hidden = true;
        document.body.classList.remove("modal-abierto");
    }
});
// Evitar reservas en fechas anteriores a hoy
const campoFecha = document.getElementById("fecha");

if (campoFecha) {
    const hoy = new Date();

    const fechaLocal = [
        hoy.getFullYear(),
        String(hoy.getMonth() + 1).padStart(2, "0"),
        String(hoy.getDate()).padStart(2, "0")
    ].join("-");

    campoFecha.min = fechaLocal;
}