const environment = process.env.NODE_ENV || 'testnet';
const express = require('express');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');
const { isValidMnemonic, checkWalletHLTGBalance, getCurrentGasPrices } = require('../utils/walletUtils');
const config = require(`../config/cfg.${environment}`);
const configCommon = require('../config/cfg.common');

const router = express.Router();
router.use(bodyParser.json());

router.post('/store-medical-data', async (req, res) => {
  const { id, data, practitionerMnemonicPhrase } = req.body;
  const currentGasPrices = await getCurrentGasPrices();

  const HEALTHGRITY_PRICING_AMOUNT = ethers.parseUnits('1000000000000000000', 'wei'); // 1 HLTG / API Call
  const HLTG_MAX_ALLOWANCE = ethers.parseUnits('10000000000000000000', 'wei'); // 10 HLTG Approved

  if (!isValidMnemonic(practitionerMnemonicPhrase)) {
    return res.status(400).json({ error: 'Invalid mnemonic phrase' });
  }

  const practitionerWallet = await ethers.Wallet.fromPhrase(practitionerMnemonicPhrase);
  const practitionerAddress = practitionerWallet.address;
  const provider = new ethers.JsonRpcProvider(config.rpcUrl);
  const signer = new ethers.Wallet(practitionerWallet.privateKey, provider);
  const hltgContract = new ethers.Contract(config.hltgContractAddress, configCommon.hltgContractAbi, signer);
  const repositoryContract = new ethers.Contract(config.healthgrityRepositoryContractAddress, configCommon.healthgrityRepositoryContractAbi, signer);
  const pricingV1Contract = new ethers.Contract(config.healthgrityPricingV1ContractAddress, configCommon.healthgrityPricingV1ContractAbi, signer);

  try {
    const practitionerEditorCurrentBalance = await checkWalletHLTGBalance(hltgContract, practitionerAddress);
    console.log(`Practitioner's wallet balance before medical data storage: ${practitionerEditorCurrentBalance} HLTG`);
    const nonce = await provider.getTransactionCount(practitionerAddress);

    if (practitionerEditorCurrentBalance < HEALTHGRITY_PRICING_AMOUNT) {
      return res.status(400).json({ error: 'Insufficient HLTG balance to use Healthgrity medical data storage service' });
    }

    console.log(currentGasPrices);

    const approveTx = await hltgContract.approve(config.healthgrityPricingV1ContractAddress, HLTG_MAX_ALLOWANCE, { gasPrice: currentGasPrices.FastGasPrice });
    const pricingV1Tx = await pricingV1Contract.splitAndBurn(HEALTHGRITY_PRICING_AMOUNT, { gasPrice: currentGasPrices.FastGasPrice });
    const repositoryTx = await repositoryContract.storeMedicalData(id, data, { gasPrice: currentGasPrices.FastGasPrice });

    res.json({
      approveTxUrl: `https://${environment === 'testnet' ? 'mumbai.' : ''}polygonscan.com/tx/${approveTx.hash}`,
      pricingV1TxUrl: `https://${environment === 'testnet' ? 'mumbai.' : ''}polygonscan.com/tx/${pricingV1Tx.hash}`,
      repositoryTxUrl: `https://${environment === 'testnet' ? 'mumbai.' : ''}polygonscan.com/tx/${repositoryTx.hash}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred when adding medical data.');
  }
});


module.exports = router;
