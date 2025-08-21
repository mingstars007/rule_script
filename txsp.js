[Script]
http-response ^https:\/\/dm\.video\.qq\.com\/.* requires-body=true,binary-body-mode=true,script-path=https://raw.githubusercontent.com/mingstars007/rule_script/master/txsp.js, tag=腾讯视频

[MITM]
hostname = dm.video.qq.com


const startKeys = ["宁", "赫", "星"];
const endKey = "<type.googleapis.com/com.tencent.qqlive.protocol.pb.BoolValue>";

// 1. 判断是否是 base64 内容
if (!$response.body) {
  $done({}); // 没有 body
}
let buf = $response.body;
// 2. 转成字符串，假设 UTF-8
let text = buf.toString("utf8");

// 3. 按行拆分并过滤
let lines = text.split(/\r?\n/);
let result = [];
let skipping = false;

for (let line of lines) {
  if (!skipping && startKeys.some((k) => line.includes(k))) {
    skipping = true;
    continue;
  }
  if (skipping && line.includes(endKey)) {
    skipping = false;
    continue;
  }
  if (!skipping) result.push(line);
}

// 4. 拼回字符串
text = result.join("\n");

// 6. 返回给客户端
$done({ body: text });
