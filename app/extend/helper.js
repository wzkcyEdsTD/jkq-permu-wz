// const XLSX = require("xlsx");

module.exports = {
  /**
   * export excel
   * @param {string} [fileName='file']
   * @param {string} [sheetName='sheet1']
   * @param {*} header
   * @param {*} data
   */
  /*
  async exportXLSX(fileName = "file", sheetName = "sheet1", data) {
    // 生成workbook
    const workbook = XLSX.utils.book_new();
    // 插入表头
    const headerData = [header, ...data];
    // 生成worksheet
    const worksheet = XLSX.utils.json_to_sheet(headerData, {
      skipHeader: true,
    });
    // 组装
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // 返回数据流
    // @ts-ignore
    this.ctx.set("Content-Type", "application/vnd.openxmlformats");
    // @ts-ignore
    this.ctx.set(
      "Content-Disposition",
      "attachment;filename*=UTF-8' '" + encodeURIComponent(fileName) + ".xlsx"
    );
    // @ts-ignore
    this.ctx.body = await XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });
  },
  */
};
