# -*- coding: utf-8 -*-
"""
Created on Wed Jan 30 17:15:32 2019

@author: Andres
"""

import numpy as np
import cv2
import matplotlib.pyplot as plt
import matplotlib.image as mpimg


def colorspace(images,r,g,b,umbral):

    tempImagesColorspace = []
    tempImagesMask = []
    bgr = [b, g, r]
    thresh = umbral

    minBGR = np.array([bgr[0] - thresh, bgr[1] - thresh, bgr[2] - thresh])
    maxBGR = np.array([bgr[0] + thresh, bgr[1] + thresh, bgr[2] + thresh])
    for i in range(len(images)):
        maskBGR = cv2.inRange(images[i],minBGR,maxBGR)
        resultBGR = cv2.bitwise_and(images[i], images[i], mask = maskBGR)
        tempImagesMask.append(maskBGR)
        tempImagesColorspace.append(resultBGR)
    finalImagesMask = np.array(tempImagesMask)
    finalImagesColorspace = np.array(tempImagesColorspace)
    return finalImagesColorspace, finalImagesMask


def watershed(images, kernelParametro, umbral):
    tempImagesWatershed = []
    #kernel = np.int(kernel)
    for i in range(len(images)):
        gray = cv2.cvtColor(images[i],cv2.COLOR_BGR2GRAY)
        ret, thresh = cv2.threshold(gray,umbral,255,cv2.THRESH_BINARY_INV+cv2.THRESH_OTSU)
        # noise removal
        kernel = np.ones(kernelParametro,np.uint8)
        opening = cv2.morphologyEx(thresh,cv2.MORPH_OPEN,kernel, iterations = 2)

        # sure background area
        sure_bg = cv2.dilate(opening,kernel,iterations=3)

        # Finding sure foreground area
        dist_transform = cv2.distanceTransform(opening,cv2.DIST_L2,5)
        ret, sure_fg = cv2.threshold(dist_transform,0.7*dist_transform.max(),255,0)

        # Finding unknown region
        sure_fg = np.uint8(sure_fg)
        unknown = cv2.subtract(sure_bg,sure_fg)
        tempImagesWatershed.append(unknown)
    finalImagesWatershed = np.array(tempImagesWatershed)
    return finalImagesWatershed

def canny_method(images,min, max, kernelSobel):
    tempImagesCanny = []
    for i in range(len(images)):
        height, width = images[i].shape[:2]
        if (height>700):
             image = cv2.resize(images[i], (width//4, height//4), interpolation = cv2.INTER_CUBIC)
             edges = cv2.Canny(image,min,max, kernelSobel)
        else:
             edges = cv2.Canny(images[i],min,max)
        tempImagesCanny.append(edges)
    finalImagesCanny = np.array(tempImagesCanny)
    return finalImagesCanny

def RGBtoGray(imagenes):
    imagenesNuevo = []
    for i in range(len(imagenes)):
        imagenesNuevo.append(cv2.cvtColor(imagenes[i], cv2.COLOR_BGR2GRAY))
    final_nuevo = np.array(imagenesNuevo)
    return final_nuevo

def changeSizeCanny(ima_original, ima_canny):
    nuevas_gray = []
    for i in range(len(ima_original)):
        nuevas_gray.append(cv2.resize(ima_original[i], dsize=(ima_canny[i].shape[1],ima_canny[i].shape[0]), interpolation=cv2.INTER_CUBIC))
    final_nuevas_gray = np.array(nuevas_gray)
    return final_nuevas_gray
