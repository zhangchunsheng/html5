# -*- coding: UTF-8 -*-
#安装MYSQL DB for python
import sys
import os
import MySQLdb as mdb
import datetime
import time
from xpinyin import Pinyin

conn = None;

def sayHello(argv=None):
	print sys.argv;
	print len(sys.argv);
	print sys.argv[:];
	
def test():
	try:
		#连接mysql方法: connect('ip','user','password','dbname')
		conn = mdb.connect('localhost', 'root', 'root', 'shenglong-electricv');
		
		#所有的查询，都在连接con的一个模块cursor上面运行的
		cur = conn.cursor();
		
		#执行一个查询
		cur.execute("select version()");
		
		#取得上个查询的结果，是单个结果
		data = cur.fetchone();
		print "Database verson : %s " % data
		
		# execute SQL select statement
		cur.execute("select * from weather_citys");
		# commit your changes
		conn.commit();
		
		# get the number of rows in the resultset
		numrows = int(cur.rowcount)
		
		# get and display one row at a time
		for x in range(0, numrows):
			row = cur.fetchone()
			print row
			
		cur.execute("select cityCode from weather_citys");
		for row in cur.fetchall():
			print row[0]
	finally:
		if conn:
			#无论如何，连接记得关闭
			conn.close();
	
#将conn设定为全局连接
conn = mdb.connect('localhost', 'root', 'root', 'shenglong-electricv');
def insertData():
	print "insertData";
	try:
		file = open("citys.txt", "r");# w a wb二进制
		
		cursor = conn.cursor();
		
		sql = "truncate table weather_citys";
		cursor.execute(sql);
		cursor.execute("SET NAMES utf8");
		cursor.execute("SET CHARACTER_SET_CLIENT=utf8");
		cursor.execute("SET CHARACTER_SET_RESULTS=utf8");
		conn.commit();
		
		fileList = file.readlines();
		p = Pinyin();
		date = int(time.mktime(datetime.datetime.now().timetuple()));
		bz = 1;
		for fileLine in fileList:
			cityInfo = fileLine.split("=");
			cityCode = cityInfo[0];
			cityName = cityInfo[1];
			spellName = p.get_pinyin(cityName.decode("utf-8"), '');
			sql = "insert into weather_citys(cityCode,cityName,spellName,date,bz) values ('%s','%s','%s','%s','%s')" % (cityCode,cityName,spellName.encode("utf-8"),date,bz);
			cursor.execute(sql);
			conn.commit();

		file.close();
		cursor.close();
		conn.close();
	except (mdb.Error, IOError), e:
		print "Error %d: %s" % (e.args[0], e.args[1]);
		sys.exit(1);
		
def export():
	print "export";
	try:
		file = open("citys.json", "w");# w a wb二进制
		
		cursor = conn.cursor();
			
		cursor.execute("SET NAMES utf8");
		cursor.execute("SET CHARACTER_SET_CLIENT=utf8");
		cursor.execute("SET CHARACTER_SET_RESULTS=utf8");
		sql = "SELECT cityCode,cityName,spellName FROM weather_citys";
		cursor.execute(sql);
		file.write("[{\n");
		i = 1;
		numrows = int(cursor.rowcount);
		info = "";
		for row in cursor.fetchall():
			cityCode = row[0];
			cityName = row[1];
			spellName = row[2];
			info = "\tcityCode:" + cityCode + ",\n";
			info += "\tcityName:" + cityName + ",\n";
			info += "\tspellName:" + spellName + "\n";
			if i < numrows:
				info += "}, {\n";
			i = i + 1;
			file.write(info);
			
		file.write("}]");
		file.close();	
		cursor.close();
		conn.close();
	except (mdb.Error, IOError), e:
		print "Error %d: %s" % (e.args[0], e.args[1]);
		sys.exit(1);

if __name__ == "__main__":
	methodName = sys.argv[1];
	if(methodName == "sayHello"):
		sayHello();
	elif(methodName == "test"):
		test();
	elif(methodName == "insertData"):
		insertData();
	elif(methodName == "export"):
		export();