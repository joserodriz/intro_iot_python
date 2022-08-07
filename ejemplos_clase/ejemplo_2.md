# Ejemplos de clase

Mencionar que en la raiz del repo encontrará un archivo de "comandos_utiles" con los comandos básicos de linux que utilizaremos esta clase.

Logearse desde VM y obtener cual es la dirección IP del dispositivo:
```sh
$ ifconfig
```

Anotar la dirección de IP, conectarse por ssh desde una terminal del host
```
$ ssh inove@<ip_dispositivo>
```

Explorar la carpeta "home" y mostrar su interior. Mencionar que este es el espacio equivalente a "Mis Documentos" en Windows y será el lugar donde alojemos todos los recursos que usemos del curso.

Explorar la raiz del sistema operativo:
```sh
$ cd /
```

Mostrar su contenido y describir brevemente lo que encontramos allí:
```sh
$ ls -l
```

Mencionar que este es el espacio equivalente a "Disco C:" en Windows y será el lugar en donde se instalen los programas y librerías del sistema operativo (en "/usr/bin" los programas y en "/usr/lib" las librerías). Por ejemplo, el lanzador de python3 está en la carpeta bin:
```sh
$ ls -l /usr/bin/python
```

Parado en la carpeta raiz, volver a ingresar a la carpeta home:
```sh
$ ls home
```

Si deseamos conocer la ruta completa de donde nos encontramos parados, ejecutar:
```sh
$ pwd
```
