//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract NeuronNFT is ERC721, Ownable {
    using Strings for uint256;
    uint256 public supplyMinted = 0;
    string public baseURI = "https://ipfs.io/ipfs/Qma6r51Mt9My14BZnwTD7Ay6DBUUtMcFAoM7wsdMP5UaaG/";
    address public flameaddress;
    mapping(uint256 => address[]) tokenNetwork;

    constructor() ERC721("Neuron Network", "NENTWK") {}

    function mint(address net1, address net2, address net3, address net4, address net5) external payable {
        require(msg.value >= .015 ether);
        uint256 id = supplyMinted+1;
        require(id <= 1000);

        //network setup
        require((balanceOf(net1) + balanceOf(net2) +balanceOf(net3) + balanceOf(net4) + balanceOf(net5)) < 1, "Cannot intrude into an established network.");
        require(net1 != msg.sender);
        tokenNetwork[id].push(net1);
        require(net2 != msg.sender && net2 != tokenNetwork[id][0]);
        tokenNetwork[id].push(net2);
        require(net3 != msg.sender && net3 != tokenNetwork[id][0] && net3 != tokenNetwork[id][1]);
        tokenNetwork[id].push(net3);
        require(net4 != msg.sender && net4 != tokenNetwork[id][0] && net4 != tokenNetwork[id][1] && net4 != tokenNetwork[id][2]);
        tokenNetwork[id].push(net4);
        require(net5 != msg.sender && net5 != tokenNetwork[id][0] && net5 != tokenNetwork[id][1] && net5 != tokenNetwork[id][2] && net5 != tokenNetwork[id][3]);
        tokenNetwork[id].push(net5);

        _safeMint(msg.sender, id);
        supplyMinted++;
    }


    //View
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }
    function viewNetwork(uint256 _tokenId) external view returns (address ,address ,address ,address ,address) {
        return (tokenNetwork[_tokenId][0],tokenNetwork[_tokenId][1],tokenNetwork[_tokenId][2],tokenNetwork[_tokenId][3],tokenNetwork[_tokenId][4]);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId),"ERC721Metadata: URI query for nonexistant token");
        string memory currentBaseURI = _baseURI();
        uint256 adder1 = balanceOf(tokenNetwork[tokenId][0]);
        if (adder1 > 2) {adder1 = 2;}
        uint256 adder2 = balanceOf(tokenNetwork[tokenId][1]);
        if (adder2 > 2) {adder2 = 2;}
        uint256 adder3 = balanceOf(tokenNetwork[tokenId][2]);
        if (adder3 > 2) {adder3 = 2;}
        uint256 adder4 = balanceOf(tokenNetwork[tokenId][3]);
        if (adder4 > 2) {adder4 = 2;}
        uint256 adder5 = balanceOf(tokenNetwork[tokenId][4]);
        if (adder5 > 2) {adder5 = 2;}
        uint256 tier = (1 + adder1 + adder2 + adder3 + adder4 + adder5);
        if (tier == 11){
            if (balanceOf(ownerOf(tokenId)) > 1) {tier = 10;}
        }
        
        return bytes(currentBaseURI).length > 0 ? string(abi.encodePacked(currentBaseURI, tier , ".json")): "";
    }
  

    //owner
    function setsupercont(address _supcont) onlyOwner external {
        flameaddress = _supcont;
    }
    //Future burning mechanism if necessary. (All burns will be optional.)
    function superburn(uint256 _tokenid) external {
        require(msg.sender == flameaddress);
        _burn(_tokenid);
    }


    function withdraw() public payable onlyOwner {
        require(payable(msg.sender).send(address(this).balance));
    }

    //Handles preventing conflicting network for NFT transfers
    //modifier neutran(address from, address to, uint256 _tokenId) override {
    //    if(to != address(0)){
    //      require(tokenNetwork[_tokenId][0] != to, 'You cannot transfer a Neuron to an address supporting its network');
    //      require(tokenNetwork[_tokenId][1] != to, 'You cannot transfer a Neuron to an address supporting its network');
    //      require(tokenNetwork[_tokenId][2] != to, 'You cannot transfer a Neuron to an address supporting its network');
    //      require(tokenNetwork[_tokenId][3] != to, 'You cannot transfer a Neuron to an address supporting its network');
    //      require(tokenNetwork[_tokenId][4] != to, 'You cannot transfer a Neuron to an address supporting its network');     
    //        }
    //        _;}
        
}