

function ui_scrollfire_card(){
	var elems = document.querySelectorAll('#mainc>.card:not(.show),#sidebar>.card:not(.show)');
	elems.forEach(function(t){
		if(t.getBoundingClientRect().top+100<window.innerHeight){
			t.classList.add('show');
		}
	})
}
function ui_netease_init(){
	if(window.innerWidth<993)return;
	var fr = document.getElementById("neteasemusic");
	if(fr.innerText == "")
	fr.innerHTML='<div><iframe frameborder="no" height="450" src="https://music.163.com/outchain/player?type=0&id=2051063875&auto=0&height=430" onload="ui_netease_loaded()">\
			</iframe><a href="https://music.163.com/user/61422243">查看歌单</a></div><div>播放器正在加载....</div>';
}
function ui_netease_loaded(){
	var fr = document.getElementById("neteasemusic");
	fr.removeChild(fr.children[1]);
	fr.children[0].style.visibility="visible";
	fr.style.background="none";
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
function util_github_eventrender(e){
	var gitevent = document.querySelector("#git-event");
	gitevent.innerHTML="";
	for (var t of e) {
		var s;
		t.url = t.url.replace(/api\.github\.com\/repos/,"github.com");
		t.curl = t.curl.replace(/api\.github\.com\/repos/,"github.com").replace("commits","commit");
		s = "<div>" + t.time + " <a href=\"" + t.url + "\">" + t.name + "</a>#<a href=\"" + t.url + "/tree/" + t.branch + "\">" + t.branch + "</a></div>";
		s += "<div><a href=\"" + t.curl + "\">" + t.csha + "</a> " + t.msg + "</div>";
		gitevent.innerHTML+=s;
	}
}
function util_github_getevent() {
	var gitevent = document.querySelector("#git-event");
	var githubevent = Cookies.get("githubevent");
	var msg = "";
	if (githubevent == undefined) {
		gitevent.innerHTML=loading;
		var oReq = new XMLHttpRequest();
		oReq.open("GET", "https://api.github.com/users/djytw/events", true);
		oReq.responseType = "json";
		oReq.onload =  function (err) {
			var e = oReq.response;
			var ret = []
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
					ret.push({time:time,url:e[i].repo.url,name:e[i].repo.name,branch:branch,curl:e[i].payload.commits[0].url,csha:e[i].payload.commits[0].sha.slice(0, 7),msg:msg});
					if (i >= p) break;
				} else {
					p++;
				}
			}
			var exp = new Date(new Date().getTime() + 5 * 60 * 1000);
			Cookies.set("githubevent",JSON.stringify(ret),{expires: exp});
			util_github_eventrender(ret);
		}
		oReq.send(null);
	} else {
		githubevent = JSON.parse(githubevent);
		util_github_eventrender(githubevent);
	}
}
function util_github_reposrender(e){
	var gitrepos= document.querySelector("#git-repos");
	gitrepos.innerHTML="";
	for (var t of e) {
		var s = "<div><a href=\"" + t.url + "\">" + t.name + "</a></div><div>";
		if (t.des == null) s += "没有简介...";
		else s += t.des;
		s += "</div>";
		gitrepos.innerHTML+=s;
	}
	gitrepos.innerHTML+='<div><a href="https://github.com/djytw?tab=repositories">我的其他项目...</a></div>';
}
function util_github_getrepos() {
	var gitrepos= document.querySelector("#git-repos");
	var githubrepo = Cookies.get("githubrepo");
	if (githubrepo == undefined) {
		gitrepos.innerHTML = loading;
		var oReq = new XMLHttpRequest();
		oReq.open("GET", "https://api.github.com/users/djytw/repos?sort=updated&direction=desc", true);
		oReq.responseType = "json";
		oReq.onload =  function (err) {
			var e = oReq.response;
			var ret = [];
			for (var i = 0; i < e.length; i++) {
				ret.push({url: e[i].html_url, name:e[i].name, des:e[i].description});
				if (i >= 4) break;
			}
			var exp = new Date(new Date().getTime() + 5 * 60 * 1000);
			Cookies.set("githubrepo",JSON.stringify(ret),{expires: exp});
			util_github_reposrender(ret);
		};
		oReq.send(null);
	} else {
		githubrepo = JSON.parse(githubrepo);
		util_github_reposrender(githubrepo);
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
