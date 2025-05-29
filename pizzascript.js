let currentPizza = null; // lưu pizza đang xử lý

function startProcess(pizzaId) {
  // Nếu đang làm pizza khác, báo server hủy
  if (currentPizza && currentPizza !== pizzaId) {
    fetch('http://localhost:3000/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pizzaType: currentPizza })
    });
  }

  currentPizza = pizzaId; // cập nhật pizza hiện tại

  // Ẩn tất cả
  document.querySelectorAll('.pizza').forEach(p => {
    p.style.display = 'none';
    p.querySelectorAll('.step').forEach(s => s.classList.remove('visible'));
  });

  const pizza = document.getElementById(pizzaId);
  pizza.style.display = 'block';
  const steps = pizza.querySelectorAll('.step');

  // Gửi lên server: khách đã chọn pizza mới
  fetch('http://localhost:3000/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pizzaType: pizzaId })
  });

  steps.forEach((step, index) => {
    setTimeout(() => {
      step.classList.add('visible');

      // Gửi tiến trình từng bước
      fetch('http://localhost:3000/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pizzaType: pizzaId,
          step: step.innerText.trim()
        })
      });

      if (index === steps.length - 1) {
        setTimeout(() => {
          fetch('http://localhost:3000/done', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pizzaType: pizzaId })
          });
        }, 1000);
      }

    }, 2000 * index);
  });
}
