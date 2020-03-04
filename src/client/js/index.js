//Edgehandles reference: https://cytoscape.org/cytoscape.js-edgehandles/
const info = document.querySelector('#node_info');
const node_label_input = document.querySelector('#node_label_input').value = '';

// required for dropdown animation of semantic ui
$('.ui.dropdown')
  .dropdown({

  });

const new_type_btn = document.querySelector('#add_new_type');
const types = ['Supply', 'Treatment'];

const floor_input = document.querySelector('.search').childNodes[5];

// initialized later
let input;


const edit_floor_btn = document.querySelector('#edit_floor');

edit_floor_btn.addEventListener('click', (e) => {

	document.querySelector('#select_floor').style.display = 'none';
	cy = cytoscape({
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
	
	eh = cy.edgehandles({
		snap: true
	});
	
	bg = cy.cyCanvas({
		zIndex: -1
	})
	
	canvas = bg.getCanvas();
	ctx = canvas.getContext("2d");
	img = new Image();
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
				let node_input_card = document.querySelector('#node_info');
				node_input_card.style.display = "block";
				document.body.appendChild(node_input_card);
				clear_label_inputs();
				return node_input_card;
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
	input = document.querySelector('#node_info').querySelector('.search').childNodes[5];;
	console.log(input);
	input.addEventListener("keyup", function(event) {
		//"Enter" key on the keyboard
		console.log('pressed');
		const new_type = input.value;
		document.querySelector('.message').innerText = `press enter create type ${new_type}`;
		if (event.keyCode === 13) {
		  event.preventDefault();
		  console.log(types.indexOf(new_type));
	  
		  console.log(new_type);
		  if (new_type != ""){
			  if (confirm("Create a new node type " + new_type + " ?")){
				  add_new_node_type(new_type);
				  clear_label_inputs();
			  };
		  }
		}
	  });

});

floor_input.addEventListener("keyup", function(event) {
	
	const new_type = floor_input.value;
	document.querySelector('.message').innerText = 'press enter create new floor';
	if (event.keyCode === 13) {
		event.preventDefault();
		console.log(types.indexOf(new_type));

		console.log(new_type);
		if (new_type != ""){
			if (confirm("Create a new floor " + new_type + " ?")){
				return true;
			};
		}
	}
});


 // hard coded colors for new types :
const colors = ['green', 'orange', 'red', 'yellow', 'olive', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey', 'black'];
function add_new_node_type(name){
	// make the element, with a possible hard coded color option
	// append the element to the list
	types.push(name)
	info.style.display = "none";
	const type_list = document.querySelector('#type_list');
	let div = document.createElement('div');
	div.innerHTML = `<div class="item" data-value="${types.length}"> <a class="ui ${colors[types.length]} empty circular label"></a> ${name} </div>`;
	type_list.appendChild(div.firstChild);
}

function drawbackground() {
	//console.log(bg);
	bg.resetTransform(ctx);
	bg.clear(ctx);
	bg.setTransform(ctx);

	ctx.save();
	ctx.drawImage(img, 0, 0);
}

function clear_label_inputs(){
	console.log('clearing label inputs');
	document.querySelector('#node_label_input').value = '';
	document.querySelector('.search').childNodes[5].value = '';
}