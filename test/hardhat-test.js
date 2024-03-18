const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BWSErc721 NFT Contract tests", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContract() {
    const name = "BWSERC721";
    const symbol = "BWSNFT";
    const baseURI = "ipfs://";

    let accounts = await ethers.getSigners();
    owner = accounts[0];
    otherAccount = accounts[1];

    const Contract = await ethers.getContractFactory("BWSErc721");
    const contract = await Contract.deploy(name, symbol, baseURI, owner, owner);

    return { owner, otherAccount, contract };
  }

  let owner, otherAccount, contract;

  beforeEach(async function () {
    let fixture = await loadFixture(deployContract);

    owner = fixture.owner;
    otherAccount = fixture.otherAccount;
    contract = fixture.contract;
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      console.log("owner.address:", owner.address);

      expect(await contract.owner()).to.equal(owner.address);
    });
  });

  describe("Minting by owner", function () {
    it("Should mint a new token", async () => {
      const { contract, owner, otherAccount } = await loadFixture(
        deployContract
      );

      const tx = await contract
        .connect(owner)
        .safeMint(otherAccount.address, "https://mytoken/somehash");

      const receipt = await tx.wait();
      let eventFound = false;

      for (let i = 0; i < receipt.logs.length; i++) {
        try {
          const event = contract.interface.parseLog(receipt.logs[i]);
          if (event.name === "emitMint") {
            console.log("event.args[0] :", event.args[0]);
            expect(event.args[0].toString()).to.equal("1"); // assuming that the tokenId is 1
            eventFound = true;
            break;
          }
        } catch (err) {
          // Ignore errors (happens when the log doesn’t belong to the contract)
        }
      }
      // console.log("eventFound ", eventFound);
      expect(eventFound).to.be.true; // If eventFound is false, this will fail the test
      expect(await contract.ownerOf(1)).to.equal(otherAccount.address);
    });
  });

  describe("Role-based minting", function () {
    it("Should allow owner to grant MINTER_ROLE to another address", async function () {
      const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE")); // Adjust this according to how you define your roles
      // console.log("ethersLibrary.utils:", ethersLibrary.utils);

      // Grant MINTER_ROLE to addr1
      await contract.grantRole(MINTER_ROLE, otherAccount.address);

      // Check if addr1 has the MINTER_ROLE
      expect(await contract.hasRole(MINTER_ROLE, otherAccount.address)).to.be
        .true;
    });

    it("Should allow a whitelisted address to mint a new token", async () => {
      // Obtain the MINTER_ROLE from the contract
      const MINTER_ROLE = await contract.MINTER_ROLE();

      // Grant the MINTER_ROLE to the otherAccount
      await contract
        .connect(owner)
        .grantRole(MINTER_ROLE, otherAccount.address);

      // Validate that the role was granted
      expect(
        await contract.hasRole(MINTER_ROLE, otherAccount.address)
      ).to.equal(true);

      // Use otherAccount to mint a new token
      // const tokenId = 2;
      const tokenURI = "https://mytoken/2";
      const tokenId = await contract
        .connect(otherAccount)
        .mintWithTokenURI(otherAccount.address, tokenURI);

      // Validate that the token was minted and belongs to otherAccount
      expect(await contract.ownerOf(1)).to.equal(otherAccount.address);

      // Validate that the token URI is correct
      // expect(await contract.tokenURI(tokenId)).to.equal(tokenURI);
    });

    it("Should revert for non-whitelisted address", async () => {
      // Fetch the MINTER_ROLE from the contract
      const MINTER_ROLE = await contract.MINTER_ROLE();

      // Try to mint a token from an account that doesn't have the minter role.
      // This should fail, so we catch the error and check its message.
      await expect(
        contract
          .connect(otherAccount)
          .mintWithTokenURI(otherAccount.address, "https://mytoken/1")
      ).to.be.revertedWith(
        "AccessControl: account " +
        otherAccount.address.toLowerCase() +
        " is missing role " +
        MINTER_ROLE
      );
    });

    it("Should allow a whitelisted address to transfer a token", async () => {
      // Fetch the MINTER_ROLE from the contract
      const MINTER_ROLE = await contract.MINTER_ROLE();

      // Make sure 'otherAccount' is whitelisted
      await contract
        .connect(owner)
        .grantRole(MINTER_ROLE, otherAccount.address);

      // Mint a token from a whitelisted account
      await contract
        .connect(otherAccount)
        .mintWithTokenURI(otherAccount.address, "https://mytoken/1");

      // Transfer the minted token to another account (here, 'owner')
      await contract
        .connect(otherAccount)
        .transferFrom(otherAccount.address, owner.address, 1);

      // Validate that the token was successfully transferred
      expect(await contract.ownerOf(1)).to.equal(owner.address);
    });

    it("Should allow a whitelisted address to burn a token", async () => {
      // Fetch the MINTER_ROLE from the contract
      const MINTER_ROLE = await contract.MINTER_ROLE();

      // Make sure 'otherAccount' is whitelisted
      await contract
        .connect(owner)
        .grantRole(MINTER_ROLE, otherAccount.address);

      // Mint a token from a whitelisted account
      await contract
        .connect(otherAccount)
        .mintWithTokenURI(otherAccount.address, "https://mytoken/1");

      // Confirm that the token is owned by 'otherAccount'
      expect(await contract.ownerOf(1)).to.equal(otherAccount.address);

      // Burn the token from the whitelisted account
      await contract.connect(otherAccount).burn(1);

      // Validate that querying for the owner should fail
      await expect(contract.ownerOf(1)).to.be.revertedWith(
        "ERC721: invalid token ID"
      );
    });
    //new test cases goes here
  });

  //New test suite goes here
  describe("Minting with Royalties", function () {
    it("Should mint a new token with royalties", async () => {
      // Mint a new token and set a 10% royalty
      await contract
        .connect(owner)
        .mintWithTokenURIAndRoyalty(
          otherAccount.address,
          "https://mytoken/2",
          10
        );

      // Verify the owner of the newly minted token
      expect(await contract.ownerOf(1)).to.equal(otherAccount.address);

      // Fetch and verify the royalty percentage and receiver
      const royaltyPercentage = await contract._royaltyPercentages(1); // Replace with the actual function to get royalty percentage
      const royaltyReceiver = await contract._royaltyReceivers(1); // Replace with the actual function to get royalty receiver
      expect(royaltyPercentage).to.equal(10);
      expect(royaltyReceiver).to.equal(otherAccount.address);
    });
  });
});
