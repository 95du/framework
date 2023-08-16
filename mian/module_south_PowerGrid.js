// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-brown; icon-glyph: bolt;
/**
* 小组件作者: 95度茅台
* 获取token作者: @Fokit
* Version 1.0.0
* 2023-03-27 19:30
* Telegram 交流群 https://t.me/+CpAbO_q_SGo2ZWE1

==============================
Quantumult-X 获取Token重写：
https://raw.githubusercontent.com/FoKit/Scripts/main/rewrite/get_95598_token.sgmodule

使用方法：
打开南网在线APP，登录即可自动抓取/更Token

=========Quantumult-X=========
[MITM]
hostname = 95598.csg.cn

[rewrite_local]
^https:\/\/95598\.csg\.cn\/ucs\/ma\/zt\/eleCustNumber\/queryBindEleUsers url script-request-header https://raw.githubusercontent.com/FoKit/Scripts/main/scripts/SouthernPower.js

============Surge=============
[Script]
南网在线Token = type=http-request,pattern=^https:\/\/95598\.csg\.cn\/ucs\/ma\/zt\/eleCustNumber\/queryBindEleUsers,requires-body=0,max-size=0,timeout=1000,script-path=https://raw.githubusercontent.com/FoKit/Scripts/main/scripts/SouthernPower.js,script-update-interval=0
[MITM]
hostname = %APPEND% 95598.csg.cn
*/

const scriptName = '95du_electric';
const scriptUrl = atob('aHR0cHM6Ly9naXRjb2RlLm5ldC80cWlhby9mcmFtZXdvcmsvcmF3L21hc3Rlci9hcGkvbWFpbl9zb3V0aF9Qb3dlckdyaWQuanM=');

const fm = FileManager.local();
const runPath = fm.joinPath(fm.documentsDirectory(), scriptName);
const moduleDir = fm.joinPath(runPath, 'Running');

if (!fm.fileExists(runPath)) fm.createDirectory(runPath);
if (!fm.fileExists(moduleDir)) fm.createDirectory(moduleDir);

const downloadModule = async () => {
  const date = new Date();
  const df = new DateFormatter();
  df.dateFormat = 'yyyyMMddHH';
  
  const moduleFilename = df.string(date).toString() + '.js';
  const modulePath = fm.joinPath(moduleDir, moduleFilename);

  if (fm.fileExists(modulePath)) return modulePath;

  const [moduleFiles, moduleLatestFile] = getModuleVersions();

  try {
    const req = new Request(scriptUrl);
    const moduleJs = await req.load();
    if (moduleJs) {
      fm.write(modulePath, moduleJs);
      if (moduleFiles) moduleFiles.forEach(file => fm.remove(fm.joinPath(moduleDir, file)));
      return modulePath;
    } else {
      return moduleLatestFile ? fm.joinPath(moduleDir, moduleLatestFile) : null;
    }
  } catch (e) {
    return moduleLatestFile ? fm.joinPath(moduleDir, moduleLatestFile) : null;
  }
};

const getModuleVersions = () => {
  const dirContents = fm.listContents(moduleDir);
  if (dirContents.length > 0) {
    const versions = dirContents.map(x => parseInt(x.replace('.js', '')));
    versions.sort((a, b) => b - a);

    if (versions.length > 0) {
      const moduleFiles = versions.map(x => `${x}.js`);
      const moduleLatestFile = `${versions[0]}.js`;
      return [moduleFiles, moduleLatestFile];
    }
  }
  return [null, null];
};

const modulePath = await downloadModule();
if (modulePath) {
  const importedModule = await importModule(modulePath);
  importedModule.main();
};