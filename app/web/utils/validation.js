/**
 * 手机号正则匹配
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function checkMobile(rule, value, callback) {
  if (!value) return callback(undefined);
  const MobileEnable = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/.test(
    value
  )
    ? undefined
    : "手机号码格式不正确";
  callback(MobileEnable);
}

export function checkUuid(rule, value, callback) {
  if (!value) return callback(undefined);
  const UuidEnable = /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g.test(value)
    ? undefined
    : "请输入正确格式";
  callback(UuidEnable);
}

export function positiveNumber(rule, value, callback) {
  if (!value) return callback(undefined);
  const UuidEnable = value > 0 ? undefined : "请输入正确数值";
  callback(UuidEnable);
}
