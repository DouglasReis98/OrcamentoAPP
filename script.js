const form = document.querySelector("form");
const item = document.getElementById("item");
const qtde = document.getElementById("qtde");
const preco = document.getElementById("preco");
const tbOrcamento = document.getElementById("tbOrcamento");
const total = document.getElementById("total");
const btnBaixar = document.getElementById("baixar");
const addItem = document.getElementById("addItem")
let arrItens = [];
let editIndex = null;

if (localStorage.getItem("itensOrcamento")) {
  arrItens = JSON.parse(localStorage.getItem("itensOrcamento"));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (item.value != "" && qtde.value != NaN && preco != NaN) {
    if (editIndex === null) {
      const objItem = {
        Item: item.value,
        Quantidade: qtde.value,
        Preco: (preco.value * qtde.value).toFixed(2),
      };

      arrItens.push(objItem);

      localStorage.setItem("itensOrcamento", JSON.stringify(arrItens));

    } else {
      arrItens[editIndex] = {
        Item: item.value,
        Quantidade: qtde.value,
        Preco: (preco.value * qtde.value).toFixed(2),
      };

      arrItens.splice(editIndex, 1, arrItens[editIndex]);
      localStorage.setItem("itensOrcamento", JSON.stringify(arrItens));
      editIndex = null;
      form.removeChild(form.children[0])
      addItem.value = "Adicionar";
    }
    item.value = "";
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
        <td>${e.Item}</td>
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
    total.innerHTML = "0.00"

  }
}

const editar = (index) => {
  editIndex = index;
  item.value = arrItens[index].Item;
  qtde.value = arrItens[index].Quantidade;
  preco.value = (arrItens[index].Preco / arrItens[index].Quantidade).toFixed(2);
  addItem.value = "Atualizar";

  showEditProjeto(index)
  console.log("Editando Item: " + arrItens[index].Item)
};

const showEditProjeto = (index) => {
  const h3 = document.createElement("h3")
  const h3EditItem = document.createTextNode("Editando Item: " + arrItens[index].Item)

  const editItem = document.getElementById("editItem")
  if(editItem){
    form.removeChild(editItem)
  }

  h3.appendChild(h3EditItem)
  form.insertBefore(h3, form.children[0]).id = "editItem"
}


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
  const editItem = document.getElementById("editItem")
  if(editItem){
    form.removeChild(editItem)
  }
  editIndex = null;
  addItem.value = "Adicionar";
};

btnBaixar.addEventListener("click", () => {
  console.log(JSON.parse(localStorage.getItem("itensOrcamento")));
  console.log("Total: R$ " + arrItens.reduce((acumulador, num) => acumulador + parseFloat(num.Preco), 0).toFixed(2))
});

window.addEventListener("load", exibirOrcamento);
