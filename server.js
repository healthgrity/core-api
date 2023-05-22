require('dotenv').config();
const express = require('express');
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const bodyParser = require('body-parser');
const config = require('./abi.js');

const { API_URL, PRIVATE_KEY, TO_ADDRESS, FROM_ADDRESS, CONTRACT_ADDRESS, PORT } = process.env;

const app = express();
app.use(bodyParser.json());

const web3 = createAlchemyWeb3(API_URL);
const contract = new web3.eth.Contract(config.contractAbi, CONTRACT_ADDRESS);

// API Endpoints
// Route pour ajouter un rapport d'examen
app.post('/secure-exam-report', async (req, res) => {
  const { id, data } = req.body;

  try {
    const nonce = await web3.eth.getTransactionCount(FROM_ADDRESS, 'latest');
    const transaction = {
      to: CONTRACT_ADDRESS,
      gas: 300000,
      gasPrice: web3.utils.toWei('10', 'gwei'),
      nonce,
      data: contract.methods.addExamReport(id, data).encodeABI()
    };

    const signedTx = await web3.eth.accounts.signTransaction(transaction, PRIVATE_KEY);

    web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        .on('transactionHash', (hash) => {
          res.send(`La transaction a été soumise. Hash de la transaction : ${hash}`);
        })
        .on('error', (error) => {
          console.error(error);
          res.status(500).send('Une erreur est survenue lors de la soumission de la transaction.');
        });
  } catch (error) {
    console.error(error);
    res.status(500).send('Une erreur est survenue lors de la construction de la transaction.');
  }
});

// Route pour obtenir un rapport d'examen par son ID
app.get('/get-secured-exam-reports/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await contract.methods.getExamReport(id).call();

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Une erreur est survenue lors de la récupération du rapport d\'examen.');
  }
});

// Route pour obtenir tous les rapports d'examen
app.get('/get-secured-exam-reports', async (req, res) => {
  try {
    const result = await contract.methods.getExamReports().call();

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Une erreur est survenue lors de la récupération des rapports d\'examen.');
  }
});

// Démarrage du serveur
app.listen(3001, () => {
  console.log(`Le serveur Healthgrity API écoute sur le port ${PORT}`);
});