var conteo = 1;
var fotograma = 0;
var imagen = ["🕐","🕑","🕒","🕓","🕔","🕕","🕖","🕗","🕘","🕙","🕚","🕛"];
var finished = false;

function animacion() {
    fotograma++
    if (fotograma == imagen.length){
        fotograma = 0
    }
    return `${imagen[fotograma]}`
    
}

async function obtenerLongitudColaboradores() {
    const listaColaboradores = await colaboradores;

    return listaColaboradores.length;
}

async function mensajeDeCarga() {
    const colaboradoresLength = await obtenerLongitudColaboradores();
    if (conteo >= colaboradoresLength) {
        return "👁 Asignaciones cargadas con éxito";
    } else {
        return `${animacion()} Buscando empleados...`;
    }
}

let conteo = 0;  // Variable para contar las solicitudes

async function fetchAsignacion(legajo) {
    try {
        // Cambia la URL aquí para usar la nueva API
        const response = await fetch(`https://api.nueva-asignaciones.com/v1/horarios?legajo=${legajo}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.text();
        
        document.getElementById('contenido-fetch').innerText = await mensajeDeCarga();
        
        conteo++;
        
        return data;
    } catch (error) {
        console.error('Error al obtener el contenido:', error);
        document.getElementById('contenido-fetch').innerText = 'Error al obtener los datos';
    }
}

async function mostrarAsignaciones() {
    if (!finished){
        try {
            (await colaboradores).forEach(async (empleado)  => {
                const legajo = empleado.legajo;
                const nombre = empleado.nombre;
                const asignaciones = await fetchAsignacion(legajo);
                mostrarAsignacionEnPagina(nombre, asignaciones);
            });
        } catch (error) {
            console.error('Error al mostrar las asignaciones:', error);
        }
    } else {
        alert("Las asignaciones ya fueron cargadas. Pulsa Aceptar para recargar la página");    
        location.reload();    
    }
    finished = !finished;
}

function mostrarAsignacionEnPagina(nombre, asignacionesJSON) {
    const contenedor = document.getElementById('asignaciones-container');
    const empleadoDiv = document.createElement('div');
    const legajoTitulo = document.createElement('h4');
    legajoTitulo.textContent = `${nombre}`;
    empleadoDiv.appendChild(legajoTitulo);

    const asignaciones = JSON.parse(asignacionesJSON);

    if (asignaciones && asignaciones.asignaciones && asignaciones.asignaciones.length > 0) {
        const tabla = document.createElement('table');
        tabla.classList.add('asignaciones-table');

        const encabezado = tabla.createTHead();
        const filaEncabezado = encabezado.insertRow();
        const encabezados = ['Fecha', 'Hora de entrada', 'Hora de salida'];
        encabezados.forEach(encabezado => {
            const th = document.createElement('th');
            th.textContent = encabezado;
            filaEncabezado.appendChild(th);
        });

        const cuerpo = tabla.createTBody();
        asignaciones.asignaciones.forEach(asignacion => {
            const fila = cuerpo.insertRow();
            fila.insertCell().textContent = asignacion.fecha;
            fila.insertCell().textContent = asignacion.horaEntrada;
            fila.insertCell().textContent = asignacion.horaSalida;
        });

        empleadoDiv.appendChild(tabla);
    } else {
        const errorMensaje = document.createElement('p');
        errorMensaje.textContent = 'No hay asignaciones disponibles.';
        empleadoDiv.appendChild(errorMensaje);
    }

    contenedor.appendChild(empleadoDiv);
}

const volverAlInicio = () => window.location.href = "index.html";
const irASolicitarHorario = () => window.location.href = "pedir_horario.html";
