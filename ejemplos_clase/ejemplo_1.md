# Ejemplos de clase

Crear una carpeta nueva dentro de /home/inove donde alojaremos todos los repositorios que utilizacemos:
```sh
$ mkdir repos
```

Ingresar a la carpeta creada:
```sh
$ cd repos
```

A modo de práctica crearemos un script para descargar el repositorio de clase con el programa "nano":
```sh
$ nano descargar_repo_1.sh
```

Dentro del editor colocar la siguiente línea:
```sh
git clone https://github.com/InoveAlumnos/intro_iot_python.git
```

Cerrar el editor presionando "CTRL + X", seguido confirmar con "Y" que deseamos almacenar los cambios y presionar "enter".

Verificar que el archivo exista observando los archivos existentens dentro de la carpeta:
```sh
$ ls -l
```

Si el archivo existe, observar su contenido para verificar que este correctamente generado:
```sh
$ cat descargar_repo_1.sh
```

Si el archivo tiene el contenido deseado, debemos cambiar sus permisos para poder ejecutarlo (dar permisos de ejecución):
```sh
$ sudo chmod +x descargar_repo_1.sh
```

Verificar que los permisos se hayan modificado:
```sh
$ ls -l
```

Lanzar el script para descargar el repositorio:
```sh
$ ./descargar_repo_1.sh
```