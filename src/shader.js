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

