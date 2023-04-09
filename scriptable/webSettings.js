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

  /**
   * 存储当前设置
   * @param { JSON } string
   */
  const writeSettings = async ( saveSet ) => {
    typeof settings === 'object' ?  F_MGR.writeString(cacheFile, JSON.stringify( saveSet )) : null;
     console.log(JSON.stringify(
       settings, null, 2)
    );
  }
  
  
  // ====== web start =======//
  const withSettings = async (options) => {
    const {
      formItems = [],
      onItemClick,
      render,
      _ = 'http://boxjs.com'
    } = options;
    
    const style =
    `:root {
      --color-primary: #007aff;
      --divider-color: rgba(60,60,67,0.36);
      --card-background: #fff;
      --card-radius: 10px;
      --list-header-color: rgba(60,60,67,0.6);
    }
    /* 头像呼吸光环旋转放大开始 **/
    .avatar {
      border-radius: 50%;
      animation: light 4s ease-in-out infinite;
      transition: 0.5s;
    }
    .avatar:hover {
      transform: scale(1.15) rotate(720deg);
    }
    @keyframes light {
      0% {
        box-shadow:0 0 4px #f00;
      }
      25% {
        box-shadow:0 0 16px #0f0;
      }
      50% {
        box-shadow:0 0 4px #00f;
      }
      75% {
        box-shadow:0 0 16px #0f0;
      }
      100% {
        box-shadow:0 0 4px #f00;
      }
    }
    /** 头像呼吸光环旋转放大结束 **/

    /** 彩色昵称开始 **/
    .display-name{
      background-image: -webkit-linear-gradient(90deg, #07c160, #fb6bea 25%, #3aedff 50%, #fb6bea 75%, #28d079);
      -webkit-text-fill-color: transparent;
      -webkit-background-clip: text;
      background-size: 100% 600%;
      animation: wzw 10s linear infinite;  
      font-size: 18px;
    }
    @keyframes wzw {
      0% {
        background-position: 0 0;
      }
      100% {
        background-position: 0 -300%;
      }
    }
    /** 彩色昵称结束 **/
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
    .form-item-auth {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 11em;
      padding: 0.35em 100px;
      position: relative;
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
    .form-label {
      display: flex;
      align-items: center;
    }
    .form-label-img {
      height: 30;
    }
    .form-label-title {
      margin-left: 12px
    }
    .form-item--link .icon-arrow_right {
      color: #86868b;
    }
    .form-item-right-desc {
      font-size: 16px;
      color: #86868b;
      margin-right: 5px;
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
      
      const update = document.querySelector('input[name="update"]')
      update.checked = settings.update ?? true
      update.addEventListener('change', (e) => {
        formData['update'] = e.target.checked
        invoke('changeSettings', formData)
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
    
    const topImageColor = Device.isUsingDarkAppearance() === false ? '黑色风格' : '白色风格';
    const isChildLevel = false
    const html =`
    <html>
      <head>
        <meta name='viewport' content='width=device-width, user-scalable=no'>
        <link rel="stylesheet" href="https://at.alicdn.com/t/c/font_3772663_kmo790s3yfq.css" type="text/css">
        <style>${style}</style>
      </head>
      <body>
      <!-- author Logo -->
      <center>
        <!-- 旋转头像开始 -->
        <div class="hover-show relative">
          <span class="avatar-img">
            <img alt="头像" src="https://gitcode.net/4qiao/framework/raw/master/img/icon/4qiao.png" width="90" height="90" class="lazyload avatar avatar-id-0"/>
          </span>
        </div>
        <br>
        <img src="https://bbs.applehub.cn/wp-content/uploads/2022/11/Text_${topImageColor}.png" width="200" height="40">
        <br>
        <a href="javascript:;" class="display-name">Author &nbsp; 95度茅台</a>
        <!-- 旋转头像结束 -->
      </center>
      <script type='text/javascript' src='https://bbs.applehub.cn/wp-content/themes/zibll/js/libs/jquery.min.js?ver=7.1' id='jquery-js'></script>
      <script type='text/javascript' src='https://bbs.applehub.cn/wp-content/themes/zibll/js/libs/bootstrap.min.js?ver=7.1' id='bootstrap-js'></script>
      <!-- 通用 -->  
      <div class="list">
        <form class="list__body" action="javascript:void(0);">
          <label id="update" class="form-item form-item--link" >
            <div class="form-label">
              <img class="form-label-img" src="https://gitcode.net/4qiao/framework/raw/master/img/symbol/update.png"/>
              <div class="form-label-title">自动更新</div>
            </div>
            <input name="update" type="checkbox" role="switch" />
          </label>
          <label id='reset' class="form-item form-item--link">
            <div class="form-label">
              <img class="form-label-img" src="https://gitcode.net/4qiao/framework/raw/master/img/symbol/reset.png"/>
              <div class="form-label-title" data-size="small">重置所有</div>
              </div>
              <div class="form-label">
                <div id="refreshInterval" class="form-item-right-desc">15 小时前</div>
              <i class="iconfont icon-arrow_right"></i>
            </div>
          </label>
        </form>
      </div>
      <!-- 通用设置 -->
      <div class="list">
        <div class="list__header">
          设置
        </div>
        <form id="form" class="list__body" action="javascript:void(0);"></form>
      </div>
        <script>${js}</script>
      </body>
    </html>`.trim();
    
    const webView = new WebView();
    await webView.loadHTML(html, _);
    
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
      };
      const saveSet = {
        ...settings,
        ...data
      }
      await writeSettings(saveSet);
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
    darkColor: '#FFFFFF',
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
        icon: 'https://gitcode.net/4qiao/framework/raw/master/img/symbol/refresh.png',
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
        label: '标题文字颜色',
        type: 'color',
        default: initColor.textColorLight
      },
      {
        name: "indexLightColor",
        label: "标题颜色（白天）",
        type: "color",
        default: initColor.indexLightColor
      },
      {
        name: "indexDarkColor",
        label: "标题颜色（夜间）",
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