function esFullFrame(tagId, resizeCallback) {
	var tag = document.getElementById(tagId);
	tag.style = 'padding: 0px; margin: 0px; position: absolute; left: 0px; top: 0px;';

	var resizeEvent = function() {
		var w = window.innerWidth;
		var h = window.innerHeight;

		tag.width = w;
		tag.height = h;
		resizeCallback(w, h);
	};

	window.addEventListener('resize', resizeEvent, false);
	resizeEvent();
}

