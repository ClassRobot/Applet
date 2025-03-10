import Crypto from '@/utils/oss-upload/common/crypto/crypto.js.js';
import '@/utils/oss-upload/common/crypto/hmac.js';
import '@/utils/oss-upload/common/crypto/sha1.js';
import { Base64 } from '@/utils/oss-upload/common/crypto/base64.js';
import ossConfig from '@/config.js'

let date = new Date()
date = date.setHours(date.getHours() + 1)
let extime = "" + new Date(date).toISOString()
let policyText = {
  "expiration": extime,
  "conditions": [
    ["content-length-range", 0, 1024 * 1024 * 100] // 设置上传文件的大小限制 
  ]
};
let config = {
  accessid: ossConfig.aliOss.config.accessKeyId,
  accesskey: ossConfig.aliOss.config.accessKeySecret,
  osshost: ossConfig.aliOss.url,
  policyBase64: Base64.encode(JSON.stringify(policyText))
}

let message = config.policyBase64;
let bytes = Crypto.HMAC(Crypto.SHA1, message, config.accesskey, {
  asBytes: true
});
let signature = Crypto.util.bytesToBase64(bytes);
let timetamp = new Date().getTime();
let OSSConfig = {
  name: 'aliyun',
  host: config.osshost,
  accessid: config.accessid,
  signature: signature,
  policyBase64: config.policyBase64,
}
export default OSSConfig;