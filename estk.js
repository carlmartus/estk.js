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

	function clo() {
		var now = Date.now();
		if (!func((now - lastTime) * 0.001)) {
			window.requestAnimationFrame(clo);
		}
		lastTime = now;
	}

	window.requestAnimationFrame(clo);
}

var ES_VERTEX = 1;
var ES_FRAGMENT = 2;

function esProgram(gl) {
	this.gl = gl;
	this.program = gl.createProgram();
}

function compileShader(gl, text, type) {
	if (type == ES_VERTEX) {
		type = gl.VERTEX_SHADER;
	} else {
		type = gl.FRAGMENT_SHADER;
	}

	var shader = gl.createShader(type);
	gl.shaderSource(shader, text);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
	}

	return shader;
}

esProgram.prototype.addShaderId = function(idName, type) {
	var text = document.getElementById(idName).text;
	this.gl.attachShader(this.program, compileShader(this.gl, text, type));
}

esProgram.prototype.link = function() {
	this.gl.linkProgram(this.program);
}

esProgram.prototype.use = function() {
	this.gl.useProgram(this.program);
}

var ES_LOAD_IMAGE = 1;
var ES_LOAD_AUDIO = 2;

function esLoad() {
	this.list = [];
}

esLoad.prototype.loadImage = function(url) {
	var obj = new Image();
	this.list.push([obj, url, ES_LOAD_IMAGE]);
	return obj;
}

esLoad.prototype.loadAudio = function(url) {
	var obj = new Audio();
	this.list.push([obj, url, ES_LOAD_AUDIO]);
	return obj;
}

esLoad.prototype.download = function(callback) {
	var left = this.list.length;

	for (var i=0; i<this.list.length; i++) {
		var entry = this.list[i];
		var obj = entry[0];
		var url = entry[1];
		var type = entry[2];

		var func = (function(obj, url) {
			return function() {
				left--;
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
		}
	}
}

