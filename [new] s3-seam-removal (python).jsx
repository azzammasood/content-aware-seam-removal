// Main Program
app.preferences.rulerUnits = Units.PIXELS
app.preferences.typeUnits = TypeUnits.PIXELS

offset_images()

// Hide all maps except Albedo
hide_maps_except_albedo()

// Rename Albedo map to Original_Albedo
app.activeDocument.activeLayer.name = "Original_Albedo"

values = window_prompts_for_inputs()

var mode = values[0]
var type =  values[1]
var color_adaptation = values[2]
var rotation_adaptation = values[3]
var patch_height = parseInt(values[4])
var patch_width = parseInt(values[5])
var seam_height = parseInt(values[6])
var overlay = parseInt(values[7])

var image_height = parseInt(app.activeDocument.height)
var image_width = parseInt(app.activeDocument.width)

switch(mode)
{
    case 'single':
    {
        single_patch_content_fill(type, 
            image_height,
            image_width,
            patch_height,
            seam_height, 
            color_adaptation, 
            rotation_adaptation)

        // Delete layers except maps
        delete_layer("Patch and Seam Areas Highlighted")
        delete_layer("Single Patch auto")
        delete_layer("Original_Albedo")

        // Save all maps as EXR files in temp folder
        for (layer = 0; layer < app.activeDocument.artLayers.length; layer++)
        {
            app.activeDocument.activeLayer = app.activeDocument.layers[layer]
            duplicateLayerToDocument(app.activeDocument.activeLayer.name)
            export_as_exr(app.activeDocument.activeLayer.name)
            close()
        }

        // Upload Filled Albedo and input settings to quixel-ml-team-data bucket
        var string_of_values = String(patch_height) + "," + String(patch_width) + "," + String(seam_height) + "," + String(overlay)
        path_of_text_file = Folder.temp.fsName + "/input settings.txt"
        writeTextFile(path_of_text_file, string_of_values)

        app.system('python "C:\\Users\\Administrator\\Desktop\\Abdullah Chand\\quixel-ml-khalid-chand-horizontal-seam-removal\\seam-removal.py" -al "C:\\Users\\Administrator\\AppData\\Local\\Temp\\Filled_Albedo.exr" -dp "C:\\Users\\Administrator\\AppData\\Local\\Temp\\Displacement.exr" -n "C:\\Users\\Administrator\\AppData\\Local\\Temp\\Normal.exr" -ao "C:\\Users\\DELL\\AppData\\Local\\Temp\\AO.exr" -o Outputs ' + app.version)
        alert("Seam-Removed Albedo, other maps and input settings successfully uploaded")

        break
    }

    case 'multi':
    {
        multi_patch_content_fill(type, 
            image_height, 
            image_width, 
            patch_height, 
            patch_width, 
            seam_height, 
            color_adaptation, 
            rotation_adaptation,
            overlay)

        // Delete layers except maps
        delete_layer("Patch and Seam Areas Highlighted")
        delete_layer("Single Patch auto")
        delete_layer("Original_Albedo")

        // Save all maps as EXR files in temp folder
        for (layer = 0; layer < app.activeDocument.artLayers.length; layer++)
        {
            app.activeDocument.activeLayer = app.activeDocument.layers[layer]
            duplicateLayerToDocument(app.activeDocument.activeLayer.name)
            export_as_exr(app.activeDocument.activeLayer.name)
            close()
        }

        // Upload Filled Albedo and input settings to quixel-ml-team-data bucket
        var string_of_values = String(patch_height) + "," + String(patch_width) + "," + String(seam_height) + "," + String(overlay)
        path_of_text_file = Folder.temp.fsName + "/input_settings.txt"
        writeTextFile(path_of_text_file, string_of_values)

        app.system('python "C:\\Users\\Administrator\\Desktop\\Abdullah Chand\\quixel-ml-khalid-chand-horizontal-seam-removal\\seam-removal.py" -al "C:\\Users\\Administrator\\AppData\\Local\\Temp\\Filled_Albedo.exr" -dp "C:\\Users\\Administrator\\AppData\\Local\\Temp\\Displacement.exr" -n "C:\\Users\\Administrator\\AppData\\Local\\Temp\\Normal.exr" -ao "C:\\Users\\DELL\\AppData\\Local\\Temp\\AO.exr" -o Outputs ' + app.version)
        alert("Seam-Removed Albedo, other maps and input settings successfully uploaded")

        break
    }
    case 'ml':
    {
        delete_layer("Patch and Seam Areas Highlighted")
        
        // Save all maps as EXR files in temp folder
        for (layer = 0; layer < app.activeDocument.artLayers.length; layer++)
        {
            app.activeDocument.activeLayer = app.activeDocument.layers[layer]
            duplicateLayerToDocument(app.activeDocument.activeLayer.name)
            export_as_exr(app.activeDocument.activeLayer.name)
            close()
        }

        // Upload Filled Albedo and input settings to quixel-ml-team-data bucket
        var string_of_values = String(patch_height) + "," + String(patch_width) + "," + String(seam_height) + "," + String(overlay)
        path_of_text_file = Folder.temp.fsName + "/input_settings.txt"
        writeTextFile(path_of_text_file, string_of_values)

        app.system('python "C:\\Users\\Administrator\\Desktop\\Abdullah Chand\\quixel-ml-khalid-chand-horizontal-seam-removal\\seam-removal.py" -al "C:\\Users\\Administrator\\AppData\\Local\\Temp\\Filled_Albedo.exr" -dp "C:\\Users\\Administrator\\AppData\\Local\\Temp\\Displacement.exr" -n "C:\\Users\\Administrator\\AppData\\Local\\Temp\\Normal.exr" -ao "C:\\Users\\DELL\\AppData\\Local\\Temp\\AO.exr" -o Outputs ' + app.version)
        alert("Seam-Removed Albedo, other maps and input settings successfully uploaded")

        break
    }
}

// End of Main Program

function auto(color, rotation)
{
    app.activeDocument.activeLayer.rasterize(RasterizeType.ENTIRELAYER)

    var idcafWorkspace = stringIDToTypeID("cafWorkspace")
    var desc5549 = new ActionDescriptor()

    var idcafSamplingRegion = stringIDToTypeID("cafSamplingRegion")
    var idcafSamplingRegion = stringIDToTypeID("cafSamplingRegion")
    var idcafSamplingRegionAuto = stringIDToTypeID("cafSamplingRegionAuto")
    desc5549.putEnumerated(idcafSamplingRegion, idcafSamplingRegion, idcafSamplingRegionAuto)
    var idcafSampleAllLayers = stringIDToTypeID("cafSampleAllLayers")
    desc5549.putBoolean(idcafSampleAllLayers, false)
    var idcafColorAdaptationLevel = stringIDToTypeID("cafColorAdaptationLevel")
    var idcafColorAdaptationLevel = stringIDToTypeID("cafColorAdaptationLevel")

    if (color == 'none') {
        var idcafColorAdaptationNone = stringIDToTypeID("cafColorAdaptationNone")
        desc5549.putEnumerated(idcafColorAdaptationLevel, idcafColorAdaptationLevel, idcafColorAdaptationNone) }
    else if (color == 'default') {
        var idcafColorAdaptationdefault = stringIDToTypeID("cafColorAdaptationdefault")
        desc5549.putEnumerated(idcafColorAdaptationLevel, idcafColorAdaptationLevel, idcafColorAdaptationdefault) }
    else if (color == 'high') {
        var idcafColorAdaptationHigh = stringIDToTypeID("cafColorAdaptationHigh")
        desc5549.putEnumerated(idcafColorAdaptationLevel, idcafColorAdaptationLevel, idcafColorAdaptationHigh) }
    else if (color == 'very high') {
        var idcafColorAdaptationVeryHigh = stringIDToTypeID("cafColorAdaptationVeryHigh")
        desc5549.putEnumerated(idcafColorAdaptationLevel, idcafColorAdaptationLevel, idcafColorAdaptationVeryHigh) }

    var idcafRotationAmount = stringIDToTypeID("cafRotationAmount")
    var idcafRotationAmount = stringIDToTypeID("cafRotationAmount")

    if (rotation == 'none') {
        var idcafRotationAmountNone = stringIDToTypeID("cafRotationAmountNone")
        desc5549.putEnumerated(idcafRotationAmount, idcafRotationAmount, idcafRotationAmountNone) }
    else if (rotation == 'low') {
        var idcafRotationAmountLow = stringIDToTypeID("cafRotationAmountLow")
        desc5549.putEnumerated(idcafRotationAmount, idcafRotationAmount, idcafRotationAmountLow) }
    else if (rotation == 'medium') {
        var idcafRotationAmountMedium = stringIDToTypeID("cafRotationAmountMedium")
        desc5549.putEnumerated(idcafRotationAmount, idcafRotationAmount, idcafRotationAmountMedium) }
    else if (rotation == 'high') {
        var idcafRotationAmountHigh = stringIDToTypeID("cafRotationAmountHigh")
        desc5549.putEnumerated(idcafRotationAmount, idcafRotationAmount, idcafRotationAmountHigh) }
    else if (rotation == 'full') {
        var idcafRotationAmountFull = stringIDToTypeID("cafRotationAmountFull")
        desc5549.putEnumerated(idcafRotationAmount, idcafRotationAmount, idcafRotationAmountFull) }

    var idcafScale = stringIDToTypeID("cafScale")
    desc5549.putBoolean(idcafScale, false)
    var idcafMirror = stringIDToTypeID("cafMirror")
    desc5549.putBoolean(idcafMirror, false)
    var idcafOutput = stringIDToTypeID("cafOutput")
    var idcafOutput = stringIDToTypeID("cafOutput")
    var idcafOutputToCurrentLayer = stringIDToTypeID("cafOutputToCurrentLayer")
    desc5549.putEnumerated(idcafOutput, idcafOutput, idcafOutputToCurrentLayer)
    executeAction(idcafWorkspace, desc5549, DialogModes.NO)
}

function rectangle(color, rotation)
{
    app.activeDocument.activeLayer.rasterize(RasterizeType.ENTIRELAYER)

    idcafWorkspace = stringIDToTypeID("cafWorkspace")
    desc526 = new ActionDescriptor()
    idcafSamplingRegion = stringIDToTypeID("cafSamplingRegion")
    idcafSamplingRegion = stringIDToTypeID("cafSamplingRegion")
    idcafSamplingRegionRectangular = stringIDToTypeID("cafSamplingRegionRectangular")
    desc526.putEnumerated(idcafSamplingRegion, idcafSamplingRegion, idcafSamplingRegionRectangular)
    idcafSampleAllLayers = stringIDToTypeID("cafSampleAllLayers")
    desc526.putBoolean(idcafSampleAllLayers, false)
    idcafColorAdaptationLevel = stringIDToTypeID("cafColorAdaptationLevel")
    idcafColorAdaptationLevel = stringIDToTypeID("cafColorAdaptationLevel")

    if (color == 'none') {
        var idcafColorAdaptationNone = stringIDToTypeID("cafColorAdaptationNone")
        desc526.putEnumerated(idcafColorAdaptationLevel, idcafColorAdaptationLevel, idcafColorAdaptationNone) }
    else if (color == 'default') {
        var idcafColorAdaptationdefault = stringIDToTypeID("cafColorAdaptationdefault")
        desc526.putEnumerated(idcafColorAdaptationLevel, idcafColorAdaptationLevel, idcafColorAdaptationdefault) }
    else if (color == 'high') {
        var idcafColorAdaptationHigh = stringIDToTypeID("cafColorAdaptationHigh")
        desc526.putEnumerated(idcafColorAdaptationLevel, idcafColorAdaptationLevel,idcafColorAdaptationHigh) }
    else if (color == 'very high') {
        var idcafColorAdaptationVeryHigh = stringIDToTypeID("cafColorAdaptationVeryHigh")
        desc526.putEnumerated(idcafColorAdaptationLevel, idcafColorAdaptationLevel, idcafColorAdaptationVeryHigh) }

    idcaRotationAmount = stringIDToTypeID("cafRotationAmount")
    idcaRotationAmount = stringIDToTypeID("cafRotationAmount")

    if (rotation == 'none') {
        var idcafRotationAmountNone = stringIDToTypeID("cafRrotationAmountNone")
        desc526.putEnumerated(idcaRotationAmount, idcafRotationAmount, idcafRotationAmountNone) }
    else if (rotation == 'low') {
        idcaRotationAmountLow = stringIDToTypeID("cafRotationAmountLow")
        desc526.putEnumerated(idcaRotationAmount, idcafRotationAmount, idcafRotationAmountLow) }
    else if (rotation == 'medium') {
        idcaRotationAmountMedium = stringIDToTypeID("cafRotationAmountMedium")
        desc526.putEnumerated(idcaRotationAmount, idcafRotationAmount, idcafRotationAmountMedium) }

    else if (rotation == 'high') {
        idcaRotationAmountHigh = stringIDToTypeID("cafRotationAmountHigh")
        desc526.putEnumerated(idcaRotationAmount, idcaRotationAmount, idcaRotationAmountHigh) }
    else if (rotation == 'full') {
        idcaRotationAmountFull = stringIDToTypeID("cafRotationAmountFull")
        desc526.putEnumerated(idcaRotationAmount, idcaRotationAmount, idcaRotationAmountFull) }

    var idcafScale = stringIDToTypeID("cafScale")
    desc526.putBoolean(idcafScale, false)
    var idcafMirror = stringIDToTypeID("cafMirror")
    desc526.putBoolean(idcafMirror, false)
    var idcafOutput = stringIDToTypeID("cafOutput")
    var idcafOutput = stringIDToTypeID("cafOutput")
    var idcafOutputToCurrentLayer = stringIDToTypeID("cafOutputToCurrentLayer")
    desc526.putEnumerated(idcafOutput, idcafOutput, idcafOutputToCurrentLayer)
    executeAction(idcafWorkspace, desc526, DialogModes.NO)
}

function rectangle_complete(color, rotation)
{
    app.activeDocument.activeLayer.rasterize(RasterizeType.ENTIRELAYER)

    var idcafWorkspace = stringIDToTypeID("cafWorkspace")
    var desc938 = new ActionDescriptor()
    var idcafSamplingRegion = stringIDToTypeID("cafSamplingRegion")
    var idcafSamplingRegion = stringIDToTypeID("cafSamplingRegion")
    var idcafSamplingRegionRectangular = stringIDToTypeID("cafSamplingRegionRectangular")
    desc938.putEnumerated(idcafSamplingRegion, idcafSamplingRegion, idcafSamplingRegionRectangular)
    var idcafSampleAllLayers = stringIDToTypeID("cafSampleAllLayers")
    desc938.putBoolean(idcafSampleAllLayers, false)
    var idcafColorAdaptationLevel = stringIDToTypeID("cafColorAdaptationLevel")
    var idcafColorAdaptationLevel = stringIDToTypeID("cafColorAdaptationLevel")

    if (color == 'none') {
        var idcafColorAdaptationNone = stringIDToTypeID("cafColorAdaptationNone")
        desc938.putEnumerated(idcafColorAdaptationLevel, idcafColorAdaptationLevel, idcafColorAdaptationNone) }
    if (color == ' default') {
        var idcafColorAdaptationdefault = stringIDToTypeID("cafColorAdaptationdefault")
        desc938.putEnumerated(idcafColorAdaptationLevel, idcafColorAdaptationLevel, idcafColorAdaptationdefault) }
    if (color == 'high') {
        var idcafColorAdaptationHigh = stringIDToTypeID("cafColorAdaptationHigh")
        desc938.putEnumerated(idcafColorAdaptationLevel, idcafColorAdaptationLevel, idcafColorAdaptationHigh) }
    if (color == 'very high') {
        var idcafColorAdaptationVeryHigh = stringIDToTypeID("cafColorAdaptationVeryHigh")
        desc938.putEnumerated(idcafColorAdaptationLevel, idcafColorAdaptationLevel, idcafColorAdaptationVeryHigh) }

    var idcafRotationAmount = stringIDToTypeID("cafRotationAmount")
    var idcafRotationAmount = stringIDToTypeID("cafRotationAmount")

    if (rotation == 'none') {
        var idcafRotationAmountNone = stringIDToTypeID("cafRotationAmountNone")
        desc938.putEnumerated(idcafRotationAmount, idcafRotationAmount, idcafRotationAmountNone) }
    else if (rotation == 'low') {
        var idcafRotationAmountLow = stringIDToTypeID("cafRotationAmountLow")
        desc938.putEnumerated(idcafRotationAmount, idcafRotationAmount, idcafRotationAmountLow) }
    else if (rotation == 'medium') {
        var idcafRotationAmountMedium = stringIDToTypeID("cafRotationAmountMedium")
        desc938.putEnumerated(idcafRotationAmount, idcafRotationAmount, idcafRotationAmountMedium) }
    else if (rotation == 'high') {
        var idcafRotationAmountHigh = stringIDToTypeID("cafRotationAmountHigh")
        desc938.putEnumerated(idcafRotationAmount, idcafRotationAmount, idcafRotationAmountHigh) }
    else if (rotation == 'full') {
        var idcafRotationAmountFull = stringIDToTypeID("cafRotationAmountFull")
        desc938.putEnumerated(idcafRotationAmount, idcafRotationAmount, idcafRotationAmountFull) }

    var idcafScale = stringIDToTypeID("cafScale")
    desc938.putBoolean(idcafScale, false)
    var idcafMirror = stringIDToTypeID("cafMirror")
    desc938.putBoolean(idcafMirror, false)
    var idcafOutput = stringIDToTypeID("cafOutput")
    var idcafOutput = stringIDToTypeID("cafOutput")
    var idcafOutputToCurrentLayer = stringIDToTypeID("cafOutputToCurrentLayer")
    desc938.putEnumerated(idcafOutput, idcafOutput, idcafOutputToCurrentLayer)
    executeAction(idcafWorkspace, desc938, DialogModes.NO)
}

function make_layer_using_selection(layer_name)
{
    var idCpTL = charIDToTypeID("CpTL")
    var desc999 = new ActionDescriptor()
    executeAction(idCpTL, desc999, DialogModes.NO)
    app.activeDocument.activeLayer.name = layer_name

    app.activeDocument.artLayers.getByName("Original_Albedo").visible = false  // Make background layer invisible
}

function retain_important_layers()
{
    app.activeDocument.activeLayer = app.activeDocument.artLayers.getByName("Patch and Seam Areas Highlighted")
    app.activeDocument.activeLayer.visible = false

    app.activeDocument.activeLayer = app.activeDocument.artLayers.getByName("Original_Albedo")
    app.activeDocument.activeLayer.visible = true
    app.activeDocument.activeLayer = app.activeDocument.activeLayer.duplicate()
    app.activeDocument.activeLayer.visible = false
    
    app.activeDocument.activeLayer = app.activeDocument.artLayers.getByName("Original_Albedo")
}


function merge_layers_in_single_mode(type)
{
    app.activeDocument.activeLayer = app.activeDocument.artLayers.getByName("Single Patch")
    app.activeDocument.activeLayer = app.activeDocument.activeLayer.duplicate()
    app.activeDocument.activeLayer.name = "Single Patch " + type
    app.activeDocument.activeLayer.visible = false
    app.activeDocument.activeLayer = app.activeDocument.artLayers.getByName("Single Patch")

    var idMrgV = charIDToTypeID("MrgV")
    var desc999 = new ActionDescriptor()
    executeAction(idMrgV, desc999, DialogModes.NO)
    app.activeDocument.activeLayer.name = "Filled_Albedo"

    app.activeDocument.artLayers.getByName("Original_Albedo copy").name = "Original_Albedo"
}

function merge_layers_in_multi_mode()
{
    var idMrgV = charIDToTypeID("MrgV")
    var desc999 = new ActionDescriptor()
    executeAction(idMrgV, desc999, DialogModes.NO)
    app.activeDocument.activeLayer.name = "Filled_Albedo"
}

function create_document(image_width, image_height)
{
    app.preferences.rulerUnits = Units.PIXELS
    app.documents.add(image_width, image_height, 72, "new_doc")
}

function place_image()
{
    var idPlc = charIDToTypeID("Plc ")
    var desc4061 = new ActionDescriptor()
    var idIdnt = charIDToTypeID("Idnt")
    desc4061.putInteger(idIdnt, 2)
    var idnull = charIDToTypeID("null")
    desc4061.putPath(idnull, this.image_path)
    var idFTcs = charIDToTypeID("FTcs")
    var idQCSt = charIDToTypeID("QCSt")
    var  idQcsa = charIDToTypeID("Qcsa")
    desc4061.putEnumerated(idFTcs, idQCSt, idQcsa)
    var idOfst = charIDToTypeID("Ofst")
    var desc4062 = new ActionDescriptor()
    var idHrzn = charIDToTypeID("Hrzn")
    var idPxl = charIDToTypeID("//Pxl")
    desc4062.putUnitDouble(idHrzn, idPxl, 0.000000)
    var idVrtc = charIDToTypeID("Vrtc")
    var idPxl = charIDToTypeID("//Pxl")
    desc4062.putUnitDouble(idVrtc, idPxl, 0.000000)
    var idOfst = charIDToTypeID("Ofst")
    desc4061.putObject(idOfst, idOfst, desc4062)
    executeAction(idPlc, desc4061, DialogModes.NO)
}

function rectangle_selection(top, bottom, left, right)
{
    var selarea = [[left, top], [left, bottom],[right, bottom], [right, top]]
    app.activeDocument.selection.select(selarea)
}

function delete_background_layer()
{
    var idslct = charIDToTypeID("slct")
    var desc7518 = new ActionDescriptor()
    var idnull = charIDToTypeID("null")
    var ref179 = new ActionReference()()
    var idLyr = charIDToTypeID("Lyr ")
    ref179.putName(idLyr, "Background")
    desc7518.putReference(idnull, ref179)
    var idMkVs = charIDToTypeID("MkVs")
    desc7518.putBoolean(idMkVs, false)
    var idLyrI = charIDToTypeID("LyrI")
    var list86 = new ActionList()
    list86.putInteger(1)
    desc7518.putList(idLyrI, list86)
    executeAction(idslct, desc7518, DialogModes.NO)

    var idDlt = charIDToTypeID("Dlt ")
    var desc7525 = new ActionDescriptor()
    var idnull = charIDToTypeID("null")
    var ref180 = new ActionReference()()
    var idLyr = charIDToTypeID("Lyr ")
    var idOrdn = charIDToTypeID("Ordn")
    var idTrgt = charIDToTypeID("Trgt")
    ref180.putEnumerated(idLyr, idOrdn, idTrgt)
    desc7525.putReference(idnull, ref180)
    var idLyrI = charIDToTypeID("LyrI")
    var list87 = new ActionList()
    list87.putInteger(1)
    desc7525.putList(idLyrI, list87)
    executeAction(idDlt, desc7525, DialogModes.NO)
}

function single_patch_content_fill(type, image_height, image_width, patch_height, seam_height, color, rotation)
{
    // define the selection areas for the seam and the patch

    var patch_top = (image_height / 2) - (patch_height / 2)
    var patch_bottom = (image_height / 2) + (patch_height / 2)
    var patch_left = 0
    var patch_right = image_height

    var seam_top = (image_height / 2) - (seam_height / 2)
    var seam_bottom = (image_height / 2) + (seam_height / 2)
    var seam_left = 0
    var seam_right = image_height

    rectangle_selection(patch_top, patch_bottom, patch_left, patch_right)  // Select the patch
    make_layer_using_selection("Single Patch")  // Create new layer using selected patch
    rectangle_selection(seam_top, seam_bottom, seam_left, seam_right)  // Select the seam

    if (type == 'auto') {
        auto(color, rotation)
        retain_important_layers()
        merge_layers_in_single_mode(type)
        alert("Content-Aware Fill using auto context around region successful.\n") }
    else if (type == 'rectangle') {
        rectangle(color, rotation)
        retain_important_layers()
        merge_layers_in_single_mode(type)
        alert("Content-Aware Fill through single rectangular patch successful.\n") }
    else if (type == 'complete') { 
        rectangle_complete(color, rotation)
        retain_important_layers()
        merge_layers_in_single_mode(type)
        alert("Content-Aware Fill through single patch and entire patch as context successful.\n") }
}

function multi_patch_content_fill(type, image_height, image_width, patch_height, patch_width, seam_height, color, rotation, overlay)
{
    var num_patches = image_width / patch_width
    var num_patches = Math.ceil(num_patches + (overlay * num_patches / patch_width))

    var patch_top = (image_height / 2) - (patch_height / 2)
    var patch_bottom = (image_height / 2) + (patch_height / 2)
    var patch_left = 0
    var patch_right = patch_width

    var seam_top = (image_height / 2) - (seam_height / 2)
    var seam_bottom = (image_height / 2) + (seam_height / 2)
    var seam_left = 0
    
    var seam_right = patch_width

    for (var patch = 0; patch < num_patches; patch++)
    {
        rectangle_selection(patch_top, patch_bottom, patch_left, patch_right)  // Select the patch
        make_layer_using_selection("Multi Patch #" + patch)  // Create new layer using selected patch
        rectangle_selection(seam_top, seam_bottom, seam_left, seam_right)  // Select the seam
        if (type == 'auto') 
        {
            auto(color, rotation)
            retain_important_layers_in_multi_mode()
            merge_layers_in_multi_mode("Multi Patch #", patch)
        }
        else if (type == 'rectangle') 
        {
            rectangle(color, rotation)
            retain_important_layers_in_multi_mode()
            merge_layers_in_multi_mode("Multi Patch #", patch)
        }
        else if (type == 'complete') {
            rectangle_complete(color, rotation)
            retain_important_layers_in_multi_mode()
            merge_layers_in_multi_mode("Multi Patch #", patch)
        }

        patch_left = patch_left + patch_width - overlay
        patch_right = patch_right + patch_width - overlay
        seam_left = seam_left + patch_width - overlay
        seam_right = seam_right + patch_width - overlay
    }
    alert("Content-Aware Fill through multiple patches and " + type + " context successful.\n")
}

function retain_important_layers_in_multi_mode()
{
    app.activeDocument.artLayers.getByName("Patch and Seam Areas Highlighted").visible = false
    app.activeDocument.activeLayer.visible = false  // Hide multi-patch layer to retain

    app.activeDocument.activeLayer = app.activeDocument.activeLayer.duplicate() // Duplicate the multi patch layer
    app.activeDocument.activeLayer.name = "patch temp"    // Rename the duplicated multi-patch layer "temp""
    app.activeDocument.activeLayer = app.activeDocument.artLayers.getByName("Original_Albedo")   // Get original layer
    app.activeDocument.activeLayer.visible = false  // Hide Original_Albedo
    app.activeDocument.activeLayer = app.activeDocument.activeLayer.duplicate()
    app.activeDocument.activeLayer.name = "image temp"
}

function window_prompts_for_inputs()
{
    var mode = prompt("Set the mode. Available modes are:\n1. single (Single patch over entire seam))\n2. multi (Multiple patchs over seam)\nml (Machine Learning technique for seam removal)", "single")
    javascript_abort(mode)
    var type = prompt("Set the context type.\nAvailable types are: auto, rectangle, complete", "auto")
    javascript_abort(type)
    var color_adaptation = prompt("Set the amount of color adaptation.\nAmounts are: none, default, high, very high", "none")
    javascript_abort(color_adaptation)
    var rotation_adaptation = prompt("Set the amount of rotation adaptation.\nAmounts are: none, low, medium, high, full", "high")
    javascript_abort(rotation_adaptation)
    var seam_height = prompt("Set the seam height in pixels.", "600")
    javascript_abort(seam_height)
    var list_of_patch_dimensions_and_overlay = show_seam_and_patch_region(mode, app.activeDocument.height, app.activeDocument.width, seam_height)
    var patch_height = list_of_patch_dimensions_and_overlay[0]
    var patch_width = list_of_patch_dimensions_and_overlay[1]
    var overlay = list_of_patch_dimensions_and_overlay[2]

    return [mode, type, color_adaptation, rotation_adaptation, patch_height, patch_width, seam_height, overlay]
}

function show_seam_and_patch_region(mode, image_height, image_width, seam_height)
{
    var old_state = "Name Change"

    var resume = true
    while (resume)
    {
        var patch_height = prompt("Set the patch height (in pixels).", "2000")
        javascript_abort(patch_height)
        if ((mode == 'multi') || (mode == 'ml'))
        {
            var patch_width = prompt("Set the patch width (in pixels).", "1000")
            javascript_abort(patch_width)
            var patch_right = patch_width
            var overlay = prompt("Set the amount of overlay between subsequent patches (in pixels).", "100")
            javascript_abort(overlay)
        }
        else
        {
            var patch_right = image_width - 25
        }
        if (mode == 'ml')
        {
            duplicateLayerToDocument("temp")
            export_as_exr(app.activeDocument.activeLayer.name)
            close()
        }
            
        // Duplicate layer to show selected patch and seam areas
        var original_layer = app.activeDocument.activeLayer.name
        app.activeDocument.activeLayer = app.activeDocument.activeLayer.duplicate()
        app.activeDocument.activeLayer.name = "Patch and Seam Areas Highlighted"

        // Select the patch
        var patch_top = (image_height / 2) - (patch_height / 2)
        var patch_bottom = (image_height / 2) + (patch_height / 2)
        var patch_left = + 25
        rectangle_selection(patch_top, patch_bottom, patch_left, patch_right)
        app.activeDocument.selection.invert()

        // Darken the patch
        var fillColor = new SolidColor()
        fillColor.rgb.red = 0
        fillColor.rgb.green = 0
        fillColor.rgb.blue = 0
        app.activeDocument.selection.fill(fillColor, ColorBlendMode.DARKEN, 32, false)

        // Draw black rectangular border around patch and merge
        draw_rectangle_border(patch_top, patch_bottom, patch_left, patch_right, 50)
        app.activeDocument.layers["Original_Albedo"].visible = false
        var idMrgV = charIDToTypeID("MrgV")
        var desc999 = new ActionDescriptor()
        executeAction(idMrgV, desc999, DialogModes.NO)
        app.activeDocument.activeLayer.name = "Patch and Seam Areas Highlighted"
        
        // Select the seam
        var seam_top = (image_height / 2) - (seam_height / 2)
        var seam_bottom = (image_height / 2) + (seam_height / 2)
        var seam_left = 0
        var seam_right = image_width
        rectangle_selection(seam_top, seam_bottom, seam_left, seam_right)

        // Fill seam area with white color with 50% opacity
        var fillColor = new SolidColor()
        fillColor.rgb.red = 255
        fillColor.rgb.green = 255
        fillColor.rgb.blue = 255
        app.activeDocument.selection.fill(fillColor, ColorBlendMode.VIVIDLIGHT, 60, false)

        resume = prompt("The white region is the seam area you have selected, and the black region is the patch area you have selected.\
                            Do you wish to continue with these values?", "yes")
        if (resume == "yes")
        {
            break
        }

        selectSnapshot(old_state)
    }

    app.activeDocument.activeLayer = app.activeDocument.artLayers.getByName(original_layer)

    return [patch_height, patch_width, overlay]
}

function offset_images()
{
    split_names()
    for (i = 0; i < app.activeDocument.artLayers.length; i++)
    {
        // Set active layer
        app.activeDocument.activeLayer = app.activeDocument.layers[i]
        var name_of_map = app.activeDocument.activeLayer.name

        // Store name of original document, so that offset image can be duplicated to original document later on
        var name_of_original_document = app.activeDocument.name
        duplicateLayerToNewDocument(app.activeDocument.activeLayer.name + "offset")

        // Resize active document for size of offset image
        var canvas_height = parseInt(app.activeDocument.height)
        var canvas_width = parseInt(app.activeDocument.width)

        var new_canvas_height = canvas_height * 2
        app.activeDocument.resizeCanvas(canvas_width, new_canvas_height, AnchorPosition.BOTTOMCENTER)

        var top = new_canvas_height / 2
        var bottom = new_canvas_height
        var left = canvas_width / 2
        var right = canvas_width
        var selarea = [[left, top], [left, bottom], [right, bottom], [right, top]]
        app.activeDocument.selection.select(selarea)
        app.activeDocument.selection.copy()
        app.activeDocument.selection.deselect()

        var top = 0
        var bottom = new_canvas_height / 2
        var left = 0
        var right = canvas_width / 2
        var selarea = [[left, top], [left, bottom], [right, bottom], [right, top]]
        app.activeDocument.selection.select(selarea)
        app.activeDocument.paste()

        var new_canvas_width = canvas_width / 2

        app.activeDocument.resizeCanvas(new_canvas_width, new_canvas_height, AnchorPosition.MIDDLELEFT)

        var idMrgV = charIDToTypeID("MrgV")
        var desc999 = new ActionDescriptor()
        executeAction(idMrgV, desc999, DialogModes.NO)
        app.activeDocument.activeLayer.name = name_of_map
        temp_name = app.activeDocument.name

        runMenuItem(app.charIDToTypeID("FtOn"))

        if (i == 0)
        {
            duplicateLayerToNewDocument("Offset Maps")
        }
        else
        {
            duplicateLayerToCreatedDocument("Offset Maps")
        }
        selectDocument(temp_name)
        close()
        selectDocument(name_of_original_document)
    }
    selectDocument(name_of_original_document)
    close()

}

function save_active_layer_to_temp_folder(name_of_file)
{
    options = new JPEGSaveOptions()
    options.quality = 1
    options.embedColorProfile = true
    imagepath = Folder.temp.fsName + "\\" + name_of_file
    jpg = new File(imagepath)
    app.activeDocument.saveAs(jpg, options)
}

function javascript_abort(a)
{
    if (a == null)
    {
        throw new Error('Aborting execution.')
    }
}

// Set the third parameter to true if you don't want this to create the file if it doesn't already exist.
// Returns false if file was not created. Doesn't account for write errors...
function writeTextFile( filePath, textContent, dontCreateFile ) 
{
    var file = new File( filePath );
    var fileExists = file.exists;
    if ( fileExists || !fileExists && dontCreateFile !== true ) {
      
      file.open('w'); // Opens a file for writing. If the file exists, its contents are destroyed. If the file does not exist, creates a new, empty file.
      file.encoding = 'UTF8';
      file.write( textContent );
      file.close();
      
    }
    else {
      return false;
    }
    
}

function exportToJPEG(name_of_image) {
    var fullFilePath = Folder.temp.fsName + "\\" + name_of_image
    var idsave = stringIDToTypeID("save");
    var desc5 = new ActionDescriptor();
    var idas = stringIDToTypeID("as");
    var desc6 = new ActionDescriptor();
    var idgoodQuality = stringIDToTypeID("goodQuality");
    desc6.putInteger(idgoodQuality, 6);
    var idscans = stringIDToTypeID("scans");
    desc6.putInteger(idscans, 5);
    var idmatteColor = stringIDToTypeID("matteColor");
    var idmatteColor = stringIDToTypeID("matteColor");
    var idnone = stringIDToTypeID("none");
    desc6.putEnumerated(idmatteColor, idmatteColor, idnone);
    var idJPEG = stringIDToTypeID("JPEG");
    desc5.putObject(idas, idJPEG, desc6);
    var idin = stringIDToTypeID("in");
    desc5.putPath(idin, new File(fullFilePath));
    var iddocumentID = stringIDToTypeID("documentID");
    desc5.putInteger(iddocumentID, 219);
    var idlowerCase = stringIDToTypeID("lowerCase");
    desc5.putBoolean(idlowerCase, true);
    var idsaveStage = stringIDToTypeID("saveStage");
    var idsaveStageType = stringIDToTypeID("saveStageType");
    var idsaveSucceeded = stringIDToTypeID("saveSucceeded");
    desc5.putEnumerated(idsaveStage, idsaveStageType, idsaveSucceeded);
    executeAction(idsave, desc5, DialogModes.NO);
}

function save_as_jpg(name_of_image)
{
    jpgFile = new File( Folder.temp.fsName + "\\" + name_of_image ) 
    jpgSaveOptions = new JPEGSaveOptions() 
    jpgSaveOptions.embedColorProfile = true
    jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE 
    jpgSaveOptions.matte = MatteType.NONE
    jpgSaveOptions.quality = 5
    app.activeDocument.saveAs(jpgFile, jpgSaveOptions, true, Extension.LOWERCASE)
}

function duplicateLayerToNewDocument(documentName)
{
    var idMk = charIDToTypeID( "Mk  " );
    var desc302 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref14 = new ActionReference();
    var idDcmn = charIDToTypeID( "Dcmn" );
    ref14.putClass( idDcmn );
    desc302.putReference( idnull, ref14 );
    var idNm = charIDToTypeID( "Nm  " );
    desc302.putString( idNm, documentName );
    var idUsng = charIDToTypeID( "Usng" );
    var ref15 = new ActionReference();
    var idLyr = charIDToTypeID( "Lyr " );
    var idOrdn = charIDToTypeID( "Ordn" );
    var idTrgt = charIDToTypeID( "Trgt" );
    ref15.putEnumerated( idLyr, idOrdn, idTrgt );
    desc302.putReference( idUsng, ref15 );
    var idVrsn = charIDToTypeID( "Vrsn" );
    desc302.putInteger( idVrsn, 5 );
    executeAction( idMk, desc302, DialogModes.NO );
}

function close()
{
    var idCls = charIDToTypeID( "Cls " );
    var desc827 = new ActionDescriptor();
    var idSvng = charIDToTypeID( "Svng" );
    var idYsN = charIDToTypeID( "YsN " );
    var idN = charIDToTypeID( "N   " );
    desc827.putEnumerated( idSvng, idYsN, idN );
    var idDocI = charIDToTypeID( "DocI" );
    desc827.putInteger( idDocI, 830 );
    var idforceNotify = stringIDToTypeID( "forceNotify" );
    desc827.putBoolean( idforceNotify, true );
    executeAction( idCls, desc827, DialogModes.NO );
}

function selectDocument(document) {
	var m_Dsc1 = new ActionDescriptor();
	var m_Ref1 = new ActionReference();
	m_Ref1.putName( stringIDToTypeID( "document" ), document );
	m_Dsc1.putReference( stringIDToTypeID( "null" ), m_Ref1 );
	
	try {
		executeAction( stringIDToTypeID( "select" ), m_Dsc1, DialogModes.NO );
		return true;
	} catch(e) {
		return false;
	}
}

function duplicateLayerToCreatedDocument(documentName)
{
var idDplc = charIDToTypeID( "Dplc" );
    var desc579 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref88 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref88.putEnumerated( idLyr, idOrdn, idTrgt );
    desc579.putReference( idnull, ref88 );
    var idT = charIDToTypeID( "T   " );
        var ref89 = new ActionReference();
        var idDcmn = charIDToTypeID( "Dcmn" );
        ref89.putName( idDcmn, documentName );
    desc579.putReference( idT, ref89 );
    var idNm = charIDToTypeID( "Nm  " );
    desc579.putString( idNm, app.activeDocument.activeLayer.name );
    var idVrsn = charIDToTypeID( "Vrsn" );
    desc579.putInteger( idVrsn, 5 );
    var idIdnt = charIDToTypeID( "Idnt" );
        var list37 = new ActionList();
        list37.putInteger( 3 );
    desc579.putList( idIdnt, list37 );
executeAction( idDplc, desc579, DialogModes.NO );
}

function split_names()
{
    for (i = 0; i < app.activeDocument.artLayers.length; i++)
    {
        app.activeDocument.activeLayer = app.activeDocument.layers[i]
        var input = app.activeDocument.activeLayer.name
        var underscore_separated = input.split('_');
        temp_name = underscore_separated[2]
        var dot_separated = temp_name.split('.')
        app.activeDocument.activeLayer.name = dot_separated[0]
    }
}

function hide_maps_except_albedo()
{
    app.activeDocument.activeLayer = app.activeDocument.artLayers.getByName("Albedo")
    for (layer = 0; layer < app.activeDocument.artLayers.length; layer++)
    {
        if (app.activeDocument.layers[layer].name != "Albedo")
        {
            app.activeDocument.layers[layer].visible = false
        }
    }
}

function duplicateLayerToDocument(documentName)
{
    var idMk = charIDToTypeID( "Mk  " );
    var desc789 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref120 = new ActionReference();
    var idDcmn = charIDToTypeID( "Dcmn" );
    ref120.putClass( idDcmn );
    desc789.putReference( idnull, ref120 );
    var idNm = charIDToTypeID( "Nm  " );
    desc789.putString( idNm, documentName );
    var idUsng = charIDToTypeID( "Usng" );
    var ref121 = new ActionReference();
    var idLyr = charIDToTypeID( "Lyr " );
    var idOrdn = charIDToTypeID( "Ordn" );
    var idTrgt = charIDToTypeID( "Trgt" );
    ref121.putEnumerated( idLyr, idOrdn, idTrgt );
    desc789.putReference( idUsng, ref121 );
    var idVrsn = charIDToTypeID( "Vrsn" );
    desc789.putInteger( idVrsn, 5 );
    executeAction( idMk, desc789, DialogModes.NO );
}

function change_bit_depth_to_32()
{
    var idCnvM = charIDToTypeID( "CnvM" );
    var desc548 = new ActionDescriptor();
    var idDpth = charIDToTypeID( "Dpth" );
    desc548.putInteger( idDpth, 32 );
    var idMrge = charIDToTypeID( "Mrge" );
    desc548.putBoolean( idMrge, false );
    var idRstr = charIDToTypeID( "Rstr" );
    desc548.putBoolean( idRstr, false );
    executeAction( idCnvM, desc548, DialogModes.NO );
}

function export_as_exr(name_of_file)
{
    change_bit_depth_to_32()

    var idsave = charIDToTypeID( "save" );
    var desc705 = new ActionDescriptor();
    var idAs = charIDToTypeID( "As  " );
        var desc706 = new ActionDescriptor();
        var idBtDp = charIDToTypeID( "BtDp" );
        desc706.putInteger( idBtDp, 16 );
        var idCmpr = charIDToTypeID( "Cmpr" );
        desc706.putInteger( idCmpr, 4 );
        var idAChn = charIDToTypeID( "AChn" );
        desc706.putInteger( idAChn, 1 );
    var idEXRf = charIDToTypeID( "EXRf" );
    desc705.putObject( idAs, idEXRf, desc706 );
    var idIn = charIDToTypeID( "In  " );
    desc705.putPath( idIn, new File( Folder.temp.fsName + "\\" + name_of_file + ".exr" ) );
    var idDocI = charIDToTypeID( "DocI" );
    desc705.putInteger( idDocI, 365 );
    var idLwCs = charIDToTypeID( "LwCs" );
    desc705.putBoolean( idLwCs, true );
    var idsaveStage = stringIDToTypeID( "saveStage" );
    var idsaveStageType = stringIDToTypeID( "saveStageType" );
    var idsaveSucceeded = stringIDToTypeID( "saveSucceeded" );
    desc705.putEnumerated( idsaveStage, idsaveStageType, idsaveSucceeded );
    executeAction( idsave, desc705, DialogModes.NO );
}

function delete_layer(name_of_layer)
{
    app.activeDocument.activeLayer = app.activeDocument.artLayers.getByName(name_of_layer)

    var idDlt = charIDToTypeID( "Dlt " );
    var desc765 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref9 = new ActionReference();
    var idLyr = charIDToTypeID( "Lyr " );
    var idOrdn = charIDToTypeID( "Ordn" );
    var idTrgt = charIDToTypeID( "Trgt" );
    ref9.putEnumerated( idLyr, idOrdn, idTrgt );
    desc765.putReference( idnull, ref9 );
    var idLyrI = charIDToTypeID( "LyrI" );
    var list7 = new ActionList();
    list7.putInteger( 6 );
    desc765.putList( idLyrI, list7 );
    executeAction( idDlt, desc765, DialogModes.NO );
}

function draw_rectangle_border(top, bottom, left, right, strokeWidth)
{
    var idMk = charIDToTypeID( "Mk  " );
    var desc955 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref26 = new ActionReference();
    var idcontentLayer = stringIDToTypeID( "contentLayer" );
    ref26.putClass( idcontentLayer );
    desc955.putReference( idnull, ref26 );
    var idUsng = charIDToTypeID( "Usng" );
    var desc956 = new ActionDescriptor();
    var idType = charIDToTypeID( "Type" );
    var desc957 = new ActionDescriptor();
    var idClr = charIDToTypeID( "Clr " );
    var desc958 = new ActionDescriptor();
    var idRd = charIDToTypeID( "Rd  " );
    desc958.putDouble( idRd, 124.793778 );
    var idGrn = charIDToTypeID( "Grn " );
    desc958.putDouble( idGrn, 124.793778 );
    var idBl = charIDToTypeID( "Bl  " );
    desc958.putDouble( idBl, 124.793778 );
    var idRGBC = charIDToTypeID( "RGBC" );
    desc957.putObject( idClr, idRGBC, desc958 );
    var idsolidColorLayer = stringIDToTypeID( "solidColorLayer" );
    desc956.putObject( idType, idsolidColorLayer, desc957 );
    var idShp = charIDToTypeID( "Shp " );
    var desc959 = new ActionDescriptor();
    var idunitValueQuadVersion = stringIDToTypeID( "unitValueQuadVersion" );
    desc959.putInteger( idunitValueQuadVersion, 1 );
    var idTop = charIDToTypeID( "Top " );
    var idPxl = charIDToTypeID( "#Pxl" );
    desc959.putUnitDouble( idTop, idPxl, top );
    var idLeft = charIDToTypeID( "Left" );
    var idPxl = charIDToTypeID( "#Pxl" );
    desc959.putUnitDouble( idLeft, idPxl, left );
    var idBtom = charIDToTypeID( "Btom" );
    var idPxl = charIDToTypeID( "#Pxl" );
    desc959.putUnitDouble( idBtom, idPxl, bottom );
    var idRght = charIDToTypeID( "Rght" );
    var idPxl = charIDToTypeID( "#Pxl" );
    desc959.putUnitDouble( idRght, idPxl, right );
    var idtopRight = stringIDToTypeID( "topRight" );
    var idPxl = charIDToTypeID( "#Pxl" );
    desc959.putUnitDouble( idtopRight, idPxl, 0.000000 );
    var idtopLeft = stringIDToTypeID( "topLeft" );
    var idPxl = charIDToTypeID( "#Pxl" );
    desc959.putUnitDouble( idtopLeft, idPxl, 0.000000 );
    var idbottomLeft = stringIDToTypeID( "bottomLeft" );
    var idPxl = charIDToTypeID( "#Pxl" );
    desc959.putUnitDouble( idbottomLeft, idPxl, 0.000000 );
    var idbottomRight = stringIDToTypeID( "bottomRight" );
    var idPxl = charIDToTypeID( "#Pxl" );
    desc959.putUnitDouble( idbottomRight, idPxl, 0.000000 );
    var idRctn = charIDToTypeID( "Rctn" );
    desc956.putObject( idShp, idRctn, desc959 );
    var idstrokeStyle = stringIDToTypeID( "strokeStyle" );
    var desc960 = new ActionDescriptor();
    var idstrokeStyleVersion = stringIDToTypeID( "strokeStyleVersion" );
    desc960.putInteger( idstrokeStyleVersion, 2 );
    var idstrokeEnabled = stringIDToTypeID( "strokeEnabled" );
    desc960.putBoolean( idstrokeEnabled, true );
    var idfillEnabled = stringIDToTypeID( "fillEnabled" );
    desc960.putBoolean( idfillEnabled, false );
    var idstrokeStyleLineWidth = stringIDToTypeID( "strokeStyleLineWidth" );
    var idPxl = charIDToTypeID( "#Pxl" );
    desc960.putUnitDouble( idstrokeStyleLineWidth, idPxl, strokeWidth );
    var idstrokeStyleLineDashOffset = stringIDToTypeID( "strokeStyleLineDashOffset" );
    var idPnt = charIDToTypeID( "#Pnt" );
    desc960.putUnitDouble( idstrokeStyleLineDashOffset, idPnt, 0.000000 );
    var idstrokeStyleMiterLimit = stringIDToTypeID( "strokeStyleMiterLimit" );
    desc960.putDouble( idstrokeStyleMiterLimit, 100.000000 );
    var idstrokeStyleLineCapType = stringIDToTypeID( "strokeStyleLineCapType" );
    var idstrokeStyleLineCapType = stringIDToTypeID( "strokeStyleLineCapType" );
    var idstrokeStyleButtCap = stringIDToTypeID( "strokeStyleButtCap" );
    desc960.putEnumerated( idstrokeStyleLineCapType, idstrokeStyleLineCapType, idstrokeStyleButtCap );
    var idstrokeStyleLineJoinType = stringIDToTypeID( "strokeStyleLineJoinType" );
    var idstrokeStyleLineJoinType = stringIDToTypeID( "strokeStyleLineJoinType" );
    var idstrokeStyleMiterJoin = stringIDToTypeID( "strokeStyleMiterJoin" );
    desc960.putEnumerated( idstrokeStyleLineJoinType, idstrokeStyleLineJoinType, idstrokeStyleMiterJoin );
    var idstrokeStyleLineAlignment = stringIDToTypeID( "strokeStyleLineAlignment" );
    var idstrokeStyleLineAlignment = stringIDToTypeID( "strokeStyleLineAlignment" );
    var idstrokeStyleAlignCenter = stringIDToTypeID( "strokeStyleAlignCenter" );
    desc960.putEnumerated( idstrokeStyleLineAlignment, idstrokeStyleLineAlignment, idstrokeStyleAlignCenter );
    var idstrokeStyleScaleLock = stringIDToTypeID( "strokeStyleScaleLock" );
    desc960.putBoolean( idstrokeStyleScaleLock, false );
    var idstrokeStyleStrokeAdjust = stringIDToTypeID( "strokeStyleStrokeAdjust" );
    desc960.putBoolean( idstrokeStyleStrokeAdjust, false );
    var idstrokeStyleLineDashSet = stringIDToTypeID( "strokeStyleLineDashSet" );
    var list11 = new ActionList();
    desc960.putList( idstrokeStyleLineDashSet, list11 );
    var idstrokeStyleBlendMode = stringIDToTypeID( "strokeStyleBlendMode" );
    var idBlnM = charIDToTypeID( "BlnM" );
    var idNrml = charIDToTypeID( "Nrml" );
    desc960.putEnumerated( idstrokeStyleBlendMode, idBlnM, idNrml );
    var idstrokeStyleOpacity = stringIDToTypeID( "strokeStyleOpacity" );
    var idPrc = charIDToTypeID( "#Prc" );
    desc960.putUnitDouble( idstrokeStyleOpacity, idPrc, 100.000000 );
    var idstrokeStyleContent = stringIDToTypeID( "strokeStyleContent" );
    var desc961 = new ActionDescriptor();
    var idClr = charIDToTypeID( "Clr " );
    var desc962 = new ActionDescriptor();
    var idRd = charIDToTypeID( "Rd  " );
    desc962.putDouble( idRd, 0.000000 );
    var idGrn = charIDToTypeID( "Grn " );
    desc962.putDouble( idGrn, 0.000000 );
    var idBl = charIDToTypeID( "Bl  " );
    desc962.putDouble( idBl, 0.000000 );
    var idRGBC = charIDToTypeID( "RGBC" );
    desc961.putObject( idClr, idRGBC, desc962 );
    var idsolidColorLayer = stringIDToTypeID( "solidColorLayer" );
    desc960.putObject( idstrokeStyleContent, idsolidColorLayer, desc961 );
    var idstrokeStyleResolution = stringIDToTypeID( "strokeStyleResolution" );
    desc960.putDouble( idstrokeStyleResolution, 300.000000 );
    var idstrokeStyle = stringIDToTypeID( "strokeStyle" );
    desc956.putObject( idstrokeStyle, idstrokeStyle, desc960 );
    var idcontentLayer = stringIDToTypeID( "contentLayer" );
    desc955.putObject( idUsng, idcontentLayer, desc956 );
    var idLyrI = charIDToTypeID( "LyrI" );
    desc955.putInteger( idLyrI, 13 );
    executeAction( idMk, desc955, DialogModes.NO );
}

function run_powershell_script()
{
    app.system('powershell.exe -ExecutionPolicy remotesigned -File "C:\\upload_script.ps1"')
}

function selectSnapshot(name) 
{
	var m_Dsc1 = new ActionDescriptor();
	var m_Ref1 = new ActionReference();
	m_Ref1.putName( stringIDToTypeID( "snapshotClass" ), name );
	m_Dsc1.putReference( stringIDToTypeID( "null" ), m_Ref1 );
	
	try {
		executeAction( stringIDToTypeID( "select" ), m_Dsc1, DialogModes.NO );
		return true;
	} catch(e) {
		return false;
	}
}

