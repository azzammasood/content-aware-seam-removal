import os
os.environ["OPENCV_IO_ENABLE_OPENEXR"] = "1"
import cv2
import numpy as np
import seam_inference
from utils.exr_to_jpg import convert_exr_to_jpg
import sys
from photoshop import Session
import content_aware_fill
import math
import argparse

def main():
    parser = argparse.ArgumentParser(description='Process some integers.')
    parser.add_argument('-i', '--input', required=True, help="Input image")
    parser.add_argument('-wi', '--patch_w', default=250,
                        help="Width of patches. This is not always true (Example when processing edges)")
    parser.add_argument('-hi', '--patch_h', default=250, help="Height of patches")
    parser.add_argument('-ov', '--overlay', default=30, help="Percentage of overlay between subsequent patches.")
    parser.add_argument('-m', '--mask', default=20,
                        help="Spread of Mask. Essentially the height of the mask being applied at the centre.")
    parser.add_argument('-o', '--output', required=True, help="Output directory.")
    parser.add_argument('-mode', '--mode', required = True, help = "Select mode from either Deep Learning or Photoshop's Content-Aware-Fill.\nModes are: 1. ps-single (Photoshop - Single patch around seam), ps-multi (Photoshop - Multiple patches around seam) and pm (deep learning).")
    parser.add_argument('-rot', '--rotation_adaptation', default = 'none', help = "Allow content rotation for a better match, good for\nfilling content with rotated or curved patterns.\nAmount: none, low, medium, high, full")
    parser.add_argument('-col', '--color_adaptation', default = 'default', help = "Allow contrast and brightness for a better match, good for\nfilling content with gradual color or texture changes.\nAmount: none, default, high, very_high")
    parser.add_argument('-seam_h', '--seam_height', default = 20, help = 'The height of the seam selection. Default is 20 pixels.')
    parser.add_argument('-type', '--type', default = "auto", help = 'The type of Content-Aware Fill. Types are:\n1. auto (Photoshop auto-selects context)'
                                                                    '\n2. rectangle (Rectangular context region)\n3. complete (Entire patch as context)')

    args = parser.parse_args()
    image_path = args.input

    filename, file_extension = os.path.splitext('image_path')
    if file_extension == ".exr":
        convert_exr_to_jpg(image_path, "temp.jpg")
        image_path = "temp.jpg"

    # Create tiled image
    # Arguments
    output_dir = args.output

    # Offsetting Image to create horizontal seam
    img = cv2.imread(image_path)
    h, w, channels = img.shape
    half = w // 2
    left_part = img[:, :half]
    right_part = img[:, half:]
    img = np.concatenate((right_part, left_part), axis=0)
    original_wrapped_image_path = output_dir + '/image_wrapped_original.png'
    cv2.imwrite(original_wrapped_image_path, img)
    
    path_of_image = "C:\\Users\\DELL\\Desktop\\Abdullah Chand\\quixel-ml-khalid-chand\\outputs\\image_wrapped_original.png"

    if args.mode == 'pm':
        generate_tiles(image_path)
    else:
        with Session() as ps:
            target_image = content_aware_fill.ContentAwareFill(args.mode,
                                                               args.type,
                                                               int(args.patch_h),
                                                               int(args.patch_w),
                                                               int(args.seam_height),
                                                               img,
                                                               ps,
                                                               args.color_adaptation,
                                                               args.rotation_adaptation,
                                                               path_of_image,
                                                               int(args.overlay))
            if args.mode == 'ps-single':
                target_image.single_patch_content_fill()
            elif args.mode == 'ps-multi':
                target_image.multi_patch_content_fill()

def generate_tiles(image_path):
    # Args
    patch_size_w = int(args.patch_w)
    patch_size_h = int(args.patch_h)
    overlay = int(args.overlay)
    output_dir = args.output

    # Offsetting Image to create horizontal seam
    img = cv2.imread(image_path)
    h, w, channels = img.shape
    half = w // 2
    left_part = img[:, :half]
    right_part = img[:, half:]
    img = np.concatenate((right_part, left_part), axis=0)
    original_wrapped_image_path = output_dir + '/image_wrapped_original.png'
    cv2.imwrite(original_wrapped_image_path, img)

    # Creating patches and applying seam removal.
    h, w, channels = img.shape
    x_axis, y_axis = 0, int((h // 2) - (patch_size_h / 2))
    number_of_patches = 0
    while x_axis < w:
        print(x_axis)
        patch = img[y_axis:y_axis + patch_size_h, x_axis:x_axis + patch_size_w]
        cv2.imwrite(output_dir + '/patches/image_wrapped' + str(number_of_patches) + '.jpg', patch)
        fill_tile(output_dir + '/patches/image_wrapped' + str(number_of_patches) + '.jpg')
        filled_patch = seam_inference.inpaint(output_dir + '/patches/image_wrapped' + str(number_of_patches) + '.jpg',
                                              "mask.jpg", output_dir)
        img[y_axis:y_axis + patch_size_h, x_axis:x_axis + patch_size_w] = filled_patch
        x_axis += int(patch_size_w * (1 - overlay / 100))
        number_of_patches += 1

    # Fill in the Edge.
    x_axis -= int(patch_size_w * (1 - overlay / 100))
    print(x_axis + (w - x_axis))
    patch = img[y_axis:y_axis + patch_size_h, x_axis:x_axis + (w - x_axis)]
    cv2.imwrite(output_dir + '/patches/image_wrapped' + str(number_of_patches) + '.jpg', patch)
    fill_tile(output_dir + '/patches/image_wrapped' + str(number_of_patches) + '.jpg')
    filled_patch = seam_inference.inpaint(output_dir + '/patches/image_wrapped' + str(number_of_patches) + '.jpg',
                                          "mask.jpg", output_dir)
    img[y_axis:y_axis + patch_size_h, x_axis:x_axis + (w - x_axis)] = filled_patch
    cv2.imwrite(output_dir + '/image_wrapped.png', img)


def fill_tile(tile_path):
    # Genrate mask of a patch.
    spread = int(args.mask)
    image = cv2.imread(tile_path)
    h, w, c = image.shape
    mask = np.zeros(image.shape[:2], dtype="uint8")
    cv2.rectangle(mask, (0, int((h / 2) - (spread / 2))), (w, int((h / 2) + (spread / 2))), 255, -1)
    cv2.imwrite("mask.jpg", mask)

if __name__ == "__main__":
    main()
