// Vector 2 component

function esVec2_create() {
	return new Float32Array([0.0, 0.0]);
}

function esVec2_parse(x, y) {
	return new Float32Array([x, y]);
}

function esVec2_add(out, v0, v1) {
	out[0] = v0[0] + v1[0];
	out[1] = v0[1] + v1[1];
}

function esVec2_sub(out, v0, v1) {
	out[0] = v0[0] - v1[0];
	out[1] = v0[1] - v1[1];
}

function esVec2_mulk(out, v, k) {
	out[0] = k*v[0];
	out[1] = k*v[1];
}

function esVec2_length(v) {
	return Math.sqrt(v[0]*v[0] + v[1]*v[1]);
}

function esVec2_dot(v0, v1) {
	return v0[0]*v1[0] + v0[1]*v1[1];
}

function esVec2_isZero(v) {
	return v[0]==0.0 && v[1]==0.0;
}

function esVec3_normalize(out, v, len) {
	var inv = 1.0 / esVec2_length(v);
	if (len) inv *= len;
	out[0] = inv*v[0];
	out[1] = inv*v[1];
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

function esVec3_normalize(out, v, len) {
	var inv = 1.0 / esVec3_length(v);
	if (len) inv *= len;
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

