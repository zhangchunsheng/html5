@echo off
if "%1"=="sayHello" (
	python citys.py sayHello
) else if "%1"=="test" (
	python citys.py test
) else if "%1"=="insertData" (
	python citys.py insertData
) else if "%1"=="export" (
	python citys.py export
) else if "%1"=="help" (
	echo citys command:
	echo citys sayHello
	echo usable command:
	echo     sayHello
	echo     test
	echo     insertData
	echo     export
) else (
	echo wrong command
)