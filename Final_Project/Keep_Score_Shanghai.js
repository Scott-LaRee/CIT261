function detectPlayers(){
	var playerList = getPlayerList();
	if (playerList != null){
		createPlayerField(playerList);
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
function player(name){
   this.playerName = name;
   this.hand1 = 0;
   this.hand2 = 0;
   this.hand3 = 0;
   this.hand4 = 0;
   this.hand5 = 0;
   this.hand6 = 0;
   this.hand7 = 0;
}

function createPlayer(){
   if (localStorageSupported('localStorage')){
	   var name = document.getElementById('playerName').value;
	   var playerList = getPlayerList();
	   playerList.push(name);
	   storePlayerList(playerList);
   }
   createPlayerField(playerList);
}

function storePlayerList(list){
	localStorage.setItem("playerList", JSON.stringify(list));
}

//function tests to see if localStorage is supported
function localStorageSupported(type)
{
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
     return error instanceof DOMExeption && (
	 error.code === 22 || 
	 error.code === 1014 || 
	 error.name === 'QuotaExceededError' ||
	 error.name === 'NS_ERROR_DOM_QUOTA_REACHED') && 
	 storage.length !== 0;
   }
}

function createPlayerField(list){
	var nameList = "";
	for (index = 0; index < list.length; index++){
		var name = list[index];
		nameList += name + " ";
		document.getElementById('outputDiv').innerHTML = nameList;
		var div = document.createElement("div");
		div.setAttribute("id",name);
		var element = document.getElementById("playerDiv");
		element.appendChild(div);
	}
      
}