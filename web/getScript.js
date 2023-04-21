// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: cannabis;
main()
async function main() {
  const F_MGR = FileManager.local()
  const path = F_MGR.joinPath(F_MGR.documentsDirectory(), "95du_electric");

  const [themeColor, logoColor] = Device.isUsingDarkAppearance() ? ['dark', '白色风格'] : ['white', '黑色风格'];
  const name = '交管12123_2';
  const scriptUrl = 'https://gitcode.net/4qiao/framework/raw/master/mian/module12123.js';
  
  const baseUrl = 'https://bbs.applehub.cn/wp-content/themes/zibll/';  
  const cssPaths = [
    `${baseUrl}css/bootstrap.min.css?ver=7.1`,
    `${baseUrl}css/main.min.css?ver=7.1`
  ];
  const jsPaths = [
    `${baseUrl}js/libs/jquery.min.js?ver=7.1`,
    `${baseUrl}js/libs/bootstrap.min.js?ver=7.1`,
    `${baseUrl}js/loader.js?ver=7.1`
  ];
  
  async function downloadScripts() {
    const n = new Notification();
    n.sound = 'popup'
    n.schedule();
    const modulePath = F_MGR.joinPath(path, 'store.js');
    const req = new Request(atob('aHR0cHM6Ly9naXRjb2RlLm5ldC80cWlhby9zY3JpcHRhYmxlL3Jhdy9tYXN0ZXIvdmlwL21haW45NWR1U3RvcmUuanM='));
    const moduleJs = await req.load().catch(() => {
      return null;
    });
    if ( moduleJs ) {
      F_MGR.write(modulePath, moduleJs);
      return modulePath;
    }
  }
  
  const js = `
    (() => {
      window.invoke = (code) => {
        window.dispatchEvent(
          new CustomEvent('JBridge', { detail: { code } })
        );
      };
      
document.getElementById('userClick').addEventListener('click', () => {
        invoke('userClick', userClick);
      });
      document.getElementById('myName').addEventListener('click', () => {
        console.log('95度茅台')
        invoke('myName', myName);
      });
    })()`;
  
  const html = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=0.0, viewport-fit=cover">
      ${cssPaths.map(path => `<link rel='stylesheet' href='${path}' type='text/css' media='all'>`).join('\n')}
      <style>
        .modal-dialog {
          /* position: fixed; */
          top: -5%;
          border-radius: 15px;
        }  
        .button-container {
          display: flex;
        }
        .btn-lengthen {
          margin: 0 auto;
          height: 38px;
          width: 200px;
        }
        .title {
          text-align: center;
          font-size: 20px;
          margin-top: 5px;
          margin-bottom: 5px;
          font-weight: bold;
        }
        .form-label-title {
          margin-left: 20px
        }
        .update-content {
          text-align: center;
          font-size: 16px;
        }
        .text-content {
          text-align: center;
          font-size: 16px;
          margin-top: 30px;
          margin-bottom: 152px;
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
        .display-name {
          background-image: -webkit-linear-gradient(90deg, #07c160, #fb6bea 25%, #3aedff 50%, #fb6bea 75%, #28d079);
          -webkit-text-fill-color: transparent;
          -webkit-background-clip: text;
          background-size: 100% 600%;
          animation: wzw 10s linear infinite;
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
      </style>
    </head>
    <body class="${themeColor}-theme nav-fixed site-layout-1">
      <main class="main-min-height">
        <div class="container">
          <div class="author-header mb20 radius8 main-shadow main-bg full-widget-sm">
            <div class="page-cover">
              <img class="lazyload fit-cover user-cover user-cover-id-0" src="https://sweixinfile.hisense.com/media/M00/75/82/Ch4FyWQ28-KAGA_GAEgKkK6qUUk293.gif" alt="封面">
              <div class="absolute linear-mask"></div>
            </div>
            <!-- 旋转头像开始 -->
            <div class="header-content">
              <div class="flex header-info relative hh signin-loader">
                <div class="flex0 header-avatar">
                  <div class="hover-show relative">
                    <span class="avatar-img">
                      <img alt="头像" src="https://gitcode.net/4qiao/framework/raw/master/img/icon/autoGPT.png" class="lazyload avatar avatar-id-0">
                    </span>
                  </div>
                </div>
                <a href="javascript:;" class="display-name">Scriptable 小组件</a>
              </div>
            </div>
            <!-- 旋转头像结束 -->
          </div>
          <div class="signin-loader" >
         <div class="button-container text-content">  
              <button type="button" class="but radius jb-yellow padding-lg btn-lengthen">敬请期待</button>
            </div>
            <center>
              <img src="https://photo.applehub.cn:443/images/2023/04/06/lan.png">
            </center>
            <div class="social-separator separator muted-3-color em09 mt20 mb20">95度茅台</div>
       </div>
        </div>
      </main>
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
                <button id="userClick" type="button" class="but radius jb-blue padding-lg  btn-block">立即更新</button>
              </div>
              <script>${js}</script>
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
          }, 1500);
        };
        window._win = {
          uri: '${baseUrl}',
          qj_loading: '1',
        }
      </script>
      ${jsPaths.map(path => `<script type='text/javascript' src='${path}'></script>`).join('\n')}
      <!-- 底部波浪开始 -->  
      <div class="wiiuii_layout">
        <svg class="editorial" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none">
          <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18v44h-352z" />
          </defs>
          <g class="parallax">
            <use xlink:href="#gentle-wave" x="50" y="0" fill="#4579e2" />
            <use xlink:href="#gentle-wave" x="50" y="3" fill="#3461c1" />
            <use xlink:href="#gentle-wave" x="50" y="6" fill="#2d55aa" />
          </g>
        </svg>
      </div>
      <style type="text/css">
        .parallax > use {
          animation: move-forever 12s linear infinite;
        }
        .parallax > use:nth-child(1) {
          animation-delay: -2s;
        }
        .parallax > use:nth-child(2) {
          animation-delay: -2s;
          animation-duration: 5s;
        }
        .parallax > use:nth-child(3) {
          animation-delay: -4s;
          animation-duration: 3s;
        }
        @keyframes move-forever {
          0% {
            transform: translate(-90px, 0%);
          }
          100% {
            transform: translate(85px, 0%);
          }
        }
        .wiiuii_layout {
          top: 0;
          width: 100%;
          height: 40px;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }
        .editorial {
          display: block;
          width: 100%;
          height: 40px;
          margin: 0;
        }
      </style>
      <!-- 底部波浪结束 -->
    </body>
  </html>
  `
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
          listener
        )
      })()`,
      true
    ).catch((err) => {
      console.error(err);
    });
    
    const { code } = event;
    if (code === 'userClick') {
      const script = await new Request(scriptUrl).loadString();
      const fm = FileManager.iCloud()
      fm.writeString(fm.documentsDirectory() + `/${name}.js`, script);
      Safari.open('scriptable:///run/' + encodeURIComponent(name));
    } else if (code === 'myName') {
      await importModule(await downloadScripts()).main();
    }
    await injectListener();
  };
    
  injectListener().catch((e) => {
    console.error(e);
    throw e
  });
  await webView.present();
}
module.exports = { main }