// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: cloud-download-alt;
async function main() {
  const [url, fm] = ['https://gitcode.net/4qiao/framework/raw/master/mian/web_module_jingDong.js', FileManager.iCloud()];
  const script = await new Request(url).loadString();
  fm.writeString(fm.documentsDirectory() + '/京东_2.js', script);
  // fm.remove(module.filename);
  
  const widget = new ListWidget();
  const image = await getImage('https://gitcode.net/4qiao/scriptable/raw/master/img/jingdong/user.png');
  const widgetImage = widget.addImage(image);
  widgetImage.imageSize = new Size(50, 50);
  widgetImage.centerAlignImage();
  widget.addSpacer(10);
  const text = widget.addText('用户未登录');
  text.font = Font.systemFont(17);
  text.centerAlignText();
  Script.setWidget(widget);
}
module.exports = { main }