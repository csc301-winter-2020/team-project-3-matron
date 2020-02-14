let cy = cytoscape({
	container: document.getElementById("cy"),
	layout: {
		name: "preset"
	},
	style: [
		{
			selector: "node",
			style: {
				"label": "data(id)"
			}
		}
	],
	wheelSensitivity: 0.2
});

let i = 0;
cy.on("tap", function(e) {
	if (e.target == cy) {
		cy.add({
			data: {
				id: i++
			},
			renderedPosition: {
				x: e.renderedPosition.x,
				y: e.renderedPosition.y
			}
		});
	}
});