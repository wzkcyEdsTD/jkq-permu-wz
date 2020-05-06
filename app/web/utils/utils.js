/**
 * base64 encode
 * @param {*} s
 */
const base64 = (s) => {
  return window.btoa(unescape(encodeURIComponent(s)));
};

/**
 * 表头
 */
const headerHash = {
  address: "企业地址",
  elecd: "企业用电数据（千瓦时）",
  landd: "企业用地数据（平方米）",
  legalphone: "联系方式",
  name: "企业名称",
  scale: "企业规模",
  state: "企业状态",
  street: "所在街道",
  uuid: "统一社会信用代码",
  tax: "实缴税金(万)",
  revenue: "主营业收入(万)",
  industrial: "工业增加值(万)",
  energy: "综合能耗(吨标煤)",
  rde: "研发经费(万)",
  staff: "年平均员工(人)",
};

/**
 * 导出excel
 * @param {*} jsonData
 * @param {*} worksheet
 */
export function tableToExcel(
  jsonData,
  worksheet = `亩均论英雄企业列表_${+new Date()}`
) {
  console.log(jsonData);
  //列标题
  const excelContent = `<tr>${Object.keys(jsonData[0])
    .map((v) => `<td>${headerHash[v] || ``}</td>`)
    .join(``)}</tr>
    ${jsonData
      .map(
        (v) =>
          `<tr>${Object.keys(v)
            .map((d) => `<td>${v[d] || ``}</td>`)
            .join(``)}</tr>`
      )
      .join(``)}`;
  console.log(excelContent);
  //Worksheet名
  let uri = "data:application/vnd.ms-excel;base64,";

  //下载的表格模板数据
  let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
  xmlns:x="urn:schemas-microsoft-com:office:excel" 
  xmlns="http://www.w3.org/TR/REC-html40">
  <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
    <x:Name>${worksheet}</x:Name>
    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
    </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
    </head><body><table>${excelContent}</table></body></html>`;
  //下载模板
  // window.location.href = ;
  let link = document.createElement("a");
  link.href = uri + encodeURIComponent(base64(template));
  //对下载的文件命名
  link.download = `${worksheet}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
