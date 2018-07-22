// check local storage for stored player list and send it to build player field
function detectPlayers(){
	var playerList = getPlayerList();
	if (playerList != null){
		for (var index = 0; index < playerList.length; index++){
			createPlayerField(playerList[index]);
		}
	}
}

//creates the player score fields with DOM
function createPlayerField(name){
	var playerDiv = document.getElementById('playerDiv');
	var newFieldSet = document.createElement("fieldset");
	newFieldSet.setAttribute('id','player' + name);
	playerDiv.appendChild(newFieldSet);
	var newLegend = document.createElement("legend");
	var legendLabel = document.createTextNode(name);
	newLegend.appendChild(legendLabel);
	newLegend.setAttribute('title',name);
	newFieldSet.appendChild(newLegend);

	var inputBoxArray = createInputBoxArray(name);
	
	var fieldText = ["1:","2:","3:","4:","5:","6:","7:","Total:"];
	
		//adds input boxes to fieldset
	for (var index = 0; index < inputBoxArray.length; index++){
		var newFieldText = document.createTextNode(fieldText[index]);
		newFieldSet.appendChild(newFieldText);
		var newTextBox = document.createElement("input");
		newTextBox.setAttribute('type', 'text');
		newTextBox.setAttribute('id', inputBoxArray[index]);
		newTextBox.setAttribute('size', '3');
		newFieldSet.appendChild(newTextBox);
		newTextBox.onchange = function(){getScore(inputBoxArray)};
		
		//ensures that the numbers will be before the input boxes
		if(index != 0){
			var newLine = document.createElement("BR");
			newFieldSet.insertBefore(newLine,newFieldText);
		}
	}
}

//creates an array holding the input box id names 
function createInputBoxArray(name){
	var inputBoxArray = [name + "Hand1", name + 
		"Hand2", name + "Hand3", name + "Hand4", name + 
		"Hand5", name + "Hand6", name + "Hand7",name + "TotalScore"];
	return inputBoxArray;
}

//retrieves the player list from local storage returns an empty array if nothing is stored
function getPlayerList(){
	var playerList = JSON.parse(localStorage.getItem('playerList'));
	if (playerList != null){
		return playerList;
	} else {
		var playerList = [];
		return playerList;
	}
}

//retrieves new player name and performs necessary tasks to add them to the game
function createPlayer(){
	var valid = true;
	var errorMessage = "";
	var name = document.getElementById('playerName').value;
	var playerList = getPlayerList();
	errorDiv = document.getElementById('errorDiv');
	
	//verifies that the name is different from the current players
	for (var index = 0; index < playerList.length; index++){
		if (name == playerList[index]){
			valid = false;
			errorMessage = "Each name should be unique.";
		}
	}
	
	//doesn't allow a blank name
	if (name == ""){
		valid = false;
		errorMessage = "Please enter a name"
	}
	
	//determines reaction to validity
	if (!valid){
		errorDiv.innerHTML = errorMessage;
		removeMessageTimer(errorDiv);
	}else{
		createPlayerField(name);
		if (localStorageSupported('localStorage')){
			playerList.push(name);
			storePlayerList(playerList);
		}
	}
	
	//clears player name input box
   document.getElementById('playerName').value = "";
}

//sets a timer and removes messages that should be temporary
function removeMessageTimer(div){
	var timer = setInterval (removeMessage,10000);
	function removeMessage(){
		div.innerHTML = "";
	}
}

//retrieves name to be removed and performs necessary tasks
function deletePlayer(passedName){
	var name = document.getElementById('playerName').value;
	
	//this is necessary for when restoreGame calls this function, it passes the name
	if(!name){
		name = passedName;
	}
	
	var playerList = getPlayerList();
	
	//checks that the name being removed is a stored name
	var valid = false;
	for (var index = 0; index < playerList.length; index++){
		if (name == playerList[index]){
			valid = true;
		}
	}
	
	//displays error message if invalid 
	if (!valid){
		var message = "Invalid player please verify spelling and capitalization";
		var element = document.getElementById('errorDiv');
		element.innerHTML = message;
	} else {
		//removes player if valid
	var newPlayerList = playerList.filter(a => a !== name);
	storePlayerList(newPlayerList);
	var parent = document.getElementById('playerDiv');
	var child = document.getElementById('player' + name);
	parent.removeChild(child);
	document.getElementById('playerName').value = "";
	removeMessageTimer('errorDiv');
	}
}

//will remove all players and delete players in local storage
function deleteAllPlayers(){
	var playerList = getPlayerList();
	var parent = document.getElementById('playerDiv');
	
	//removes players one at a time
	for (var index = 0; index < playerList.length; index++){
		var child = document.getElementById('player' + playerList[index]);
		parent.removeChild(child);
	}
	
	var message = "All players removed";
	document.getElementById('errorDiv').innerHTML = message;
	removeMessageTimer('errorDiv');
	
	localStorage.removeItem('playerList');
}

//stores playerList in local storage		
function storePlayerList(list){
	localStorage.setItem("playerList", JSON.stringify(list));
}

//function tests to see if localStorage is supported
function localStorageSupported(type){
    try 
    {
		var storage = window[type],
	    data = 'Can_I_store_my_data_locally?';
		storage.setItem(data, data);
		storage.removeItem(data);
		return true;
    }
    catch(error)
    {
		return error instanceof DOMException && (
		error.code === 22 || 
		error.code === 1014 || 
		error.name === 'QuotaExceededError' ||
		error.name === 'NS_ERROR_DOM_QUOTA_REACHED') && 
		storage.length !== 0;
    }
}

//calculates the total of each player
function getScore(inputArray){
	var playerScoresArray = [];
	
	//creates an array of scores
	for (var index = 0; index < inputArray.length - 1; index++){
	    var value = document.getElementById(inputArray[index]).value;
	    if (value != null && value != ""){
		    playerScoresArray[index] = value;
	    }else {
			playerScoresArray[index] = 0; //to avoid NaN
		}
	}
	
	console.log(playerScoresArray);
	var sum = 0;
    var score = 0;
	
	//computes sum
    for (var index = 0; index < playerScoresArray.length; index++){
    score = parseInt(playerScoresArray[index]);
    if (score != NaN && score != "")
    {
		sum += score;
    }
    }
   
    document.getElementById(inputArray[7]).value = sum;
}

//determines the winner
function whoIsWinning(playersArray){
	var tie = false;
    var totalPointsReceived = 0;
	
	//verifies that scores have been entered
    for (var index = 0; index < playersArray.length; index++){
	    var player = playersArray[index];
		totalPointsReceived += player.totalScore;
    }
	
    var winnerScore = 1000000; //for use in validating winner score 
    var winnerName = "";
    var winnerInfo = [winnerName,winnerScore];
	
	//compares scores to determine lowest (high scores are bad)
    for (var index = 0; index < playersArray.length - 1; index++){
		if (totalPointsReceived <= 0){
			winnerInfo[0] = false;
		}else{	
			var player1 = playersArray[index];
			var player2 = playersArray[index + 1]
			var firstName = player1.playerName;
			var firstScore = player1.totalScore;
			var secondName = player2.playerName;
			var secondScore = player2.totalScore;
			if (firstScore < winnerInfo[1]){
				winnerInfo[0] = firstName;
				winnerInfo[1] = firstScore;
			} 
			if (secondScore < winnerInfo[1]){
				winnerInfo[0] = secondName;
				winnerInfo[1] = secondScore;
			}
		}
	}
	
	//determines if there is a tie
    for (var index = 0; index < playersArray.length; index++){
	    var player = playersArray[index].playerName;
	    var winner = winnerInfo[0];
	    var score = playersArray[index].totalScore;
	    if (player != winnerInfo[0] && score == winnerInfo[1]){
		    winnerInfo[0] += " & " + playersArray[index].playerName;
		    tie = true;
	    }
    }
	
    winnerInfo[2] = tie;
    return winnerInfo;
}

//displays the winner
function displayWinner(){
	var playersList = getPlayerList();
	var playersArray = createPlayersArray(playersList);
    var winner = whoIsWinning(playersArray);
	
	//checks for tie condition and determines output based on result
	if (winner[2] == false){
		if (winner[1] != 1000000){ //if winner score is 1000000 winner is generic
		output = "The winner is " + winner[0] +
		" with a score of " + winner[1] + ".";
		} else {
		output = "Please enter some scores before declaring a winner.";
		removeMessageTimer('winnerDiv');
		}
    } else {
		if (winner[1] != 1000000){ //if winner score is 1000000 winner is generic
		output = "The winners are " + winner[0] +
		" with a score of " + winner[1] + ".";
		} else {
		output = "Please enter some scores before declaring a winner.";
		}
	}
	
    document.getElementById("winnerDiv").innerHTML = output;
	if(winner[1] == 1000000){
		removeMessageTimer('winnerDiv');
	}
	var totalPointsHand7 = 0;
	
	//sums Hand7 scores
    for (var index = 0; index < playersList.length; index++){
	var score = parseInt(document.getElementById(playersList[index] + 'Hand7').value);
	    totalPointsHand7 += score;
    }
	
	//don't want to update leaderboard for an unfinished game
	if (totalPointsHand7 > 0){
		getLeaderBoard(winner);
	}
}

//creates an array holding player name and their scores
function createPlayersArray(list){
	var playerScores = [];
	var score = '';
	
	//converts input to integer and populates array
	for (var index = 0; index < list.length; index++){
		score = parseInt(document.getElementById(list[index] + 'TotalScore').value);
		playerScores[index] = new player (list[index], score);
	}
	return playerScores;
}

//creates player for playerScores array
function player(name,score){
    this.playerName = name;
    this.totalScore = score;
}

//performs tasks to save the game in local storage
function saveGame(){
	var list = getPlayerList();
	var data = createGameData(list);
	saveSuccess = postSavedGame(data);
	if (saveSuccess){
		clearGame();
	}
}

//empties the input fields of the current game board
function clearGame(){
	var list = getPlayerList();
	
	for (var index = 0; index < list.length; index++){
		var name = list[index];
		var inputArray = createInputBoxArray(name);
		for (var iInput = 0; iInput < inputArray.length; iInput++){
		document.getElementById(inputArray[iInput]).value = "";
		}
	}
}

//deletes the current saved game
function deleteSavedGame(){
	localStorage.removeItem('data');
	var message = "Saved game deleted";
	var element = document.getElementById('winnerDiv');
	element.innerHTML = message;
	removeMessageTimer(element);
}

//creates data to be stored for save game
function createGameData(list){
	var playersData = []
	
	//creates array with player names and scores
	for (var index = 0; index < list.length; index++){
		var name = list[index];
		var inputArray = createInputBoxArray(name);
		playersData.push(name);
		for (var iInput = 0; iInput < 7; iInput++){
			playersData.push(document.getElementById(inputArray[iInput]).value);
		}
	}
		
	return JSON.stringify(playersData);
}

//stores save data in local storage
function postSavedGame(data){
	var success = true;
	localStorage.setItem('data', data);
	return success;
}	

//retrieves save game from local storage and populates the game board
function restoreGame(){
	var data = JSON.parse(localStorage.getItem('data'));
	
	//determines reaction if there is no saved game
	if (!data){
		var message = "No saved game found";
		element = document.getElementById('winnerDiv');
		element.innerHTML = message;
		removeMessageTimer(element);
		return;
	}
	
	var name = '';
	var players = [];
    var storedPlayers = getPlayerList();
	var inputArray = [];
	
	//creates an array of names in saved game
	for (var index = 0; index < data.length; index += 8){
		players.push(data[index]);
	}
	
	//removes stored players who are not in the saved game
	for (var iStored = 0; iStored < storedPlayers.length; iStored++){
		var name = storedPlayers[iStored];
		var playerIncluded = false;
		
		//compares player names
		for (var iPlayers = 0; iPlayers < players.length; iPlayers++){
			if(name == players[iPlayers]){
				playerIncluded = true;
				
			}			
		}
		
		if(!playerIncluded){
			deletePlayer(name);
		}
	}	
	
	//adds stored players who are not stored to the game board and saves an updated player list
	for (var iPlayers = 0; iPlayers < players.length; iPlayers++){
		var name = players[iPlayers];
		var playerStored = 0;
		
		//compares player names
		for (var iStored = 0; iStored < storedPlayers.length; iStored++){
			if (name == storedPlayers[iStored]){
				playerStored = 1;
			}
		}
		
		//update player list in local storage if necessary
		if (playerStored != 1){
			createPlayerField(name);
			storedPlayers.push(name);
			storePlayerList(storedPlayers);
		}	
	}
	
	//creates an array of scores from storage that needs to be displayed
	for (var index = 0; index < data.length; index += 8){
		name = data[index];
		inputArray = createInputBoxArray(name);
		var scores = [];
		for (var count = 1; count < 8; count++){
			
			scores.push(data[index + count]);
		}
		
		//displays scores
		for (var iInput = 0; iInput < 8; iInput++){
			document.getElementById(inputArray[iInput]).value = scores[iInput];
		}
		
		//needed that scores are summed after game is restored
		getScore(inputArray);
	}
}


//retrieves leaderboard from database
function getLeaderBoard(winner){
	
	var ajaxRequest = new XMLHttpRequest();
	var referenceKey = "-LHW8NKUtdR_rkCIkgKo";
	
	ajaxRequest.open("GET", "https://shanghai-rummy-11.firebaseio.com/leaderboard.json", true);
	
	//performs get request
	ajaxRequest.onreadystatechange = function (){
		if (ajaxRequest.readyState === 4) {
			var status = ajaxRequest.status;
			if ((status >= 200 && status < 300) || status === 304){
				var data = ajaxRequest.responseText;
				var object = JSON.parse(data);
				var leaders = object.leaderboard;
				
				if (winner != null){
					updateLeaderboard(leaders,winner); //update leaderboard if a winner is passed
				} else {
					displayLeaderBoard(leaders); //display the leaderboard after retrieval
				}					
			} else {
				document.getElementById('errorDiv').innerHTML = "Something went wrong with getRequest";
				removeMessageTimer('errorDiv');
			}
				
		}
	}
	ajaxRequest.send(null);
}

//update leaderboard in database
function postRequest(data){

	var ajaxRequest = new XMLHttpRequest();
	ajaxRequest.open("PUT", "https://shanghai-rummy-11.firebaseio.com/leaderboard.json", true);
	ajaxRequest.setRequestHeader("Content-type", "application/json;charset=UTF-8");
	
	ajaxRequest.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			getLeaderBoard();
		}
	};
	
	ajaxRequest.send(JSON.stringify({leaderboard:data}));
}

//needed to allow same button to display and then hide the leaderboard
var leaderBoardClickCount = 0;

//needed to allow same button to display and then hide the leaderboard
function eventHandlerLeaderBoard(){
	if (leaderBoardClickCount ==0){
		getLeaderBoard();
		document.getElementById('ldrbrd').innerHTML = 'Hide Leaderboard';
	} else {
		hideLeaderBoard();
		leaderBoardClickCount = 0;
		document.getElementById('ldrbrd').innerHTML = 'View Leaderboard';
	}
}

//performs tasks to hide the leaderboard
function hideLeaderBoard(){
	parent = document.getElementById('leaderboard');
	child = document.getElementById('highScores');
	parent.removeChild(child);
	element = document.getElementById('tableHeading');
	parent.removeChild(element);
}

//displays the leaderboard
function displayLeaderBoard(data){

	leaderBoardClickCount++;
	
	var leaders = data;
	var output = '';
	var div = document.getElementById('leaderboard');
	var newH2 = document.createElement('H2');
	
	var newText = document.createTextNode("Leaders");
	newH2.appendChild(newText);
	div.appendChild(newH2);
	
	newH2.setAttribute('id','tableHeading');
	var newTable = document.createElement("TABLE");
	newTable.setAttribute('id','highScores');
	div.appendChild(newTable);
	var row0 = newTable.insertRow(0);
	var row1 = newTable.insertRow(1);
	var row2 = newTable.insertRow(2);
	var row3 = newTable.insertRow(3);
	var row4 = newTable.insertRow(4);
	var row5 = newTable.insertRow(5);
	var row6 = newTable.insertRow(6);
	var row7 = newTable.insertRow(7);
	var row8 = newTable.insertRow(8);
	var row9 = newTable.insertRow(9);
	var row10 = newTable.insertRow(10);
	
	var header1 = document.createElement("TH");
	var header2 = document.createElement("TH");
	var header3 = document.createElement("TH");

	var newData1 = row1.insertCell(0);
	var newData2 = row1.insertCell(1);
	var newData3 = row1.insertCell(2);
	var newData4 = row2.insertCell(0);
	var newData5 = row2.insertCell(1);
	var newData6 = row2.insertCell(2);
	var newData7 = row3.insertCell(0);
	var newData8 = row3.insertCell(1);
	var newData9 = row3.insertCell(2);
	var newData10 = row4.insertCell(0);
	var newData11 = row4.insertCell(1);
	var newData12 = row4.insertCell(2);
	var newData13 = row5.insertCell(0);
	var newData14 = row5.insertCell(1);
	var newData15 = row5.insertCell(2);
	var newData16 = row6.insertCell(0);
	var newData17 = row6.insertCell(1);
	var newData18 = row6.insertCell(2);
	var newData19 = row7.insertCell(0);
	var newData20 = row7.insertCell(1);
	var newData21 = row7.insertCell(2);
	var newData22 = row8.insertCell(0);
	var newData23 = row8.insertCell(1);
	var newData24 = row8.insertCell(2);
	var newData25 = row9.insertCell(0);
	var newData26 = row9.insertCell(1);
	var newData27 = row9.insertCell(2);
	var newData28 = row10.insertCell(0);
	var newData29 = row10.insertCell(1);
	var newData30 = row10.insertCell(2);
	var newDatas = [newData1,newData2,newData3,newData4,newData5,
		newData6,newData7,newData8,newData9,newData10,
		newData11,newData12,newData13,newData14,newData15,
		newData16,newData17,newData18,newData19,newData20,
		newData21,newData22,newData23,newData24,newData25,
		newData26,newData27,newData28,newData29,newData30];
	
	var rows = [row1,row2,row3,row4,row5,row6,row7,row8,row9,row10];
	var headers = [header1,header2,header3];
	var headerValues = ['#','Name','Score'];
	
	for (var index = 0; index < 3; index++){
		headers[index].innerHTML = headerValues[index];
		row0.appendChild(headers[index]);
	}

	newData1.innerHTML = 1;
	newData2.innerHTML = leaders[0];
	newData3.innerHTML = leaders[1];
	row1.appendChild(newData1);
	row1.appendChild(newData2);
	row1.appendChild(newData3);
		
	newData4.innerHTML = 2;
	newData5.innerHTML = leaders[2];
	newData6.innerHTML = leaders[3];
	row2.appendChild(newData4);
	row2.appendChild(newData5);
	row2.appendChild(newData6);
	
	newData7.innerHTML = 3;
	newData8.innerHTML = leaders[4];
	newData9.innerHTML = leaders[5];
	row3.appendChild(newData7);
	row3.appendChild(newData8);
	row3.appendChild(newData9);
	
	newData10.innerHTML = 4;
	newData11.innerHTML = leaders[6];
	newData12.innerHTML = leaders[7];
	row4.appendChild(newData10);
	row4.appendChild(newData11);
	row4.appendChild(newData12);
	
	newData13.innerHTML = 5;
	newData14.innerHTML = leaders[8];
	newData15.innerHTML = leaders[9];
	row5.appendChild(newData13);
	row5.appendChild(newData14);
	row5.appendChild(newData15);
	
	newData16.innerHTML = 6;
	newData17.innerHTML = leaders[10];
	newData18.innerHTML = leaders[11];
	row6.appendChild(newData16);
	row6.appendChild(newData17);
	row6.appendChild(newData18);
	
	newData19.innerHTML = 7;
	newData20.innerHTML = leaders[12];
	newData21.innerHTML = leaders[13];
	row7.appendChild(newData19);
	row7.appendChild(newData20);
	row7.appendChild(newData21);
	
	newData22.innerHTML = 8;
	newData23.innerHTML = leaders[14];
	newData24.innerHTML = leaders[15];
	row8.appendChild(newData22);
	row8.appendChild(newData23);
	row8.appendChild(newData24);
	
	newData25.innerHTML = 9;
	newData26.innerHTML = leaders[16];
	newData27.innerHTML = leaders[17];
	row9.appendChild(newData25);
	row9.appendChild(newData26);
	row9.appendChild(newData27);
	
	newData28.innerHTML = 10;
	newData29.innerHTML = leaders[18];
	newData30.innerHTML = leaders[19];
	row10.appendChild(newData28);
	row10.appendChild(newData29);
	row10.appendChild(newData30);

}

//used when first creating leaderboard keeping for when leaderboard needs to be reset.	
function createLeaderboard(){ //used to debug updateLeaderboard
	var leaderboard = [
		'Anonymous',1000,
		'Anonymous',1000,
		'Anonymous',1000,
		'Anonymous',1000,
		'Anonymous',1000,
		'Anonymous',1000,
		'Anonymous',1000,
		'Anonymous',1000,
		'Anonymous',1000,
		'Anonymous',1000];
	var playerInfo = ['Andy',10000];
	updateLeaderboard(leaderboard,playerInfo);
}

//compares current winner info against leaderboard and updates if necessary
function updateLeaderboard(data, playerInfo){
	var leaderboard = data;
	var temp1 = playerInfo;
	var temp2;
	
	//compares scores
	for (var index = 0; index < leaderboard.length; index += 2){
		temp2 = [leaderboard[index],leaderboard[index + 1]];
		for (var objectIndex = 0; objectIndex < 2; objectIndex++)
		{
		var score1 = temp1[1];
		var score2 = temp2[1];
			if (score1 < score2){
				leaderboard[index] = temp1[0];
				leaderboard[index + 1] = temp1[1];
				temp1[0] = temp2[0];
				temp1[1] = temp2[1];
			}
		}
	}	
	
	//sends leaderboard to be stored in database
	postRequest(leaderboard);
}

//counts how many times colorShift button is clicked
var countColorClicks = 0;

//uses countColorClicks to determine which color function to call
function colorShift(){
	if (countColorClicks == 0){
		countColorClicks++;
		colorBlue();
	} else {
		colorGreen();
		countColorClicks = 0;
	}
}

//changes display to blue theme
function colorBlue(){
	var colorShift = document.getElementsByClassName("colorShift");
	var list = getPlayerList();
	
	//performs CSS class property manipulation on header and enjoy div
	for (var index = 0; index < colorShift.length; index++){
		colorShift[index].style.background = "darkBlue";
	}
	
	//adjusts body styles
	var element = document.getElementById("body");
	element.style.transition = "background 2.0s ease-in 0.1s";
	element.style.background = "lightBlue";
	element.style.color = "darkBlue";
	
	//adjusts fieldset text color
	for (var index = 0; index < list.length; index++){
		var field = document.getElementById('player'+ list[index]);
		field.style.color = "darkBlue";
	}
	
	//adjusts input box styles
	var input = document.getElementsByTagName("INPUT");
	for (var index = 0; index < input.length; index++){
		input[index].style.transition = "background 2.0s ease-in 0.1s";
		input[index].style.background = "lightBlue";
		input[index].style.color = "darkBlue";
	}
	
	//adjusts hands div styles
	var hands = document.getElementById("hands");
	hands.style.transition = "background 2.0s ease-in 0.1s";
	hands.style.background = "lightBlue";
	hands.style.color = "darkBlue";	 
	
	//adjusts button styles
	var buttons = document.getElementsByClassName('btn');
	for (var index = 0; index < buttons.length; index++){
		buttons[index].style.transition = "background 2.0s ease-in 0.1s";
		buttons[index].style.background = "darkBlue";
		buttons[index].style.color = "white";
	}
	
	//adjusts style of player name input box
	var playerInput = document.getElementById('playerName');
	playerInput.style.background = "white";
	
}

//changes display to green theme
function colorGreen(){
	var colorShift = document.getElementsByClassName("colorShift");
	var list = getPlayerList();
	
	//performs CSS class property manipulation on header and enjoy div
	for (var index = 0; index < colorShift.length; index++){
		colorShift[index].style.background = "rgba(0,111,11,1)";
	}
	
	//adjusts body styles
	var element = document.getElementById("body");
	element.style.transition = "background 2.0s ease-in 0.1s";
	element.style.background = "rgba(208,230,240,1)";
	element.style.color = "rgba(0,75,0,1)";
	
	//adjusts fieldset text color
	for (var index = 0; index < list.length; index++){
		var field = document.getElementById('player'+ list[index]);
		field.style.color = "rgba(0,75,0,1)";
	}
	
	//adjusts input box styles
	var input = document.getElementsByTagName("INPUT");
	for (var index = 0; index < input.length; index++){
		input[index].style.transition = "background 2.0s ease-in 0.1s";
		input[index].style.background = "rgba(119,252,130,.5)";
		input[index].style.color = "rgba(0,75,0,1)";
	}
	
	//adjusts hands div styles
	var hands = document.getElementById("hands");
	hands.style.transition = "background 2.0s ease-in 0.1s";
	hands.style.background = "rgba(119,252,130,.5)";
	hands.style.color = "rgba(0,75,0,1)";

	//adjusts button styles
	var buttons = document.getElementsByClassName('btn');
	for (var index = 0; index < buttons.length; index++){
		buttons[index].style.transition = "background 2.0s ease-in 0.1s";
		buttons[index].style.background = "rgba(0,111,11,1)";
		buttons[index].style.color = "white";
	}
	
	//adjusts style of player name input box
	var playerInput = document.getElementById('playerName');
	playerInput.style.background = "white";
}

//plays jingle sound when jester div is clicked
function playJingle(){
	var audio = document.getElementById("bell");
	audio.play();
}
