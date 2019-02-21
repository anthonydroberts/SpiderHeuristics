var GRIDSIZE = 50; //set to 30 for 30x30 or 50 for 50x50, or K for KxK
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
			for(var i = arr1.length; i--;) {
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
	
	
	if(searchType == "BFS"){
		newAnt();
		var rootNode = new Node(null,[spiderX,spiderY,antX,antY]);
		var Nodes = [];
		Nodes.push(rootNode);
		var VisitedNodes = [];
		var currNode = rootNode;
		var i = 0;
		moveList = [];
		VisitedNodes.push(currNode);
		
		
		
		function addChild(p){
			//make sure the new spider coordinates in the new space are not out of bounds
			if((p.data[0]+spiderXchange < GRIDSIZE) && (p.data[0]+spiderXchange >= 0) && (p.data[1]+spiderYchange < GRIDSIZE) && (p.data[1]+spiderYchange >= 0)){
				childNode = new Node(p,[p.data[0]+spiderXchange,p.data[1]+spiderYchange,p.data[2]+antXchange,p.data[3]+antYchange]);
				if(isVisited(VisitedNodes,childNode) == false){ //check if node is already present, if not add it
					Nodes.push(childNode);
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
			console.log(currNode.data[0], currNode.data[1], currNode.data[2], currNode.data[3])
			if((currNode.data[0] == currNode.data[2]) && (currNode.data[1] == currNode.data[3])){
				//goal state reached
				alert("SUCCESS AFTER: " + i);
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
		
	}
}

function run(){
	spiderX = -2;
	spiderY = -2;
	antX = -3;
	antY = -3;
	drawBoard(); //clear and redraw all the entities and board for a clean start every iteration
	drawEntities();
	
	computeMoves("BFS");
	
//setInterval is used instead of a for loop because the delay is needed for the user to see the changes
	var i = 0;
	console.log("Solution set:");
	console.log(moveList);
	setInterval(function() {
		if (i < moveList.length) {
			context.clearRect(spiderX*CELLSIZE+p,spiderY*CELLSIZE+p,CELLSIZE,CELLSIZE);
			context.clearRect(antX*CELLSIZE+p,antY*CELLSIZE+p,CELLSIZE,CELLSIZE);
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

