// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Upload {
  
  struct Access{
     address user; 
     bool access; //true or false
  }
  mapping(address=>string[]) value;
  mapping(address=>mapping(address=>bool)) ownership;
  mapping(address=>Access[]) accessList;
  mapping(address=>mapping(address=>bool)) previousData;

  function add(address _user,string memory url) external {
      value[_user].push(url);
  }


  function erase(address _user,string memory url) external {
    string[] storage userUrls = value[_user]; // Obtener el array del usuario
    bool found = false;

    // Buscar la URL a eliminar
    for (uint i = 0; i < userUrls.length; i++) {
        if (keccak256(abi.encodePacked(userUrls[i])) == keccak256(abi.encodePacked(url))) {
            // Si se encuentra la URL, reemplazarla por el último elemento
            userUrls[i] = userUrls[userUrls.length - 1]; // Reemplaza con el último elemento
            userUrls.pop(); // Elimina el último elemento
            found = true;
            break;
        }
    }
    require(found, "URL not found"); // Si no se encuentra, revertir la transacción
  }

  function allow(address user) external {//def
      ownership[msg.sender][user]=true; 
      if(previousData[msg.sender][user]){
         for(uint i=0;i<accessList[msg.sender].length;i++){
             if(accessList[msg.sender][i].user==user){
                  accessList[msg.sender][i].access=true; 
             }
         }
      }else{
          accessList[msg.sender].push(Access(user,true));  
          previousData[msg.sender][user]=true;  
      }
    
  }
  function disallow(address user) public{
      ownership[msg.sender][user]=false;
      for(uint i=0;i<accessList[msg.sender].length;i++){
          if(accessList[msg.sender][i].user==user){ 
              accessList[msg.sender][i].access=false;  
          }
      }
  }

  function display(address _user) external view returns(string[] memory){
      require(_user==msg.sender || ownership[_user][msg.sender],"You don't have access");
      return value[_user];
  }

  function shareAccess() public view returns(Access[] memory){
      return accessList[msg.sender];
  }
}