
function runToTrue(callback,timeout){
	
	function _callback(){
		var isStop=callback();
		if (isStop===true){
			return;
		}
		else{
			setTimeout(_callback,timeout);
		}
	}
	
	setTimeout(_callback,timeout);
}

function runToAbort(callback,interval){
	var id=setInterval(callback,interval);
	console.log('register',id);
	return function(){
		console.log('clear',id);
		clearInterval(id);
	}
}

var img=document.getElementById('img');
var btnPrev=document.getElementById('btnPrev');
var btnPlay=document.getElementById('btnPlay');
var btnNext=document.getElementById('btnNext');
//var btnPause=document.getElementById('btnPause');
var textInterval=document.getElementById('textInterval');
var btnRepeat=document.getElementById('btnRepeat');
var btnSetStart=document.getElementById('btnSetStart');
var textMapPath=document.getElementById('textMapPath');
var btnEnter=document.getElementById('btnEnter');
var divEnter=document.getElementById('divEnter');
var divApp=document.getElementById('divApp');
var btnReset=document.getElementById('btnReset');


cookie=(function(){
	// cookie('a') -> cookie a attr value
	// cookie('a',123) will set cookie a attr value to 123
	if (!document.cookie){
		document.cookie=JSON.stringify({});
	}
	
	var dict=JSON.parse(document.cookie);
	
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

var selectedPath=true;
if(cookie.attr('map_path')){
	textMapPath.value=cookie.attr('map_path');
}
else if (textMapPath.value){
	cookie.attr('map_path',textMapPath.value);
}
else{
	selectedPath=false;
}

btnEnter.onclick=function(){
	cookie.attr('map_path',textMapPath.value);
	divApp.style.display='block';
	divEnter.style.display='none';
	setup();
};

if(selectedPath){
	divApp.style.display='block';
	divEnter.style.display='none';
	setup();
}
//else wait btnEnter click event

window.onbeforeunload=function(){
	requests.get('exit',function(){
		console.log('exit');
	})
}

function setup(){
	
	btnResetFinally=[];
	
	btnReset.onclick=function(){
		btnResetFinally.forEach(function(func){
			func();
		});
		//btnPlay.onclick=undefined;
		
		divApp.style.display='none';
		divEnter.style.display='block';
	}
	
	

	requests.post('allImagePath.json',cookie.attr(),function(res){
		//console.log(res);
		var allPath=JSON.parse(res.content);
		var rd=(function (){
			var i=0;
			var length=allPath.length;
			var start=0;
			var end=length;
			function nextImage(){
				i+=1;
				if(i>=length){
					i=0;
				}
				return allPath[i] && 'map/'+allPath[i];
			};
			function prevImage(){
				i-=1;
				if(i<0){
					i=length-1;
				}
				return allPath[i] && 'map/'+allPath[i];
			}
			function nowImage(){
				return allPath[i] && 'map/'+allPath[i];
			}
			function nextImageRepeater(){
				//console.log(i);
				i+=1;
				if(i>=end){
					i=start;
				}
				return allPath[i] && 'map/'+allPath[i];
			}
			function setStart(value){
				start=value || i;
			}
			function setEnd(value){
				end=value || i;
			}
			function gotoStart(value){
				i=start;
			}
			return {nextImage:nextImage,prevImage:prevImage,nowImage:nowImage,nextImageRepeater:nextImageRepeater,
						setStart:setStart,setEnd:setEnd,gotoStart:gotoStart}
		})();
		var nextImage=rd.nextImage;
		var prevImage=rd.prevImage;
		var nowImage=rd.nowImage;
		var nextImageRepeater=rd.nextImageRepeater;
		var setStart=rd.setStart;
		var setEnd=rd.setEnd;
		var gotoStart=rd.gotoStart;
		
		function updateImage(path){
			//var path=nextImage();
			//console.log(path);
			if(!path){
				return true;
			}
			else{
				img.src=path;
			}
		}
		
		
		btnSetStart.onclick=function(){// else It will pass a error value as event variable
			setStart();
		}
		btnRepeat.onclick=function(){
			setEnd();
			gotoStart();
		}
		playAble(btnRepeat,nextImageRepeater);
		
		//console.log(btnPrev.onclick);
		btnPrev.onclick=function(){
			var path=prevImage();
			updateImage(path);
		};
		btnNext.onclick=function(){
			var path=nextImage();
			updateImage(path);
		};
		/*
		btnPlay.onclick=function(){
			runToTrue(function(){
				var path=nextImage();
				updateImage(path);
			},100);
		};
		*/
		function getInterval(){
			if (textInterval.value){
				return Number(textInterval.value)
			}
			else{
				return 1000;
			}
		}
		
		function playAble(dom,nextImage){
			//console.log(nextImage);
			var originOnClick=dom.onclick;
			var originText=dom.innerText;
			function play(){
				if (originOnClick){
					originOnClick();
				}
				var abort=runToAbort(function(){
					var path=nextImage();
					updateImage(path);
				},getInterval());
				
				btnResetFinally.push(abort);
				
				dom.onclick=function(){
					abort();
					dom.onclick=play;
					//dom.onclick=originOnClick || play;
					dom.innerText=originText;
				}
				dom.innerText='pause';
			}
			dom.onclick=play;
			btnResetFinally.push(function(){
				dom.innerText=originText;
				dom.onclick=onclick;
			})
			return dom;
		}
		
		playAble(btnPlay,nextImage);
		
		
		//init
		updateImage(nowImage());
	})
}