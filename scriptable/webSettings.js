// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: cog;
async function main() {
  const F_MGR = FileManager.iCloud();
  const folder = F_MGR.joinPath(F_MGR.documentsDirectory(), "95du");
  if (!F_MGR.fileExists(folder)) {
    F_MGR.createDirectory(folder);
  }
  const cacheFile = F_MGR.joinPath(folder, 'setting.json');
  
  // Get Settings { json }
  const getSettings = (file) => {
    if ( F_MGR.fileExists(file) ) {
      const data = F_MGR.readString(file);
      return JSON.parse(data);
    }
    return {}
  }
  const settings = getSettings(cacheFile);
  
  // ====== web start ======= //
  
  const formItems = [
    {
      name: "lightColor",
      label: "文字颜色（白天）",
      type: "color",
      default: "#333333"
    },
    {
      name: "darkColor",
      label: "文字颜色（夜间）",
      type: "color",
      default: "#FFFFFF"
    },
    {
      name: "indexLightColor",
      label: "序号颜色（白天）",
      type: "color",
      default: "34C579"
    },
    {
      name: "indexDarkColor",
      label: "序号颜色（夜间）",
      type: "color",
      default: "FF9500"
    },
    {
      name: 'checkInAfter',
      label: '设置时间',
      type: 'time',
      default: '10:10'
    },
    {
      name: "loop",
      label: "自动循环",
      type: "switch",
      default: false
    },
    {
      name: "random",
      label: "随机切换",
      type: "switch",
      default: true
    }
  ]
  
  const style =
  `:root {
    --color-primary: #007aff;
    --divider-color: rgba(60,60,67,0.36);
    --card-background: #fff;
    --card-radius: 10px;
    --list-header-color: rgba(60,60,67,0.6);
  }
  * {
    -webkit-user-select: none;
    user-select: none;
  }
  body {
    margin: 10px 0;
    -webkit-font-smoothing: antialiased;
    font-family: "SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
    accent-color: var(--color-primary);
  }
  input {
    -webkit-user-select: auto;
    user-select: auto;
  }
  body {
    background: #f2f2f7;
  }
  button {
    font-size: 16px;
    background: var(--color-primary);
    color: #fff;
    border-radius: 8px;
    border: none;
    padding: 0.24em 0.5em;
  }
  button .iconfont {
    margin-right: 6px;
  }
  .list {
    margin: 15px;
  }
  .list__header {
    margin: 0 20px;
    color: var(--list-header-color);
    font-size: 13px;
  }
  .list__body {
    margin-top: 10px;
    background: var(--card-background);
    border-radius: var(--card-radius);
    border-radius: 12px;
    overflow: hidden;
  }
  .form-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    min-height: 2em;
    padding: 0.5em 20px;
    position: relative;
  }
  .form-item--link .icon-arrow_right {
    color: #86868b;
  }
  .form-item + .form-item::before {
    content: "";
    position: absolute;
    top: 0;
    left: 20px;
    right: 0;
    border-top: 0.5px solid var(--divider-color);
  }
  .form-item .iconfont {
    margin-right: 4px;
  }
  .form-item input,
  .form-item select {
    font-size: 14px;
    text-align: right;
  }
  .form-item input[type="checkbox"] {
    width: 1.25em;
    height: 1.25em;
  }
  input[type="number"] {
    width: 4em;
  }
  input[type="date"] {
    min-width: 6.4em;
  }
  input[type='checkbox'][role='switch'] {
    position: relative;
    display: inline-block;
    appearance: none;
    width: 40px;
    height: 24px;
    border-radius: 24px;
    background: #ccc;
    transition: 0.3s ease-in-out;
  }
  input[type='checkbox'][role='switch']::before {
    content: '';
    position: absolute;
    left: 2px;
    top: 2px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    transition: 0.3s ease-in-out;
  }
  input[type='checkbox'][role='switch']:checked {
    background: var(--color-primary);
  }
  input[type='checkbox'][role='switch']:checked::before {
    transform: translateX(16px);
  }
  .actions {
    margin: 15px;
  }
  .copyright {
    margin: 15px;
    font-size: 12px;
    color: #86868b;
  }
  .copyright a {
    color: #515154;
    text-decoration: none;
  }
  .preview.loading {
    pointer-events: none;
  }
  .icon-loading {
    display: inline-block;
    animation: 1s linear infinite spin;
  }
  @keyframes spin {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(1turn);
    }
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --divider-color: rgba(84,84,88,0.65);
      --card-background: #1c1c1e;
      --list-header-color: rgba(235,235,245,0.6);
    }
    body {
      background: #000;
      color: #fff;
    }
  }`;
  
  const js =
  `(() => {
    const settings = ${JSON.stringify(settings)}
    const formItems = ${JSON.stringify(formItems)}
    
    window.invoke = (code, data) => {
      window.dispatchEvent(
        new CustomEvent(
          'JBridge',
          { detail: { code, data } }
        )
      )
    }
    
    const formData = {};
    const fragment = document.createDocumentFragment()
    for (const item of formItems) {
      const value = settings[item.name] ?? item.default ?? null
      formData[item.name] = value;
      const label = document.createElement("label");
      label.className = "form-item";
      const div = document.createElement("div");
      div.innerText = item.label;
      label.appendChild(div);
      
      const input = document.createElement("input")
      input.className = 'form-item__input'
      input.name = item.name
      input.type = item.type || "text";
      input.value = value
      // Switch
      if (item.type === 'switch') {
        input.type = 'checkbox'
        input.role = 'switch'
        input.checked = value
      }
      input.addEventListener("change", (e) => {
        formData[item.name] =
          item.type === 'switch'
          ? e.target.checked
          : e.target.value;
        invoke('changeSettings', formData)
      });
      label.appendChild(input);
      fragment.appendChild(label);
    }
    document.getElementById('form').appendChild(fragment)
  
    const reset = () => {
      for (const item of formItems) {
        const el = document.querySelector(\`.form-item__input[name="\${item.name}"]\`)
        formData[item.name] = item.default
        if (item.type === 'switch') {
          el.checked = item.default
        } else {
          el && (el.value = item.default)
        }
      }
      invoke('removeSettings', formData)
    }
    document.getElementById('reset').addEventListener('click', () => reset())
  })()`;
  
  
  const html =`
  <html>
    <head>
      <meta name='viewport' content='width=device-width, user-scalable=no'>
      <link rel="stylesheet" href="//at.alicdn.com/t/c/font_3772663_kmo790s3yfq.css" type="text/css">
      <style>${style}</style>
    </head>
    <body>
    <div class="list">
      <div class="list__header">
        通用
      </div>
      <form class="list__body" action="javascript:void(0);">
        <label class="form-item">
          <div>自动更新</div>
          <input name="update" type="checkbox" role="switch">
        </label>
        <label id='reset' class="form-item form-item--link">
          <div>重置所有</div>
          <i class="iconfont icon-arrow_right"></i>
        </label>
      </form>
    </div>
    <div class="list">
      <div class="list__header">
        设置
      </div>
      <form id="form" class="list__body" action="javascript:void(0);"></form>
    </div>
      <script>${js}</script>
    </body>
  </html>`
  
  const webView = new WebView();
  await webView.loadHTML(html);
  
  const injectListener = async () => {
    const event = await webView.evaluateJavaScript(
      `(() => {
        const controller = new AbortController()
        const listener = (e) => {
          completion(e.detail)
          controller.abort()
        }
        window.addEventListener(
          'JBridge',
          listener,
          { signal: controller.signal }
        )
      })()`,
      true
    ).catch((err) => {
      console.error(err);
    });
    
    const { code, data } = event;
    F_MGR.writeString(cacheFile, JSON.stringify(data));
    await injectListener();
  };
  
  injectListener().catch((e) => {
    console.error(e);
    throw e
  });
  await webView.present();
}
module.exports = { main }