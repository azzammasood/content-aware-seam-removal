# content-aware-seam-removal
Inpainting solution of seam removal using Photoshop

Modified Abdullah’s code to add Photoshop’s Content-Aware-Fill as a mode of seam removal.

The code contains two kinds of Content-Aware-Fill. 

    Using a single patch around seam (-mode ps-single)

    Using multiple matches around seam (-mode ps-multi)

The context selected by Photoshop can change between three settings: 

    Auto (-type auto) 

    Rectangle (-type rectangle)

    Custom (-type custom)

Further settings include:

    Color Adaptation (none, default, high, very high)

    Rotation Adaptation (low, medium, high, very high, full)

Results using single patch over entire seam are good. On an 8k albedo, a patch of height 2000 and seam height of 600 with ‘auto’ context, ‘none’ color adaptation and ‘high’ rotation adaptation, the result is attached in the file ‘after seam removal using multiple patches.jpg'. The original image is also attached.

Results using multiple patches are not good as using a single patch. On an 8k albedo, using multiple patches of size 2000 x 600 and overlay of 200 and auto context, the result is attached in the file ‘after seam removal using single patch.jpg’

An example command to run the python file with photoshop’s content-aware fill is:

    python seam-removal-ps.py -i wgxjfiaaw_8K_Displacement.jpg -o outputs -mode ps-single -type auto -col none -rot high -seam_h 600 -hi 2000
    
Photoshop's Content-Aware-Fill uses a Randomized Correspondence algorithm for Image Completion (Inpainting).
(a) Initialization: Random initial guesses for the patch correspondences and iteratively improve results.
(b) Propagation: Algorithm alternates between propagating good correspondences between neighboring patches and sampling nearby image space to find better correspondences.
Although initialization is completely random, a few lucky guesses propagate quickly to neighboring pixels in the propagation phase. Random sampling complements this greedy approach by avoiding local minima.
