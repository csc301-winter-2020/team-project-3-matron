let cyStyle = [
	{
		selector: "node",
		style: {
			"label": "data(label)",
			"background-color": 'gray'
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

let current_graph = '';
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

			let popper = popperNode.popper({
				content: () => {
					let node_input_card = document.querySelector('#node_info');
					node_input_card.style.display = "block";
					document.body.appendChild(node_input_card);
					clear_label_inputs();
					document.querySelector('#node_label_input').focus();
					return node_input_card;
				}
			});

			let update = () => {
				popper.scheduleUpdate();
			};

			popperNode.on("position", update);
			cy.on("pan zoom resize", update);

			unselectAll();
			popperNode.selectify();
			popperNode.select();
			popperNode.unselectify();
		} else {
			unselectAll();
		}

		ghost.disable();
		
		return;
	}

	if (!target.selected() && !e.originalEvent.ctrlKey) {
		unselectAll();
	}

	if (target.group() == "nodes") {
		popperNode = target;

		let popper = popperNode.popper({
			content: () => {
				let node_input_card = document.querySelector('#node_info');
				node_input_card.style.display = "block";
				document.body.appendChild(node_input_card);
				clear_label_inputs();

				$("#type_select").dropdown("restore defaults");
				
				document.querySelector('#node_label_input').value = popperNode.data("label");
				$("#type_select").dropdown("set selected", popperNode.data("type"));

				return node_input_card;
			}
		});

		let update = () => {
			popper.scheduleUpdate();
		};

		popperNode.on("position", update);
		cy.on("pan zoom resize", update);

		unselectAll();
		popperNode.selectify();
		popperNode.select();
		popperNode.unselectify();

		ghost.disable();
		return;
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
			add_new_node_type("hallway");
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
			add_new_node_type("hallway");
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
			add_new_node_type("hallway");
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
		
		console.log(selected);
		if (selected.some(e => e == popperNode)) {
			hidePopper();
		}
		cy.remove(selected);
	}
});

const info = document.querySelector('#node_info');
const node_label_input = document.querySelector('#node_label_input').value = '';

const save_btn = document.querySelector('#save_icon');
save_btn.addEventListener('click', saveGraph);
function saveGraph() {
	if (current_graph == "") {
		return;
	}

	let current_draft = {cyGraph: cy.json(), types: types};
	let url = `graph/${current_graph}`;
	fetch(url, {
		method: 'post',
		body: JSON.stringify(current_draft)
	});
	if (fileData != -1) {
		
		let url = `blueprint/${current_graph}`;

		console.log(file);
		fetch(url, {
			method: 'post',
			body: fileData
		});
	}
}

document.getElementById("floor_search").addEventListener("focusout", function(e) {
	let selected = document.querySelector(".text").firstChild;

	if (selected != null) {
		if (selected.lastChild != null) {
			selected.lastChild.style.display = "none";
		}
	}
});

function getMapNamesFromServer() {
	fetch('graph/names').then((resp) => resp.json()).then(function(data) {
		values = [];
		
		data.graph.forEach((name) => values.push({name: "<div>" + name + "<a class='item' id='delete_map'> <i id='ico' class='close icon delete_map_icon'></i> </a></div>", value: name}));

		$("#floor_search").dropdown({
			allowAdditions: true, 
			hideAdditions: false,
			values: values,
			onChange: function(value, name) {
				console.log(value, name);

				if (value == "" || values.some(val => val.value == value)) {
					document.querySelector('#create_floor_inputs').style.display = "none";
					document.querySelector('#edit_floor').style.display = 'block';
					document.querySelector('#edit_floor').classList.remove("negative");
					document.querySelector('#edit_floor').classList.add("positive");
					document.querySelector('#edit_floor').innerHTML = "Edit map"
					document.querySelector('#select_floor_header').innerText = 'Select unit';
					console.log("oldd");
				} else {
					document.querySelector('#create_floor_inputs').style.display = "block";
					document.querySelector('#edit_floor').style.display = 'none';
					document.querySelector('#select_floor_header').innerText = 'Create unit';
					console.log("new");
				}

				let delete_button = document.querySelector(".text").firstChild.lastChild
				if (delete_button != null) {
					delete_button.style.display = "none";
				}
			}
		});

		document.querySelectorAll("#delete_map").forEach((e1) => {
			e1.addEventListener("click", function(e2) {
				let name = e1.parentNode.parentNode.textContent.trim();
				e1.parentNode.parentNode.remove();

				// reset value of dropdown if current selection gets deleted
				let curValue = $("#floor_search").dropdown("get value").trim();

				if (name == curValue) {
					console.log("match");
					$("#floor_search").dropdown("restore defaults");
				}				

				fetch(`graph/${name}`, {
					method: 'delete'
				});
			})
		});

	});
}

getMapNamesFromServer();

let file = -1;
let fileData = -1;
let fileImage = -1;
const reader = new FileReader();
reader.addEventListener("load", function (e) {
	console.log(e.target.result);
	fileData = e.target.result;

	fileImage = new Image();
	fileImage.src = e.target.result;
}, false);
function getImageData() {
	file = document.querySelector('input[type=file]').files[0];
}

let types = [];

// Create/Select Buttons
const edit_floor_btn = document.querySelector('#edit_floor');
edit_floor_btn.addEventListener('click', (e) => {
	current_graph = $("#floor_search").dropdown("get value");
	fetch(`graph/${current_graph}`).then((resp) => resp.json()).then(function(data) {
		if (data.graph.types) {
			data.graph.types.forEach((e) => {
				types.push(e);
			});
		}
		fillTypes();
		if (data.graph.cyGraph.elements.nodes) {
			console.log(data.graph.cyGraph.elements.nodes);
			cy.add(data.graph.cyGraph.elements);
		}
	});

	fetch(`blueprint/${current_graph}`).then((resp) => resp.json()).then(function(data) {
		console.log(data);

		if (data != -1) {
			fileImage = new Image();
			fileData = data;
			fileImage.src = fileData;

			// Force rerender
			document.querySelector('#cy').style.visibility = 'hidden';
			document.querySelector('#cy').style.visibility = 'visible';
		}
	});

	console.log(types);
	document.querySelector('#select_floor').style.display = 'none';
	document.querySelector('#cy').style.visibility = 'visible';
});

const create_floor_btn = document.querySelector('#create_floor');
create_floor_btn.addEventListener('click', (e) => {
	img_src = document.querySelector('#img');
	// load empty graph with this img (we'll send it to server on save)
	current_graph = ($('.ui.dropdown').dropdown("get value")[0]);
	let url = `graph/${current_graph}`;
	//let current_draft = {cyGraph: cy.json(), types: types};
	fetch(url, {
		method: 'post',
		body: JSON.stringify({cyGraph: cy.json(), types: types})
	});

	if (file != -1) {
		reader.readAsDataURL(file);
	}

	document.querySelector('#select_floor').style.display = 'none';
	document.querySelector('#cy').style.visibility = 'visible';
});


let canvasLayer = cy.cyCanvas({
	zIndex: -1
})
let canvas = canvasLayer.getCanvas();
let ctx = canvas.getContext("2d");

cy.on("render cyCanvas.resize", e => {
	drawBG();
});

function drawBG() {
	if (fileData != -1) {
		canvasLayer.resetTransform(ctx);
		canvasLayer.clear(ctx);
		canvasLayer.setTransform(ctx);
		ctx.save();
		ctx.globalAlpha = 0.5;
		ctx.drawImage(fileImage, 0, 0, fileImage.width*2, fileImage.height*2);
	}
}

// Popper stuff
const type_list = document.querySelector('#type_list');
const colors = ['green', 'orange', 'red', 'blue', 'olive', 'teal', , 'violet', 'purple', 'pink', 'brown', 'black'];

// let types = [{name: "Patient Room", color: "green"}, {name: "Supply Room", color: "orange"}];
// // should really get from server returned map, we need to store manually alongside cy.json();

function fillTypes() {
	for (let i=0; i<types.length; i++) {
		let div = document.createElement('div');
		div.innerHTML = `<div class="item" data-value="${types[i].name}"> <a class="ui ${types[i].color} empty circular label"></a> ${types[i].name} </div>`;
		type_list.appendChild(div.firstChild);
		cy.style().selector("node[type = '" + types[i].name + "']").style({"background-color": types[i].color}).update();
	}
}

$("#type_select").dropdown({
	allowAdditions: true, 
	hideAdditions: false,
	onChange: function(value, name) {
		console.log(value, name);
		if (popperNode != -1) {
			popperNode.data("type", value);

			let input_label = document.querySelector('#node_label_input').value;
			let input_type = $("#type_select").dropdown("get value");
			if (input_label == "") {
				set_type_btn.classList.remove("positive");
				set_type_btn.classList.add("negative");
				set_type_btn.innerHTML = "Enter label";
				return
			}
			if (input_type == "") {
				set_type_btn.classList.remove("positive");
				set_type_btn.classList.add("negative");
				set_type_btn.innerHTML = "Enter type";
				return
			}
			set_type_btn.classList.remove("negative");
			set_type_btn.classList.add("positive");
			set_type_btn.innerHTML = "Save node";
		}
	}
});

document.querySelector('#node_label_input').addEventListener("input", function(e) {
	let input_label = document.querySelector('#node_label_input').value;
	let input_type = $("#type_select").dropdown("get value");
	if (input_label == "") {
		set_type_btn.classList.remove("positive");
		set_type_btn.classList.add("negative");
		set_type_btn.innerHTML = "Enter label";
		return
	}
	if (input_type == "") {
		set_type_btn.classList.remove("positive");
		set_type_btn.classList.add("negative");
		set_type_btn.innerHTML = "Enter type";
		return
	}
	set_type_btn.classList.remove("negative");
	set_type_btn.classList.add("positive");
	set_type_btn.innerHTML = "Save node";
});

const set_type_btn = document.querySelector('#set_type');
set_type_btn.addEventListener("click", (e) => {

	let input_label = document.querySelector('#node_label_input').value;
	let input_type = $("#type_select").dropdown("get value");

	console.log(input_label, input_type);
	if (set_type_btn.classList.contains("negative")) {
		return;
	}

	if (!types.some(type => type.name == input_type)) {
		add_new_node_type(input_type);
	}
	
	popperNode.data("label", input_label);
	hidePopper();
	clear_label_inputs();
});

function hidePopper() {
	if (popperNode != -1) {
		popperNode.off("position");
		cy.off("pan zoom resize");
		popperNode = -1;
		info.style.display = "none";
	}
}

function add_new_node_type(type_name){
	if (types.some(e => e.name == type_name)) {
		return;
	}

	let color = colors[types.length%colors.length];
	let div = document.createElement('div');
	div.innerHTML = `<div class="item" data-value="${type_name}"> <a class="ui ${color} empty circular label"></a> ${type_name} </div>`;
	type_list.appendChild(div.firstChild);
	types.push({name: type_name, color: color});
	cy.style().selector("node[type = '" + type_name + "']").style({"background-color": color}).update();
}

function clear_label_inputs(){
	$("#type_select").dropdown("restore defaults");
	document.querySelector('#node_label_input').value = "";
	set_type_btn.classList.remove("positive");
	set_type_btn.classList.add("negative");
	set_type_btn.innerHTML = "Enter label";
	//document.querySelector('#node_label_input').focus();
}

const matron_btn = document.querySelector('#matron');
matron_btn.addEventListener("click", (e) => {
	location.reload();
});

const distance_btn = document.querySelector('#distance_btn');
const distance_result_div = document.querySelector('#distance_result_div');
const distance_icon = document.querySelector('#distance_icon');

distance_icon.addEventListener('click', (e) =>{

	if (current_graph == "") {
		return
	}

	distance_result_div.style.display = 'none';
	$('.ui.modal')
		.modal('show')
	;
});

distance_btn.addEventListener('click', (e) =>{
	distance_result_div.style.display = 'block';
	let node1_label = document.querySelector('#node1').value;
	let node2_label = document.querySelector('#node2').value;

	if (node1_label == "" || node2_label == "") {
		document.querySelector('#dist_result').innerText = "Cannot search for empty room.";
		return;
	}

	let node1 = cy.$("node[label='" + node1_label + "']");
	let node2 = cy.$("node[label='" + node2_label + "']");

	if (node1.length == 0 && node2.length == 0) {
		document.querySelector('#dist_result').innerText = "Neither room was not found.";
		return;
	} else if (node1.length == 0) {
		document.querySelector('#dist_result').innerText = "First room was not found.";
		return;
	} else if (node2.length == 0) {
		document.querySelector('#dist_result').innerText = "Second room was not found.";
		return;
	}

	node1 = node1[0].id();
	node2 = node2[0].id();

	fetch(`graph/distance_two_rooms/${current_graph}/${node1}/${node2}`).then((resp) => resp.json()).then(function(data) {
		document.querySelector('#dist_result').innerText = "distance : " + data;
	});	
});