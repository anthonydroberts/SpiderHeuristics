var GRIDSIZE = 30; //set to 30 for 30x30 or 50 for 50x50, or K for KxK
var CELLSIZE = 20; //size of each cell, leave as 20 its a good size

// Box width
var bw = CELLSIZE*GRIDSIZE;
// Box height
var bh = CELLSIZE*GRIDSIZE;
// Padding for aesthetics
var p = 10;



var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");


//spider and ant coordinates
var spiderX, spiderY;
var antX, antY;
var moveList = [];
var statsString = "";
var constantEntityPositions = 0; //if this is set to 1, the ant and the spider should start in the same spot every time to compare searches
var spiderStartX = 0; var spiderStartY = 0; var antStartX = 0; var antStartY = 0; var antStartYChange = 0; var antStartXChange = 0;


function drawBoard(){
	canvas.width  = (GRIDSIZE*CELLSIZE)+p*2;
	canvas.height = (GRIDSIZE*CELLSIZE)+p*2;
	//make all the vertical lines:
	for (var x = 0; x <= bw; x += CELLSIZE) {
		//draw a single line
		context.moveTo(0.5 + x + p, p);
		context.lineTo(0.5 + x + p, bh + p);
	}


	for (var y = 0; y <= bh; y += CELLSIZE) {
		context.moveTo(p, 0.5 + y + p);
		context.lineTo(bw + p, 0.5 + y + p);
	}

	context.strokeStyle = "black";
	context.stroke();
}

function drawSpider(x,y){
	context.fillStyle = "blue";
	context.fillRect(x*CELLSIZE+p,y*CELLSIZE+p,CELLSIZE,CELLSIZE);
}

function drawAnt(x,y){
	context.fillStyle = "#42f450";
	context.fillRect(x*CELLSIZE+p,y*CELLSIZE+p,CELLSIZE,CELLSIZE);
}

//function to redraw moving entities
function drawEntities(){
	drawSpider(spiderX,spiderY);
	drawAnt(antX,antY);
	if(spiderX == antX && spiderY == antY){
			context.fillStyle = "red";
			context.fillRect(spiderX*CELLSIZE+p,spiderY*CELLSIZE+p,CELLSIZE,CELLSIZE);
	}
}

function constantEntities(){
	constantEntityPositions = 1;
	antStartX = parseInt(document.getElementById("getAntX").value, 10);
	antStartY = parseInt(document.getElementById("getAntY").value, 10);
	antStartYChange =  parseInt(document.getElementById("getAntYChange").value, 10);
	antStartXChange =  parseInt(document.getElementById("getAntXChange").value, 10);
	spiderStartX =  parseInt(document.getElementById("getSpiderX").value, 10);
	spiderStartY =  parseInt(document.getElementById("getSpiderY").value, 10);
}

//initialize everything
function init(){
	drawBoard();
	spiderX = 2, spiderY = 4;
	antX = 5, antY = 7;
}

function Node(par, data, children) {
    this.data = data;
    this.parent = par;
	this.children = [];
	this.cost = 0;
}

function computeMoves(searchType){

	spiderX = Math.floor(Math.random() * GRIDSIZE);
	spiderY = Math.floor(Math.random() * GRIDSIZE);
	
	if(constantEntityPositions == 1){
		spiderX = spiderStartX;
		spiderY = spiderStartY;
	}

	var antXchange = 0; var antYchange = 0; var spiderXchange = 0; var spiderYchange = 0;
	
	//set ant change rate function
	function newAnt(){
		antX = Math.floor(Math.random() * GRIDSIZE);
		antY = Math.floor(Math.random() * GRIDSIZE);
		
		var num = Math.floor(Math.random() * 8);
		if(num == 0){//up
			antYchange = -1;
		}
		else if( num == 1){//topright
			antYchange = -1;
			antXchange = 1;
		}
		else if( num == 2){//right
			antXchange = 1;
		}
		else if( num == 3){//bottomright
			antXchange = 1;
			antYchange = 1;
		}
		else if( num == 4){//down
			antYchange = 1;
		}
		else if( num == 5){//bottomleft
			antXchange = -1;
			antYchange = 1;
		}
		else if( num == 6){//left
			antXchange = -1;
		}
		else if( num == 7){//topleft
			antXchange = -1;
			antYchange = -1;
		}
		
	}
	
	//check if state space has already been visited, return false if it hasnt, true if the state space has already been visited
	function isVisited(VN,CN){
		
		function arraysEqual(arr1, arr2) {
			if(arr1.length !== arr2.length)
				return false;
			for(let i = arr1.length; i--;) {
				if(arr1[i] !== arr2[i])
					return false;
			}

			return true;
		}
		
		for(var k = 0; k<VN.length;k++){
			if (arraysEqual(VN[k].data,CN.data) == true){
				return true;
			}
		}
		return false;
	}
	
	newAnt();
	if(constantEntityPositions == 1){
		antX = antStartX;
		antY = antStartY;
		antYchange = antStartYChange;
		antXchange = antStartXChange
	}
	
	/*
	***** BFS BFS BFS *****
	***** BFS BFS BFS *****
	***** BFS BFS BFS *****
	*/
	
	if(searchType == "BFS" || searchType == "DFS"){
		statsString = "";
		let rootNode = new Node(null,[spiderX,spiderY,antX,antY]);
		let Nodes = [];
		Nodes.push(rootNode);
		let VisitedNodes = [];
		let currNode = rootNode;
		let i = 0;
		moveList = [];
		VisitedNodes.push(currNode);
		
		
		
		function addChild(p){
			//make sure the new spider coordinates in the new space are not out of bounds
			if((p.data[0]+spiderXchange < GRIDSIZE) && (p.data[0]+spiderXchange >= 0) && (p.data[1]+spiderYchange < GRIDSIZE) && (p.data[1]+spiderYchange >= 0)){
				childNode = new Node(p,[p.data[0]+spiderXchange,p.data[1]+spiderYchange,p.data[2]+antXchange,p.data[3]+antYchange]);
				if(isVisited(VisitedNodes,childNode) == false){ //check if node is already present, if not add it
				//BFS IS TO ADD THE NEW CHILD NODES TO THE END OF THE ARRAY SO THAT THEY ARE EXPLORED
				//IN A "BREADTH" FIRST MANNER
				//WHEREAS DFS IS TO ADD THE NEW CHILD NODES TO THE FRONT OF THE ARRAY SO THAT THEY ARE EXPLORED
				//BY "DEPTH" FIRST
					if(searchType == "BFS"){
						Nodes.push(childNode);
					}
					else if (searchType == "DFS"){
						Nodes.unshift(childNode);
					}
					VisitedNodes.push(childNode);
				}
				else{
					//console.log("Node Rejected");
				}
			}
		}
		
		while(1){
			if (Nodes.length==0) break; //quit
			currNode = Nodes.shift(); //Remove the first element from node list and call it E (currNode)
			//check if ant coordinates are off grid
			if((currNode.data[2] > GRIDSIZE-1) || currNode.data[2] < 0 || currNode.data[3] > GRIDSIZE-1 || currNode.data[3] < 0){
				newAnt();
				currNode.data[2] = antX;
				currNode.data[3] = antY;
			}
			
			//goal state check
			//console.log(currNode.data[0], currNode.data[1], currNode.data[2], currNode.data[3])
			if((currNode.data[0] == currNode.data[2]) && (currNode.data[1] == currNode.data[3])){
				//goal state reached
				while(currNode.parent!=null){
					moveList.unshift(currNode.data);
					currNode = currNode.parent;
				}
				break;
			}
			else{
				//goal state not reached yet
				//spider can move in 9 directions, so we will add at most 9 children to this current node representing every space possible
				
				//topright1
				spiderXchange = 1;
				spiderYchange = -2;
				addChild(currNode);
				
				//topright2
				spiderXchange = 2;
				spiderYchange = -1;
				addChild(currNode);
				
				//topleft1
				spiderXchange = 1;
				spiderYchange = -2;
				addChild(currNode);
				
				//topleft2
				spiderXchange = -2;
				spiderYchange = -1;
				addChild(currNode);
				
				//right
				spiderXchange = 1;
				addChild(currNode);
				
				//bottomright
				spiderXchange = 1;
				spiderYchange = 1;
				addChild(currNode);

				//down
				spiderYchange = 1;
				addChild(currNode);
				
				//bottomleft
				spiderXchange = -1;
				spiderYchange = 1;
				addChild(currNode);
				
				//left
				spiderXchange = -1;
				addChild(currNode);
				
				//apply rule to generate all states
				//for each state, check if it has been visited
				//if it has been visited, do not add it to Nodes
				//check if it is goal node'
				//if not goal node add to Nodes
				
				
			}
			
			i++;
		}
		statsString = "Visited Nodes: " + VisitedNodes.length + " Time(iterations): " + i + " Solution Length: " + moveList.length;
	}
	
	/*
	***** DFS DFS DFS *****
	***** DFS DFS DFS *****
	***** DFS DFS DFS *****
	*/
	
	/*if(searchType == "DFS"){
		
	}*/
	
	/*
	***** H1 H1 H1 *****
	***** H1 H1 H1 *****
	***** H1 H1 H1 *****
	*/
	
	/*
	
	*/
	
	if(searchType == "H1" || searchType == "H2" || searchType == "H1+H2/2"){
		statsString = "";
		let rootNode = new Node(null,[spiderX,spiderY,antX,antY]);
		let Nodes = [];//OPEN
		Nodes.push(rootNode);
		let VisitedNodes = []; //CLOSED
		let currNode = rootNode;
		let i = 0;
		moveList = [];
		
		currNode.cost = Math.abs(spiderX-antX)+Math.abs(spiderY-antY)
		
		
		function addChild(p){
			//make sure the new spider coordinates in the new space are not out of bounds
			if((p.data[0]+spiderXchange < GRIDSIZE) && (p.data[0]+spiderXchange >= 0) && (p.data[1]+spiderYchange < GRIDSIZE) && (p.data[1]+spiderYchange >= 0)){
				childNode = new Node(p,[p.data[0]+spiderXchange,p.data[1]+spiderYchange,p.data[2]+antXchange,p.data[3]+antYchange]);
				//now we will set the cost based on the heuristic
				if (searchType == "H1"){
					//first heuristic will be THE HYPOTENUSE or the ACTUAL DISTANCE between the spider and the ant

					childNode.cost = childNode.parent.cost + Math.sqrt(Math.pow(p.data[0]+spiderXchange - p.data[2]+antXchange,2) + Math.pow(p.data[1]+spiderYchange - p.data[3]+antYchange,2));
					
					//childNode.cost = childNode.parent.cost + Math.sqrt(Math.pow(p.data[0]+spiderXchange - p.data[2]+antXchange,2) + Math.pow(p.data[1]+spiderYchange - p.data[3]+antYchange,2));
				}
				else if (searchType == "H2"){
					//second heuristic
					//difference between X and difference between Y values is the second heuristic
					//This is the best one slightly, because the spider cannot move along a hypotenuse for the second heuristic so this one is more realistic for it
					childNode.cost = childNode.parent.cost+Math.abs(p.data[0]+spiderXchange -(p.data[2]+antXchange))+Math.abs(p.data[1]+spiderYchange -(p.data[3]+antYchange));
					
				}
				else if (searchType == "H1+H2/2"){
					//average of both heuristics, this is better than H2, but worse than H1
					let h1Cost = childNode.parent.cost+Math.abs(p.data[0]+spiderXchange -(p.data[2]+antXchange))+Math.abs(p.data[1]+spiderYchange -(p.data[3]+antYchange));
					let h2Cost = childNode.parent.cost + Math.sqrt(Math.pow(p.data[0]+spiderXchange - p.data[2]+antXchange,2) + Math.pow(p.data[1]+spiderYchange - p.data[3]+antYchange,2));
					let h3Cost = (h1Cost+h2Cost)/2;
					childNode.cost = h3Cost;
				}

				if(isVisited(VisitedNodes,childNode) == false && isVisited(Nodes,childNode) == false ){ //check if node is already present, if not add it
				
					var added = false;
					//add childNode to Nodes such that Nodes is sorted from lowest to highest cost
					for (var i=0;i<Nodes.length;i++){
						if (Nodes[i].cost >childNode.cost){
							Nodes.splice(i, 0, childNode)
							added = true;
							break;
						}
					}
					
					if(!added){
						Nodes[Nodes.length] = childNode
					}
				
					
					//Nodes.push(childNode);
					//VisitedNodes.push(childNode);
				}
				else if (isVisited(VisitedNodes,childNode) == true && isVisited(Nodes,childNode) == false ){ //check if node is already present, if not add it
					
					//find index in VisitedNodes wwhose data is same as childnodes nata
					for (var i=0;i<VisitedNodes.length;i++){
						if (VisitedNodes[i].data == childNode.data){
							if (VisitedNodes[i].cost > childNode.cost){
								var diff = VisitedNodes[i].cost - childNode.cost;
								VisitedNodes[i].cost = childNode.cost;
								//for each child of viisted nodes, change the cost of its children to reflect the difference
								for (var j=0;j<VisitedNodes[i].children.length;j++){
									VisitedNodes[i].children[j] -=diff;
								}
								Nodes = mergeSort(Nodes);
								break;
								
								
							}
						}
					}
				}else if (isVisited(VisitedNodes,childNode) == false && isVisited(Nodes,childNode) == true ){ //check if node is already present, if not add it
					//find index in Nodes wwhose data is same as childnodes nata
					for (var i=0;i<Nodes.length;i++){
						if (Nodes[i].data == childNode.data){
							if (Nodes[i].cost > childNode.cost){
								
								var diff = Nodes[i].cost - childNode.cost;
								Nodes[i].cost = childNode.cost;
								//for each child of  nodes, change the cost of its children to reflect the difference
								for (var j=0;j<Nodes[i].children.length;j++){
									Nodes[i].children[j] -=diff;
								}
								
								//reorder Nodes
								Nodes = mergeSort(Nodes);
								
								
								// Split the array into halves and merge them recursively 
								function mergeSort (nodelist) {
								  if (nodelist.length === 1) {
									// return once we hit an array with a single item
									return nodelist
								  }

								  const middle = Math.floor(nodelist.length / 2) // get the middle item of the array rounded down
								  const left = nodelist.slice(0, middle) // items on the left side
								  const right = nodelist.slice(middle) // items on the right side

								  return merge(
									mergeSort(left),
									mergeSort(right)
								  )
								}

								// compare the arrays item by item and return the concatenated result
								function merge (left, right) {
								  let result = []
								  let indexLeft = 0
								  let indexRight = 0

								  while (indexLeft < left.length && indexRight < right.length) {
									if (left[indexLeft].cost < right[indexRight].cost) {
									  result.push(left[indexLeft])
									  indexLeft++
									} else {
									  result.push(right[indexRight])
									  indexRight++
									}
								  }

								  return result.concat(left.slice(indexLeft)).concat(right.slice(indexRight))
								}
								break;

								
							}
						}
					}
				}
			}
		}
		
		while(1){
			//console.log("while loop")
			//console.log(Nodes)
			//console.log(Nodes[0].data)
			if (Nodes.length==0) break; //quit
			currNode = Nodes.shift(); //Remove the first element from node list and call it E (currNode)
			//check if ant coordinates are off grid
			if((currNode.data[2] > GRIDSIZE-1) || currNode.data[2] < 0 || currNode.data[3] > GRIDSIZE-1 || currNode.data[3] < 0){
				newAnt();
				currNode.data[2] = antX;
				currNode.data[3] = antY;
			}
			
			//goal state check
			//console.log(currNode.data[0], currNode.data[1], currNode.data[2], currNode.data[3])
			if((currNode.data[0] == currNode.data[2]) && (currNode.data[1] == currNode.data[3])){
				//goal state reached
				while(currNode.parent!=null){
					moveList.unshift(currNode.data);
					currNode = currNode.parent;
				}
				break;
			}
			else{
				//goal state not reached yet
				//spider can move in 9 directions, so we will add at most 9 children to this current node representing every space possible
				
				//topright1
				spiderXchange = 1;
				spiderYchange = -2;
				addChild(currNode);
				
				//topright2
				spiderXchange = 2;
				spiderYchange = -1;
				addChild(currNode);
				
				//topleft1
				spiderXchange = 1;
				spiderYchange = -2;
				addChild(currNode);
				
				//topleft2
				spiderXchange = -2;
				spiderYchange = -1;
				addChild(currNode);
				
				//right
				spiderXchange = 1;
				addChild(currNode);
				
				//bottomright
				spiderXchange = 1;
				spiderYchange = 1;
				addChild(currNode);

				//down
				spiderYchange = 1;
				addChild(currNode);
				
				//bottomleft
				spiderXchange = -1;
				spiderYchange = 1;
				addChild(currNode);
				
				//left
				spiderXchange = -1;
				addChild(currNode);
				
				//apply rule to generate all states
				//for each state, check if it has been visited
				//if it has been visited, do not add it to Nodes
				//check if it is goal node'
				//if not goal node add to Nodes
				VisitedNodes.push(currNode);
				
			}
			
			i++;
		}
		statsString = "Visited Nodes: " + VisitedNodes.length + " Time(iterations): " + i + " Solution Length: " + moveList.length;
	}
	/*
	if(searchType == "H2"){
		
	}
	
	if(searchType == "H1+H2/2"){
		
	}
	*/
	
}

function run(searchString){
	spiderX = -2;
	spiderY = -2;
	antX = -3;
	antY = -3;
	drawBoard(); //clear and redraw all the entities and board for a clean start every iteration
	drawEntities();
	statsString = "STATS";
	computeMoves(searchString);
	statsHTML = document.getElementById("stats");
	statsHTML.innerHTML = statsString;
	statsHTML.style.visibility = "visible";
//setInterval is used instead of a for loop because the delay is needed for the user to see the changes
	let i = 0;
	console.log("Solution set:");
	console.log(moveList);
	function s(){
		if (i < moveList.length) {
			context.clearRect (0, 0, CELLSIZE*GRIDSIZE, CELLSIZE*GRIDSIZE);
			drawBoard(); //redraw the board as clearing rect causes lines to disappear
			spiderX = moveList[i][0];
			spiderY = moveList[i][1];
			antX = moveList[i][2];
			antY = moveList[i][3];

			drawEntities();
			
			i++;
			setTimeout(s,750);
		}
	}
	setTimeout(s,750);	
	
}

init();
document.getElementById("start_button_bfs").onclick = function() {run("BFS");}
document.getElementById("start_button_dfs").onclick = function() {run("DFS");}
document.getElementById("start_button_h1").onclick = function() {run("H1");}
document.getElementById("start_button_h2").onclick = function() {run("H2");}
document.getElementById("start_button_h1+h2/2").onclick = function() {run("H1+H2/2");}
document.getElementById("constant_button").onclick = function() {constantEntities()}
