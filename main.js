(function() {
	window.onload = function() {
		var svg = document.getElementById("main_svg");

		var box = svg.getBoundingClientRect();

		var width = box.width;
		var height = box.height;


		var earth = d3.select("#earth")
			.datum({x: width/2, y: height/2})
			.attr("cx", d => d.x)
			.attr("cy", d => d.y)
			.call(d3.drag()
	        .on("start", dragstarted)
	        .on("drag", dragged)
	        .on("end", dragended))

		var moon = d3.select("#moon")
			.datum({x: width/4, y: height/2})
			.attr("cx", d => d.x)
			.attr("cy", d => d.y)
			.call(d3.drag()
	        .on("start", dragstarted)
	        .on("drag", dragged)
	        .on("end", dragended))


		var G = 6.67384E-11;
		var M = 5.972E24;
		var d = 384000000;
		var v = 3683 * 1000 / 3600; // м/c

		var step = 3600;


		var real_to_virtual = d3.scaleLinear()
			.domain([0, d])
			.range([0, get_distance(moon.datum(), earth.datum())]);

		var moon_d = moon.datum();
		var earth_d = earth.datum();

		moon_d.vy = v;
		moon_d.vx = 0;

		var a = 0;
		var r;

		function tick() {
			a = G*M/(d^2);

			r = minus(earth_d, moon_d); 

			r_length = get_distance({x: 0, y: 0}, r);
			r_one = {x: r.x/r_length, y: r.y/r_length};

			a_v = scale(r_one, a);

			vx = moon_d.vx + a_v.x * step;
			vy = moon_d.vy + a_v.y * step; 

			console.log(vx, vy)
		}


		setInterval(tick, 100);

		function dragstarted(d) {
		  	d3.select(this).raise().classed("active", true);
		}

		function dragged(d) {
		  	d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
		}

		function dragended(d) {
		  	d3.select(this).classed("active", false);
		}

		function get_distance(p1, p2) {
			return Math.sqrt(sq(p1.x - p2.x) + sq(p1.y - p2.y));
		}

		function minus(v1, v2) {
			return {x: v1.x - v2.x, y: v1.y - v2.y};
		}

		function scale(v, factor) {
			return {x: v.x * factor, y: v.y * factor};
		}	

		function sq(v) {return v*v};
	} 
})()