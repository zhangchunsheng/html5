-- 2013-12-11
CREATE TABLE weather_citys(
	id INT(10) NOT NULL AUTO_INCREMENT,
	cityCode VARCHAR(60) NOT NULL DEFAULT '' COMMENT 'cityCode',
	cityName VARCHAR(60) NOT NULL DEFAULT '' COMMENT 'cityName',
	spellName VARCHAR(60) NOT NULL DEFAULT '' COMMENT 'spellName',
	`date` INT(10) NOT NULL DEFAULT 0 COMMENT '日期',
	bz INT(10) NOT NULL DEFAULT 0 COMMENT '1 - 可用 2 - 不可用',
	PRIMARY KEY(id)
);
SELECT * FROM weather_citys;
TRUNCATE TABLE weather_citys;
SELECT * FROM writers;
UPDATE writers SET NAME='Guy de Maupasant' WHERE id='4';-- Emile Zola
UPDATE writers SET NAME = 'Guy de Maupasant' WHERE id = '4';
UPDATE writers SET NAME='Guy de Maupasant' WHERE id=4;

CREATE TABLE images(
	id INT PRIMARY KEY AUTO_INCREMENT,
	`data` MEDIUMBLOB
);
SELECT * FROM images;