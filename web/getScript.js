// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: cannabis;
  
async function main() {
  const [themeColor, logoColor] = Device.isUsingDarkAppearance() ? ['dark', '白色风格'] : ['white', '黑色风格'];
  
  const html = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=0.0, viewport-fit=cover">
      <link rel='stylesheet' id='_bootstrap-css' href='https://bbs.applehub.cn/wp-content/themes/zibll/css/bootstrap.min.css?ver=7.1' type='text/css' media='all' />
      <link rel='stylesheet' id='_main-css' href='https://bbs.applehub.cn/wp-content/themes/zibll/css/main.min.css?ver=7.1' type='text/css' media='all' />
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
        }
        .update-content {
          text-align: center;
          font-size: 16px;
        }
        .text-content {
          text-align: center;
          font-size: 16px;
          margin-top: 30px;
          margin-bottom: 350px;
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
              <img class="lazyload fit-cover user-cover user-cover-id-0" src="https://sweixinfile.hisense.com/media/M00/71/C8/Ch4FyWOI6oCAf4P1AEgKkK6qUUk542.gif" alt="封面">
              <div class="absolute linear-mask"></div>
            </div>
            <!-- 旋转头像 -->
            <div class="header-content">
              <div class="flex header-info relative hh signin-loader">
                <div class="flex0 header-avatar">
                  <div class="hover-show relative">
                    <span class="avatar-img">
                      <img alt="头像" src="https://gitcode.net/4qiao/framework/raw/master/img/icon/4qiao.png" class="lazyload avatar avatar-id-0">
                    </span>
                  </div>
                </div>
                <a href="javascript:;" class="display-name">Scriptable 小组件</a>
              </div>
            </div>
          </div>
          <div class="signin-loader" >
       <div class="button-container text-content">  
              <button type="button" class="but radius jb-yellow padding-lg btn-lengthen">更新内容</button>
            </div>
            <div class="social-separator separator muted-3-color em09 mt20 mb20">Version 1.0.0</div>
     </div>
        </div>
      </main>
      <!-- 弹窗开始 -->
      <div class="modal fade" id="u_sign" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="sign zib-widget blur-bg relative" style="border-radius: 25px;">
            <div class="text-center">
              <div class="sign-logo box-body">
                <img src="https://bbs.applehub.cn/wp-content/uploads/2022/11/Text_${logoColor}.png" class="lazyload">
              </div>
            </div>
            <div class="tab-content">
              <div class="box-body">
                <div class="title-h-center fa-2x">
                  <div class="title">JD_京东小白鹅</div>
                  </div>
                <a class="muted-color px30" class="display-name" >
                  <div class="update-content">作者: &nbsp; 95度茅台</div>
                </a>
                <br />
                <center>
                  <li>修复已知问题</li>
                  <li>修复已知问题</li>
                </center>
              </div>
              <div id="sign-in">
                <div class="tab-content">
                  <form>
                    <input machine-verification="geetest" type="hidden" name="captcha_mode" value="geetest">
                    <div class="box-body">
                      <button type="button" class="but radius jb-blue padding-lg signsubmit-loader btn-block" onclick="location.href='https://sharecuts.cn/user/KVlQooAqzA'">立即获取</button>
                    </div>
                  </form>
                </div>
              </div>
              <p class="social-separator separator muted-5-color em12">Version 1.0.0</p>
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
      <script type='text/javascript' src='https://bbs.applehub.cn/wp-content/themes/zibll/js/libs/jquery.min.js?ver=7.1' id='jquery-js'></script>
      <script type='text/javascript' src='https://bbs.applehub.cn/wp-content/themes/zibll/js/libs/bootstrap.min.js?ver=7.1' id='bootstrap-js'></script>
      <script type='text/javascript' src='https://bbs.applehub.cn/wp-content/themes/zibll/js/loader.js?ver=7.1' id='_loader-js'></script>
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
          top: 5%;
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
      <!-- 底部波浪结束 -->
    </body>
  </html>
  `
  const webView = new WebView();
  await webView.loadHTML(html)
  await webView.present();
}
module.exports = { main }