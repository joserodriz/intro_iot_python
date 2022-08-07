// ---- Estructura de datos ----
let data = {
    luz: 0,
    volar: 0,
    motores: [0, 0, 0, 0],
    joystick: {x: 0, y: 0},
    inerciales: {heading: 0, accel: 0},
    gps: {latitude: -34.55, longitude: -58.496},
    monitoreo: {temp: 0, ram:0, cpu:0}   
}

let socket_connected = false;

// ---- Elementos del HTML ----
const drone = document.getElementById("drone");
const motor1 = document.querySelector("#motor1");
const motor2 = document.querySelector("#motor2");
const motor3 = document.querySelector("#motor3");
const motor4 = document.querySelector("#motor4");

const light = document.getElementById("droneLight");

const slight = document.querySelector("#slight");
light.style.opacity = 0;

// --- Funciones de ayuda ----
function updateEngineState(state) {
    if(state == true) {
        data.volar = 1;
        data.motores[0] = 1;
        data.motores[1] = 1;
        data.motores[2] = 1;
        data.motores[3] = 1;
    } else {
        data.volar = 0;
        data.motores[0] = 0;
        data.motores[1] = 0;
        data.motores[2] = 0;
        data.motores[3] = 0;
    }
}

function rotate() {
    x = data.joystick.y > 0? data.joystick.y * 60 : 0;
    y = data.joystick.x * 60 + 180;
    z = (-data.inerciales.heading);
    drone.style.webkitTransform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
    drone.style.MozTransform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
    drone.style.transform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
}

function update() {
    data.motores[0] == true ? motor1.classList.add("propeller--on") : motor1.classList.remove("propeller--on");
    data.motores[1] == true ? motor2.classList.add("propeller--on") : motor2.classList.remove("propeller--on");
    data.motores[2] == true ? motor3.classList.add("propeller--on") : motor3.classList.remove("propeller--on");
    data.motores[3] == true ? motor4.classList.add("propeller--on") : motor4.classList.remove("propeller--on");
}

function sendActuadorUpdate(actuador) {
    if (socket_connected == true){
        if(actuador == "volar") {
            socket.emit("volar_event", data.volar);
        }
        if(actuador == "luz") {
            socket.emit("luz_event", data.luz);
        }
        if(actuador == "motores") {
            socket.emit("motores_event", data.motores);
        }
    }
}

// ---- Instanciar elementos HTML y conectar eventos ----
slight.onchange = (e) => {
    const val = e.target.checked ? 1 : 0;
    data.luz = val;
    light.style.opacity = val;
    sendActuadorUpdate("luz");
}
const sengine = document.querySelector("#sengine");
sengine.onchange = (e) => {
    updateEngineState(e.target.checked);
    update();
    sendActuadorUpdate("volar");
    sendActuadorUpdate("motores");
}

// ---- Sensores y eventos del celular ----

// Linterna
(function my_func_celular() {
    mediaDeviceSwitchTorch(data.luz);
    setTimeout( my_func_celular, 500 );
})();

// Orientacion (heading)
let sensor = new AbsoluteOrientationSensor();
sensor.addEventListener('reading', function(e) {
  let q = e.target.quaternion;
  heading = Math.atan2(2*q[0]*q[1] + 2*q[2]*q[3], 1 - 2*q[1]*q[1] - 2*q[2]*q[2])*(180/Math.PI);
  heading = 180-heading;
  heading = Math.round(heading);
  data.inerciales.heading = heading;
  rotate();
  
});
sensor.start();

/* Acelerometro */
let accelerometer = new Accelerometer();
accelerometer.addEventListener('reading', function(e) {
    const acell = Math.abs(Math.sqrt(e.target.x**2 + e.target.y**2 + e.target.z**2) - 9.8);
    data.inerciales.accel = acell;
});
accelerometer.start();

// GPS
// NOTA: debe estar activada la posicion
if (navigator && navigator.geolocation) {
    // una vez por segundo consultar la ubicacion
     (function my_func() {
        navigator.geolocation.getCurrentPosition(gpsCallback, errorCallback);
        setTimeout( my_func, 1000 );
    })();
}
else {
    log('Geolocation no soportada');
}
function errorCallback() {}
function gpsCallback(position) {
    data.gps.latitude = position.coords.latitude;
    data.gps.longitude = position.coords.longitude;
}

// ---- Web sockets contra el backend ----
let socket = io();
socket.on("connect", function() {
    socket_connected = true;
    socket.on('luz_1', function (msg) {
        const val = Number(msg);
        data.luz = val;
        light.style.opacity = val;
        slight.checked = val;
    });
    socket.on('volar', function (msg) {
        const val = Number(msg);
        sengine.checked = val;
        updateEngineState(val);
        update();
    });
    socket.on('motor_1', function (msg) {
        // Si el está activado el vuelo
        // permito actualizar el estado del motor
        if(data.volar == true) {
            const val = Number(msg);
            data.motores[0] = val;
            update();
        }
    });
    socket.on('motor_2', function (msg) {
        // Si el está activado el vuelo
        // permito actualizar el estado del motor
        if(data.volar == true) {
            const val = Number(msg);
            data.motores[1] = val;
            update();
        }
    });
    socket.on('motor_3', function (msg) {
        // Si el está activado el vuelo
        // permito actualizar el estado del motor
        if(data.volar == true) {
            const val = Number(msg);
            data.motores[2] = val;
            update();
        }
    });
    socket.on('motor_4', function (msg) {
        // Si el está activado el vuelo
        // permito actualizar el estado del motor
        if(data.volar == true) {
            const val = Number(msg);
            data.motores[3] = val;
            update();
        }
    });
    socket.on('joystick', function (msg) {        
        const joystick = JSON.parse(msg);
        data.joystick = joystick;
        rotate();
    });
});


(function my_func() {
    if (socket_connected == true){
        socket.emit("sensores_event", data);
    }
    setTimeout( my_func, 500 );
})();
