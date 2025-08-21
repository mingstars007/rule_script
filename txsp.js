[Script]
http-response ^https:\/\/dm\.video\.qq\.com\/.* requires-body=true,binary-body-mode=true,script-path=https://raw.githubusercontent.com/mingstars007/rule_script/master/txsp.js, tag=腾讯视频

[MITM]
hostname = dm.video.qq.com

// startKeys 是你想删除的关键字数组
const startKeys = ["宇", "星"];
const endKey = "<type.googleapis.com/com.tencent.qqlive.protocol.pb.BoolValue>";

// 1. 判断是否是 base64 内容
let buf;
if ($response.body) {
  buf = Buffer.from($response.body, 'base64'); // octet-stream 通常用 base64
} else {
  $done({}); // 没有 body
}

// 2. 转成字符串，假设 UTF-8
let text = buf.toString('utf8');

// 3. 按行拆分并过滤
let lines = text.split(/\r?\n/);
let result = [];
let skipping = false;

for (let line of lines) {
  if (!skipping && startKeys.some(k => line.includes(k))) {
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

// 5. 转回 base64
const newBody = Buffer.from(text, 'utf8').toString('base64');

// 6. 返回给客户端
$done({body: newBody});
