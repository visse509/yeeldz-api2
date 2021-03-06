// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "https://github.com/lukso-network/lsp-universalprofile-smart-contracts/blob/main/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAssetCore.sol";
import "https://github.com/lukso-network/lsp-universalprofile-smart-contracts/blob/main/contracts/LSP4DigitalAssetMetadata/LSP4DigitalAssetMetadata.sol";

contract Ticket is LSP4DigitalAssetMetadata, LSP8IdentifiableDigitalAssetCore {

    bytes32 constant _EventName =
    0xdeba1e292f8ba88238e10ab3c7f88bd4be4fac56cad5194b6ecceaf653468af2;

    bytes32 constant _Price =
    0xdeba1e292f8ba88238e10ab3c7f88bd4be4fac56cad5194b6ecceaf653468af3;

    bytes32 constant _MaxSupply =
    0xdeba1e292f8ba88238e10ab3c7f88bd4be4fac56cad5194b6ecceaf653468af4;

    bytes32 constant _Description =
    0xdeba1e292f8ba88238e10ab3c7f88bd4be4fac56cad5194b6ecceaf653468af5;

    bytes32 constant _Location =
    0xdeba1e292f8ba88238e10ab3c7f88bd4be4fac56cad5194b6ecceaf653468af6;

    bytes32 constant _Date =
    0xdeba1e292f8ba88238e10ab3c7f88bd4be4fac56cad5194b6ecceaf653468af7;

    bytes32 constant _Img =
    0xdeba1e292f8ba88238e10ab3c7f88bd4be4fac56cad5194b6ecceaf653468af8;

    mapping (bytes32 => uint) sellableTicketsMap;

    mapping(bytes32 => bool) redeemedTickets;

    bytes32[] sellableTickets;

    mapping(uint=>uint) indexOfTicket;

    uint ticketId;

    uint price;

    uint totalTickets;

    constructor(
        string memory name_,
        string memory symbol_,
        address newOwner_,
        uint price,
        uint totalTickets,
        string memory eventName,
        string memory description,
        string memory location,
        string memory date,
        string memory img
    ) LSP4DigitalAssetMetadata(name_, symbol_, newOwner_) {
        ticketId = 0;
        _registerInterface(_LSP8_INTERFACE_ID);
        _setData(_LSP8_SUPPORTED_STANDARDS_KEY, abi.encodePacked(_LSP8_SUPPORTED_STANDARDS_VALUE));
        _setData(_Price, abi.encodePacked((price)));
        _setData(_MaxSupply, abi.encodePacked((totalTickets)));
        _setData(_EventName, bytes(eventName));
        _setData(_Description, bytes(description));
        _setData(_Location, bytes(location));
        _setData(_Date, bytes(date));
        _setData(_Img, bytes(img));
    }

    function redeemTickets(bytes32 ticketId) public {
        redeemedTickets[ticketId] = true;
    }

    function isTicketRedeemed(bytes32 ticketId) public view returns(bool) {
        return redeemedTickets[ticketId];
    }

    function getEventData() public view returns (uint, uint, uint, string memory, string memory, string memory, string memory, string memory) {
        return (totalSupply(),
        sliceUint(_getData(_Price)),
        sliceUint(_getData(_MaxSupply)),
        string(_getData(_EventName)),
        string(_getData(_Description)),
        string(_getData(_Location)),
        string(_getData(_Date)),
        string(_getData(_Img)));
    }

    function addSellableTicket(bytes32 ticketId, uint cost) public {
        sellableTickets.push(ticketId);
        sellableTicketsMap[ticketId] = cost;
    }

    function buySellableTicket(address buyer, bytes32 ticketId) payable public {
        require(msg.value == sellableTicketsMap[ticketId]);
        (bool success, ) = tokenOwnerOf(ticketId).call{value:sellableTicketsMap[ticketId]}("");
        require(success, "Ticket Sale failed.");
        _transfer(tokenOwnerOf(ticketId), buyer, ticketId, false, bytes("You bought a ticket"));
        sellableTicketsMap[ticketId] = 0;

    }

    function getSellableTicketCost(bytes32 ticketId) public view returns (uint) {
        return sellableTicketsMap[ticketId];
    }

    function getSellableTickets() public view returns (bytes32[] memory){
        return sellableTickets;
    }

    function getEventName() public view returns (string memory) {
        return string(_getData(_EventName));
    }

    function getCost() public view returns (uint) {
        return sliceUint(_getData(_Price));
    }

    function createTicket(address upAddress) payable public {
        require(msg.value == getCost());
        require(tokenIdsOf(upAddress).length == 0);
        require(sliceUint(_getData(_MaxSupply)) > totalSupply());
        ticketId++;
        _mint(upAddress, bytes32(ticketId), false, abi.encodePacked(ticketId));
    }

    function transferTicket(
        address from,
        address to,
        bytes32 tokenId,
        bool force,
        string memory data
    ) public {
        _transfer(from, to, tokenId, force, bytes(data));
    }

    function sliceUint(bytes memory bs) internal pure returns (uint) {
        uint x;
        assembly {
            x := mload(add(bs, add(0x20, 0)))
        }
        return x;
    }
}