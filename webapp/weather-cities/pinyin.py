# -*- coding: UTF-8 -*-
from xpinyin import Pinyin
import MySQLdb as mdb

p = Pinyin();

city = "上海";
print city;
print p.get_pinyin(city.decode("utf-8"), '');

conn = mdb.connect('localhost', 'root', 'root', 'shenglong-electricv');
cursor = conn.cursor();
cursor.execute("SET NAMES utf8");
cursor.execute("SET CHARACTER_SET_CLIENT=utf8");
cursor.execute("SET CHARACTER_SET_RESULTS=utf8");
sql = "truncate table weather_citys";
cursor.execute(sql);
cityCode = "";
cityName = "北京";
spellName = p.get_pinyin(cityName.decode("utf-8"), '');
date = 1;
bz = 1;
sql = "insert into weather_citys(cityCode,cityName,spellName,date,bz) values ('%s','%s','%s','%s','%s')" % (cityCode,cityName,spellName.encode("utf-8"),date,bz);
print sql;
cursor.execute(sql);
conn.commit();

cursor.close();
conn.close();