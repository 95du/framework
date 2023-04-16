// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: star-and-crescent;
const html = await new Request('https://bbs.applehub.cn/user/balance').loadString();
//console.log(html)

const webview = new WebView();
await webview.loadHTML(html)
await webview.present();