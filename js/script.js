const extrasDiv = document.getElementById("extras");
let extras = [];
let chart;

function addExtra() {
  const id = "extra" + extras.length;
  extras.push(id);

  const input = document.createElement("input");
  input.type = "number";
  input.placeholder = "Outra despesa";
  input.id = id;

  input.addEventListener("input", calcular);

  extrasDiv.appendChild(input);
}

function get(id) {
  return Number(document.getElementById(id)?.value) || 0;
}

document.addEventListener("input", calcular);

function calcular() {
  const fixas = {
    Aluguel: get("aluguel"),
    Condomínio: get("condominio"),
    Internet: get("internet"),
    Luz: get("luz"),
  };

  const cartoes = {
    Nubank: get("nubank"),
    Magalu: get("magalu"),
  };

  const extrasObj = {};
  extras.forEach((id, i) => {
    extrasObj["Extra " + (i + 1)] = get(id);
  });

  const despesasObj = { ...fixas, ...cartoes, ...extrasObj };

  const totalDespesas = Object.values(despesasObj).reduce((a, b) => a + b, 0);

  const salario = get("salario");
  const vale = get("vale");

  const saldo = salario - totalDespesas;

  document.getElementById("despesas").innerText = "R$ " + totalDespesas.toFixed(2);
  document.getElementById("receitas").innerText = "R$ " + salario.toFixed(2);
  document.getElementById("valeInfo").innerText = "R$ " + vale.toFixed(2);

  const saldoEl = document.getElementById("saldo");
  saldoEl.innerText = "R$ " + saldo.toFixed(2);
  saldoEl.style.color = saldo >= 0 ? "#22c55e" : "#ef4444";

  atualizarGrafico(despesasObj);
}

function atualizarGrafico(despesasObj) {
  const ctx = document.getElementById("grafico");

  if (chart) chart.destroy();

  const labels = Object.keys(despesasObj);
  const valores = Object.values(despesasObj);

  const temDados = valores.some(v => v > 0);

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: temDados ? labels : ["Sem dados"],
      datasets: [{
        data: temDados ? valores : [1],
        backgroundColor: [
          "#684066",
          "#9021f8",
          "#f755c1",
          "#140530",
          "#771285",
          "#c8b5e4",
          "#2e273b"
        ]
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: { color: "white" }
        }
      }
    }
  });
}