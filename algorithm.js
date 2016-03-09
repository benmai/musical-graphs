var uniform = 1/24;

// from underscore.js
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

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

// L1 norm of x - pi (where pi is the uniform distribution)
function normL1(x) {
	return x.reduce(function (acc, curr) { 
		return acc + Math.abs(curr - uniform);
	}, 0);
}

function getDistributions(steps, start) {
	var gen = distributionGenerator(start),
	    out = new Array(steps);
	for (var i = 0; i < steps; i++) {
		out[i] = gen.next().value;
	}
	return out;
}

function getDistribution(steps, start) {
	var gen = distributionGenerator(start),
		dist;
	for (var i = 0; i < steps; i++) {
		dist = gen.next();
	}
	return dist.value;
}

function getNorms(steps, start) {
	var distributions = getDistributions(steps, start);
	return distributions.map(normL1);
}

function* distributionGenerator(start) {
	var T = getT(), x = getX(start);
	yield x;
	for(;;) {
		x = math.multiply(T, x);
		yield x.toArray();
	}
}

// charts norms from paths of lengths 0 to 99
function chartNorms() {
	var numDataPoints = 75;
	var data = {
	    labels: new Array(numDataPoints).fill(0).map(function(value, idx) { return idx}),
	    datasets: [
	        {
	            label: "My First dataset",
	            fillColor: "rgba(220,220,220,0.2)",
	            strokeColor: "rgba(220,220,220,1)",
	            pointColor: "rgba(220,220,220,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(220,220,220,1)",
	            data: getNorms(numDataPoints, 0)
	        }
	    ]
	};
	var options = {
		pointDot: false,
		pointHitDetectionRadius: 1.05
	};
	var cnvs = document.getElementById("normChart");
	var ctx = cnvs.getContext("2d");
	var chart = new Chart(ctx).Line(data, options);
	cnvs.onclick = function (evt) {
		var activePoints = chart.getPointsAtEvent(evt);
		console.log(activePoints[0].label);
		chartDistribution(activePoints[0].label, 0);
	};
}

function chartDistribution(steps, start) {
	var data = {
	    labels: ["a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "a10", "a11", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b10", "b11"],
	    datasets: [
	        {
	            label: "Distribution",
	            fillColor: "rgba(220,220,220,0.5)",
	            strokeColor: "rgba(220,220,220,0.8)",
	            highlightFill: "rgba(220,220,220,0.75)",
	            highlightStroke: "rgba(220,220,220,1)",
	            data: getDistribution(steps, start)
	        },
	        {
	            label: "Uniform Distribution",
	            fillColor: "rgba(151,187,205,0.5)",
	            strokeColor: "rgba(151,187,205,0.8)",
	            highlightFill: "rgba(151,187,205,0.75)",
	            highlightStroke: "rgba(151,187,205,1)",
	            data: new Array(24).fill(uniform)
	        }
	    ]
	};
	var ctx = document.getElementById("distributionChart").getContext("2d");
	var chart = new Chart(ctx).Bar(data);
}

chartNorms();
chartDistribution(1, 0);

// take x-pi (take L1, L2 norm)
// plot over number of steps