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



		function dragstarted(d) {
		  	d3.select(this).raise().classed("active", true);
		}

		function dragged(d) {
		  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
		}

		function dragended(d) {
		  d3.select(this).classed("active", false);
		}

	} 
})()