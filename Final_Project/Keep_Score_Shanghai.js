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
		newTextBox.setAttribute('size', '1');
		newFieldSet.appendChild(newTextBox);
		newTextBox.onchange = function(){getScore(inputBoxArray)};
	}
/*	
	var newSubmit = document.createElement("input");
	newSubmit.setAttribute('type','submit');
	newSubmit.setAttribute('value',"Submit");
	newSubmit.addEventListener('click', getScoreForName);
	newSubmit.setAttribute('id', name);
	newFieldSet.appendChild(newSubmit); 
	function getScoreForName(){
		getScore(inputBoxArray);
	}*/
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
   var winnerScore = 1000000; //for use in validating winner score
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
	if (winner[1] != 1000000){ //if winner score is 1000000 winner is generic
    output = "The winner is " + winner[0] +
    " with a score of " + winner[1] + ".";
	} else {
		output = "Please enter some scores before declaring a winner.";
	}
   
    document.getElementById("winnerDiv").innerHTML = output;
	var totalPointsHand7 = 0;
    for (var index = 0; index < playersList.length; index++){
	var score = parseInt(document.getElementById(playersList[index] + 'Hand7').value);
		totalPointsHand7 += score;
   }
	if (totalPointsHand7 > 0){
		getLeaderBoard(winner);
	}
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

function createLeaderboard(){
	var leaderboard = ['Anonymous',1000,
					'Anonymous',1000,
					'Anonymous',1000,
					'Anonymous',1000,
					'Anonymous',1000,
					'Anonymous',1000,
					'Anonymous',1000,
					'Anonymous',1000,
					'Anonymous',1000,
					'Anonymous',1000]
	
	return JSON.stringify(leaderboard);
}
function storeLeaderboard(){
	var data = createLeaderboard();
	postRequest(data);
}

function getLeaderBoard(winner){
	
	var ajaxRequest = new XMLHttpRequest();
	var referenceKey = "-LHW8NKUtdR_rkCIkgKo";
	
	ajaxRequest.open("GET", "https://shanghai-rummy-11.firebaseio.com/leaderboard.json", true);
	
	ajaxRequest.onreadystatechange = function (){
		if (ajaxRequest.readyState === 4) {
			var status = ajaxRequest.status;
			if ((status >= 200 && status < 300) || status === 304){
				var data = ajaxRequest.responseText;
				var object = JSON.parse(data);
				var leaders = object.leaderboard;
				//var leaders = object[referenceKey].leaderboard;
				if (winner != null){
					updateLeaderboard(leaders,winner);
				}
				displayLeaderBoard(leaders);
				
				//document.getElementById("leaderboard").innerHTML = data;
				} else {
					alert ("Something went wrong with getRequest");
				}
		}
	}
	ajaxRequest.send(null);
}

function patchLeaderBoard(data){
	var ajaxRequest = new XMLHttpRequest();
	var referenceKey = "-LHW8NKUtdR_rkCIkgKo";
	var targetUrl = "https://shanghai-rummy-11.firebaseio.com/leaderboard/" + 
	referenceKey + ".json"
	ajaxRequest.open("PATCH","https://shanghai-rummy-11.firebaseio.com/leaderboard.json", true);
	ajaxRequest.onreadystatechange = function(){
		if (this.readyState == 4 && this.status == 200){
			ajaxRequest.send(JSON.stringify(data));
		}
	};
}

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

function displayLeaderBoard(data){
	var leaders = data;
	
	var output = '';
    for (var index = 0; index < leaders.length; index += 2){
		var num = (index / 2) + 1;
		output += num + " " + leaders[index] + " " + leaders[index + 1] + '<br>';
		document.getElementById("leaderboard").innerHTML = output;
    }
	
}
	
function simulateGoodDataFormat(){
	var leaderboard = ['Joe',900,
					'Alice',900,
					'Sam',950,
					'Anonymous',1000,
					'Anonymous',1000,
					'Anonymous',1000,
					'Anonymous',1000,
					'Anonymous',1000,
					'Anonymous',1000,
					'Anonymous',1000];
	var playerInfo = ['Andy',100];
	updateLeaderboard(leaderboard,playerInfo);
}

function updateLeaderboard(data, playerInfo){
	var leaderboard = data;
	
	var temp1 = playerInfo;
	var temp2;
	for (var index = 0; index < leaderboard.length / 2; index += 2){
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
	//PUT	
	postRequest(leaderboard);
}

function colorShift(){
	var timer = setInterval(colorReturn,4000);
	var colorShift = document.getElementsByClassName("colorShift");
	
	for (var index = 0; index < colorShift.length; index++){
		colorShift[index].style.background = "darkBlue";
	}		
}

function colorReturn(){
	var colorShift = document.getElementsByClassName("colorShift");
	for (var index = 0; index < colorShift.length; index++){
		colorShift[index].style.background = "rgba(0, 111, 11, 1)";
	}
}

function animateColor(){
	var timer = setInterval (returnAnimation,4000);
	var element = document.getElementById("body");
	element.style.transition = "background 2.0s ease-in 0.1s";
	element.style.background = "lightBlue";
}

function returnAnimation(){
	var element = document.getElementById("body");
	element.style.transition = "background 2.0s ease-in 0.1s";
	element.style.background = "rgba(152,251,152,1)";
}

function playJingle(){
	var audio = document.getElementById("bell");
	audio.play();
}
