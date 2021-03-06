/*
 * @Author: eds
 * @Date: 2020-04-23 11:27:48
 * @LastEditTime: 2020-06-06 13:43:32
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\web\utils\utils.js
 */
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
  landd: "企业用地数据（亩）",
  tax: "实缴税金(万)",
  revenue: "主营业收入(万)",
  industrial: "工业增加值(万)",
  energy: "综合能耗(吨标煤)",
  rde: "研发经费(万)",
  staff: "年平均员工(人)",
  sewage: "排污量(吨)",
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
  const str = `${Object.keys(headerHash)
    .map(v => headerHash[v] || "")
    .join(`,`)}
    ${jsonData
      .map(
        v =>
          `${Object.keys(headerHash)
            .map(
              d =>
                `${v[d] || ""}${~["uuid", "legalphone"].indexOf(d) ? "\t" : ""}`
            )
            .join(`,`)}`
      )
      .join(`\n`)}`;
  var link = document.createElement("a");
  var csvContent = "data:text/csv;charset=utf-8,\uFEFF" + str;
  var encodedUri = csvContent;
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${worksheet}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
