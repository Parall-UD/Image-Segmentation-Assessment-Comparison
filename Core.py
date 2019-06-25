from flask import Flask, render_template, request, jsonify
from datetime import datetime, date, time, timedelta
import cargador as ca
import cv2
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import procesamiento as ps
import base64
from io import BytesIO
from PIL import Image
import criterios as cr
import pandas as pd

app = Flask(__name__)

@app.route('/')
def index():
	return render_template('principal.html')

@app.route('/manuales')
def manuales():
	return render_template('manuales.html')

@app.route('/segmentation', methods=['POST'])
def process():
    parametros=[]
    contenido = request.form
    diccionarioContenido=contenido.copy()

    for i in range(len(diccionarioContenido)):
        parametros.append(diccionarioContenido[str(i)])

    #print(parametros)

    kernelWatershed = int(parametros.pop())
    umbralWatershed = int(parametros.pop())
    kernelSobel = int(parametros.pop())
    minHysteresis = int(parametros.pop())
    maxHysteresis = int(parametros.pop())
    umbralColorSpace = int(parametros.pop())
    B_ColorSpace = int(parametros.pop())
    G_ColorSpace = int(parametros.pop())
    R_ColorSpace = int(parametros.pop())
    imagenes = parametros
    global imagenes_procesadas
    imagenes_procesadas=ca.transformImages(imagenes)
    global imagenes_color_space
    global masks_color_space
    global imagenes_canny
    global imagenes_watershed
    imagenes_color_space, masks_color_space = ps.colorspace(imagenes_procesadas,R_ColorSpace,G_ColorSpace,B_ColorSpace,umbralColorSpace)
    imagenes_canny = ps.canny_method(imagenes_procesadas, minHysteresis, maxHysteresis, kernelSobel)
    imagenes_watershed = ps.watershed(imagenes_procesadas, kernelWatershed, umbralWatershed)



    array_string_cs= ca.encodeImages(imagenes_color_space)
    array_string_canny= ca.encodeImages(imagenes_canny)
    array_string_watershed= ca.encodeImages(imagenes_watershed)


    if (True) :
        parametros=[]
        #return jsonify({ 'imaCS' :  imagenes_color_space , 'imaCanny' :  imagenes_canny , 'imaWater' :  imagenes_watershed })
        return jsonify({ 'imaCS' : array_string_cs , 'imaCanny' :  array_string_canny , 'imaWater' :  array_string_watershed })
    else:
        parametros=[]
        return jsonify({'error' : 'Los términos no arrojaron resultados!'})

@app.route('/comparar', methods=['POST'])
def comparacion():
    parametros=[]
    contenido = request.form
    diccionarioContenido=contenido.copy()

    for i in range(len(diccionarioContenido)):
        parametros.append(diccionarioContenido[str(i)])

    opcionMetodo = parametros.pop()
    criteriosComparacion = parametros.pop().split(',')
    imagenes_procesadas_gray = ps.RGBtoGray(imagenes_procesadas)

    if(opcionMetodo == 'option2'):
        imagenesSegmentadas = parametros
        imagenes_procesadas_segmentadas=ca.transformImages(imagenesSegmentadas)
        if(len(imagenes_procesadas_segmentadas.shape) >  2):
             imagenes_procesadas_segmentadas = ps.RGBtoGray(imagenes_procesadas_segmentadas)
        array_imagenes = [masks_color_space, imagenes_canny, imagenes_watershed, imagenes_procesadas_segmentadas]
        array_metodos = ['Color space', 'Canny', 'Watershed', 'Propio']
    else:
        array_imagenes = [masks_color_space, imagenes_canny, imagenes_watershed]
        array_metodos = ['Color space', 'Canny', 'Watershed']

    jaccard_indices = []
    dice_coeficientes = []
    npr_valores = []
    array_jaccard_dataframes = []
    array_dice_dataframes = []
    array_npr_dataframes = []
    datos_jaccard = ""
    datos_dice = ""
    datos_npr = ""
    for i in range(len(criteriosComparacion)):
        if (criteriosComparacion[i] == 'jaccard'):
            for j in range(len(array_metodos)):
                if(j == 1):
                    promedio, consolidado, dato_jaccard_temp = cr.jaccard(ps.changeSizeCanny(imagenes_procesadas_gray,array_imagenes[j]), array_imagenes[j])
                    jaccard_indices.append(promedio)
                    array_jaccard_dataframes.append(pd.DataFrame(consolidado,columns=[array_metodos[j]]))
                    datos_jaccard += dato_jaccard_temp
                else:
                    promedio, consolidado, dato_jaccard_temp = cr.jaccard(imagenes_procesadas_gray, array_imagenes[j])
                    jaccard_indices.append(promedio)
                    array_jaccard_dataframes.append(pd.DataFrame(consolidado,columns=[array_metodos[j]]))
                    datos_jaccard += dato_jaccard_temp
                dataframe_jaccard = pd.concat(array_jaccard_dataframes,axis=1)
                dataframe_jaccard.to_csv("D:/Users/Andres/Documents/Vera/ProductoSegmentacion/static/files/jaccard_consolidado.csv")
        elif (criteriosComparacion[i] == 'sorense'):
            for j in range(len(array_metodos)):
                if(j == 1):
                    promedio, consolidado, dato_dice_temp = cr.dice(ps.changeSizeCanny(imagenes_procesadas_gray,array_imagenes[j]), array_imagenes[j])
                    dice_coeficientes.append(promedio)
                    array_dice_dataframes.append(pd.DataFrame(consolidado,columns=[array_metodos[j]]))
                    datos_dice += dato_dice_temp
                else:
                    promedio, consolidado, dato_dice_temp = cr.dice(imagenes_procesadas_gray, array_imagenes[j])
                    dice_coeficientes.append(promedio)
                #dice_coeficientes.append(cr.dice(imagenes_procesadas_gray, array_imagenes[j]))
                    array_dice_dataframes.append(pd.DataFrame(consolidado,columns=[array_metodos[j]]))
                    datos_dice += dato_dice_temp
            dataframe_dice = pd.concat(array_dice_dataframes,axis=1)
            dataframe_dice.to_csv("D:/Users/Andres/Documents/Vera/ProductoSegmentacion/static/files/sorense_dice_consolidado.csv")
        else:
            for j in range(len(array_metodos)):
                if(j == 1):
                    promedio, consolidado, dato_npr_temp = cr.npr(ps.changeSizeCanny(imagenes_procesadas_gray,array_imagenes[j]), array_imagenes[j])
                    npr_valores.append(promedio)
                    array_npr_dataframes.append(pd.DataFrame(consolidado,columns=[array_metodos[j]]))
                    datos_npr += dato_npr_temp
                else:
                    promedio, consolidado, dato_npr_temp = cr.npr(imagenes_procesadas_gray, array_imagenes[j])
                    npr_valores.append(promedio)
                    array_npr_dataframes.append(pd.DataFrame(consolidado,columns=[array_metodos[j]]))
                    datos_npr += dato_npr_temp
            dataframe_npr = pd.concat(array_npr_dataframes,axis=1)
            dataframe_npr.to_csv("D:/Users/Andres/Documents/Vera/ProductoSegmentacion/static/files/npr_consolidado.csv")

    datos_jaccard = datos_jaccard[:-1]
    datos_dice = datos_dice[:-1]
    datos_npr = datos_npr[:-1]


    if (True) :
        parametros=[]
        #return jsonify({ 'imaCS' :  imagenes_color_space , 'imaCanny' :  imagenes_canny , 'imaWater' :  imagenes_watershed })
        return jsonify({ 'jaccard' : jaccard_indices , 'dice' : dice_coeficientes , 'npr' : npr_valores, 'criterios' : criteriosComparacion , 'metodos' : array_metodos, 'jaccard_datos' : datos_jaccard , 'dice_datos' : datos_dice , 'npr_datos' : datos_npr })
    else:
        parametros=[]
        return jsonify({'error' : 'Los términos no arrojaron resultados!'})

if __name__ == '__main__':
	app.run(debug=False)
