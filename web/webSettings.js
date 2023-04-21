// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: cog;
main()
async function main() {
  const F_MGR = FileManager.local();
  const mainPath = F_MGR.joinPath(F_MGR.documentsDirectory(), '95du_electric');
  F_MGR.createDirectory(mainPath, true);
  
  /**
   * 获取电报机器人的数据存储目录路径
   * @returns {string} - 目录路径
   */
  const getSettingPath = () => {
    F_MGR.createDirectory(
      mainPath, true
    );
    return F_MGR.joinPath(mainPath, 'setting.json', true);
  };

  /**
   * 读取储存的设置
   * @param {string} file - JSON
   * @returns {object} - JSON
   */
  const getSettings = (file) => {
    if (F_MGR.fileExists(file)) {
      const data = F_MGR.readString(file);
      return JSON.parse(data);
    }
    return {}
  };
  const settings = await getSettings(getSettingPath());

  /**
   * 存储当前设置
   * @param { JSON } string
   */
  const writeSettings = async (saveSet) => {
    typeof settings === 'object' ? F_MGR.writeString(getSettingPath(), JSON.stringify(saveSet)) : null;
    console.log(JSON.stringify(
      settings, null, 2)
    )
  };
  
  /**
   * 跳转到安装页面
   * @param { string } time
   * @param { string } color
   * @param { string } module
   */
  const webModule = async (scriptName, url) => {
    function getDuration( timer ) {
      const timeAgo = new Date(Date.now() - timer);
      const minutes = timeAgo.getUTCMinutes();
      return minutes;
    }
    const duration = getDuration(settings.updateTime);
    const modulePath = F_MGR.joinPath(mainPath, scriptName);
    if ( duration <= 10 && await F_MGR.fileExists(modulePath) ) {
      return modulePath;
    } else {
      const req = new Request(url);
      const moduleJs = await req.load().catch(() => {
        return null;
      });
      if (moduleJs) {
        F_MGR.write(modulePath, moduleJs);
        return modulePath;
      }
    }
  };
  
  /**
   * Setting drawTableIcon
   * @param { Image } image
   * @param { string } string
   */  
  const loadSF2B64 = async (
    icon = 'square.grid.2x2',
    color = '#56A8D6',
    cornerWidth = 39
  ) => {
    const sfSymbolImg = await drawTableIcon(icon, color, cornerWidth);
    return `data:image/png;base64,${Data.fromPNG(sfSymbolImg).toBase64String()}`;
  };
  
  drawTableIcon = async (
    icon = 'square.grid.2x2',
    color = '#e8e8e8',
    cornerWidth = 39
  ) => {
    const sfi = SFSymbol.named(icon);
    sfi.applyFont(  
      Font.mediumSystemFont(30)
    );
    const imgData = Data.fromPNG(sfi.image).toBase64String();
    const html = `
      <img id="sourceImg" src="data:image/png;base64,${imgData}" />
      <img id="silhouetteImg" src="" />
      <canvas id="mainCanvas" />`;
      
    const js = `
      var canvas = document.createElement("canvas");
      var sourceImg = document.getElementById("sourceImg");
      var silhouetteImg = document.getElementById("silhouetteImg");
      var ctx = canvas.getContext('2d');
      var size = sourceImg.width > sourceImg.height ? sourceImg.width : sourceImg.height;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(sourceImg, (canvas.width - sourceImg.width) / 2, (canvas.height - sourceImg.height) / 2);
      var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var pix = imgData.data;
      for (var i=0, n = pix.length; i < n; i+= 4){
        pix[i] = 255;
        pix[i+1] = 255;
        pix[i+2] = 255;
        pix[i+3] = pix[i+3];
      }
      ctx.putImageData(imgData,0,0);
      silhouetteImg.src = canvas.toDataURL();
      output=canvas.toDataURL()
    `;
  
    let wv = new WebView();
    await wv.loadHTML(html);
    const base64Image = await wv.evaluateJavaScript(js);
    const iconImage = await new Request(base64Image).loadImage();
    const size = new Size(160, 160);
    const ctx = new DrawContext();
    ctx.opaque = false;
    ctx.respectScreenScale = true;
    ctx.size = size;
    const path = new Path();
    const rect = new Rect(0, 0, size.width, size.width);
  
    path.addRoundedRect(rect, cornerWidth, cornerWidth);
    path.closeSubpath();
    ctx.setFillColor(new Color(color));
    ctx.addPath(path);
    ctx.fillPath();
    const rate = 36;
    const iw = size.width - rate;
    const x = (size.width - iw) / 2;
    ctx.drawImageInRect(iconImage, new Rect(x, x, iw, iw));
    return ctx.getImage();
  };
  
  
  // ====== web start =======//
  const withSettings = async (options) => {
    const {
      formItems = [],
      onItemClick,
      _ = 'http://boxjs.com'
    } = options;

    const style = `
    :root {
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
      height: 28;
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
    
    
    for (let index = 0; index < formItems.length; index++) {
      const item = formItems[index];
      const icon = item.icon;
      if (typeof icon == 'object') {
        const { name, color } = icon;
        item.icon = await loadSF2B64(name, color);
      }
    }
    
    const js =`
    (() => {
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
      });
      
      const formData = {};
      const fragment = document.createDocumentFragment()
      for (const item of formItems) {
        const value = settings[item.name] ?? item.default ?? null
        formData[item.name] = value;
        const label = document.createElement("label");
        label.className = "form-item";
        
        const div = document.createElement("div");
        div.className = 'form-label';
        label.appendChild(div);
        
        if (item.icon) {
          const img = document.createElement("img");
          img.src = item.icon;
          img.className = 'form-label-img';
          div.appendChild(img);
        }
        
        const divTitle = document.createElement("div");
        if (item.icon) {
          divTitle.className = 'form-label-title';
        }
        divTitle.innerText = item.label;
        div.appendChild(divTitle);
        
        if (item.type === 'cell') {
          label.classList.add('form-item--link');
          const icon = document.createElement('i');
          icon.className = 'iconfont icon-arrow_right';
          label.appendChild(icon);
          label.addEventListener('click', () => {
            invoke('itemClick', item)
          })
        } else {
          const input = document.createElement("input");
          input.className = 'form-item__input';
          input.name = item.name;
          input.type = item.type;
          input.value = value;
          // Switch
          if (item.type === 'switch') {
            input.type = 'checkbox';
            input.role = 'switch';
            input.checked = value;
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
      document.getElementById('form').appendChild(fragment);
      document.getElementById("myName").addEventListener("click", () => {
        console.log("95度茅台");
        invoke('myName', myName);
      });
      document.getElementById("store").addEventListener("click", () => {
        console.log("组件商店");
        invoke('store', store);
      });
      
      // loading Animations
      const toggleLoading = (e) => {
        const target = e.currentTarget;
        target.classList.add('loading');
        const icon = e.currentTarget.querySelector('.iconfont');
        const className = icon.className;
        icon.className = 'iconfont icon-loading';
        setTimeout(function() {
          target.classList.remove('loading');
          icon.className = className;
          window.removeEventListener('JWeb', listener);
        }, 600);
      };
      
document.getElementById('reset').addEventListener('click', (e) => {
        toggleLoading(e);
      });
      
      // Reset Data
      const reset = () => {
        for (const item of formItems) {
          const el = document.querySelector(\`.form-item__input[name="\${item.name}"]\`)
          formData[item.name] = item.default;
          if (item.type === 'switch') {
            el.checked = item.default
          } else {
            el && (el.value = item.default);
          }
        }
        invoke('remove', formData);
      }
      document.getElementById('reset').addEventListener('click', () => reset())
    })()`;
    
    const topImageColor = Device.isUsingDarkAppearance() === false ? '黑色风格' : '白色风格';
    const baseUrl = 'https://bbs.applehub.cn/wp-content/themes/zibll/';  
    const jsPaths = [
      `${baseUrl}js/libs/jquery.min.js?ver=7.1`,
      `${baseUrl}js/libs/bootstrap.min.js?ver=7.1`,
    ];
    
    const html = `
    <html>
      <head>
        <meta name='viewport' content='width=device-width, user-scalable=no'>
        <link rel="stylesheet" href="https://at.alicdn.com/t/c/font_3772663_kmo790s3yfq.css" type="text/css">
        <style>${style}</style>
      </head>
      <body>
        <!-- 旋转头像开始 -->
        <center>
          <div class="hover-show relative">
            <span class="avatar-img">
              <img alt="头像" src="https://gitcode.net/4qiao/framework/raw/master/img/icon/4qiao.png" width="95" height="95" class="lazyload avatar avatar-id-0"/>
            </span>
          </div>
          <br>
          <img id="store" src="https://bbs.applehub.cn/wp-content/uploads/2022/11/Text_${topImageColor}.png" width="200" height="40">
          <br>
          <a href="javascript:;" class="display-name" id="myName">95度茅台</a>
        </center>
        <!-- 旋转头像结束 -->
        ${jsPaths.map(path => `<script type='text/javascript' src='${path}'></script>`).join('\n')}
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
                <div class="form-label-title">重置所有</div>
                </div>
                <div class="form-label">
                  <div class="form-item-right-desc">15 小时前</div>
                  <i class="iconfont icon-arrow_right"></i>
                </div>
              </div>
            </label>
          </form>
        </div>
        <!-- 通用设置 -->
        <div class="list">
          <div class="list__header">
            通用
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
      if (code === 'itemClick') {
        onItemClick?.(data);
      } else if (code === 'myName') {
        await importModule(await webModule('getScript.js', 'https://gitcode.net/4qiao/framework/raw/master/web/getScript.js')).main();
      } else if (code === 'store') {
        await importModule(await webModule('store.js', 'https://gitcode.net/4qiao/scriptable/raw/master/vip/main95duStore.js')).main();
      } else {
        const saveSet = { ...settings, ...data };
        await writeSettings(saveSet);
      }
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
        icon: {
          name: 'textformat',
          color: '#938BF0'
        },
        default: initColor.darkColor
      },
      {
        name: 'textColorLight',
        label: "图标颜色（白天）",
        type: 'color',
        icon: {
          name: 'gearshape.fill',
          color: '#FF3B2F'
        },
        default: initColor.textColorLight
      },
      {
        name: "indexLightColor",
        label: "标题颜色（白天）",
        type: "color",
        icon: {
          name: 'externaldrive.fill',
          color: '#F9A825'
        },
        default: initColor.indexLightColor
      },
      {
        name: "indexDarkColor",
        label: "标题颜色（夜间）",
        type: "color",
        icon: {
          name: 'applelogo',
          color: '#00BCD4'
        },
        default: initColor.indexDarkColor
      },
      {
        name: "loopSwitch",
        label: "循环模式",
        type: "switch",
        icon: 'https://gitcode.net/4qiao/framework/raw/master/img/symbol/transparent.png',
        default: false
      },
      {
        name: "message",
        label: "更新信息",
        type: "cell",
        icon: {
          name: 'pin.fill',
          color: '#F57C00'
        }
      },
      {
        name: "randomSwitch",
        label: "始终深色",
        type: "switch",
        icon: 'https://gitcode.net/4qiao/framework/raw/master/img/symbol/open.png',
        default: false
      }
    ],
    onItemClick: async (item) => {
      // type: 'time' 添加时间弹窗选项
      const { name } = item;
      if (name === 'message') {
        await importModule(await webModule()).main();
      }
    }
  });
}
module.exports = { main }