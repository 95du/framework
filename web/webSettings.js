// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: cog;

async function main() {
  const rootUrl = atob('aHR0cHM6Ly9naXRjb2RlLm5ldC80cWlhby9mcmFtZXdvcmsvcmF3L21hc3Rlci8=');
  const scriptName = '交管12123_2'
  const scriptUrl = `${rootUrl}mian/module12123.js`;
  const version = '1.2.5'
  const updateDate = '2023年4月28日'
  
  
  /**
   * 创建，获取存储路径
   * @returns {string} - string
   */
  const fm = FileManager.local();
  const mainPath = fm.joinPath(fm.documentsDirectory(), '95du_web');
  
  const getSettingPath = () => {
    fm.createDirectory(
      mainPath, true
    );
    return fm.joinPath(mainPath, 'setting.json');
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
  const writeSettings = async (settings) => {
    fm.writeString(getSettingPath(), JSON.stringify(settings, null, 2));
    console.log(JSON.stringify(
      settings, null, 2)
    )
  };
  
  /**  
   * 弹出一个通知
   * @param {string} title
   * @param {string} body
   * @param {string} url
   * @param {string} sound
   */
  const notify = async (title, body, url, opts = {}) => {
    let n = new Notification()
    n = Object.assign(n, opts);
    n.title = title
    n.body = body
    n.sound = 'alert'
    if (url) {n.openURL = url}
    return await n.schedule()
  }
  
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
  
  /**
   * 获取css及js字符串和图片并使用缓存
   * @param {string} File Extension
   * @param {Image} Basr64 
   * @returns {string} - Request
   */
  const cache = fm.joinPath(mainPath, 'cachePath');
  fm.createDirectory(cache, true);
  
  const useFileManager = ({ cacheTime } = {}) => {
    return {
      readString: (fileName) => {
        const filePath = fm.joinPath(cache, fileName);
        const currentTime = (new Date()).getTime();
        if (fm.fileExists(filePath) && cacheTime && ((currentTime - fm.creationDate(filePath).getTime()) / ( 60 * 60 * 1000 )) <= cacheTime) {
          return fm.readString(filePath);
        }
        return null;
      },
      writeString: (fileName, content) => fm.writeString(fm.joinPath(cache, fileName), content),  
      // cache Image
      readImage: (filePath) => {
        const imgPath = fm.joinPath(cache, filePath);
        return fm.fileExists(imgPath) ? fm.readImage(imgPath) : null;
      },
      writeImage: (filePath, image) => fm.writeImage(fm.joinPath(cache, filePath), image)
    }
  };
  
  /**
   * 获取css，js字符串并使用缓存
   * @param {string} string
   */
  const getString = async (url) => {
    return await new Request(url).loadString();
  };
  
  const getCacheString = async (cssFileName, cssFileUrl) => {
    const cache = useFileManager({ cacheTime: 1024 });
    const cssString = cache.readString(cssFileName);
    if (cssString) {
      return cssString;
    }
    const response = await getString(cssFileUrl);
    cache.writeString(cssFileName, response);
    return response;
  };
  
  /**
   * 获取网络图片并使用缓存
   * @param {Image} url
   */
  const getImage = async (url) => {
    return await new Request(url).loadImage();
  };
  
  const getLogoImage = async (name, url) => {
    const cache = useFileManager();
    const image = cache.readImage(name);
    if (image) {
      return image;
    }
    const res = await getImage(url);
    cache.writeImage(name, res);
    return res;
  };
  
  const toBase64 = async (img) => {
    return `data:image/png;base64,${Data.fromPNG(img).toBase64String()}`
  }
  
  
  // ====== web start =======//
  
  dismissLoading = (webView) => {
    webView.evaluateJavaScript(
      "window.dispatchEvent(new CustomEvent('JWeb', { detail: { code: 'finishLoading' } }))",
      false
    );
  };
  
  const renderAppView = async (options) => {
    const {
      title,
      formItems = [],
      onItemClick,
      _ = 'http://boxjs.com'
    } = options;

    const cssStyle = await getCacheString('cssStyle.css', `${rootUrl}web/style.css`);

    const style = `
    :root {
      --color-primary: #007aff;
      --divider-color: rgba(60,60,67,0.36);
      --card-background: #fff;
      --card-radius: 10px;
      --list-header-color: rgba(60,60,67,0.6);
    }
    ${cssStyle}`;
    
    
    /** 
     * @param {image} cacheImage
     * @param {string} scrips
     * @param {string} themeColor
     */
    for (let index = 0; index < formItems.length; index++) {
      const item = formItems[index];
      const icon = item.icon;
      if (typeof icon == 'object') {
        const { name, color } = icon;
        item.icon = await loadSF2B64(name, color);
      }
    }
    
    const icons = [  
      {
        name: 'arrow.triangle.2.circlepath',
        color: '#FF9500'
      },
      {
        name: 'person.crop.circle',
        color: '#43CD80'
      },
      {
        name: 'applelogo',
        color: '#00BCD4'
      },
      {
        name: 'camera.fill',
        color: '#FF9300'
      },
    ];
    const [clearCache, userlogin, appleOS, avatarImg] = await Promise.all(
      icons.map(({ name, color }) => loadSF2B64(name, color))
    );
    
    // themeColor
    const [themeColor, logoColor] = Device.isUsingDarkAppearance() ? ['dark', 'white'] : ['white', 'black'];

    const appleHub = await toBase64(await getLogoImage(`${logoColor}.png`, `${rootUrl}img/picture/appleHub_${logoColor}.png`));
    
    const authorAvatar = await toBase64(await getLogoImage("author.png", `${rootUrl}img/icon/4qiao.png`));
    
    const scripts = ['jquery.min.js', 'bootstrap.min.js', 'loader.js'];
    const scriptTags = await Promise.all(scripts.map(async (script) => {
      const content = await getCacheString(script, `${rootUrl}web/${script}`);
      return `<script>${content}</script>`;
    }));
    
    // 主菜单
    const mainMenu = async () => {
      const avatar = `  
      <center>
        <div class="hover-show relative">
          <span class="avatar-img hh signin-loader">
            <img src="${authorAvatar}" width="95" height="95" class="lazyload avatar avatar-id-0"/>
          </span>
        </div>
        <br>
          <img id="myName" src="${appleHub}" width="200" height="40">
        <br>
        <a class="display-name" id="store">组件商店</a>
      </center>
      `
      
      // 弹窗
      const popup = `  
      <div class="modal fade" id="u_sign" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="sign zib-widget blur-bg relative" style="border-radius: 27px;">
            <div class="sign-logo box-body">
              <img src="${appleHub}" class="lazyload">
            </div>
            <div class="tab-content">
              <div class="box-body">
                <div class="title-h-center fa-2x">
                  <div class="title">${scriptName}</div>
                </div>
                <a class="muted-color px30" class="display-name">
                  <div id="myName" class="update-content">Version ${version}</div>
                </a>
                <br />
                <div class="form-label-title">  
                  <li>${updateDate}&nbsp;🔥</li>
                  <li>修复已知问题</li>
                  <li>性能优化，改进用户体验</li>
                </div>
              </div>
              <div class="box-body">
                <div id="sign-in">
                  <button id="install" type="button" class="but radius jb-pink padding-lg  btn-block">立即更新</button>
                </div>
              </div>
              <p class="social-separator separator muted-5-color em12">95度茅台</p>
            </div>
          </div>
        </div>
      </div>
      <script type="text/javascript">
        setTimeout(function() {
          $('.signin-loader').click();
        }, 1500);
        window._win = {
          uri: 'https://bbs.applehub.cn/wp-content/themes/zibll',
          qj_loading: '1',
        };
      </script>
      `
      
      // avatar menu
      const menu = [
        { 
          id: 'avatar', 
          imgSrc: avatarImg, 
          title: '设置头像'
        }, 
        { 
          id: 'telegram', 
          imgSrc: 'https://gitcode.net/4qiao/scriptable/raw/master/img/icon/NicegramLogo.png', 
          title: 'Telegram' 
        }
      ];
      
      // switch menu
      const toggle = [
        {
          id: "ios",
          imgSrc: appleOS,
          title: "AppleOS"
        },
        {
          id: "update",
          imgSrc: `${rootUrl}img/symbol/update.png`,
          title: "自动更新"
        },
      ];
      
      // user menu
      const menu2 = [
        {
          id: 'reset',
          imgUrl: `${rootUrl}img/symbol/reset.png`,
          title: '重置所有'
        },
        {
          id: 'clearCache',
          imgUrl: clearCache,
          title: '清除缓存'
        },
        {
          id: 'login',
          imgUrl: userlogin,
          title: '用户登录',
          desc: '已登录'
        }
      ];
  
      const label = (item) => `
        <label id="${item.id}" class="form-item form-item--link">
          <div class="form-label">
            <img class="form-label-img" src="${item.imgSrc || item.imgUrl}"/>
            <div class="form-label-title">${item.title}</div>
          </div>
          ${item.desc ? `
            <div class="form-label">
              <div id="${item.id}-desc" class="form-item-right-desc">${item.desc}</div>
              <i class="iconfont icon-arrow_right"></i>
            </div>
          ` : `
            <i class="iconfont icon-arrow_right"></i>
          `}
        </label>
      `
      
      return `
        <!-- 旋转头像 -->
        ${avatar}
        <!-- 弹窗 -->
        ${popup}
        ${scriptTags.join('\n')}
        <!-- 通用 -->    
        <div class="list">
          <form class="list__body" action="javascript:void(0);">
            ${menu.map(item => label(item)).join('')}
          </form>
        </div>
        <!-- 间隔 -->
        <div class="list">
          <form class="list__body">
          </form>
        </div>
        <!-- 通用 toggle -->
        <div class="list">
          <form class="list__body" action="javascript:void(0);">
            ${toggle.map(item => `
              <label id="${item.id}" class="form-item form-item--link">
                <div class="form-label">
                  <img class="form-label-img" src="${item.imgSrc}"/>
                  <div class="form-label-title">${item.title}</div>
                </div>
                <input name="${item.id}" type="checkbox" role="switch" />
              </label>
            `).join('')}
          </form>
        </div>
        <!-- 间隔 -->
        <div class="list">
          <form class="list__body">
          </form>
        </div>
        <!-- 通用 -->
        <div class="list">  
          <form class="list__body" action="javascript:void(0);">
            ${menu2.map(item => label(item)).join('')}
          </form>
        </div>
        <!-- 间隔 -->
        <div class="list">
          <form class="list__body">
          </form>
        </div>
        <!-- 组件预览 -->  
        <div class="list">
          <form class="list__body" action="javascript:void(0);">
            ${label({ id: 'preview', imgSrc: `${rootUrl}img/symbol/preview.png`, title: '预览组件' })}
          </form>
        </div>
      `
    };
    
    // 二级菜单
    const secondMenu = async () => {
      return `
      <!-- 间隔 -->
      <div class="list">
        <form class="list__body">
        </form>
      </div>
      <!-- 颜色设置 -->  
      <div class="list">
        <form class="list__body" action="javascript:void(0);">
          <label id='reset' class="form-item form-item--link">
            <div class="form-label">
              <img class="form-label-img" src="${rootUrl}img/symbol/reset.png"/>
              <div class="form-label-title">重置所有</div>
            </div>
            <div class="form-label">
              <i class="iconfont icon-arrow_right"></i>
            </div>
          </label>
        </form>
        <div class="list__header">
          设置
        </div>
      </div>
      `
    };
    
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
      
      const reset = () => {
        for ( const item of formItems ) {
          const el = document.querySelector(\`.form-item__input[name="\${item.name}"]\`)
          formData[item.name] = item.default;
          if ( item.type === 'switch' ) {
            el.checked = item.default
          } else {
            el && (el.value = item.default);
          }
        }
        invoke('remove', formData);
      }
      document.getElementById('reset').addEventListener('click', () => reset())
      
      
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
      
      /** 点击事件 loading **/  
      const toggleLoading = (e) => {
        const target = e.currentTarget;
        const { id } = target;
        target.classList.add('loading');
        const icon = target.querySelector('.iconfont');
        const className = icon.className;
        icon.className = 'iconfont icon-loading';
          
        if (['reset', 'clearCache', 'telegram'].includes(id)) {
          setTimeout(() => {
            target.classList.remove('loading');
            icon.className = className;
          }, 800);
        };
          
        const listener = (event) => {
          if (event.detail.code === 'finishLoading') {
            target.classList.remove('loading')
            icon.className = className;
            window.removeEventListener('JWeb', listener);
          }
        };
        window.addEventListener('JWeb', listener);
      };
      
      for (const btn of document.querySelectorAll('.form-item')) {
        btn.addEventListener('click', (e) => {
          toggleLoading(e);
          const { id } = e.currentTarget;
          invoke(id, window[id]);
        });
      }
  
      document.getElementById('store').addEventListener('click', () => {
        invoke('store');
      });
      
      /** toggle button **/
      const handleInputChange = (element, property) => {
        element.checked = settings[property] ?? true
        element.addEventListener('change', (e) => {
          formData[property] = e.target.checked
          invoke('changeSettings', formData)
        })
      };
      const inputs = {
        update: handleInputChange(document.querySelector('input[name="update"]'), 'update'),
        ios: handleInputChange(document.querySelector('input[name="ios"]'), 'ios')
      };
    })()`;
    
    /**
     * @param {string} style
     * @param {string} themeColor
     * @param {string} avatar
     * @param {string} popup
     * @param {string[]} jsPaths
     * @param {string} js
     * @returns {string} html
     */
    const html = `
    <html>
      <head>
        <meta name='viewport' content='width=device-width, user-scalable=no, viewport-fit=cover'>
        <link rel="stylesheet" href="https://at.alicdn.com/t/c/font_3772663_kmo790s3yfq.css" type="text/css">
        <style>${style}</style>
      </head>
      <body class="${themeColor}-theme nav-fixed site-layout-1">
        ${title === 'main' ? await mainMenu() : await secondMenu()}
        <!-- 偏好设置 -->
        <div class="list">
          <form id="form" class="list__body" action="javascript:void(0);">
          </form>
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
        dismissLoading(webView);
      });
      
      const { code, data } = event;
      if (code == 'clearCache' && fm.fileExists(cache)) {
        fm.remove(cache);
      } else if (code == 'remove' && fm.fileExists(getSettingPath())) {
        fm.remove(getSettingPath());
      };
      
      switch (code) {
        case 'changeSettings':
          Object.assign( settings, data );
          writeSettings(settings);
          break;
        case 'preview':
          await importModule(await webModule('12123.js', 'https://gitcode.net/4qiao/scriptable/raw/master/table/12123.js')).main();
          dismissLoading(webView);
          break;
        case 'itemClick':
          if (data.menu === 'page') {
            const item = (() => {
              const find = (i) => {
                for (const el of i) {
                  if (el.name === data.name) return el;
                }
                return null;
              };
              return find(formItems);
            })();
            await renderAppView(item, false, { settings });
          } else {
            await onItemClick?.(data, { settings });
          }
          dismissLoading(webView);
          break;
        case 'store':
          await importModule(await webModule('store.js', 'https://gitcode.net/4qiao/scriptable/raw/master/vip/main95duStore.js')).main();
          break;
        case 'install':
          const script = await new Request(scriptUrl).loadString();
          const fm = FileManager.iCloud();
          fm.writeString(fm.documentsDirectory() + `/${scriptName}.js`, script);
          Safari.open(`scriptable:///run/${encodeURI(scriptName)}`);
          break;
        case 'login':
          await importModule(await webModule('store.js', 'https://gitcode.net/4qiao/scriptable/raw/master/vip/main95duStore.js')).main();
          dismissLoading(webView);
          break;
        case 'telegram':
          Safari.openInApp('https://t.me/+ViT7uEUrIUV0B_iy', false);
          break;
      }
      injectListener();
    };
    
    injectListener().catch((e) => {
      console.error(e);
      throw e
    });
    await webView.present();
  }


  // ======= Initial ========= //
  const init = {
    textColorLight: '#34C579',
    darkColor: '#FFFFFF',
    lightColor: "#333333",
    indexLightColor: '#3F8BFF',
    indexDarkColor: '#FF9500',
    gradient: '#BE7DFF'
  };

  await renderAppView({
    title: 'main',
    formItems: [
      {
        name: "preference",
        label: "偏好设置",
        type: 'cell',
        icon: {
          name: 'gearshape.fill',
          color: '#FF3B2F'
        },
        menu: 'page',
        formItems: [
          {
            name: "lightColor",
            label: "文字颜色（白天）",
            type: "color",
            icon: 'https://gitcode.net/4qiao/framework/raw/master/img/symbol/refresh.png',
            default: init.lightColor
          },
          {
            name: "darkColor",
            label: "文字颜色（夜间）",
            type: "color",
            icon: {
              name: 'textformat',
              color: '#938BF0'
            },
            default: init.darkColor
          },
          {
            name: 'textColorLight',
            label: "图标颜色（白天）",
            type: 'color',
            icon: {
              name: 'gearshape.fill',
              color: '#FF3B2F'
            },
            default: init.textColorLight
          },
          {
            name: "indexLightColor",
            label: "标题颜色（白天）",
            type: "color",
            icon: {
              name: 'externaldrive.fill',
              color: '#F9A825'
            },
            default: init.indexLightColor
          },
          {
            name: "indexDarkColor",
            label: "标题颜色（夜间）",
            type: "color",
            icon: {
              name: 'applelogo',
              color: '#00BCD4'
            },
            default: init.indexDarkColor
          },
          {
            name: "loopSwitch",
            label: "渐变背景",
            type: "color",
            icon: 'https://gitcode.net/4qiao/framework/raw/master/img/symbol/transparent.png',
            default: init.gradient
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
        onItemClick: async (
          item
        ) => {
          const { name } = item;
          if (name === 'message') {
            await importModule(await webModule('store.js', 'https://gitcode.net/4qiao/scriptable/raw/master/vip/main95duStore.js')).main();
          }
        }
      }
    ]
  });
}
module.exports = { main }