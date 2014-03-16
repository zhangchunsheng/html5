<?php
	header("content-type:text/html;charset=utf-8");
	include("QuickTpl.php");
	$url = "";
	if(array_key_exists("url", $_POST)) {
		$url = $_POST["url"];
	}
	$template = new QuickTpl();
	$template -> setCoding("utf-8");
	$template -> setTpl("read_msn.html");
	if($url == "") {
		echo $template -> content;
	} else {
		echo $template -> content;
		println(getTitle($url));
		println("");
		println("链接：" . $url);
		$num = getPageNum($url);
		getContentByJavascript($url, $num);
	}
	
	function getTitle($url) {
		$array = file($url);
		foreach($array as $key => $value) {
			if(strpos($value, "navbox")) {
				$div_html = html_separator($value, "</div>");
				foreach($div_html as $html_key => $html_value) {
					if(strpos($html_value, "navbox")) {
						$li_position = getPosition($html_value, "<li>", "last");
						$li_endPosition = getPosition($html_value, "</li>", "last");
						$title = substr($html_value, $li_position + 4, $li_endPosition - $li_position);
						return $title;
					}
				}
			}
		}
	}
	
	function getPageNum($url) {
		$array = file($url);
		foreach($array as $key => $value) {
			if(strpos($value, "winarrownext")) {
				$div_html = html_separator($value, "</div>");
				foreach($div_html as $html_key => $html_value) {
					if(strpos($html_value, "ImageNum2")) {
						$font_position = getPosition($html_value, "<font");
						$num = substr($html_value, $font_position + 15, 1);
						return $num;
					}
				}
			}
		}
	}
	
	function getContentByHtml($url, $num) {
		$array = file($url);
		$title = "";
		foreach($array as $key => $value) {
			if(strpos($value, "ImageTitle2")) {
				$div_html = html_separator($value, "</div>");
				foreach($div_html as $html_key => $html_value) {
					if(strpos($html_value, "ImageTitle2")) {
						$image_position = getPosition($html_value, "ImageDesc");
						$p_endPosition = getPosition($html_value, "</p>");
						$title = substr($html_value, $image_position + 17, $p_endPosition);
					}
				}
			}
		}
		foreach($array as $key => $value) {
			if(strpos($value, "showpicbox")) {
				$div_html = html_separator($value, "</div>");
				foreach($div_html as $html_key => $html_value) {
					if(strpos($html_value, "showpicbox")) {
						$img_position = getPosition($html_value, "<img");
						$td_position = getPosition($html_value, "</td>");
						$img = substr($html_value, $img_position, $td_position - $img_position);
						echo $img;
						echo "<br />";
						echo $title;
						echo "<br />";
						break;
					}
				}
			}
		}
	}
	
	function getContentByJavascript($url, $num) {
		$html = file_get_contents($url);
		$content_position = getPosition($html, "$.MSNImageSlider.Images");
		$content_endPosition = getPosition($html, "$.MSNImageSlider.Index");
		$content = substr($html, $content_position, $content_endPosition - $content_position);
		$tag_position = getPosition($content, "[");
		$tag_endPosition = getPosition($content, "]");
		$content = substr($content, $tag_position + 1, $tag_endPosition - $tag_position - 1);
		$array = html_separator($content, "}");
		foreach($array as $key => $value) {
			if($tag_position = strpos($value, "{")) {
				$content = substr($value, $tag_position + 1);
				$content_array = html_separator($content, ",");
				foreach($content_array as $content_key => $content_html) {
					if(strpos($content_html, "src")) {
						$tag_position = getPosition($content_html, "'");
						$tag_endPosition = getPosition($content_html, "'", "last");
						$content = substr($content_html, $tag_position, $tag_endPosition - $tag_position + 1);
						echo "<img src=" . $content . "></img>";
						echo "<br />";
					}
					if(strpos($content_html, "text")) {
						$tag_position = getPosition($content_html, "'");
						$tag_endPosition = getPosition($content_html, "'", "last");
						$content = substr($content_html, $tag_position + 1, $tag_endPosition - $tag_position - 1);
						echo $content;
						echo "<br />";
					}
				}
			}
		}
	}
	
	function html_separator($html, $separator) {
		return explode($separator, $html);
	}
	
	function getPosition($html, $value, $where = "") {
		if($where == "" || $where == "first") {
			return strpos($html, $value);
		} else if($where == "last") {
			return strrpos($html, $value);
		} else {
			return $html;
		}
	}
	
	function println($content) {
		echo $content;
		echo "<br />";
	}
?>