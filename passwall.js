
////////////
//Packages//
////////////
const readline = require('readline');
const fs = require('fs');
const crypto = require('crypto')



///////////////////////////////
//Globals and initializations//
///////////////////////////////

//Initialize global readline interface
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

//Set password prompt
rl.password_prompt = "Enter master password: "

//Track current wallet
var current_wallet = {
	wallet_name: undefined,
	master_password: undefined
};



//Display all wallets in current directory
/*fs.readdir("./", (err, files) => {
  files.forEach(file => {
    console.log(file);
  });
})*/


////////
//Main//
////////

rl.question('Enter wallet filename, or "new" for new wallet: ', (response) => {

	//User typed "new"
	if(response.toLowerCase() == 'new'){
		create_new_wallet();
	}

	else{
		open_existing_wallet(response);
	}
});

//This function creates an empty wallet file from a user-provided name and password
var create_new_wallet = function(){

	var wallet_name;

	//Prompt user for wallet name
	rl.question("Enter new wallet name: ", (response) => {

		validate_wallet_name(response);

		//Add file extension if user hasn't done so
		wallet_name = response;
		if(!wallet_name.includes(".wal")){
			wallet_name += ".wal";
		}

		set_master_password(wallet_name);
		
	});
}

//This function prompts the user to set the new master password.
//This function will recurse until the user inputs the same password twice.
var set_master_password = function(wallet_name){

	var master_password;

	//Replace password with *'s in console
	rl.stdoutMuted = true;

	//Prompt user for wallet master password
	rl.question("Enter master password: ", (response) => {

		master_password = response;
		rl.password_prompt = "Confirm master password: ";
		
		//Prompt user to retype master password
		rl.question("Confirm master password: ", (response) => {

			//If passwords matched:
			if(response == master_password){
				create_new_wallet_file(wallet_name, master_password);
				display_menu();
			}

			else{
				set_master_password();
			}
		});
	});
}

var create_new_wallet_file = function(wallet_name, master_password){

	fs.writeFile(wallet_name, new_wallet_content, function (err) {
		if (err) throw err;
		console.log('Saved!');
	});
}

var open_existing_wallet = function(wallet_filename){

	//Add file extension if user hasn't done so
	if(!wallet_filename.includes(".wal")){
		wallet_filename += ".wal";
	}

	//Read wallet file
	fs.readFile(wallet_filename, "utf8", function(err, file_content) {

		if(err) console.log("Error: could not locate file with provided name");
		

		else{
			console.log(`Opening ${wallet_filename}`);
			console.log(file_content);
		}
	});
}


//This function checks if wallet_name is a valid wallet name
var validate_wallet_name = function(wallet_name){

	//Check if name is in use by another wallet file

}


var display_menu = function(){
	console.log("");
}




//Overwrite in order to handle passwords in console
rl._writeToOutput = function _writeToOutput(stringToWrite) {
	if(rl.stdoutMuted){
		rl.output.write("\x1B[2K\x1B[200D"+ rl.password_prompt + "*".repeat(rl.line.length));
	}
	else
		rl.output.write(stringToWrite);
};