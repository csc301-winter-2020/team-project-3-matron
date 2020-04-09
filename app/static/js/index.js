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
	},
	{
		selector: "node[?rescaled]",
		style: {
			"width": '50%',
		}
	},
	{
		selector: "node[?debug]",
		style: {
			"shape": 'diamond',
		}
	},
	{
		selector: ".desiredpath",
		style: {
			"line-color": "red",
			"width": "10"
		}
	},
]

let current_graph = '';
let types = [];
let defaulttHoverThresh = [8,1];
let ghostHOverThresh = [25, 5];
setHoverThresh(defaulttHoverThresh[0], defaulttHoverThresh[1]);

let changed_graph = false;

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

function addEdge(cyNode1, cyNode2, cyInstance) {
	// if (!cy.$id(cyNode1.id())[0] || !cy.$id(cyNode2.id())[0]) {
	// 	return;
	// }
	

	cyInstance = cyInstance || cy;


	if (cyNode1 == cyNode2) {
		return;
	}

	let id1 = cyNode1.id() + "-" + cyNode2.id();
	let id2 = cyNode2.id() + "-" + cyNode1.id();

	if (cyInstance.$id(id1)[0] || cyInstance.$id(id2)[0]) {
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
	
	let cyEdge = cyInstance.add(edge);
	cyEdge.unselectify();
	cyEdge.ungrabify();
	log("changed graph");

	changed_graph = (cyInstance == cy);

	return cyEdge;
}

function addNode(posX, posY, cyInstance) {
	changed_graph = true;
	log("changed graph");
	cyInstance = cyInstance || cy;
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
	let cyNode = cyInstance.add(node)[0];
	cyNode.unselectify();
	cyNode.ungrabify();
	return cyNode;
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
	if (tool == "Smart") {
		smartTap(e);
	} else if (tool == "Add Nodes") {
		addNodesTap(e);
	} else if (tool == "Add Edges") {
		ghost.disable();
	} else if (tool == "Edit Nodes") {
		editNodesTap(e);
	} else if (tool == "Delete") {
		deleteNodesTap(e);
	}
});

function deleteNodesTap(e) {
	let target = e.target;
	if (target == cy) {
		return;
	}

	resetRescaler();
	cy.remove(target);
}

// cy.on("tapstart", function(e) {
// 	let target = e.target;
// 	if (target == cy) {
// 		return;
// 	}

// 	if (target.group() == "nodes" && tool == "Smart") {
// 		target.grabify();
// 	}
// });

// cy.on("tapend", function(e) {
// 	let target = e.target;
// 	if (target == cy) {
// 		return;
// 	}

// 	if (target.group() == "nodes") {
// 		target.ungrabify();
// 	}
// });

function randomHex() {
	// from comments in https://www.paulirish.com/2009/random-hex-color-code-snippets/
	let hex = '#'+ ('000000' + (Math.random()*0xFFFFFF<<0).toString(16)).slice(-6);
	log(hex);
	return hex;
}

function addNodesTap(e) {
	let target = e.target;

	// create a new node
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

			colorPicker.color.hexString = randomHex();
		} else {
			unselectAll();
		}
		ghost.disable();
		return;
	}

	ghost.disable();
}

function editNodesTap(e) {
	let target = e.target;

	if (target == cy) {
		return;
	}

	if (target.group() != "nodes") {
		return;
	}

	popperNode = target;
	let popper = popperNode.popper({
		content: () => {
			let node_input_card = document.querySelector('#node_info');
			node_input_card.style.display = "block";
			document.body.appendChild(node_input_card);
			// clear_label_inputs();

			// $("#type_select").dropdown("restore defaults");
			
			document.querySelector('#node_label_input').value = popperNode.data("label");
			$("#type_select").dropdown("set selected", popperNode.data("type"));
			// colorPicker.color.hexString = randomHex();

			let typelist_index = types.findIndex(typ=>typ.name == popperNode.data("type"));
			if (typelist_index != -1) {
				colorPicker.color.hexString = types[typelist_index].color;
			}

			changeLabel();

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

function smartTap(e) {
	let target = e.target;
	// create a new node
	if (target == cy) {
		addNodesTap(e);
		return;
	}

	// if we're not holding control, deslect everything (if we clicked on a node we'll reselect it later)
	if (!e.originalEvent.ctrlKey) {
		log("ttettetetet");
		unselectAll();
		//return;
	}

	if (target.group() == "nodes") {
		target.grabify();

		log(target);
		// log(target.data("type"));

		if (target.data("type") == "hallway" || e.originalEvent.ctrlKey) {
			toggleSelected(target);	
			return;
		}

		editNodesTap(e);
		return;
	}

	ghost.disable();
	toggleSelected(target);
}

function addEdgesCxtTap(e) {
	if (tool != "Smart" && tool != "Add Edges") {
		return;
	}

	let target = e.target;
	let hovered = cy.$(".hover")[0];

	unselectAll();

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
			// ghost.setSource(hovered);
			// ghost.redraw();
			ghost.disable();
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
			// ghost.setSource(newNode);
			// ghost.redraw();
			ghost.disable();
		}
	}
}

cy.on("cxttapend", function(e) {


	// if (popperNode != -1) {
	// 	return;
	// }
	addEdgesCxtTap(e);

});

cy.on("mousemove", function(e) {
	ghost.updateCursor(e.position.x, e.position.y);
});

cy.on("mouseover", "elements", function(e) {
	e.target.addClass("hover");
	if (tool == "Smart") {
		e.target.grabify();
	}	
});

cy.on("mouseout", "elements", function(e) {
	e.target.removeClass("hover");
	e.target.ungrabify();
});

cy.on("cxtdragout", "elements", function(e) {
	e.target.removeClass("hover");
});

cy.on("boxstart", function(e) {
	ghost.disable();
})

cy.on("box", "elements", function(e) {
	if (tool != "Smart") {
		return;
	}

	let target = e.target;
	toggleSelected(target);
})

cy.on("drag", "elements", function(e) {
	changed_graph = true;
	ghost.disable();
})

window.addEventListener("keydown", function(e) {
	console.log(e)

	if (e.key == "Escape" || e.key == "Esc") {
		ghost.disable();
		hidePopper();
	}

	if (e.key == "x" && (tool == "Smart" || tool == "Delete")) {
		resetRescaler();
		log(document.activeElement);
		if (document.activeElement != document.body) {
			return;
		}

		let selected = cy.$(":selected");
		
		log(selected);
		if (selected.some(e => e == popperNode)) {
			hidePopper();
		}

		if (selected.data("type")) {
			if (cy.$("[type = '"+ selected.data("type") +"']").length == 1) {
				types = types.filter(type => type.name != selected.data("type"));
				fillTypes();
			}
		}

		cy.remove(selected);
	}
});

function duplicateLabelCheck() {
	let labels = {};
	let nodes = cy.nodes();

	for (let i=0; i<nodes.length; i++ ) {
		let n = nodes[i];

		if ((!n.data("type")) || n.data("type") != "hallway") {
			let label = n.data("label");

			if (label in labels) {
				return label;
			}

			labels[label] = 1;
		}	
	}
	//log(labels);
	return false;
}

const info = document.querySelector('#node_info');
const node_label_input = document.querySelector('#node_label_input').value = '';

const save_btn = document.querySelector('#save_icon');
save_btn.addEventListener('click', saveGraph);
function saveGraph() {
	changed_graph = false;

	unselectAll();
	unHoverAll();
	log(current_graph);
	if (current_graph == "") {
		return;
	}

	let duplicateLabel = duplicateLabelCheck();
	if (duplicateLabel !== false) {
		if (!window.confirm("You have duplicate label '" + duplicateLabel + "'.\nDistance queries will not work on this graph.\nContinue?")) {
			return;
		}
	}

	log('SAVED');

	let graph = cy.json();

	// log(graph.elements.nodes);
	// log(graph.elements.edges);

	if (!graph.elements.nodes) {
		graph.elements.nodes = [];
	}

	if (!graph.elements.edges) {
		graph.elements.edges = [];
	}
	let url = `both/${current_graph}`;
	let _graph = cy.json();
	_graph.types = types;
	_graph.blueprint_scale = blueprint_scale;

	// log(_graph);
	let blueprint = fileImage == -1 ? "" : fileImage.src;

	let body;
	if (new_graph_name != ''){
		body = JSON.stringify({graph: _graph, blueprint: blueprint, new_name: new_graph_name});
		current_graph = new_graph_name;
		new_graph_name = '';
	} else {
		body = JSON.stringify({graph: _graph, blueprint: blueprint})
	}
	fetch(url, {
		method: 'post',
		body: body
	}).then(res=>{
		load_graph_versions();
	});
	if (rescale_complete) {
		rescale_menu.style.visibility = "hidden";
		progress_bar.style.display = "none";
	}
}

function unHoverAll() {
	cy.$(".hover").forEach(e => {
		log(e);
		e.removeClass("hover");
	});
}

let mapnames = [];

function fillmapnames(names) {
	names.forEach((name) => {
		// log(name);
		// if (name.trim() == "demo") {
		// 	values.push({name: "<div>" + name + "<a class='item remove_map_btn' id='no_delete'> <i id='ico' class='ban icon'></i> </a></div>", value: name});
		// } else {
			mapnames.push({name: "<div>" + name + "<a class='item remove_map_btn' id='delete_map'> <i id='ico' class='close icon delete_map_icon'></i> </a></div>", value: name});
		//}
	});
}

function getMapNamesFromServer() {
	fetch('graph/names').then((resp) => resp.json()).then(function(data) {
		fillmapnames(data.graph);

		if (urlMapName != "") {
			log(mapnames);
			log(urlMapName);
			if (mapnames.some(name=>name.value==urlMapName)) {
				current_graph = urlMapName;
				editFloor(urlMapName);
			} else {
				window.history.replaceState({}, "Matron", "/");
			}
		}

		$("#floor_search").dropdown({
			allowAdditions: true, 
			hideAdditions: false,
			values: mapnames,
			forceSelection: true,
			onChange: function(value, name) {
				log(value, name);

				if (value == "" || mapnames.some(val => val.value == value)) {
					document.querySelector('#create_floor_inputs').style.display = "none";
					document.querySelector('#edit_floor').style.display = 'block';
					document.querySelector('#edit_floor').classList.remove("negative");
					document.querySelector('#edit_floor').classList.add("positive");
					document.querySelector('#edit_floor').innerHTML = "Edit map"
					document.querySelector('#select_floor_header').innerText = 'Select unit';
					log("oldd");
				} else {
					document.querySelector('#create_floor_inputs').style.display = "block";
					document.querySelector('#edit_floor').style.display = 'none';
					document.querySelector('#select_floor_header').innerText = 'Create unit';
					
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
					log("match");
					$("#floor_search").dropdown("restore defaults");
				}				

				deleteMap(name);

				mapnames = mapnames.filter(function(value, index, arr) {
					return value.value != name;
				})
				// log(mapnames);
				//getMapNamesFromServer();
			})
		});

	});
}

function deleteMap(name) {
	fetch(`graph/${name}`, {
		method: 'delete'
	});
}

getMapNamesFromServer();

let file = -1;
let fileData = -1;
let fileImage = -1;
const reader = new FileReader();
var new_graph_name = '';
reader.addEventListener("load", function (e) {
	// Force rerender
	document.querySelector('#cy').style.visibility = 'hidden';
	document.querySelector('#cy').style.visibility = 'visible';

	//log(e.target.result);
	fileData = e.target.result;
	let url = `both/${current_graph}`;
	let _graph = cy.json()
	_graph.types = types;
	fetch(url, {
		method: 'post',
		body: JSON.stringify({graph: _graph, blueprint: fileData, new_name: new_graph_name})
	});
	fileImage = new Image();
	fileImage.src = e.target.result;
}, false);

function getImageData() {
	file = document.querySelector('#file_button').files[0];
}

// Create/Select Buttons
const edit_floor_btn = document.querySelector('#edit_floor');
edit_floor_btn.addEventListener('click', (e) => {
	current_graph = $("#floor_search").dropdown("get value");
	if (current_graph) {
		editFloor(current_graph);
		
		window.history.replaceState({}, "Matron", "/" + current_graph);
	}
});

function editFloor(current_graph) {
	log(current_graph);

	// if (!(mapnames.some(name => name == current_graph))) {
	// 	current_graph = "";
	// 	return;
	// }
	fetch(`graph/${current_graph}`).then((resp) => resp.json()).then(function(data) {
		loadGraphData(data);
	});
}

function loadGraphData(data) {
		changed_graph = false;
		cy.elements().remove()
		// log(cy.elements().remove());
		// log(data);
		types = [];
		if (data.graph.types) {
			log("Adding types")
			data.graph.types.forEach((e) => {
				types.push(e);
			});
		}
		fillTypes();
		if (data.graph.elements.nodes) {
			log(data.graph.elements);
			cy.add(data.graph.elements);
		}
		if (data.graph.zoom) {
			log(data.graph.zoom);
			cy.zoom(data.graph.zoom);
		}
		if (data.graph.pan) {
			log(data.graph.pan);
			cy.pan(data.graph.pan);
		}
		if (data.graph.blueprint_scale) {
			blueprint_scale = data.graph.blueprint_scale;
			blueprint_scale_input.value = blueprint_scale;
			drawBG();
			log(blueprint_scale);
		}

		const blueprint = data.blueprint;
		// loads all the versions for a given graph.
		if (blueprint) {
			fileImage = new Image();
			fileData = blueprint;
			fileImage.src = fileData;
			// Force rerender
			document.querySelector('#cy').style.visibility = 'hidden';
			document.querySelector('#cy').style.visibility = 'visible';
		}
		load_graph_versions();
		//log(types);
		document.querySelector('#select_floor').style.display = 'none';
		document.querySelector('#tool_select').style.display = 'block';
		document.querySelector('#cy').style.visibility = 'visible';
		cy.elements().removeClass("desiredpath");
		rescale_icon_helper();
}

const create_floor_btn = document.querySelector('#create_floor');
create_floor_btn.addEventListener('click', (e) => {
	// img_src = document.querySelector('#img');
	// load empty graph with this img (we'll send it to server on save)
	current_graph = $("#floor_search").dropdown("get value");
	log(current_graph);
	
	if (file != -1) {
		reader.readAsDataURL(file);
	} else {
		const url = `both/${current_graph}`;
		fetch(url, {
			method: 'post',
			body: JSON.stringify({graph: cy.json(), blueprint: ""})
		});
	}

	document.querySelector('#select_floor').style.display = 'none';
	document.querySelector('#cy').style.visibility = 'visible';
	document.querySelector('#tool_select').style.display = 'block';
	window.history.replaceState({}, "Matron", "/" + current_graph);
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
		ctx.drawImage(fileImage, 0, 0, fileImage.width*blueprint_scale, fileImage.height*blueprint_scale);
	}
}

// Popper stuff
const type_list = document.querySelector('#type_list');
//const colors = ['green', 'orange', 'red', 'blue', 'olive', 'teal', 'violet', 'purple', 'pink', 'brown', 'black'];

// let types = [{name: "Patient Room", color: "green"}, {name: "Supply Room", color: "orange"}];
// // should really get from server returned map, we need to store manually alongside cy.json();

function fillTypes() {
	// log("filling types");

	while(type_list.hasChildNodes()) {
		// log("removinnnng");
		type_list.removeChild(type_list.lastChild);
	}

	let hallway = types.find(type => type.name == "hallway");
	if (hallway) {
		types = types.filter(type => type.name != "hallway");
		types.push(hallway);
	}

	for (let i=0; i<types.length; i++) {
		let div = document.createElement('div');
		// div.innerHTML = `<div class="item" data-value="${types[i].name}"> <a class="ui ${types[i].color} empty circular label"></a> ${types[i].name} </div>`;
		div.innerHTML = `<div class="item" data-value="${types[i].name}"> <span class="dot" style='background-color: ` + types[i].color + `'></span> ${types[i].name} </div>`;

		type_list.appendChild(div.firstChild);
		cy.style().selector("node[type = '" + types[i].name + "']").style({"background-color": types[i].color}).update();
	}
}

$("#type_select").dropdown({
	allowAdditions: true, 
	hideAdditions: false,
	onChange: function(value, name) {
		log(value, name);
		if (popperNode != -1) {
			popperNode.data("type", value);
			log("changed graph");
			changed_graph = true;
			let input_label = document.querySelector('#node_label_input').value;
			let input_type = $("#type_select").dropdown("get value");

			let typelist_index = types.findIndex(typ=>typ.name == input_type);
			if (typelist_index != -1) {
				colorPicker.color.hexString = types[typelist_index].color;
			} else {
				colorPicker.color.hexString = randomHex();
			}

			if (input_label == "" && input_type != "hallway") {
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
	changeLabel();
});

function changeLabel() {
	let input_label = document.querySelector('#node_label_input').value;
	let input_type = $("#type_select").dropdown("get value");
	if (input_label == "" && input_type != "hallway") {
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

const set_type_btn = document.querySelector('#set_type');
set_type_btn.addEventListener("click", (e) => {

	fillTypes();

	let input_label = document.querySelector('#node_label_input').value;
	let input_type = $("#type_select").dropdown("get value");

	log(input_label, input_type);
	if (set_type_btn.classList.contains("negative")) {
		return;
	}

	if (!types.some(type => type.name == input_type)) {
		add_new_node_type(input_type);
	}
	
	if (input_type == "hallway") {
		popperNode.data("label", "");
	} else {
		popperNode.data("label", input_label);
	}
	
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
	fillTypes();
}

function add_new_node_type(type_name){
	if (types.some(e => e.name == type_name)) {
		return;
	}

	log("ADDING NEW NODE TYPEEEE");

	// let color = colors[types.length%colors.length];
	let color;
	if (type_name == "hallway") {
		color = "#ff0000";
	} else {
		color = colorPicker.color.hexString;
	}
	
	types.push({name: type_name, color: color});

	// let div = document.createElement('div');
	// div.innerHTML = `<div class="item" data-value="${type_name}"> <a class="ui ${color} empty circular label"></a> ${type_name} </div>`;
	// type_list.appendChild(div.firstChild);
	fillTypes();
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
	if ((!changed_graph || urlParams=="dev") || window.confirm("You have unsaved changed. Continue?")) {
		window.location.pathname = ""
	}
	
	//location.reload();
});

document.querySelector('#file_button').onchange = function() {
	getImageData();
}

const distance_btn = document.querySelector('#distance_btn');
const distance_result_div = document.querySelector('#distance_result_div');
const distance_icon = document.querySelector('#distance_icon');

const blueprint_icon = document.querySelector('#image_icon');
const upload_new_blueprint_btn = document.querySelector('#upload_new_blueprint');
const blueprint_reader = new FileReader();

let blueprint_scale = 1;

upload_new_blueprint_btn.addEventListener('click', (e)=>{
	file = document.querySelector('#new_blue_print').files[0];
	const new_blueprint_name = document.querySelector('#blueprint_name_input').value;
	// log(file);
	if (file) {
		reader.readAsDataURL(file);
		changed_graph = true;
	}
	
	log(blueprint_scale_input.value);
	let new_blueprint_scale = blueprint_scale_input.value ? blueprint_scale_input.value : blueprint_scale;

	if (blueprint_scale != new_blueprint_scale) {
		scale_full_graph(new_blueprint_scale/blueprint_scale);
		blueprint_scale = new_blueprint_scale;
		changed_graph = true;
		drawBG();
	}
	if (new_blueprint_name != '' && new_blueprint_name !== current_graph){
		new_graph_name = new_blueprint_name;
	}
	
	log("changed graph");
	saveGraph();

	
});

function scale_full_graph(factor) {
	let oldpan = cy.pan();
	let newpan = scaleVec(oldpan, factor);
	cy.pan(newpan);

	cy.nodes().forEach(n => {
		let oldpos = n.position();
		let newpos = scaleVec(oldpos, factor);
		n.position(newpos);
	})
}

blueprint_icon.addEventListener('click', (e)=>{
	if (current_graph == "") {
		return
	}
	document.querySelector('#blueprint_name_input').display = 'block';
	document.querySelector('#blueprint_name_input').placeholder = current_graph;
	document.querySelector('#blueprint_name_input').display = 'none';
	
	$('#blueprint_modal')
		.modal('show')
	;

});

distance_icon.addEventListener('click', (e) =>{

	if (current_graph == "") {
		return
	}

	distance_result_div.style.display = 'none';
	$('#distance_modal')
		.modal('show')
	;
});


distance_btn.addEventListener('click', (e) =>{
	distance_result_div.style.display = 'block';
	let node1_label = document.querySelector('#node1').value;
	let node2_label = document.querySelector('#node2').value;

	log(node1_label);
	log(node2_label);

	if (node1_label == "" || node2_label == "") {
		document.querySelector('#dist_result').innerText = "Cannot search for empty room.";
		return;
	}

	let node1 = cy.$("node[label='" + node1_label + "']");
	let node2 = cy.$("node[label='" + node2_label + "']");

	let duplicate_label = duplicateLabelCheck();

	if (node1.length == 0 && node2.length == 0) {
		document.querySelector('#dist_result').innerText = "Neither room was not found.";
		return;
	} else if (node1.length == 0) {
		document.querySelector('#dist_result').innerText = "First room was not found.";
		return;
	} else if (node2.length == 0) {
		document.querySelector('#dist_result').innerText = "Second room was not found.";
		return;
	} else if (duplicate_label !== false) {
		document.querySelector('#dist_result').innerText = "Duplicate label '"+duplicate_label+"' detected. Aborting.";
		return;
	}

	fetch(`graph/distance_two_rooms/${current_graph}/${node1_label}/${node2_label}`).then((resp) => resp.json()).then(function(data) {
		document.querySelector('#dist_result').innerText = "distance : " + data;
	});	
});


let urlPath = decodeURI(window.location.href);
log(urlPath);
let lastSlashIndex = urlPath.lastIndexOf("/")
let lastQueryIndex = urlPath.lastIndexOf("?")==-1 ? urlPath.length : urlPath.lastIndexOf("?");
let urlParams = urlPath.substring(lastQueryIndex + 1);
log(urlParams);
log(lastQueryIndex);
let urlMapName = urlPath.substring(lastSlashIndex + 1, lastQueryIndex);
log(urlMapName);

function addVec(a, b) {
	return {x: a.x+b.x, y: a.y+b.y};
}
function subVec(a, b) {
	return {x: a.x-b.x, y: a.y-b.y};
}
function scaleVec(a, s) {
	return {x: a.x*s, y:a.y*s};
}
function normalize(a) {
	return scaleVec(a, 1/len(a));
}
function len(a) {
	return Math.sqrt((a.x*a.x) + (a.y*a.y));
}

function nodeDist(node1, node2) {
	// log(node1);
	// log(node2);
	return len(subVec(node1.position(), node2.position()));
}


function reScale(node1pos, node2pos, scale) {
	let diff = subVec(node2pos, node1pos);
	let newdiff = scaleVec(diff, scale);
	let newpos = addVec(subVec(node2pos,diff),newdiff);
	return newpos;
	// log(newpos);

	// node2.position(newpos);
}

// neighbor, source, len
function fillPath(node, id, len) {
	// log(len);
	let neighbors = node;
	//let neighbors = node.closedNeighborhood("node[type = 'hallway'][[degree <= 2]]");
	// log(node);
	// node = node.successors("node[type = 'hallway'][[degree <= 2]][id != '"+ node.id() + "']");
	let oldNode = node;
	while (true) {
		// probably also needs a selector for node has not already been rescaled
		let newNeighbors = neighbors.closedNeighborhood("node[type = 'hallway'][[degree = 2]]");
		let newNode = newNeighbors.difference(neighbors)[0];
		// log(neighbors.difference(neighbors));
		// log(newNode);
		if (!newNode) {
			break;
		}

		// log(newNode);
		len += nodeDist(newNode, oldNode);
		// log(len);
		oldNode = newNode;
		neighbors = newNeighbors;
	}
	// toggleSelected(neighbors);
	// end is either a non-origin room, a nonorigin junction, or a nonorigin leaf
	let end = neighbors.openNeighborhood("node[id !='" + id + "'][type != 'hallway'], node[id !='" + id + "'][[degree > 2]], node[id !='" + id + "'][[degree = 1]]")[0];
	
	// cycle
	if (!end) {
		return {interim: neighbors, end: end, len: len};
	}
	// toggleSelected(end);
	len += nodeDist(oldNode, end);
	// toggleSelected(end);
	// log(len);
	// log(end);
	return {interim: neighbors, end: end, len: len};
}

function fillNode(node) {
	//let node = cy.$("node[id='" + id + "']")[0];
	let neighbors = node.closedNeighborhood("node[type = 'hallway'][[degree = 2]]");
	//toggleSelected(neighbors);
	let paths = [];

	let adjacentrooms = node.openNeighborhood("node[type != 'hallway'], node[type = 'hallway'][[degree < 2]], node[type = 'hallway'][[degree > 2]]");

	adjacentrooms.forEach(n => {
		paths.push({interim: [], end: n, start: node, len: nodeDist(node, n)});
	})

	neighbors.forEach(n => {
		let branch = fillPath(n, node.id(), nodeDist(n, node));
		// if (branch) {
			branch.start = node;
			paths.push(branch);
		// }
		// toggleSelected(branch.path);
	});

	// log(paths);
	return paths;
}

let scaleFactor = false;
function setScaleFactor(node1, node2, t) {
	// let node1 = cy.$("node[label='" + label1 + "']")[0];
	// let node2 = cy.$("node[label='" + label2 + "']")[0];

	let path = fillNode(node1).find(p => p.end == node2);
	// log(path);
	if (!path) {return;}

	setRescaled(cy2.$id(node2.id()));
	cy3.remove(cy3.$id(node2.id()));
	// setRescaled(node2);
	// path.interim.forEach(n => {
	// 	setRescaled(n);
	// });


	let cyLen = path.len;
	scaleFactor = cyLen/t;

	log(t);
	log(cyLen);
	log(scaleFactor);
}

function reScalePath(node1, node2, t) {
	// let node1 = cy.$("node[label='" + label1 + "']")[0];
	// let node2 = cy.$("node[label='" + label2 + "']")[0];
	// let node2pos = JSON.parse(JSON.stringify(node2.position()));

	let endpaths = fillNode(node2);
	let path = endpaths.find(p => p.end == node1);

	if (!path) {return;}

	setRescaled(cy2.$id(node2.id()));
	cy3.remove(cy3.$id(node2.id()));
	// delete node 2 in cy3
	//setRescaled(node2);

	let scale = (t*scaleFactor)/path.len;
	let newPos = reScale(node1.position(), node2.position(), scale);
	let offset = subVec(newPos, node2.position());

	log(offset);
	//translateNode(node2, offset);
	translateNode(flood(node1, node2, true), offset);
}

function labeltonode(label) {
	return cy.$("node[label='" + label + "']")[0];
}

function translateNode(nodes, offset) {
	log(nodes);
	log(offset);
	nodes.forEach(node => {
		node = cy.$id(node.id());
		// let node = cy.$("node[label='" + label + "']")[0];
		let originalPos = JSON.parse(JSON.stringify(node.position()));
		let newPos = addVec(node.position(), offset);
		node.position(newPos);

		log(originalPos);
		log(newPos);

		let paths = fillNode(node);

		paths.forEach(p => {
			p.interim.forEach(n => {
				let scale = len(subVec(newPos, p.end.position())) / len(subVec(originalPos, p.end.position()));
				let endToNode2 = subVec(originalPos, p.end.position());
				let endToNewNode2 = subVec(newPos, p.end.position());

				n.position(reScale(p.end.position(), n.position(), scale));
				n.position(rotateVec(n.position(), p.end.position(), -getAng(endToNode2)));
				n.position(rotateVec(n.position(), p.end.position(), getAng(endToNewNode2)));
			});
		});
	});
}

function cleanGraph(invis) {
	let cyInstance = invis ? cy2 : cy;

	cy2.remove(cy2.elements());
	cy3.remove(cy3.elements());
	cyInstance.add(cy.elements());

	let selector = "node[type != 'hallway'], node[type = 'hallway'][[degree > 2]], node[type = 'hallway'][[degree = 1]]";
	cyInstance.$(selector).forEach(node => {
		let paths = fillNode(node);

		let updatedCollection = cyInstance.$(selector);
		if (updatedCollection.is("node[id='" + node.id() + "']")) {
			paths.forEach(path => {
				// if intersection of the selector with this node is nonempty, ie., if this node still fits the selector, continue
				
				path.interim.forEach(n => {
				})
				if (path.interim.length > 0) {
					cyInstance.remove(path.interim);
				}
				// cy2.add(path.interim);

				if (path.end) {
					addEdge(node, path.end, cyInstance);
				}
			});
		}
	});

	let span = cyInstance.elements().kruskal(function(edge) {
		return len(subVec(edge.source().position(), edge.target().position()));
	});
	cyInstance.remove(cyInstance.elements());
	cyInstance.add(span);
	cy3.add(span);
	cy3.nodes().data("cy3", true);
	span.data("debug", true); // the whole point of debug is to differentiate between nodes in cy in and cy2
								//since closedneighborhood doesn't take a cy instance
}

function flood(src, pathstart, invis) {
	log(src);
	log(pathstart);
	// if (!pathstart.data("debug")) {return;}
	let cyInstance = invis ? cy2 : cy;

	log("MADE IT");

	src = cyInstance.$id(src.id());
	pathstart = cyInstance.$id(pathstart.id());

	let neighbors = pathstart;
	while(true) {
		let newNeighbors = neighbors.closedNeighborhood("node[id != '" + src.id() + "'][?debug]");
		let newNode = newNeighbors.difference(neighbors)[0];
		if (!newNode) {
			break;
		}
		neighbors = newNeighbors;
	}
	toggleSelected(neighbors);
	log(neighbors);
	return neighbors;
}


let cleanedGraph = false;
let n1 = false;
let n2 = false;
function rescaleAll(t) {
	cy.elements().removeClass("desiredpath");

	if (!cleanedGraph) {
		cleanGraph(true);
		cleanedGraph = true;
	}
	if (!scaleFactor) {
		if (n1 && n2) {
			setScaleFactor(n1, n2, t);
			//scalefactor might need to set n1 or n2 to scaled, so that they don't get chosen as leaves again
		}
	} else if (scaleFactor) {
		reScalePath(n1, n2, t);
		changed_graph = true;
		// might again need to set n1 or n2 to scaled, so that they don't get chosen as leaves again
	}

	let cy2Pair = getLeaf();

	if (!cy2Pair) {
		log("Rescaling complete.");
		return true;
	}

	n2 = cy.$id(cy2Pair.leaf.id());
	n1 = cy.$id(cy2Pair.neighbor.id());

	let desiredpath = fillNode(n1).find(p => p.end == n2);
	// log(desiredpath);
	// desiredpath.start.addClass("desiredpath");
	// desiredpath.end.addClass("desiredpath");
	//desiredpath.interim.connectedEdges().addClass("desiredpath");

	n1.edgesWith(n2).addClass("desiredpath");

	// desiredpath.start.connectedEdges().addClass("desiredpath");
	// desiredpath.interim.forEach(n => {
	// 	n.connectedEdges().addClass("diredpath");
	// })

	if (desiredpath.interim.length > 0) {
		desiredpath.interim.connectedEdges().addClass("desiredpath");
	}
	
	log("");
	log("Please enter dist between");
	log(n1.data("label"));
	log("and")
	log(n2.data("label"));
	log("");
	return false;
}

function getLeaf() {
	// issue is this degree selector doesn't care about whether the neighbors are rescale or not, it's global
	// os after a few rescales there won't be any true degree 1 nodes left
	let leaf =  cy3.$("node[[degree = 1]]"); // the whole point of rescaled is to make this unscaled leaf selector work
	// log(leaf);

	if (leaf.length <= 1) {
		return false;
	}

	let neighbor = leaf[0].openNeighborhood("node[?cy3]");

	return {leaf, neighbor};
}

let cy2 = cytoscape({
	layout: {
		name: "preset"
	},
	style: cyStyle,
	headless: true
});

let cy3 = cytoscape({
	layout: {
		name: "preset"
	},
	style: cyStyle,
	headless: true
});

// function interpPath(paths, originalStartPos, newStartPos, startID) {
// 	let startOffset = subVec(newStartPos, originalStartPos);
// 	for (let i=0; i<paths.length; i++) {
// 		let p = paths[i];

// 		p.interim.forEach(n => {
// 			if (p.end == node1) {
// 				setRescaled(n);
// 			}

// 			let scale = len(subVec(newStartPos, p.end.position()))/ len(subVec(originalStartPos, p.end.position()));
// 			let endToNode2 = subVec(originalStartPos, p.end.position());
// 			let endToNewNode2 = subVec(newStartPos, p.end.position());

// 			if (p.end.data("rescaled")) {
// 				n.position(addVec(n.position(), startOffset));
// 				log("TEEEEEEEEEEEEEEEEEEEEEEEEST");
// 			} else {
// 				n.position(reScale(p.end.position(), n.position(), scale));
// 				n.position(rotateVec(n.position(), p.end.position(), -getAng(endToNode2)));

// 				n.position(rotateVec(n.position(), p.end.position(), getAng(endToNewNode2)));
// 			}
// 		});
// 	}	
// }

function rotateVec(point, origin, theta) {
	// let x = vec.x - origin.x;
	// let y = vec.y - origin.y;
	let vec = subVec(point, origin);
	let x = vec.x*Math.cos(theta) - vec.y*Math.sin(theta);
	let y = vec.x*Math.sin(theta) + vec.y*Math.cos(theta);
	vec = {x:x, y:y};
	vec = addVec(vec, origin);
	//log(vec);
	return vec;
}

function getAng(vec) {
	let x = vec.x;
	let y = vec.y;
	let ang = Math.atan(y/x);
	if (x<0) {
		ang += Math.PI;
	}
	if (x>0 && y<0) {
		ang += 2*Math.PI;
	}
	return ang;
}

function setRescaled(nodes) {
	nodes.data("rescaled", true);
}

$("#version_select").dropdown({
	forceSelection: false,
	allowReselection: true,
	onChange: function(value, text, $selectedItem) {
		// the text corresponds to date
		const date = text;
		log(value);
		log(text);
		log($selectedItem);

		if (!value) {
			return;
		}
		resetRescaler();
		//
		fetch(`/graph/version/${current_graph}/${date}`).then((resp) => resp.json()).then(function(data) {
			// here we would do something load our older version graph
			//log(data);
			//log(data);
			log("dataaaaaaaaa");
			log(data);
			log(urlParams);
			if ((!changed_graph || urlParams=="dev") || window.confirm("You have unsaved changed. Continue?")) {
				loadGraphData(data);
				const blueprint = data.blueprint;
			}

		});
	}
});

/**
 * Function used to load in the graph version on the dropdown
 */
function load_graph_versions(){
	log("LOADING GRAPH VERSIONS")
	document.querySelector('#version_select').style.display = 'block';
	fetch(`/graph/requestAll/${current_graph}`).then((resp) => resp.json()).then(function(data) {
		debugtext.innerText = performance.now() + data.times;
		
		const version_list = document.querySelector('#version_list');
		while(version_list.hasChildNodes()) {
			version_list.removeChild(version_list.lastChild);
		}

		let count = 0;
		// log(data)
		data.times.reverse();
		data.times.forEach((time)=>{
			const div = document.createElement('div');
			div.innerHTML = `<div class="item" data-value="${count}">  ${time} </div>`;
			version_list.appendChild(div.firstChild);
			count += 1;
			hidePopper();
		});
	});
}

let tool;
$('#tool_select')
.dropdown({
	onChange: function(value, text, $selectedItem) {
	  // custom action
		log(value);
		log(text);
		log($selectedItem);
		tool = value;
		ghost.disable();

	 	unselectAll();
		unHoverAll();
		hidePopper();
	},
	values: [
		{
		  name: 'Smart',
		  value: 'Smart',
		  selected: true
		},
		{
		  name: 'Add Nodes',
		  value: 'Add Nodes',
		},
		{
			name: 'Edit Nodes',
			value: 'Edit Nodes',
		},
		{
			name: 'Add Edges',
			value: 'Add Edges',
		},
		{
			name: 'Delete',
			value: 'Delete',
		}
	  ]
  });


window.onbeforeunload = function() {
	if (changed_graph) {
		let confirm_close = confirm("You have unsaved changed. Continue?");
		return confirm_close;
	}
}

document.querySelector("#node_info_close").onclick = function() {
	hidePopper();
}

document.querySelector("#rescale_icon").onclick = function() {
	rescale_icon_helper();
}

function rescale_icon_helper() {
	if (!current_graph) {
		return;
	}

	log("begin rescaling");
	resetRescaler();
	if (rescale_menu.style.visibility != "visible") {
		rescale_menu.style.visibility = "visible";
		progress_bar.style.display = "block";

		if (rescaleAll()) {
			instructions.innerText = "No rescaleable paths found.";
			rescale_button.style.display = "none";
		}
	} else {
		rescale_menu.style.visibility = "hidden";
		progress_bar.style.display = "none";
	}
	
	log(rescale_button.innerText);
}

let rescale_menu = document.querySelector("#rescale_menu");
let instructions = document.querySelector("#instructions");
let rescale_input = document.querySelector("#rescale_input");
let rescale_button = document.querySelector("#rescale_button");
let blueprint_scale_input = document.querySelector("#blueprint_scale_input");
let progress_bar = document.querySelector("#progress_bar");

let rescaled_edges = 0;
let rescaling_started = false;
let walking = false;
let rescale_complete = false;
let timerInterval;
rescale_button.onclick = function() {
	if (!rescaling_started) {
		rescale_button.innerText = "Go";
		rescale_input.style.display = "block";
		instructions.innerText = "Press go and walk along path"
		rescaling_started = true;
	} else if (!walking) {

		if (rescale_input.value) {
			rescaleUIHelper();
		} else {
			rescale_button.innerText = "Done";
			instructions.innerText = "Press stop when done walking"
			walking = true;

			let startTime = performance.now();
			timerInterval = setInterval(function() {
				let t = performance.now() - startTime;
				rescale_input.value = (t/1000).toFixed(2);
			}, 16)
		}
	} else {
		log(rescale_input.value);
		clearInterval(timerInterval);
		rescaleUIHelper();
	}
}

let first = 1;
function rescaleUIHelper() {
	log("RESCALE UI HELPER");
	if (rescaleAll(parseFloat(rescale_input.value) + (0.0001*first))) {
		rescaling_started = false;
		walking = false;
		rescale_input.value = "";
		instructions.innerText = "Rescaling complete. Consider saving.";
		rescale_input.style.display = "none";
		rescale_button.style.display = "none";
		rescale_complete = true;
	} else {
		walking = false;
		rescale_input.value = "";
		instructions.innerText = "Go to one end of the red path";
		rescale_input.style.display = "none";
		rescale_button.innerText = "Done";
		rescaling_started = false;
	}
	first = 0;
	rescaled_edges += 1;
	let percent = 100 * rescaled_edges / cy2.edges().length;
	log(percent);
	$("#progress_bar").progress("set percent", percent);
	//$("#progress_bar").progress("complete");
}

function resetRescaler() {
	first = 1;
	// rescale_menu.style.visibility = "hidden";
	$("#progress_bar").progress("set percent", 0);
	progress_bar.style.display = "hidden";
	instructions.innerText = "Go to one end of the red path";
	rescale_input.style.display = "none";
	rescale_button.innerText = "Done";
	rescale_button.style.display = "block";
	rescale_complete = false;
	walking = false;
	rescaling_started = false;
	cleanedGraph = false;
	n1 = false;
	n2 = false;
	scaleFactor = false;
	clearInterval(timerInterval);
	cy.elements().removeClass("desiredpath");
	rescaled_edges = 0;
	//$("#progress_bar").progress({percent: percent});
}

let colorPicker = new iro.ColorPicker("#picker", {
	width: 263
});

colorPicker.on('color:change', function(color) {
	let type = $("#type_select").dropdown("get value");
	cy.style().selector("node[type='" + type + "']").style({
		"background-color": colorPicker.color.hexString
	}).update();

	let typelist_index = types.findIndex(typ=>typ.name == type);
	if (typelist_index != -1) {
		types[typelist_index].color = colorPicker.color.hexString;
	}
});

$("#progress_bar").progress({percent: 0});

let debugtext = document.querySelector("#debugtext");

function log(data) {
	if (window.console) {
		console.log(data);
	}
}

// function cleanNode(label) {
// 	let node = cy.$("node[label='" + label + "']")[0];
// 	let paths = fillNode(node);
// 	paths.forEach(path => {
// 		cy.remove(path.interim);
// 		//removeNodes(path.interim);
// 		if (path.end) {
// 			addEdge(node, path.end);
// 		}
// 	})
// }

// function cleanNodeID(id) {
// 	let node = cy.$("node[id='" + id + "']")[0];
// 	let paths = fillNode(node);
// 	log(paths);
// 	paths.forEach(path => {
// 		cy.remove(path.interim);
// 		//removeNodes(path.interim);
// 		if (path.end) {
// 			addEdge(node, path.end);
// 		}
// 	})
// }