// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TicketStore {

    address[] public eventList;


    function addEvent(address eventId) public returns (address[] memory) {
        eventList.push(eventId);
        return eventList;
    }

    function getEvents() public view returns (address[] memory) {
        return eventList;
    }

}