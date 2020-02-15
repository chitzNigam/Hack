pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract EtherChat {


	struct Msg {
		string sender;
		uint msg_type; //1-text,2-file
		string data;
	}
	
	string[] public s;
	string public ss;
	bool public t;
	uint public count1;
	event msgAdd(address sender, string reciver, string data, uint msg_type); 
	event msgSearch(string senderList, string sender);

	constructor () public {
		addUser(0xfCAE8fE9C7757014a5b028686250cD1C28c2269b, "01");
		addUser(0xC134252dEdef77ea78A0CeD1d918c443e1C0739A,"00");
		subscribe(0xC134252dEdef77ea78A0CeD1d918c443e1C0739A,"01");
		publishMsg(0xfCAE8fE9C7757014a5b028686250cD1C28c2269b,"00","Hello",1);
		t = _strcomp("0","0");
		//string[] memory mm = getMsg(0xC134252dEdef77ea78A0CeD1d918c443e1C0739A, "01");
	} 

	mapping (string  => mapping (string  => Msg)) users;
	mapping (string  => string[] ) subscriberList;
	mapping (address => string ) public usernames ;
	mapping (string => bool) ListOfAllUsernames;
	mapping (address => bool) ListOfAllAccounts;
	
	
	
	function publishMsg (address sender, string memory reciver, string memory data, uint msg_type) public {
		users[usernames[sender]][reciver] = Msg(usernames[sender],msg_type,data);
		emit msgAdd(sender, reciver, data, msg_type);
		
	}
	
	function getMsg (address subscriber, string memory sender) public {
		string[100] memory msgs;
		Msg memory temp;
		uint i;
		uint count = 0;
		string memory myUsername = usernames[subscriber];
		string[] memory mySubscribers = subscriberList[myUsername];

		for(i=0; i < mySubscribers.length; ++i){
			temp = users[mySubscribers[i]][myUsername];
		
				emit msgSearch(temp.sender,sender);
				if(_strcomp(temp.sender,sender)){
					msgs[count] = temp.data;
					count++;
				}
			
		}
		//count1=count;
		// ss = myUsername;
		// s = subscriberList[myUsername];
		// count1 = s.length;
		//return msgs;
		s = msgs;
	}

	function addUser (address add, string memory username) public {
		if(ListOfAllAccounts[add]==true)
			return;
		if(ListOfAllUsernames[username]==true)
			return;
		usernames[add]  = username;
		ListOfAllUsernames[username] = true;
		ListOfAllAccounts[add] = true;
		
	}
	
	function subscribe (address me, string memory username) public {
		if(!_isPresentInList(subscriberList[usernames[me]], username)){
			subscriberList[usernames[me]].push(username);
		}
	}
	
	function _isPresentInList (string[] memory list, string memory s) private returns (bool) {
		uint i=0;
		for(i=0; i<list.length; ++i){
			if(_strcomp(s,list[i])){
				return true;
			}
		}
		return false;
	}

	function _strcomp (string memory s1, string memory s2) private returns(bool res) {
		if(keccak256(abi.encodePacked((s1))) == keccak256(abi.encodePacked((s2))))
			return true;
		else
			return false;
	}
	

	//TODO : check subscribe and publish
	//TODO : End-to-End encryption
	//TODO : IPFS
	
}