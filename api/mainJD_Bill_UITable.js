// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: tags;

async function main() {
  const version = '1.0.3'
  const uri = Script.name();
  const F_MGR = FileManager.local();
  const path = F_MGR.joinPath(
    F_MGR.documentsDirectory(),
    '95duJingDong_Bill'
  );
  
  /**
   * 获取数据存储目录路径
   * @returns {string} - 目录路径
   */
  const getSettingPath = () => {
    F_MGR.createDirectory(path, true);
    return F_MGR.joinPath(path, 'setting.json', true);
  };
  
  /**
   * 读取储存的设置
   * @returns {object} 初始化
   * @returns {object} - 设置对象
   */
  const DEFAULT_SETTINGS = {
    version: version,
    minute: '10',
    masking: '0.1',
    transparency: '0.5',
    progressColor1: '#FF9500',
    progressColor2: '#34C759',
    progressWidth: Device.screenSize().height < 926 ? '215' : '243',
    progressHeight: Device.screenSize().height < 926 ? 9 : 10,
    gradient: [],
    update: 'true',
    appleOS: 'true',
    isPlus: 'true',
    randomIndex: 0,
    statistics: 1,
    angle: 90
  };
  
  const getSettings = ( file ) => {
    if (F_MGR.fileExists(file)) {
      return JSON.parse(F_MGR.readString(file));
    } else {
      setting = DEFAULT_SETTINGS;
      saveSettings();
    }
    return setting;
  };
  setting = await getSettings(getSettingPath());
  
  /**
   * 获取背景图片存储目录路径
   * @returns {string} - 目录路径
   */
  const getBgImagePath = () => {
    const bgPath = F_MGR.joinPath(F_MGR.documentsDirectory(), '95duBackground');
    if (!F_MGR.fileExists(bgPath)) {
      F_MGR.createDirectory(bgPath);
    }
    return F_MGR.joinPath(bgPath, Script.name() + '.jpg');
  };
  
  /**
   * Background Color
   */
  const bgColor = Color.dynamic(
    new Color('#F5F5F5'),
    new Color('')
  );
  const topBgColor = Color.dynamic(
    new Color('#DFDFDF'),
    new Color('')
  );
  
  // refresh time
  if (setting.minute) {  
    const widget = new ListWidget();
    widget.refreshAfterDate = new Date(Date.now() + 1000 * 60 * Number(setting.minute));
  }
  
  if (config.runsInWidget) {
    await importModule(await downloadModule()).main();
  }
  
  async function downloadModule() {
    const modulePath = F_MGR.joinPath(path, 'jingDong.js');
    if (setting.update === 'false' && F_MGR.fileExists(modulePath)) {
      return modulePath;
    } else {
      const req = new Request('https://gitcode.net/4qiao/scriptable/raw/master/table/jingDong_Bill.js');
      const moduleJs = await req.load().catch(() => {
        return null;
      });
      if (moduleJs) {
        F_MGR.write(modulePath, moduleJs);
        return modulePath;
      }
    }
  }
  
  async function userloginWeb() {  
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
    
    const sign = new Request('https://api.m.jd.com/client.action?functionId=signBeanAct&appid=ld');
    sign.method = 'POST'
    sign.headers = { Referer: 'https://h5.m.jd.com/' }
    const { code } = await sign.loadJSON();
    if (code === '0') {
      setting.cookie = cookie.join(';');
      setting.code = 0;
      notify('Cookie获取/更新成功', setting.cookie);
      await saveSettings();
    }
  }
  
  
  /**
   * 设置组件内容
   * @returns { Promise<void> }
   */
  setWidgetConfig = async () => {
    const table = new UITable();
    table.showSeparators = true;
    const enableSuggestions = true;
    await renderTables(table);
    await table.present();
  };
  
  async function renderTables(table) {
    // Header effectImage Row
    const effectRow = new UITableRow();
    effectRow.height = 70 * Device.screenScale();
    const topImg = [
    'https://sweixinfile.hisense.com/media/M00/75/2C/Ch4FyWQoR3iAW4MIAAUVcLIimkM468.png',
    'https://sweixinfile.hisense.com/media/M00/75/2C/Ch4FyWQoSYyAWA51AAJIOLkcBJg434.png'
    ];
    const items = topImg[Math.floor(Math.random() * topImg.length)];
    const effectImage = effectRow.addImageAtURL(items);
    effectImage.widthWeight = 0.4;
    effectImage.centerAligned();
    effectRow.backgroundColor = topBgColor
    table.addRow(effectRow);
  
    // Top Row
    const topRow = new UITableRow();
    topRow.height = 70;
    const leftText = topRow.addButton('组件商店');
    leftText.widthWeight = 0.3;
    leftText.onTap = async () => {
      await Run();
    };
  
    const authorImage = topRow.addImageAtURL('https://gitcode.net/4qiao/framework/raw/master/img/icon/4qiao.png');
    authorImage.widthWeight = 0.4;
    authorImage.centerAligned();
  
    const rightText = topRow.addButton('重置所有');
    rightText.widthWeight = 0.3;
    rightText.rightAligned();
    rightText.onTap = async () => {
      const delAlert = new Alert();
      delAlert.title = '清空所有数据';
      delAlert.message = '该操作将把用户储存的所有数据清除，已登录过的用户重置后点击菜单中登录京东，即可自动获取/更新 Cookie';
      delAlert.addDestructiveAction('重置');
      delAlert.addCancelAction('取消');
      const action = await delAlert.presentAlert();
      if (action == 0) {
        F_MGR.remove(path);
        notify('已清空数据', '请重新运行或重新配置小组件');
        Safari.open('scriptable:///run/' + encodeURIComponent(uri));
      }
    };
    table.addRow(topRow);
    
    // Main Menu
    const basic = [
      {
        interval: 26
      },
      {
        url: 'https://gitcode.net/4qiao/scriptable/raw/master/img/icon/NicegramLogo.png',
        type: 'web',
        title: 'Telegram',
        val: '>',
        onClick: async () => {
          Safari.openInApp('https://t.me/+CpAbO_q_SGo2ZWE1', false);
        }
      },
      {
        icon: {
          name: 'applelogo',
          color: '#00BCD4'
        },
        title: 'AppleOS',
        val: '>',
        onClick: async () => {
          const html = await new Request(atob('aHR0cHM6Ly9kZXZlbG9wZXIuYXBwbGUuY29tL25ld3MvcmVsZWFzZXMvcnNzL3JlbGVhc2VzLnJzcw==')).loadString();
          const iOS = html.match(/<title>(iOS.*?)<\/title>/)[1];
          const iPadOS = html.match(/<title>(iPadOS.*?)<\/title>/)[1];
          const arr = html.split('<item>');
          
          let newArr = [];
          for (const item of arr) {
            const iOS = item.match(/<title>(.*?)<\/title>/)[1];
            if (iOS.indexOf('iOS 16') > -1) {
              newArr.push(iOS)
            }
          }
          
          let newArriPad = [];  
          for (const item of arr) {
            const iPadOS = item.match(/<title>(.*?)<\/title>/)[1];
            if (iPadOS.indexOf('iPadOS 16') > -1) {
              newArriPad.push(iPadOS)
            }
          }
          
          const actions = [
            {
              interval: 26
            },
            {
              icon: {
                name: 'applelogo',
                color: '#43CD80'
              },
              type: 'OS',
              title: (iOS.indexOf('beta') > -1 || iOS.indexOf('RC') > -1) ? iOS.match(/(iOS\s\d+\.?\d*?\.?\d*?\s(beta\s?[\d*]?|RC\s?\d?))/)[1] : iOS.match(/(iOS\s\d+\.\d*?\.?\d*?)\s\(/)[1],
              val: iOS.match(/\((.*?)\)/)[1],
              ios: iOS
            },
            {
              icon: {
                name: 'applelogo',
                color: '#F57C00'
              },
              type: 'OS',
              title: newArr[1].match(/(iOS\s\d+\.\d*?\.?\d*?)\s\(/)[1],
              val: newArr[1].match(/\((.*?)\)/)[1]
            },
            {
              icon: {
                name: 'applelogo',
                color: '#00BCD4'
              },
              type: 'OS',
              title: html.match(/(iOS\s15\.\d*?\.?\d*?)\s\(/)[1],
              val: html.match(/iOS\s15\.\d*?\.?\d*?\s\((.*?)\)/)[1]
            },
            {
              interval: 26
            },
            {
              icon: {
                name: 'applelogo',
                color: '#F9A825'
              },
              type: 'OS',
              title: (iPadOS.indexOf('beta') > -1 || iPadOS.indexOf('RC') > -1) ? iPadOS.match(/(iPadOS\s\d+\.?\d*?\.?\d*?\s(beta\s?[\d*]?|RC\s?\d?))/)[1] : iPadOS.match(/(iPadOS\s\d+\.\d*?\.?\d*?)\s\(/)[1],
              val: iPadOS.match(/\((.*?)\)/)[1]
            },
            {
              icon: {
                name: 'applelogo',
                color: '#AB47BC'
              },
              type: 'OS',
              title: newArriPad[1].match(/(iPadOS\s\d+\.\d*?\.?\d*?)\s\(/)[1],
              val: newArriPad[1].match(/\((.*?)\)/)[1]
            },
            {
              icon: {
                name: 'applelogo',
                color: '#42A5F5'
              },
              type: 'OS',
              title: html.match(/(iPadOS\s15\.\d*?\.?\d*?)\s\(/)[1],
              val: html.match(/iPadOS\s15\.\d*?\.?\d*?\s\((.*?)\)/)[1]
            },
            {
              interval: 130.6 * Device.screenScale()
            }
          ];
          const table = new UITable();
          table.showSeparators = true;
          await preferences(table, actions, 'Apple OS');
          await table.present();
        }
      },
      {
        icon: {
          name: 'person.crop.circle',
          color: '#43CD80'
        },
        title: '登录京东',
        type: 'login',
        val: setting['code'] === 0 ? '已登录  >' : setting['code'] === 3 ? '已过期  >' : '未登录  >'
      },
      {
        url: 'https://gitcode.net/4qiao/framework/raw/master/img/symbol/personText.png',
        type: 'input',
        title: '用户名称',
        desc: '自定义用户名',
        val: '>',
        inp: 'userName'
      },
      {
        icon: {
          name: 'gearshape.fill',
          color: '#FF3B2F'
        },
        type: 'jumpSet',
        title: '偏好设置',
        val: '>',
        onClick: async () => {
          const assist = [
            {
              interval: 26
            },
            {
              url: 'https://gitcode.net/4qiao/framework/raw/master/img/symbol/refresh.png',
              type: 'input',
              title: '刷新时间',
              desc: '尝试改变刷新组件时间\n具体时间由系统判断，单位: 分钟',
              val: 'minute'
            },
            {
              url: 'https://gitcode.net/4qiao/framework/raw/master/img/symbol/interval.png',
              type: 'input',
              title: '进度长度',
              desc: '收支进度条长度',
              val: 'progressWidth'
            },
            {
              url: 'https://gitcode.net/4qiao/framework/raw/master/img/symbol/progressColor1.png',
              type: 'input',
              title: '支出进度',
              desc: '支出进度条颜色 ( 输入Hex颜色代码 )',
              val: 'progressColor1'
            },
            {
              url: 'https://gitcode.net/4qiao/framework/raw/master/img/symbol/progressColor2.png',
              type: 'input',
              title: '收入进度',
              desc: '收入进度条颜色 ( 输入Hex颜色代码 )',
              val: 'progressColor2'
            },
            {
              url: 'https://gitcode.net/4qiao/framework/raw/master/img/symbol/gradientBackground.png',
              type: 'input',
              title: '渐变背景',
              desc: '深色由上往下渐变淡\n可添加多种颜色，组件随机切换\n',
              val: 'gradient',
              tips: '输入Hex颜色代码'
            },
            {
              url: 'https://gitcode.net/4qiao/framework/raw/master/img/symbol/masking.png',
              type: 'input',
              title: '渐变透明',
              desc: '深色透明度，完全透明设置为 0',
              val: 'transparency'
            },
            {
              url: 'https://gitcode.net/4qiao/framework/raw/master/img/icon/angle.png',
              type: 'input',
              title: '渐变角度',
              desc: '输入 0 至 360，90度为从上往下',
              val: 'angle'
            },
            {
              url: 'https://gitcode.net/4qiao/framework/raw/master/img/symbol/transparent.png',
              type: 'background',
              title: '透明背景'
            },
            {
              url: 'https://gitcode.net/4qiao/framework/raw/master/img/symbol/masking2.png',
              type: 'input',
              title: '遮罩透明',
              desc: '给图片加一层半透明遮罩\n完全透明设置为 0',
              val: 'masking'
            },
            {
              url: 'https://gitcode.net/4qiao/framework/raw/master/img/symbol/bgImage.png',
              type: 'bgImage',
              title: '图片背景',
              onClick: async () => {
                const img = await Photos.fromLibrary();
                await F_MGR.writeImage(getBgImagePath(), img);
                notify('设置成功', '桌面组件稍后将自动刷新');
              }
            },
            {
              url: 'https://gitcode.net/4qiao/framework/raw/master/img/symbol/clearBg.png',
              type: 'clear',
              title: '清除背景',
              desc: '删除背景图以及清空渐变背景代码'
            },
            {
              interval: 26
            },
            {
              url: 'https://gitcode.net/4qiao/framework/raw/master/img/symbol/open.png',
              title: '颜色代码',
              onClick: async () => {
                const webView = new WebView();
                const webHtml = await new Request('https://gitcode.net/4qiao/framework/raw/master/scriptable/colorFinder.js').loadString();
                await webView.loadHTML(webHtml);
                await webView.present()
              }
            },
            {
              interval: 26
            },
            {
              url: 'https://gitcode.net/4qiao/scriptable/raw/master/img/jingdong/crownSymbol.png',
              type: 'but',
              title: 'Plus头像',
              val: 'isPlus'
            },
            {
              url: 'https://gitcode.net/4qiao/framework/raw/master/img/symbol/update.png',
              type: 'but',
              title: '自动更新',
              val: 'update'
            },
            {
              url: 'https://gitcode.net/4qiao/framework/raw/master/img/symbol/notice.png',
              type: 'but',
              title: 'AppleOS',
              val: 'appleOS'
            },
            {
              interval: 50 * Device.screenScale()
            }
          ];
          const table = new UITable();
          table.showSeparators = true;
          await settingMenu(table, assist, '设置');
          await table.present();
        }
      }
    ];
    await preferences(table, basic);
    
    // Preview And Version Info
    const updateVersion = [
      {
        interval: 26
      },
      {
        url: 'https://gitcode.net/4qiao/framework/raw/master/img/symbol/preview.png',
        type: 'preview',
        title: '预览组件',
        val: '>'
      },
      {
        interval: 26
      },
      {
        icon: {
          name: 'externaldrive.fill',
          color: '#F9A825'
        },
        type: 'ver',
        title: '当前版本',
        desc: '2023年04月18日\n增加图片缓存24小时( 减少网络请求 )',
        val: '1.0.3',
        ver: 'Version 1.0.3'
      },
      {
        icon: {
          name: 'icloud.and.arrow.down',
          color: '#42A5F5'
        },
        type: 'options',
        title: '更新代码',
        desc: '更新后当前脚本代码将被覆盖\n但不会清除用户已设置的数据\n如预览组件未显示或桌面组件显示错误，可更新代码尝试自动修复'
      },
      {
        interval: 25.9 * Device.screenScale()
      },
    ];
    await preferences(table, updateVersion, '预览|版本|更新');
  }
  
  
  /**
   * Setting Main menu
   * @param { Image } image
   * @param { string } string
   */
  async function preferences(table, arr, outfit) {
    if (outfit === 'Apple OS') {
      let header = new UITableRow();
      header.height = 80;
      let heading = header.addText(outfit);
      heading.titleFont = Font.mediumSystemFont(30);
      table.addRow(header);
    }
    for (const item of arr) {
      const row = new UITableRow();
      row.dismissOnSelect = !!item.dismissOnSelect;
      if (item.url) {
        const rowIcon = row.addImageAtURL(item.url);
        rowIcon.widthWeight = 100;
      } else if (item.icon) {
        const icon = item.icon || {};
        const image = await drawTableIcon(
          icon.name,
          icon.color,
          item.cornerWidth
        );
        const imageCell = row.addImage(image);
        imageCell.widthWeight = 100;
      }
      let rowTitle = row.addText(item['title']);
      rowTitle.widthWeight = 400;
      rowTitle.titleFont = Font.systemFont(16);
      
      if (item.val) {
        let valText = row.addText(
          `${item.val}`.toUpperCase()
        );
        const fontSize = !item.val ? 26 : 16;
        valText.widthWeight = 500;
        valText.rightAligned();
        valText.titleColor = item.val == '>' || item.type === 'login' ? new Color('#8E8E93', 0.8) : Color.blue();
        valText.titleFont = Font.mediumSystemFont(fontSize);
      } else if (item.interval) {
        row.height = item.interval;
        row.backgroundColor = bgColor;
      } else {
        const imgCell = UITableCell.imageAtURL('https://gitcode.net/4qiao/framework/raw/master/img/icon/button_false.png');
        imgCell.rightAligned();
        imgCell.widthWeight = 500;
        row.addCell(imgCell);
      }
      table.addRow(row);
      
      // item.onClick
      row.onSelect = item.onClick 
      ? async () => {
        try {
          await item.onClick(item, table);
        } catch (e) {
          console.log(e);
        }
      }
      : async () => {
        const type = item.type;
        if (type == 'options') {
          await updateVersion(
            item['title'],
            item['desc'],
            item['val']
          );
        } else if (type == 'ver') {
          await generateAlert(
            title = item.ver,
            message = item.desc,
            options = ['完成']
          );
        } else if (type == 'OS') {
          setting.iOS_push = item.ios
          await saveSettings();
          Safari.openInApp('https://developer.apple.com/news/releases', false);
          if (item.ios) {
            notify('订阅成功', item.ios + '\n将收到iOS最新开发者版或正式版通知');
          }
        } else if (type == 'input') {
          await generateInputAlert ({
            title: item.desc,
            options: [{ 
              hint: setting[item.inp],
              value: setting[item.inp]
            }]
          }, 
          async (inputArr) => {
            setting[item.inp] = inputArr[0].value;
            await saveSettings();
            notify('设置成功', '桌面组件稍后将自动刷新');
          });
        } else if (type == 'preview') {
          await importModule(await downloadModule()).main();
        } else if (type == 'login') {
          await userloginWeb();
        }
      }
    }
    table.reload();
  }
  
  
  /**
   * Setting Preferences
   * @param { Image } image
   * @param { string } string
   */
  async function settingMenu(table, assist, outfit) {
    function loadAllRows() {
      const title = new UITableRow()
      title.isHeader = true;
      title.height = 80;
      const titleText = title.addText(outfit);
      titleText.titleFont = Font.mediumSystemFont(30);
      
      const url = [
        'http://mtw.so/6mtSAz',
        'http://mtw.so/6tW1cQ',
        'http://mtw.so/5v6zgp',
        'http://mtw.so/66HNEM'
      ];
      const items = url[parseInt(Math.random() * url.length)];
      const doudouImage = title.addImageAtURL(items);
      doudouImage.widthWeight = 0.4;
      doudouImage.rightAligned();
      table.addRow(title);
      
      assist.forEach ((item) => {
        const { title, url, val, desc, type, tips } = item;
        const row = new UITableRow();
        row.height = 45;
        const rowIcon = row.addImageAtURL(url);
        rowIcon.widthWeight = 100;
        let rowTitle = row.addText(title);
        rowTitle.widthWeight = 400;
        rowTitle.titleFont = Font.systemFont(16);
        
        const isBoolValue = (setting[val] !== "true" && setting[val] !== "false") ? false : true
        if (isBoolValue) {
          const trueFalse = setting[val] === "true";
          if (trueFalse) {
            imgCell = UITableCell.imageAtURL('https://gitcode.net/4qiao/framework/raw/master/img/icon/button_false.png');
          } else {
            imgCell = UITableCell.imageAtURL('https://gitcode.net/4qiao/framework/raw/master/img/icon/button_true.png');
          }
          imgCell.rightAligned();
          imgCell.widthWeight = 500;
          row.addCell(imgCell);
        } else if (item.interval) {
          row.height = item.interval;
          row.backgroundColor = bgColor;
        } else {
          const valText = row.addText(tips || !setting[val] ? '>' : setting[val]);
          valText.widthWeight = 500;
          valText.rightAligned();
          valText.titleColor = type !== 'input' ? new Color('#8E8E93', 0.8) : Color.blue();
          valText.titleFont = Font.mediumSystemFont(16);
        }
        
        row.dismissOnSelect = false
        row.onSelect = item.onClick 
        ? async () => {
          try {
            await item.onClick(item, table);
          } catch (e) {
            console.log(e);
          }
        }
        : async () => {
          if (type === 'input') {
            await generateInputAlert ({
              title: title,
              message: (val === 'gradient') ? desc + setting[val] : desc,
              options: [
                { hint: !tips ? setting[val] : tips, value: !tips ? setting[val] : null }
              ]
            }, 
            async (inputArr) => {
              const filedVal = inputArr[0].value;
              if (val === 'gradient' || val === 'progressColor1' || val === 'progressColor2') {
                matchVal = filedVal.match(/(^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$)/)[1];
              } else {
                filedVal.match(/(^\d+(\.?\d{1,2}$|$))/)[1] ? setting[val] = filedVal : setting[val]
              }
              if (tips && matchVal) {
                arr = setting[val];
                arr.push(matchVal);
                let count = 0;  
                for (let obj of arr) {
                  count++
                }
                notify('添加成功', `当前数据库中已储存 ${count} 个数值`);
              } else if (matchVal) {
                matchVal ? setting[val] = filedVal : setting[val]
              }
            });
          } else if (type === 'but') {
            setting[val] = setting[val] === 'true' ? "false" : "true"
            let n = new Notification();
            n.sound = 'popup'
            n.schedule();
          } else if (type == 'clear') {
            const clear = await generateAlert(title, desc, ['取消', '确认']);
            if (clear === 1) {
              setting.gradient = [];
              F_MGR.remove(
                getBgImagePath()
              );
              notify('删除成功', '桌面组件稍后将自动刷新');
            }
          } else if (type === 'background') {
            await importModule(await backgroundModule()).main();
          }
          // Refresh Save
          await refreshAllRows();
          await saveSettings();
        }
        table.addRow(row);
      });
    }
    function refreshAllRows() {
      table.removeAllRows();
      loadAllRows();
      table.reload();
    }
    await loadAllRows();
  }
  
  
  /**
   * 存储当前设置
   * @param { JSON } string
   */
  async function saveSettings() {
    typeof setting === 'object' ?  F_MGR.writeString(getSettingPath(), JSON.stringify(setting)) : null
    console.log(JSON.stringify(setting, null, 2))
  }
  
  
  /**
   * AppOS updateVersion
   * Push Notification
   * Developer & Official
   */
  if (config.runsInWidget) {  
    if (setting.appleOS === 'true') {
      const html = await new Request(atob('aHR0cHM6Ly9kZXZlbG9wZXIuYXBwbGUuY29tL25ld3MvcmVsZWFzZXMvcnNzL3JlbGVhc2VzLnJzcw==')).loadString();
      const iOS = html.match(/<title>(iOS.*?)<\/title>/)[1];
      if (setting.iOS_push !== iOS) {
        notify('AppleOS 更新通知 🔥', '新版本发布: ' + iOS)
        setting.iOS_push = iOS;
        await saveSettings();
      }
    }
  }
  
  
  /**
   * Download Script
   * @param { string } string
   */
  async function updateVersion(title, desc) {
    const index = await generateAlert(
      title = title,
      message = desc,
      options = ['取消', '确认']
    );
    if (index === 0) return;
    const modulePath = F_MGR.joinPath(path, 'jingDong.js');
    const reqUpdate = new Request('https://gitcode.net/4qiao/scriptable/raw/master/table/jingDong_Bill.js');
    const codeString = await reqUpdate.loadString();
    if (codeString.indexOf('95度茅台') == -1) {
      notify('更新失败⚠️', '请检查网络或稍后再试');
    } else {
      F_MGR.writeString(modulePath, codeString);
      Safari.open('scriptable:///run/' + encodeURIComponent(uri));
    }
  }
  // Version Update Notice  
  if ( version != setting.version && setting.update === 'false' ) {
    notify('京东收支账单', `新版本更新 Version ${version}  ( 可开启自动更新 )`);
    setting.version = version;
    await saveSettings();
  }
  
  /**
   * Setting drawTableIcon
   * @param { Image } image
   * @param { string } string
   */
  drawTableIcon = async (
    icon = 'square.grid.2x2',
    color = '#e8e8e8',
    cornerWidth = 39
  ) => {
    let sfi = SFSymbol.named('gearshape.fill');
    try {
      sfi = SFSymbol.named(icon);
      sfi.applyFont(
        Font.mediumSystemFont(30)
      );
    } catch (e) {
      console.log(`Symbol图标(${icon})异常：` + e);
    }
    
    const imgData = Data.fromPNG(sfi.image).toBase64String();
    const html = `
      <img id="sourceImg" src="data:image/png;base64,${imgData}" />
      <img id="silhouetteImg" src="" />
      <canvas id="mainCanvas" />
      `;
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
   * 制作透明背景
   * 获取截图中的组件剪裁图
   * @param { image } 储存 Png
   * @param { string } title 
   */
  async function backgroundModule() {
    const modulePath = F_MGR.joinPath(path, 'image.js');
    if (F_MGR.fileExists(modulePath)) {
      return modulePath;
    } else {
      const req = new Request(atob('aHR0cHM6Ly9naXRjb2RlLm5ldC80cWlhby9zY3JpcHRhYmxlL3Jhdy9tYXN0ZXIvdmlwL21haW5UYWJsZUJhY2tncm91bmQuanM='));
      const moduleJs = await req.load().catch(() => {
        return null;
      });
      if (moduleJs) {
        F_MGR.write(modulePath, moduleJs);
        return modulePath;
      }
    }
  }
  
  
  /**
   * 弹出一个通知
   * @param { string } title
   * @param { string } body
   * @param { string } url
   * @param { string } sound
   */
  async function notify (title, body, url, opts = {}) {
    let n = new Notification()
    n = Object.assign(n, opts);
    n.title = title
    n.body = body
    n.sound = 'accept'
    if (url) n.openURL = url
    return await n.schedule()
  }
  
  
  /**
   * @param message 内容
   * @param options 按键
   * @returns { Promise<number> }
   */
  async function generateAlert(title, message, options) {
    let alert = new Alert();
    alert.title = title
    alert.message = message
    for (const option of options) {
      alert.addAction(option)
    }
    return await alert.presentAlert();
  }
  
  
  /**
   * 弹出输入框
   * @param title 标题
   * @param desc  描述
   * @param opt   属性
   * @returns { Promise<void> }
   */
  async function generateInputAlert(opt, confirm) {  
    const inputAlert = new Alert();
    inputAlert.title = opt.title;
    inputAlert.message = opt.message;
    const fieldArr = opt.options;
    for (const option of fieldArr) {
      inputAlert.addTextField(  
        option.hint,
        option.value
      );
    }
    inputAlert.addAction('取消');
    inputAlert.addAction('确认');
    let getIndex = await inputAlert.presentAlert();
    if (getIndex === 1) {
      const inputObj = [];
      fieldArr.forEach((_, index) => {
        let value = inputAlert.textFieldValue(index);
        inputObj.push({index, value});
      });
      confirm(inputObj);
    }
    return getIndex;
  }
  
  
  /**
   * Download Script
   * author: @95度茅台
   */
  renderTableList = async (data) => {
    try {
      const table = new UITable();
      table.showSeparators = true;
  
      const gifRow = new UITableRow();
      gifRow.height = 83 * Device.screenScale();
      gifRow.backgroundColor = bgColor
      const gifImage = gifRow.addImageAtURL(atob('aHR0cHM6Ly9zd2VpeGluZmlsZS5oaXNlbnNlLmNvbS9tZWRpYS9NMDAvNzEvQzgvQ2g0RnlXT0k2b0NBZjRQMUFFZ0trSzZxVVVrNTQyLmdpZg=='));
      gifImage.centerAligned();
      table.addRow(gifRow);
  
      // Top Row
      const topRow = new UITableRow();
      topRow.height = 70;
      const leftText = topRow.addButton('效果图');
      leftText.onTap = async () => {
        const webView = new WebView();
        await webView.loadURL('https://gitcode.net/4qiao/framework/raw/master/img/picture/Example.png');
        await webView.present(false);
      };
  
      const authorImage = topRow.addImageAtURL('https://gitcode.net/4qiao/framework/raw/master/img/icon/4qiao.png');
      authorImage.widthWeight = 0.9
      authorImage.centerAligned();
  
      const rightText = topRow.addButton('快捷指令');
      rightText.rightAligned();
      rightText.onTap = async () => {
        Safari.openInApp('https://sharecuts.cn/user/KVlQooAqzA', false);
      };
      table.addRow(topRow);
  
      // interval 1
      await gapRow(table);
  
      // 如果是节点，则先远程获取
      const subscription = await new Request(data.subscription).loadJSON()
      const apps = subscription.apps;
      apps.forEach((item) => {
        const r = new UITableRow();
        r.height = 60;
        const imgCell = UITableCell.imageAtURL(item.thumb);
        imgCell.centerAligned();
        r.addCell(imgCell);
  
        const nameCell = UITableCell.text(item.title);
        nameCell.centerAligned();
        r.addCell(nameCell);
  
        const downloadCell = UITableCell.button("获取");
        downloadCell.centerAligned();
        downloadCell.dismissOnTap = true;
        downloadCell.onTap = async () => {
          const script = await new Request(item.scriptURL).loadString();
          const F_MGR = FileManager.iCloud();
          F_MGR.writeString(F_MGR.documentsDirectory() + `/${item.name}.js`, script)
          if (script) {
            notify('', `小组件:${item.title}下载/更新成功`);
          }
        };
        r.addCell(downloadCell);
        table.addRow(r);
      });
  
      // interval 2
      await gapRow(table);
  
      // telegramRow
      const telegramRow = new UITableRow();
      telegramRow.height = 70;
      const telegram = telegramRow.addButton('加入 Scriptable 小组件交流群');
      telegram.widthWeight = 0.3;
      telegram.centerAligned();
      telegram.onTap = async () => {
        Safari.openInApp('https://t.me/+CpAbO_q_SGo2ZWE1', false);
      };
      table.addRow(telegramRow);
  
      // bottom interval
      const bottom = new UITableRow();
      bottom.height = 180;
      bottom.backgroundColor = bgColor
      const bottomText = bottom.addText('Copyright ©️ 2022 界面修改自·@DmYY');
      bottomText.centerAligned();
      bottomText.titleFont = Font.boldMonospacedSystemFont(10);
      bottomText.titleColor = Color.gray();
      table.addRow(bottom);
      table.present(false);
    } catch (e) {
      console.log(e);
      notify("错误提示", "脚本获取失败");
    }
  };
  
  async function gapRow(table) {
    const gapRow = new UITableRow();
    gapRow.height = 30;
    gapRow.backgroundColor = bgColor
    return table.addRow(gapRow);
  }
  
  const Run = async () => {
    try {
      await renderTableList({
        author: '95度茅台',
        subscription: 'https://gitcode.net/4qiao/framework/raw/master/scriptable/install.json'
      });
      const script = await new Request('https://gitcode.net/4qiao/scriptable/raw/master/api/95duScriptStore.js').loadString();
      const fm = FileManager.iCloud();
      fm.writeString(fm.documentsDirectory() + '/95° 小组件商店.js', script);
    } catch (e) {
      console.log("缓存读取错误" + e);
    }
  };
  await setWidgetConfig();
}
module.exports = { main }