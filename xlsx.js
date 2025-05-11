const btnBaixar = document.getElementById("baixar");
btnBaixar.addEventListener("click", () => {
  const arrItens = JSON.parse(localStorage.getItem("itensOrcamento")).map(
    (i) => ({
      ...i,
      Preco: parseFloat(i.Preco),
    })
  );

  const planilha = XLSX.utils.json_to_sheet(arrItens);

  const totalLinhas = arrItens.length + 2;

  for (let i = 0; i < arrItens.length; i++) {
    const cell = `C${i + 2}`;
    if (planilha[cell]) {
      planilha[cell].t = "n";
      planilha[cell].z = "R$ #,##0.00";
    }
  }

  planilha[`A${totalLinhas}`] = { v: "TOTAL" };

  planilha[`C${totalLinhas}`] = {
    f: `SUM(C2:C${arrItens.length + 1})`,
    t: "n",
    z: "R$ #,##0.00",
  };

  const novaRef = `A1:C${totalLinhas}`;
  planilha["!ref"] = novaRef;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, planilha, "Orçamento");

  XLSX.writeFile(workbook, "dados.xlsx", { compression: true });
});
