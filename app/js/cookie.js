
var cookie=(function(){
	// cookie('a') -> cookie a attr value
	// cookie('a',123) will set cookie a attr value to 123
	if (document.cookie.length===0){
		document.cookie=JSON.stringify({});
	}
	
	var dict=JSON.parse(document.cookie || '{}');
	
	function attr(attr,value){
		if(attr){
			if(value){
				dict[attr]=value;
				document.cookie=JSON.stringify(dict);
			}
			else{
				
				return dict[attr];
			}
		}
		else{
			return dict;
		}
	}
	
	function clear(){
		dict={};
		document.cookie=JSON.stringify(dict);
	}
	
	return {attr:attr,clear:clear};
})();