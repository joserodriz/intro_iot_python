# Ejemplos de clase

Logearse desde VM y obtener cual es la dirección IP del dispositivo:
```sh
$ ifconfig
```

- Abrir el Visual Studio Code y conectarse de forma remota al dispositivo
- Instalar al debugger de python

Crear un script de python "hola_iot.py" desde el VSC. Lanzar y debuggear el script desde el VSC con el siguiente contenido:

```python
print("Hola mundo desde un dispositivo")

# Código creado para probar el debbuger
nombre = input("Ingrese su nombre: ")
print(f"¡Bienvenido {nombre}!")
```

Ya probado el script, lanzarlo tambien desde la terminal que nos quedó abierta por ssh, usando directamente el comando de python:
```sh
$ python3 hola_iot.py
```
