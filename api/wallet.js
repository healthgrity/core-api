const environment = process.env.NODE_ENV || 'testnet';
const express = require('express');
const bodyParser = require('body-parser');
const hdkey = require('hdkey');
const Wallet = require('ethereumjs-wallet');
const bip39 = require('bip39');
const { ethers } = require('ethers'); // Using the ethers.js library to interact with Matic
const { isValidMnemonic, checkWalletHLTGBalance } = require('../utils/walletUtils');
const config = require(`../config/cfg.${environment}`);
const configCommon = require('../config/cfg.common');

const router = express.Router();
router.use(bodyParser.json());

router.post('/fund-wallet', async (req, res) => {
  try {
    const { editorMnemonicPhrase, amount, practitionerAddress } = req.body;
    const gasLimit = 6000000;

    if (!isValidMnemonic(editorMnemonicPhrase)) {
      return res.status(400).json({ error: 'Invalid mnemonic phrase.' });
    }

    const wallet = await ethers.Wallet.fromPhrase(editorMnemonicPhrase);
    const healthcareEditorAddress = wallet.address;
    const provider = new ethers.JsonRpcProvider(config.rpcUrl);
    const signer = new ethers.Wallet(wallet.privateKey, provider);
    const hltgContract = new ethers.Contract(config.hltgContractAddress, configCommon.hltgContractAbi, signer);

    if (amount <= 0 || isNaN(amount)) {
      return res.status(400).json({ error: 'Invalid amount specified.' });
    }

    if (!ethers.isAddress(practitionerAddress)) {
      return res.status(400).json({ error: 'Invalid practitioner address.' });
    }

    const healthcareEditorCurrentBalance = await checkWalletHLTGBalance(hltgContract, healthcareEditorAddress);
    console.log(`Editor's wallet balance before transfer: ${healthcareEditorCurrentBalance} HLTG`);

    if (parseFloat(healthcareEditorCurrentBalance) < parseFloat(amount)) {
      return res.status(400).json({ error: 'Insufficient funds for the transfer.' });
    }

    const practitionerCurrentBalance = await checkWalletHLTGBalance(hltgContract, practitionerAddress);
    console.log(`Practitioner's wallet balance before transfer: ${practitionerCurrentBalance} HLTG`);

    const amountInEther = ethers.parseUnits(amount.toString(), 'ether');

    try {
      const tx = await hltgContract.transfer(practitionerAddress, amountInEther);
      console.log(`https://${environment === 'testnet' && 'mumbai.'}polygonscan.com/tx/${tx.hash}`);
      res.json(tx);
    } catch (transferError) {
      console.error('Error during transfer:', transferError);
      res.status(500).json({ error: 'An error occurred during the transfer.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the transfer.' });
  }
});


router.post('/create-wallet', async (req, res) => {
  try {
    const wallet = ethers.Wallet.createRandom();

    const address = wallet.address;
    const privateKey = wallet.privateKey;
    const mnemonic = wallet.mnemonic;

    console.log('Address:', address);

    const responseObj = {
      address: address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic
    };
    res.json(responseObj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the wallet.' });
  }
});


router.post('/get-wallet-info', async (req, res) => {
  try {
    const { mnemonicPhrase } = req.body;

    if (!isValidMnemonic(mnemonicPhrase)) {
      return res.status(400).json({ error: 'Invalid mnemonic phrase' });
    }
    const wallet = await ethers.Wallet.fromPhrase(mnemonicPhrase);
    const address = wallet.address;
    const privateKey = wallet.privateKey;

    const responseObj = {
      address: address,
      privateKey: wallet.privateKey,
      mnemonicPhrase: wallet.mnemonic
    };
    res.json(responseObj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.post('/check-wallet-balance', async (req, res) => {
  try {
    const { mnemonicPhrase } = req.body;

    if (!isValidMnemonic(mnemonicPhrase)) {
      return res.status(400).json({ error: 'Invalid mnemonic phrase' });
    }

    const wallet = await ethers.Wallet.fromPhrase(mnemonicPhrase);
    const address = wallet.address;

    const provider = new ethers.JsonRpcProvider(config.rpcUrl);
    const signer = new ethers.Wallet(wallet.privateKey, provider);

    const hltgContract = new ethers.Contract(config.hltgContractAddress, configCommon.hltgContractAbi, signer);

    const balance = await checkWalletHLTGBalance(hltgContract, address);
    res.json({ "HLTG": balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while checking the wallet balance.' });
  }
});

module.exports = router;
