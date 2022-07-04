const consoleOutput = document.getElementById("console");
const log = function (msg) {
    if(consoleOutput != null) {
        consoleOutput.innerText = `${consoleOutput.innerText}\n${msg}`;
    }
    console.log(msg);
}

let mediaDeviceTorch = 0;
let mediaDeviceTorchSupported = false;
let mediaDeviceTrack = null;

function mediaDeviceSwitchTorch(value) {
    if(mediaDeviceTorchSupported == false)
        return;

    // Si NO cambio el estado deseado de la linterna
    // salir y no realizar cambios
    if(value == mediaDeviceTorch) {
        return;
    }
            
    try {
        // Apagar o prender la linterna
        mediaDeviceTrack.applyConstraints({
            advanced: [{
            torch: value
            }]
        });
        // registrar último estado ingresado
        mediaDeviceTorch = value;
    } catch (err) {
        log(err);
    }
}

// Evaluar si el explorador soporta el uso de mediaDevices
let SUPPORTS_MEDIA_DEVICES = 'mediaDevices' in navigator;
if (SUPPORTS_MEDIA_DEVICES) {
    // Obtener las camaras
    navigator.mediaDevices.enumerateDevices().then(devices => {

        const cameras = devices.filter((device) => device.kind === 'videoinput');

        // Evaluar si se ha encontra una camara
        if (cameras.length === 0) {
            log('No se ha encontrado ninguna cámara');
        }
        // Crear un stream y obtener el video track
        navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: 'environment',
        }
        }).then(stream => {
            mediaDeviceTrack = stream.getVideoTracks()[0];

            // Crear un image capture object y obtener la camara capabilities
            const imageCapture = new ImageCapture(mediaDeviceTrack)
            imageCapture.getPhotoCapabilities().then(capabilities => {
                //let there be light!
                const btn = document.querySelector('#switch');
                const torchSupported = !!capabilities.torch || (
                'fillLightMode' in capabilities &&
                capabilities.fillLightMode.length != 0 &&
                capabilities.fillLightMode != 'none'
                );

                // ¿Se encuentra la linterna soportada?
                if (torchSupported) {
                    mediaDeviceTorchSupported = true;
                } 
                else {
                    log("No se encontró linterna");
                }
            }).catch(log);
        }).catch(log);
    }).catch(log);

  //The light will be on as long the track exists
}
else {
    log("Error, su device no soporta el uso de estas herramientas")
}