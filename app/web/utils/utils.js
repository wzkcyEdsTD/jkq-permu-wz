/*
 * @Author: eds
 * @Date: 2020-04-23 11:27:48
 * @LastEditTime: 2020-06-02 16:39:24
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\web\utils\utils.js
 */

/**
 * base64 encode
 * @param {*} s
 */
const base64 = s => {
  return window.btoa(unescape(encodeURIComponent(s)));
};

//  表头
const headerHash = {
  id: "序号",
  pch: "年份",
  name: "企业名称",
  uuid: "统一社会信用代码",
  street: "所在街道",
  link: "联系人",
  linkphone: "联系人号码",
  legal: "法人",
  legalphone: "法人号码",
  scale: "企业规模",
  address: "企业地址",
  state: "企业状态",
  elecd: "企业用电数据（千瓦时）",
  landd: "企业用地数据（平方米）",
  tax: "实缴税金(万)",
  revenue: "主营业收入(万)",
  industrial: "工业增加值(万)",
  energy: "综合能耗(吨标煤)",
  rde: "研发经费(万)",
  staff: "年平均员工(人)",
  sewage: "排污量(吨)",
  isconfirm: "指标全部确认",
  createdAt: "数据创建时间",
  updatedAt: "数据更新事件",
};

//  表头排序
const headerFixed = [];
/**
 * 导出excel
 * @param {*} jsonData
 * @param {*} worksheet
 */
export function tableToExcel(
  jsonData,
  worksheet = `亩均论英雄企业列表_${+new Date()}`
) {
  const excelContent = `<tr>${Object.keys(headerHash)
    .map(v => `<td>${headerHash[v] || ``}</td>`)
    .join(``)}</tr>
    ${jsonData
      .map(
        v =>
          `<tr>${Object.keys(headerHash)
            .map(d => `<td style="mso-number-format:'\@';">${v[d] || ``}</td>`)
            .join(``)}</tr>`
      )
      .join(``)}`;
  const uri = "data:application/vnd.ms-excel;base64,";
  const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
  xmlns:x="urn:schemas-microsoft-com:office:excel" 
  xmlns="http://www.w3.org/TR/REC-html40">
  <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
    <x:Name>${worksheet}</x:Name>
    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
    </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
    </head><body><table>${excelContent}</table></body></html>`;
  //下载模板
  // window.location.href = ;
  const link = document.createElement("a");
  link.href = uri + encodeURIComponent(base64(template));
  //对下载的文件命名
  link.download = `${worksheet}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
