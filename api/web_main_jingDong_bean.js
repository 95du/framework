// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: shopping-bag;

async function main() {
  const scriptName = '京东 ( 综合 )'
  const version = '1.0.0'
  const updateDate = '2023年11月06日'
  const pathName = '95du_jd_Bean';
  
  const rootUrl = atob('aHR0cHM6Ly9naXRjb2RlLm5ldC80cWlhby9mcmFtZXdvcmsvcmF3L21hc3Rlci8=');

  const [scrName, scrUrl] = ['jingDong_bean.js', 'https://gitcode.net/4qiao/scriptable/raw/master/table/web_jingDong_bean.js'];

  /**
   * 创建，获取存储路径
   * @returns {string} - string
   */
  const fm = FileManager.local();
  const mainPath = fm.joinPath(fm.documentsDirectory(), pathName);
  const settingPath = () => fm.joinPath(mainPath, 'setting.json')

  const getCachePath = (dirName) => {
    if (!fm.fileExists(mainPath)) fm.createDirectory(mainPath);
    const dirPath = fm.joinPath(mainPath, dirName);
    if (!fm.fileExists(dirPath)) fm.createDirectory(dirPath);
    return dirPath;
  };
  
  const [ cacheImg, cacheStr ] = [
    'cache_image',
    'cache_string'
  ].map(getCachePath);

  /**
   * 存储当前设置
   * @param { JSON } string
   */
  const writeSettings = async (settings) => {
    fm.writeString(settingPath(), JSON.stringify(settings, null, 4));
    console.log(JSON.stringify(
      settings, null, 2)
    );
  };
  
  /**
   * 读取储存的设置
   * @param {string} file - JSON
   * @returns {object} - JSON
   */
  const screenSize = Device.screenSize().height;
  const DEFAULT = {
    version,
    refresh: 20,
    gradient: [],
    masking: 0,
    update: true,
    topStyle: true,
    music: true,
    animation: true,
    appleOS: true,
    fadeInUp: 0.7,
    updateTime: Date.now(),
    solidColor: false,
    light: 0.7,
    dark: 0.6,
    radius: 50,
    cacheTime: 5,
    randomIndex: 0
  };
  
  const getSettings = (file) => {
    if (fm.fileExists(file)) {
      return JSON.parse(fm.readString(file));
    } else {
      const settings = DEFAULT;
      writeSettings(settings);
      return settings;
    }
  };
  settings = await getSettings(settingPath());
  
  // ScriptableRun
  const ScriptableRun = () => {
    Safari.open('scriptable:///run/' + encodeURIComponent(Script.name()));
  }
  
  // 预览组件
  const previewWidget = async () => {
    await importModule(await webModule(scrName, scrUrl)).main();
  }
  
  /**
   * 弹出通知
   * @param {string} title
   * @param {string} body
   * @param {string} url
   * @param {string} sound
   */
  const notify = async (title, body, url, opts = {}) => {
    const n = Object.assign(new Notification(), { title, body, sound: 'event', ...opts });
    if (url) n.openURL = url;
    return await n.schedule();
  };
  
  /**
   * 获取背景图片存储目录路径
   * @returns {string} - 目录路径
   */
  const getBgImage = () => {
    const bgImagePath = fm.joinPath(fm.documentsDirectory(), '95duBackground');
    return fm.joinPath(bgImagePath, Script.name() + '.jpg');
  };
  
  // 获取头像图片
  const getAvatarImg = () => {
    return fm.joinPath(cacheImg, 'userSetAvatar.png');
  };
  
  /**
   * 指定模块页面
   * @param { string } time
   * @param { string } color
   * @param { string } module
   */
  const webModule = async (scriptName, url) => {
    const modulePath = fm.joinPath(cacheStr, scriptName);
    if (!settings.update && fm.fileExists(modulePath)) {
      return modulePath;
    } else {
      const moduleJs = await getCacheString(scriptName, url);
      if (moduleJs) {
        return modulePath;
      }
    }
  };
  
  /** download store **/
  const myStore = async () => {
    const script = await getString('https://gitcode.net/4qiao/scriptable/raw/master/api/95duScriptStore.js');
    const fm = FileManager.iCloud();
    fm.writeString(
      fm.documentsDirectory() + '/95du_ScriptStore.js', script);
  };
  
  /**
   * 版本更新时弹出窗口
   * @returns {String} string
   */
  const updateVerPopup = () => {
    const creationDate = fm.creationDate(settingPath());
    if (creationDate) {
      isInitialized = Date.now() - creationDate.getTime() > 300000;
    }
    return settings.version !== version ? '.signin-loader' : (isInitialized && settings.loader !== '95du' ? '.signup-loader' : null);
  };
  
  /**
   * Download Update Script
   * @param { string } string
   * 检查苹果操作系统更新
   * @returns {Promise<void>}
   */
  const updateVersion = async () => {
    const index = await generateAlert(
      '更新代码',
      '更新后当前脚本代码将被覆盖\n但不会清除用户已设置的数据\n如预览组件未显示或桌面组件显示错误，可更新尝试自动修复',
      options = ['取消', '更新']
    );
    if (index === 0) return;
    await updateString();
  };
  
  const updateString = async () => {
    const modulePath = fm.joinPath(cacheStr, scrName);
    const codeString = await getString(scrUrl);
    if (!codeString.includes('95度茅台')) {
      notify('更新失败 ⚠️', '请检查网络或稍后再试');
    } else {
      fm.writeString(modulePath, codeString);
      settings.version = version;
      writeSettings(settings);
      ScriptableRun();
    }
  };
  
  const appleOS = async () => {
    const startHour = settings.startTime || 4;
    const endHour = settings.endTime || 6;
    const currentHour = new Date().getHours();

    if (settings.appleOS && currentHour >= startHour && currentHour <= endHour) {
      const html = await new Request(atob('aHR0cHM6Ly9kZXZlbG9wZXIuYXBwbGUuY29tL25ld3MvcmVsZWFzZXMvcnNzL3JlbGVhc2VzLnJzcw==')).loadString();
      const iOS = html.match(/<title>(iOS.*?)<\/title>/)[1];
      if (settings.push !== iOS) {
        notify('AppleOS 更新通知 🔥', '新版本发布: ' + iOS)
        settings.push = iOS
        writeSettings(settings);
      }
    }
  };
  
  /**
   * 获取css及js字符串和图片并使用缓存
   * @param {string} File Extension
   * @param {Image} Base64 
   * @returns {string} - Request
   */
  const useFileManager = ({ cacheTime } = {}) => {
    return {
      readString: (name) => {
        const filePath = fm.joinPath(cacheStr, name);  
        const fileExists =  fm.fileExists(filePath)
        if (fileExists && hasExpired(filePath) > cacheTime) {
          fm.remove(filePath);
          return null;
        }
        return fileExists ? fm.readString(filePath) : null;
      },
      writeString: (name, content) => fm.writeString(fm.joinPath(cacheStr, name), content),
      // cache image
      readImage: (name) => {
        const filePath = fm.joinPath(cacheImg, name);
        return fm.fileExists(filePath) ? fm.readImage(filePath) : null;
      },
      writeImage: (name, image) => fm.writeImage(fm.joinPath(cacheImg, name), image),
    };
    
    function hasExpired(filePath) {
      const createTime = fm.creationDate(filePath).getTime();
      return (Date.now() - createTime) / (60 * 60 * 1000)
    }
  };
  
  /**
   * 获取css，js字符串并使用缓存
   * @param {string} url
   */
  const getString = async (url) => {
    return await new Request(url).loadString();
  };
  
  const getCacheString = async (cssFileName, cssFileUrl) => {
    const cache = useFileManager({ cacheTime: 24 });
    const cssString = cache.readString(cssFileName);
    if (cssString) {
      return cssString;
    }
    const response = await getString(cssFileUrl);
    cache.writeString(cssFileName, response);
    return response;
  };
  
  /** 
   * toBase64(img) string
   * SFIcon蒙版后转base64
   */
  const toBase64 = (img) => {
    return `data:image/png;base64,${Data.fromPNG(img).toBase64String()}`
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
    if (image) {
      return toBase64(image);
    }
    const img = await getImage(url);
    cache.writeImage(name, img);
    return toBase64(img);
  };
  
  /**
   * Setting drawTableIcon
   * @param { Image } image
   * @param { string } string
   */  
  const getCacheMaskSFIcon = async (name, color) => {
    const cache = useFileManager();
    const image = cache.readImage(name);
    if ( image ) {
      return toBase64(image);
    }
    const img = await drawTableIcon(name, color);
    cache.writeImage(name, img);
    return toBase64(img);
  };
  
  // drawTableIcon
  const drawTableIcon = async (
    icon = name,
    color = '#ff6800',
    cornerWidth = 42
  ) => {
    let sfi = SFSymbol.named(icon);
    if (sfi === null) sfi = SFSymbol.named('message.fill');
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
   * drawSquare
   * @param { Image } image
   * @param { string } string
   */
  const drawSquare = async (img) => {
    const imgData = Data.fromPNG(img).toBase64String();
    const html = `
      <img id="sourceImg" src="data:image/png;base64,${imgData}" />
      <img id="silhouetteImg" src="" />
      <canvas id="mainCanvas" />`;
    const js = `
      const canvas = document.createElement("canvas");
      const sourceImg = document.getElementById("sourceImg");
      const silhouetteImg = document.getElementById("silhouetteImg");
      const ctx = canvas.getContext('2d');
      // 裁剪成正方形
      const size = Math.min(sourceImg.width, sourceImg.height);
      canvas.width = canvas.height = size;
      ctx.drawImage(sourceImg, (sourceImg.width - size) / 2, (sourceImg.height - size) / 2, size, size, 0, 0, size, size);
      
      // 压缩图像
      const maxFileSize = 200 * 1024
      const quality = Math.min(1, Math.sqrt(maxFileSize / (canvas.toDataURL('image/jpeg', 1).length * 0.75)));
      const compressedCanvas = document.createElement("canvas");
      const compressedCtx = compressedCanvas.getContext('2d');
      compressedCanvas.width = compressedCanvas.height = 400;
      compressedCtx.drawImage(canvas, 0, 0, size, size, 0, 0, 400, 400);
      
      silhouetteImg.src = canvas.toDataURL();
      output = compressedCanvas.toDataURL('image/jpeg', quality);
    `;
    
    const wv = new WebView();
    await wv.loadHTML(html);
    const base64Image = await wv.evaluateJavaScript(js);
    return await new Request(base64Image).loadImage();  
  };
  
  /**
   * SFIcon 转换为base64
   * @param {*} icon SFicon
   * @returns base64 string
   */
  const drawSFIcon = async ( icon = name ) => {
    let sf = SFSymbol.named(icon);
    if (sf === null) sf = SFSymbol.named('message');
    sf.applyFont(  
      Font.mediumSystemFont(30)
    );
    return sf.image;
  };
  
  // 缓存并读取原生 SFSymbol icon
  const getCacheDrawSFIcon = async (name) => {
    const cache = useFileManager();
    const image = cache.readImage(name);
    if ( image ) {
      return toBase64(image);
    }
    const img = await drawSFIcon(name);
    cache.writeImage(name, img);
    return toBase64(img);
  };
  
  /**
   * 弹出输入框
   * @param title 标题
   * @param desc  描述
   * @param opt   属性
   * @returns { Promise<void> }
   */
  const generateInputAlert = async (options, confirm) => {
    const { title, message, options: fieldArr } = options;
    const inputAlert = new Alert();
    inputAlert.title = title;
    inputAlert.message = message;
    fieldArr.forEach(({ hint, value }) => inputAlert.addTextField(hint, value))
    inputAlert.addAction('取消');
    inputAlert.addAction('确认');
    const getIndex = await inputAlert.presentAlert();
    if (getIndex === 1) {
      const inputObj = fieldArr.map(({ value }, index) => ({ index, value: inputAlert.textFieldValue(index) }));
      confirm(inputObj);
    }
    return getIndex;
  };
  
  /**
   * @param message 内容
   * @param options 按键
   * @returns { Promise<number> }
   */
  const generateAlert = async ( title, message = '', options, destructiveAction ) => {
    const alert = new Alert();
    alert.title = title;
    alert.message = message ?? '';
    options.forEach(option => {
      option === destructiveAction ? alert.addDestructiveAction(option) : alert.addAction(option);
    });
    return await alert.presentAlert();
  };
    
  /**
   * Widget 小组件逻辑
   * 处理版本更新、定时刷新以及预览和系统
   * @param {string} scriptName
   * @param {string} version
   */
  if (config.runsInWidget) {
    const hours = Math.floor((Date.now() - settings.updateTime) % (24 * 3600 * 1000) / (3600 * 1000));
    
    if (version !== settings.version && !settings.update && hours >= 12) {
      settings.updateTime = Date.now();
      writeSettings(settings);
      notify(`${scriptName}‼️`, `新版本更新 Version ${version}，新的组件框架`, 'scriptable:///run/' + encodeURIComponent(Script.name()));
    };
    
    await previewWidget();
    await appleOS();
    return null;
  };
  
  
  // ====== web start ======= //
  const renderAppView = async (options) => {
    const {
      formItems = [],
      avatarInfo,
      previewImage
    } = options;

    const logoColor = Device.isUsingDarkAppearance() ? 'white' : 'black';
    const appleHub = await getCacheImage(`${logoColor}.png`, `${rootUrl}img/picture/appleHub_${logoColor}.png`);

    const appImage = await getCacheImage('jingDong.png', `${rootUrl}img/icon/jd_green.png`);
    
    const authorAvatar = fm.fileExists(getAvatarImg()) ? await toBase64(fm.readImage(getAvatarImg()) ) : await getCacheImage('author.png', `${rootUrl}img/icon/4qiao.png`);
    
    const collectionCode = await getCacheImage('collection.png',`${rootUrl}img/picture/collectionCode.jpeg`);
    
    const clockScript = await getCacheString('clock.html', `${rootUrl}web/clock.html`);
    
    const scripts = ['jquery.min.js', 'bootstrap.min.js', 'loader.js'];
    const scriptTags = await Promise.all(scripts.map(async (script) => {
      const content = await getCacheString(script, `${rootUrl}web/${script}?ver=7.4.2`);
      return `<script>${content}</script>`;
    }));
    
    // SFSymbol url icons
    for (const i of formItems) {
      for (const item of i.items) {
        if ( item.item ) {
          for (const subItem of item.item) {
            subItem.icon = await getCacheDrawSFIcon(subItem.icon);
          }
        };
        const { icon } = item;
        if ( icon?.name ) {
          const {name, color} = icon;
          item.icon = await getCacheMaskSFIcon(name, color);
        } else if (icon?.startsWith('https')) {
          const name = decodeURIComponent(icon.substring(icon.lastIndexOf("/") + 1));
          item.icon = await getCacheImage(name, icon);
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
      --checkbox: #ddd;
      --list-header-color: rgba(60,60,67,0.6);
      --desc-color: #888;
      --typing-indicator: #000;
      --update-desc: hsl(0, 0%, 20%);
      --separ: var(--checkbox);
      --coll-color: hsl(0, 0%, 97%);
    }

    .modal-dialog {
      position: relative;
      width: auto;
      margin: ${screenSize < 926 ? (avatarInfo ? '62px' : '50px') : (avatarInfo ? '78px' : '65px')};
      top: ${screenSize < 926 ? (avatarInfo ? '-4.5%' : '-2%') : (avatarInfo ? '-8.5%' : '-4%')};
    }
    
    ${settings.animation ? `
    .list {
      animation: fadeInUp ${settings.fadeInUp}s ease-in-out;
    }` : ''}
    ${cssStyle}`;
    
    /**
     * 生成主菜单头像信息和弹窗的HTML内容
     * @returns {string} 包含主菜单头像信息、弹窗和脚本标签的HTML字符串
     */
    const mainMenuTop = async () => {
      const avatar = `
      <div class="avatarInfo">
        <span class="signup-loader">
          <img src="${authorAvatar}" class="avatar"/>
        </span>
        <a class="signin-loader"></a>
        <div class="interval"></div>
        <div class="loading-cont" onclick="switchDrawerMenu()">
          <img src="${appleHub}" class="custom-img" tabindex="0">
          <div class="loading-right"></div>
        </div>
        <div id="store">
          <a class="rainbow-text but">Script Store</a>
        </div>
      </div>
      <!-- 对话框 -->
      <div class="modal fade" id="u_sign" role="dialog">
        <div class="modal-dialog">
          <div class="zib-widget blur-bg relative">
            <a href="#tab-sign-up" data-toggle="tab"></a>
            <div class="box-body sign-logo" data-dismiss="modal" onclick="hidePopup()"><img src="${appleHub}"></div>
            <div class="tab-content">
              <!-- 版本信息 -->
              <div class="tab-pane fade active in" id="tab-sign-in">
                <div class="box-body">
                  <div href="#tab-sign-up" data-toggle="tab" class="fa-2x title-h-center popup-title">${scriptName}</div>
                  <a class="popup-content update-desc">
                     <div class="but">Version ${version}</div>
                  </a><br>
                  <div class="form-label-title update-desc"> <li>${updateDate}</li> <li>修复已知问题</li> <li>性能优化，改进用户体验</li>
                  </div>
                </div>
                <div class="box-body" ><button id="install" class="but radius jb-yellow btn-block">立即更新</button>
                </div>
              </div>
              <!-- 捐赠 -->
              <div class="tab-pane fade-in" id="tab-sign-up">
                <a class="donate flip-horizontal" href="#tab-sign-in" data-toggle="tab"><img src="${collectionCode}">  
                </a>
              </div>
            </div>
            <p class="separator" data-dismiss="modal">95度茅台</p>
          </div>
        </div>
      </div>
      <script>
        setTimeout(() => {
          const loadingDiv = document.querySelector('.loading-right').style.display = 'none';
        }, 1500);
        
        const popupOpen = () => { $('.signin-loader').click() };
        
        window.onload = () => {
          setTimeout(() => {
            $('${updateVerPopup()}').click();
          }, 1600);
        };
        window._win = { uri: 'https://bbs.applehub.cn/wp-content/themes/zibll' };
      </script>
      `
      // music
      const songId = [
        '8fk9B72BcV2',
        '8duPZb8BcV2',
        '6pM373bBdV2',
        '6NJHhd6BeV2'
      ];
      const randomId = songId[Math.floor(Math.random() * songId.length)];
      const music = `
      <iframe data-src="https://t1.kugou.com/song.html?id=${randomId}" class="custom-iframe" frameborder="0" scrolling="auto">
      </iframe>
      <script>
        const iframe = document.querySelector('.custom-iframe');
        iframe.src = iframe.getAttribute('data-src');
      </script>`;
      
      return `${avatar}
      ${settings.music ? music : ''}`
    };
    
    /**
     * Donated Author
     * weChat pay
     */
    const donatePopup = async () => {
      return `        
      <a class="signin-loader"></a>
      <div class="modal fade" id="u_sign" role="dialog">
        <div class="modal-dialog">
          <div class="zib-widget blur-bg relative">
            <div id="appleHub" class="box-body sign-logo">
              <img src="${appleHub}">
            </div>
            <a class="but donated">
              <img src="${collectionCode}">
            </a>
            <p class="but separator">95度茅台</p>
          </div>
        </div>
      </div>
      <script>
        const popupOpen = () => { $('.signin-loader').click() };
        window._win = { uri: 'https://bbs.applehub.cn/wp-content/themes/zibll' };
      </script>`
    };
    
    /**
     * 底部弹窗信息
     * 创建底部弹窗的相关交互功能
     * 当用户点击底部弹窗时，显示/隐藏弹窗动画，并显示预设消息的打字效果。
     */
    const buttonPopup = async () => {
      const js = `
      const menuMask = document.querySelector(".popup-mask")
      const showMask = async (callback, isFadeIn) => {
        const duration = isFadeIn ? 200 : 300;
        const startTime = performance.now();
    
        const animate = async (currentTime) => {
          const elapsedTime = currentTime - startTime;
          menuMask.style.opacity = isFadeIn ? elapsedTime / duration : 1 - elapsedTime / duration;
          if (elapsedTime < duration) requestAnimationFrame(animate);
          else callback?.();
        };
    
        menuMask.style.display = "block";
        await new Promise(requestAnimationFrame);
        animate(performance.now());
      };
    
      function switchDrawerMenu() {
        const popup = document.querySelector(".popup-container");
        const isOpen = !popup.style.height || popup.style.height !== '255px'
    
        showMask(isOpen ? null : () => menuMask.style.display = "none", isOpen);
        popup.style.height = isOpen ? '255px' : ''
      };
      
      const hidePopup = () => {
        setTimeout(() => switchDrawerMenu(), 300);
      }`;
      
      return `
      <div class="popup-mask" onclick="switchDrawerMenu()"></div>
      <div class="popup-container">
        <div class="popup-widget zib-widget blur-bg" role="dialog">
          <div class="box-body">
            <img id="app" onclick="switchDrawerMenu()" class="app-icon" src="${appImage}">
            <div class="app-desc">京东综合类</div>
            <button class="but" onclick="hidePopup()" id="bean">种豆得豆</button>
          </div>
        </div>
      </div>
      <script>${js}</script>`;
    };
    
    /**
     * 组件效果图预览
     * 图片左右轮播
     * Preview Component Images
     * This function displays images with left-right carousel effect.
     */
    previewImgHtml = async () => {
      const pictureArr = Array.from({ length: 3 }, (_, index) => `${rootUrl}img/picture/jingdong_bean_${index}.png`);
      const getRandomValues = (arr, num) => [...arr].sort(() => Math.random() - 0.5).slice(0, num);
      const randomUrl = getRandomValues(pictureArr, 2);

      if ( settings.topStyle ) {
        const previewImgs = await Promise.all(randomUrl.map(async (item) => {
          const imgName = decodeURIComponent(item.substring(item.lastIndexOf("/") + 1));
          const previewImg = await getCacheImage(imgName, item);
          return previewImg;
        }));
        return `<div id="scrollBox">
          <div id="scrollImg">
            ${previewImgs.map(img => `<img src="${img}">`).join('')}
          </div>
        </div>`;
      } else {
        const randomUrl = previewImgUrl[Math.floor(Math.random() * previewImgUrl.length)];
        const imgName = decodeURIComponent(randomUrl.substring(randomUrl.lastIndexOf("/") + 1));
        const previewImg = await getCacheImage(imgName, randomUrl);
        return `<img id="store" src="${previewImg}" class="preview-img">`
      }
    };
    
    // =======  js  =======//
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
    const createFormItem = ( item ) => {
      const value = settings[item.name] ?? item.default;
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
      divTitle.className = 'form-label-title';
      divTitle.innerText = item.label;
      div.appendChild(divTitle);
          
      if (item.type === 'select') {
        const select = document.createElement('select');
        select.name = item.name;
        select.classList.add('select-input');
        select.multiple = !!item.multiple;
        select.style.width = item.multiple ? '99px' : '68px';
      
        item.options?.forEach(grp => {
          const container = document.createElement('optgroup')
          if ( grp.label ) container.label = grp.label;
      
          grp.values.forEach(opt => {
            const option = new Option(opt.label, opt.value);
            option.disabled = opt.disabled || false;
            option.selected = (item.multiple && Array.isArray(value)) ? value.includes(opt.value) : value === opt.value;
            container.appendChild(option);
          });
          if (container !== select) select.appendChild(container);
        });
        
        select.addEventListener( 'change', (e) => {
          const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
          formData[item.name] = item.multiple ? selectedValues : selectedValues[0];
          formData.solidColor = selectedValues.length > 0 ? false : true;
          invoke('changeSettings', formData);
        });
        
        const selCont = document.createElement('div');
        selCont.classList.add('form-item__input__select');
        selCont.appendChild(select);
        
        if (!item.multiple) {
          select.style.appearance = 'none';
          const icon = document.createElement('i');
          icon.className = 'iconfont icon-arrow_right form-item__icon';
          selCont.appendChild(icon);
        }
        
        label.appendChild(selCont);
      } else if (['cell', 'page', 'file'].includes(item.type)) {
        const { name, isAdd } = item

        if ( item.desc ) {
          const desc = document.createElement("div");
          desc.className = 'form-item-right-desc';
          desc.id = \`\${name}-desc\`
          desc.innerText = isAdd ? (settings[\`\${name}_status\`] ?? item.desc) : settings[name];
          label.appendChild(desc);
        };
      
        const icon = document.createElement('i');
        icon.className = 'iconfont icon-arrow_right';
        label.appendChild(icon);
        label.addEventListener('click', (e) => {
          switch (name) {
            case 'version':
              popupOpen();
              break;
            case 'donate':
              popupOpen();
              break;
            case 'setAvatar':
              fileInput.click();
              invoke(name, data);
              break;
            case 'widgetMsg':
              switchDrawerMenu();
              break;
          };
      
          invoke(item.type === 'page' ? 'itemClick' : name, item);
        });
  
        // 创建图片input元素
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".jpg,.jpeg,.png,.gif,.bmp";
        fileInput.addEventListener("change", async (event) => {
          const file = event.target.files[0];
          if (file && file.type.includes("image")) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const imageData = e.target.result.split(',')[1];
              invoke(name, imageData)
            };
            reader.readAsDataURL(file);
          }
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
        icon.className = 'iconfont icon-arrow_right'
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
          invoke('changeSettings', formData);
        });
        label.appendChild(input);
      }
      return label
    };
    
    /** 创建列表 **/
    const createList = ( list, title ) => {
      const fragment = document.createDocumentFragment();
      let elBody;
    
      for (const item of list) {
        if (item.type === 'group') {
          const grouped = createList(item.items, item.label);
          fragment.appendChild(grouped);
        } else if (item.type === 'range') {
          const groupDiv = fragment.appendChild(document.createElement('div'));
          groupDiv.className = 'list'
          
          const elTitle = groupDiv.appendChild(document.createElement('div'));
          elTitle.className = 'el__header';
          elTitle.textContent = title
          
          elBody = groupDiv.appendChild(document.createElement('div'));
          elBody.className = 'el__body';
          
          const range = elBody.appendChild(document.createElement('div'));
          range.innerHTML = \`
          <label class="collapsible-label" for="collapse-toggle">
            <div class="form-label">
              <div class="collapsible-value">${settings.angle || 90}</div>
            </div>
            <input id="_range" type="range" value="${settings.angle || 90}" min="0" max="360" step="5">
            <i class="fas fa-chevron-right icon-right-down"></i>
          </label>
          <!-- 折叠取色器 -->
          <div class="collapsible-range" id="content">
            <hr class="range-separ">
            <label class="form-item">
              <div class="form-label">
                <img class="form-label-img" src="\${item.icon}"/>
                <div class="form-label-title">渐变颜色</div>
              </div>
              <input type="color" value="${settings.rangeColor}" id="color-input">
            </label>
          </div>\`;
          
          const icon = range.querySelector('.collapsible-label .icon-right-down');
          const content = range.querySelector('.collapsible-range');
          const colorInput = range.querySelector('#color-input');
          const rangeInput = range.querySelector('#_range');
          let isExpanded = false;
          
          const toggleShowContent = () => {
            content.classList.toggle('show');
            isExpanded = !isExpanded;
            icon.style.transition = 'transform 0.4s';
            icon.style.transform = isExpanded ? 'rotate(90deg)' : 'rotate(0deg)';
          };
          range.querySelector('.collapsible-label').addEventListener('click', toggleShowContent);
          
          colorInput.addEventListener('change', (e) => {
            const selectedColor = e.target.value;
            settings.rangeColor = selectedColor;
            updateRange();
            formData[item.color] = selectedColor;
            invoke('changeSettings', formData);
          });
          
          const updateRange = () => {
            const value = rangeInput.value;
            const percent = ((value - rangeInput.min) / (rangeInput.max - rangeInput.min)) * 100;
            rangeInput.dataset.value = value;
            rangeInput.style.background = \`linear-gradient(90deg, \${settings.rangeColor} \${percent}%, var(--checkbox) \${percent}%)\`;
            range.querySelector('.collapsible-value').textContent = value;
          };
          
          rangeInput.addEventListener('input', updateRange);
          rangeInput.addEventListener('change', (event) => {
            formData[item.name] = event.target.value;
            invoke('changeSettings', formData);
          });
          updateRange();
        } else if (item.type === 'collapsible') {
          const groupDiv = fragment.appendChild(document.createElement('div'));
          groupDiv.className = 'list'
          
          const elTitle = groupDiv.appendChild(document.createElement('div'));
          elTitle.className = 'el__header';
          elTitle.textContent = title
          
          elBody = groupDiv.appendChild(document.createElement('div'));
          elBody.className = 'el__body';
          
          const label = (item) => \`
          <label id="\${item.name}" class="form-item">
            <div class="form-label">
              <img class="form-label-img collapsible-label-img" src="\${item.icon}"/>
              <div class="form-label-title">\${item.label}</div>
            </div>
            \${item.desc ? \`
            <div class="form-label">
              <div id="\${item.name}-desc" class="form-item-right-desc">\${item.desc}</div>
              <i class="iconfont icon-arrow_right"></i>
            </div>\` : \`
            <i class="iconfont icon-arrow_right"></i>\`}
          </label>\`
          
          const collapsible = elBody.appendChild(document.createElement('div'));  
          collapsible.innerHTML = \`
          <label class="collapsible-label" for="collapse-toggle">
            <div class="form-label">
              <img class="form-label-img" src="\${item.icon}"/>
              <div class="form-label-title">\${item.label}</div>
            </div>
            <i class="fas fa-chevron-right icon-right-down"></i>
          </label>
          <hr class="separ">
            <!-- 折叠列表 -->
          <div class="collapsible-content" id="content">
            <div class="coll__body">
              \${item.item.map(item => label(item)).join('')}
            </div>
            <hr class="separ">
          </div>\`;
        
          const icon = collapsible.querySelector('.collapsible-label .icon-right-down');
          const content = collapsible.querySelector('.collapsible-content');
          let isExpanded = false;
          collapsible.querySelector('.collapsible-label').addEventListener('click', () => {
            content.classList.toggle('show');
            isExpanded = !isExpanded;
            icon.style.transition = 'transform 0.4s';
            icon.style.transform = isExpanded ? 'rotate(90deg)' : 'rotate(0deg)';
          });
          
          collapsible.querySelectorAll('.form-item').forEach((label, index) => {
            label.addEventListener( 'click', () => {
              const labelId = label.getAttribute('id');  
              invoke(labelId, item.item[index]);
            });
          });
        } else {
          if ( !elBody ) {
            const groupDiv = fragment.appendChild(document.createElement('div'));
            groupDiv.className = 'list'
            if ( title ) {
              const elTitle = groupDiv.appendChild(document.createElement('div'));
              elTitle.className = 'list__header'
              elTitle.textContent = title;
            }
            elBody = groupDiv.appendChild(document.createElement('div'));
            elBody.className = 'list__body'
          }
          const label = createFormItem(item);
          elBody.appendChild(label);
        }
      }
      return fragment
    };
    const fragment = createList(formItems);
    document.getElementById('settings').appendChild(fragment);
    
    /** 加载动画 **/
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
    
    ['store', 'install', 'app', 'bean'].forEach(id => {
      const elementById = document.getElementById(id).addEventListener('click', () => invoke(id));
    });
    
    })()`;
    
    // =======  HTML  =======//
    const html =`
    <html>
      <head>
        <meta name='viewport' content='width=device-width, user-scalable=no, viewport-fit=cover'>
        <link rel="stylesheet" href="https://at.alicdn.com/t/c/font_3772663_kmo790s3yfq.css" type="text/css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
      <style>${style}</style>
      </head>
      <body>
        ${avatarInfo ? await mainMenuTop() : previewImage ? (settings.clock ? clockScript : await previewImgHtml()) : ''}
        <!-- 弹窗 -->
        ${previewImage ? await donatePopup() : ''}
        ${await buttonPopup()}
        <section id="settings">
        </section>
        <script>${js}</script>
        ${scriptTags.join('\n')}
      </body>
    </html>`;
  
    const webView = new WebView();
    await webView.loadHTML(html);
    
    /**
     * 修改特定 form 表单项的文本
     * @param {string} elementId
     * @param {string} newText
     * @param {WebView} webView
     */  
    const innerTextElementById = (elementId, newText) => {
      webView.evaluateJavaScript(
        `var element = document.getElementById("${elementId}-desc");
        if (element) element.innerHTML = \`${newText}\`;
        `, false
      ).catch(console.error);
    };
    
    // 背景图 innerText
    const innerTextBgImage = () => {
      const isSetBackground = fm.fileExists(getBgImage()) ? '已添加' : ''
      innerTextElementById(
        'chooseBgImg',
        isSetBackground
      );
      
      settings.chooseBgImg_status = isSetBackground;
      writeSettings(settings);
    };
    
    /**
     * Input window
     * @param data
     * @returns {Promise<string>}
     */
    const input = async ({ label, name, message, other } = data) => {
      await generateInputAlert({
        title: label,
        message: message,
        options: [
          {
            hint: settings[name] ? String(settings[name]) : '请输入',
            value: String(settings[name]) ?? ''
          }
        ]
      }, 
      async ([{ value }]) => {
        if (name === 'location') {
          result = value.match(/^0$|^1$/)[0] ? settings[name] = value : settings[name];
        } else {
          result = value === '0' || other ? value : !isNaN(value) ? Number(value) : settings[name];
        };
        
        if ( result ) {
          settings[name] = result;
          writeSettings(settings);
          innerTextElementById(name, result);  
        }
      })
    };
          
    // 登录京东获取 Cookie
    const webLogin = async ({ label, name } = data) => {
      const webview = new WebView();  
      await webview.loadURL('https://plogin.m.jd.com/login/login?appid=300&returnurl=https%3A%2F%2Fwqs.jd.com%2Fmy%2Faccountv2.shtml%3Fsceneval%3D2%26jxsid%3D16323729562173504755%26ptag%3D7155.1.2&source=wq_passport');
      await webview.present();
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
      
      const sign = new Request('https://api.m.jd.com/client.action?functionId=signBeanAct&appid=ld');
      sign.method = 'POST'
      sign.headers = { Referer: 'https://h5.m.jd.com/' }
      const { code } = await sign.loadJSON();
      if (code === '0') {
        settings.cookie = cookie.join(';');
        settings.code = 0;
        notify('Cookie获取/更新成功', settings.cookie);
        writeSettings(settings);
        innerTextElementById(name, cookie ? '已登录' : '未登录');
      }
    };
    
    // appleOS 推送时段
    const period = async ({ label, name, message } = data) => {
      await generateInputAlert({
        title: label,
        message: message,
        options: [
          { hint: '开始时间 4', value: String(settings['startTime']) },
          { hint: '结束时间 6', value: String(settings['endTime']) }
        ]
      }, 
      async (inputArr) => {
        const [startTime, endTime] = inputArr.map(({ value }) => value);
        settings.startTime = startTime ? Number(startTime) : ''
        settings.endTime = endTime ? Number(endTime) : ''
        
        const inputStatus = startTime || endTime ? '已设置' : '默认'
        settings[`${name}_status`] = inputStatus;
        writeSettings(settings);
        innerTextElementById(name, inputStatus);
      })
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
      if (code === 'clearCache') {
        const action = await generateAlert(  
          '清除缓存', '是否确定删除所有缓存？\n离线内容及图片均会被清除。',
          options = ['取消', '清除']
        );
        if ( action === 1 ) {
          fm.remove(cacheStr);
          fm.remove(cacheImg);
          ScriptableRun();
        }
      } else if (code === 'reset') {
        const action = await generateAlert(
          '清空所有数据', 
          '该操作将把用户储存的所有数据清除，重置后等待5秒组件初始化并缓存数据', 
          ['取消', '重置'], '重置'
        );
        if ( action === 1 ) {
          fm.remove(mainPath);
          ScriptableRun();
        }
      } else if ( code === 'recover' ) {
        const action = await generateAlert(  
          '是否恢复设置 ？', 
          '用户登录的信息将重置\n设置的数据将会恢复为默认',   
          options = ['取消', '恢复']
        );
        if ( action === 1 ) {
          writeSettings(DEFAULT);
          ScriptableRun();
        }
      } else if (code === 'app') {
        Timer.schedule(350, false, async () => {
          await input({
            label: '捐赠弹窗',
            name: 'loader',
            other: true,
            message: '输入 ( 95du ) 即可关闭捐赠弹窗'
          })
        });
      } else if ( data?.input ) {
        await input(data);
      };
      
      // switch
      switch (code) {
        case 'setAvatar':
          const avatarImage = Image.fromData(Data.fromBase64String(data));
          fm.writeImage(
            getAvatarImg(), await drawSquare(avatarImage)
          );
          ScriptableRun();
          break;
        case 'telegram':
          Safari.openInApp('https://t.me/+CpAbO_q_SGo2ZWE1', false);
          break;
        case 'bean':
          Timer.schedule(650, false, () => { Safari.openInApp('https://plantearth.m.jd.com/plantBean/index?source=lingjingdoushouye', false) });
          break;
        case 'changeSettings':
          Object.assign(settings, data);
          writeSettings(settings);
          break;
        case 'updateCode':
          await updateVersion();
          break;
        case 'cookie':
          await webLogin(data);
          break;
        case 'period':
          await period(data);
          break;
        case 'preview':
          await previewWidget();
          break;
        case 'chooseBgImg':
          const image = await Photos.fromLibrary();
          fm.writeImage(getBgImage(), image);
          innerTextBgImage();
          await previewWidget();
          break;
        case 'clearBgImg':
          const bgImagePath = fm.fileExists(getBgImage());
          if ( bgImagePath ) {
            fm.remove(getBgImage());
            innerTextBgImage();
            await previewWidget();
          }
          break;
        case 'background':
          await importModule(await webModule('background.js', 'https://gitcode.net/4qiao/scriptable/raw/master/vip/mainTableBackground.js')).main();
          break;
        case 'store':
          importModule(await webModule('store.js', 'https://gitcode.net/4qiao/framework/raw/master/mian/module_95du_storeScript.js')).main();
          await myStore();
          break;
        case 'install':
          await updateString();
          break;
        case 'itemClick':      
          const findItem = (items, name) => items.reduce((found, item) => found || (item.name === name ? item : (item.type === 'group' && findItem(item.items, name))), null);
          
          const item = data.type === 'page' ? findItem(formItems, data.name) : data;
          
          data.type === 'page' ? await renderAppView(item, false, { settings }) : onItemClick?.(data, { settings });
          break;
      };
      // Remove Event Listener
      if ( event ) {
        webView.evaluateJavaScript(
          `window.dispatchEvent(new CustomEvent('JWeb', { detail: { code: 'finishLoading'} }))`,
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
  
  
  // 组件信息页
  const userMenu = (() => {
    const formItems = [
      {
        type: 'group',
        items: [
          {
            label: '炫酷时钟',
            name: 'clock',
            type: 'switch',
            icon: {
              name: 'button.programmable',
              color: '#F326A2'
            }
          },
          {
            label: '图片轮播',
            name: 'topStyle',
            type: 'switch',
            icon: {
              name: 'photo.tv',
              color: '#FF9500'
            }
          },
          {
            label: '列表动画',
            name: 'animation',
            type: 'switch',
            icon: {
              name: 'rotate.right.fill',  
              color: '#BD7DFF'
            },
            default: true
          },
          {
            label: '动画时间',
            name: 'fadeInUp',
            type: 'cell',
            input: true,
            icon: {
              name: 'clock.fill',
              color: '#0096FF'
            },
            message: '设置时长为0时，列表将无动画效果\n( 单位: 秒 )',
            desc: settings.fadeInUp
          },
          
        ]
      },
      {
        type: 'group',
        items: [
          {
            label: 'AppleOS',
            name: 'appleOS',
            type: 'switch',
            icon: `${rootUrl}img/symbol/notice.png`
          },
          {
            label: '推送时段',
            name: 'period',
            type: 'cell',
            isAdd: true,
            icon: {
              name: 'deskclock.fill',
              color: '#0096FF'
            },
            message: 'iOS 最新系统版本更新通知\n默认 04:00 至 06:00',
            desc: settings.startTime || settings.endTime ? '已设置' : '默认'
          }
        ]
      },
      {
        type: 'group',
        items: [
          {
            label: '组件商店',
            name: 'store',
            type: 'cell',
            icon: {
              name: 'bag.fill',  
              color: 'FF6800'
            }
          }
        ]
      },
      {
        type: 'group',
        items: [
          {
            name: "donate",
            label: "打赏作者",
            type: "cell",
            icon: 'https://gitcode.net/4qiao/scriptable/raw/master/img/icon/weChat.png'
          }
        ]
      }
    ];
    return formItems;
  })();
  
  // 设置菜单页
  const settingMenu = (() => {
    const formItems = [
      {
        label: '设置',
        type: 'group',
        items: [
          {
            label: '恢复设置',
            name: 'recover',
            type: 'cell',
            icon: {
              name: 'gearshape.fill',
              color: '#FF4D3D'
            }
          },
          {
            label: '刷新时间',
            name: 'refresh',
            type: 'cell',
            input: true,
            icon: `${rootUrl}img/symbol/refresh.png`,  
            message: '设置桌面组件的时长\n( 单位: 分钟 )',
            desc: settings.refresh
          },
        ]
      },
      {
        type: 'group',
        items: [
          {
            label: '头像弧度',
            name: 'radius',
            type: 'cell',
            input: true,
            icon: {
              name: 'rotate.right.fill',  
              color: '#BD7DFF'
            },
            message: 'iOS 16 系统以下设置值为 18\n即可显示圆形',
            desc: settings.radius
          },
          {
            label: '缓存时长',
            name: 'cacheTime',
            type: 'cell',
            input: true,
            icon: {
              name: 'externaldrive.fill', 
              color: '#F9A825'
            },
            message: `缓存所有数据，减少网络请求\n( 每 ${settings.cacheTime ?? '几'} 小时更新一次 )`,
            desc: settings.cacheTime
          },
          {
            name: "light",
            label: "浅色透明",
            type: "cell",
            input: true,
            icon: `${rootUrl}img/symbol/title.png`,  
            message: '两个Stack容器浅色背景透明度\n完全透明设置为 0',
            desc: settings.light
          },
          {
            name: "dark",
            label: "深色透明",
            type: "cell",
            input: true,
            icon: {
              name: 'textformat',
              color: '#938BF0'
            },
            message: '两个Stack容器深色背景透明度\n完全透明设置为 0',
            desc: settings.dark
          }
        ]
      },
      {
        type: 'group',
        items: [
          {
            label: '透明背景',
            name: 'background',
            type: 'cell',
            icon: `${rootUrl}img/symbol/transparent.png`
          },
          {
            label: '遮罩透明',
            name: 'masking',
            type: 'cell',
            input: true,
            icon: {
              name: 'photo.stack',
              color: '#8E8D91'
            },
            message: '给图片加一层半透明遮罩\n完全透明设置为 0',
            desc: settings.masking
          },
          {
            label: '图片背景',
            name: 'chooseBgImg',
            type: 'file',
            isAdd: true,
            icon: `${rootUrl}img/symbol/bgImage.png`,
            desc: fm.fileExists(getBgImage()) ? '已添加' : ' '
          },
          {
            label: '清除背景',
            name: 'clearBgImg',
            type: 'cell',
            icon: `${rootUrl}img/symbol/clearBg.png`
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
            icon: `${rootUrl}img/symbol/update.png`
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
      },
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
            label: '登录京东',
            name: 'cookie',
            type: 'cell',
            isAdd: true,
            icon: `${rootUrl}img/icon/jd_green.png`,
            desc: settings.cookie ? '已登录' : '未登录'
          },
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
            label: '偏好设置',
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
            label: '组件设置',
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
            desc: settings.version
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