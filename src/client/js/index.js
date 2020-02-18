//Edgehandles reference: https://cytoscape.org/cytoscape.js-edgehandles/

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
		},
		{
			selector: '.eh-handle',
			style: {
				'background-color': 'red',
				'width': 12,
				'height': 12,
				'shape': 'ellipse',
				'overlay-opacity': 0,
					'border-width': 12,
					'border-opacity': 0
			}
		},
		{
			selector: '.eh-hover',
			style: {
				'background-color': 'red'
			}
		},
		{
			selector: '.eh-source',
			style: {
				'border-width': 2,
				'border-color': 'red'
			}
		},
		{
			selector: '.eh-target',
			style: {
				'border-width': 2,
				'border-color': 'red'
			}
		},
		{
			selector: '.eh-preview, .eh-ghost-edge',
			style: {
				'background-color': 'red',
				'line-color': 'red',
				'target-arrow-color': 'red',
				'source-arrow-color': 'red'
			}
		},
		{
			selector: '.eh-ghost-edge.eh-preview-active',
			style: {
				'opacity': 0
			}
		}
	],
	wheelSensitivity: 0.2
});

var eh = cy.edgehandles();

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