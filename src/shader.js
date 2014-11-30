var ES_VERTEX = 1;
var ES_FRAGMENT = 2;

function esShader(gl) {
	this.gl = gl;
	this.program = gl.createProgram();
}

esShader.prototype.addShaderId = function(shader, idName, type) {
	this.gl.createShader(type);
}

