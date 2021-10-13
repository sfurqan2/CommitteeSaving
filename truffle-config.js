const HDWalletProvider = require("truffle-hdwallet-provider");
// const LoomTruffleProvider = require('loom-truffle-provider');

// const { readFileSync } = require('fs')
// const path = require('path')
// const { join } = require('path');

// Set your own mnemonic here
const mnemonic = "pitch term mad manual torch popular reveal grit february sea current mixture";

// function getLoomProviderWithPrivateKey (privateKeyPath, chainId, writeUrl, readUrl) {
//   const privateKey = readFileSync(privateKeyPath, 'utf-8');
//   return new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey);
// }

// Module exports to make this configuration available to Truffle itself
module.exports = {
  // Object with configuration for each network
  networks: {
    development: {
        host: "127.0.0.1",
        port: 7545,
        network_id: "*",
        gas: 6500000
    },

    // Configuration for mainnet
    mainnet: {
      provider: function () {
        // Setting the provider with the Infura Mainnet address and Token
        return new HDWalletProvider(
          mnemonic,
          "https://mainnet.infura.io/v3/YOUR_TOKEN"
        );
      },
      network_id: "1",
    },
    // Configuration for rinkeby network
    rinkeby: {
      // Special function to setup the provider
      provider: function () {
        // Setting the provider with the Infura Rinkeby address and Token
        return new HDWalletProvider(
          mnemonic,
          "https://rinkeby.infura.io/v3/3842168f5d5041a3a504336758362583"
        );
      },
      networkCheckTimeout: 10000,
      network_id: 4,
    },
    loom_testnet: {
      provider: function() {
        const privateKey = 'gZVPwmJgl+L2WGJKgLFgoHCEFWwQ0Bu5VQSBocaoZBJ1A376fONgU74iaX3r/dXc9vAU2cl5vIrUoq6yKLC3MQ=='
        const chainId = 'extdev-plasma-us1';
        const writeUrl = 'http://extdev-plasma-us1.dappchains.com:80/rpc';
        const readUrl = 'http://extdev-plasma-us1.dappchains.com:80/query';
        return new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey);
        },
      network_id: '9545242630824'
    },
    basechain: {
      provider: function() {
        const chainId = 'default';
        const writeUrl = 'http://basechain.dappchains.com/rpc';
        const readUrl = 'http://basechain.dappchains.com/query';
        //return new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey);
        const privateKeyPath = path.join(__dirname, 'mainnet_private_key');
        const loomTruffleProvider = getLoomProviderWithPrivateKey(privateKeyPath, chainId, writeUrl, readUrl);
        return loomTruffleProvider;
        },
      network_id: '*'
    }
  },
  compilers: {
    solc: {
      version: "0.8.9",
    },
  },
};
