function detectPlayers(){
	var playerList = getPlayerList();
	if (playerList != null){
		for (var index = 0; index < playerList.length; index++){
			createPlayerField(playerList[index]);
		}
	}
}

function populatePlayers(list){
	var name = "";
	for(var index = 0; index < list.length; index++){
		createPlayerField(list[index]);
	}
}

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
	var inputBoxArray = [name + "TotalScore", name + "Hand1", name + 
	"Hand2", name + "Hand3", name + "Hand4", name + "Hand5", name + 
	"Hand6", name + "Hand7"];

	var fieldText = ["T:","1:","2:","3:","4:","5:","6:","7:"];
		
	for (var index = 0; index < inputBoxArray.length; index++){
		var newFieldText = document.createTextNode(fieldText[index]);
		newFieldSet.appendChild(newFieldText);
		var newTextBox = document.createElement("input");
		newTextBox.setAttribute('type', 'text');
		newTextBox.setAttribute('id', inputBoxArray[index]);
		newTextBox.setAttribute('size', '3');
		newFieldSet.appendChild(newTextBox);
	}			
	var newSubmit = document.createElement("input");
	newSubmit.setAttribute('type','submit');
	newSubmit.setAttribute('value',"Submit");
	newSubmit.addEventListener('click', getScoreForName);
	newSubmit.setAttribute('id', name);
	newFieldSet.appendChild(newSubmit); 
	function getScoreForName(){
		getScore(inputBoxArray);
	}
}

function getPlayerList(){
	var playerList = JSON.parse(localStorage.getItem('playerList'));
	if (playerList != null){
		return playerList;
	} else {
		var playerList = [];
		return playerList;
	}
}

function createPlayer(){
	var name = document.getElementById('playerName').value;
	if (name != ""){
		createPlayerField(name);
	}else{
		alert('Please type name first');
	}
   if (localStorageSupported('localStorage')){
	   var playerList = getPlayerList();
	   playerList.push(name);
	   storePlayerList(playerList);
   }
   document.getElementById('playerName').value = "";
}

function deletePlayer(){
	var name = document.getElementById('playerName').value;
	var playerList = getPlayerList();
	var newPlayerList = playerList.filter(a => a !== name);
	storePlayerList(newPlayerList);
	var parent = document.getElementById('playerDiv');
	var child = document.getElementById('player' + name);
	parent.removeChild(child);
	document.getElementById('playerName').value = "";
}

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

function getScore(inputArray){
	var playerScoresArray = [];
	for (var index = 1; index < inputArray.length; index++){
	    var value = document.getElementById(inputArray[index]).value;
	    if (value != null && value != ""){
		    playerScoresArray[index - 1] = value;
	    }
	}
	console.log(playerScoresArray);
	var sum = 0;
    var score = 0;
    for (var index = 0; index < playerScoresArray.length; index++){
    score = parseInt(playerScoresArray[index]);
    if (score != NaN && score != "")
   {
      sum += score;
   }
   }
   
   document.getElementById(inputArray[0]).value = sum;
}

function whoIsWinning(playersArray){
   var totalPointsReceived = 0;
   for (var index = 0; index < playersArray.length; index++){
	   var player = playersArray[index];
   totalPointsReceived += player.totalScore;
   }
   var winnerScore = 1000000;
   var winnerName = "";
   var winnerInfo = [winnerName,winnerScore];
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
   return winnerInfo;
}

function displayWinner(){
	var playersList = getPlayerList();
	var playersArray = createPlayersArray(playersList);
    winner = whoIsWinning(playersArray);
	if (winner[1] != 1000000){
    output = "The winner is " + winner[0] +
    " with a score of " + winner[1] + ".";
	} else {
		output = "Please enter some scores before declaring a winner.";
	}
   
    document.getElementById("winnerDiv").innerHTML = output;
}

function createPlayersArray(list){
	var playerScores = [];
	var score = '';
	for (var index = 0; index < list.length; index++){
		score = parseInt(document.getElementById(list[index] + 'TotalScore').value);
		playerScores[index] = new player (list[index], score);
	}
	return playerScores;
}

function player(name,score){
   this.playerName = name;
   this.totalScore = score;
}

function saveGame(){
	var list = getPlayerList();
	var data = createGameData(list);
	saveSuccess = postSavedGame(data);
	if (saveSuccess){
		for (var index = 0; index < list.length; index++){
			var name = list[index];
			document.getElementById(name + 'TotalScore').value = "";
			document.getElementById(name + 'Hand1').value = "";
			document.getElementById(name + 'Hand2').value = "";
			document.getElementById(name + 'Hand3').value = "";
			document.getElementById(name + 'Hand4').value = "";
			document.getElementById(name + 'Hand5').value = "";
			document.getElementById(name + 'Hand6').value = "";
			document.getElementById(name + 'Hand7').value = "";
		}
	}
}

function createGameData(list){
	var playersData = []
	
	for (var index = 0; index < list.length; index++){
		var name = list[index];
		playersData.push(name);
		playersData.push(document.getElementById(name + 'Hand1').value);
		playersData.push(document.getElementById(name + 'Hand2').value);
		playersData.push(document.getElementById(name + 'Hand3').value);
		playersData.push(document.getElementById(name + 'Hand4').value);
		playersData.push(document.getElementById(name + 'Hand5').value);
		playersData.push(document.getElementById(name + 'Hand6').value);
		playersData.push(document.getElementById(name + 'Hand7').value);
	}
		
	return JSON.stringify(playersData);
}

function postSavedGame(data){
	var success = true;
	localStorage.setItem('data', data);
	return success;
}	

function restoreGame(){
	var data = JSON.parse(localStorage.getItem('data'));
	var name = '';
	var players = [];
    var storedPlayers = getPlayerList();
	for (var index = 0; index < data.length; index += 8){
		players.push(data[index]);
	}
	
	for (var iPlayers = 0; iPlayers < players.length; iPlayers++){
		var name = players[iPlayers];
		var playerStored = 0;
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
	
	for (var index = 0; index < data.length; index += 8){
		name = data[index];
		var scores = [];
		for (var count = 1; count < 8; count++){
			
			scores.push(data[index + count]);
		}
		document.getElementById(name + 'Hand1').value = scores[0];
		document.getElementById(name + 'Hand2').value = scores[1];
		document.getElementById(name + 'Hand3').value = scores[2];
		document.getElementById(name + 'Hand4').value = scores[3];
		document.getElementById(name + 'Hand5').value = scores[4];
		document.getElementById(name + 'Hand6').value = scores[5];
		document.getElementById(name + 'Hand7').value = scores[6];
				
	}
}

