//Edgehandles reference: https://cytoscape.org/cytoscape.js-edgehandles/

let cy = cytoscape({
	container: document.getElementById("cy"),
	layout: {
		name: "preset"
	},
	style: [
		{
			selector: "node[label]",
			style: {
				"label": "data(label)"
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

var eh = cy.edgehandles({
	snap: true
});

let i = 0;
cy.on("tap", function(e) {
	if (e.target == cy) {
		let node = {
			data: {
				id: i,
				label: "Room 301"
			},
			renderedPosition: {
				x: e.renderedPosition.x,
				y: e.renderedPosition.y
			}
		}
		cy.add(node);

		let cynode = cy.getElementById(i);

		console.log(cynode);

		let popper = cynode.popper({
		  content: () => {
		    let div = document.createElement('div');
		    div.innerHTML = 'Node spec input fields';
		    document.body.appendChild(div);
		    return div;
		  }
		});

		//HOW THE FORM CAN CHANGE THE NODE LABEL
		cynode.data("label", "new labelelele");

		let update = () => {
		  popper.scheduleUpdate();
		};
		cynode.on('position', update);
		cy.on('pan zoom resize', update);

		i += 1;

		console.log(cy.elements().jsons());
		console.log(cy.json());
	}
});