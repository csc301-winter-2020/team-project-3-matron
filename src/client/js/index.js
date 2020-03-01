//Edgehandles reference: https://cytoscape.org/cytoscape.js-edgehandles/

let cy = cytoscape({
	container: document.getElementById("cy"),
	layout: {
		name: "preset"
	},
	elements: [
		{
			data: {
				id: -1,
				label: "Test"
			},
			renderedPosition: {
				x: 0,
				y: 0
			}
		},
		{
			data: {
				id: -2,
				label: "Test2"
			},
			renderedPosition: {
				x: 1000,
				y: 1000
			}
		}
	],
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

let eh = cy.edgehandles({
	snap: true
});

let bg = cy.cyCanvas({
	zIndex: -1
})

let canvas = bg.getCanvas();
let ctx = canvas.getContext("2d");

$('.ui.dropdown')
  .dropdown({

  })
;

let img = new Image();
img.src = "https://johnsonportables.com/wp-content/uploads/2017/03/wmc-blueprint.jpg";
cy.on("render cyCanvas.resize", evt => {
	drawbackground();
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

		//console.log(cynode);

		let popper = cynode.popper({
		  content: () => {
			let info = document.querySelector('#node_info');
			info.style.display = "block";
			document.body.appendChild(info);
		    return info;
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

		//console.log(cy.elements().jsons());
		//console.log(cy.json());
	} else {
		// might be useful
		const selected_node = cy.$(':selected')[0];
	}
});


function drawbackground() {
	//console.log(bg);
	bg.resetTransform(ctx);
	bg.clear(ctx);
	bg.setTransform(ctx);

	ctx.save();
	ctx.drawImage(img, 0, 0);
}