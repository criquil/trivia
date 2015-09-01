var colors = ["#ffc702", "#00c2f5", "#fe21af", "#3e94fb", "#83cc01"];
var categorias = ["deportes", "peliculas", "arte", "geografia", "historia"];

var angulo = 360 / categorias.length;
var anguloinicial = 0;
var anguloincrement = 0;

var time;
var vueltasrandom = Math.floor((Math.random() * (10000 - 40000 + 1)) + 40000);

var img0 = new Image();
var img1 = new Image();
var img2 = new Image();
var img3 = new Image();
var img4 = new Image();
var categoryselected;

$(document).ready(function () {
    img0.src = 'images/categorias-small/curso-icon-deporte-chico.png';
    img1.src = 'images/categorias-small/peliculas-chico.png';
    img2.src = 'images/categorias-small/arte-chico.png';
    img3.src = 'images/categorias-small/geografia-chico.png';
    img4.src = 'images/categorias-small/historia-chico.png';

    (img0 && img1 && img2 && img3 && img4).onload = function () {
        dibujo_ruleta();
    };
});

    //Receives canvas element identifier and loads canvas
    //Returns the context or false
function cargaContextoCanvas(idCanvas) {
    var elemento = document.getElementById(idCanvas);
    if (elemento && elemento.getContext) {
        var contexto = elemento.getContext('2d');
        elemento.addEventListener("click", rotar, false);
        if (contexto) {
            return contexto;
        }
    }
    return FALSE;
}

    //Draw the spin
function dibujo_ruleta() {
    var ctx = cargaContextoCanvas('micanvas');
    if (ctx) {


        var ancho = document.getElementById('micanvas').width;
        var alto = document.getElementById('micanvas').height;

        ctx.clearRect(0, 0, ancho, alto);

        ctx.fillStyle = "#e1e1e1";
        ctx.beginPath();
        ctx.arc(ancho / 2, alto / 2, 160, Math.PI * (0 / 180), Math.PI * (360 / 180), false);
        ctx.closePath();
        ctx.fill();

        // categoria ganadora
        categoryselected = categorias.length - Math.floor(((Math.PI * (anguloinicial / 180)) / (Math.PI * 2)) * categorias.length) - 1;
        for (i = 0; i < categorias.length; i++) {

            ctx.fillStyle = colors[i];
            ctx.beginPath();
            ctx.moveTo(ancho / 2, alto / 2);
            ctx.arc(ancho / 2, alto / 2, 150, Math.PI * (anguloincrement / 180), Math.PI * (((anguloinicial + angulo * (i + 1))) / 180), false);

            ctx.lineTo(ancho / 2, alto / 2);
            ctx.closePath();
            ctx.fill();

            ctx.save();
            ctx.translate((ancho / 2), (alto / 2));
            ctx.rotate(((Math.PI * (anguloincrement / 180) + Math.PI * (((anguloinicial + angulo * (i + 1))) / 180)) / 2) + 20);
            if (i == 0) { ctx.drawImage(img0, 10, -120); }
            if (i == 1) { ctx.drawImage(img1, 10, -120); }
            if (i == 2) { ctx.drawImage(img2, 10, -120); }
            if (i == 3) { ctx.drawImage(img3, 10, -120); }
            if (i == 4) { ctx.drawImage(img4, 10, -120); }
            ctx.restore();

            anguloincrement = anguloinicial + angulo * (i + 1);

        }//fin for

        anguloinicial = anguloincrement;

        ctx.fillStyle = "#ebebeb";
        ctx.beginPath();
        ctx.moveTo((ancho / 2) + 45, (alto / 2) + 0);
        ctx.arc(ancho / 2, alto / 2, 35, Math.PI * (15 / 180), Math.PI * (345 / 180), false);
        ctx.lineTo((ancho / 2) + 45, (alto / 2) + 0);
        ctx.closePath();
        ctx.fill();

        var grd = ctx.createRadialGradient(ancho / 2, alto / 2, 0, (ancho / 2), (alto / 2), 60);
        grd.addColorStop(0, "#c6c6c6");
        grd.addColorStop(1, "#7d7d7d");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(ancho / 2, alto / 2, 25, Math.PI * (0 / 180), Math.PI * (360 / 180), false);
        ctx.closePath();
        ctx.fill();

    }//fin ctx
}//fin dbujo ruleta

    //Spins the spin
function rotar() {
    if (anguloinicial < vueltasrandom) {
        anguloinicial += 20;
        anguloincrement += 20;
        dibujo_ruleta();
        time = setTimeout(function () { rotar() }, 30);
    }
    else {
        anguloinicial = anguloinicial - (360 * Math.floor(anguloinicial / 360));//simplifico el anugulo
        anguloincrement = anguloincrement - (360 * Math.floor(anguloincrement / 360));

        dibujo_ruleta();
        vueltasrandom = Math.floor((Math.random() * (10000 - 40000 + 1)) + 40000);
        setTimeout(function () {
            changeView("sectionCategoriaSeleccionada");
            var categoria = categorias[categoryselected];
            $("#sectionCategoriaSeleccionada").removeClass("deportes peliculas arte geografia historia");
            $("#sectionCategoriaSeleccionada").addClass(categoria);
        }, 2000);
    }
}

    //Receives the response and the status, and reacts
function resolveResponse(respuesta, status) {
    $('ul.opciones_respuestas li').each(function (index) {
        if (index + 1 == respuesta) {
            $(this).addClass('correcta');
        }
        else {
            $(this).addClass('incorrecta');
        }
    });
    if (status == 0) {
        resultadoClass = "ganaste";
        setTimeout(function () { changeView("sectionRueda") }, 6000);
    }
    else {
        resultadoClass = "perdiste";
        setTimeout(function () { changeView("sectionEspera") }, 6000);
    }
    $("#sectionResultado").find(".resultado").removeClass("ganaste perdiste");
    $("#sectionResultado").find(".resultado").addClass(resultadoClass);
    setTimeout(function () { changeView("sectionResultado") }, 2000);
}

    //Renders the question on the screen
function showQuestion(question) {
    $("#txtPregunta").html(question.question);
    var i = 0;
    $('ul.opciones_respuestas li').removeClass("correcta incorrecta");
    question.responses.forEach(function (data) {
        $("#txtRespuesta" + ++i).html(data.option);
    });
}

    //Receives the target section as parameter and makes it visible
function changeView(section) {
    $("#sectionEspera").removeClass("visible").addClass("hidden");
    $("#sectionRueda").removeClass("visible").addClass("hidden");
    $("#sectionCategoriaSeleccionada").removeClass("visible").addClass("hidden");
    $("#sectionPreguntas").removeClass("visible").addClass("hidden");
    $("#sectionResultado").removeClass("visible").addClass("hidden");
    $("#" + section).addClass("visible").removeClass("hidden");
}


    //Renders points on the screen
function refreshPoints(points) {
    $(".myPoints").html(points.me);
    $(".myOpponentPoints").html(points.myOpponent);
}