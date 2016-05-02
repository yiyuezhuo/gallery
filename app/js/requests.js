var requests=(function(){
	function cleanEvent(request,event){
		var obj={};
		obj.request=request;
		obj.content=event.currentTarget.responseText;
		return obj;
	}
	
	function decCallback(request,callback){
		function _callback(event){
			//console.log(event);
			var _event=cleanEvent(request,event);
			callback(_event);
		}
		return _callback;
	}
	
	function get(url,callback){
		var request = new XMLHttpRequest();
		//request.onreadystatechange=decCallback(request,callback);
		request.onloadend=decCallback(request,callback);
		request.open('GET',url);
		request.send(null);
		//request.send({'message':'message'});
	}
	
	function post(url,data,callback){
		var request = new XMLHttpRequest();
		request.onloadend=decCallback(request,callback);
		request.open('POST',url);
		request.send(JSON.stringify(data));
	}
	
	return {get:get,post:post};
})();