const bip39 = require('bip39');
const { ethers } = require('ethers');
const fetch = require('node-fetch');
const apiKeyToken = process.env.POLYGONSCAN_API_KEY;

function isValidMnemonic(mnemonic) {
  return bip39.validateMnemonic(mnemonic);
}

async function checkWalletMATICBalance(provider, address) {
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

async function checkWalletHLTGBalance(hltgContract, address) {
  try {
    const balance = await hltgContract.balanceOf(address);
    const decimals = await hltgContract.decimals();
    const balanceInEther = ethers.formatUnits(balance, decimals);
    return balanceInEther.toString();
  } catch (error) {
    console.error('Error checking HLTG wallet balance:', error);
    throw error;
  }
}

async function getCurrentGasPrices() {
  const apiUrl = `https://api.polygonscan.com/api?module=gastracker&action=gasoracle&apikey=${apiKeyToken}`;
  const response = await fetch(apiUrl);
  const gasInfo = await response.json();

  if (gasInfo.status === '1' && gasInfo.message === 'OK') {
    const { ProposeGasPrice, FastGasPrice, SafeGasPrice } = gasInfo.result;

    return {
      ProposeGasPrice: ethers.parseUnits(ProposeGasPrice, 'gwei'),
      FastGasPrice: ethers.parseUnits(FastGasPrice, 'gwei'),
      SafeGasPrice: ethers.parseUnits(SafeGasPrice, 'gwei')
    };
  } else {
    console.error('Erreur lors de la récupération des frais de gaz sur PolygonScan');
    return {
      ProposeGasPrice: ethers.parseUnits('1000000000', 'wei'),
      FastGasPrice: ethers.parseUnits('1000000000', 'wei'),
      SafeGasPrice: ethers.parseUnits('1000000000', 'wei')
    };
  }
}

module.exports = {
  isValidMnemonic,
  checkWalletMATICBalance,
  checkWalletHLTGBalance,
  getCurrentGasPrices
};
