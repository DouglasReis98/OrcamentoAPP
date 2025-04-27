const form = document.querySelector("form");
const nome = document.getElementById("nome");
const qtde = document.getElementById("qtde");
const preco = document.getElementById("preco");
const tbOrcamento = document.getElementById("tbOrcamento");
const total = document.getElementById("total");
const btnBaixar = document.getElementById("baixar");

let arrItens = [];
let editIndex = null;

if (localStorage.getItem("itensOrcamento")) {
  arrItens = JSON.parse(localStorage.getItem("itensOrcamento"));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (nome.value != "" && qtde.value != NaN && preco != NaN) {
    if (editIndex === null) {
      const item = {
        Nome: nome.value,
        Quantidade: qtde.value,
        Preco: (preco.value * qtde.value).toFixed(2),
      };

      arrItens.push(item);

      localStorage.setItem("itensOrcamento", JSON.stringify(arrItens));
    } else {
      arrItens[editIndex] = {
        Nome: nome.value,
        Quantidade: qtde.value,
        Preco: (preco.value * qtde.value).toFixed(2),
      };

      arrItens.splice(editIndex, 1, arrItens[editIndex]);
      localStorage.setItem("itensOrcamento", JSON.stringify(arrItens));
      editIndex = null;
    }
    nome.value = "";
    qtde.value = "";
    preco.value = "";

    exibirOrcamento();
  } else {
    alert("Os dados precisam ser inseridos!");
  }
});

form.addEventListener("reset", () => {
  reset();
});

function exibirOrcamento() {
  const tbody = tbOrcamento.querySelector("tbody");
  tbody.innerHTML = "";
  if (arrItens.length !== 0) {
    arrItens.forEach((e, i) => {
      const tr = document.createElement("tr");
      tbody.appendChild(tr);

      tr.innerHTML = `
        <td>${e.Nome}</td>
        <td>${e.Quantidade}</td>
        <td>R$ ${e.Preco}</td>
        <td><button onClick={editar(${i})}>Editar</button></td>
        <td><button onClick={remover(${i})}>Remover</button></td>
        `;

      total.innerHTML = arrItens
        .reduce((acumulador, num) => acumulador + parseFloat(num.Preco), 0)
        .toFixed(2);
    });
  } else {
    const tr = document.createElement("tr");
    tbody.appendChild(tr);

    tr.innerHTML = `<td colspan=4>Não há itens para exibir!</td>`;
  }
}

const editar = (index) => {
  editIndex = index;
  nome.value = arrItens[index].Nome;
  qtde.value = arrItens[index].Quantidade;
  preco.value = (arrItens[index].Preco / arrItens[index].Quantidade).toFixed(2);
  addItem.value = "Atualizar";
};

const remover = (index) => {
  if (
    confirm("Tem certeza que deseja remover este item do orçamento?") == true
  ) {
    arrItens.splice(index, 1);

    localStorage.setItem("itensOrcamento", JSON.stringify(arrItens));

    exibirOrcamento();
  }
};

const reset = () => {
  editIndex = null;
  addItem.value = "Adicionar";
};

btnBaixar.addEventListener("click", () => {
  console.log(JSON.parse(localStorage.getItem("itensOrcamento")));
});

window.addEventListener("load", exibirOrcamento);
