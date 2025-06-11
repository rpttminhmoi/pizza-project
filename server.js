const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

let currentOrder = null;

app.post('/order', (req, res) => {
  const { pizzaType } = req.body;
  console.log(`🍕 Order received: ${pizzaType}`);
  currentOrder = pizzaType;
  res.sendStatus(200);
});

app.post('/step', (req, res) => {
  const { pizzaType, step } = req.body;
  console.log(`➡️ [${pizzaType}] Step: ${step}`);
  res.sendStatus(200);
});

app.post('/cancel', (req, res) => {
  const { pizzaType } = req.body;
  console.log(`❌ Order cancelled: ${pizzaType}`);
  if (currentOrder === pizzaType) {
    currentOrder = null;
  }
  res.sendStatus(200);
});

app.post('/done', (req, res) => {
  const { pizzaType } = req.body;
  console.log(`✅ ${pizzaType} pizza is done!`);
  if (currentOrder === pizzaType) {
    currentOrder = null;
  }
  res.json({ message: `${pizzaType} pizza completed.` });
});

app.listen(PORT, () => {
  console.log(`🚀 Pizza server is running at http://localhost:${PORT}`);
});
