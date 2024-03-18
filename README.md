## BWS Smart Contracts

This repository contains Solidity smart contracts: ERC721. These contracts are used in the BWS SDK, a powerful blockchain infrastructure provider. BWS offers a range of services to simplify blockchain development and integration, making it easier for developers to build decentralized applications.

### Contracts

The following contracts are included in this repository:

- **Erc721.sol**: An implementation of the ERC721 token standard. This contract enables the creation and management of unique, non-fungible tokens (NFTs) on the Ethereum blockchain. It is based on the OpenZeppelin library version 4.8.3.

### Usage

To use these contracts in your project, you can either copy the source code directly or import the compiled bytecode and ABI files.

#### Solidity Source Code

The Solidity source code for each contract can be found in the `contracts` folder of this repository. You can simply copy the desired contract's source code and include it in your project.

#### Bytecode and ABI

If you prefer to use the compiled bytecode and ABI files, you can find them in the `bytecode` and `abi` folders respectively. These files can be used for contract deployment and interaction. Make sure to include the appropriate bytecode and ABI for the contract you want to use in your project.

### Verification on Etherscan

If you want to verify the contracts on Etherscan, you can find the Solidity source code in the `sources-for-verification` folder. This source code can be used for contract verification to ensure transparency and trustworthiness.

During verification on Etherscan, please ensure that the optimization is enabled and set to **200 runs** to match the compiler settings.

### Compiler Version

The contracts in this repository were compiled using the **Solidity compiler version 0.8.19+commit.7dd6d404**.

### Additional Resources

For more information on using these contracts and integrating with the BWS SDK, you can refer to the [BWS SDK GitHub Repository](https://github.com/BWSio/BWS-js).

For more information about BWS and its blockchain infrastructure services, visit the [BWS Website](https://www.bws.ninja).

Please note that this repository and the contracts contained within it are provided by BWS, and any inquiries or support requests should be directed to the BWS team.

### BWSErc721 Smart Contract Documentation

# 1. Constructor

The constructor is a special function that is only executed once when the contract is deployed. In this contract, it is setting up the basic properties of the ERC721 token (like its name and symbol), as well as assigning the admin and minter roles.

Parameters:

name: The name of the token.
symbol: The symbol of the token.
baseURI: The base URI for the token metadata.
admin: The address of the initial admin.
minter: The address of the initial minter.

# 2. \_baseURI()

This is an internal function that overrides the \_baseURI function from the ERC721 standard, and it returns the base URI set during contract deployment.

No Parameters.

# 3. mintWithTokenURI()

This function allows a minter to mint a new token and assign a specific URI to it.

Parameters:

to: The address that will receive the minted token.
tokenId: The ID for the new token.
uri: The token-specific URI for the new token.

# 4. safeMint()

This function safely mints a new token, similar to mintWithTokenURI, but with additional safety checks as defined by the ERC721 standard.

Parameters:

to: The address that will receive the minted token.
tokenId: The ID for the new token.
uri: The token-specific URI for the new token.

# 5. mintMultiple()

This function allows a minter to mint multiple new tokens at once.

Parameters:

to: An array of addresses that will receive the minted tokens.
tokenId: An array of IDs for the new tokens.
uri: An array of token-specific URIs for the new tokens.

# 6. safeMintBatch()

This function safely mints multiple new tokens, similar to mintMultiple, but with additional safety checks as defined by the ERC721 standard.

Parameters:

to: An array of addresses that will receive the minted tokens.
tokenId: An array of IDs for the new tokens.
uri: An array of token-specific URIs for the new tokens.

# 7. \_burn()

This function burns (destroys) a specific token. It overrides the \_burn function from the ERC721 standard to also delete the token-specific URI when the token is burned.

Parameter:

tokenId: The ID of the token to be burned.

# 8. tokenURI()

This function returns the URI of a specific token. It overrides the tokenURI function from the ERC721 standard to construct and return the full URI for a token.

Parameter:

tokenId: The ID of the token to get the URI of.

# 9. supportsInterface()

This function checks if the contract supports a specific interface (set of functions). It overrides the supportsInterface function from the ERC721 standard to add support for the AccessControl interface.

Parameter:

interfaceId: The ID of the interface to check.

# 10. grantRole()

This function allows an account with a certain role (default is the admin role) to grant a role to another account. This is a function from the AccessControl contract.

Parameters:

role: The role to grant. This is a hashed value. For example, the MINTER_ROLE is hashed value of the string "MINTER_ROLE".
account: The address to grant the role to.

# 11. transferFrom()

This function allows an approved address to transfer a token from one address to another. This is a standard function from the ERC721 contract.

Parameters:

from: The address to transfer the token from.
to: The address to transfer the token to.
tokenId: The ID of the token to transfer.
