$(document).ready(function() {

var images = [];
var imagesSegmentadas = [];
var colorspace = [];
var canny = [];
var watershed = [];
var j = 0;
var contador = 0;
var maxCanny
var minCanny
var contador_evaluar = 0;


$("#zonaCriterios").hide();
$("#zonaVisualizacion").hide();
$("#zonaResultados").hide();

$('#contact').css("display", "none");
$('#contactResults').css("display", "none");

$(function () {
   $('[data-toggle="tooltip"]').tooltip()
 })

$("#files").change(function(){
  images = [];
  var files = $("#files").prop("files");
     cantidad = files.length;
       for (var i = 0; i < cantidad; i++) {
           (function (file) {
               if (file.type.indexOf("image") == 0) {
                   var fileReader = new FileReader();
                   fileReader.onload = function (f) {
                       var data = f.target.result;
                       images.push(data);

                   };

                   fileReader.readAsDataURL(file);
               }
           })(files[i]);
       }
    });

    $("#filesPropios").change(function(){
      imagesSegmentadas = [];
      //alert("cambie y no quería");
      var files = $("#filesPropios").prop("files");
         cantidad = files.length;
           for (var i = 0; i < cantidad; i++) {
               (function (file) {
                   if (file.type.indexOf("image") == 0) {
                       var fileReader = new FileReader();
                       fileReader.onload = function (f) {
                           var data = f.target.result;
                           imagesSegmentadas.push(data);

                       };

                       fileReader.readAsDataURL(file);
                   }
               })(files[i]);
           }
        });

$('#seleccionMetodos').change(function(){
    contador = contador + 1;
    console.log(contador);
    if(contador % 2 == 0) {
    $("#filesPropios").prop( "disabled", true );
    }
  else {
    //alert("impar");
    $("#filesPropios").prop( "disabled", false );
  }

});

$( "#segmentar" ).click(function() {
     //console.log('arraysss ');
     //console.log(images)

     if (!$('#redBand').val()){
      swal({
            title: "Oops!",
            text: "Banda roja vacía",
            icon: "warning"
          });
    }
    else{
      redBand=$('#redBand').val();
      colorspace.push(redBand);
      $('#redBand').val('');
    }

    if (!$('#greenBand').val()){
     swal({
           title: "Oops!",
           text: "Banda verde vacía",
           icon: "warning"
         });
   }
   else{
     greenBand=$('#greenBand').val();
     colorspace.push(greenBand);
     $('#greenBand').val('');
   }

   if (!$('#blueBand').val()){
    swal({
          title: "Oops!",
          text: "Banda verde vacía",
          icon: "warning"
        });
  }
  else{
    blueBand=$('#blueBand').val();
    colorspace.push(blueBand);
    $('#blueBand').val('');
  }


  if (!$('#umbralColorSpace').val()){

   swal({
         title: "Oops!",
         text: "Umbral vacío",
         icon: "warning"
       });
 }
 else{
   umbralColorSpace=$('#umbralColorSpace').val();
   colorspace.push(umbralColorSpace);
   $('#umbralColorSpace').val('');
 }


 if (!$('#minCanny').val()){

  swal({
        title: "Oops!",
        text: "Mínimo vacío Canny",
        icon: "warning"
      });
}
else{
  minCanny=$('#minCanny').val();
  canny.push(minCanny);
  $('#minCanny').val('');
}

if (!$('#maxCanny').val()){

 swal({
       title: "Oops!",
       text: "Maxímo vacío Canny",
       icon: "warning"
     });
}
else{
 maxCanny=$('#maxCanny').val();
 canny.push(maxCanny);
 $('#maxCanny').val('');
}



if (!$('#sobelKernel').val()){

 swal({
       title: "Oops!",
       text: "Kernel vacío Canny",
       icon: "warning"
     });
}
else{
 sobelKernel=$('#sobelKernel').val();
 canny.push(sobelKernel);
 $('#sobelKernel').val('');
}

if (!$('#umbralWatershed').val()){

 swal({
       title: "Oops!",
       text: "Umbral vacío Watershed",
       icon: "warning"
     });
}
else{
 umbralWatershed=$('#umbralWatershed').val();
 watershed.push(umbralWatershed);
 $('#umbralWatershed').val('');
}

if (!$('#kernelWatershed').val()){

 swal({
       title: "Oops!",
       text: "Kernel vacío Watershed",
       icon: "warning"
     });
}
else{
 kernelWatershed=$('#kernelWatershed').val();
 watershed.push(kernelWatershed);
 $('#kernelWatershed').val('');
}



var longitudImages = images.length;
var longitudColorspace = colorspace.length;
var longitudCanny = canny.length;
var longitudWatershed = watershed.length;
console.log(longitudImages);
console.log(images)

if(longitudImages < 1){
  images = [];
  colorspace = [];
  canny = [];
  watershed = [];
 swal({
       title: "Oops!",
       text: "Se debe cargar imágenes",
       icon: "warning"
     });
}
else if(longitudColorspace !== 4 || longitudCanny !==3 || longitudWatershed !==2){
  colorspace = [];
  canny = [];
  watershed = [];
  swal({
        title: "Oops!",
        text: "Se debe llenar todos los campos de segmentación",
        icon: "warning"
      });

}
else{
  $("#files").prop( "disabled", true );
  $("#zonaSegmentation :input").attr("disabled", true);
  $('#contactForm').fadeToggle();
  var jsonFinal ='{ ';
  for (i = 0; i < longitudImages; i++){
    if (j == 0){
      jsonFinal += '"'+(j++)+'" : '+'"'+images[i]+'" , ';
    }
    else{
      jsonFinal += '"'+(j++)+'" : '+'"'+images[i]+'" , ';
    }
  }

  for (i = 0; i < longitudColorspace; i++){
      jsonFinal += '"'+(j++)+'" : '+'"'+colorspace[i]+'" , ';
  }

  for (i = 0; i < longitudCanny; i++){
      jsonFinal += '"'+(j++)+'" : '+'"'+canny[i]+'" , ';
  }

  for (i = 0; i < longitudWatershed; i++){
      if(i < longitudWatershed-1){
        jsonFinal += '"'+(j++)+'" : '+'"'+watershed[i]+'" , ';
      }
      else {
        jsonFinal += '"'+(j++)+'" : '+'"'+watershed[i]+'" ';
      }

  }
  jsonFinal +=' }';

  var obj = JSON.parse(jsonFinal);

  $.ajax({
  	data : obj,
  	type : 'POST',
  	url : '/segmentation'
  })

  .done(function(data) {

  if (data.error) {
    $('#contactForm').fadeToggle();
    swal("Oops!", data.error);
  }
  else {
    console.log('exitoso');

    $("#zonaVisualizacion").show();

    $("#zonaCriterios").show();
    $('#contactForm').fadeToggle();


    encode_images_cs = data.imaCS
    encode_images_canny = data.imaCanny
    encode_images_watershed = data.imaWater

    var longitudCS = encode_images_cs.length;
    var longitudCanny = encode_images_canny.length;
    var longitudWatershed = encode_images_watershed.length;


    var imgArrayCs = new Array();
    var imgArrayCanny = new Array();
    var imgArrayWatershed = new Array();
    for (i = 0; i < longitudCS; i++){
      imgArrayCs[i] = new Image();
      imgArrayCanny[i] = new Image();
      imgArrayWatershed[i] = new Image();
      imgArrayCs[i].src = encode_images_cs[i]
      imgArrayCanny[i].src = encode_images_canny[i]
      imgArrayWatershed[i].src = encode_images_watershed[i]
      if(i == 0){
        $("#controlUno").append("<div class='carousel-item active'><img class='d-block w-100' src="+imgArrayCs[i].src+ "></div>")
        $("#controlDos").append("<div class='carousel-item active'><img class='d-block w-100' src="+imgArrayCanny[i].src+ "></div>")
        $("#controlTres").append("<div class='carousel-item active'><img class='d-block w-100' src="+imgArrayWatershed[i].src+ "></div>")
      }else{
        $("#controlUno").append("<div class='carousel-item'><img class='d-block w-100' src="+imgArrayCs[i].src+ "></div>")
        $("#controlDos").append("<div class='carousel-item'><img class='d-block w-100' src="+imgArrayCanny[i].src+ "></div>")
        $("#controlTres").append("<div class='carousel-item'><img class='d-block w-100' src="+imgArrayWatershed[i].src+ "></div>")
      }
    }
  }
  });

}
event.preventDefault();
});


$( "#comparar" ).click(function() {
  contador_evaluar = contador_evaluar+1;
  var longitudImages
  if(contador_evaluar > 1){
    $("#resultados").empty()
    $("#buttonsDown").empty()
    $("#images_canvas").empty()
    $("#resultados_tables").empty()
    $("#buttonsDown_tables").empty()
    $("#enlaces").empty()

  }
  var metodosComparacion = [];
  $.each($("input[name='metodos']:checked"), function(){
                  metodosComparacion.push($(this).val());
              });
 var cantidadMetodos = metodosComparacion.length;
  var valueTipoComparacion = $("input[name='inlineRadioOptions']:checked").val();
 if(cantidadMetodos < 2){
   metodosComparacion = []
   swal({
         title: "Oops!",
         text: "Seleccionar más de un criterio de comparación",
         icon: "warning"
       });
 }
 else{

   var j = 0;
    if(valueTipoComparacion == 'option2'){
      var longitudImagesSegmentadas = imagesSegmentadas.length;
      var longitudImages = images.length;
      if(longitudImagesSegmentadas === longitudImages){
        $('#contactFormResults').fadeToggle();
        var jsonFinal ='{ ';
        for (i = 0; i < longitudImagesSegmentadas; i++){
          if (j == 0){
            jsonFinal += '"'+(j++)+'" : '+'"'+imagesSegmentadas[i]+'" , ';
          }
          else{
            jsonFinal += '"'+(j++)+'" : '+'"'+imagesSegmentadas[i]+'" , ';
          }
        }
        jsonFinal += '"'+(j++)+'" : '+'"'+metodosComparacion+'" , ';
        jsonFinal += '"'+(j++)+'" : '+'"'+valueTipoComparacion+'" ';
        jsonFinal +=' }';

        var objDos = JSON.parse(jsonFinal);

        $.ajax({
        	data : objDos,
        	type : 'POST',
        	url : '/comparar'
        })

        .done(function(data) {

        if (data.error) {
          swal("Oops!", data.error);
        }
        else {
          jaccard_indices = data.jaccard;
          dice_coeficientes = data.dice;
          npr_values = data.npr;
          criterios = data.criterios;
          metodos = data.metodos;

          jaccard_datos = data.jaccard_datos;
          dice_datos = data.dice_datos;
          npr_datos = data.npr_datos;
          jaccard_datos = jaccard_datos.split(":");
          dice_datos = dice_datos.split(":");
          npr_datos = npr_datos.split(":");
          var long_jaccard_datos = jaccard_datos.length;
          var long_dice_datos = dice_datos.length;
          var long_npr_datos = npr_datos.length;
          var jaccard_datos_final  = []
          var dice_datos_final = []
          var npr_datos_final = []
          for(i = 0; i < long_jaccard_datos; i++){
            jaccard_datos_final.push(jaccard_datos[i].split(","))
          }
          for(i = 0; i < long_dice_datos; i++){
            dice_datos_final.push(dice_datos[i].split(","))
          }

          for(i = 0; i < long_npr_datos; i++){
            npr_datos_final.push(npr_datos[i].split(","))
          }


          $('#contactFormResults').fadeToggle();
          $("#zonaResultados").show();

          var longitudCriterios = criterios.length;
          var longitudMetodos = metodos.length;

          var id_progress = [];
          var metodos_values = []
          var id_downloads = []
          var id_consolidado = []
          var id_tables = []

          for(i = 0; i < longitudCriterios; i++){
            if(criterios[i] == 'jaccard'){
              $("#resultados").append("<div class='col text-center' id = "+criterios[i]+"progress"+"><h4>Jaccard Index</h4></div><br>");
              id_progress.push(criterios[i]+"progress");
            }
            else if(criterios[i] == 'sorense'){
              $("#resultados").append("<div class='col text-center' id = "+criterios[i]+"progress"+"><h4>Sorense-Dice Coefficient</h4></div><br>");
              id_progress.push(criterios[i]+"progress");
            }
            else{
              $("#resultados").append("<div class='col text-center' id = "+criterios[i]+"progress"+"><h4>Normalized Probabilistic Rand</h4></div><br>");
              id_progress.push(criterios[i]+"progress");
            }

          }

          if(jaccard_indices.length > 0){
            metodos_values.push(jaccard_indices)
          }
          if(dice_coeficientes.length > 0){
            metodos_values.push(dice_coeficientes)
          }
          if(npr_values.length > 0){
            metodos_values.push(npr_values)
          }

          var longitud_id_progress = id_progress.length;
          var longitud_metodos_values = metodos_values.length;

          var array_colores = ['#689CA1','#5776A3','#A97DBC',"#E45C76"]

          for(i = 0; i < longitud_id_progress; i++){
            console.log('entre id progress')
              for(j = 0; j < metodos_values[i].length; j++){
                  $("#"+id_progress[i]+"").append("<div class='progress' style='height:30px;width:70%;margin-left: auto;margin-right: auto;'><div class='progress-bar' role='progressbar' style='width: "+((metodos_values[i][j])*100)+"%;background-color:"+array_colores[j]+"' aria-valuenow="+metodos_values[i][j]+"aria-valuemin='0' aria-valuemax='1'></div><span class='progress-type'>"+metodos[j]+"</span><span class='progress-completed text-right'>"+metodos_values[i][j]+"</span></div><br>")
              }

          }

          for(i = 0; i<longitud_id_progress; i++){
            $("#buttonsDown").append("<div class='col text-center'><button id="+criterios[i]+"button"+" type='button' class='btn btn-primary text-center'>Descargar</button></div>");
            id_downloads.push(criterios[i]+"button");

          }

          for(i = 0; i < longitudCriterios; i++){
            $("#resultados_tables").append("<div class='table-wrapper-scroll-y my-custom-scrollbar table-responsive table-striped col' id="+criterios[i]+"_table"+"></div>");
            id_tables.push(criterios[i]+"_table");
          }

          for(i = 0; i < longitudCriterios; i++){
             if(criterios[i] == 'jaccard'){
               var html = "<table  class='table table-bordered table-hover'><tr>";
               html+="<th>ID imagen</th>";
               for(j = 0; j<longitudMetodos; j++){
                 html+="<th>"+metodos[j]+"</th>";
               }
               html += "</tr>";

               for(k = 0; k<longitudImages; k++){
                 html += "<tr>";
                   html+="<td>"+(k+1)+"</td>"
                   for(p = 0; p<longitudMetodos; p++){
                     html+="<td>"+jaccard_datos_final[p][k]+"</td>";
                   }

                 html += "</tr>";
               }

               html += "</table>";
               $("#"+id_tables[i]+"").append(html);
             }
             else if(criterios[i] == 'sorense'){
               var html = "<table  class='table table-bordered table-hover'><tr>";
               html+="<th>ID imagen</th>";
               for(j = 0; j<longitudMetodos; j++){
                 html+="<th>"+metodos[j]+"</th>";
               }
               html += "</tr>";

               for(k = 0; k<longitudImages; k++){
                 html += "<tr>";
                   html+="<td>"+(k+1)+"</td>"
                   for(p = 0; p<longitudMetodos; p++){
                     html+="<td>"+dice_datos_final[p][k]+"</td>";
                   }

                 html += "</tr>";
               }

               html += "</table>";
               $("#"+id_tables[i]+"").append(html);
             }
             else{
               var html = "<table  class='table table-bordered table-hover'><tr>";
               html+="<th>ID imagen</th>";
               for(j = 0; j<longitudMetodos; j++){
                 html+="<th>"+metodos[j]+"</th>";
               }
               html += "</tr>";

               for(k = 0; k<longitudImages; k++){
                 html += "<tr>";
                   html+="<td>"+(k+1)+"</td>"
                   for(p = 0; p<longitudMetodos; p++){
                     html+="<td>"+npr_datos_final[p][k]+"</td>";
                   }

                 html += "</tr>";
               }

               html += "</table>";
               $("#"+id_tables[i]+"").append(html);
             }
          }


       for(i = 0; i<longitud_id_progress; i++){
         $("#buttonsDown_tables").append("<div class='col text-center'><button id="+criterios[i]+"consolidado"+" type='button' class='btn btn-primary text-center'>Descargar</button></div>");
         id_consolidado.push(criterios[i]+"consolidado");
       }






          var getCanvasJaccard;
            $("#jaccardbutton").on('click', function () {
              var element = $("#jaccardprogress"); // global variable

                   html2canvas(element, {
                   onrendered: function (canvas) {
                          var getCanvas;
                          $("#images_canvas").append(canvas);
                          getCanvasJaccard = canvas;
                          var imgageData = getCanvasJaccard.toDataURL("image/png");
                          console.log(imgageData);

                          var link = document.createElement('a');
                          link.download = "my-image.png";
                          link.href = imgageData;
                          link.click();


                       }

                   });
                   });

                   $("#jaccardconsolidado").on('click', function () {
                     $("#enlaces").append("<div class='col text-center'><a id='jaccard_csv' download='jaccard_consolidado.csv' href='/static/files/jaccard_consolidado.csv'></a></div>");
                     var elem = document.getElementById('jaccard_csv');
                     elem.click();


                          });

                   var getCanvasDice;
                     $("#sorensebutton").on('click', function () {
                       var element = $("#sorenseprogress"); // global variable
                       //var getCanvas;
                            html2canvas(element, {
                            onrendered: function (canvas) {
                                   var getCanvas;
                                   $("#images_canvas").append(canvas);
                                   getCanvasDice = canvas;
                                   var imgageData = getCanvasDice.toDataURL("image/png");
                                   console.log(imgageData);

                                   var link = document.createElement('a');
                                   link.download = "my-image.png";
                                   link.href = imgageData;
                                   link.click();

                                }

                            });
                            });

                            $("#sorenseconsolidado").on('click', function () {
                              $("#enlaces").append("<div class='col text-center'><a id='sorense_csv' download='sorense_dice_consolidado.csv' href='/static/files/sorense_dice_consolidado.csv'></a></div>");
                              var elem = document.getElementById('sorense_csv');
                              elem.click();
                              //var getCanvas;

                                   });

                            var getCanvasnpr;
                              $("#nprbutton").on('click', function () {
                                var element = $("#nprprogress"); // global variable
                                //var getCanvas;
                                     html2canvas(element, {
                                     onrendered: function (canvas) {
                                            var getCanvas;
                                            $("#images_canvas").append(canvas);
                                            getCanvasnpr = canvas;
                                            var imgageData = getCanvasnpr.toDataURL("image/png");
                                            console.log(imgageData);
                                            //var newData = imgageData.replace(/^data:image\/png/, "data:application/octet-stream");
                                            var link = document.createElement('a');
                                            link.download = "my-image.png";
                                            link.href = imgageData;
                                            link.click();
                                            }

                                     });

              });
              $("#nprconsolidado").on('click', function () {
                $("#enlaces").append("<div class='col text-center'><a id='npr_csv' download='npr_consolidado.csv' href='/static/files/npr_consolidado.csv'></a></div>");
                var elem = document.getElementById('npr_csv');
                elem.click();
                //var getCanvas;

                     });
        }
        });
      }
      else{
        swal({
              title: "Oops!",
              text: "La cantidad de imágenes segmentadas debe ser igual a las originales",
              icon: "warning"
            });
      }

    }


    else{
      $('#contactFormResults').fadeToggle();
        var jsonFinal ='{ ';
        jsonFinal += '"'+(j++)+'" : '+'"'+metodosComparacion+'" , ';
        jsonFinal += '"'+(j++)+'" : '+'"'+valueTipoComparacion+'" ';
        jsonFinal +=' }';

        var objDos = JSON.parse(jsonFinal);
        console.log(objDos)

        $.ajax({
        	data : objDos,
        	type : 'POST',
        	url : '/comparar'
        })

        .done(function(data) {

        if (data.error) {
          swal("Oops!", data.error);
        }
        else {
          jaccard_indices = data.jaccard;
          dice_coeficientes = data.dice;
          npr_values = data.npr;
          criterios = data.criterios;
          metodos = data.metodos;


          jaccard_datos = data.jaccard_datos;
          dice_datos = data.dice_datos;
          npr_datos = data.npr_datos;

          jaccard_datos = jaccard_datos.split(":");
          dice_datos = dice_datos.split(":");
          npr_datos = npr_datos.split(":");
          var long_jaccard_datos = jaccard_datos.length;
          var long_dice_datos = dice_datos.length;
          var long_npr_datos = npr_datos.length;
          var jaccard_datos_final  = []
          var dice_datos_final = []
          var npr_datos_final = []
          for(i = 0; i < long_jaccard_datos; i++){
            jaccard_datos_final.push(jaccard_datos[i].split(","))
          }
          for(i = 0; i < long_dice_datos; i++){
            dice_datos_final.push(dice_datos[i].split(","))
          }

          for(i = 0; i < long_npr_datos; i++){
            npr_datos_final.push(npr_datos[i].split(","))
          }


          var longitudImages = images.length;
          //$('#visualizacion').show();
          //alert('debería visualizacion');
          //$("#zonaVisualizacion").css('visibility', 'visible');
          $('#contactFormResults').fadeToggle();
          $("#zonaResultados").show();
          //$("#zonaResultados").css('visibility', 'visible');
          //$("#zonaCriterios").css('visibility', 'visible');
          //console.log(da.imaCS);
          //console.log(data.imaCS[0])
          var longitudCriterios = criterios.length;

          var longitudMetodos = metodos.length;


          //$("#zonaResultados").append("<br><hr/ id='separador'><h1>Zona de Resultados</h1>  <hr/ id='separador'><br>");
          var id_progress = [];
          var metodos_values = []
          var id_downloads = []
          var id_consolidado = []
          var id_tables = []

          for(i = 0; i < longitudCriterios; i++){
            if(criterios[i] == 'jaccard'){
              $("#resultados").append("<div class='col text-center' id = "+criterios[i]+"progress"+"><h4>Jaccard Index</h4></div><br>");
              id_progress.push(criterios[i]+"progress");
            }
            else if(criterios[i] == 'sorense'){
              $("#resultados").append("<div class='col text-center' id = "+criterios[i]+"progress"+"><h4>Sorense-Dice Coefficient</h4></div><br>");
              id_progress.push(criterios[i]+"progress");
            }
            else{
              $("#resultados").append("<div class='col text-center' id = "+criterios[i]+"progress"+"><h4>Normalized Probabilistic Rand</h4></div><br>");
              id_progress.push(criterios[i]+"progress");
            }

          }

          if(jaccard_indices.length > 0){
            metodos_values.push(jaccard_indices)
          }
          if(dice_coeficientes.length > 0){
            metodos_values.push(dice_coeficientes)
          }
          if(npr_values.length > 0){
            metodos_values.push(npr_values)
          }

          var longitud_id_progress = id_progress.length;
          var longitud_metodos_values = metodos_values.length;

          var array_colores = ['#689CA1','#5776A3','#A97DBC',"#E45C76"]

          for(i = 0; i < longitud_id_progress; i++){

              for(j = 0; j < metodos_values[i].length; j++){
                  $("#"+id_progress[i]+"").append("<div class='progress' style='height:30px;width:70%;margin-left: auto;margin-right: auto;'><div class='progress-bar' role='progressbar' style='width: "+((metodos_values[i][j])*100)+"%;background-color:"+array_colores[j]+"' aria-valuenow="+metodos_values[i][j]+"aria-valuemin='0' aria-valuemax='1'></div><span class='progress-type'>"+metodos[j]+"</span><span class='progress-completed text-right'>"+metodos_values[i][j]+"</span></div><br>")
              }

          }

          for(i = 0; i<longitud_id_progress; i++){
            $("#buttonsDown").append("<div class='col text-center'><button id="+criterios[i]+"button"+" type='button' class='btn btn-primary text-center'>Descargar</button></div>");
            id_downloads.push(criterios[i]+"button");
            }


          for(i = 0; i < longitudCriterios; i++){
            $("#resultados_tables").append("<div class='table-wrapper-scroll-y my-custom-scrollbar table-responsive table-striped col' id="+criterios[i]+"_table"+"></div>");
            id_tables.push(criterios[i]+"_table");
          }

          for(i = 0; i < longitudCriterios; i++){
             if(criterios[i] == 'jaccard'){
               var html = "<table  class='table table-bordered table-hover'><tr>";
               html+="<th>ID imagen</th>";
               for(j = 0; j<longitudMetodos; j++){
                 html+="<th>"+metodos[j]+"</th>";
               }
               html += "</tr>";

               for(k = 0; k<longitudImages; k++){
                 html += "<tr>";
                   html+="<td>"+(k+1)+"</td>"
                   for(p = 0; p<longitudMetodos; p++){
                     html+="<td>"+jaccard_datos_final[p][k]+"</td>";
                   }

                 html += "</tr>";
               }

               html += "</table>";
               $("#"+id_tables[i]+"").append(html);
             }
             else if(criterios[i] == 'sorense'){
               var html = "<table  class='table table-bordered table-hover'><tr>";
               html+="<th>ID imagen</th>";
               for(j = 0; j<longitudMetodos; j++){
                 html+="<th>"+metodos[j]+"</th>";
               }
               html += "</tr>";

               for(k = 0; k<longitudImages; k++){
                 html += "<tr>";
                   html+="<td>"+(k+1)+"</td>"
                   for(p = 0; p<longitudMetodos; p++){
                     html+="<td>"+dice_datos_final[p][k]+"</td>";
                   }

                 html += "</tr>";
               }

               html += "</table>";
               $("#"+id_tables[i]+"").append(html);
             }
             else{
               var html = "<table  class='table table-bordered table-hover'><tr>";
               html+="<th>ID imagen</th>";
               for(j = 0; j<longitudMetodos; j++){
                 html+="<th>"+metodos[j]+"</th>";
               }
               html += "</tr>";

               for(k = 0; k<longitudImages; k++){
                 html += "<tr>";
                   html+="<td>"+(k+1)+"</td>"
                   for(p = 0; p<longitudMetodos; p++){
                     html+="<td>"+npr_datos_final[p][k]+"</td>";
                   }

                 html += "</tr>";
               }

               html += "</table>";
               $("#"+id_tables[i]+"").append(html);
             }
          }


          for(i = 0; i<longitud_id_progress; i++){

            $("#buttonsDown_tables").append("<div class='col text-center'><button id="+criterios[i]+"consolidado"+" type='button' class='btn btn-primary text-center'>Descargar</button></div>");
            id_consolidado.push(criterios[i]+"consolidado");
          }

          var getCanvasJaccard;
            $("#jaccardbutton").on('click', function () {
              var element = $("#jaccardprogress"); // global variable

                   html2canvas(element, {
                   onrendered: function (canvas) {
                          var getCanvas;
                          $("#images_canvas").append(canvas);
                          getCanvasJaccard = canvas;
                          var imgageData = getCanvasJaccard.toDataURL("image/png");
                          console.log(imgageData);
                          //var newData = imgageData.replace(/^data:image\/png/, "data:application/octet-stream");
                          var link = document.createElement('a');
                          link.download = "my-image.png";
                          link.href = imgageData;
                          link.click();
                          }

                   });
                   });

                   $("#jaccardconsolidado").on('click', function () {
                     $("#enlaces").append("<div class='col text-center'><a id='jaccard_csv' download='jaccard_consolidado.csv' href='/static/files/jaccard_consolidado.csv'></a></div>");
                     var elem = document.getElementById('jaccard_csv');
                     elem.click();
                     //var getCanvas;

                          });

                   var getCanvasDice;
                     $("#sorensebutton").on('click', function () {
                       var element = $("#sorenseprogress"); // global variable
                       //var getCanvas;
                            html2canvas(element, {
                            onrendered: function (canvas) {
                                   var getCanvas;
                                   $("#images_canvas").append(canvas);
                                   getCanvasDice = canvas;
                                   var imgageData = getCanvasDice.toDataURL("image/png");
                                   console.log(imgageData);
                                   //var newData = imgageData.replace(/^data:image\/png/, "data:application/octet-stream");
                                   var link = document.createElement('a');
                                   link.download = "my-image.png";
                                   link.href = imgageData;
                                   link.click();
                                   //$("#btn-Convert-Html2Image").attr("download", "your_pic_name.png").attr("href", newData);
                                   //$('#btn-Convert-Html2Image').click();
                                }

                            });
                            });

                            $("#sorenseconsolidado").on('click', function () {
                              $("#enlaces").append("<div class='col text-center'><a id='sorense_csv' download='sorense_dice_consolidado.csv' href='/static/files/sorense_dice_consolidado.csv'></a></div>");
                              var elem = document.getElementById('sorense_csv');
                              elem.click();
                              //var getCanvas;

                                   });

                            var getCanvasnpr;
                              $("#nprbutton").on('click', function () {
                                var element = $("#nprprogress"); // global variable
                                //var getCanvas;
                                     html2canvas(element, {
                                     onrendered: function (canvas) {
                                            var getCanvas;
                                            $("#images_canvas").append(canvas);
                                            getCanvasnpr = canvas;
                                            var imgageData = getCanvasnpr.toDataURL("image/png");
                                            console.log(imgageData);
                                            //var newData = imgageData.replace(/^data:image\/png/, "data:application/octet-stream");
                                            var link = document.createElement('a');
                                            link.download = "my-image.png";
                                            link.href = imgageData;
                                            link.click();
                                            //$("#btn-Convert-Html2Image").attr("download", "your_pic_name.png").attr("href", newData);
                                            //$('#btn-Convert-Html2Image').click();
                                         }

                                     });

              });
              $("#nprconsolidado").on('click', function () {
                $("#enlaces").append("<div class='col text-center'><a id='npr_csv' download='npr_consolidado.csv' href='/static/files/npr_consolidado.csv'></a></div>");
                var elem = document.getElementById('npr_csv');
                elem.click();
                //var getCanvas;

                     });







        }
        });
    }

 }










event.preventDefault();



});








});

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
