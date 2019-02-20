var GRIDSIZE = 10; //set to 30 for 30x30 or 50 for 50x50, or K for KxK
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
var antDirection = "left";

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

function moveSpider(direction){
	if (direction == "topRight"){
		spiderX = spiderX + 1;
		spiderY = spiderY - 2;
	}
	else if (direction == "topLeft"){
		spiderX = spiderX - 1;
		spiderY = spiderY - 2;
	}
	else if (direction == "left"){
		spiderX = spiderX - 1;
	}
	else if (direction == "down"){
		spiderY = spiderY + 1;
	}
	else if (direction == "right"){
		spiderX = spiderX + 1;
	}
	else if (direction == "bottomRight"){
		spiderX = spiderX + 1;
		spiderY = spiderY + 1;
	}
	else if (direction == "bottomLeft"){
		spiderX = spiderX - 1;
		spiderY = spiderY + 1;
	}
}

function moveAnt(direction){
	if (direction == "up"){
		antY = antY - 1;
	}
	else if (direction == "down"){
		antY = antY + 1;
	}
	else if (direction == "left"){
		antX = antX - 1;
	}
	else if (direction == "right"){
		antX = antX + 1;
	}
}

//initialize everything
function init(){
	drawBoard();
	spiderX = 2, spiderY = 4;
	antX = 5, antY = 7;
}

function Node(par, data) {
    this.data = data;
    this.parent = par;
}

function computeMoves(searchType){
	spiderX = Math.floor(Math.random() * GRIDSIZE);
	spiderY = Math.floor(Math.random() * GRIDSIZE);
	antX = Math.floor(Math.random() * GRIDSIZE);
	antY = Math.floor(Math.random() * GRIDSIZE);
	var num = Math.floor(Math.random() * 4);
	if(num == 0){
		antDirection = "left";
	}
	else if(num == 1){
		antDirection = "up";
	}
	else if(num == 2){
		antDirection = "down";
	}
	else if(num == 3){
		antDirection = "right";
	}
	
	if (searchType == "BFS"){

		var NodeList = [];
		NodeList.push([spiderX,spiderY,antX,antY]);
		var rootNode = new Node(null,NodeList[0]);
		//var currNode = new Node(rootNode,rootNode.data);
		var NodeArray = [];
		NodeArray.push(rootNode);
		var VisitedNodeList = [];

		var antXChange = 0, antYChange = 0;
		
		if (antDirection == "up"){
			antYChange = -1;
		}
		else if (antDirection == "down"){
			antYChange = 1;
		}
		else if (antDirection == "left"){
			antXChange = -1;
		}
		else if (antDirection == "right"){
			antXChange = 1;
		}

		var i = 0;
		//spiderx,spidery,antx,anty
		while(1){
			var parentNode = NodeArray.shift();
			if(antX > GRIDSIZE-1 || antY > GRIDSIZE-1 || antX < 0 || antY < 0){
				antX = Math.floor(Math.random() * GRIDSIZE-1);
				antY = Math.floor(Math.random() * GRIDSIZE-1);
			}
			
			//if this states spider coordinates equal the ants coordinates
			console.log(NodeList[0][0],NodeList[0][1],NodeList[0][2],NodeList[0][3])
			
			if(NodeList[0][0] == NodeList[0][2] && NodeList[0][1] == NodeList[0][3]){
				//goal condition met
				//succesful node is NodeArray[i];
				var solution = [];
				//record the move in the succesful node, go to its parent, record its move, go to its parent, etc..
				var lastNode = new Node(NodeArray.shift(),NodeList[0]);
				var nodeInSolution = lastNode;
				//console.log()
				solution.unshift(lastNode.data);
				while(nodeInSolution.parent!=null){//nodeInsolution isnt the root node
					
					nodeInSolution = nodeInSolution.parent;
					solution.unshift(nodeInSolution.data);
					
				}
				console.log(solution);
				//print out solution
				moveList = solution;
				console.log(moveList);
				alert("SUCCESS AFTER: " + i)
				break;
			}
			
			
			if(!VisitedNodeList.includes([NodeList[0][0]+1,NodeList[0][1]-2,NodeList[0][2]+antXChange,NodeList[0][3]+antYChange])){
				if(!((NodeList[0][0]+1 > GRIDSIZE) || (NodeList[0][1]-2 < 0))){
					var createdNode0 = new Node(parentNode,[NodeList[0][0]+1,NodeList[0][1]-2,NodeList[0][2]+antXChange,NodeList[0][3]+antYChange]);
					NodeList.push([NodeList[0][0]+1,NodeList[0][1]-2,NodeList[0][2]+antXChange,NodeList[0][3]+antYChange]);
					NodeArray.push(createdNode0);
				}
			}
			if(!VisitedNodeList.includes([NodeList[0][0]-1,NodeList[0][1]-2,NodeList[0][2]+antXChange,NodeList[0][3]+antYChange])){
				if(!((NodeList[0][0]-1 < 0) || (NodeList[0][1]-2 < 0))){
					var createdNode1 = new Node(parentNode,[NodeList[0][0]-1,NodeList[0][1]-2,NodeList[0][2]+antXChange,NodeList[0][3]+antYChange]);
					NodeList.push([NodeList[0][0]-1,NodeList[0][1]-2,NodeList[0][2]+antXChange,NodeList[0][3]+antYChange]);
					NodeArray.push(createdNode1);
				}
			}
			if(!VisitedNodeList.includes([NodeList[0][0]-1,NodeList[0][1],NodeList[0][2]+antXChange,NodeList[0][3]+antYChange])){
				if(!((NodeList[0][0]-1 < 0))){
					var createdNode2 = new Node(parentNode,[NodeList[0][0]-1,NodeList[0][1],NodeList[0][2]+antXChange,NodeList[0][3]+antYChange]);
					NodeList.push([NodeList[0][0]-1,NodeList[0][1],NodeList[0][2]+antXChange,NodeList[0][3]+antYChange]);
					NodeArray.push(createdNode1);
				}
			}
			if(!VisitedNodeList.includes([NodeList[0][0],NodeList[0][1]+1,NodeList[0][2]+antXChange,NodeList[0][3]+antYChange])){
				if(!((NodeList[0][1]+1 > GRIDSIZE))){
					var createdNode3 = new Node(parentNode,[NodeList[0][0],NodeList[0][1]+1,NodeList[0][2]+antXChange,NodeList[0][3]+antYChange]);
					NodeList.push([NodeList[0][0],NodeList[0][1]+1,NodeList[0][2]+antXChange,NodeList[0][3]+antYChange]);
					NodeArray.push(createdNode3);
				}
			}
			if(!VisitedNodeList.includes([NodeList[0][0]+1,NodeList[0][1],NodeList[0][2]+antXChange,NodeList[0][3]+antYChange])){
				if(!((NodeList[0][0]+1 > GRIDSIZE))){
					var createdNode4 = new Node(parentNode,[NodeList[0][0]+1,NodeList[0][1],NodeList[0][2]+antXChange,NodeList[0][3]+antYChange]);
					NodeList.push([NodeList[0][0]+1,NodeList[0][1],NodeList[0][2]+antXChange,NodeList[0][3]+antYChange]);
					NodeArray.push(createdNode4);
				}
			}
			if(!VisitedNodeList.includes([NodeList[0][0]+1,NodeList[0][1]+1,NodeList[0][2]+antXChange,NodeList[0][3]+antYChange])){
				if(!((NodeList[0][0]+1 > GRIDSIZE) || (NodeList[0][1]+1 > GRIDSIZE))){
					var createdNode5 = new Node(parentNode,[NodeList[0][0]+1,NodeList[0][1]+1,NodeList[0][2]+antXChange,NodeList[0][3]+antYChange]);
					NodeList.push([NodeList[0][0]+1,NodeList[0][1]+1,NodeList[0][2]+antXChange,NodeList[0][3]+antYChange]);
					NodeArray.push(createdNode5);
				}
			}
			if(!VisitedNodeList.includes([NodeList[0][0]-1,NodeList[0][1]+1,NodeList[0][2]+antXChange,NodeList[0][3]+antYChange])){
				if(!((NodeList[0][0]-1 < 0) || (NodeList[0][1]+1 > GRIDSIZE))){
					var createdNode6 = new Node(parentNode,[NodeList[0][0]-1,NodeList[0][1]+1,NodeList[0][2]+antXChange,NodeList[0][3]+antYChange]);
					NodeList.push([NodeList[0][0]-1,NodeList[0][1]+1,NodeList[0][2]+antXChange,NodeList[0][3]+antYChange]);
					NodeArray.push(createdNode6);
				}
			}

			VisitedNodeList.push([NodeList[0][0],NodeList[0][1],NodeList[0][2],NodeList[0][3]])

			NodeList.shift()
			i++;
		}
		
	}
}

function run(){

	computeMoves("BFS");
	
//setInterval is used instead of a for loop because the delay is needed for the user to see the changes
	var i = 0;
	setInterval(function() {
		if (i < moveList.length) {
			context.clearRect(spiderX*CELLSIZE+p,spiderY*CELLSIZE+p,CELLSIZE,CELLSIZE);
			context.clearRect(antX*CELLSIZE+p,antY*CELLSIZE+p,CELLSIZE,CELLSIZE);
			console.log(moveList);
			spiderX = moveList[i][0];
			spiderY = moveList[i][1];
			antX = moveList[i][2];
			antY = moveList[i][3];
			drawBoard(); //redraw the board as clearing rect causes lines to disappear
			drawEntities();

		}
		else return;
		i++;
	}, 1000);	

}

init();
document.getElementById("start_button").onclick = function() {run();}

