const express = require('express');
const bodyParser = require('body-parser');
const Web3 = require('web3');
const web3 = new Web3('https://endpoints.omniatech.io/v1/matic/mumbai/public')

const app = express();
app.use(bodyParser.json());

// Nouvelle instance du smart contract
const contractAddress = ["0xCc54F2c2B3B3F2a9fa19bc26E8dD666b7A8db0B2"];
const contractAbi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_data",
				"type": "string"
			}
		],
		"name": "addExamReport",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getExamReport",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "data",
						"type": "string"
					}
				],
				"internalType": "struct Healthgrity.ExamReport",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getExamReports",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "data",
						"type": "string"
					}
				],
				"internalType": "struct Healthgrity.ExamReport[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const contract = new web3.eth.Contract(contractAbi, contractAddress[0]);


// API endpoints 
app.post('/secure-exam-report', async (req, res) => {
  const { id, data } = req.body;
  console.log(`The exam report with id: ${id} will be secured...`)

  const accounts = await web3.eth.getAccounts();
  console.log(accounts)

  const result = await contract.methods.addExamReport(id, data).send({
  	from: "0x5431EDE2499aB04107c69d2aee0e27E416b20f5d",
	to: "0xCc54F2c2B3B3F2a9fa19bc26E8dD666b7A8db0B2"
  });
console.log(result);
  
  res.status(200).send('Exam report secured with success!');
});

app.listen(3001, () => {
  console.log('Healthgrity API server started with success on port 3001');
});