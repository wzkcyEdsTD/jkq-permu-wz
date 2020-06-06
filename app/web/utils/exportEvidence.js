/*
 * @Author: eds
 * @Date: 2020-06-06 13:43:46
 * @LastEditTime: 2020-06-06 17:11:02
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\web\utils\exportEvidence.js
 */

// import XLSX from "xlsx";
const excelURL = `/public/excel/excel.xlsx`;
/**
 * 读取excel
 * @param {*} url
 * @param {*} callback
 */
const readWorkbookFromRemoteFile = async () => {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest();
    xhr.open("get", `http://${window.location.host}${excelURL}`, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function (e) {
      if (xhr.status == 200) {
        const data = new Uint8Array(xhr.response);
        const workbook = XLSX.read(data, { type: "array" });
        resolve(workbook);
      }
    };
    xhr.send();
  });
};

/**
 * 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
 * @param {*} sheet
 * @param {*} sheetName
 */
const sheet2blob = (sheet, sheetName) => {
  sheet["A1"].s = {
    font: {
      name: "宋体",
      sz: 10,
      color: { rgb: "ffffff" },
      bold: true,
      italic: false,
      underline: false,
      height: 20,
    },
    alignment: {
      horizontal: "center",
      vertical: "center",
    },
    fill: {
      fgColor: { rgb: "C0504D" },
    },
  };
  sheetName = sheetName || "sheet1";
  var workbook = {
    SheetNames: [sheetName],
    Sheets: {},
  };
  workbook.Sheets[sheetName] = sheet;
  // 生成excel的配置项
  var wopts = {
    bookType: "xlsx", // 要生成的文件类型
    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    type: "binary",
  };
  var wbout = XLSX.write(workbook, wopts);
  var blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
  // 字符串转ArrayBuffer
  function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }
  return blob;
};

/**
 * 通用的打开下载对话框方法，没有测试过具体兼容性
 * @param blob 下载地址，也可以是一个blob对象，必选
 * @param saveName 保存文件名，可选
 */
function openDownloadDialog(url, saveName) {
  if (typeof url == "object" && url instanceof Blob) {
    url = URL.createObjectURL(url); // 创建blob地址
  }
  var aLink = document.createElement("a");
  aLink.href = url;
  aLink.download = saveName || ""; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
  var event;
  if (window.MouseEvent) event = new MouseEvent("click");
  else {
    event = document.createEvent("MouseEvents");
    event.initMouseEvent(
      "click",
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    );
  }
  aLink.dispatchEvent(event);
}

/**
 * 处理excel
 * @param {*} company
 * @param {*} land
 * @param {*} land_rent
 */
export const doExportEvidence = async (company, land, land_rent) => {
  const workbook = await readWorkbookFromRemoteFile();
  const { Sheet1 } = workbook.Sheets;
  openDownloadDialog(sheet2blob(Sheet1), "test.xlsx");
};
