let cliente = {
    mesa: '',
    hora: '',
    pedido: []
}

const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
}

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente(){
    const mesa = document.querySelector('#mesa').value
    const hora = document.querySelector('#hora').value

    // Revisar campos vacios 

    const camposVacios = [ mesa, hora].some( campo => campo === '');

    if (camposVacios) {
        const existeAlerta = document.querySelector('.invalid-feedback')
        if (!existeAlerta) {
            
            const alerta = document.createElement('DIV');
            alerta.classList.add('invalid-feedback', 'd-block','text-center');
            alerta.textContent='Todos los campos son obligatorios'
            document.querySelector('.modal-body form').appendChild(alerta)
            setTimeout(() => {
                alerta.remove()
            }, 3000);
        }

    return;
    }

    // llenar

    cliente = {...cliente, mesa, hora}

    // console.log(cliente)

    // Ocultar modal
    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide();


    // Mostrar secciones

    mostrarSecciones();

    // obtener platillos de la API de JSON-SERVER

    obtenerPlatillos();
}

function mostrarSecciones(){
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach( seccion => seccion.classList.remove('d-none'));

}

function obtenerPlatillos() {
    const url = 'http://localhost:4000/platillos';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarPlatillos(resultado))
        .catch( error => console.log(error))
}

function mostrarPlatillos(platillos){
    const contenido = document.querySelector('#platillos .contenido');

    platillos.forEach(platillo => {
        const row = document.createElement('DIV');
        row.classList.add('row', 'py-3', 'border-top');

        const nombre = document.createElement('DIV');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('DIV');
        precio.classList.add('col-md-3', 'fw-bold');
        precio.textContent = `$${platillo.precio}`;

        const categoria = document.createElement('DIV');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[ platillo.categoria ];

        const inputCantidad = document.createElement('INPUT');
        inputCantidad.type= 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${platillo.id}`;
        inputCantidad.classList.add('form-control');

        // funcion para detectar la cantidad y el platillo agregado

        inputCantidad.onchange = function() {
            const cantidad = parseInt( inputCantidad.value );
            agregarPlatillo({...platillo, cantidad});
        } 

        const agregar = document.createElement('DIV');
        agregar.classList.add('col-md-2')
        agregar.appendChild(inputCantidad);


        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);

        contenido.appendChild(row);
    })


}

function agregarPlatillo(producto){
    // Extraer el pedido
    let {pedido } = cliente;
    // revisar que la cantidad sea mayor a 0
    if(producto.cantidad > 0){
        // Comprueba si el elemento existe
        if (pedido.some( articulo => articulo.id === producto.id ) ) {
            // El articulo no existe, actualizar la cantidad
            const pedidoActualizado = pedido.map( articulo => {
                if (articulo.id === producto.id) {
                    articulo.cantidad = producto.cantidad
                }
                return articulo;
            });
            // Se asigna el nuevo array a cliente.pedido
            cliente.pedido = [...pedidoActualizado];
        }else{
            // El articulo no existe, lo agregamos
            cliente.pedido = [...pedido, producto]
        }
    } else {
        // Eliminar elementos cuando cantidad es mayor a 0
        const resultado = pedido.filter( articulo => articulo.id !== producto.id );
        cliente.pedido = [...resultado]
    }
    
    // Limiar HTML
    limpiarHTML();

    if (cliente.pedido.length ) {
        
        // Mostrar el resumen    
        actualizarResumen();
    }else{
        mensajePedidoVacio();
    }

}

function actualizarResumen(){
    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6', 'card', 'py-5', 'px-3','shadow');

    // Información de la mesa
    const mesa = document.createElement('P');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('SPAN');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');

    // Información de la hora
    const hora = document.createElement('P');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('SPAN');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');

    // Agregar a los elementos padre
    mesa.appendChild(mesaSpan)
    hora.appendChild(horaSpan)

    // Titulo de la sección 
    const heading = document.createElement('H3');
    heading.textContent = 'Platillos consumidos';
    heading.classList.add('my-4', 'text-center');

    // Iterar sobre el array de pedidos
    const grupo = document.createElement('UL');
    grupo.classList.add('list-group');

    const { pedido } = cliente;
    pedido.forEach( articulo => {
        const { nombre, cantidad, precio, id } = articulo;

        const lista = document.createElement('LI');
        lista.classList.add('list-group-item');

        const nombreEl = document.createElement('H4');
        nombreEl.classList.add('my-4');
        nombreEl.textContent = nombre;

        // Cantidad del artículo
        const cantidadEl = document.createElement('P');
        cantidadEl.classList.add('fw-bold');
        cantidadEl.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('SPAN');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

        // Precio del artículo
        const precioEl = document.createElement('P');
        precioEl.classList.add('fw-bold');
        precioEl.textContent = 'Precio: ';

        const precioValor = document.createElement('SPAN');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$${precio}` ;

        // Subtotal del artículo
        const subtotalEl = document.createElement('P');
        subtotalEl.classList.add('fw-bold');
        subtotalEl.textContent = 'Subtotal: ';

        const subtotalValor = document.createElement('SPAN');
        subtotalValor.classList.add('fw-normal');
        
        subtotalValor.textContent = calcularSubtotal(precio, cantidad) ;


        // BTN eliminar desde resumen

        const btnEliminar = document.createElement('BUTTON');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar';

        // Funcion para eliminar del pedido

        btnEliminar.onclick = function (){
            eliminarProducto(id)
        }


        // Agregar valores a sus contenedores

        cantidadEl.appendChild(cantidadValor);
        precioEl.appendChild(precioValor);
        subtotalEl.appendChild(subtotalValor);

        // Agregar elmentos al li

        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEl);
        lista.appendChild(subtotalEl);
        lista.appendChild(btnEliminar);
        
        // agregar lista al grupo principal
        grupo.appendChild(lista);
    })


    // Agregar al contenido
    resumen.appendChild(mesa)
    resumen.appendChild(hora)
    resumen.appendChild(heading)
    resumen.appendChild(grupo)


    contenido.appendChild(resumen)
}

function limpiarHTML(){
    const contenido = document.querySelector('#resumen .contenido');

    while (contenido.firstChild) {
        contenido.removeChild(contenido.firstChild);
    }
}

function calcularSubtotal(precio, cantidad){ 
    return `$${precio * cantidad}`;
}

function eliminarProducto(id){
    const { pedido } = cliente;
    const resultado = pedido.filter( articulo => articulo.id !== id );
        cliente.pedido = [...resultado]
    // Limpiar HTML
    limpiarHTML();
    // Mostrar el resumen

    

    if (cliente.pedido.length) {
        
       actualizarResumen();
    } else {
        mensajePedidoVacio();
    }

    // Regresar cantidad 0 al formulario
    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado);

    inputEliminado.value = 0;

}

function mensajePedidoVacio(){
    const contenido = document.querySelector('#resumen .contenido');

    const texto = document.createElement('P');
    texto.classList.add('text-center');
    texto.textContent ='Añade los elementos del pedido'

    contenido.appendChild(texto);
}