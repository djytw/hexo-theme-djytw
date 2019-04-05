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
function getGithubEvent() {
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

function getGithubRepo() {
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
