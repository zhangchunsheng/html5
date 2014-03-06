@echo off
if "%1"=="insert" (
	python test.py insert
) else if "%1"=="get" (
	python test.py get
) else if "%1"=="getOne" (
	python test.py getOne
) else if "%1"=="getWithColumnName" (
	python test.py getWithColumnName
) else if "%1"=="getTableInfo" (
	python test.py getTableInfo
) else if "%1"=="update" (
	python test.py update
) else if "%1"=="insertImage" (
	python test.py insertImage
) else if "%1"=="getImage" (
	python test.py getImage
) else if "%1"=="transaction" (
	python test.py transaction
) else if "%1"=="readFile" (
	python test.py readFile
) else if "%1"=="help" (
	echo test command:
	echo test sayHello
	echo usable command:
	echo     insert
	echo     get
	echo     getOne
	echo     getWithColumnName
	echo     getTableInfo
	echo     update
	echo     insertImage
	echo     getImage
	echo     transaction
	echo     readFile
) else (
	echo wrong command
)