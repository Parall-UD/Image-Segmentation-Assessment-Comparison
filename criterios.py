import numpy as np

from scipy import misc
import cv2
from statistics import mean
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
from sklearn.metrics import cohen_kappa_score
from sklearn.metrics import adjusted_rand_score
import pandas as pd


def dice(img_original, img_segmentadas):
    """
    Computes the Dice coefficient, a measure of set similarity.
    Parameters
    ----------
    im1 : array-like, bool
        Any array of arbitrary size. If not boolean, will be converted.
    im2 : array-like, bool
        Any other array of identical size. If not boolean, will be converted.
    Returns
    -------
    dice : float
        Dice coefficient as a float on range [0,1].
        Maximum similarity = 1
        No similarity = 0
        Both are empty (sum eq to zero) = empty_score

    Notes
    -----
    The order of inputs for `dice` is irrelevant. The result will be
    identical if `im1` and `im2` are switched.
    """
    consolidado_temp = []
    temp_dice_index = []
    dato_temp = ""
    for i in range(len(img_original)):
        im1 = np.asarray(img_original[i]).astype(np.bool)
        im2 = np.asarray(img_segmentadas[i]).astype(np.bool)

        if im1.shape != im2.shape:
            raise ValueError("Shape mismatch: im1 and im2 must have the same shape.")

        im_sum = im1.sum() + im2.sum()
        if im_sum == 0:
            consolidado_temp.append([1.0])
            temp_dice_index.append(1.0)
            if (i == (len(img_original)-1)):
                dato_temp += str(1.0)+":"
            else:
                dato_temp += str(1.0)+","#return 1.0
        else:
            intersection = np.logical_and(im1, im2)
            temp_valor = 2. * intersection.sum() / im_sum
            consolidado_temp.append([round(temp_valor,4)])
            if (i == (len(img_original)-1)):
                dato_temp += str(round(temp_valor,4))+":"
            else:
                dato_temp += str(round(temp_valor,4))+","#return 1.0
            temp_dice_index.append(temp_valor)
    array_dice_list = np.array(consolidado_temp)
    #print(array_dice_list)
    #array_consolidado = array_dice_list.transpose()
    #print(array_consolidado)
    #dataframe_dice = pd.DataFrame(consolidado_temp, columns = ['ID imagen' , 'valor'])
    #dataframe_dice.to_csv("D:/Users/Andres/Documents/Vera/ProductoSegmentacion/static/files/sorense_dice_consolidado.csv")
    return round(mean(temp_dice_index),4), array_dice_list, dato_temp



def jaccard(img_original, img_segmentadas):
    """
    Computes the Jaccard metric, a measure of set similarity.
    Parameters
    ----------
    im1 : array-like, bool
        Any array of arbitrary size. If not boolean, will be converted.
    im2 : array-like, bool
        Any other array of identical size. If not boolean, will be converted.
    Returns
    -------
    jaccard : float
        Jaccard metric returned is a float on range [0,1].
        Maximum similarity = 1
        No similarity = 0

    Notes
    -----
    The order of inputs for `jaccard` is irrelevant. The result will be
    identical if `im1` and `im2` are switched.
    """
    consolidado_temp = []
    temp_jaccard_index = []
    dato_temp = ""
    for i in range(len(img_original)):
        im1 = np.asarray(img_original[i]).astype(np.bool)
        im2 = np.asarray(img_segmentadas[i]).astype(np.bool)


        if im1.shape != im2.shape:
            raise ValueError("Shape mismatch: im1 and im2 must have the same shape.")

        intersection = np.logical_and(im1, im2)

        union = np.logical_or(im1, im2)

        temp_valor = intersection.sum() / float(union.sum())
        consolidado_temp.append([round(temp_valor,4)])
        if (i == (len(img_original)-1)):
            dato_temp += str(round(temp_valor,4))+":"
        else:
            dato_temp += str(round(temp_valor,4))+","#return 1.0
        temp_jaccard_index.append(temp_valor)
    array_dice_list = np.array(consolidado_temp)
    return round(mean(temp_jaccard_index),4), array_dice_list, dato_temp

def hellinger(img_original, img_segmentadas):
    consolidado_temp = []
    temp_valores_hellinger = []
    for i in range(len(img_original)):
        histImg1 = cv2.calcHist([img_original[i]],[0],None,[256],[0,256])
        histImg2 = cv2.calcHist([img_segmentadas[i]],[0],None,[256],[0,256])
        temp_valor = cv2.compareHist(histImg1, histImg2, cv2.HISTCMP_BHATTACHARYYA)
        consolidado_temp.append([temp_valor])
        temp_valores_hellinger.append(temp_valor)
    array_dice_list = np.array(consolidado_temp)
    return round(mean(temp_valores_hellinger),4), array_dice_list

def npr(img_original, img_segmentadas):
    consolidado_temp = []
    temp_valores_kappa = []
    dato_temp = ""
    for i in range(len(img_original)):
        img_true=np.array(img_original[i]).ravel()
        img_pred=np.array(img_segmentadas[i]).ravel()
        temp_valor = adjusted_rand_score(img_true, img_pred)
        consolidado_temp.append([round(temp_valor,4)])
        if (i == (len(img_original)-1)):
            dato_temp += str(round(temp_valor,4))+":"
        else:
            dato_temp += str(round(temp_valor,4))+","#return 1.0
        temp_valores_kappa.append(temp_valor)
    array_npr_list = np.array(consolidado_temp)
    #print(array_npr_list)
    return round(mean(temp_valores_kappa),4), array_npr_list, dato_temp


def calcularCriterio(opcion, imagenes_original, imagenes_segmentada):
    temp_jaccard_index = []
    temp_dice_index = []
    temp_hellinger_index = []
    if(opcion == 'jaccard'):
        for i in range(len(imagenes_original)):
            valor_temp_jaccard = jaccard(imagenes_original[i],imagenes_segmentada[i])
            temp_jaccard_index.append(valor_temp_jaccard)
        return mean(temp_jaccard_index)
    elif(opcion == 'sorense'):
        for i in range(len(imagenes_original)):
            valor_temp_dice = dice(imagenes_original[i],imagenes_segmentada[i])
            temp_dice_index.append(valor_temp_dice)
        return mean(temp_dice_index)
    else:
        for i in range(len(imagenes_original)):
            valor_temp_hellinger= hellinger(imagenes_original[i],imagenes_segmentada[i])
            temp_hellinger_index.append(valor_temp_hellinger)
        return mean(temp_hellinger_index)
