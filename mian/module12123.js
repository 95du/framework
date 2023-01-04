// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: car;
/**
 * 交管12123
 * 小组件作者：95度茅台
 * 获取Token作者: @FoKit
 * 感谢 @LSP @DmYY
 * UITable版本: Version 1.0.0
 * Telegram 交流群 https://t.me/+ViT7uEUrIUV0B_iy

获取Token重写：
https://raw.githubusercontent.com/FoKit/Scripts/main/rewrite/get_12123_token.sgmodule

使用方法：配置重写规则，手动运行小组件，按提示跳转到 支付宝12123小程序 登录即可自动抓取/更新Token。
使用前，请确保您的代理APP已配置好BoxJs重写，BoxJs配置方法：https://chavyleung.gitbook.io/boxjs/

一键添加 boxjs 重写到 Quantumult-X https://api.boxjs.app/quanx-install

Boxjs订阅（可选）：http://boxjs.com/#/sub/add/https%3A%2F%2Fraw.githubusercontent.com%2FFoKit%2FScripts%2Fmain%2Fboxjs%2Ffokit.boxjs.json

手动配置重写规则：
=========Quantumult-X=========
[rewrite_local]
^https:\/\/miniappcsfw\.122\.gov\.cn:8443\/openapi\/invokeApi\/business\/biz url script-request-body https://raw.githubusercontent.com/FoKit/Scripts/main/scripts/get_12123_token.js

[MITM]
hostname = miniappcsfw.122.gov.cn
============Surge=============
[Script]
12123_Token = type=http-request,pattern=^https:\/\/miniappcsfw\.122\.gov\.cn:8443\/openapi\/invokeApi\/business\/biz,requires-body=1,max-size=0,timeout=1000,script-path=https://raw.githubusercontent.com/FoKit/Scripts/main/scripts/get_12123_token.js,script-update-interval=0

[MITM]
hostname = %APPEND% miniappcsfw.122.gov.cn
*/

const scriptName = '95du12123';
const scriptUrl = atob('aHR0cHM6Ly9naXRjb2RlLm5ldC80cWlhby9mcmFtZXdvcmsvcmF3L21hc3Rlci9hcGkvbWFpbjEyMTIzX1VJVGFibGUuanM=');
const fm = FileManager.iCloud();
const moduleDir = fm.joinPath(fm.libraryDirectory(), scriptName);

const modulePath = await downloadModule(scriptName, scriptUrl);
if (modulePath != null) {
  const importedModule = importModule(modulePath);
  await importedModule.main();
} else {
  console.log('Failed to download new module and could not find any local version.');
}


async function downloadModule(scriptName, scriptUrl) {
  if (fm.fileExists(moduleDir) && !fm.isDirectory(moduleDir)) fm.remove(moduleDir);
  if (!fm.fileExists(moduleDir)) fm.createDirectory(moduleDir);
  const hours = new Date().getHours()
  const moduleFilename = hours.toString() + '.js';
  const modulePath = fm.joinPath(moduleDir, moduleFilename);
  if (fm.fileExists(modulePath)) {
    return modulePath;
  } else {
    const [moduleFiles, moduleLatestFile] = getModuleVersions(scriptName);
    const req = new Request(scriptUrl);
    const moduleJs = await req.load().catch(() => {
      return null;
    });
    if (moduleJs) {
      fm.write(modulePath, moduleJs);
      if (moduleFiles != null) {
        moduleFiles.map(x => {
          fm.remove(fm.joinPath(moduleDir, x));
        });
      }
      return modulePath;
    } else {
      console.log('Failed to download new module. Using latest local version: ' + moduleLatestFile);
      return (moduleLatestFile != null) ? fm.joinPath(moduleDir, moduleLatestFile) : null;
    }
  }
}

function getModuleVersions(scriptName) {
  const dirContents = fm.listContents(moduleDir);
  if (dirContents.length > 0) {
    const versions = dirContents.map(x => {
      if (x.endsWith('.js')) return parseInt(x.replace('.js', ''));
    });
    versions.sort(function(a, b) {
      return b - a;
    });
    if (versions.length > 0) {
      const moduleFiles = versions.map(x => {
        return x + '.js';
      });
      moduleLatestFile = versions[0] + '.js';
      return [moduleFiles, moduleLatestFile];
    }
  }
  return [null, null];
}