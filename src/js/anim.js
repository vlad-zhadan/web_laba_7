let messageNumber = 1;

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

class Square {
	#x = 0;
	#y = 0;
	#size = 0;
	#color = 0;
	#speed = 0;
	#directionX = 0;
	#directionY = 0;
	#canvas = 0;
	#context = 0;
	#totalPath = 0

	constructor(x, y, size, color,speed, directionX, directionY, canvas) {
		this.setCoords(x, y);
		this.#size = size;
		this.#color = color;
		this.#speed = speed;
		this.setDirection(directionX, directionY);
		this.#canvas = canvas;
		this.#context = this.#canvas.getContext("2d");

		this.draw();
	}

	draw() {
		this.#context.fillStyle = this.#color;
		this.#context.fillRect(this.#x, this.#y, this.#size, this.#size);
	}

	move() {
		if(this.#totalPath >= 0.5 ){
			this.#x += (0.5 * this.#directionX);
			this.#y += (0.5 * this.#directionY);
			this.#totalPath -= 0.5
		}else if(this.#totalPath == 0){
			return
		}else{
			this.#x += (this.#totalPath * this.#directionX);
			this.#y += (this.#totalPath * this.#directionY);
			this.#totalPath = 0
		}
			
		let message = this.#color + " square moved";
		while(!this.pathEnded()){
			displayMessage(message);
				saveMessageInLocalStorage(message);
				saveMessageInDB(message);
		}
	}

	checkCollisions() {
		let message = this.#color + " square touched border";
		if(this.#x < 0 || (this.#x+this.#size) > this.#canvas.width) {
			this.#directionX = - this.#directionX;
			displayMessage(message);
			saveMessageInLocalStorage(message);
			saveMessageInDB(message);
		}
		if(this.#y < 0 || (this.#y+this.#size) > this.#canvas.height) {
			this.#directionY = - this.#directionY;
			displayMessage(message);
			saveMessageInLocalStorage(message);
			saveMessageInDB(message);
		}
	}

	collide(anotherSquare) {
    let rightOfThisBeyondLeftOfOther = this.#x + this.#size > anotherSquare.#x;
    let leftOfThisBeforeRightOfOther = this.#x < anotherSquare.#x + anotherSquare.#size;
    let bottomOfThisBelowTopOfOther = this.#y + this.#size > anotherSquare.#y;
    let topOfThisAboveBottomOfOther = this.#y < anotherSquare.#y + anotherSquare.#size;

    return rightOfThisBeyondLeftOfOther && leftOfThisBeforeRightOfOther &&
           bottomOfThisBelowTopOfOther && topOfThisAboveBottomOfOther;
}


	setCoords(x, y) {
		this.#x = x;
		this.#y = y;
	}

	setDirection(directionX, directionY) {
		this.#directionX = directionX;
		this.#directionY = directionY;
	}

	setTotalPath(){
		this.#totalPath = this.#speed
	}

	pathEnded(){
		if(this.#totalPath == 0){	
			return true
		}
		return false
	}

	addSpeed(){
		this.#speed += 0.1
	} 
}

class Animation {
	#animationTimer;

	#canvas;
	#context;
	#texture;

	#square1;
	#square1Size;
	#square1X;
	#square1Y;
	#square1Speed;
	#square1DirectionX;
	#square1DirectionY;
	#square1Color;

	#square2;
	#square2Size;
	#square2X;
	#square2Y;
	#square2Speed;
	#square2DirectionX;
	#square2DirectionY;
	#square2Color;

	constructor() {
		this.#canvas = document.getElementById("anim");
		this.#context = this.#canvas.getContext("2d");

		this.#square1Size = 10;
		this.#square1X = getRandomArbitrary(0, 0.9 * this.#canvas.width);
		this.#square1Y = getRandomArbitrary(0, 0.9 * this.#canvas.height);
		this.#square1Speed = 100;
		this.#square1DirectionX = 1;
		this.#square1DirectionY = 0;
		this.#square1Color = "red";

		this.#square2Size = 10;
		this.#square2X = getRandomArbitrary(0, 0.9 * this.#canvas.width);
		this.#square2Y = getRandomArbitrary(0, 0.9 * this.#canvas.height);
		this.#square2Speed = 200;
		this.#square2DirectionX = 1;
		this.#square2DirectionY = 0;
		this.#square2Color = "green";

		this.#square1 = new Square(this.#square1X, this.#square1Y, this.#square1Size, this.#square1Color,this.#square1Speed, this.#square1DirectionX, this.#square1DirectionY, this.#canvas);
		this.#square2 = new Square(this.#square2X, this.#square2Y, this.#square2Size, this.#square2Color,this.#square2Speed, this.#square2DirectionX, this.#square2DirectionY, this.#canvas);

		this.#texture = new Image();
		this.#texture.src = "../../img/background2.jpg";
		this.#texture.onload = () => {this.drawTexture();
										this.#square1.draw(); 
										this.#square2.draw();
										};
	}

	drawTexture() {
	    let pattern = this.#context.createPattern(this.#texture, "repeat");
	    this.#context.fillStyle = pattern;
	    this.#context.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
	}

	drawInitialState() {
		this.clearContext();
		
		this.drawTexture()		
		
		this.#square1.setCoords(this.#square1X, this.#square1Y);
		this.#square1.draw();

		this.#square2.setCoords(this.#square2X, this.#square2Y);
		this.#square2.draw();
	}

	startAnimation() {
		this.stopAnimation();
	
		const possibleDirections = [[-1, 0], [0, 1], [1, 0], [0, -1]]
		let currentDirectionIndex = 0;


		
		this.#animationTimer = setInterval(() => {
				const currentDirection = possibleDirections[currentDirectionIndex];
				//console.log(currentDirection[0], currentDirection[1]);
				this.#square1.setDirection(currentDirection[0], currentDirection[1])
				this.#square1.setTotalPath()

				this.#square2.setDirection(currentDirection[0], currentDirection[1])
				this.#square2.setTotalPath()
				
				while(!this.#square1.pathEnded() && !this.#square2.pathEnded()){
					this.clearContext();
					this.drawTexture();	
					
					this.#square2.draw();
					this.#square2.move();
					this.#square2.checkCollisions();

					this.#square1.draw();
					this.#square1.move();
					this.#square1.checkCollisions();
					
					if(this.#square1.collide(this.#square2)) {
						let message = "Collide!";
						displayMessage(message);
						saveMessageInLocalStorage(message);
						saveMessageInDB(message);
						this.stopAnimation();
						document.getElementById('stopBtn').style.display = "none";
						document.getElementById('reloadBtn').style.display = "";
					}
			
				}
				


				currentDirectionIndex = (currentDirectionIndex + 1) % possibleDirections.length;
				this.#square1.addSpeed()
				this.#square2.addSpeed()
		}, 6);
		
	}

	clearContext() {
		this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
	}

	stopAnimation() {
		clearInterval(this.#animationTimer);
	}
}


function displayMessage(message) {
	let messagesParagraph = document.getElementById('messages');
	messagesParagraph.textContent = message;
}

async function saveMessageInDB(messageToSave) {
	let dataToSave = {
		message : messageToSave,
		number : messageNumber
	}
	messageNumber++;

	let response = await fetch('../php/saveData.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSave)
            });
	let data = await response.text();
	console.log(data);
}

function saveMessageInLocalStorage(messageToSave) {
	let currentDateAndTime = getCurrentDateAndTime();
	
	let dataToSave = {
		message : messageToSave,
		number : messageNumber,
		date: currentDateAndTime
	}

	let jsonData = JSON.stringify(dataToSave);
	localStorage.setItem([messageNumber], jsonData);
}

function getCurrentDateAndTime() {
	let currentDate = new Date();

	let year = currentDate.getFullYear();
	let month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Months are zero-based
	let day = ('0' + currentDate.getDate()).slice(-2);
	let hours = ('0' + currentDate.getHours()).slice(-2);
	let minutes = ('0' + currentDate.getMinutes()).slice(-2);
	let seconds = ('0' + currentDate.getSeconds()).slice(-2);

	let formattedDateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
	return formattedDateTime;
}

async function saveDataFromLocalStorageIntoDB() {
	let localStorageData = [];

	for(let i = 0; i < localStorage.length; i++) {
		let key = localStorage.key(i);
		let value = localStorage.getItem(key);

		let parsedValue = JSON.parse(value);
		localStorageData.push(parsedValue);
	}

	let response = await fetch('../php/saveDataFromLocalStorage.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({data: localStorageData})
            });
	let data = await response.text();
	console.log(data);
}

async function createMessagesTable() {
	createFirstRow();

	let response = await fetch('../php/getData.php');
	let data = await response.json();

	for(let i = 0; i < data.length; i++)
		addRow(data[i]);
}

function createFirstRow() {
	let table = document.createElement('table');
	table.setAttribute('id', 'messagesTable');

	let firstRow = document.createElement('tr');

	let numberHeader = document.createElement('th');
	numberHeader.textContent = "Number";
	firstRow.append(numberHeader);

	let DBDateHeader = document.createElement('th');
	DBDateHeader.textContent = "DB Date";
	firstRow.append(DBDateHeader);

	let localStorageDateHeader = document.createElement('th');
	localStorageDateHeader.textContent = "Local Storage Date";
	firstRow.append(localStorageDateHeader);

	let messageHeader = document.createElement('th');
	messageHeader.textContent = "Message";
	firstRow.append(messageHeader);

	table.append(firstRow);

	let section = document.querySelector('.news-left-bar');
	section.append(table);
}

function addRow(data) {
	let table = document.getElementById('messagesTable');

	let row = document.createElement('tr');

	let numberData = document.createElement('td');
	numberData.textContent = data.number;
	row.append(numberData);

	let DBDateData = document.createElement('td');
	DBDateData.textContent = data.date;
	row.append(DBDateData);

	let localStorageDateData = document.createElement('td');
	localStorageDateData.textContent = data.localStorageDate;
	row.append(localStorageDateData);

	let messageData = document.createElement('td');
	messageData.textContent = data.message;
	row.append(messageData);

	table.append(row);
}

function removeMessagesTable() {
	let table = document.getElementById('messagesTable');

	if(table)
		table.remove();
}