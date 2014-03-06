@echo off
if "%1"=="sayHello" (
	python cities.py sayHello
) else if "%1"=="test" (
	python cities.py test
) else if "%1"=="insertData" (
	python cities.py insertData
) else if "%1"=="export" (
	python cities.py export
) else if "%1"=="help" (
	echo cities command:
	echo cities sayHello
	echo usable command:
	echo     sayHello
	echo     test
	echo     insertData
	echo     export
) else (
	echo wrong command
)