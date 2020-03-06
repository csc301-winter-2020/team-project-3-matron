let cyStyle = [
	{
		selector: "node",
		style: {
			"label": "data(label)",
		}
	},
	{
		selector: ":selected",
		style: {
			"border-width": "5px",
			"border-color": "cyan",
			"line-color": "cyan"
		}
	},
	{
		selector: ":active",
		style: {
			"overlay-opacity": "0"
		}
	},
	{
		selector: ".hover",
		style: {
			"border-width": "5px",
			"border-color": "cyan",
			"line-color": "cyan"
		}
	},
	{
		selector: ".noEvent",
		style: {
			"events": "no"
		}
	},
	{
		selector: ".ghostCursor",
		style: {
			"visibility": "hidden",
			"events": "no"
		}
	},
	{
		selector: ".ghostEdge",
		style: {
			"events": "no",
			"line-style": "dashed"
		}
	},
	{
		selector: "node[type = 'hallway']",
		style: {
			"background-color": 'red',
			"width": "10",
			"height": "10"
		}
	}
]

let defaulttHoverThresh = [5,1];
let ghostHOverThresh = [25, 5];
setHoverThresh(defaulttHoverThresh[0], defaulttHoverThresh[1]);

let cy = cytoscape({
	container: document.getElementById("cy"),
	layout: {
		name: "preset"
	},
	style: cyStyle,
	wheelSensitivity: 0.2
});

function mod(n, m) {
	return ((n%m)+m)%m;
}

function setHoverThresh(node, edge) {
	window.nodeThreshMultiplier = node;
	window.edgeThreshMultiplier = edge;
}

function unselectAll() {
	cy.$(":selected").forEach(e => {
		e.selectify();
		e.unselect();
		e.unselectify();
	});
}

function toggleSelected(e) {
	e.selectify();
	if (e.selected()) {
		e.unselect();
	} else {
		e.select();
	}
	e.unselectify();
}

function addEdge(cyNode1, cyNode2) {
	if (cyNode1 == cyNode2) {
		return;
	}

	let id1 = cyNode1.id() + "-" + cyNode2.id();
	let id2 = cyNode2.id() + "-" + cyNode1.id();

	if (cy.$id(id1)[0] || cy.$id(id2)[0]) {
		return;
	}

	let edge = {
		data: {
			id: id1,
			label: "",
			source: cyNode1.id(),
			target: cyNode2.id(),
		},
		classes: []
	}
	return cy.add(edge);
}

function addNode(posX, posY) {
	let node = {
		data: {
			label: "",
			type: ""
		},
		position: {
			x: posX,
			y: posY
		},
		classes: []
	}
	return cy.add(node)[0];
}

let ghost = {
	enabled: false,
	source: -1,
	cursor: -1,
	edge: -1,
	snapPos: -1,
	enable: function() {
		this.enabled = true;
		if (this.cursor != -1) {
			cy.remove(this.cursor);
		}
		this.cursor = addNode(0,0);
		this.cursor.addClass("ghostCursor");
		setHoverThresh(ghostHOverThresh[0], ghostHOverThresh[1]);
	},
	disable: function() {
		this.enabled = false;
		if (this.source != -1) {
			this.source.removeClass("noEvent");
		}
		if (this.cursor != -1) {
			cy.remove(this.cursor);
		}
		setHoverThresh(defaulttHoverThresh[0], defaulttHoverThresh[1]);
	},
	redraw: function() {
		if (this.source != -1) {
			if (this.edge != -1) {
				cy.remove(this.edge);
			}
			this.edge = addEdge(this.source, this.cursor);
			this.edge.addClass("ghostEdge");
		}
	},
	setSource: function(src) {
		if (this.source != -1) {
			this.source.removeClass("noEvent");
		}
		this.source = src;
		this.source.addClass("noEvent");
	},
	updateCursor: function(x,y) {
		if (this.cursor == -1) {return;}
		this.cursor.position({x:x, y:y});
	}
}

let popperNode = -1;
cy.on("tap", function(e) {
	let target = e.target;

	if (popperNode != -1) {
		return;
	}

	if (target == cy) {
		if (!ghost.enabled) {
			let newNode = addNode(e.position.x, e.position.y);
			popperNode = newNode;

			let popper = newNode.popper({
				content: () => {
					let node_input_card = document.querySelector('#node_info');
					node_input_card.style.display = "block";
					document.body.appendChild(node_input_card);
					clear_label_inputs();
					return node_input_card;
				}
			});

			let update = () => {
				popper.scheduleUpdate();
			};

			newNode.on("position", update);
			cy.on("pan zoom resize", update);
		}
		
		ghost.disable();
		unselectAll();
		return;
	}

	if (!target.selected() && !e.originalEvent.ctrlKey) {
		unselectAll();
	}

	ghost.disable();
	toggleSelected(target);	
});

cy.on("cxttapend", function(e) {
	let target = e.target;
	let hovered = cy.$(".hover")[0];

	if (popperNode != -1) {
		return;
	}

	if (!ghost.enabled) {
		if (hovered && hovered.group() == "nodes") {
			
			ghost.enable();
			ghost.setSource(hovered);
			ghost.updateCursor(e.position.x, e.position.y);
			ghost.redraw();
			return;
		}

		if (target == cy) {
			let newNode = addNode(e.position.x, e.position.y);
			newNode.data("type", "hallway");

			ghost.enable();
			ghost.setSource(newNode);
			ghost.updateCursor(e.position.x, e.position.y);
			ghost.redraw();
			return;
		}
	} else {
		if (!hovered) {
			let newNode = addNode(e.position.x, e.position.y);
			newNode.data("type", "hallway");
			addEdge(ghost.source, newNode);
			ghost.setSource(newNode)
			ghost.redraw();
			return;
		}

		if (hovered.group() == "nodes") {
			addEdge(ghost.source, hovered);
			ghost.setSource(hovered);
			ghost.redraw();
			return;
		}

		if (hovered.group() == "edges") {
			let source = hovered.source();
			let target = hovered.target();

			if (ghost.source == source || ghost.source == target) {
				return;
			}

			let intersectPos = window.finiteLinesIntersect(
				e.position.x,
				e.position.y,
				e.position.x + (target.position().y - source.position().y),
				e.position.y + (source.position().x - target.position().x),

				source.position().x,
				source.position().y,
				target.position().x,
				target.position().y,

				true
			);

			cy.remove(hovered);
			let newNode = addNode(intersectPos[0], intersectPos[1]);
			newNode.data("type", "hallway");
			addEdge(newNode, source);
			addEdge(newNode, target);
			addEdge(newNode, ghost.source);
			ghost.setSource(newNode);
			ghost.redraw();
		}
	}
});

cy.on("mousemove", function(e) {
	ghost.updateCursor(e.position.x, e.position.y);
});

cy.on("mouseover", "elements", function(e) {
	e.target.addClass("hover");
});

cy.on("mouseout", "elements", function(e) {
	e.target.removeClass("hover");
});

cy.on("cxtdragout", "elements", function(e) {
	e.target.removeClass("hover");
});

cy.on("boxstart", function(e) {
	ghost.disable();
})

cy.on("box", "elements", function(e) {
	let target = e.target;
	toggleSelected(target);
})

window.addEventListener("keydown", function(e) {
	if (e.code == "Escape") {
		ghost.disable();
	}

	if (e.code == "KeyX") {
		let selected = cy.$(":selected");
		cy.remove(selected);

	}
});

const info = document.querySelector('#node_info');
const node_label_input = document.querySelector('#node_label_input').value = '';

function getGraph() {
	return cy.json();
}

function getMapFromServer(name) {
	return [];
}

function getMapNamesFromServer() {
	fetch('graph/names').then((resp) => resp.json()).then(function(data) {
		values = [];
		
		data.graphs.forEach((name) => values.push({name: name, value: name}));

		$("#floor_search").dropdown({
			allowAdditions: true, 
			hideAdditions: false,
			values: values,
			onChange: function(value, name) {
				console.log(value, name);

				// if exists in list
				if (values.some(value => value.name == name)) {
					document.querySelector('#create_floor_inputs').style.display = "none";
					document.querySelector('#edit_floor').style.display = 'block';
					document.querySelector('#select_floor_header').innerText = 'Select unit';

					getMapFromServer(value);
				} else {
					document.querySelector('#create_floor_inputs').style.display = "block";
					document.querySelector('#edit_floor').style.display = 'none';
					document.querySelector('#select_floor_header').innerText = 'Create unit';

					// load blueprint if one has been uploaded
				}
			}
		});
	});
}
getMapNamesFromServer();

// Create/Select Buttons
const edit_floor_btn = document.querySelector('#edit_floor');
edit_floor_btn.addEventListener('click', (e) => {
	let graph_name = $("#floor_search").dropdown("get value");

	fetch('graph/adit', {
		method: 'get',
	}).then(response => {
		console.log(response)
	});

	// now load the graph and image returned by the server
	console.log(graph_name);

	document.querySelector('#select_floor').style.display = 'none';
	document.querySelector('#cy').style.visibility = 'visible';
});

const create_floor_btn = document.querySelector('#create_floor');
create_floor_btn.addEventListener('click', (e) => {
	img_src = document.querySelector('#img');
	// load empty graph with this img (we'll send it to server on save)
	const graph_name = ($('.ui.dropdown').dropdown("get value")[0]);
	let url = `graph/${graph_name}`;
	graph = {};
	fetch(url, {
	  method: 'post',
	  body: JSON.stringify({"data": '3'})
	});

	document.querySelector('#select_floor').style.display = 'none';
	document.querySelector('#cy').style.visibility = 'visible';
});

// extract the data from the uploaded image file.
function getImageData() {
	const file = document.querySelector('input[type=file]').files[0];
	const reader = new FileReader();
	reader.addEventListener("load", function () {
	  // convert image file to base64 string
	  //data = reader.result;
	  //console.log(reader.result);
	}, false);
}

// Popper stuff
const type_list = document.querySelector('#type_list');
const colors = ['green', 'orange', 'red', 'blue', 'olive', 'teal', , 'violet', 'purple', 'pink', 'brown', 'grey', 'black'];

let types = [{name: "Patient Room", color: "green"}, {name: "Supply Room", color: "orange"}];
// should really get from server returned map, we need to store manually alongside cy.json();

for (let i=0; i<types.length; i++) {
	let div = document.createElement('div');
	div.innerHTML = `<div class="item" data-value="${types[i].name}"> <a class="ui ${types[i].color} empty circular label"></a> ${types[i].name} </div>`;
	type_list.appendChild(div.firstChild);

	cy.style().selector("node[type = '" + types[i].name + "']").style({"background-color": types[i].color}).update();
}

$("#type_select").dropdown({
	allowAdditions: true, 
	hideAdditions: false
});

const set_type_btn = document.querySelector('#set_type');
set_type_btn.addEventListener("click", (e) => {

	let input_label = document.querySelector('#node_label_input').value;
	let input_type = $("#type_select").dropdown("get value");

	console.log(input_label, input_type);

	if (!types.some(type => type.name == input_type)) {
		add_new_node_type(input_type);
	}

	popperNode.data("label", input_label);
	popperNode.data("type", input_type);
	popperNode.off("position");
	cy.off("pan zoom resize");
	popperNode = -1;
	info.style.display = "none";
});

function add_new_node_type(type_name){
	let color = colors[types.length%colors.length];
	let div = document.createElement('div');
	div.innerHTML = `<div class="item" data-value="${type_name}"> <a class="ui ${color} empty circular label"></a> ${type_name} </div>`;
	type_list.appendChild(div.firstChild);
	types.push({name: type_name, color: color});
	cy.style().selector("node[type = '" + type_name + "']").style({"background-color": color}).update();
}

function clear_label_inputs(){
	$("#type_select").dropdown("restore defaults");
}

function save_graph(name){
	let url = `http://localhost:5000/graph/${name}`;
	const create_request = new Request(url, {method: 'POST', body: '{"foo": "bar"}'});
	fetch(create_request).then(response => console.log(response));
}