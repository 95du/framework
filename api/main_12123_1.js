// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: car;
/**
 * 支付宝小程序 交管12123
 * 小组件作者：95度茅台
 * 获取Token作者: @FoKit
 * Version 1.3.0
 */

async function main() {
  const uri = Script.name();
  const F_MGR = FileManager.local();
  const path = F_MGR.joinPath(F_MGR.documentsDirectory(), '95du12123_1');  
  F_MGR.createDirectory(path, true);  
  const moduleDir = F_MGR.joinPath(F_MGR.documentsDirectory(), '95du12123_1/Running');
  const cacheFile = F_MGR.joinPath(path, 'setting.json');
  
  
  /**
   * 存储当前设置
   * @param { JSON } string
   */
  const writeSettings = async (object) => {
    F_MGR.writeString(cacheFile, JSON.stringify(object, null, 2));
    console.log(JSON.stringify(
      object, null, 2)
    )
  };
  
  /**
   * 初始化并读取储存的设置
   * @param {string} file
   * @returns {object} Initial
   */
  let imgArr = [];
  let myPlate = '琼A·99999'
  const phone = Device.screenSize().height  
  if (phone < 926) {
    layout = {
      leftGap1: 20,
      leftGap2: 3,
      rightGap1: 14,
      rightGap2: 8,
      carWidth: 208,
      carHeight: 100,
      bottomSize: 212
    }
  } else {
    layout = {
      leftGap1: 24,
      leftGap2: 7,
      rightGap1: 18,
      rightGap2: 11,
      carWidth: 225,
      carHeight: 100,
      bottomSize: 230
    }
  };

  const DEFAULT_SETTINGS = {
    ...layout,
    myPlate,
    imgArr,
    botStr: `${phone < 926 ? '' : '请'}保持良好的驾驶习惯，务必遵守交通规则`,
    verifyToken: null
  };
  
  const getSettings = (file) => {
    let setting = {};
    if (F_MGR.fileExists(file)) {
      return { verifyToken, myPlate, referer, sign, imgArr } = JSON.parse(F_MGR.readString(file));
    } else {
      setting = DEFAULT_SETTINGS;
      writeSettings(setting);
    }
    return setting;
  };
  const setting = await getSettings(cacheFile);
  
  /**
   * Get boxjs Data
   * 依赖：Quantumult-X / Surge
   */
  const getBoxjsData = async () => {
    try {
      const boxjs_data = await new Request('http://boxjs.com/query/data/body_12123').loadJSON();
      const boxjs = boxjs_data.val.split(',');
      verifyToken = boxjs[0];
      sign = boxjs[1];
      const boxjs_referer = await new Request('http://boxjs.com/query/data/referer_12123').loadJSON();
      referer = boxjs_referer.val;

      if (verifyToken && referer) {
        await writeSettings({
          ...setting,
          sign,
          verifyToken,
          referer
        })
        if (imgArr?.length) {
          Timer.schedule(1500, false, () => {notify('Boxjs_12123', 'verifyToken/Sign/Referer 储存成功')})
        }
      }
    } catch (e) {
      notify('获取 Boxjs 数据失败 ⚠️', '需打开 Quantumult-X 或其他辅助工具', 'quantumult-x://');
    }
  };

  if (!setting.referer || setting.verifyToken === null || sign === null) {
    await getBoxjsData();
  }
  
  /**
   * 获取请求数据
   * @param {string} - string
   * @returns {image} - url
   */
  const getGovData = async() => {
    const invoke = await new Request(atob('aHR0cHM6Ly9naXRjb2RlLm5ldC80cWlhby9zaG9ydGN1dHMvcmF3L21hc3Rlci9hcGkvdXBkYXRlL3Zpb2xhdGlvbi5qc29u')).loadJSON();
    return { update, Ver, infoURL, productId, version, api1, api2, api3, api4, alipayUrl, statusUrl, detailsUrl, maybach } = invoke;
  };
  await getGovData();
  
  /**
   * 获取远程图片
   * @returns {image} - image
   */
  const getImage = async (url) => {
    return await new Request(url).loadImage();
  };
  
  /**
   * 获取图片并使用缓存
   * @param {string} File Extension
   * @returns {image} - Request
   */
  const cache = F_MGR.joinPath(path, 'cachePath');
  F_MGR.createDirectory(cache, true);
  
  const downloadCarImage = async (item) => {
    const carImage = await getImage(item);
    const imgKey = decodeURIComponent(item.substring(item.lastIndexOf("/") + 1));
    const cachePath = F_MGR.joinPath(cache, imgKey);
    F_MGR.writeImage(cachePath, carImage);
    imgArr.push(imgKey);
    await writeSettings(setting);
  };
  
  if ( !imgArr?.length ) {
    maybach.forEach(async (item) => {
      await downloadCarImage(item);
    });
  }
  
  async function getRandomImage() {
    const count = imgArr.length;
    const index = Math.floor(Math.random() * count);
    const cacheImgPath = cache + '/' + imgArr[index];
    return ing = await F_MGR.readImage(cacheImgPath);
  };
  
  /**
   * 弹出菜单供用户选择进行操作
  */
  async function presentMenu() {
    const title = '交管12123';
    const message = Ver;
    const destructiveActions = ['更新代码', '重置所有'];
    const actions = ['使用说明', '组件下载', '修改车牌', '预览组件', '退出菜单'];
  
    const showAlert = (
      title,
      message
    ) => {
      let alert = new Alert();
      alert.title = title;
      alert.message = message;
      return alert;
    }
  
    const alert = showAlert(
      title, 
      message
    );
    for (const action of destructiveActions) {
      alert.addDestructiveAction(action);
    }
    for (const action of actions) {
      alert.addAction(action);
    }
  
    const response = await alert.presentAlert();
    switch (response) {
      case 1:
        F_MGR.remove(moduleDir);
        Safari.open('scriptable:///run/' + encodeURIComponent(uri));
        break;
      case 2:
        await getTokenSign();
        break;
      case 3:
        await importModule(await downloadModule()).main();
        break;
      case 4:
        await licensePlate();
        break;
      case 5:
        createWidget();
        break;
      case 6:
        return;
      case 0:
        const codeString = await new Request(update).loadString();
        const iCloudInUse = F_MGR.isFileStoredIniCloud(module.filename);
        const finish = showAlert();
        if (codeString.includes('95度茅台') && iCloudInUse) {
          F_MGR.writeString(
            module.filename, 
            codeString
          );
          finish.title = '更新成功';
          finish.addAction('OK');
          await finish.presentAlert();
          Safari.open('scriptable:///run/' + encodeURIComponent(uri));
        } else {
          finish.title = '更新失败';
          finish.addAction('OK');
          await finish.presentAlert();
        }
     // Main Menu
    }
  }
  
  
  /**
  * 函数作用：获取TokenSign
  * 依赖：Quantumult-X / Surge
  */
  const getTokenSign = async () => {
    const tokenAlert = new Alert();
    tokenAlert.title = '交管 12123';
    tokenAlert.message = `\r\n注 : 自动获取Token以及Referer需要Quantumult-X / Surge 辅助运行，具体方法请查看小组件代码开头注释\n\n⚠️获取Referer方法: 当跳转到支付宝12123【 查机动车违法 】时，点击【 车牌号或查询 】，用于获取检验有效期的日期和累积记分\n\r\n小组件作者: 95度茅台\n获取Token作者: @FoKit`;
    tokenAlert.addAction('获取');
    tokenAlert.addCancelAction('取消');
    const action = await tokenAlert.presentAlert();
    if (action !== -1) {
      Safari.open(detailsUrl);
      notify('12123_Referer', '点击车牌号或查询即可更新/获取');  
    }
  };
  
  /**
   * 添加车牌号
   * 用于违章时获取数据
   */
  const licensePlate = async () => {
    const cacheFileExists = F_MGR.fileExists(cacheFile);
    const noPlate = '琼A·99999';
    const alert = new Alert();
    alert.title = '输入车牌号';
    alert.message = '用于违章时获取数据';
    alert.addTextField('输入正确的车牌号', cacheFileExists ? myPlate : noPlate);
    alert.addAction('确定');
    alert.addCancelAction('取消');
    const input = await alert.presentAlert();
    myPlate = alert.textFieldValue(0);
    if (!myPlate || input === -1) {
      return;
    } else {
      const updatedSettings = { ...setting, myPlate };
      await writeSettings(updatedSettings);
      await createWidget();
    }
  };
  
  /**
   * 发送请求获取信息
   *
   * @param {string} api
   * @param {object} params
   * @param {object} params具体请求参数
   * @returns {object} 响应结果对象
   */
  const requestInfo = async (api, params) => {
    const request = new Request(infoURL);
    request.method = 'POST';
    request.body = `params=${encodeURIComponent(JSON.stringify({
      productId,
      api,
      sign,
      version,
      verifyToken,
      params,
    }))}`;
    const response = await request.loadJSON();
    if (!response.success) {
      await handleError(request);
    }
    return response;
  };
  
  // 获取车辆违章信息
  const getVehicleViolation = async (vehicle) => {
    const vioList = getRandomItem(vehicle);
    if (!vioList) {
      return undefined;
    }
    const issueData = await getIssueData(vioList);
    if (!issueData) {
      return undefined;
    }
    const surveils = await getSurveils(vioList, issueData);
    const detail = getRandomItem(surveils);
    if (!detail) {
      return undefined;
    }
    const vio = await getViolationMsg(detail);
    const photos = getRandomItem(vio.photos);
    return { vioList, detail, vio, photos };
  };
  
  // 获取违章对应的发证机关信息
  const getIssueData = async (vioList) => {
    const { plate } = myPlate.match(/(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领])([A-Z])/);
    const params = {
      internalOrder: vioList.internalOrder,
      plateType: 2,
      _issueOrganization: plate,
    };
    const issue = await requestInfo(api2, params);
    const issueArr = issue.data.vioCity.filter((item) => item.vioCount >= 1);
    return getRandomItem(issueArr);
  };
  
  // 获取违章对应的违法行为信息
  const getSurveils = async (vioList, issueData) => {
    const params = {
      internalOrder: vioList.internalOrder,
      plateType: 2,
      issueOrganization: issueData.issueOrganization,
    };
    const surveils = await requestInfo(api3, params);
    return surveils.data.surveils;
  };
  
  // 获取违章详细信息
  const getViolationMsg = async (detail) => {
    const params = {
      violationSerialNumber: detail.violationSerialNumber,
      issueOrganization: detail.issueOrganization,
    };
    const violationMsg = await requestInfo(api4, params);
    return violationMsg.data.detail;
  };
  
  // 查询主函数
  const violationQuery = async () => {
    const params = { productId, api: api1, sign, version, verifyToken };
    const main = await requestInfo(api1, params);
    const { success } = main;
    if (success) {
      const { list: vehicle } = main.data;
      const violationDetails = await getVehicleViolation(vehicle);
      if (violationDetails) {
        return { success, ...violationDetails };
      }
    } else {
      await handleError(main);
    }
    return { success };
  };
  
  // 获取随机数组元素
  const getRandomItem = (array) => (array.length ? array[Math.floor(Math.random() * array.length)] : undefined);
  
  // 处理错误
  const handleError = async (response) => {
    const { resultCode, resultMsg } = response;
    if (resultCode === 'AUTHENTICATION_CREDENTIALS_NOT_EXIST' || resultCode === 'SECURITY_INFO_ABNORMAL') {
      const data = { ...setting, sign: null, verifyToken: null };
      await writeSettings(data);
      notify(`${resultMsg} ⚠️`, '点击【 通知框 】或【 车图 】跳转到支付宝12123页面重新获取，请确保已打开辅助工具', detailsUrl);
    } else {
      notify(`${resultCode} ⚠️`, resultMsg, detailsUrl);
    }
  };
  
  
  //=========> Create <=========//
  async function createWidget() {
    const widget = new ListWidget();
    widget.backgroundColor = Color.white();
    const gradient = new LinearGradient();
    const color = [
      "#82B1FF",
      "#4FC3F7",
      "#66CCFF",
      "#99CCCC",
      "#BCBBBB"
    ]
    const items = color[Math.floor(Math.random() * color.length)];
    gradient.locations = [0, 1]
    gradient.colors = [
      new Color(items, 0.5),
      new Color('#00000000')
    ]
    widget.backgroundGradient = gradient;
    
    // 调用违章查询函数
    const queryResult = await violationQuery();
    const { success, vioList, detail, vio, photos } = queryResult;
    const nothing = !Array.isArray(vioList);
    
    /**
     * @param {image} image
     * @param {string} text
     * Cylindrical Bar Chart
     */
    widget.setPadding(nothing || !success ? 19 : 15, 18, 15, 14);
    const mainStack = widget.addStack();
    mainStack.layoutHorizontally();
    // Left Stack Violation Data
    const leftStack = mainStack.addStack();
    leftStack.layoutVertically();
    leftStack.addSpacer();
    // plateStack
    const plateStack = leftStack.addStack();
    textPlate = plateStack.addText(myPlate);
    textPlate.font = Font.mediumSystemFont(myPlate.length > 8 ? 16.5 : 19);
    textPlate.textColor = Color.black();
    leftStack.addSpacer(6)
  
    // Car icon
    const carIconStack = leftStack.addStack();
    carIconStack.layoutHorizontally();
    carIconStack.centerAlignContent();
    const man = SFSymbol.named('car');
    const carIcon = carIconStack.addImage(man.image);
    carIcon.imageSize = new Size(15, 15);
    carIcon.tintColor = nothing || !success ? Color.blue() : Color.red();
    carIconStack.addSpacer(5);
    // vehicleModel
    const vehicleModel = carIconStack.addStack();
    vehicleModelText = vehicleModel.addText(nothing || !success ? '未处理违章 0' : `未处理违章 ${vioList.count} 条`);
    vehicleModelText.font = Font.mediumSystemFont(12);
    vehicleModelText.textColor = new Color('#484848');
    leftStack.addSpacer(3)
  
    // violationPoint
    const vioPointStack = leftStack.addStack();
    const vioPoint = vioPointStack.addStack();
    if ( !nothing && success && detail ) {
      vioPointText = vioPoint.addText(`罚款${vio.fine}元、` + `扣${vio.violationPoint}分`);
      vioPointText.font = Font.mediumSystemFont(12);
      vioPointText.textColor = new Color('#484848');
      leftStack.addSpacer(3);
    }
      
    // validPeriodEnd icon
    const dateStack = leftStack.addStack();
    dateStack.layoutHorizontally();
    dateStack.centerAlignContent();
    if ( nothing || !success || !detail ) {
      const iconSymbol2 = SFSymbol.named('timer');
      const carIcon2 = dateStack.addImage(iconSymbol2.image)
      carIcon2.imageSize = new Size(15, 15);
      dateStack.addSpacer(5);
    }
      
    // validPeriodEndDate
    const updateTime = dateStack.addStack();
    const textUpdateTime = updateTime.addText(nothing || !success || `${vio.violationTime}` === 'undefined' ? referer.match(/validPeriodEnd=(\d{4}-\d{2}-\d{2})&/)[1] : `${vio.violationTime}`);
    textUpdateTime.font = Font.mediumSystemFont(nothing ? 13 : 12);
    textUpdateTime.textColor = new Color('#484848');
    leftStack.addSpacer(nothing || !success ? setting.leftGap1 : setting.leftGap2);
      
  
    // Status Columnar bar
    const barStack = leftStack.addStack();
    barStack.layoutHorizontally();
    barStack.centerAlignContent();
    barStack.setPadding(3, 10, 3, 10);
    // violation Early Warning
    barStack.backgroundColor = new Color('#EEEEEE', 0.1);
    barStack.cornerRadius = 10
    barStack.borderColor = nothing ? Color.green() : !success ? Color.orange() : new Color('#FF0000', 0.7);
    barStack.borderWidth = 2
    if ( nothing ) {
      // bar icon
      const barIcon = SFSymbol.named('leaf.fill');
      const barIconElement = barStack.addImage(barIcon.image);
      barIconElement.tintColor = Color.green();
      barIconElement.imageSize = new Size(16, 16);
      barStack.addSpacer(4);
    }
    // bar text
    const totalMonthBar = barStack.addText(nothing ? '无违章' : !success ? 'Sign 过期' : `${vioList.plateNumber}`);
    totalMonthBar.font = Font.mediumSystemFont(14);
    totalMonthBar.textColor = new Color(nothing ? '#00b100' : !success ? 'FF9500' : '#D50000');
    leftStack.addSpacer(8);
    
    // cumulativePoint Columnar bar
    const barStack2 = leftStack.addStack();
    barStack2.layoutHorizontally();
    barStack2.centerAlignContent();
    barStack2.backgroundColor = new Color('#EEEEEE', 0.1);
    barStack2.setPadding(3, 10, 3, 10);
    barStack2.cornerRadius = 10
    barStack2.borderColor = new Color('#AB47BC', 0.7);
    barStack2.borderWidth = 2
    // bsr icon
    const barIcon2 = SFSymbol.named('person.text.rectangle.fill');
    const barIconElement2 = barStack2.addImage(barIcon2.image);
    barIconElement2.imageSize = new Size(16, 16);
    barIconElement2.tintColor = Color.purple();
    barStack2.addSpacer(4);
    // Bar Text
    const cumulativePoint = referer.match(/cumulativePoint=(\d{1,2}|undefined|null)/)[1];
    const totalMonthBar2 = barStack2.addText(`记${cumulativePoint === 'undefined' ? '0' : cumulativePoint}分`);
    totalMonthBar2.font = Font.mediumSystemFont(14);
    totalMonthBar2.textColor = new Color('#616161');
    leftStack.addSpacer();
  
  
    /*
    * Right Main Stack
    * Car image
    * App Logo
    * Violation Address
    */
    const rightStack = mainStack.addStack();
    rightStack.layoutVertically();
    rightStack.addSpacer(10);
    // Car Logo
    const carLogoStack = rightStack.addStack();
    carLogoStack.addSpacer();
    textPlate2 = carLogoStack.addText('交管12123');
    textPlate2.font = Font.boldSystemFont(14);
    textPlate2.rightAlignText();
    textPlate2.textColor = new Color('#0061FF');
    rightStack.addSpacer(nothing || !success ? setting.rightGap1 : setting.rightGap2);
  
    // Car image
    const carImageStack = rightStack.addStack();
    carImageStack.setPadding(-20, 6, 0, 0);
    const img = await getRandomImage();
    const imageCar = carImageStack.addImage(img);
    imageCar.imageSize = new Size(setting.carWidth, setting.carHeight);
    rightStack.addSpacer(2);
  
    // Display Address
    const tipsStack = rightStack.addStack();
    tipsStack.layoutHorizontally();
    tipsStack.centerAlignContent();
    tipsStack.size = new Size(setting.bottomSize, 30);
    if (nothing || !success) {
      textAddress = tipsStack.addText(setting.botStr);
    } else {
      textAddress = tipsStack.addText(`${vio.violationAddress}，` + `${vio.violation}`);
      if ( success && detail ) {
        textAddress.url = `${photos}`
      }
    }
    textAddress.font = Font.mediumSystemFont(nothing || !success ? 11.5 : 11);
    textAddress.textColor = new Color('#484848');
    textAddress.centerAlignText();
    rightStack.addSpacer();
    
    // jump show status
    barStack2.url = statusUrl;
    textPlate2.url = 'tmri12123://'
    imageCar.url = detailsUrl;
    
    if ( !config.runsInWidget ) {  
      await widget.presentMedium();
    } else {
      Script.setWidget(widget);
      Script.complete();
    }
    return widget;
  }
  
  /**-------------------------**/
     /** Request(url) json **/
  /**-------------------------**/
  
  const runWidget = async () => {  
    if (config.runsInWidget) {
      const isMediumWidget = config.widgetFamily === 'medium';
      await (isMediumWidget && referer && imgArr.length > 0 ? createWidget() : createErrWidget());
    } else if (setting.referer) {
      await presentMenu();
    } else if (!imgArr.length){
      await getTokenSign();
    }
  }
  await runWidget();
  
  /**-------------------------**/
     /** Request(url) json **/
  /**-------------------------**/
  
  async function notify (title, body, url, opts = {}) {
    let n = new Notification()
    n = Object.assign(n, opts);
    n.title = title
    n.body = body
    if (url) n.openURL = url
    return await n.schedule()
  }
  
  async function createErrWidget() {
    const widget = new ListWidget();
    const text = widget.addText('仅支持中尺寸');
    text.font = Font.systemFont(17);
    text.centerAlignText();
    Script.setWidget(widget);
  }
  
  async function downloadModule() {
    const modulePath = F_MGR.joinPath(path, 'store.js');
    if (F_MGR.fileExists(modulePath)) {
      await F_MGR.remove(modulePath)
    }
    const req = new Request(atob('aHR0cHM6Ly9naXRjb2RlLm5ldC80cWlhby9zY3JpcHRhYmxlL3Jhdy9tYXN0ZXIvdmlwL21haW45NWR1U3RvcmUuanM='));
    const moduleJs = await req.load().catch(() => {
      return null;
    });
    if (moduleJs) {
      F_MGR.write(modulePath, moduleJs);
      return modulePath;
    }
  };
}
module.exports = { main }