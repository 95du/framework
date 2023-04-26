// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: cog;
main()
async function main() {
  const fm = FileManager.local();
  const mainPath = fm.joinPath(fm.documentsDirectory(), '95du_electric');
  fm.createDirectory(mainPath, true);
  
  const name = '交管12123_2';
  const scriptUrl = 'https://gitcode.net/4qiao/framework/raw/master/mian/module12123.js';
  
  /**
   * 获取存储路径
   * @returns {string} - string
   */
  const getSettingPath = () => {
    fm.createDirectory(
      mainPath, true
    );
    return fm.joinPath(mainPath, 'setting.json', true);
  };

  /**
   * 读取储存的设置
   * @param {string} file - JSON
   * @returns {object} - JSON
   */
  const getSettings = (file) => {
    if (fm.fileExists(file)) {
      const data = fm.readString(file);
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
    typeof settings === 'object' ? fm.writeString(getSettingPath(), JSON.stringify(saveSet)) : null;
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
    const modulePath = fm.joinPath(mainPath, scriptName);
    if ( duration <= 10 && await fm.fileExists(modulePath) ) {
      return modulePath;
    } else {
      const req = new Request(url);
      const moduleJs = await req.load().catch(() => {
        return null;
      });
      if (moduleJs) {
        fm.write(modulePath, moduleJs);
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
  
  const drawTableIcon = async (
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
  
  
  const useFileManager = ({ cacheTime } = {}) => {
    return {
      readString: (fileName) => {
        const filePath = fm.joinPath(mainPath, fileName);
        const currentTime = (new Date()).getTime();
        if (fm.fileExists(filePath) && cacheTime && ((currentTime - fm.creationDate(filePath).getTime()) / ( 60 * 60 * 1000 )) <= cacheTime) {
          return fm.readString(filePath);
        }
        return null;
      },
      writeString: (fileName, content) => fm.writeString(fm.joinPath(mainPath, fileName), content)
    }
  };
    
  const getString = async (url) => {
    return await new Request(url).loadString();
  };
  
  const getCacheString = async (cssFileName, cssFileUrl) => {
    const cache = useFileManager({ cacheTime: 24 });
    const cssString = cache.readString(cssFileName);
    if (cssString) {
      return cssString;
    }
    const res = await getString(cssFileUrl);
    cache.writeString(cssFileName, res);
    return res;
  };
  
  
  // ====== web start =======//
  const withSettings = async (options) => {
    const {
      formItems = [],
      onItemClick,
      _ = 'http://boxjs.com'
    } = options;

    const cssStyle = await getCacheString('cssStyle.css', 'https://gitcode.net/4qiao/framework/raw/master/web/style.css');

    const style = `
    :root {
      --color-primary: #007aff;
      --divider-color: rgba(60,60,67,0.36);
      --card-background: #fff;
      --card-radius: 10px;
      --list-header-color: rgba(60,60,67,0.6);
    }
    ${cssStyle}`;
    
    
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
      document.getElementById('userClick').addEventListener('click', () => {
        invoke('userClick', userClick);
      });
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
    
    const [themeColor, logoColor] = Device.isUsingDarkAppearance() ? ['dark', '白色风格'] : ['white', '黑色风格'];
    
    const baseUrl = 'https://bbs.applehub.cn/wp-content/themes/zibll/';  
    
    const jsPaths = [
      `${baseUrl}js/libs/jquery.min.js?ver=7.1`,
      `${baseUrl}js/libs/bootstrap.min.js?ver=7.1`,
      `${baseUrl}js/loader.js?ver=7.1`
    ];
    
    const html = `
    <html>
      <head>
        <meta name='viewport' content='width=device-width, user-scalable=no, viewport-fit=cover'>
        <link rel="stylesheet" href="https://at.alicdn.com/t/c/font_3772663_kmo790s3yfq.css" type="text/css">
        <style>${style}</style>
      </head>
      <body class="${themeColor}-theme nav-fixed site-layout-1">
        <!-- 旋转头像开始 -->
        <center>
          <div class="hover-show relative">
            <span class="avatar-img hh signin-loader">
              <img alt="头像" src="https://gitcode.net/4qiao/framework/raw/master/img/icon/4qiao.png" width="95" height="95" class="lazyload avatar avatar-id-0"/>
            </span>
          </div>
          <br>
          <img id="store" src="https://bbs.applehub.cn/wp-content/uploads/2022/11/Text_${logoColor}.png" width="200" height="40">
          <br>
          <a href="javascript:;" class="display-name" id="myName">95度茅台</a>
        </center>
        <!-- 旋转头像结束 -->
        <div class="flex header-info relative hh signin-loader">
        </div>
        <!-- 弹窗开始 -->
        <div class="modal fade" id="u_sign" tabindex="-1" role="dialog">
          <div class="modal-dialog" role="document">
            <div class="sign zib-widget blur-bg relative" style="border-radius: 27px;">
              <div class="text-center">
                <div class="sign-logo box-body">
                  <img src="https://bbs.applehub.cn/wp-content/uploads/2022/11/Text_${logoColor}.png" class="lazyload">
                </div>
              </div>
              <div class="tab-content">
                <div class="box-body">
                  <div class="title-h-center fa-2x">
                    <div class="title">${name}</div>
                  </div>
                  <a class="muted-color px30" class="display-name" >
                    <div id="myName" class="update-content">作者: &nbsp; 95度茅台</div>
                  </a>
                  <br />
                  <div class="form-label-title">🔥2023年4月21日
                    <li>修复已知问题</li>
                    <li>性能优化，改进用户体验</li>
                  </div>
                </div>
                <div class="box-body">
                  <div id="sign-in">
                    <button id="userClick" type="button" class="but radius jb-blue padding-lg  btn-block">立即更新</button>
                  </div>
                </div>
                <p class="social-separator separator muted-5-color em12">Version 1.2.0</p>
              </div>
            </div>
          </div>
        </div>
        <!-- 弹窗结束 -->
        <script type="text/javascript">
          window.onload = function() {
            setTimeout(function() {
              $('.signin-loader').click()
            }, 1000);
          };
        </script>
        <script type="text/javascript">
          window._win = {
            uri: 'https://bbs.applehub.cn/wp-content/themes/zibll',
            qj_loading: '1',
          }
        </script>
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
      } else if (code === 'userClick') {
        const script = await new Request(scriptUrl).loadString();
        const fm = FileManager.iCloud()
        fm.writeString(fm.documentsDirectory() + `/${name}.js`, script);
        Safari.open('scriptable:///run/' + encodeURIComponent(name));
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