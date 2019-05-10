(function() {
	window.onload = function() {
		var svg = document.getElementById("main_svg");

		var box = svg.getBoundingClientRect();

		var width = box.width;
		var height = box.height;

		var G = 6.67384E-11;
		var M = 5.972E24;
		var d = 384000000;
		var v = 3683 * 1000 / 3600; // м/c
		
		var dt = 3600; // крок в секундах

		var earth_loc = [0, 0];
		var moon_loc = [-d, 0];

		var project = projection()
			.x_domain([-d*2, d*2])
			.y_domain([-d*2, d*2])
			.x_range([0, width])
			.y_range([height/2 - width/2, height/2 + width/2])
		;

		var ctx = d3.select("canvas")
			.attr("width", width)
			.attr("height", height)
			.node()
			.getContext("2d");


		var earth = d3.select("#earth")
			.datum({l: earth_loc, lp: project(earth_loc)})
			.attr("cx", d => d.lp[0])
			.attr("cy", d => d.lp[1])
			.call(d3.drag()
	        .on("start", dragstarted)
	        .on("drag", dragged)
	        .on("end", dragended))


		var moon = d3.select("#moon")
			.datum({l: moon_loc, lp: project(moon_loc), v: [0, v]})
			.attr("cx", d => d.lp[0])
			.attr("cy", d => d.lp[1])
			.call(d3.drag()
	        .on("start", dragstarted)
	        .on("drag", dragged)
	        .on("end", dragended))


		var moon_d = moon.datum();
		var earth_d = earth.datum();

		var a_length;
		var r;

		function tick() {
			a_length = G*M/(sq(d));

			r = minus(earth_d.l, moon_d.l);

			r_length = get_distance([0, 0], r);
			r_one = [r[0]/r_length, r[1]/r_length];

			a = scale(r_one, a_length);

			moon_d.dl = plus(scale(moon_d.v, dt), scale(a, sq(dt)));

			moon_d.l = plus(moon_d.l, moon_d.dl);
			moon_d.lp = project(moon_d.l);

			moon
				.attr("cx", d => d.lp[0])
				.attr("cy", d => d.lp[1])

			ctx.fillRect(moon_d.lp[0], moon_d.lp[1], 2, 2);
			moon_d.v = plus(moon_d.v, scale(a, dt));
		}

		setInterval(tick, 10);

		// setInterval(tick, 50);

		function dragstarted(d) {
		  	d3.select(this).raise().classed("active", true);
		}

		function dragged(d) {
		  	d.lp = [d3.event.x, d3.event.y];
		  	d.l = project.invert(d.lp);

		  	d3.select(this)
		  		.attr("cx", d.lp[0])
		  		.attr("cy", d.lp[1]);
		}

		function dragended(d) {
		  	d3.select(this).classed("active", false);
		}

		function get_distance(p1, p2) {
			return Math.sqrt(sq(p1[0] - p2[0]) + sq(p1[1] - p2[1]));
		}

		function minus(v1, v2) {
			return [v1[0] - v2[0], v1[1] - v2[1]];
		}

		function scale(v, factor) {
			return v.map(c => factor * c);
		}	

		function plus(v1, v2) {
			return v1.map((c1, i) => c1 + v2[i]);
		}

		function sq(v) {return v*v};




		function projection() {
			var x = d3.scaleLinear();
			var y = d3.scaleLinear();

			function p(val) {
				return [x(val[0]), y(val[1])];
			}

			p.invert = function(val) {
				return [x.invert(val[0]), y.invert(val[1])];
			}


			p.x_domain = function(_) {
				if (!arguments.length) return x.domain();
				x.domain(_);
				return p;
			}

			p.y_domain = function(_) {
				if (!arguments.length) return y.domain();
				y.domain(_);
				return p;
			}

			p.x_range = function(_) {
				if (!arguments.length) return x.range();
				x.range(_);
				return p;
			}

			p.y_range = function(_) {
				if (!arguments.length) return x.range();
				y.range(_);
				return p;
			}

			return p;
		}
	} 
})()