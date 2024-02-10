const express = require('express');
const medicalDataRoutes = require('./api/medical-data');
const walletRoutes = require("./api/wallet");
const PORT = 4001;

const app = express();

app.use('/api/v1', medicalDataRoutes);
app.use('/api/v1', walletRoutes);

app.listen(PORT, () => {
    console.log(`The Healthgrity API server listens on port ${PORT}`);
});
