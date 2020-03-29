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
	changed_graph = true;
	return cyInstance.add(edge);
}

function addNode(posX, posY, cyInstance) {
	changed_graph = true;
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
	return cyInstance.add(node)[0];
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

	// if (popperNode != -1) {
	// 	return;
	// }

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

	ghost.disable();

	if (!e.originalEvent.ctrlKey) {
		console.log("ttettetetet");
		unselectAll();
		//return;
	}

	if (target.group() == "nodes") {
		console.log(target.id());
		// console.log(target.data("type"));

		if (target.data("type") == "hallway" || e.originalEvent.ctrlKey) {
			toggleSelected(target);	
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

	unselectAll();

	// if (popperNode != -1) {
	// 	return;
	// }

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

cy.on("drag", "elements", function(e) {
	changed_graph = true;
})

window.addEventListener("keydown", function(e) {
	if (e.code == "Escape") {
		ghost.disable();
	}

	if (e.code == "KeyX") {
		console.log(document.activeElement);
		if (document.activeElement != document.body) {
			return;
		}

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
	changed_graph = false;
	unselectAll();
	unHoverAll();
	console.log(current_graph);
	if (current_graph == "") {
		return;
	}	

	console.log('SAVED');

	let graph = cy.json();

	console.log(graph.elements.nodes);
	console.log(graph.elements.edges);

	if (!graph.elements.nodes) {
		graph.elements.nodes = [];
	}

	if (!graph.elements.edges) {
		graph.elements.edges = [];
	}
	let url = `both/${current_graph}`;
	let _graph = cy.json();
	_graph.types = types;

	let blueprint = fileImage == -1 ? "" : fileImage.src;
	fetch(url, {
		method: 'post',
		body: JSON.stringify({graph: _graph, blueprint: blueprint})
	}).then(res=>{
		load_graph_versions();
	});
	
}

function unHoverAll() {
	cy.$(".hover").forEach(e => {
		console.log(e);
		e.removeClass("hover");
	});
}

let mapnames = [];

function fillmapnames(names) {
	names.forEach((name) => {
		console.log(name);
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

		$("#floor_search").dropdown({
			allowAdditions: true, 
			hideAdditions: false,
			values: mapnames,
			forceSelection: false,
			onChange: function(value, name) {
				console.log(value, name);

				if (value == "" || mapnames.some(val => val.value == value)) {
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

				deleteMap(name);

				mapnames = mapnames.filter(function(value, index, arr) {
					return value.value != name;
				})
				console.log(mapnames);
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
reader.addEventListener("load", function (e) {
	// Force rerender
	document.querySelector('#cy').style.visibility = 'hidden';
	document.querySelector('#cy').style.visibility = 'visible';

	console.log(e.target.result);
	fileData = e.target.result;
	let url = `both/${current_graph}`;
	let _graph = cy.json()
	_graph.types = types;
	fetch(url, {
		method: 'post',
		body: JSON.stringify({graph: _graph, blueprint: fileData})
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
	console.log(current_graph);
	fetch(`graph/${current_graph}`).then((resp) => resp.json()).then(function(data) {

		loadGraphData(data);
		
	});
}

function loadGraphData(data) {
		changed_graph = false;
		cy.elements().remove()
		console.log(cy.elements().remove());
		console.log(data);
		types = [];
		if (data.graph.types) {
			console.log("Adding types")
			data.graph.types.forEach((e) => {
				types.push(e);
			});
		}
		fillTypes();
		if (data.graph.elements.nodes) {
			console.log(data.graph.elements);
			cy.add(data.graph.elements);
		}
		if (data.graph.zoom) {
			console.log(data.graph.zoom);
			cy.zoom(data.graph.zoom);
		}
		if (data.graph.pan) {
			console.log(data.graph.pan);
			cy.pan(data.graph.pan);
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
		//console.log(types);
		document.querySelector('#select_floor').style.display = 'none';
		document.querySelector('#cy').style.visibility = 'visible';
}

const create_floor_btn = document.querySelector('#create_floor');
create_floor_btn.addEventListener('click', (e) => {
	img_src = document.querySelector('#img');
	// load empty graph with this img (we'll send it to server on save)
	current_graph = $('.ui.dropdown').dropdown("get value")[1];
	console.log(current_graph);
	
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
		ctx.drawImage(fileImage, 0, 0, fileImage.width*2, fileImage.height*2);
	}
}

// Popper stuff
const type_list = document.querySelector('#type_list');
const colors = ['green', 'orange', 'red', 'blue', 'olive', 'teal', 'violet', 'purple', 'pink', 'brown', 'black'];

// let types = [{name: "Patient Room", color: "green"}, {name: "Supply Room", color: "orange"}];
// // should really get from server returned map, we need to store manually alongside cy.json();

function fillTypes() {
	console.log("filling types");

	while(type_list.hasChildNodes()) {
		console.log("removinnnng");
		type_list.removeChild(type_list.lastChild);
	}

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
			changed_graph = true;
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
	}
});

document.querySelector('#node_label_input').addEventListener("input", function(e) {
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
	if ((!changed_graph || urlParams=="dev") || window.confirm("You have unsaved changed. Continue?")) {
		window.location.pathname = ""
	}
	
	//location.reload();
});

const distance_btn = document.querySelector('#distance_btn');
const distance_result_div = document.querySelector('#distance_result_div');
const distance_icon = document.querySelector('#distance_icon');

const blueprint_icon = document.querySelector('#image_icon');
const upload_new_blueprint_btn = document.querySelector('#upload_new_blueprint');
const blueprint_reader = new FileReader();

upload_new_blueprint_btn.addEventListener('click', (e)=>{
	file = document.querySelector('#new_blue_print').files[0];
	reader.readAsDataURL(file);
	changed_graph = true;
});

blueprint_icon.addEventListener('click', (e)=>{
	if (current_graph == "") {
		return
	}
	
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


let urlPath = decodeURI(window.location.href);
console.log(urlPath);
let lastSlashIndex = urlPath.lastIndexOf("/")
let lastQueryIndex = urlPath.lastIndexOf("?")==-1 ? urlPath.length : urlPath.lastIndexOf("?");
let urlParams = urlPath.substring(lastQueryIndex + 1);
console.log(urlParams);
console.log(lastQueryIndex);
let urlMapName = urlPath.substring(lastSlashIndex + 1, lastQueryIndex);
console.log(urlMapName);
if (urlMapName != "") {
	current_graph = urlMapName;
	editFloor(urlMapName);
}

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
	// console.log(node1);
	// console.log(node2);
	return len(subVec(node1.position(), node2.position()));
}


// function setScale(a, b, t) {
// 	let node1 = cy.$("node[label='" + a + "']")[0];
// 	let node2 = cy.$("node[label='" + b + "']")[0];

// 	let cyDist = len(subVec(node1.position(), node2.position()));
// 	scaleFactor = cyDist/t;
// 	console.log(scaleFactor);
// }

function getClean() {
	fetch(`graph/clean/${current_graph}`).then((resp) => resp.json()).then(function(data) {
		console.log(data);
		data = JSON.parse(data.graph);
		cy.elements().remove();
		data.nodes.forEach(e => cy.add(e));
		data.edges.forEach(e => cy.add(e));
	});
}

let scaleFactor = 1;
function reScale(node1pos, node2pos, scale) {
	let diff = subVec(node2pos, node1pos);
	let newdiff = scaleVec(diff, scale);
	let newpos = addVec(subVec(node2pos,diff),newdiff);
	return newpos;
	// console.log(newpos);

	// node2.position(newpos);
}

// neighbor, source, len
function fillPath(node, id, len) {
	// console.log(len);
	let neighbors = node;
	//let neighbors = node.closedNeighborhood("node[type = 'hallway'][[degree <= 2]]");
	// console.log(node);
	// node = node.successors("node[type = 'hallway'][[degree <= 2]][id != '"+ node.id() + "']");
	let oldNode = node;
	while (true) {
		// probably also needs a selector for node has not already been rescaled
		let newNeighbors = neighbors.closedNeighborhood("node[type = 'hallway'][[degree = 2]]");
		let newNode = newNeighbors.difference(neighbors)[0];
		// console.log(neighbors.difference(neighbors));
		// console.log(newNode);
		if (!newNode) {
			break;
		}

		// console.log(newNode);
		len += nodeDist(newNode, oldNode);
		// console.log(len);
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
	// console.log(len);
	// console.log(end);
	return {interim: neighbors, end: end, len: len};
}

function fillNode(node) {
	//let node = cy.$("node[id='" + id + "']")[0];
	let neighbors = node.closedNeighborhood("node[type = 'hallway'][[degree = 2]]");
	//toggleSelected(neighbors);
	let paths = [];

	let adjacentrooms = node.closedNeighborhood("node[type != 'hallway']");

	adjacentrooms.forEach(n => {
		paths.push({interim: [], end: n, len: nodeDist(node, n)});
	})

	neighbors.forEach(n => {
		let branch = fillPath(n, node.id(), nodeDist(n, node));
		// if (branch) {
			paths.push(branch);
		// }
		// toggleSelected(branch.path);
	});

	// console.log(paths);
	return paths;
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
// 	console.log(paths);
// 	paths.forEach(path => {
// 		cy.remove(path.interim);
// 		//removeNodes(path.interim);
// 		if (path.end) {
// 			addEdge(node, path.end);
// 		}
// 	})
// }

let cy2 = cytoscape({
	layout: {
		name: "preset"
	},
	style: cyStyle,
	headless: true
});


function cleanGraph(invis) {
	let cyInstance = invis ? cy2 : cy;

	cyInstance.add(cy.elements());

	let selector = "node[type != 'hallway'], node[type = 'hallway'][[degree > 2]], node[type = 'hallway'][[degree = 1]]";
	cyInstance.$(selector).forEach(node => {
		let paths = fillNode(node);
		//console.log(fillNode(node));
		// if this node no longer exist, skip it
		// console.log(node.id());
		// console.log(cy.$id(node.id())[0]);
		// console.log(cy.elements().length);
		// if (cy.$id(node.id())[0]) {

		let updatedCollection = cyInstance.$(selector);
		if (updatedCollection.is("node[id='" + node.id() + "']")) {
			paths.forEach(path => {
				// console.log(node.id());
				// console.log(cy.$id(node.id())[0]);
				//if (cy.$id(node.id())[0]) {
				console.log(node.data("label"));
				// if intersection of the selector with this node is nonempty, ie., if this node still fits the selector, continue
				
				path.interim.forEach(n => {
					console.log(n.id());
				})
				console.log(path.end);
				console.log(path.interim);
				if (path.interim.length > 0) {
					cyInstance.remove(path.interim);
				}
				// cy2.add(path.interim);

				if (path.end) {
					addEdge(node, path.end, cyInstance);
				}
				//}
			});
		}
		console.log("");
		// }
	});

	let span = cyInstance.elements().kruskal();
	cyInstance.remove(cyInstance.elements());
	cyInstance.add(span);
	console.log(span);
}

// function removeNodes(collection) {
// 	collection.forEach(n => {
// 		if (n) {
// 			cy.remove(n);
// 		}
// 	})
// }

function rotateVec(point, origin, theta) {
	// let x = vec.x - origin.x;
	// let y = vec.y - origin.y;
	let vec = subVec(point, origin);
	let x = vec.x*Math.cos(theta) - vec.y*Math.sin(theta);
	let y = vec.x*Math.sin(theta) + vec.y*Math.cos(theta);
	vec = {x:x, y:y};
	vec = addVec(vec, origin);
	//console.log(vec);
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

function setScaleFactor(label1, label2, t) {
	let node1 = cy.$("node[label='" + label1 + "']")[0];
	let node2 = cy.$("node[label='" + label2 + "']")[0];

	let path = fillNode(node1).find(p => p.end == node2);
	console.log(path);
	if (!path) {
		return
	}

	let cyLen = path.len;
	scaleFactor = cyLen/t;

	// path.interim.addClass("scaled");
	// path.end.addClass("scaled");

	console.log(cyLen);
	console.log(scaleFactor);
}

function reScalePath(label1, label2, t) {
	let node1 = cy.$("node[label='" + label1 + "']")[0];
	let node2 = cy.$("node[label='" + label2 + "']")[0];
	let node2pos = JSON.parse(JSON.stringify(node2.position()));

	// assume node1 is in MST, ie., is fixed
	let path = fillNode(node1).find(p => p.end == node2);

	if (!path) {
		return;
	}

	let cyLen = path.len;
	let scale = (t*scaleFactor)/cyLen;
	console.log(t, cyLen, scaleFactor);
	console.log(scale);

	path.interim.forEach(n => {
		n.position(reScale(node1.position(), n.position(), scale));
	});
	path.end.position(reScale(node1.position(), path.end.position(), scale));

	let endpaths = fillNode(node2);
	// for(let i=0; i<endpaths.length; i++) {
	// 	let p = endpaths[i];
	// 	if (p.end != node1) {
	// 		let scale = nodeDist(node2, p.end) / 
	// 	}
	// }
	endpaths.forEach(p => {
		if (p.end != node1) {
			// toggleSelected(p.interim);

			let scale = nodeDist(node2, p.end) / len(subVec(node2pos, p.end.position()));
			let endToNode2 = subVec(node2pos, p.end.position());
			let endToNewNode2 = subVec(node2.position(), p.end.position());
			console.log(endToNode2);
			console.log(getAng(endToNode2));

			p.interim.forEach(n => {
				n.position(reScale(p.end.position(), n.position(), scale));
				n.position(rotateVec(n.position(), p.end.position(), -getAng(endToNode2)));

				n.position(rotateVec(n.position(), p.end.position(), getAng(endToNewNode2)));

				// now rotate it

				// console.log(n.position());
			});
			// console.log(scale);
		}
	});



}



$("#version_select").dropdown({
	forceSelection: false,
	allowReselection: true,
	onChange: function(value, text, $selectedItem) {
		// the text corresponds to date
		const date = text;
		console.log(value);
		console.log(text);
		console.log($selectedItem);

		if (!value) {
			return;
		}
		
		//
		fetch(`/graph/version/${current_graph}/${date}`).then((resp) => resp.json()).then(function(data) {
			// here we would do something load our older version graph
			//console.log(data);
			console.log(data);

			console.log(urlParams);
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
	console.log("LOADING GRAPH VERSION");
	document.querySelector('#version_select').style.display = 'block';
	fetch(`/graph/requestAll/${current_graph}`).then((resp) => resp.json()).then(function(data) {

		const version_list = document.querySelector('#version_list');
		while(version_list.hasChildNodes()) {
			version_list.removeChild(version_list.lastChild);
		}

		let count = 0;
		console.log(data)
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

window.onbeforeunload = function() {
	if (changed_graph) {
		"You have unsaved changed."
	}
}