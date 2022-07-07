# Ejercicios de clase

Logearse desde VM y obtener cual es la dirección IP del dispositivo:
```sh
$ ifconfig
```

- Abrir el Visual Studio Code y conectarse de forma remota al dispositivo
- Instalar al debugger de python

Crear un script de python desde el VSC que contenga el siguiente código:
```python
print("Hola mundo desde un dispositivo")

# Código creado para obtener la IP del dispositivo
import platform
plataforma = platform.system()
print("La platafroma del dispositivo es:", plataforma)
```

Copiar el mensaje de salida de la consola en el campus notificando que han podido ejecutar todo correctamente, es decir:
- Fueron capaces de instalar su VM
- Fueron capaces de conectarse remotamnete desde Visual Studio Code
- Fueron capaces de crear un script de python con el contenido solicitado
- Fueron capaces de lanzalo correctamente