const express = require('express');
const bodyParser = require('body-parser');
const Web3 = require('web3');
const config = require('./config');

const app = express();
app.use(bodyParser.json());

// Nouvelle instance du smart contract
const web3 = new Web3(config.rpcUrl);
const contract = new web3.eth.Contract(config.contractAbi, config.contractAddress);

// API endpoints
app.post('/secure-exam-report', async (req, res) => {
  const { id, data } = req.body;
  console.log(`The exam report with id: ${id} will be secured...`);

  const accounts = await web3.eth.getAccounts();
  console.log(accounts);

  const result = await contract.methods.addExamReport(id, data).send({
    from: config.fromAddress,
    to: config.toAddress
  });
  console.log(result);

  res.status(200).send('Exam report secured successfully!');
});

app.listen(config.port, () => {
  console.log(`Healthgrity API server started successfully on port ${config.port}`);
});
