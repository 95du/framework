// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: cog;

async function main() {
  const F_MGR = FileManager.local()
  const path = F_MGR.joinPath(F_MGR.documentsDirectory(), "95du_electric");
  const cacheFile = F_MGR.joinPath(path, 'setting.json');
  
  // Get Settings { json }
  const getSettings = (file) => {
    if ( F_MGR.fileExists(file) ) {
      const data = F_MGR.readString(file);
      return JSON.parse(data);
    }
    return {}
  }
  const settings = getSettings(cacheFile);

  
  // ====== web start =======//
  const withSettings = async (options) => {
    const {
      formItems = [],
      onItemClick,
      render,
      homePage = 'http://boxjs.com'
    } = options;
    
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
      
      const iCloudInput = document.querySelector('input[name="useICloud"]')
      iCloudInput.checked = settings.useICloud
      iCloudInput.addEventListener(
'change', (e) => {
        invoke('toggleSettings', e.target.checked)
      })
      
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
        
        if (item.type === 'cell') {
          label.classList.add('form-item--link')
          const icon = document.createElement('i')
          icon.className = 'iconfont icon-arrow_right'
          label.appendChild(icon)
          label.addEventListener('click', () => {
            invoke('itemClick', item)
          })
        } else {
          const input = document.createElement("input")
          input.className = 'form-item__input'
          input.name = item.name
          input.type = item.type
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
        }
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
      <!-- 通用设置 -->
      <div class="list">
        <div class="list__header">
          通用
        </div>
        <form class="list__body" action="javascript:void(0);">
          <label class="form-item">
            <div>自动更新</div>
            <input name="useICloud" type="checkbox" role="switch">
          </label>
          <label id='reset' class="form-item form-item--link">
            <div>重置所有</div>
            <i class="iconfont icon-arrow_right"></i>
          </label>
        </form>
      </div>
      <!--通用设置-->
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
    await webView.loadHTML(html, 'https://github.com/Honye/scriptable-scripts');
    
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
      switch (code) {
        case 'itemClick':
          onItemClick?.(data);
          break
        case 'toggleSettings':
          settings.useICloud = settings.useICloud == true ? false : true;
          break
      }
      // Save Settings
      F_MGR.writeString(
        cacheFile, 
        JSON.stringify({ 
          ...settings,
          ...data
        })
      );
      await injectListener();
    };
    
    injectListener().catch((e) => {
      console.error(e);
      throw e
    });
    await webView.present();
  }
  
  
  // ======= Initial ========= //
  
  const initColor = {
    textColorLight: '#34C579',
    darkColor: '#ffffff',
    lightColor: "#333333",
    indexLightColor: '#3F8BFF',
    indexDarkColor: '#FF9500'
  };
    
  await withSettings({
    formItems: [
      {
        name: "lightColor",
        label: "文字颜色（白天）",
        type: "color",
        default: initColor.lightColor
      },
      {
        name: "darkColor",
        label: "文字颜色（夜间）",
        type: "color",
        default: initColor.darkColor
      },
      {
        name: 'textColorLight',
        label: 'Text color (light)',
        type: 'color',
        default: initColor.textColorLight
      },
      {
        name: "indexLightColor",
        label: "序号颜色（白天）",
        type: "color",
        default: initColor.indexLightColor
      },
      {
        name: "indexDarkColor",
        label: "序号颜色（夜间）",
        type: "color",
        default: initColor.indexDarkColor
      },
      {
        name: "quantumlt",
        label: "Quantumult-X 配置",
        type: "cell"
      },
      {
        name: "loopSwitch",
        label: "循环切换",
        type: "switch",
        default: false
      },
      {
        name: "randomSwitch",
        label: "随机切换",
        type: "switch",
        default: false
      }
    ],
    onItemClick: async (item) => {
      // type: 'time' 添加时间弹窗选项
      const { name } = item;
      if (name === 'quantumlt') {
        Safari.openInApp('https://bbs.applehub.cn/forum-post/688/.html/?replytocom=69', false);
      }
    }
  });
}
module.exports = { main }