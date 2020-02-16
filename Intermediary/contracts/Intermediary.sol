pragma solidity >=0.4.22 <0.7.0;

contract Intermediar {
	mapping (string => mapping(address => uint)) rentBook;
	mapping (string => string) hashMap;

	function rent (string memory hash, address reciver, uint ttl) public returns(string memory){
		string memory hashedHash = _bytes32ToStr(keccak256(abi.encode(hash)));
		hashMap[hashedHash] = hash;
		rentBook[hash][reciver]+=ttl;		
	}

	function request (string memory hashedHash) public returns(string memory) {
		string memory hash = hashMap[hashedHash];
		if(rentBook[hash][msg.sender] > 0){
			rentBook[hash][msg.sender]--;
			return hash;
		}
		else{
			return "-1";
		}
	}

	function _bytes32ToStr(bytes32 _bytes32) private returns (string memory) {

	    bytes memory bytesArray = new bytes(32);
	    for (uint256 i; i < 32; i++) {
	        bytesArray[i] = _bytes32[i];
	        }
	    return string(bytesArray);
    }
	
}
