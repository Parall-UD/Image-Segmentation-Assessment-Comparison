# Image-Segmentation-Assessment-Comparison
## Descripción

Esta aplicación proporciona un entorno Web intuitivo para realizar la evaluación y comparación de técnicas de segmentación, ya sean tradicionales o propias, mediante índices que miden la similitud, usando un conjunto de imágenes proporcionadas por el usuario. El entorno Web se puede utilizar como una herramienta de segmentación de imágenes. 
La segmentación de imágenes se basa en unos criterios determinados para dividir una imagen en secciones que presentan una misma naturaleza, siendo la base para el análisis de la imagen y el reconocimiento de las características de la misma. Los algoritmos de segmentación se basan en una de estas dos propiedades básicas de los valores del nivel de gris: discontinuidad o similitud entre los niveles de gris de píxeles vecinos. 

En esta plataforma es posible realizar la segmentación de imágenes mediante las siguientes técnicas: Color Space Segmentation, Canny Edge Detector y Watershed; teniendo la posibilidad de especificar sus correspondientes parámetros.

La técnica Color Space Segmentation se basa en la selección de un color objetivo y un rango de colores cercanos, con el propósito de separar los colores en la imagen, por lo que los valores dentro de estos parámetros están pintados de color blanco y el resto de un color negro; esto es llamado máscara, y proporciona un contraste en la imagen.

Canny Edge Detector aplica un filtro gaussiano para suavizar la imagen y eliminar el ruido; luego, encuentra los gradientes de la intensidad de la imagen y aplica la supresión no máxima para deshacerse de la respuesta falsa a la detección de bordes. Finalmente, rastrea los bordes por histéresis al suprimir todos los bordes que son débiles y no están conectados a bordes fuertes.

Watershed usa unos marcadores definidos por el usuario, para tratar los píxeles como una topografía local (elevación). El algoritmo inunda las cuencas desde los marcadores, hasta que las cuencas atribuidas a diferentes marcadores se encuentren en las líneas de cuenca. En muchos casos, los marcadores se eligen como mínimos locales de la imagen, desde los cuales se inundan las cuencas.
Adicionalmente, la plataforma implementa los siguientes índices de comparación, para medir la similitud:

- Índice de Jaccard: mide el grado de similitud entre dos conjuntos, de cualquier tipo de elementos.
- Coeficiente de Sorenden-Dice: índice estadístico para comparar la similitud de dos muestras.
- Normalized Probabilistic Rand: es una medida de similitud entre dos agrupaciones de datos.


## Manual de Usuario

El manual de usuario realizado para esta aplicación, tiene como finalidad presentar la interacción paso a paso entre el usuario y la aplicación. El manual de usuario se encuentra disponible en la siguiente dirección : https://github.com/Parall-UD/Image-Segmentation-Assessment-Comparison/blob/master/static/manuales/Manual_Usuario-ISAC.pdf

## Manual Técnico

El manual técnico realizado para esta aplicación, tiene como finalidad presentar el proceso de instalación con los componentes necesarios para poder ejecturar la aplicación. El manual técnico se encuentra disponible en la siguiente dirección : https://github.com/Parall-UD/Image-Segmentation-Assessment-Comparison/blob/master/static/manuales/Manual_Tecnico-ISAC.pdf

## Especificación de Requisitos de Software
Este documento es una Especificación de Requisitos Software (ERS) para el software llamado “Image-Segmentation Assessment Comparison”. Esta especificación se ha estructurado basándose en las directrices dadas por el estándar IEEE Práctica Recomendada para Especificaciones de Requisitos Software ANSI/IEEE 830, 1998. Este documento se encuentra disponible en la siguiente dirección : https://github.com/Parall-UD/Image-Segmentation-Assessment-Comparison/blob/master/static/manuales/IEEE-830_ISAC.pdf

## Video Tutorial
Con el fin de presentar detalladamente el funcionamiento de la aplicación, se realizó un video tutorial donde se presenta la interacción entre el usuario y la plataforma. El video tutorial se encuentra disponible en la siguiente dirección: https://www.youtube.com/watch?v=TAKUmAXQlGM&feature=youtu.be

## Servidor de Prueba
El servidor de Prueba se encuentra alojado en la siguiente dirección: http://200.69.103.29:28601
