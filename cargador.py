from PIL import Image
from io import BytesIO
import base64
import re
import numpy as np



def transformImages(array_images):
    array_final_images = []
    for i in range(len(array_images)):
        image_data = re.sub('^data:image/.+;base64,', '', array_images[i])
        im = Image.open(BytesIO(base64.b64decode(image_data))).convert('RGB')
        final_image = np.array(im)
        array_final_images.append(final_image)
    final_images = np.array(array_final_images)
    return final_images


def encodeImages(array_images):
    array_temp_encode = []
    for i in range(len(array_images)):
        pil_img = Image.fromarray(array_images[i])
        buff = BytesIO()
        pil_img.save(buff, format="PNG")
        new_image_string =  'data:image/png;base64,'+base64.b64encode(buff.getvalue()).decode("utf-8")
        array_temp_encode.append(new_image_string)
    return array_temp_encode
