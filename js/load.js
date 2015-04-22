var ES_LOAD_IMAGE = 1;
var ES_LOAD_AUDIO = 2;
var ES_LOAD_TEXTURE = 3;

var GLLOD_BG = 16;
var GLLOD_FG = 12;

function esLoad() {
	this.list = [];
}

esLoad.prototype.loadImage = function(url) {
	var obj = new Image();
	this.list.push([obj, url, ES_LOAD_IMAGE]);
	return obj;
}

esLoad.prototype.loadTexture = function(gl, url, filterMag, filterMin, generateMipMap) {
	var tex = gl.createTexture();
	this.list.push([tex, url, ES_LOAD_TEXTURE]);
	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filterMag);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filterMag);
	if (generateMipMap) {
		gl.generateMipmap(gl.TEXTURE_2D);
	}
	return tex;
}

esLoad.prototype.loadAudio = function(url) {
	var obj = new Audio();
	this.list.push([obj, url, ES_LOAD_AUDIO]);
	return obj;
}

function renderGlLoadingScreen(gl, step, count) {
	var dims = gl.getParameter(gl.VIEWPORT);
	var x = dims[0];
	var y = dims[1];
	var w = dims[2];
	var h = dims[3];

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.enable(gl.SCISSOR_TEST);

	// Bar background
	gl.scissor(
			x + GLLOD_BG,
			y + h/2 - GLLOD_BG,
			w - 2*GLLOD_BG,
			GLLOD_BG*2);
	gl.clearColor(0.5, 0.5, 0.5, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Bar forground
	gl.scissor(
			x + (GLLOD_BG + (GLLOD_BG - GLLOD_FG)),
			y + h/2 - GLLOD_FG,
			(step / count) * (w - 2.0*(GLLOD_BG + (GLLOD_BG - GLLOD_FG))),
			GLLOD_FG*2);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.disable(gl.SCISSOR_TEST);

	gl.viewport(x, y, w, h);
}

esLoad.prototype.downloadWithGlScreen = function(gl, callback) {
	renderGlLoadingScreen(gl, 0, 1);
	return this.download(callback, function(step, count) {
		renderGlLoadingScreen(gl, step, count);
	}, gl);
}

esLoad.prototype.download = function(callback, step, gl) {
	var length = this.list.length;
	var left = length;

	for (var i=0; i<this.list.length; i++) {
		var entry = this.list[i];
		var obj = entry[0];
		var url = entry[1];
		var type = entry[2];

		var func = (function(obj, url) {
			return function() {
				left--;
				if (step) {
					step(length-left, length);
				}

				if (left == 0) {
					callback();
				}
			}
		})(obj, url);

		switch (type) {
			default :
			case ES_LOAD_IMAGE :
				obj.onload = func;
				obj.src = url;
				break;

			case ES_LOAD_AUDIO :
				obj.addEventListener('canplaythrough', func, false);
				obj.src = url;
				break;

			case ES_LOAD_TEXTURE :
				var img = new Image();
				img.onload = function(a, b) {
					gl.bindTexture(gl.TEXTURE_2D, obj);
					gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
					func(a, b);
				};
				img.src = url;
				break;
		}
	}
}

