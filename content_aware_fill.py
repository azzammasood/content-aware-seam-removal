import os
from datetime import datetime
from tempfile import mkdtemp
import cv2
import math

class ContentAwareFill:
    def __init__(self, mode, type, patch_height, patch_width, seam_height, image, ps, col, rot, image_path, overlay):
        self.mode = mode
        self.type = type
        self.patch_height = patch_height
        self.patch_width = patch_width
        self.seam_height = seam_height
        # self.seam_width = seam_width
        self.image = image
        self.col = col
        self.rot = rot
        self.ps = ps
        self.image_height = self.image.shape[0]
        self.image_width = self.image.shape[1]
        self.image_path = image_path
        self.overlay = overlay

        print("Color Adaptation: ", self.col)
        print("Rotation Adaptation: ", self.rot)

        # Create outputs folder named "photoshop outputs"
        parent = os.getcwd()
        directory1 = "photoshop outputs"
        outputs_path = os.path.join(parent, directory1)
        if os.path.isdir(outputs_path) is False:
            os.mkdir(outputs_path)

    def auto(self):
        self.ps.app.activeDocument.activeLayer.rasterize(self.ps.RasterizeType.EntireLayer)

        idcafWorkspace = self.ps.app.stringIDToTypeID("cafWorkspace")
        desc5549 = self.ps.ActionDescriptor()

        idcafSamplingRegion = self.ps.app.stringIDToTypeID("cafSamplingRegion")
        idcafSamplingRegion = self.ps.app.stringIDToTypeID("cafSamplingRegion")
        idcafSamplingRegionAuto = self.ps.app.stringIDToTypeID("cafSamplingRegionAuto")
        desc5549.putEnumerated(idcafSamplingRegion, idcafSamplingRegion, idcafSamplingRegionAuto)
        idcafSampleAllLayers = self.ps.app.stringIDToTypeID("cafSampleAllLayers")
        desc5549.putBoolean(idcafSampleAllLayers, False)
        idcafColorAdaptationLevel = self.ps.app.stringIDToTypeID("cafColorAdaptationLevel")
        idcafColorAdaptationLevel = self.ps.app.stringIDToTypeID("cafColorAdaptationLevel")

        if self.col == 'none':
            idcafColorAdaptationNone = self.ps.app.stringIDToTypeID("cafColorAdaptationNone")
            desc5549.putEnumerated(idcafColorAdaptationLevel, idcafColorAdaptationLevel, idcafColorAdaptationNone)
        if self.col == 'default':
            idcafColorAdaptationDefault = self.ps.app.stringIDToTypeID("cafColorAdaptationDefault")
            desc5549.putEnumerated(idcafColorAdaptationLevel, idcafColorAdaptationLevel, idcafColorAdaptationDefault)
        if self.col == 'high':
            idcafColorAdaptationHigh = self.ps.app.stringIDToTypeID("cafColorAdaptationHigh")
            desc5549.putEnumerated(idcafColorAdaptationLevel, idcafColorAdaptationLevel, idcafColorAdaptationHigh)
        if self.col == 'very_high':
            idcafColorAdaptationVeryHigh = self.ps.app.stringIDToTypeID("cafColorAdaptationVeryHigh")
            desc5549.putEnumerated(idcafColorAdaptationLevel, idcafColorAdaptationLevel, idcafColorAdaptationVeryHigh)

        idcafRotationAmount = self.ps.app.stringIDToTypeID("cafRotationAmount")
        idcafRotationAmount = self.ps.app.stringIDToTypeID("cafRotationAmount")

        if self.rot == 'none':
            idcafRotationAmountNone = self.ps.app.stringIDToTypeID("cafRotationAmountNone")
            desc5549.putEnumerated(idcafRotationAmount, idcafRotationAmount, idcafRotationAmountNone)
        elif self.rot == 'low':
            idcafRotationAmountLow = self.ps.app.stringIDToTypeID("cafRotationAmountLow")
            desc5549.putEnumerated(idcafRotationAmount, idcafRotationAmount, idcafRotationAmountLow)
        elif self.rot == 'medium':
            idcafRotationAmountMedium = self.ps.app.stringIDToTypeID("cafRotationAmountMedium")
            desc5549.putEnumerated(idcafRotationAmount, idcafRotationAmount, idcafRotationAmountMedium)
        elif self.rot == 'high':
            idcafRotationAmountHigh = self.ps.app.stringIDToTypeID("cafRotationAmountHigh")
            desc5549.putEnumerated(idcafRotationAmount, idcafRotationAmount, idcafRotationAmountHigh)
        elif self.rot == 'full':
            idcafRotationAmountFull = self.ps.app.stringIDToTypeID("cafRotationAmountFull")
            desc5549.putEnumerated(idcafRotationAmount, idcafRotationAmount, idcafRotationAmountFull)

        idcafScale = self.ps.app.stringIDToTypeID("cafScale")
        desc5549.putBoolean(idcafScale, False)
        idcafMirror = self.ps.app.stringIDToTypeID("cafMirror")
        desc5549.putBoolean(idcafMirror, False)
        idcafOutput = self.ps.app.stringIDToTypeID("cafOutput")
        idcafOutput = self.ps.app.stringIDToTypeID("cafOutput")
        idcafOutputToCurrentLayer = self.ps.app.stringIDToTypeID("cafOutputToCurrentLayer")
        desc5549.putEnumerated(idcafOutput, idcafOutput, idcafOutputToCurrentLayer)
        self.ps.app.executeAction(idcafWorkspace, desc5549)
        
    def rectangle(self):
        self.ps.app.activeDocument.activeLayer.rasterize(self.ps.RasterizeType.EntireLayer)
    
        idcafWorkspace = self.ps.app.stringIDToTypeID( "cafWorkspace" )
        desc526 = self.ps.ActionDescriptor()
        idcafSamplingRegion = self.ps.app.stringIDToTypeID( "cafSamplingRegion" )
        idcafSamplingRegion = self.ps.app.stringIDToTypeID( "cafSamplingRegion" )
        idcafSamplingRegionRectangular = self.ps.app.stringIDToTypeID( "cafSamplingRegionRectangular" )
        desc526.putEnumerated( idcafSamplingRegion, idcafSamplingRegion, idcafSamplingRegionRectangular )
        idcafSampleAllLayers = self.ps.app.stringIDToTypeID( "cafSampleAllLayers" )
        desc526.putBoolean( idcafSampleAllLayers, False )
        idcafColorAdaptationLevel = self.ps.app.stringIDToTypeID( "cafColorAdaptationLevel" )
        idcafColorAdaptationLevel = self.ps.app.stringIDToTypeID( "cafColorAdaptationLevel" )
    
        if self.col == 'none':
            idcafColorAdaptationNone = self.ps.app.stringIDToTypeID("cafColorAdaptationNone")
            desc526.putEnumerated(idcafColorAdaptationLevel, idcafColorAdaptationLevel, idcafColorAdaptationNone)
        if self.col == 'default':
            idcafColorAdaptationDefault = self.ps.app.stringIDToTypeID("cafColorAdaptationDefault")
            desc526.putEnumerated(idcafColorAdaptationLevel, idcafColorAdaptationLevel, idcafColorAdaptationDefault)
        if self.col == 'high':
            idcafColorAdaptationHigh = self.ps.app.stringIDToTypeID("cafColorAdaptationHigh")
            desc526.putEnumerated(idcafColorAdaptationLevel, idcafColorAdaptationLevel, idcafColorAdaptationHigh)
        if self.col == 'very_high':
            idcafColorAdaptationVeryHigh = self.ps.app.stringIDToTypeID("cafColorAdaptationVeryHigh")
            desc526.putEnumerated(idcafColorAdaptationLevel, idcafColorAdaptationLevel, idcafColorAdaptationVeryHigh)
    
        idcaRotationAmount = self.ps.app.stringIDToTypeID( "cafRotationAmount" )
        idcaRotationAmount = self.ps.app.stringIDToTypeID( "cafRotationAmount" )
    
        if self.rot == 'none':
            idcafRotationAmountNone = self.ps.app.stringIDToTypeID("cafRrotationAmountNone")
            desc526.putEnumerated(idcaRotationAmount, idcafRotationAmount, idcafRotationAmountNone)
        elif self.rot == 'low':
            idcaRotationAmountLow = self.ps.app.stringIDToTypeID("cafRotationAmountLow")
            desc526.putEnumerated(idcaRotationAmount, idcafRotationAmount, idcafRotationAmountLow)
        elif self.rot == 'medium':
            idcaRotationAmountMedium = self.ps.app.stringIDToTypeID("cafRotationAmountMedium")
            desc526.putEnumerated(idcaRotationAmount, idcafRotationAmount, idcafRotationAmountMedium)

        elif self.rot == 'high':
            idcaRotationAmountHigh = self.ps.app.stringIDToTypeID("cafRotationAmountHigh")
            desc526.putEnumerated(idcaRotationAmount, idcaRotationAmount, idcaRotationAmountHigh)
        elif self.rot == 'full':
            idcaRotationAmountFull = self.ps.app.stringIDToTypeID("cafRotationAmountFull")
            desc526.putEnumerated(idcaRotationAmount, idcaRotationAmount, idcaRotationAmountFull)
    
        idcafScale = self.ps.app.stringIDToTypeID( "cafScale" )
        desc526.putBoolean( idcafScale, False )
        idcafMirror = self.ps.app.stringIDToTypeID( "cafMirror" )
        desc526.putBoolean( idcafMirror, False )
        idcafOutput = self.ps.app.stringIDToTypeID( "cafOutput" )
        idcafOutput = self.ps.app.stringIDToTypeID( "cafOutput" )
        idcafOutputToCurrentLayer = self.ps.app.stringIDToTypeID( "cafOutputToCurrentLayer" )
        desc526.putEnumerated( idcafOutput, idcafOutput, idcafOutputToCurrentLayer )
        self.ps.app.executeAction( idcafWorkspace, desc526)

    def rectangle_complete(self):
        self.ps.app.activeDocument.activeLayer.rasterize(self.ps.RasterizeType.EntireLayer)

        idcafWorkspace = self.ps.app.stringIDToTypeID("cafWorkspace")
        desc938 = self.ps.ActionDescriptor()
        idcafSamplingRegion = self.ps.app.stringIDToTypeID("cafSamplingRegion")
        idcafSamplingRegion = self.ps.app.stringIDToTypeID("cafSamplingRegion")
        idcafSamplingRegionRectangular = self.ps.app.stringIDToTypeID("cafSamplingRegionRectangular")
        desc938.putEnumerated(idcafSamplingRegion, idcafSamplingRegion, idcafSamplingRegionRectangular)
        idcafSampleAllLayers = self.ps.app.stringIDToTypeID("cafSampleAllLayers")
        desc938.putBoolean(idcafSampleAllLayers, False)
        idcafColorAdaptationLevel = self.ps.app.stringIDToTypeID("cafColorAdaptationLevel")
        idcafColorAdaptationLevel = self.ps.app.stringIDToTypeID("cafColorAdaptationLevel")

        if self.col == 'none':
            idcafColorAdaptationNone = self.ps.app.stringIDToTypeID("cafColorAdaptationNone")
            desc938.putEnumerated(idcafColorAdaptationLevel, idcafColorAdaptationLevel, idcafColorAdaptationNone)
        if self.col == ' default':
            idcafColorAdaptationDefault = self.ps.app.stringIDToTypeID("cafColorAdaptationDefault")
            desc938.putEnumerated(idcafColorAdaptationLevel, idcafColorAdaptationLevel, idcafColorAdaptationDefault)
        if self.col == 'high':
            idcafColorAdaptationHigh = self.ps.app.stringIDToTypeID("cafColorAdaptationHigh")
            desc938.putEnumerated(idcafColorAdaptationLevel, idcafColorAdaptationLevel, idcafColorAdaptationHigh)
        if self.col == 'very_high':
            idcafColorAdaptationVeryHigh = self.ps.app.stringIDToTypeID("cafColorAdaptationVeryHigh")
            desc938.putEnumerated(idcafColorAdaptationLevel, idcafColorAdaptationLevel, idcafColorAdaptationVeryHigh)

        idcafRotationAmount = self.ps.app.stringIDToTypeID("cafRotationAmount")
        idcafRotationAmount = self.ps.app.stringIDToTypeID("cafRotationAmount")

        if self.rot == 'none':
            idcafRotationAmountNone = self.ps.app.stringIDToTypeID("cafRotationAmountNone")
            desc938.putEnumerated(idcafRotationAmount, idcafRotationAmount, idcafRotationAmountNone)
        elif self.rot == 'low':
            idcafRotationAmountLow = self.ps.app.stringIDToTypeID("cafRotationAmountLow")
            desc938.putEnumerated(idcafRotationAmount, idcafRotationAmount, idcafRotationAmountLow)
        elif self.rot == 'medium':
            idcafRotationAmountMedium = self.ps.app.stringIDToTypeID("cafRotationAmountMedium")
            desc938.putEnumerated(idcafRotationAmount, idcafRotationAmount, idcafRotationAmountMedium)
        elif self.rot == 'high':
            idcafRotationAmountHigh = self.ps.app.stringIDToTypeID("cafRotationAmountHigh")
            desc938.putEnumerated(idcafRotationAmount, idcafRotationAmount, idcafRotationAmountHigh)
        elif self.rot == 'full':
            idcafRotationAmountFull = self.ps.app.stringIDToTypeID("cafRotationAmountFull")
            desc938.putEnumerated(idcafRotationAmount, idcafRotationAmount, idcafRotationAmountFull)

        idcafScale = self.ps.app.stringIDToTypeID("cafScale")
        desc938.putBoolean(idcafScale, False)
        idcafMirror = self.ps.app.stringIDToTypeID("cafMirror")
        desc938.putBoolean(idcafMirror, False)
        idcafOutput = self.ps.app.stringIDToTypeID("cafOutput")
        idcafOutput = self.ps.app.stringIDToTypeID("cafOutput")
        idcafOutputToCurrentLayer = self.ps.app.stringIDToTypeID("cafOutputToCurrentLayer")
        desc938.putEnumerated(idcafOutput, idcafOutput, idcafOutputToCurrentLayer)
        self.ps.app.executeAction(idcafWorkspace, desc938)
    
    def make_layer_using_selection(self):
        idCpTL = self.ps.app.charIDToTypeID("CpTL")
        desc999 = self.ps.ActionDescriptor()
        self.ps.app.executeAction(idCpTL, desc999)
    
        # self.ps.app.activeDocument.activeLayer = self.ps.app.activeDocument.artLayers.getByName("image_wrapped_original")
        self.ps.app.activeDocument.artLayers.getByName("image_wrapped_original").visible = False # Make background layer invisible
    
    def save_patch_as_jpg(self, name):
        parent = os.getcwd()
        directory1 = "photoshop outputs"
        path1 = os.path.join(parent, directory1)
    
        directory2 = "patches"
        path2 = os.path.join(path1, directory2)
        if os.path.isdir(path2) is False:
            os.mkdir(path2)
    
        options = self.ps.JPEGSaveOptions()
        options.quality = 1
        options.embedColorProfile = True
        jpg = os.path.join(path2, name)
        self.ps.active_document.saveAs(jpg, options)
    
        img = cv2.imread("photoshop outputs\\patches\\" + name)
        cropped_image = img[((self.image_height // 2) - (self.patch_height // 2)):((self.image_height // 2) + (self.patch_height // 2)), 0:self.image_width]
        cv2.imwrite("photoshop outputs\\patches\\" + name, cropped_image)
    
    def save_multi_patch_as_jpg(self, name, left, right):
        parent = os.getcwd()
        directory1 = "photoshop outputs"
        path1 = os.path.join(parent, directory1)
        if os.path.isdir(path1) is False:
            os.mkdir(path1)
    
        directory2 = "patches"
        path2 = os.path.join(path1, directory2)
        if os.path.isdir(path2) is False:
            os.mkdir(path2)
    
        options = self.ps.JPEGSaveOptions()
        options.quality = 1
        options.embedColorProfile = True
        jpg = os.path.join(path2, name)
        self.ps.active_document.saveAs(jpg, options)
    
        img = cv2.imread("photoshop outputs\\patches\\" + name)
        cropped_image = img[((self.image_height // 2) - (self.patch_height // 2)):((self.image_height // 2) + (self.patch_height // 2)), left:right]
        cv2.imwrite("photoshop outputs\\patches\\" + name, cropped_image)
    
    
    def save_result_as_jpg(self, name):
        parent = os.getcwd()
        directory1 = "photoshop outputs"
        path1 = os.path.join(parent, directory1)
        if os.path.isdir(path1) is False:
            os.mkdir(path1)
    
        directory2 = "images"
        path2 = os.path.join(path1, directory2)
        if os.path.isdir(path2) is False:
            os.mkdir(path2)
    
        options = self.ps.JPEGSaveOptions()
        options.quality = 1
        options.embedColorProfile = True
        jpg = os.path.join(path2, name)
        self.ps.active_document.saveAs(jpg, options)

        cv2.imwrite("photoshop outputs\\images\\image_wrapped_original.jpg", self.image)
    
    def merge_layers(self):
        self.ps.app.activeDocument.artLayers.getByName("image_wrapped_original").visible = True
        idMrgV = self.ps.app.charIDToTypeID("MrgV")
        desc999 = self.ps.ActionDescriptor()
        self.ps.app.executeAction(idMrgV, desc999)
        self.ps.app.activeDocument.activeLayer.name = "image_wrapped_original"

        # idCrop = ps.app.charIDToTypeID("Crop")
        # desc8330 = ps.ActionDescriptor()
        # idT = ps.app.charIDToTypeID("T   ")
        # desc8331 = ps.ActionDescriptor()
        # idTop = ps.app.charIDToTypeID("Top ")
        # idPxl = ps.app.charIDToTypeID("#Pxl")
        # desc8331.putUnitDouble(idTop, idPxl, 0.000000)
        # idLeft = ps.app.charIDToTypeID("Left")
        # idPxl = ps.app.charIDToTypeID("#Pxl")
        # desc8331.putUnitDouble(idLeft, idPxl, 0.000000)
        # idBtom = ps.app.charIDToTypeID("Btom")
        # idPxl = ps.app.charIDToTypeID("#Pxl")
        # desc8331.putUnitDouble(idBtom, idPxl, 16384.000000)
        # idRght = ps.app.charIDToTypeID("Rght")
        # idPxl = ps.app.charIDToTypeID("#Pxl")
        # desc8331.putUnitDouble(idRght, idPxl, 4096.000000)
        # idRctn = ps.app.charIDToTypeID("Rctn")
        # desc8330.putObject(idT, idRctn, desc8331)
        # idAngl = ps.app.charIDToTypeID("Angl")
        # idAng = ps.app.charIDToTypeID("#Ang")
        # desc8330.putUnitDouble(idAngl, idAng, 0.000000)
        # idDlt = ps.app.charIDToTypeID("Dlt ")
        # desc8330.putBoolean(idDlt, True)
        # idcropAspectRatioModeKey = ps.app.stringIDToTypeID("cropAspectRatioModeKey")
        # idcropAspectRatioModeClass = ps.app.stringIDToTypeID("cropAspectRatioModeClass")
        # idpureAspectRatio = ps.app.stringIDToTypeID("pureAspectRatio")
        # desc8330.putEnumerated(idcropAspectRatioModeKey, idcropAspectRatioModeClass, idpureAspectRatio)
        # idCnsP = ps.app.charIDToTypeID("CnsP")
        # desc8330.putBoolean(idCnsP, False)
        # ps.app.executeAction(idCrop, desc8330)

    def create_document(self):
        self.ps.app.preferences.rulerUnits = self.ps.Units.Pixels
        self.ps.app.documents.add(self.image_width, self.image_height, name="new_doc")

    def place_image(self):
        idPlc = self.ps.app.charIDToTypeID("Plc ")
        desc4061 = self.ps.ActionDescriptor()
        idIdnt = self.ps.app.charIDToTypeID("Idnt")
        desc4061.putInteger(idIdnt, 2)
        idnull = self.ps.app.charIDToTypeID("null")
        desc4061.putPath(idnull, self.image_path)
        idFTcs = self.ps.app.charIDToTypeID("FTcs")
        idQCSt = self.ps.app.charIDToTypeID("QCSt")
        idQcsa = self.ps.app.charIDToTypeID("Qcsa")
        desc4061.putEnumerated(idFTcs, idQCSt, idQcsa)
        idOfst = self.ps.app.charIDToTypeID("Ofst")
        desc4062 = self.ps.ActionDescriptor()
        idHrzn = self.ps.app.charIDToTypeID("Hrzn")
        idPxl = self.ps.app.charIDToTypeID("#Pxl")
        desc4062.putUnitDouble(idHrzn, idPxl, 0.000000)
        idVrtc = self.ps.app.charIDToTypeID("Vrtc")
        idPxl = self.ps.app.charIDToTypeID("#Pxl")
        desc4062.putUnitDouble(idVrtc, idPxl, 0.000000)
        idOfst = self.ps.app.charIDToTypeID("Ofst")
        desc4061.putObject(idOfst, idOfst, desc4062)
        self.ps.app.executeAction(idPlc, desc4061)

    def rectangle_selection(self, top, bottom, left, right):
        selarea = ((left, top), (left, bottom), (right, bottom), (right, top))
        self.ps.app.activeDocument.selection.select(selarea)

    def delete_background_layer(self):
        idslct = self.ps.app.charIDToTypeID("slct")
        desc7518 = self.ps.ActionDescriptor()
        idnull = self.ps.app.charIDToTypeID("null")
        ref179 = self.ps.ActionReference()
        idLyr = self.ps.app.charIDToTypeID("Lyr ")
        ref179.putName(idLyr, "Background")
        desc7518.putReference(idnull, ref179)
        idMkVs = self.ps.app.charIDToTypeID("MkVs")
        desc7518.putBoolean(idMkVs, False)
        idLyrI = self.ps.app.charIDToTypeID("LyrI")
        list86 = self.ps.ActionList()
        list86.putInteger(1)
        desc7518.putList(idLyrI, list86)
        self.ps.app.executeAction(idslct, desc7518)

        idDlt = self.ps.app.charIDToTypeID("Dlt ")
        desc7525 = self.ps.ActionDescriptor()
        idnull = self.ps.app.charIDToTypeID("null")
        ref180 = self.ps.ActionReference()
        idLyr = self.ps.app.charIDToTypeID("Lyr ")
        idOrdn = self.ps.app.charIDToTypeID("Ordn")
        idTrgt = self.ps.app.charIDToTypeID("Trgt")
        ref180.putEnumerated(idLyr, idOrdn, idTrgt)
        desc7525.putReference(idnull, ref180)
        idLyrI = self.ps.app.charIDToTypeID("LyrI")
        list87 = self.ps.ActionList()
        list87.putInteger(1)
        desc7525.putList(idLyrI, list87)
        self.ps.app.executeAction(idDlt, desc7525)

    # def open_image(ps):
    #     ps.app.preferences.rulerUnits = ps.Units.Pixels
    #     ps.app.documents.add(1920, 1080, name="my_new_document")
    #
    #     idhistoryStateChanged = ps.app.stringIDToTypeID("historyStateChanged")
    #     desc7562 = ps.ActionDescriptor()
    #     idDocI = ps.app.charIDToTypeID("DocI")
    #     desc7562.putInteger(idDocI, 1659)
    #     idIdnt = ps.app.charIDToTypeID("Idnt")
    #     desc7562.putInteger(idIdnt, 1660)
    #     idNm = ps.app.charIDToTypeID("Nm  ")
    #     desc7562.putString(idNm, """Open""")
    #     idhasEnglish = ps.app.stringIDToTypeID("hasEnglish")
    #     desc7562.putBoolean(idhasEnglish, True)
    #     idItmI = ps.app.charIDToTypeID("ItmI")
    #     desc7562.putInteger(idItmI, 1)
    #     ps.app.executeAction(idhistoryStateChanged, desc7562)
    #
    #     idMRUFileListChanged = ps.app.stringIDToTypeID("MRUFileListChanged")
    #     desc7563 = ps.ActionDescriptor()
    #     iddontRecord = ps.app.stringIDToTypeID("dontRecord")
    #     desc7563.putBoolean(iddontRecord, True)
    #     idforceNotify = ps.app.stringIDToTypeID("forceNotify")
    #     desc7563.putBoolean(idforceNotify, True)
    #     ps.app.executeAction(idMRUFileListChanged, desc7563)
    #
    #     idOpn = ps.app.charIDToTypeID("Opn ")
    #     desc7564 = ps.ActionDescriptor()
    #     iddontRecord = ps.app.stringIDToTypeID("dontRecord")
    #     desc7564.putBoolean(iddontRecord, False)
    #     idforceNotify = ps.app.stringIDToTypeID("forceNotify")
    #     desc7564.putBoolean(idforceNotify, True)
    #     idnull = ps.app.charIDToTypeID("null")
    #     desc7564.putPath(idnull, path)
    #     idDocI = ps.app.charIDToTypeID("DocI")
    #     desc7564.putInteger(idDocI, 1659)
    #     ps.app.executeAction(idOpn, desc7564)
    #
    #     idlayersFiltered = ps.app.stringIDToTypeID("layersFiltered")
    #     ps.app.executeAction(idlayersFiltered, undefined)

    def single_patch_content_fill(self):
        # Define the selection areas for the seam and the patch

        patch_top = (self.image_height // 2) - (self.patch_height // 2)
        patch_bottom = (self.image_height // 2) + (self.patch_height // 2)
        patch_left = 0
        patch_right = self.image_height

        seam_top = (self.image_height // 2) - (self.seam_height // 2)
        seam_bottom = (self.image_height // 2) + (self.seam_height // 2)
        seam_left = 0
        seam_right = self.image_height

        self.create_document()
        self.place_image()
        self.delete_background_layer()
        self.rectangle_selection(patch_top, patch_bottom, patch_left, patch_right)  # Select the patch
        self.make_layer_using_selection()  # Create new layer using selected patch
        self.rectangle_selection(seam_top, seam_bottom, seam_left, seam_right)  # Select the seam
        if self.type == 'auto':
            self.auto()
            self.save_patch_as_jpg("single_auto_patch.jpg")
            self.merge_layers()
            self.save_result_as_jpg("image_wrapped.jpg")
            print("Content-Aware Fill using auto context around region successful.\n")
        elif self.type == 'rectangle':
            self.rectangle()
            self.save_patch_as_jpg("single_rectangle_patch.jpg")
            self.merge_layers()
            self.save_result_as_jpg("image_wrapped.jpg")
            print("Content-Aware Fill through single rectangular patch successful.\n")
        elif self.type == 'complete':
            self.rectangle_complete()
            self.save_patch_as_jpg("single_complete_context_patch.jpg")
            self.merge_layers()
            self.save_result_as_jpg("image_wrapped.jpg")
            print("Content-Aware Fill through single patch and entire patch as context successful.\n")
    
    def multi_patch_content_fill(self):
        num_patches = math.ceil(self.image_width / int(self.patch_width))
        num_patches += (self.overlay * num_patches // self.patch_width) + 2

        patch_top = (self.image_height // 2) - (self.patch_height // 2)
        patch_bottom = (self.image_height // 2) + (self.patch_height // 2)
        patch_left = 0
        patch_right = self.patch_width

        seam_top = (self.image_height // 2) - (self.seam_height // 2)
        seam_bottom = (self.image_height // 2) + (self.seam_height // 2)
        seam_left = 0
        seam_right = self.patch_width

        self.create_document()
        self.place_image()
        self.delete_background_layer()
    
        for patch in range(num_patches):
            self.rectangle_selection(patch_top, patch_bottom, patch_left, patch_right)  # Select the patch
            self.make_layer_using_selection()  # Create new layer using selected patch
            self.rectangle_selection(seam_top, seam_bottom, seam_left, seam_right)  # Select the seam
            if self.type == 'auto':
                self.auto()
                self.save_multi_patch_as_jpg("multi_patch_" + str(patch) + ".jpg", patch_left, patch_right)
                self.merge_layers()
                self.save_result_as_jpg("image_wrapped.jpg")
            elif self.type == 'rectangle':
                self.rectangle()
                self.save_multi_patch_as_jpg("multi_patch_" + str(patch) + ".jpg", patch_left, patch_right)
                self.merge_layers()
                self.save_result_as_jpg("image_wrapped.jpg")
            elif self.type == 'complete':
                self.rectangle_complete()
                self.save_multi_patch_as_jpg("multi_patch_" + str(patch) + ".jpg", patch_left, patch_right)
                self.merge_layers()
                self.save_result_as_jpg("image_wrapped.jpg")
    
            patch_left += self.patch_width - self.overlay
            patch_right += self.patch_width - self.overlay
            seam_left += self.patch_width - self.overlay
            seam_right += self.patch_width - self.overlay
    
        print("Content-Aware Fill through multiple patches and " + self.type + " context successful.\n")
