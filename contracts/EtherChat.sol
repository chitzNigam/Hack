pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract EtherChat {

	struct Msg {
		uint msg_type; //1-text,2-file
		bytes32[] data;
	}
	
	constructor () public {
		addUser(0xfCAE8fE9C7757014a5b028686250cD1C28c2269b, "01");
	} 

	mapping (string  => mapping (string  => Msg)) users;
	mapping (string  => string[] ) subscriberList;
	mapping (address => string ) public usernames ;
	mapping (address => bool) public ListOfAllUsernames;
	mapping (address => bool) ListOfAllAccounts;
	
	
	
	function publishMsg (address sender, string memory reciver, bytes32[] memory data, uint msg_type) public {
		users[usernames[sender]][reciver] = Msg(msg_type,data);
	}
	
	function getMsg (address subscriber) public returns(Msg[] memory){
		Msg[] memory msgs;
		uint i;
		string memory myUsername = usernames[subscriber];
		string[] memory mySubscribers = subscriberList[myUsername];

		for(i=0; i<mySubscribers.length; ++i){
			msgs[i] = users[mySubscribers[i]][myUsername];
		}
		return msgs;
	}

	function addUser (address add, string memory username) public {
		//TODO : chack for duplicate usernames
		//TODO : No two userADD shoud have different accounts

		usernames[add]  = username;
		
	}

	function _userNameExist (string memory username) private returns(bool res) {
		
	}
	
	function subscribe (address me, string memory username) public {
		if(!_isPresentInList(subscriberList[usernames[me]], username)){
			subscriberList[usernames[me]].push(username);
		}
	}
	
	function _isPresentInList (string[] memory list, string memory s) private returns (bool) {
		uint i=0;
		for(i=0; i<list.length; ++i){
			if(keccak256(abi.encodePacked((s))) == keccak256(abi.encodePacked((list[i])))){
				return true;
			}
		}
		return false;
	}

	//TODO : check subscribe and publish
	//TODO : End-to-End encryption
	//TODO : IPFS
	
}