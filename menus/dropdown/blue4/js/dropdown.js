$(document).ready(function(){
	$('ul.one').css({
		'visibility':'hidden',
		'height':'0px'
	});
	
	$('.nav > li').mouseover(function(){
		var mOver= $(this);
		var openMenu= $(this).children('ul.one');
		$(openMenu).css({
			'visibility':'visible',
			'height':'auto'
		});
	});
	
	$('.nav > li').mouseleave(function(){
		$('ul.one').css({
			'visibility':'hidden',
			'height':'0px'

		})
	});
	
	/*Start Open Sub Menu*/
	$('.one#menu li').mouseover(function(){
		var mOver= $(this);
		var openMenu= $(this).children('ul.one');
		
		if($(this).children('ul.one').length==1){
			$(openMenu).css({
			'visibility':'visible',
			'height':'auto'

			})
		}
		else{
			$('ul.one').css({
			'visibility':'hidden',
			'height':'0'

			})
		}
	});
	
	
});