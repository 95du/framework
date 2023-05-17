// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: bowling-ball;
/**
 * 组件名称: 澳门六合彩开奖结果
 * 小组件作者: 95度茅台
 * Version 1.0.0
 * 2023-05-17
 * Telegram 交流群 https://t.me/+ViT7uEUrIUV0B_iy
 */

const scriptName = '95du_macaujc';
const scriptUrl = atob('aHR0cHM6Ly9naXRjb2RlLm5ldC80cWlhby9mcmFtZXdvcmsvcmF3L21hc3Rlci9hcGkvbWFpbl9tYWNhdWpjLmpz');
const fm = FileManager.local();
const runPath = fm.joinPath(fm.documentsDirectory(), scriptName);
if (!fm.fileExists(runPath)) {
  fm.createDirectory(runPath);
}

const moduleDir = fm.joinPath(fm.documentsDirectory(), `${scriptName}/Running`);
if (!fm.fileExists(moduleDir)) {
  fm.createDirectory(moduleDir);
}

const modulePath = await downloadModule(scriptName, scriptUrl);
if (modulePath != null) {
  const importedModule = importModule(modulePath);
  importedModule.main();
}

async function downloadModule(scriptName, scriptUrl) {
  const date = new Date();
  const df = new DateFormatter();
  df.dateFormat = 'yyyyMMddHH';
  const moduleFilename = df.string(date).toString() + '.js';
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