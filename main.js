(function() {
	window.onload = function() {
		var svg = document.getElementById("main_svg");

		var box = svg.getBoundingClientRect();

		var width = box.width;
		var height = box.height;


		console.log(box)



	} 
})()