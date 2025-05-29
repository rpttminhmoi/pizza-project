function startProcess(pizzaId) {
  document.querySelectorAll('.pizza').forEach(p => {
    p.style.display = 'none';
    p.querySelectorAll('.step').forEach(s => s.classList.remove('visible'));
  });

  const pizza = document.getElementById(pizzaId);
  pizza.style.display = 'block';
  const steps = pizza.querySelectorAll('.step');


  fetch('http://localhost:3000/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pizzaType: pizzaId })
  });

  steps.forEach((step, index) => {
    setTimeout(() => {
      step.classList.add('visible');

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
