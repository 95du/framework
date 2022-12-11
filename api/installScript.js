// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: cloud-download-alt;
try {
  const url = Pasteboard.paste();
  const script = await new Request(url).loadString();
  const name = decodeURIComponent(url.substring(url.lastIndexOf("/") + 1));
  const F_MGR = FileManager.iCloud()
  F_MGR.writeString(F_MGR.documentsDirectory() + '/' + name, script);
  const run = name.split(".")[0]
  await Safari.open('scriptable:///run/' + encodeURIComponent(run));
} catch (e) {
  console.log(e)
}