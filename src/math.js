// Vector 3 components
// ===================

function vec3_create() {
	return new Float32Array([0.0, 0.0, 0.0]);
}

function vec3_parse(x, y, z) {
	return new Float32Array([x, y, z]);
}

function vec3_add(out, v0, v1) {
	out[0] = v0[0] + v1[0];
	out[1] = v0[1] + v1[1];
	out[2] = v0[2] + v1[2];
}

function vec3_sub(out, v0, v1) {
	out[0] = v0[0] - v1[0];
	out[1] = v0[1] - v1[1];
	out[2] = v0[2] - v1[2];
}

function vec3_mulk(out, v, k) {
	out[0] = k*v[0];
	out[1] = k*v[1];
	out[2] = k*v[2];
}

function vec3_length(v) {
	return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
}

function vec3_dot(v0, v1) {
	return v0[0]*v1[0] + v0[1]*v1[1] + v0[2]*v1[2];
}

function vec3_isZero(v) {
	return v[0]==0.0 && v[1]==0.0 && v[2]==0.0;
}

function vec3_cross(out, v0, v1) {
	out[0] = v0[1]*v1[2] - v0[2]*v1[1];
	out[1] = v0[2]*v1[0] - v0[0]*v1[2];
	out[2] = v0[0]*v1[1] - v0[1]*v1[0];
}

function vec3_normalize(out, v) {
	var inv = 1.0 / vec3_length(v);
	out[0] = inv*v[0];
	out[1] = inv*v[1];
	out[2] = inv*v[2];
}

// Martix 4x4 component
function mat4_create() {
	return new Float32Array([
			0.0, 0.0, 0.0, 0.0,
			0.0, 0.0, 0.0, 0.0,
			0.0, 0.0, 0.0, 0.0,
			0.0, 0.0, 0.0, 0.0]);
}

function mat4_identity(out) {
	out[ 0] = 1.0;
	out[ 1] = out[ 2] = out[ 3] = 0.0;

	out[ 5] = 1.0;
	out[ 4] = out[ 6] = out[ 7] = 0.0;

	out[10] = 1.0;
	out[ 8] = out[ 9] = out[11] = 0.0;

	out[15] = 1.0;
	out[12] = out[13] = out[14] = 0.0;
}

function mat4_mul(out, m0, m1) {
	out[ 0] = m0[ 0]*m1[ 0] + m0[ 1]*m1[ 4] + m0[ 2]*m1[ 8] + m0[ 3]*m1[12];
	out[ 1] = m0[ 0]*m1[ 1] + m0[ 1]*m1[ 5] + m0[ 2]*m1[ 9] + m0[ 3]*m1[13];
	out[ 2] = m0[ 0]*m1[ 2] + m0[ 1]*m1[ 6] + m0[ 2]*m1[10] + m0[ 3]*m1[14];
	out[ 3] = m0[ 0]*m1[ 3] + m0[ 1]*m1[ 7] + m0[ 2]*m1[11] + m0[ 3]*m1[15];

	out[ 4] = m0[ 4]*m1[ 0] + m0[ 5]*m1[ 4] + m0[ 6]*m1[ 8] + m0[ 7]*m1[12];
	out[ 5] = m0[ 4]*m1[ 1] + m0[ 5]*m1[ 5] + m0[ 6]*m1[ 9] + m0[ 7]*m1[13];
	out[ 6] = m0[ 4]*m1[ 2] + m0[ 5]*m1[ 6] + m0[ 6]*m1[10] + m0[ 7]*m1[14];
	out[ 7] = m0[ 4]*m1[ 3] + m0[ 5]*m1[ 7] + m0[ 6]*m1[11] + m0[ 7]*m1[15];

	out[ 8] = m0[ 8]*m1[ 0] + m0[ 9]*m1[ 4] + m0[10]*m1[ 8] + m0[11]*m1[12];
	out[ 9] = m0[ 8]*m1[ 1] + m0[ 9]*m1[ 5] + m0[10]*m1[ 9] + m0[11]*m1[13];
	out[10] = m0[ 8]*m1[ 2] + m0[ 9]*m1[ 6] + m0[10]*m1[10] + m0[11]*m1[14];
	out[11] = m0[ 8]*m1[ 3] + m0[ 9]*m1[ 7] + m0[10]*m1[11] + m0[11]*m1[15];

	out[12] = m0[12]*m1[ 0] + m0[13]*m1[ 4] + m0[14]*m1[ 8] + m0[15]*m1[12];
	out[13] = m0[12]*m1[ 1] + m0[13]*m1[ 5] + m0[14]*m1[ 9] + m0[15]*m1[13];
	out[14] = m0[12]*m1[ 2] + m0[13]*m1[ 6] + m0[14]*m1[10] + m0[15]*m1[14];
	out[15] = m0[12]*m1[ 3] + m0[13]*m1[ 7] + m0[14]*m1[11] + m0[15]*m1[15];
}

function mat4_lookAt(out, eye, at, up) {
	var forw = vec3_create();
	vec3_sub(forw, at, eye);
	vec3_normalize(forw, forw);

	var side = vec3_create();
	vec3_cross(side, up, forw);
	vec3_normalize(side, side);

	var m0 = mat4_create();
	m0[ 0] = side[0];
	m0[ 4] = side[1];
	m0[ 8] = side[2];
	m0[ 1] = up[0];
	m0[ 5] = up[1];
	m0[ 9] = up[2];
	m0[ 2] = -forw[0];
	m0[ 6] = -forw[1];
	m0[10] = -forw[2];

	var m1 = mat4_create();
	mat4_identity(m1);
	m1[12] = -eye.x;
	m1[13] = -eye.y;
	m1[14] = -eye.z;

	mat4_mul(out, m0, m1);
}

