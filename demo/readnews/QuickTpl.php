<?php
	class QuickTpl {
		var $filename;	//模板文件
		var $content;	//返回内容
		var $coding;	//字符编码
		var $warning;	//警告级别
		var $defpath;	//默认路径

		//用于验证
		var $codingENUM=array("gb2312"=>"default","utf-8"=>"");

		//初始化模板文件，将所有内容读入
		function QuickTpl($tplfilename="") {
			if($tplfilename!="")
				$this->SetTplFile($tplfilename);
		}

		function setTpl($filename) {
			if(is_file($this->defpath.$filename)) {
				$this->filename=$this->defpath.$filename;
				$h=fopen($this->filename,"r");
				$this->content=fread($h,filesize($this->filename));
				fclose($h);
			}
			else
				trigger_error("模板文件{$filename}不存在", E_USER_ERROR);
		}

		function setTplPath($path) {
			$this->defpath=$path;
		}
		
		function str_cn_replace($pattern,$replacement,$subject) {
			$pattern = urlencode($pattern);
			$replacement = urlencode($replacement);
			$subject = urlencode($subject);
			$tmpstr = str_replace($pattern,$replacement,$subject);
			return urldecode($tmpstr);
		}

		//替换标志位内容
		function ass($key,$value) {
			$this->content=str_replace("{".$key."}",$value,$this->content);
		}

		//用数组替换
		function arrayAssign($array) {
			while(list($key,$value)=each($array)) {
				if(is_array($value))
					$this->BlockAssign($key,$value);
				else
					$this->Assign($key,$value);
			}
		}

		function clrBlock($key) {
			$this->content=str_replace("{".$key."}","",$this->content);
			$this->content=str_replace("{/".$key."}","",$this->content);
		}
		
		//替换标志块内容
		function assBlock($block_name,$values,$errmsg="") {	
			if(is_array($values)) {	
				//获得替换块的子模板
				ereg("{".$block_name."}.*{/".$block_name."}",$this->content,$regs);
				$str_block=substr($regs[0],2+strlen($block_name),-(strlen($block_name)+3));
				
				$str_replace="";
				$block_replace="";

				if(is_array($values)) {
					foreach($values as $value) {
						$str_replace=$str_block;
						while (list( $key, $val ) = each( $value )) {
							$str_replace=str_replace("{".$key."}",$val,$str_replace);
						}
						$block_replace.=$str_replace;
					}
					$this->content=ereg_replace ("{".$block_name."}.*{/".$block_name."}",$block_replace,$this->content);
				}
				else
					$this->content=ereg_replace ("{".$block_name."}.*{/".$block_name."}",$errmsg,$this->content);
			}
			else
				$this->content=ereg_replace ("{".$block_name."}.*{/".$block_name."}",$errmsg,$this->content);
		}

		//设置字符编码
		function setCoding($coding) {
			if(array_key_exists($coding,$this->codingENUM))
				$this->coding=$coding;
			else
				trigger_error("设定的编码不存在", E_USER_ERROR);
		}
	}
?>