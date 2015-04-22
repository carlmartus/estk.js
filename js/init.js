function esInitGl(tagId) {
	var tag = document.getElementById(tagId);

	var gl = null;
	try {
		gl = tag.getContext('webgl');
	} catch (e) {}

	if (gl == null) {
		try {
			gl = tag.getContext('experimental-webgl');
		} catch (e) {}
	}

	return gl;
}

function esInitSw(tagId) {
	var tag = document.getElementById(tagId);
	return tag.getContext('2d');
}

function esNextFrame(func) {
	var lastTime = Date.now();

	var requestAnimFrame;
	if (window && window.requestAnimationFrame) {
		requestAnimationFrame = window.requestAnimationFrame;
	} else {
		requestAnimationFrame = function(callback) {
			window.setTimeout(callback, 1000.0 / 60.0);
		};

	}

	function clo() {
		var now = Date.now();
		if (!func((now - lastTime) * 0.001)) {
			requestAnimationFrame(clo);
		}
		lastTime = now;
	}

	requestAnimationFrame(clo);
}

