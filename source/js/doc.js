

function ui_scrollfire_card(){
	var elems = document.querySelectorAll('#mainc>.card:not(.show)');
	elems.forEach(function(t){
		if(t.getBoundingClientRect().top+100<window.innerHeight)
			t.classList.add('show');
	})
}
function ui_materialboxed_init(){
	document.querySelectorAll('.materialboxed').forEach(function(elem){
		elem.parentNode.onmousedown=function(){
			this.classList.add("materialboxedmousedown");
			setTimeout("document.querySelectorAll('.materialboxedmousedown').forEach(function(elem){elem.classList.remove('materialboxedmousedown')})",500);
		}
		elem.parentNode.onmouseup=function(){
			if(this.classList.contains('materialboxedmousedown')){
				ui_materialboxed_click(this.querySelector('.materialboxed'));
			}
		}
	});
}
function ui_materialboxed_click(elem){
	var bg = document.createElement("div");
	bg.classList.add("materialboxedbg");
	var onclk=document.createAttribute("onclick");
	onclk.nodeValue="ui_materialboxed_close()";
	bg.attributes.setNamedItem(onclk);
	var img = document.createElement("img");
	var onclk1=document.createAttribute("onclick");
	onclk1.nodeValue="ui_materialboxed_close()";
	img.attributes.setNamedItem(onclk1);
	img.classList.add("materialboxedimg");
	img.style.top=elem.getBoundingClientRect().top+"px";
	img.style.left=elem.getBoundingClientRect().left+"px";
	img.style.width=elem.getBoundingClientRect().width+"px";
	img.style.height=elem.getBoundingClientRect().height+"px";
	img.src=elem.src;

	var rules= document.styleSheets[1].cssRules;
	for(i=0;i<rules.length;i++){
		if(rules[i] instanceof CSSKeyframesRule){
			if(rules[i].name=="materialboxedimgshow"){
				var screenratio=window.innerWidth/window.innerHeight;
				var imgratio=img.naturalWidth/img.naturalHeight;
				var width,height;
				if(imgratio>screenratio){
					width=Math.min(img.naturalWidth,window.innerWidth*.95);
					height=width/imgratio;
				}else{
					height=Math.min(img.naturalHeight,window.innerHeight*.95);
					width=height*imgratio;
				}
				var left=(window.innerWidth-width)/2;
				var top=(window.innerHeight-height)/2;
				rules[i].cssRules[0].style.width=width+"px";
				rules[i].cssRules[0].style.height=height+"px";
				rules[i].cssRules[0].style.top=top+"px";
				rules[i].cssRules[0].style.left=left+"px";
				break;
			}
		}
	}
	if(i!=rules.length){
		//no error occured
		document.body.appendChild(bg);
		document.body.appendChild(img);
	}else{
		console.log("Error: i="+i);
	}
}
function ui_materialboxed_close(){
	document.querySelectorAll(".materialboxedbg,.materialboxedimg").forEach(function(elem){
		elem.remove();
	})
}



var githubrepo = "";
var githubevent = "";
var loading='<div class="preloader-wrapper big active">\
    				<div class="spinner-layer spinner-red-only">\
						<div class="circle-clipper left">\
						  <div class="circle"></div>\
						</div><div class="gap-patch">\
						  <div class="circle"></div>\
						</div><div class="circle-clipper right">\
						  <div class="circle"></div>\
						</div>\
					 </div>\
				  </div>';
function util_github_getevent() {
	var gitevent= document.querySelector("#git-event");
	if (githubevent == "") {
		gitevent.innerHTML=(loading);
		var oReq = new XMLHttpRequest();
		oReq.open("GET", "https://api.github.com/users/djytw/events", true);
		oReq.responseType = "json";

		oReq.onload =  function (err) {
			var e = oReq.response;
			githubrepo = e;
			gitevent.innerHTML="";
			var msg = "";
			var p = 4;
			for (var i = 0; i < e.length; i++) {
				if (e[i].type == "PushEvent") {
					var time = e[i].created_at.split('T')[0];
					time = time.split('-');
					time = time[1] + "-" + time[2];
					var branch = e[i].payload.ref.split("/")[2];
					if (msg == e[i].payload.commits[0].message) {
						msg = "";
						p++;
						continue;
					} else msg = e[i].payload.commits[0].message;
					var s;
					s = "<div><big>" + time + "</big> <a href=\"" + e[i].repo.url + "\">" + e[i].repo.name + "</a>#<a href=\"" + e[i].repo.url + "/tree/" + branch + "\">" + branch + "</a></div>";
					s += "<div><a href=\"" + e[i].payload.commits[0].url + "\">" + e[i].payload.commits[0].sha.slice(0, 7) + "</a> " + msg + "</div>";
					gitevent.innerHTML+=s;
					if (i >= p) break;
				} else {
					p++;
				}
			}
		}

		oReq.send(null);

	} else {
		var e = githubevents;
		gitevent.innerHTML="";
		var msg = "";
		var p = 4;
		for (var i = 0; i < e.length; i++) {
			if (e[i].type == "PushEvent") {
				var time = e[i].created_at.split('T')[0];
				time = time.split('-');
				time = time[1] + "-" + time[2];
				var branch = e[i].payload.ref.split("/")[2];
				if (msg == e[i].payload.commits[0].message) {
					msg = "";
					p++;
					continue;
				} else msg = e[i].payload.commits[0].message;
				var s;
				s = "<div>" + time + "<a href=\"" + e[i].repo.url + "\">" + e[i].repo.name + "</a>#<a href=\"" + e[i].repo.url + "/tree/" + branch + "\">" + branch + "</a></div>";
				s += "<div><a href=\"" + e[i].payload.commits[0].url + "\">" + e[i].payload.commits[0].sha.slice(0, 7) + "</a>" + msg + "</div>";
				gitevent.innerHTML+=s;
				if (i >= p) break;
			} else {
				p++;
			}
		}
	}
}

function util_github_getrepos() {
	var gitrepos= document.querySelector("#git-repos");
	if (githubrepo == "") {
		gitrepos.innerHTML=(loading);
		var oReq = new XMLHttpRequest();
		oReq.open("GET", "https://api.github.com/users/djytw/repos?sort=updated&direction=desc", true);
		oReq.responseType = "json";

		oReq.onload =  function (err) {
			var e = oReq.response;
			githubrepo = e;
			gitrepos.innerHTML="";
			for (var i = 0; i < e.length; i++) {
				var s = "<div><a href=\"" + e[i].html_url + "\">" + e[i].name + "</a></div><div>";
				if (e[i].description == null) s += "没有简介...";
				else s += e[i].description;
				s += "</div>";
				gitrepos.innerHTML+=s;
				if (i >= 4) break;
			}
			gitrepos.innerHTML+='<div><a href="https://github.com/djytw?tab=repositories">我的其他项目...</a></div>';
		};
		oReq.send(null);
	} else {
		var e = githubrepo;
		gitrepos.innerHTML="";
		for (var i = 0; i < e.length; i++) {
			var s = "<div><a href=\"" + e[i].html_url + "\">" + e[i].name + "</a></div><div>";
			if (e[i].description == null) s += "没有简介...";
			else s += e[i].description;
			s += "</div>";
			gitrepos.innerHTML+=s;
			if (i >= 4) break;
		}
		gitrepos.innerHTML+='<div><a href="https://github.com/djytw?tab=repositories">我的其他项目...</a></div>';
	}
}


//IE 10,11 fix: forEach
if (!NodeList.prototype.forEach) {  
    NodeList.prototype.forEach = function(callback, thisArg) {  
        var T, k;  
        if (this == null) {  
            throw new TypeError(" this is null or not defined");  
        }  
        var O = Object(this);  
        var len = O.length >>> 0; // Hack to convert O.length to a UInt32  
        if ({}.toString.call(callback) != "[object Function]") {  
            throw new TypeError(callback + " is not a function");  
        }  
        if (thisArg) {  
            T = thisArg;  
        }  
        k = 0;  
        while (k < len) {  
            var kValue;  
            if (k in O) {  
                kValue = O[k];  
                callback.call(T, kValue, k, O);  
            }  
            k++;  
        }  
    };  
}
//IE 10,11 fix:Node.remove()
// from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('remove')) {
      return;
    }
    Object.defineProperty(item, 'remove', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove() {
        if (this.parentNode !== null)
          this.parentNode.removeChild(this);
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

//IE Fix End