const btnBaixar = document.getElementById("baixar");

btnBaixar.addEventListener("click", () => {

  // Converte o stringfy do localStorage para JSON
  const arrItens = JSON.parse(localStorage.getItem("itensOrcamento")).map(
    (i) => ({
      ...i,
      Preco: parseFloat(i.Preco),
    })
  );

  // Converte o JSON para planilha
  const planilha = XLSX.utils.json_to_sheet(arrItens);

  // Posiciona o TOTAL no final dos itens
  const totalLinhas = arrItens.length + 2;

  // Determina o tamanho das células horizontais
  planilha['!cols'] = [
        { wch: 20 }, // Produto
        { wch: 25 }, // Quantidade
        { wch: 15 }  // Preço
      ];


  // Converte o valor dos Preços para a moeda brasileira BRL(R$)
  for (let i = 0; i < arrItens.length; i++) {
    const cell = `C${i + 2}`;
    if (planilha[cell]) {
      planilha[cell].t = "n";
      planilha[cell].z = "R$ #,##0.00";
    }
  }

  // Cria a linha do TOTAL na coluna A no final dos itens
  planilha[`A${totalLinhas}`] = { v: "TOTAL" };

  
  planilha[`C${totalLinhas}`] = {
    f: `SUM(C2:C${arrItens.length + 1})`, // Soma os Preços dos Itens
    t: "n",                               // Determina o tipo como "número"
    z: "R$ #,##0.00",                     // Formata o total como moeda brasileira BRL(R$)
  };



  // Atualiza o range (!ref) da planilha
  const novaRef = `A1:C${totalLinhas}`;
  planilha["!ref"] = novaRef;

  // Cria uma nova pasta de trabalho (workbook)
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, planilha, "Orçamento");
  
  // Gera e baixa o arquivo do Excel (xlsx)
  XLSX.writeFile(workbook, "dados.xlsx", { compression: true });
});
