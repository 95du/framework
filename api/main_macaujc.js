// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: cog;

async function main() {
  const uri = Script.name();
  const scriptName = '澳门六合彩'
  const version = '1.0.2'
  const updateDate = '2023年05月18日'
  
  const rootUrl = atob('aHR0cHM6Ly9naXRjb2RlLm5ldC80cWlhby9mcmFtZXdvcmsvcmF3L21hc3Rlci8=');
  
  const [scrName, scrUrl] = ['macaujc.js', 'https://gitcode.net/4qiao/scriptable/raw/master/table/macaujc.js'];


  /**
   * 创建，获取存储路径
   * @returns {string} - string
   */
  const fm = FileManager.local();
  const mainPath = fm.joinPath(fm.documentsDirectory(), '95du_macaujc');
  
  const getSettingPath = () => {
    if (!fm.fileExists(mainPath)) {
      fm.createDirectory(mainPath);
    }
    return fm.joinPath(mainPath, 'setting.json');
  };

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
   * 读取储存的设置
   * @param {string} file - JSON
   * @returns {object} - JSON
   */
  const DEFAULT_SETTINGS = {
    version,
    refresh: 20,
    transparency: 0.5,
    masking: 0.3,
    picture: [],
    update: true,
    topStyle: true,
    music: true,
    textLightColor: '#34C759',
    textDarkColor: '#FF9500',
    titleLightColor: '#000000',
    gradient: '#BCBBBB',
    bufferTime: 240
  };
  
  const getSettings = (file) => {
    if (fm.fileExists(file)) {
      return JSON.parse(fm.readString(file));
    } else {
      settings = DEFAULT_SETTINGS;
      writeSettings(settings);
    }
    return settings;
  };
  settings = await getSettings(getSettingPath());
  
  // refresh time
  if (settings.refresh) {  
    const widget = new ListWidget();
    widget.refreshAfterDate = new Date(Date.now() + 1000 * 60 * Number(settings.refresh));
  }
  
  /**
   * 获取背景图片存储目录路径
   * @returns {string} - 目录路径
   */
  const getBgImage = () => {
    const bgPath = fm.joinPath(fm.documentsDirectory(), '95duBackground');
    return fm.joinPath(bgPath, Script.name() + '.jpg');
  };
  
  // 获取头像图片
  const getAvatarImg = () => {
    const avatarImgPath = fm.joinPath(fm.documentsDirectory(), '95du_macaujc');
    return fm.joinPath(avatarImgPath, 'userSetAvatar.png');
  };
  
  /**
   * 弹出一个通知
   * @param {string} title
   * @param {string} body
   * @param {string} url
   * @param {string} sound
   */  
  const notify = async (title, body, url, opts = {}) => {
    const n = Object.assign(new Notification(), { title, body, sound: 'piano_', ...opts });
    if (url) n.openURL = url;
    return await n.schedule();
  };
  
  /**
   * 指定模块页面
   * @param { string } time
   * @param { string } color
   * @param { string } module
   */
  const webModule = async (scriptName, url) => {
    const modulePath = fm.joinPath(mainPath, scriptName);
    if (settings.update === false && await fm.fileExists(modulePath)) {
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
  
  if (config.runsInWidget) {
    if ( version !== settings.version && settings.update === false ) {
      notify(scriptName, `新版本更新 Version ${version}  ( 可开启自动更新 )`);
      settings.version = version;
      writeSettings(settings);
    };
    await importModule(await webModule(scrName, scrUrl)).main();  
    return null;
  };
  
  /**
   * 版本更新时弹出窗口
   * @returns {String} string
   */
  const updateVersionNotice = () => {
    const newVersion = version !== settings.version ? '.signin-loader' : undefined;
    if (newVersion) {
      settings.version = version;
      writeSettings(settings);
    }
    return newVersion;
  };
  
  /**
   * Download Update Script
   * @param { string } string
   */
  const updateVersion = async () => {
    const index = await generateAlert(
      title = '更新代码',
      message = '更新后当前脚本代码将被覆盖\n但不会清除用户已设置的数据\n如预览组件未显示或桌面组件显示错误，可更新尝试自动修复',
      options = ['取消', '确认']
    );
    if (index == 0) return;
    await updateString();
  };
  
  const updateString = async () => {
    const modulePath = fm.joinPath(mainPath, scrName);
    const reqUpdate = new Request(scrUrl);
    const codeString = await reqUpdate.loadString();
    if (codeString.indexOf('95度茅台') == -1) {
      notify('更新失败 ⚠️', '请检查网络或稍后再试');
    } else {
      fm.writeString(modulePath, codeString);
      Safari.open('scriptable:///run/' + encodeURIComponent(uri));
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
    return toBase64(sfSymbolImg);
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
      const canvas = document.createElement("canvas");
      const sourceImg = document.getElementById("sourceImg");
      const silhouetteImg = document.getElementById("silhouetteImg");
      const ctx = canvas.getContext('2d');
      const size = sourceImg.width > sourceImg.height ? sourceImg.width : sourceImg.height;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(sourceImg, (canvas.width - sourceImg.width) / 2, (canvas.height - sourceImg.height) / 2);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pix = imgData.data;
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
   * 弹出输入框
   * @param title 标题
   * @param desc  描述
   * @param opt   属性
   * @returns { Promise<void> }
   */
  const generateInputAlert = async (options, confirm) => {  
    const inputAlert = new Alert();
    inputAlert.title = options.title;
    inputAlert.message = options.message;
    const fieldArr = options.options;
    for (const option of fieldArr) {
      inputAlert.addTextField(
        option.hint,
        option.value
      );
    }
    inputAlert.addAction('取消');
    inputAlert.addAction('确认');
    let getIndex = await inputAlert.presentAlert();
    if (getIndex == 1) {
      const inputObj = [];
      fieldArr.forEach((index) => {
        let value = inputAlert.textFieldValue(index);
        inputObj.push({index, value});
      });
      confirm(inputObj);
    }
    return getIndex;
  };
  
  /**
   * @param message 内容
   * @param options 按键
   * @returns { Promise<number> }
   */
  const generateAlert = async (title, message, options) => {
    let alert = new Alert();
    alert.title = title
    alert.message = message
    for (const option of options) {
      alert.addAction(option)
    }
    return await alert.presentAlert();
  };
  
  /**
   * 获取css及js字符串和图片并使用缓存
   * @param {string} File Extension
   * @param {Image} Base64 
   * @returns {string} - Request
   */
  const cache = fm.joinPath(mainPath, 'cache_path');
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
    const cache = useFileManager({ cacheTime: settings.bufferTime });
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
  
  const getCacheImage = async (name, url) => {
    const cache = useFileManager();
    const image = cache.readImage(name);
    if ( image ) {
      return image;
    }
    const img = await getImage(url);
    cache.writeImage(name, img);
    return img;
  };
  
  const toBase64 = async (img) => {
    return `data:image/png;base64,${Data.fromPNG(img).toBase64String()}`
  };
  
  
  // 测试登录
  const getCookie = async () => {  
    const webView = new WebView();  
    await webView.loadURL('https://plogin.m.jd.com/login/login?appid=300&returnurl=https%3A%2F%2Fwqs.jd.com%2Fmy%2Faccountv2.shtml%3Fsceneval%3D2%26jxsid%3D16323729562173504755%26ptag%3D7155.1.2&source=wq_passport');
    await webView.present(false);
    const req = new Request('https://ms.jr.jd.com/gw/generic/bt/h5/m/firstScreenNew',);
    req.method = 'POST';
    req.body = `{ clientType: ios }`
    await req.loadJSON();
    const cookies = req.response.cookies;
    const cookie = [];
    cookies.forEach((item) => {
      const value = `${item.name}=${item.value}`;
      if (item.name === 'pt_key')
        cookie.push(value);
      if (item.name === 'pt_pin')
        cookie.push(value);
    });
    
    const sign = new Request('https://api.m.jd.com/client.action?functionId=signBeanAct&appid=ld')
    sign.method = 'POST'
    sign.headers = { Referer: 'https://h5.m.jd.com/' }
    const { code } = await sign.loadJSON()
    if (code === '0') {
      return new Promise(resolve => {
        settings.cookie = cookie.join(';')
        notify('Cookie获取/更新成功', settings.cookie)
        writeSettings(settings)
        resolve('已登录')
      })
    }
  };

  
  // ====== web start ======= //
  
  const renderAppView = async (options) => {
    const {
      formItems = [],
      head,
      $ = 'https://www.imarkr.com',
      avatarInfo,
      previewImage
    } = options;
    
    
    // themeColor
    const [themeColor, logoColor] = Device.isUsingDarkAppearance() ? ['dark', 'white'] : ['white', 'black'];

    const appleHub = await toBase64(await getCacheImage(
      `${logoColor}.png`,
      `${rootUrl}img/picture/appleHub_${logoColor}.png`
    ));
    
    const authorAvatar = await toBase64(fm.fileExists(getAvatarImg()) ? fm.readImage(getAvatarImg()) : await getCacheImage(
      'author.png',
      `${rootUrl}img/icon/4qiao.png`
    ));
    
    const scripts = ['jquery.min.js', 'bootstrap.min.js', 'loader.js'];
    const scriptTags = await Promise.all(scripts.map(async (script) => {
      const content = await getCacheString(script, `${rootUrl}web/${script}`);
      return `<script>${content}</script>`;
    }));
    
    for (const i of formItems) {
      for (const item of i.items) {
        const { icon } = item;
        if (icon.name) {
          const {name, color} = icon;
          item.icon = await loadSF2B64(name, color);
        } else if (icon.startsWith('http')) {
          const name = decodeURIComponent(icon.substring(icon.lastIndexOf("/") + 1));
          const image = await getCacheImage(name, icon);
          item.icon = await toBase64(image);
        }
      }
    };
    
    /**
     * @param {string} style
     * @param {string} themeColor
     * @param {string} avatar
     * @param {string} popup
     * @param {string} js
     * @returns {string} html
     */
    const cssStyle = await getCacheString('cssStyle.css', `${rootUrl}web/style.css`);  
    
    const style =`  
    :root {
      --color-primary: #007aff;
      --divider-color: rgba(60,60,67,0.36);
      --card-background: #fff;
      --card-radius: 10px;
      --list-header-color: rgba(60,60,67,0.6);
    }
    ${cssStyle}`;
    
    //
    const js =`
    (() => {
    const settings = ${JSON.stringify({
      ...settings
    })}
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
    const createFormItem = (item) => {
      const value = settings[item.name] ?? item.default ?? null
      formData[item.name] = value;
      const label = document.createElement("label");
      label.className = "form-item";
      label.dataset.name = item.name;
      
      const div = document.createElement("div");
      div.className = 'form-label';
      label.appendChild(div);
      
      if ( item.icon ) {
        const img = document.createElement("img");
        img.src = item.icon;
        img.className = 'form-label-img';
        div.appendChild(img);
      }
          
      const divTitle = document.createElement("div");
      if ( item.icon ) {
        divTitle.className = 'form-label-title';
      }
      divTitle.innerText = item.label;
      div.appendChild(divTitle);
      
      if (item.type === 'select') {
        const select = document.createElement('div');
        select.classList.add('form-item__input__select');
        const input = document.createElement('select');
        input.name = item.name;
        input.value = value;
        input.classList.add('select-input');
        
        for (const opt of (item.options || [])) {
          const option = document.createElement('option');
          option.value = opt.value;
          option.innerText = opt.label;
          option.selected = value === opt.value;
          input.appendChild(option);
        }
        input.addEventListener('change', (e) => {
          formData[item.name] = e.target.value;
          invoke('changeSettings', formData);
        })
        
        const icon = document.createElement('i');
        icon.className = 'iconfont icon-arrow_right form-item__icon';
        select.appendChild(input);
        select.appendChild(icon);
        label.appendChild(select);
      } else if (
        item.type === 'cell' || item.type === 'page') {
        if ( item.desc ) {
          const desc = document.createElement("div");
          desc.className = 'form-item-right-desc';
          desc.innerText = item.desc;
          label.appendChild(desc);
        }
        
        label.classList.add('form-item--link');
        const icon = document.createElement('i');
        icon.className = 'iconfont icon-arrow_right'
        label.appendChild(icon);
        label.addEventListener('click', (e) => {
          const { name } = item;
          const methodName = name === 'preference' || name === 'infoPage' ? 'itemClick' : name;
          invoke(methodName, item);
        });
      } else if (item.type === 'number') {
        const inputCntr = document.createElement("div");
        inputCntr.className = 'form-item__input-container'
  
        const input = document.createElement("input");
        input.className = 'form-item__input'
        input.name = item.name
        input.type = 'number'
        input.value = Number(value)
        input.addEventListener("change", (e) => {
          formData[item.name] = Number(e.target.value);
          invoke('changeSettings', formData);
        });
        inputCntr.appendChild(input);
  
        const icon = document.createElement('i');
        icon.className = 'iconfont icon-arrow_right form-item__icon'
        inputCntr.appendChild(icon);
        label.appendChild(inputCntr);
      } else {
        const input = document.createElement("input")
        input.className = 'form-item__input'
        input.name = item.name
        input.type = item.type
        input.enterKeyHint = 'done'
        input.value = value
        
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
      return label
    };
  
    const createList = (list, title) => {
      const fragment = document.createDocumentFragment()
  
      let elBody;
      for (const item of list) {
        if (item.type === 'group') {
          const grouped = createList(item.items, item.label)
          fragment.appendChild(grouped)
        } else {
          if (!elBody) {
            const groupDiv = fragment.appendChild(document.createElement('div'))
            groupDiv.className = 'list'
            if (title) {
              const elTitle = groupDiv.appendChild(document.createElement('div'))
              elTitle.className = 'list__header'
              elTitle.textContent = title
            }
            elBody = groupDiv.appendChild(document.createElement('div'))
            elBody.className = 'list__body'
          }
          const label = createFormItem(item)
          elBody.appendChild(label)
        }
      }
      return fragment
    };
    const fragment = createList(formItems);
    document.getElementById('settings').appendChild(fragment);
    
    /** loading **/
    const toggleLoading = (e) => {
      const target = e.currentTarget;
      target.classList.add('loading')
      const icon = target.querySelector('.iconfont');
      const className = icon.className;
      icon.className = 'iconfont icon-loading';
          
      const listener = (event) => {
        if (event.detail.code) {
          target.classList.remove('loading');
          icon.className = className;
          window.removeEventListener(
            'JWeb', listener
          );
        }
      };
      window.addEventListener('JWeb', listener);
    };
    
    document.querySelectorAll('.form-item').forEach((btn) => {
      btn.addEventListener('click', (e) => { toggleLoading(e) });
    });
    document.getElementById('store').addEventListener('click', () => {
      invoke('store');
    });
      
document.getElementById('install').addEventListener('click', () => {
      invoke('install');
    });
    
  })()`;
  
  
    // 主菜单头像信息
    const mainMenuTop = async () => {
      const avatar = `
      <div class="avatarInfo">
        <span class="signin-loader">
          <img src="${authorAvatar}" class="avatar"/>
        </span>
        <div class="interval"></div>
        <img id="hubImg" src="${appleHub}" class="custom-img"><br>
        <a class="display-name" id="store">组件商店</a>
      </div>
      `
      
      const popup = `      
      <div class="modal fade" id="u_sign" role="dialog">
        <div class="modal-dialog">
          <div class="sign zib-widget blur-bg relative">
            <div class="box-body sign-logo">
              <img src="${appleHub}" class="lazyload">
            </div>
            <div class="box-body">
              <div class="title-h-center fa-2x popup-title">
                ${scriptName}
              </div>
              <a class="muted-color px30 display-name-container">
                <div class="update-content">Version ${version}</div></a>
              <br />
              <div class="form-label-title"> <li>${updateDate}&nbsp;🔥</li> <li>修复已知问题</li> <li>性能优化，改进用户体验</li>
              </div>
            </div>
            <div class="box-body">
              <div id="sign-in">
                <button id="install" type="button" class="but radius jb-yellow padding-lg btn-block">
                  立即更新
                </button>
              </div>
            </div>
            <p class="social-separator separator separator-center">95度茅台</p>
          </div>
        </div>
      </div>
      <script type="text/javascript">
        setTimeout(function() {
          $('${updateVersionNotice()}').click();
        }, 1200);
        window._win = { uri: 'https://zibll.com/wp-content/themes/zibll', qj_loading: '1' };
      </script>
      `
      
      const songId = [
        '8fk9B72BcV2',
        '8duPZb8BcV2',
        '8fAWh80BcV2',
        '8t84tf5BcV2'
      ];
      const randomId = songId[Math.floor(Math.random() * songId.length)];
      const music = `
      <iframe data-src="https://t1.kugou.com/song.html?id=${randomId}" class="custom-iframe" frameborder="0" scrolling="auto">
      </iframe>
      <script>
        const iframe = document.querySelector('.custom-iframe');
        iframe.src = iframe.getAttribute('data-src');
      </script>`;
      
      return `
        ${avatar}
        ${settings.music === true ? music : ''}
        <!-- 弹窗 -->
        ${popup}
        ${scriptTags.join('\n')}
      `
    };
    
    // 组件效果图
    const previewImgUrl = [
      'http://mtw.so/5LXCZT',
      'http://mtw.so/5SNSCU'
    ];
    
    if (settings.topStyle) {
      const previewImgs = await Promise.all(previewImgUrl.map(async (item) => {
        const imgName = decodeURIComponent(item.substring(item.lastIndexOf("/") + 1));
        const previewImg = await toBase64(await getCacheImage(imgName, item));
        return previewImg;
      }));
      previewImgHtml = `
      <div id="scrollBox">
        <div id="scrollImg">
          ${previewImgs.map(img => `<img src="${img}">`).join('')}
        </div>
      </div>
      <div class="popup" id="store">
        <p>Good Luck</p>
      </div>
      <script>
        const popupTips = document.getElementById("store").classList;
        setTimeout(() => popupTips.add("show", "fd"), 1000);
        setTimeout(() => {
          popupTips.remove("fd");
          setTimeout(() => popupTips.remove("show"), 1500);
        }, 3500);
      </script>`; 
    } else {
      const randomUrl = previewImgUrl[Math.floor(Math.random() * previewImgUrl.length)];
      const imgName = decodeURIComponent(randomUrl.substring(randomUrl.lastIndexOf("/") + 1));
      const previewImg = await toBase64(await getCacheImage(imgName, randomUrl));
      previewImgHtml = `<img id="store" src="${previewImg}" class="preview-img">`;
    };
    
    // 
    const html =`
    <html>
      <head>
        <meta name='viewport' content='width=device-width, user-scalable=no, viewport-fit=cover'>
        <link rel="stylesheet" href="//at.alicdn.com/t/c/font_3772663_kmo790s3yfq.css" type="text/css">
        <style>${style}</style>
      </head>
      <body class="${themeColor}-theme nav-fixed site-layout-1">
        ${avatarInfo ? await mainMenuTop() : previewImage ? previewImgHtml : ''}
        ${head || ''}
        <section id="settings">
        </section>
        <script>${js}</script>
      </body>
    </html>`;
  
    const webView = new WebView();
    await webView.loadHTML(html, $);
    
    // 重置所有
    const removeData = async () => {
      const delAlert = new Alert();
      delAlert.title = '清空所有数据';
      delAlert.message = '该操作将把用户储存的所有数据清除，重置后等待5秒组件初始化并缓存数据';
      delAlert.addDestructiveAction('重置');
      delAlert.addCancelAction('取消')
      const action = await delAlert.presentAlert();
      if ( action == 0 ) {
        fm.remove(mainPath);
        Safari.open('scriptable:///run/' + encodeURIComponent(uri));
      }
    };
    
    // 清除缓存
    const clearCache = async () => {
      const action = await generateAlert(
        title = '清除缓存',
        message = '是否确定删除所有缓存？\n离线内容及图片均会被清除。',
        options = ['取消', '清除']
      );
      if (action == 1) {
        fm.remove(cache);
        notify('清除成功', '正在重新获取数据，请耐心等待 5 秒。');  
        Timer.schedule(1500, false, () => { Safari.open('scriptable:///run/' + encodeURIComponent(uri)) });
      }
    };
    
    /**
     * Input window
     * @param data
     * @returns {Promise<string>}
     */
    const input = async ({ label, message, name } = data) => {
      return new Promise(resolve => {
        generateInputAlert({
          title: label,
          message: message,
          options: [
            {
              hint: String(settings[name]),
              value: String(settings[name])
            }
          ]
        },
        async ([{ value }]) => {
          const result = /^\d+$/.test(value) ? settings[name] = Number(value) : settings[name];
          writeSettings(settings);
          resolve(result);
        })
      })
    };
      
    /**
     * 修改特定 form 表单项的文本
     * @param {string} fieldName
     * @param {string} newText
     * @param {WebView} webView
     */
    const updateFormText = async (fieldName, newText) => {
      webView.evaluateJavaScript(
        `const div = document.querySelector('.form-item[data-name="${fieldName}"] .form-item-right-desc');
        div.innerText = ${JSON.stringify(newText)}`
      )
    };
    
    // 注入监听器
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
      if (code === 'clearCache' && fm.fileExists(cache)) {
        await clearCache();
      } else if (code === 'reset' && fm.fileExists(mainPath)) {
        await removeData();
      } else if (code === 'updateCode') {
        await updateVersion();
      } else if (code === 'login') {
        updateFormText('login', await getCookie());
      } else if (code === 'bufferTime') {
        updateFormText('bufferTime', await input(data));
      };
      
      switch (code) {
        case 'setAvatar':
          const avatar = await Photos.fromLibrary();
          fm.writeImage(
            getAvatarImg(), avatar
          );
          Safari.open('scriptable:///run/' + encodeURIComponent(uri));
          break;
        case 'telegram':
          Safari.openInApp('https://t.me/+CpAbO_q_SGo2ZWE1', false);  
          break;
        case 'changeSettings':
          Object.assign(settings, data);
          writeSettings(settings);
          break;
        case 'preview':
          await importModule(await webModule(scrName, scrUrl)).main();
          break;
        case 'chooseBgImg':
          const image = await Photos.fromLibrary();
          await fm.writeImage(getBgImage(), image);
          notify('设置成功', '桌面组件稍后将自动刷新');
          break;
        case 'clearBgImg':
          const bgImagePath = fm.fileExists(getBgImage());
          if ( bgImagePath ) {
            fm.remove(getBgImage());
            notify('已删除背景图', '桌面组件稍后将自动刷新');
          }
          break;
        case 'background':
          await importModule(await webModule('background.js', 'https://gitcode.net/4qiao/scriptable/raw/master/vip/mainTableBackground.js')).main();
          break;
        case 'store':
          await importModule(await webModule('store.js', 'https://gitcode.net/4qiao/scriptable/raw/master/vip/main95duStore.js')).main();
          break;
        case 'install':
          await updateString();
          break;
        case 'version':
          await generateAlert(
            title = '点击头像查看',
            message = code.message,
            options = ['完成']
          );
          break;
        case 'itemClick':
          if (data.type === 'page') {
            const item = (() => {
              const find = (i) => {
                for (const el of i) {
                  if (el.name === data.name) return el
                  if (el.type === 'group') {
                    const r = find(el.items);
                    if (r) return r
                  }
                }
                return null
              };
              return find(formItems)
            })();
            await renderAppView(item, false, { settings });
          } else {
            await onItemClick?.(data, { settings });
          }
          break;
      };
      // Remove Event Listener
      if ( event ) {
        webView.evaluateJavaScript(
          "window.dispatchEvent(new CustomEvent('JWeb', { detail: { code: 'finishLoading' } }))",
          false
        );
      };
      await injectListener();
    };
  
    injectListener().catch((e) => {
      console.error(e);
    });
    await webView.present();
  };
  
  
  // 用户菜单
  const userMenu = (() => {
    const formItems = [
      {
        type: 'group',
        items: [
          {
            label: '图片轮播',
            name: 'topStyle',
            type: 'switch',
            icon: {
              name: 'photo.tv',
              color: '#FF9500'
            },
            default: true
          },
          {
            label: '缓存时间',
            name: 'bufferTime',
            type: 'cell',
            icon: {
              name: 'clock',
              color: '#0096FF'
            },
            message: '设置缓存离线内容及图片的时长\n( 单位: 小时 )',
            desc: settings.bufferTime
          },
          {
            label: '用户登录',
            name: 'login',
            type: 'cell',
            icon: {
              name: 'person.crop.circle',
              color: '#43CD80'
            },
            desc: settings.cookie ? '已登录' : '未登录'
          }
        ]
      }
    ];
    return formItems;
  })();
  
  // 设置菜单
  const settingMenu = (() => {
    const formItems = [
      {
        label: '设置',
        type: 'group',
        items: [
          {
            name: "textLightColor",
            label: "文字白天",
            type: "color",
            icon: `${rootUrl}img/symbol/title.png`
          },
          {
            name: "textDarkColor",
            label: "文字夜间",
            type: "color",
            icon: {
              name: 'textformat',
              color: '#938BF0'
            }
          },
          {
            name: "titleLightColor",
            label: "标题颜色",
            type: "color",
            icon: {
              name: 'checklist',
              color: '#F9A825'
            }
          },
          {
            name: "gradient",
            label: "渐变背景",
            type: "color",
            icon: `${rootUrl}img/symbol/gradient.png`
          }
        ]
      },
      {
        type: 'group',
        items: [
          {
            label: '刷新时间',
            name: 'refresh',
            type: 'number',
            icon: `${rootUrl}img/symbol/refresh.png`
          },
          {
            label: '渐变方向',
            name: 'angle',
            type: 'select',
            icon: `${rootUrl}img/symbol/gradientBackground.png`,
            options: [
              { 
                label: '由上往下',
                value: 'topBottom'
              },
              {
                label: '由下往上',
                value: 'bottomTop'
              }
            ]
          },
          {
            label: '渐变透明',
            name: 'transparency',
            type: 'number',
            id: 'input',
            icon: `${rootUrl}img/symbol/masking.png`
          },
          {
            label: '透明背景',
            name: 'background',
            type: 'cell',
            icon: `${rootUrl}img/symbol/transparent.png`
          },
          {
            label: '遮罩透明',
            name: 'masking',
            type: 'number',
            id: 'input',
            icon: `${rootUrl}img/symbol/photo_9D64FF.png`
          },
          {
            label: '图片背景',
            name: 'chooseBgImg',
            type: 'cell',
            icon: `${rootUrl}img/symbol/bgImage.png`
          },
          {
            label: '清除背景',
            name: 'clearBgImg',
            type: 'cell',
            icon: `${rootUrl}img/symbol/clearBg.png`,
            desc: fm.fileExists(getBgImage()) ? '已设置' : ''
          }
        ]
      },
      {
        type: 'group',
        items: [
          {
            label: '自动更新',
            name: 'update',
            type: 'switch',
            icon: `${rootUrl}img/symbol/update.png`,
            default: true
          },
          {
            label: '背景音乐',
            name: 'music',
            type: 'switch',
            icon: {
              name: 'music.note',  
              color: '#FF6800'
            },
            default: true
          }
        ]
      }
    ];
    return formItems;
  })();
  
  // 主菜单
  await renderAppView({
    avatarInfo: true,
    formItems: [
      {
        type: 'group',
        items: [
          {
            label: '设置头像',
            name: 'setAvatar',
            type: 'cell',
            icon: `${rootUrl}img/icon/camera.png`
          },
          {
            label: 'Telegram',
            name: 'telegram',
            type: 'cell',
            icon: 'https://gitcode.net/4qiao/scriptable/raw/master/img/icon/NicegramLogo.png'
          }
        ]
      },
      {
        type: 'group',
        items: [
          {
            label: '重置所有',
            name: 'reset',
            type: 'cell',
            icon: `${rootUrl}img/symbol/reset.png`
          },
          {
            label: '清除缓存',
            name: 'clearCache',
            type: 'cell',
            icon: {
              name: 'arrow.triangle.2.circlepath',
              color: '#FF9500'
            }
          },
          {
            label: '组件信息',
            name: 'infoPage',
            type: 'page',
            icon: {
              name: 'person.crop.circle',
              color: '#43CD80'
            },
            formItems: userMenu,
            previewImage: true
          },
          {
            label: '偏好设置',
            name: 'preference',
            type: 'page',
            icon: {
              name: 'gearshape.fill',
              color: '#0096FF'
            },
            formItems: settingMenu
          }
        ]
      },
      {
        type: 'group',
        items: [
          {
            label: '预览组件',
            name: 'preview',
            type: 'cell',
            icon: `${rootUrl}img/symbol/preview.png`
          }
        ]
      },
      {
        type: 'group',
        items: [
          {
            name: "version",
            label: "组件版本",
            type: "cell",
            icon: {
              name: 'externaldrive.fill', 
              color: '#F9A825'
            },
            desc: version
          },
          {
            name: "updateCode",
            label: "更新代码",
            type: "cell",
            icon: `${rootUrl}img/symbol/update.png`
          }
        ]
      }
    ]
  }, true);
}
module.exports = { main }