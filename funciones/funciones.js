/*Lo primero que tenemos que hacer es asegurarnos que la página ha cargado por completo y que todos 
los objetos existen antes de asignarles eventos */

//La llamada a la función iniciar será lo primero que se realice cuando la página esté cargada y con ella se carga el layout de la pagina
window.addEventListener('load',iniciar,false);

//creamos los elementos nuevos que vamos a colgar del body para formar el layout general de la web
//los creamos fuera para que sea accesibles desde todo el código
let divFondo=document.createElement('div');
let divLateral=document.createElement('div');
let divMenu=document.createElement('div');

//creamos una variable para manejar las imagenes clonadas
let imagenesClonadas=divFondo.getElementsByTagName('img');
//variable accesible desde todo el código para mover la imagen clonada
let moviendoImagen=null;
//variable para colocar la imagen seleccionada por encima de las demas
let zIndexImagen=0;
//variables para las coordenadas de la imagen
let imagenX=0;
let imagenY=0;
//zona en la que se puede mover la imagen
let zona=null;

//con la funcion iniciar vamos a cargar el layout de la pagina
function iniciar() 
{
    //asignamos a los elementos sus atributos correspondientes
    divFondo.setAttribute('id', 'fondo');
    divFondo.setAttribute('class', 'fondoWeb');
    divLateral.setAttribute('id', 'lateral');
    divLateral.setAttribute('class', 'imagenes');
    divMenu.setAttribute('id', 'menu');
    divMenu.setAttribute('class', 'menuAcciones');

    //los añadimos al body con appendChild
    document.body.appendChild(divFondo);
    document.body.appendChild(divLateral);
    document.body.appendChild(divMenu);

    //usamos la funcion que hemos creado para cargar imagenes con un bucle
    cargarImagenes(divLateral);
    //usamos la funcion creada para cargar el menu con las acciones que se pueden realizar
    cargarMenu(divMenu);

}

//funcion para la carga de imagenes de un array con un bucle dentro de un elemento pasado por parámetro
function cargarImagenes(elemento) {
    //si existe el elemento dentro del cual queremos cargar las imagenes
    if(elemento)
    {
        //creamos el array con las imagenes
        let imagenes=[];
        for(let i=1;i<=5;i++)
        {
            imagenes.push("./imagenes/im"+i+".png");
        }
        //bucle por el cual en cada iteracion se crea un elemento imagen y se añade
        for(let j=1; j<=imagenes.length; j++)
        {   
            //creamos los elementos y asignamos atributos
            let imagen=document.createElement('img');
            imagen.setAttribute('id',"imagen"+j);
            imagen.setAttribute('class', 'imagen');
            imagen.setAttribute('src', imagenes[j-1]) //-1 porque el bucle no empieza en 0
            imagen.setAttribute('title', "imagen"+j);
            //añadimos el elemento al nodo padre
            elemento.appendChild(imagen);
            //le asignamos eventos
            imagen.addEventListener("mousedown", clonar, false);
        }
    }
}

//funcion para la carga del menu de acciones con radio buttons
function cargarMenu(elemento) {
    //si existe el elemento dentro del cual queremos cargar el menu
    if(elemento)
    {
        //creamos los elementos nuevos que colgarán del elemento que se pasa por parámetro
        let radioDisminuir=document.createElement('input');
        let labelDisminuir=document.createElement('label');
        let textoLabelDisminuir=document.createTextNode('Disminuir Tamaño');
        let radioAumentar=document.createElement('input');
        let labelAumentar=document.createElement('label');
        let textoLabelAumentar=document.createTextNode('Aumentar Tamaño');
        let radioBorrar=document.createElement('input');
        let labelBorrar=document.createElement('label');
        let textoLabelBorrar=document.createTextNode('Borrar');
        let botonGuardar=document.createElement('input');
        //asignamos los atributos
        radioDisminuir.setAttribute('type', 'radio');
        radioDisminuir.setAttribute('id', 'disminuir');
        radioDisminuir.setAttribute('name', 'menu');
        radioDisminuir.setAttribute('class', 'radioMenu');
        labelDisminuir.setAttribute('for', 'disminuir');

        radioAumentar.setAttribute('type', 'radio');
        radioAumentar.setAttribute('id', 'aumentar');
        radioAumentar.setAttribute('name', 'menu');
        radioAumentar.setAttribute('class', 'radioMenu');
        labelAumentar.setAttribute('for', 'aumentar');

        radioBorrar.setAttribute('type', 'radio');
        radioBorrar.setAttribute('id', 'borrar');
        radioBorrar.setAttribute('name', 'menu');
        radioBorrar.setAttribute('class', 'radioMenu');
        labelBorrar.setAttribute('for', 'borrar');

        botonGuardar.setAttribute('type', 'button');
        botonGuardar.setAttribute('id', 'guardar');
        botonGuardar.setAttribute('value', 'Guardar Imagen');

        //añadimos los elementos creados en su nodo padre correspondiente
        elemento.appendChild(radioDisminuir);
        elemento.appendChild(labelDisminuir);
        labelDisminuir.appendChild(textoLabelDisminuir);
        elemento.appendChild(radioAumentar);
        elemento.appendChild(labelAumentar);
        labelAumentar.appendChild(textoLabelAumentar);
        elemento.appendChild(radioBorrar);
        elemento.appendChild(labelBorrar);
        labelBorrar.appendChild(textoLabelBorrar);
        elemento.appendChild(botonGuardar);

        //añadimos un evento al boton de guardar
        document.getElementById("guardar").addEventListener("click", guardarImagen);
    }
}

function clonar(event) {
    let imagenOriginal=event.target;
    //clonamos el nodo usando true para que se clone con sus hijos si tuviera
    let clonImagen=imagenOriginal.cloneNode(true);
    //cambiamos el id para evitar duplicados
    clonImagen.setAttribute('id', imagenOriginal.id+"Clon");
    //asignamos nueva clase
    clonImagen.setAttribute('class', 'clones');
    //asignamos tamaño y zindex con javascript para poder modificarlo despues
    clonImagen.style.width='20%';
    clonImagen.style.zIndex=zIndexImagen;
    document.getElementById('fondo').appendChild(clonImagen);
    //le asignamos tambien eventos
    clonImagen.addEventListener('click', moverImagen);
    clonImagen.addEventListener('contextmenu', accionBotonDerecho, false);
}


//funcion para mover la imagen clonada
function moverImagen(event) {
    //localizamos la imagen que vamos a mover
    moviendoImagen=event.target;
    //la imagen con el evento se pone por encima de las demas
    zIndexImagen++;
    event.target.style.zIndex=zIndexImagen;
    //para que la imagen seleccionado no cambie de sitio al hacer click sobre ella
    let zonaImagen=event.target.getBoundingClientRect();    
    imagenX=event.clientX - zonaImagen.left;
    imagenY=event.clientY - zonaImagen.top;
    //hacemos el seguimiento del movimiento del raton
    document.addEventListener('mousemove', arrastrar);
}

function arrastrar(event){
    //si estamos moviendo una imagen
    if(moviendoImagen)
    {
        //necesitamos conocer las coordenadas de la imagen respecto al contenedor para que no se salga de la zona
        zona=document.getElementById('fondo').getBoundingClientRect();
        let x=event.clientX - zona.left - imagenX;
        let y=event.clientY - zona.top - imagenY;
        //limitamos el movimiento para que no salga la imagen del contenedor estableciendo máximo y mínimo
        x=Math.max(0, Math.min(x, zona.width - moviendoImagen.clientWidth));
        y=Math.max(0, Math.min(y, zona.height - moviendoImagen.clientHeight));
        console.log(imagenX);
        console.log(imagenY);
        moviendoImagen.style.left=x+"px";
        moviendoImagen.style.top=y+"px";
        //quitamos la asignacion de la funcion moverImagen al evento click
        event.target.removeEventListener('click', moverImagen);
        //para asignar a ese evento la funcion colocarImagen
        document.addEventListener('click', colocarImagen);
    }
}

function colocarImagen(event){
    console.log(event.target);
    //quitamos la asignacion de la funcion colocarImagen al evento click
    document.removeEventListener('click', colocarImagen);
    //volvemos la variable de la imagen que estamos moviendo a null
    moviendoImagen=null;
    //volvemos a asignar el evento de click para volver a arrastrarlo si queremos
    event.target.addEventListener('click', moverImagen);
}

//funcion con acciones que se desencadenan si pulsas el boton derecho
function accionBotonDerecho(event) {
    //lo primero que hacemos es evitar la accion por defecto que es el menu
    event.preventDefault();
    //necesitamos el tamaño de la imagen 
    let tamanyo=event.target.style.width;
    //la imagen con el evento se pone por encima de las demas
    event.target.style.zIndex++;
    if(document.getElementById('borrar').checked)
    {
        event.target.remove();
    }
    if(document.getElementById('aumentar').checked)
    {
        event.target.style.width=parseInt(tamanyo)+3 +"%";
    }
    if(document.getElementById('disminuir').checked)
        {
            event.target.style.width=parseInt(tamanyo)-3 +"%";
        }
}

//GUARDAR IMAGEN
//me hubiera gustado hacerlo bien usando la etiqueta canvas metiendo las imagenes dentro y tal
//pero me he dado cuenta cuando ya lo tenía todo hecho y voy regular de tiempo para cambiarlo todo
//voy a usar una libreria externa tal como comentamos en una clase
function guardarImagen() {
    //guardamos en una variable el div que vamos a guardar como imagen
    let imagen=document.getElementById('fondo');
    //usamos la libreria hmtl2canvas para capturar visualmente el elemento
    //es una funcion asíncrona y tenemos que usar then() para continuar cuando termine
    html2canvas(imagen).then(canvas =>{
        //creamos un elemento a que será un enlace temporal para la descarga de la imagen
        let enlaceTemporal=document.createElement("a");
        //le indicamos al navegador que es una enlace de descarga
        enlaceTemporal.download="imagen.png";
        //generamos una url en base64 a partir del contenido de la imagen y se lo asignamos al atributo href del enlace
        enlaceTemporal.href=canvas.toDataURL("image/png");
        //simulamos un evento click en el enlace temporal
        enlaceTemporal.click();
    });
}