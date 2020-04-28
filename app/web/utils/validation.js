/**
 * 手机号正则匹配
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function checkMobile(rule, value, callback) {
  if (!value) return callback(undefined);
  let MobileEnable = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/.test(
    value
  )
    ? undefined
    : "手机号码格式不正确";
  callback(MobileEnable);
}
