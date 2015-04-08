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

esProgram.prototype.bindAttribute = function(id, name) {
	this.gl.bindAttribLocation(this.program, id, name);
}

esProgram.prototype.addShaderId = function(idName, type) {
	this.addShaderText(document.getElementById(idName).text, type);
}

esProgram.prototype.addShaderText = function(text, type) {
	this.gl.attachShader(this.program, compileShader(this.gl, text, type));
}

esProgram.prototype.getUniform = function(name) {
	return this.gl.getUniformLocation(this.program, name);
}

esProgram.prototype.link = function() {
	this.gl.linkProgram(this.program);
}

esProgram.prototype.use = function() {
	this.gl.useProgram(this.program);
}

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

esLoad.prototype.loadTexture = function(gl, url, filterMag, filterMin) {
	var tex = gl.createTexture();
	this.list.push([tex, url, ES_LOAD_TEXTURE]);
	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filterMag);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filterMag);
	return tex;
}

esLoad.prototype.loadAudio = function(url) {
	var obj = new Audio();
	this.list.push([obj, url, ES_LOAD_TEXTURE]);
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

// Vector 3 components
// ===================

function esVec3_create() {
	return new Float32Array([0.0, 0.0, 0.0]);
}

function esVec3_parse(x, y, z) {
	return new Float32Array([x, y, z]);
}

function esVec3_add(out, v0, v1) {
	out[0] = v0[0] + v1[0];
	out[1] = v0[1] + v1[1];
	out[2] = v0[2] + v1[2];
}

function esVec3_sub(out, v0, v1) {
	out[0] = v0[0] - v1[0];
	out[1] = v0[1] - v1[1];
	out[2] = v0[2] - v1[2];
}

function esVec3_mulk(out, v, k) {
	out[0] = k*v[0];
	out[1] = k*v[1];
	out[2] = k*v[2];
}

function esVec3_length(v) {
	return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
}

function esVec3_dot(v0, v1) {
	return v0[0]*v1[0] + v0[1]*v1[1] + v0[2]*v1[2];
}

function esVec3_isZero(v) {
	return v[0]==0.0 && v[1]==0.0 && v[2]==0.0;
}

function esVec3_cross(out, v0, v1) {
	out[0] = v0[1]*v1[2] - v0[2]*v1[1];
	out[1] = v0[2]*v1[0] - v0[0]*v1[2];
	out[2] = v0[0]*v1[1] - v0[1]*v1[0];
}

function esVec3_normalize(out, v) {
	var inv = 1.0 / esVec3_length(v);
	out[0] = inv*v[0];
	out[1] = inv*v[1];
	out[2] = inv*v[2];
}

// Martix 4x4 component
function esMat4_create() {
	return new Float32Array([
			0.0, 0.0, 0.0, 0.0,
			0.0, 0.0, 0.0, 0.0,
			0.0, 0.0, 0.0, 0.0,
			0.0, 0.0, 0.0, 0.0]);
}

function esMat4_identity(out) {
	out[ 0] = 1.0;
	out[ 1] = out[ 2] = out[ 3] = 0.0;

	out[ 5] = 1.0;
	out[ 4] = out[ 6] = out[ 7] = 0.0;

	out[10] = 1.0;
	out[ 8] = out[ 9] = out[11] = 0.0;

	out[15] = 1.0;
	out[12] = out[13] = out[14] = 0.0;
}

function esMat4_mul(out, m0, m1) {
	out[ 0] = m1[ 0]*m0[ 0] + m1[ 1]*m0[ 4] + m1[ 2]*m0[ 8] + m1[ 3]*m0[12];
	out[ 1] = m1[ 0]*m0[ 1] + m1[ 1]*m0[ 5] + m1[ 2]*m0[ 9] + m1[ 3]*m0[13];
	out[ 2] = m1[ 0]*m0[ 2] + m1[ 1]*m0[ 6] + m1[ 2]*m0[10] + m1[ 3]*m0[14];
	out[ 3] = m1[ 0]*m0[ 3] + m1[ 1]*m0[ 7] + m1[ 2]*m0[11] + m1[ 3]*m0[15];

	out[ 4] = m1[ 4]*m0[ 0] + m1[ 5]*m0[ 4] + m1[ 6]*m0[ 8] + m1[ 7]*m0[12];
	out[ 5] = m1[ 4]*m0[ 1] + m1[ 5]*m0[ 5] + m1[ 6]*m0[ 9] + m1[ 7]*m0[13];
	out[ 6] = m1[ 4]*m0[ 2] + m1[ 5]*m0[ 6] + m1[ 6]*m0[10] + m1[ 7]*m0[14];
	out[ 7] = m1[ 4]*m0[ 3] + m1[ 5]*m0[ 7] + m1[ 6]*m0[11] + m1[ 7]*m0[15];

	out[ 8] = m1[ 8]*m0[ 0] + m1[ 9]*m0[ 4] + m1[10]*m0[ 8] + m1[11]*m0[12];
	out[ 9] = m1[ 8]*m0[ 1] + m1[ 9]*m0[ 5] + m1[10]*m0[ 9] + m1[11]*m0[13];
	out[10] = m1[ 8]*m0[ 2] + m1[ 9]*m0[ 6] + m1[10]*m0[10] + m1[11]*m0[14];
	out[11] = m1[ 8]*m0[ 3] + m1[ 9]*m0[ 7] + m1[10]*m0[11] + m1[11]*m0[15];

	out[12] = m1[12]*m0[ 0] + m1[13]*m0[ 4] + m1[14]*m0[ 8] + m1[15]*m0[12];
	out[13] = m1[12]*m0[ 1] + m1[13]*m0[ 5] + m1[14]*m0[ 9] + m1[15]*m0[13];
	out[14] = m1[12]*m0[ 2] + m1[13]*m0[ 6] + m1[14]*m0[10] + m1[15]*m0[14];
	out[15] = m1[12]*m0[ 3] + m1[13]*m0[ 7] + m1[14]*m0[11] + m1[15]*m0[15];
}

function esMat4_ortho(out, x0, y0, x1, y1) {
	out[ 1] = out[2] = out[3] = out[4] = out[6] = out[7] = out[8] = out[9] = 0.0;
	out[ 0] = 2.0 / (x1-x0);
	out[ 5] = 2.0 / (y1-y0);
	out[10] = 1.0;
	out[15] = 1.0;
	out[12] = -(x1+x0)/(x1-x0);
	out[13] = -(y1+y0)/(y1-y0);
	out[14] = 0.0;
}

function esMat4_lookAt(out, eye, at, up) {
	var forw_ = esVec3_create();
	esVec3_sub(forw_, at, eye);
	var forw = esVec3_create();
	esVec3_normalize(forw, forw_);

	var side_ = esVec3_create();
	esVec3_cross(side_, up, forw);
	var side = esVec3_create();
	esVec3_normalize(side, side_);

	var upn = esVec3_create();
	esVec3_cross(upn, forw, side);

	var m0 = esMat4_create();
	esMat4_identity(m0);
	m0[ 0] = side[0];
	m0[ 4] = side[1];
	m0[ 8] = side[2];
	m0[ 1] = upn[0];
	m0[ 5] = upn[1];
	m0[ 9] = upn[2];
	m0[ 2] = -forw[0];
	m0[ 6] = -forw[1];
	m0[10] = -forw[2];

	var m1 = esMat4_create();
	esMat4_identity(m1);
	m1[12] = -eye[0];
	m1[13] = -eye[1];
	m1[14] = -eye[2];

	esMat4_mul(out, m0, m1);
}

function esMat4_perspective(out, fov, ratio, near, far) {
	var size = near * Math.tan(fov * 0.5);
	var left = -size;
	var right = size;
	var bottom = -size / ratio;
	var top = size / ratio;

	out[ 0] = 2.0 * near / (right - left);
	out[ 1] = 0.0;
	out[ 2] = 0.0;
	out[ 3] = 0.0;
	out[ 4] = 0.0;
	out[ 5] = 2.0 * near / (top - bottom);
	out[ 6] = 0.0;
	out[ 7] = 0.0;
	out[ 8] = (right + left) / (right - left);
	out[ 9] = (top + bottom) / (top - bottom);
	out[10] = -(far + near) / (far - near);
	out[11] = -1.0;
	out[12] = 0.0;
	out[13] = 0.0;
	out[14] = -(2.0 * far * near) / (far - near);
	out[15] = 0.0;
}

function esMat4_camera(out, fov, ratio, near, far, eye, at, up) {
	var persp = esMat4_create();
	esMat4_perspective(persp, fov, ratio, near, far);

	var look = esMat4_create();
	esMat4_lookAt(look, eye, at, up);

	esMat4_mul(out, persp, look);
}

