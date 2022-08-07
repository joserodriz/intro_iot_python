'''
Inove Drone Mock Python IoT
---------------------------
Autor: Inove Coding School
Version: 1.0
 
Descripcion:
Se utiliza Flask para crear un generador de datos
de telemetría simulando un Drone:
- Motores
- Luz ON/OFF
- Acelerómetro
- Giróscopo
- GPS

Ejecución: Lanzar el programa y abrir en un navegador
la siguiente dirección URL

NOTA: No olvide usar HTTPS en la URL:

https://IP:5010/
'''

__author__ = "Inove Coding School"
__email__ = "alumnos@inove.com.ar"
__version__ = "1.0"

import traceback
import json

from flask import Flask, request, jsonify, render_template, redirect
from flask_socketio import SocketIO
from flask_socketio import send, emit

from dotenv import dotenv_values
config = dotenv_values()

app = Flask(__name__)
app.secret_key = 'ptSecret'
app.config['SECRET_KEY'] = 'ptSecret'
socketio = SocketIO(app, async_mode="eventlet")

# En caso de que los mensajes desde el celular no lleguen al servidor
# insalar eventlet:
# pip3 install eventlet==0.33.1

# ---- MQTT ----
import paho.mqtt.client as mqtt
client = mqtt.Client()
client.username_pw_set(config["DASHBOARD_MQTT_USER"], config["DASHBOARD_MQTT_PASSWORD"])
topic_base = config["DASHBOARD_TOPICO_BASE"]

def on_connect(client, userdata, flags, rc):
    print(f"MQTT Conectado a {topic_base}")
    client.subscribe(topic_base + "actuadores/volar")
    client.subscribe(topic_base + "actuadores/luces/#")
    client.subscribe(topic_base + "actuadores/motores/#")
    client.subscribe(topic_base + "actuadores/joystick")

def mqtt_connect():
    if client.is_connected() is False:
        try:
            client.connect(config["DASHBOARD_MQTT_BROKER"], int(config["DASHBOARD_MQTT_PORT"]), 10)
            print("Conectado al servidor MQTT")
            client.loop_start()
        except:
            print("No pudo conectarse")


def on_message(client, userdata, msg):
    topic = str(msg.topic)
    value = str(msg.payload.decode("utf-8"))
    if topic == topic_base + "actuadores/volar":
        socketio.emit('volar', int(value))
    
    # NOTA: Podría mejorarse el manejo del ID
    # utilizando regular expression (re)
    # Se deja de esta manera para que se vea
    # facil para el alumno
    if topic == topic_base + "actuadores/luces/1":
        socketio.emit('luz_1', int(value))
    if topic == topic_base + "actuadores/motores/1":
        socketio.emit('motor_1', int(value))
    if topic == topic_base + "actuadores/motores/2":
        socketio.emit('motor_2', int(value))
    if topic == topic_base + "actuadores/motores/3":
        socketio.emit('motor_3', int(value))
    if topic == topic_base + "actuadores/motores/4":
        socketio.emit('motor_4', int(value))

    if topic == topic_base + "actuadores/joystick":
        socketio.emit('joystick', value)


# ---- Endpoints ----
@app.route('/')
def home():
    mqtt_connect()
    return render_template('index.html')


@app.route('/luces/1/<val>')
def light(val):
    socketio.emit('luz_1', int(val))
    return f"luz: {val}"

# ---- Web sockets contra el frontend ----
@socketio.on('connect')
def test_connect(auth):
    session_id = request.sid
    print('Client connected', session_id)


@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')


@socketio.on('sensores_event')
def ws_sensores_event(data):
    client.publish(topic_base + "sensores/inerciales", json.dumps(data["inerciales"]))
    client.publish(topic_base + "sensores/gps", json.dumps(data["gps"]))


@socketio.on('luz_event')
def ws_luz_event(data):
    print("---------- LUZ EVENT ---------------")
    # data --> estado de la luz_1 (0 o 1), pasar a int
    client.publish(topic_base + "actuadores/luces/1", int(data))


@socketio.on('volar_event')
def ws_volar_event(data):
    print("---------- VOLAR EVENT ---------------")
    # data --> estado de la volar (0 o 1), pasar a int
    client.publish(topic_base + "actuadores/volar", int(data))


@socketio.on('motores_event')
def ws_motores_event(data):
    print("---------- MOTORES EVENT ---------------")
    # data --> lista de estado de los motores, pasar a int c/u
    for i in range(4):
        client.publish(topic_base + f"actuadores/motores/{i+1}", int(data[i]))


if __name__ == "__main__":
    client.on_connect = on_connect
    client.on_message = on_message
    # Certificados SSL:
    # https://blog.miguelgrinberg.com/post/running-your-flask-application-over-https
    app.run(debug=True, host="0.0.0.0", port=5010, ssl_context='adhoc')
