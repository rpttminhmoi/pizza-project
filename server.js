const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Khi khách chọn pizza
app.post('/order', (req, res) => {
  const { pizzaType } = req.body;
  console.log(`🍕 [ORDER] Khách đã chọn: ${pizzaType}`);
  res.json({ message: `Đã nhận đơn: ${pizzaType}` });
});

// Khi hoàn thành 1 bước
app.post('/step', (req, res) => {
  const { pizzaType, step } = req.body;
  console.log(`✅ [${pizzaType}] Hoàn thành bước: ${step}`);
  res.json({ message: `Đã nhận bước: ${step}` });
});

// Khi pizza hoàn tất
app.post('/done', (req, res) => {
  const { pizzaType } = req.body;
  console.log(`🎉 [${pizzaType}] Đã hoàn thành toàn bộ!`);
  res.json({ message: `Pizza ${pizzaType} đã hoàn tất!` });
});

app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
