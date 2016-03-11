// file for generating norms for paper only
var uniform = 1/24;

function getT() {
	var T = (new Array(24)).fill(0).map(function() { return (new Array(24)).fill(0); });
	for (var i = 0; i < 12; i++) {
		// connect a with the corresponding b
		T[i][i + 12] = T[i + 12][i] = 0.2;
		// conect a with the a in front of it
		T[i][(i + 1) % 12] = T[(i + 1) % 12][i] = 0.2;
		// connect a with the b in front of it
		T[i][(i + 1) % 12 + 12] = T[(i + 1) % 12 + 12][i] = 0.2;

		// connect b with the b in front of it
		T[i + 12][(i + 1) % 12 + 12] = T[(i + 1) % 12 + 12][i + 12] = 0.2;
		// connect b with the a in front of it
		T[i + 12][(i + 1) % 12] = T[(i + 1) % 12][i + 12] = 0.2;

	}
	return math.matrix(T);
}

function getX(startIdx) {
	var x = new Array(24).fill(0);
	x[startIdx] = 1;
	return x;
}

function normL1(x) {
	return x.reduce(function (acc, curr) { 
		return acc + Math.abs(curr - uniform);
	}, 0);
}

function* normGenerator(start) {
	var T = getT(), x = getX(start);
	yield normL1(x);
	for(;;) {
		x = math.multiply(T, x);
		yield normL1(x.toArray());
	}
}

var gen = normGenerator(0),
    values = [],
    lessThan = 0,
    i = 0;

while(lessThan > -13) {
	var norm = gen.next().value;
	if (norm < Math.pow(10, lessThan)) {
		// console.log(lessThan);
		// console.log(norm, Math.pow(10, lessThan));
		values.push(i);
		lessThan--;
	}
	i++;
}

console.log(values);