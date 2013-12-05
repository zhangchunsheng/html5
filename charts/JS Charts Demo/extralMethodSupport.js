  
function sliceDate(data,count,type,width){	    
	var re=[],interval=data[1]-data[0],labelWidth=[35,35,45,35,25];
	var len=data.length,mul=1.5,all=data[len-1]-data[0]; 
	var remainFirst = function(){
		var detal = re[1][0] - re[0][0];
		if (re[0][0] != data[0] && (re[0][0] - data[0]) > 0.5 * detal) {
			re.splice(0, 0, [data[0], ""]);
		}
		if (re[re.length - 1][0] != data[len - 1] && (data[len - 1] - re[re.length - 1][0]) > 0.5 * detal) {
			re.push([data[len - 1], ""]);
		}
	};
	var useDay = function(){
			var result = len * mul * labelWidth[0] <= width;
			if (result) {// right size is day
				var marker = null;
				for (var i = 0; i < len; i++) {
					var tstring = (new Date(data[i])).toDateString();
					var mstring = tstring.substring(4, 7),daystring=tstring.match(/\s\d{1,2}\s/g)[0].replace(/^\s0+/g,"");	 
					if (i == 0) {
						re.push([data[i],mstring+" "+daystring]);
						marker = mstring;
					}
					else {
						if (mstring == marker) {
							re.push([data[i],daystring]);
						}
						else {
							marker = mstring;
							re.push([data[i],mstring+" "+daystring]);
						}
					}
					tstring = mstring = null;
				}
				marker = null;
				return true;				
			}
			return false;		
	};
	var useWeek = function(){
		var j = 0;
		while ((new Date(data[j])).getDay() != 1) {
			j++;
		}
		var count = Math.floor(all / (7*24*3600000));
		var wcount =null;
		var test = mul * labelWidth[1];
		var check = function(){
			var res=count * test; 
			if (res <= width) {
				wcount = 1;
				return;
			}
/*
			if (res / 2 <= width) {
				wcount = 2;
				return;
			}
			if (res / 3 <= width) {
				wcount = 3;
				return;
			}
*/
		};
		check();
		if (wcount != null) {
			if(j!=0){
			re.push([data[0],""]);	
			}			
			for (var i = j; i < len; i += 5 * wcount) {
				var index=i,tstring,mstring,daystring;				
				if (i == j) {
					tstring = (new Date(data[i])).toDateString();
					mstring = tstring.substring(4, 7);
					daystring=tstring.match(/\s\d{1,2}\s/g)[0].replace(/^\s0+/g,"");				
					re.push([data[i], mstring+" "+daystring]);
				}else{					
					if((new Date(data[index])).getDay()!=1){
						for(var k=i;k<=i+2;k++){
							if((new Date(data[k])).getDay()==1){
								index=k;
								break;
							}
						}
					}
					tstring = (new Date(data[index])).toDateString();
				    mstring = tstring.substring(4, 7);
					daystring=tstring.match(/\s\d{1,2}\s/g)[0].replace(/^\s0+/g,"");
					re.push([data[index], mstring+" "+daystring]);
					i=index;	
				}
			}
			return true;
		}
		return false;
	};
	var useMonth = function(){
		var j = 0;
		while ((new Date(data[j])).getDate() != 1) {
			j++;
		}
		var count = Math.floor(all / (30*24*3600000));
		var mcount = null;
		var test = count * mul * labelWidth[2];
        if (test <= width) {
			mcount = 1;
		} 
		if (mcount != null) {
			if (j != 0) {
				re.push([data[0], ""]);
			}	
			for (var i = j; i < len; i += 30 * mcount) {
				var index=i;							
				if (i == j) {
					var dstring=(new Date(data[i])).toDateString();	
					re.push([data[i], dstring.substring(4, 7)+dstring.match(/\s\d{4}$/g)])[0];
				}
				else {					
					if ((new Date(data[i])).getDate() != 1) {
						for (var k = i - 3; k <= i + 3; k++) {
							if ((new Date(data[k])).getDate() == 1) {
								index = k;
								break;
							}
						}
					} 
					var dstring=(new Date(data[index])).toDateString();	
					re.push([data[index],dstring.substring(4, 7)+dstring.match(/\s\d{4}$/g)[0]]);
					i=index;	
				}				
				
			}
			return true;
		}
		return false;	
	};
	var useQuarter=function(){
		var yearCount=Math.round(all/(365*24*3600000));
		var qcount=yearCount*4,test= qcount* mul * labelWidth[3]<=width;
		if (test) {				 	
			for (var j = 0; j < len; j++) {
				var tq = new Date(data[j]), qm = tq.getMonth() + 1, qd = tq.getDate();
				var testq = qm + "." + qd,qdstring=tq.toDateString();			 
				if (testq == "1.1" || testq == "4.1" || testq == "7.1" || testq == "10.1") {
					re.push([data[j],qdstring.substring(4,7)+"'"+qdstring.match(/\d{2}$/g)[0]]);
				}
			}		
			return true;
		}
		return false;
	};
	var useYear = function(){
		var yearCount=Math.round(all/(365*24*3600000));
		var yc=null;
		var check=function(){
			var yeartest=yearCount* mul * labelWidth[4];
			if(yeartest<=width){
				yc=1;return;
			}
			if(yeartest/3<=width){
				yc=3;return;
			}
			if(yeartest/10<=width){
				yc=10;return;
			}
			if(yeartest/50<=width){
				yc=50;return;
			}									
		};
		check(); 
		if (yc!=null) {				 	
			for (var j = 0; j < len; j += yc * 365) {
				var  yearstring=(new Date(data[j])).toDateString();
				re.push([data[j], yearstring.match(/\s\d{4}$/g)[0]]);				
			}		
			return true;
		}
		return false;			
	};						
	if (type == "dateTime") {
		if (interval < 24 * 3600000) {
			/*console.log(24 * 3600000);
			console.log(data[1]-data[0]);
			console.log(data[2]-data[1]);
			console.log(data[3]-data[2]);
			console.log(data[4]-data[3]);
			console.log(data[5]-data[4]);*/
		return re;	
		}
		else {
			if(useDay()){
			 	remainFirst();
				return re;
			}
			if(useWeek()){
			remainFirst();
				return re;
			}
			if(useMonth()){
			remainFirst();
				return re;
			}
			if(useQuarter()){
			remainFirst();
				return re;
			}
			if(useYear()){
			remainFirst();
				return re;
			}
			return re;									
		}
	}
	
}
function numberFormat(label,decimalNum){ 
	label=parseFloat(label);
	if(typeof(decimalNum)!="number"){
	 decimalNum=0;
	}				 
	label=label.toFixed(decimalNum);
	var tester=parseFloat(label);									
	if(tester>=10000&&tester<1000000){				
	  label=(tester/1000).toFixed(decimalNum)+"K";
	}
	if(tester>=1000000&&tester<1000000000){				
	  label=(tester/1000000).toFixed(decimalNum)+"M";
	}
	if(tester>=1000000000){				
	  label=(tester/1000000000).toFixed(decimalNum)+"B";
	}								
	return label;
}