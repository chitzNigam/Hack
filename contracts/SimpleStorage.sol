pragma solidity >=0.4.21 <0.7.0;

contract SimpleStorage {
  
  mapping (bytes32 => bytes32) private groips;
  
  // function set(uint x) public {
  //   storedData = x;
  // }

  // function get() public view returns (uint) {
  //   return storedData;
  // }  

  function _getHash (string storage client1, string storage client2) private returns(bytes32) {
  	string storage long = "";
  	string storage short = "";
  	if(client2>client1){
  		long=client2;
  		short=client1;
  	}
  	else{
  		long=client1;
  		short=client2;
  	}

  	return sha256(concat(long,short));  	
  }

  function concat(bytes memory a, bytes memory b)
            internal pure returns (bytes memory) {
        return abi.encodePacked(a, b);
    }

  	function _toString(address x) private returns(string storage) {
	    bytes memory b = new bytes(20);
	    for (uint i = 0; i < 20; i++)
	        b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
	    return string(b);
	}
  
}
