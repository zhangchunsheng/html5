<?php

/**
 * 读取城市的天气
 * 4小时更新一次缓存文件
 */
error_reporting(~E_ALL);
require_once 'lib/class.XMLHttpRequest.php';

$pyName = isset($_POST['pyName']) ? $_POST['pyName'] : $_GET['pyName'];
$subpyName = isset($_POST['subpyName']) ? $_POST['subpyName'] : $_GET['subpyName'];
if(empty($subpyName))
	$subpyName = "";

if($pyName != '') {
	$quName = $subquName = '';
	if ($subpyName == '') {
		$xml_url = 'xml/code.xml';
		$doc = new DOMDocument();
		$doc->load($xml_url);
		$cityInfo = $doc->getElementsByTagName('city');
		
		$cityCode = '';
		if (!empty($cityInfo)) {
			foreach ($cityInfo as $xml) {
				if ($xml->getattribute('pyName') == $pyName) {
					$cityCode = $xml->getattribute('code');
					$quName = $xml->getattribute('quName');
					break;
				}
			}
		}
	} else {
		$cityCode = '';
		$cityArray = include 'data/citys_array.php';
		$currentCity = $cityArray[$pyName]['subCity'];
		$quName = $cityArray[$pyName]['cityName'];
		if (!empty($currentCity)) {
			foreach ($currentCity as $val) {
				if ($val['pyName'] == $subpyName) {
					$cityCode = $val['code'];
					$subquName = $val['zwName'];
					break;
				}
			}
		}
	}
		
	$arr = array('pyName' => $pyName, 'quName' => $quName, 'subpyName' => $subpyName, 'subquName' => $subquName);
	setcookie('cityjson', json_encode($arr), time()+3600); //1小时
	
	$exptime = 3600 * 4; //过期时间 4小时更新一次
    $weatherInfo = '';
    if (!empty($cityCode)) {
        
		$filedir = 'cache/';
		$file_path = $filedir . $cityCode. '.php';
		if (!is_dir($filedir)) {
			mkdir($filedir, 0777);
		}
		
		if (!file_exists($file_path)) {
			$fp = fopen($file_path, 'w+');
			$data = array('time' => time() + $exptime);
			fwrite($fp, "<?php\nreturn " . var_export($data, true) . ";\n?>");
			fclose($fp);
		}
		
		//将数据存入缓存
		$dataList = include $file_path;
		$time = time();
		$fileTime = $dataList['time'];
		if (($time - $fileTime) > $exptime || !isset($dataList['weatherinfo'])) {
			$cityurl = "http://m.weather.com.cn/data/{$cityCode}.html";
			
			if (extension_loaded('curl')) {
				$curl = new XMLHttpRequest();
				$curl->open('GET', $cityurl);
				$curl->send(null);
				$responseText = json_decode($curl->responsetext, true);
			} else {
				$result = file_get_contents($cityurl);
				$responseText = json_decode($result, true);
			}
			$dataList['weatherinfo'] = $responseText['weatherinfo'];
			file_put_contents($file_path, "<?php\nreturn " . var_export($dataList, true) . ";\n?>");
		}
		
		$weatherInfo = json_encode($dataList['weatherinfo']);
    }
	
    echo $weatherInfo;
    exit;
}
