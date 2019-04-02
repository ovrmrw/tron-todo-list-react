pragma solidity >=0.4.21 <0.6.0;

contract TodoList {
  string greeting = "Hello, World!";
  uint public counter = 1;

  function getGreeting() view public returns (string memory) {
    return greeting;
  }

  function multiply(uint n) pure public returns (uint) {
    return n * n;
  }
}
