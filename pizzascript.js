let currentPizza = null;
let timers = [];

function startProcess(pizzaId) {
  if (currentPizza && currentPizza !== pizzaId) {
    if (!confirm(`Bạn đang làm ${currentPizza}. Hủy để chuyển sang ${pizzaId}?`)) return;
    cancelCurrentOrder(() => beginPizzaFlow(pizzaId));
    return;
  }
  if (!currentPizza) beginPizzaFlow(pizzaId);
}

function beginPizzaFlow(pizzaId) {
  clearAllTimers();
  resetAllPizzas();

  currentPizza = pizzaId;
  const pizzaEl = document.getElementById(pizzaId);
  pizzaEl.style.display = 'block';
  pizzaEl.querySelector('.cancelBtn').disabled = false;

  fetch('http://localhost:3000/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pizzaType: pizzaId })
  }).catch(console.error);

  const steps = pizzaEl.querySelectorAll('.step');
  steps.forEach((stepEl, idx) => {
    const t = setTimeout(() => {
      stepEl.classList.add('visible');
      fetch('http://localhost:3000/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pizzaType: pizzaId,
          step: stepEl.textContent.trim()
        })
      }).catch(console.error);

      if (idx === steps.length - 1) {
        const doneT = setTimeout(() => {
          fetch('http://localhost:3000/done', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pizzaType: pizzaId })
          }).catch(console.error)
            .finally(() => finishFlow());
        }, 1000);
        timers.push(doneT);
      }
    }, idx * 500);
    timers.push(t);
  });
}

function cancelCurrentOrder(callback) {
  if (!currentPizza) {
    if (callback) callback();
    return;
  }
  fetch('http://localhost:3000/cancel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pizzaType: currentPizza })
  }).catch(console.error)
    .finally(() => {
      finishFlow();
      if (callback) callback();
    });
}

function finishFlow() {
  clearAllTimers();
  resetAllPizzas();
  currentPizza = null;
}

function resetAllPizzas() {
  document.querySelectorAll('.pizza').forEach(p => {
    p.style.display = 'none';
    p.querySelectorAll('.step').forEach(s => s.classList.remove('visible'));
    const cancelBtn = p.querySelector('.cancelBtn');
    if (cancelBtn) cancelBtn.disabled = true;
  });
}

function clearAllTimers() {
  timers.forEach(id => clearTimeout(id));
  timers = [];
}
