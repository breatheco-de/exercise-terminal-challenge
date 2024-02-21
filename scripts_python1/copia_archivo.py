from datetime import datetime
fecha_actual = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

with open('/workspaces/exercise-terminal-challenge/practica_terminal/test.txt', "a") as archivo:
	archivo.write(f'Tarea finalizacion a las {fecha_actual}')
