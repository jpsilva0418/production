import sys
from PIL import Image, ImageOps
Z,O=sys.argv[1],sys.argv[2]
m={
'portrait-navy':('profile/portrait_full.jpg',1400),
'portrait-navy-sq':('profile/biosite_profile.jpg',900),
'portrait-pink':('instagram/photos/C_3KjctJCIA_1.jpg',1300),
'n-mauve-ring':('instagram/photos/CtwRnv1OJBd_1.jpg',1000),
'n-lilac-ombre':('instagram/photos/Ctz-MMVN8sq_1.jpg',1000),
'n-blue-french':('instagram/photos/CwRfDvNtJPi_1.jpg',1000),
'n-pink-glitter':('instagram/photos/Cw1Y1grtdNm_1.jpg',1000),
'n-red':('instagram/photos/C9QQSI4Ps7L_1.jpg',1000),
'n-nude-ring':('instagram/photos/CxHfas0NvN2_1.jpg',1000),
'n-white-french':('instagram/photos/CvVnQgiP3B__1.jpg',1000),
'n-black-almond':('instagram/photos/Cv_cso6t7ju_1.jpg',1000),
'n-red-almond':('instagram/photos/DfVsib7OES9_1.jpg',1000),
'n-lilac':('instagram/photos/C2d54sVNaQv_1.jpg',1000),
'n-orange':('instagram/photos/C0R3oNwrx7b_1.jpg',1000),
'n-royal-blue':('booking/gallery/nail_blue_coffin.jpg',1100),
'n-navy':('booking/gallery/nail_dark_blue_short.jpg',1100),
'n-bordo':('booking/gallery/nail_dark_red_coffin.jpg',1100),
'n-magenta':('booking/gallery/nail_magenta_coffin.jpg',1100),
'n-mauve':('booking/gallery/nail_mauve_coffin.jpg',1100),
'n-choc':('booking/gallery/nail_nude_short.jpg',1100),
'n-purple':('booking/gallery/nail_purple_short.jpg',1100),
'n-cherry':('booking/gallery/nail_red_short.jpg',1100),
'n-hotpink':('instagram/photos/Cvne3r8vloa_1.jpg',1000),
'b-closeup':('booking/gallery/brow_closeup.jpg',1200),
'b-lash':('booking/gallery/brow_closeup_with_lash.jpg',1000),
'b-brush':('booking/gallery/brow_front_with_brush.jpg',1000),
'b-front':('booking/gallery/brow_front.jpg',1200),
'b-eyes-closed':('instagram/photos/DfNo-wZB1k8_1.jpg',1100),
'l-closeup':('booking/gallery/pmu_lips_closeup.jpg',1200),
'l-healed':('instagram/photos/DfNvGRhAYI2_3.jpg',1000),
'f-spa':('instagram/photos/DfIPbEBo-AH_2.jpg',1000),
}
for k,(p,mx) in m.items():
    im=ImageOps.exif_transpose(Image.open(f'{Z}/{p}')).convert('RGB'); im.thumbnail((mx,mx),Image.LANCZOS)
    im.save(f'{O}/{k}.jpg',quality=72,optimize=True,progressive=True)
