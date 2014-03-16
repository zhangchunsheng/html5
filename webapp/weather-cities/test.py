# -*- coding: UTF-8 -*-
# www.crazyant.net
import MySQLdb as mdb
import sys
import os
import stat
import time
import fnmatch
import re
import glob
import pickle
import cPickle
import StringIO
import cStringIO
import fileinput;

#将conn设定为全局连接
conn = mdb.connect('localhost', 'root', 'root', 'shenglong-electricv');

def insert():
	with conn:
		#获取连接的cursor，只有获取了cursor，我们才能进行各种操作
		cur = conn.cursor();
		
		#创建一个数据表 writers(id,name)
		cur.execute("create table if not exists \
			writers(id int primary key auto_increment, name varchar(25))");
		
		#以下插入了5条数据
		cur.execute("insert into writers(name) values ('Jack London')");
		cur.execute("insert into writers(name) values ('Honore de Balzac')");
		cur.execute("insert into writers(name) values ('Lion Feuchtwanger')");
		cur.execute("insert into writers(name) values ('Emile Zola')");
		cur.execute("insert into writers(name) values ('Truman Capote')");

def get():
	with conn:
		cur = conn.cursor();
		#类似于其他语言的query函数，execute是python中的执行查询函数
		cur.execute("select * from writers");
		
		#使用fetchall函数，将结果集(多维元祖)存入rows里面
		rows = cur.fetchall();
		
		#依次遍历结果集，发现每个元素，就是表中的一条记录，用一个元祖来显示
		for row in rows:
			print row;
			
def getOne():
	# 获取执行查询的对象
	cur = conn.cursor();
	
	# 执行查询，这里用的是select语句
	cur.execute("select * from writers");
	
	# 使用cur.rowcount获取结果集的条数
	numrows = int(cur.rowcount);
	
	#循环numrows次，每次取出一行数据
	for i in range(numrows):
		#每次取出一行，放到row中，这是一个元祖(id,name)
		row = cur.fetchone();
		
		#直接输出两个元素
		print row[0], row[1];
	
'''
使用字典cursor取得结果集(可以使用表字段名字访问值)
'''
def getWithColumnName():
	#每一个cursor其实都是cursor的子类
	cur = conn.cursor(mdb.cursors.DictCursor);
	
	#执行语句不变
	cur.execute("select * from writers");
	
	#获取数据方法不变
	rows = cur.fetchall();
	
	#遍历数据也不变(比上一个更直接一点)
	for row in rows:
		#这里可以使用键值对的方法，有键名字来获取数据
		print "%s %s" % (row["id"], row["name"]);
	
'''
获取单个表的字段名和信息的方法
'''	
def getTableInfo(info):
	print info;
	#获取普通的查询cursor
	cur = conn.cursor();
	cur.execute("select * from writers");
	
	rows = cur.fetchall();
	
	#获取连接对象的描述信息
	desc = cur.description;
	print 'cur.description', desc;
	
	#打印表头，就是字段名字
	print "%s %3s" % (desc[0][0], desc[1][0]);
	
	for row in rows:
		#打印结果
		print "%2s %3s" % row;
	
'''
使用Prepared statements执行查询(更安全方便)
'''
def update():
	cur = conn.cursor();
	
	#我们可以看到，这里通过写一个组装的sql语句来进行
	#cur.execute("update writers set name = %s where id = %s",
	#	("Guy de Maupasant", "4"));
	#cur.execute("truncate writers");
	cur.execute("update writers set name='Guy de Maupasant' where id=4");
	conn.commit();
	print "update writers set name = '%s' where id = '%s'" % \
		("Guy de Maupasant", "4");
	print "update writers set name='Guy de Maupasant' where id=4";
		
	#使用cur.rowcount获取影响了多少行
	print "Number of rows updated: %d" % cur.rowcount;
	
'''
把图片用二进制存入mysql
'''
def insertImage():
	try:
		#用读文件模式打开图片
		fin = open("a0.jpg");
		
		#将文本读入img对象中
		img = fin.read();
		
		#关闭文件
		fin.close();
		
	except IOError, e:
		#如果出错，打印错误信息
		print "Error %d: %s" % (e.args[0], e.args[1]);
		sys.exit(1);
	
	try:
		#链接mysql，获取对象
		con = mdb.connect(host='localhost',user='root',passwd='root',db='shenglong-electricv');
		
		#获取执行cursor
		cursor = con.cursor();
		
		#直接将数据作为字符串，插入数据库
		cursor.execute("truncate images");
		cursor.execute("insert into images set data='%s'" % mdb.escape_string(img));
		
		#提交数据
		con.commit();
		
		#提交之后，再关闭cursor和链接
		cursor.close();
		con.close();
	except mdb.Error, e:
		#若出现异常，打印信息
		print "Error %d: %s" % (e.args[0], e.args[1]);
		sys.exit(1);
		
'''
从数据库中把图片读出来
'''
def getImage():
	try:
		#连接mysql，获取连接的对象
		con = mdb.connect(host='localhost',user='root',passwd='root',db='shenglong-electricv');
		
		cursor = con.cursor();
		
		#执行查询该图片字段的SQL
		cursor.execute("select data from images limit 1");
		
		#使用二进制写文件的方法，打开一个图片文件，若不存在则自动创建
		fout = open('image.png', 'wb');
		#写文件
		fout.write(cursor.fetchone()[0]);
		#关闭写入的文件
		fout.close();
		
		#释放查询数据的资源
		cursor.close();
		con.close();
	
	except IOError, e:
		#捕获IO的异常
		print "Error %d: %s" % (e.args[0], e.args[1]);
		sys.exit(1);
		
'''
使用Transaction即事务(手动提交，自动回滚)
'''
def transaction():
	try:
		#连接mysql，获取连接的对象
		con = mdb.connect('localhost', 'root', 'root', 'shenglong-electricv');
		
		cursor = con.cursor();
		#如果某个数据库支持事务，会自动开启
		#这里用的是mysql，所以会自动开启事务
		cursor.execute("update writers set name=%s where id=%s",("Leo Tolstoy", "1"));
		cursor.execute("update writers set name=%s where id=%s",("Boris Pasternak", "2"));
		cursor.execute("update writer set name=%s where id=%s",("Leonid Leonov", "3"));
		
		#事务的特性1、原子性的手动提交
		con.commit();
		
		cursor.close();
	except mdb.Error, e:
		#如果出现了错误，那么可以回滚，就是上面的三条语句要么执行，要么都不执行
		con.rollback();
		print "Error %d: %s" % (e.args[0], e.args[1]);
			
'''
read fileInfo
'''
def readFile():
	fileName = "weathercity.code.txt";
	fileStats = os.stat(fileName);
	fileInfo = {
		'size': fileStats[stat.ST_SIZE],
		'lastModified': time.ctime(fileStats[stat.ST_MTIME]),
		'lastAccessed': time.ctime(fileStats[stat.ST_ATIME]),
		'createTime': time.ctime(fileStats[stat.ST_CTIME]),
		'mode': fileStats[stat.ST_MODE]
	}
	#fileInfo.items()
	#fileInfo.iteritems()
	#fileInfo.itervalues()
	for infoField,infoValue in fileInfo.items():
		print infoField,':',infoValue;
	
	if stat.S_ISDIR(fileStats[stat.ST_MODE]):
		print 'Directory.';
	else:
		print 'Non-directory.';
	
	fileMode = fileStats[stat.ST_MODE];
	if(stat.S_ISREG(fileStats[stat.ST_MODE])):
		print 'regular file';
	elif(stat.S_ISDIR(fileStats[stat.ST_MODE])):
		print 'directory';
	elif(stat.S_ISLINK(fileStats[stat.ST_MODE])):
		print 'shortcut';
	elif(stat.S_ISSOCK(fileStats[stat.ST_MODE])):
		print 'socket';
	elif(stat.S_ISFIFO(fileStats[stat.ST_MODE])):
		print 'named pipe';
	elif(stat.S_ISBLK(fileStats[stat.ST_MODE])):
		print 'block special device';
	elif(stat.S_ISCHR(fileStats[stat.ST_MODE])):
		print 'Character special device';
		
	if(os.path.isdir(fileName)):
		print 'directory';
	elif(os.path.isfile(fileName)):
		print 'file';
	elif(os.path.islink(fileName)):
		print 'shortcut';
	elif(os.path.ismount(fileName)):
		print 'mount point';
		
	#目录
	for fileName in os.listdir('/'):
		print fileName;
	
	os.mkdir("test");
	os.rmdir("test");
	
	os.makedirs('I/will/do/it');
	os.removedirs('I/will/do/it');
	
	# 匹配
	for fileName in os.listdir("/"):
		if(fnmatch.fnmatch(fileName, "*.txt")):# * ?
			print fileName;
			print open("/"+fileName, "r").readline();
		elif fnmatch.fnmatch(fileName, "*.exe"):
			print fileName;
	
	for fileName in os.listdir('/'):
		if(fnmatch.fnmatch(fileName, "?.txt")):
			print 'text file';
			
	# 正则表达式
	filePattern = fnmatch.translate("*.txt");
	for fileName in os.listdir("/"):
		if re.match(filePattern, fileName):
			print 'text file';
			
	# 匹配一种类型的文件
	for fileName in glob.glob("*.txt"):
		print 'text file';
		
	for fileName in glob.glob("[0-9].txt"):
		print fileName;
		
	# 数据编组
	file = open("test.txt", "w");
	testList = ['This', 2, 'is', 1, 'a', 0, 'test.'];
	pickle.dump(testList, file);
	file.close();
	
	file = open("test.txt");
	testList = pickle.load(file);
	file.close();
	
	file = open("test.txt", "w");
	testList = [123, {'Calories': 190}, 'Mr. Anderson', [1, 2, 7]];
	pickle.dump(testList, file);
	file.close();
	
	file = open("test.txt");
	testList = pickle.load(file);
	print testList;
	file.close();
	
	file = open("test.txt", "w");
	cPickle.dump(1776, file);
	file.close();
	
	file = StringIO.StringIO("Let freedom ring");
	print file.read();# "Let freedom ring."
	file.close();
	
	file = cStringIO.StringIO("To kill a mockingbird");
	print file.read();# "To kill a mockingbird"
	file.close();
	
	file = open("citys.txt");
	
	print file.read();
	print file.readline();
	
	fileList = file.readlines();
	for fileLine in fileList:
		print '>>', fileLine;
	
	print file.readline();
	file.seek(0);
	print file.readline();
	print file.tell();
	print file.read(10);
	file.seek(1);
	print file.read(1);
		
	line = file.readline();
	while line:
		print line;
		line = file.readline();
	
	while 1:
		line = file.readline();
		if not line:
			break;
		print line;
	
	for line in fileinput.input("citys.txt"):
		print line;
	
	while 1:
		lines = file.readlines(100000);
		if not lines:
			break;
		for line in lines:
			print line;
	
	for line in file.xreadlines():
		print line;
	
	file.close();
	
if __name__ == "__main__":
	methodName = sys.argv[1];
	if(methodName == "insert"):
		insert();
	elif(methodName == "get"):
		get();
	elif(methodName == "getOne"):
		getOne();
	elif(methodName == "getWithColumnName"):
		getWithColumnName();
	elif(methodName == "getTableInfo"):
		getTableInfo("test");
	elif(methodName == "update"):
		update();
	elif(methodName == "insertImage"):
		insertImage();
	elif(methodName == "getImage"):
		getImage();
	elif(methodName == "transaction"):
		transaction();
	elif(methodName == "readFile"):
		readFile();