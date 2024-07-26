// Librería Lodash ya cargada en el HTML

let baseDeDatosViajes = [];

// Constructor de Viaje
function Viaje(destino, duracion, costoDiario, presupuestoTotal) {
    this.destino = destino;
    this.duracion = duracion;
    this.costoDiario = costoDiario;
    this.presupuestoTotal = presupuestoTotal;
}

// Función para guardar un viaje en localStorage
function guardarViajeEnLocalStorage(viaje) {
    baseDeDatosViajes.push(viaje);
    localStorage.setItem('baseDeDatosViajes', JSON.stringify(baseDeDatosViajes));
}

// Cargar datos desde localStorage cuando se carga el documento
document.addEventListener("DOMContentLoaded", function() {
    let viajesGuardados = localStorage.getItem('baseDeDatosViajes');
    if (viajesGuardados) {
        baseDeDatosViajes = JSON.parse(viajesGuardados);
    }
    cargarDatos(); // Cargar datos del archivo JSON local
});

// Función para cargar datos desde el archivo JSON local
function cargarDatos() {
    fetch('./datos js/vuelos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON');
            }
            return response.json(); // Leer como JSON
        })
        .then(data => {
            console.log('Datos cargados:', data); // Verifica que los datos se cargan
            mostrarDatos(data);
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
        });
}

// Función para mostrar los datos en el DOM
function mostrarDatos(viajes) {
    const resultadoElement = document.getElementById("resultado");
    resultadoElement.innerHTML = ''; // Limpia el contenido anterior

    // Usando Lodash para ordenar los datos
    const viajesOrdenados = _.sortBy(viajes, ['destino']);

    viajesOrdenados.forEach(viaje => {
        const viajeElement = document.createElement("div");
        viajeElement.innerHTML = `
            <h2>Presupuesto para el viaje a ${viaje.destino}:</h2>
            <p>Duración: ${viaje.duracion} días</p>
            <p>Costo diario estimado: ${viaje.costoDiario} unidades monetarias</p>
            <p><strong>Presupuesto total estimado: ${viaje.duracion * viaje.costoDiario} unidades monetarias</strong></p>
        `;
        resultadoElement.appendChild(viajeElement);
    });
}

// Manejar el formulario para calcular el presupuesto
document.getElementById("formulario").addEventListener("submit", function(event) {
    event.preventDefault();

    let destino = document.getElementById("destino").value;
    let duracion = parseFloat(document.getElementById("duracion").value);
    let costoDiario = parseFloat(document.getElementById("costoDiario").value);

    if (!destino || isNaN(duracion) || duracion <= 0 || isNaN(costoDiario) || costoDiario <= 0) {
        mostrarMensajeError("Por favor, ingresa valores válidos para todos los campos.");
        return;
    }

    let presupuestoTotal = duracion * costoDiario;
    mostrarResultado(destino, duracion, costoDiario, presupuestoTotal);
    
    let viaje = new Viaje(destino, duracion, costoDiario, presupuestoTotal);
    guardarViajeEnLocalStorage(viaje);
});

// Función para mostrar un mensaje de error
function mostrarMensajeError(mensaje) {
    let resultadoElement = document.getElementById("resultado");
    resultadoElement.innerHTML = `<p class="error">${mensaje}</p>`;
}

// Función para mostrar el resultado del cálculo
function mostrarResultado(destino, duracion, costoDiario, presupuestoTotal) {
    let resultadoElement = document.getElementById("resultado");
    resultadoElement.innerHTML = `
        <h2>Presupuesto para el viaje a ${destino}:</h2>
        <p>Duración: ${duracion} días</p>
        <p>Costo diario estimado: ${costoDiario} unidades monetarias</p>
        <p><strong>Presupuesto total estimado: ${presupuestoTotal} unidades monetarias</strong></p>
    `;
}
