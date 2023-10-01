// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: circle-notch;
const battery = Device.batteryLevel();
const batteryDigit = (battery * 100).toFixed(1);

const outer = battery <= 0.5 ? 0.85 : battery>= 0.9 ? 0.7 : 0.6

const html = `
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, maximum-scale=1.0">
  <style>
    * {
      border: 0;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :root {
      --bg: hsl(223, 10%, 90%);
      --fg: hsl(223, 10%, 10%);
      font-size: calc(16px + (24 - 16) * (100vw - 320px) / (1280 - 320));
    }

    body,
    button {
      color: var(--fg);
      font: 1em/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    body {
      background-color: var(--bg);
      height: 90vh;
      display: grid;
      place-items: center;
    }

    .progress-widget {
      display: grid;
      justify-content: center;
      align-content: center;
      position: relative;
      text-align: center;
      width: 16em;
      height: 16em;
    }

    .progress-widget__time-date,
    .progress-widget__digit {
      background: transparent;
    }
    
    .progress-widget__time-date {
      font-size: 0.8em;
      line-height: 1.35;
    }

    .progress-widget__digit {
      font-size: 2em;
      font-weight: 400;
      grid-row: 2;
    }

    .progress-widget__rings {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }

    .progress-widget__ring {
      opacity: 0.1;
    }

    .progress-widget__ring-fill {
      transition:
        opacity 0s 0.3s linear,
        stroke-dashoffset 1.5s ease-in-out;
    }

    [data-group]:focus {
      outline: transparent;
    }

    [data-units] {
      transition: opacity 0.2s linear;
    }

    [data-group="d"]:focus,
    [data-group="d"]:hover {
      color: hsl(333, 90%, 55%);
    }

    [data-group="h"]:focus,
    [data-group="h"]:hover {
      color: hsl(33, 90%, 55%);
    }

    [data-group]:focus~.progress-widget__rings [data-units],
    [data-group]:hover~.progress-widget__rings [data-units] {
      opacity: 0.2;
    }

    [data-group="d"]:focus~.progress-widget__rings [data-units="d"],
    [data-group="d"]:hover~.progress-widget__rings [data-units="d"],
    [data-group="h"]:focus~.progress-widget__rings [data-units="h"],
    [data-group="h"]:hover~.progress-widget__rings [data-units="h"] {
      opacity: 1;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg: hsl(223, 10%, 5%);
        --fg: hsl(223, 10%, 90%);
      }

      .progress-widget__ring {
        opacity: 0.2;
      }
    }
  </style>
</head>
<body>
  <div id="progress-widget" class="progress-widget">
    <button class="progress-widget__time-date" data-group="d" type="button">
      <small data-unit="w">95du MaoTai</small><br>
      <span data-unit="mo">Battery</span>
    </button>
    <button class="progress-widget__digit" data-unit="h" data-group="h" type="button">${batteryDigit} %</button>
    <span class="progress-widget__time-ampm" data-unit="ap">async</span>
    <svg class="progress-widget__rings" width="256" height="256" viewbox="0 0 256 256">
      <defs>
        <lineargradient id="pc-red" x1="1" y1="0.5" x2="0" y2="0.5">
          <stop offset="0%" stop-color="hsl(273, 90%, 55%)">
          </stop>
          </stop>
          <stop offset="100%" stop-color="hsl(323, 90%, 55%)">
          </stop>
        </lineargradient>
        <lineargradient id="pc-yellow" x1="1" y1="0.5" x2="0" y2="0.5">
          <stop offset="0%" stop-color="hsl(43, 90%, 55%)">
          </stop>
          <stop offset="100%" stop-color="hsl(23, 90%, 55%)">
          </stop>
        </lineargradient>
      </defs>
      <g data-units="d">
        <circle class="progress-widget__ring" cx="128" cy="128" r="91" fill="none" opacity="0.1" stroke="url(#pc-red)" stroke-width="22"></circle>
        <circle class="progress-widget__ring-fill" data-ring="mo" cx="128" cy="128" r="91" fill="none" stroke="url(#pc-red)" stroke-width="22" stroke-dasharray="571.5 571.5" stroke-dashoffset="571.5" stroke-linecap="round" transform="rotate(-90, 128, 128)">
        </circle>
      </g>
      <!-- 外层 -->
      <g data-units="h">
        <circle class="progress-widget__ring" cx="128" cy="128" r="116.6" fill="none" opacity="0.1" stroke="url(#pc-yellow)" stroke-width="22"></circle>
        <circle class="progress-widget__ring-fill" data-ring="d" cx="128" cy="128" r="116.6" fill="none" stroke="url(#pc-yellow)" stroke-width="22" stroke-dasharray="733 733" stroke-dashoffset="733" stroke-linecap="round" transform="rotate(-90, 128, 128)">
        </circle>
      </g>
    </svg>
  </div>
  <script>
    window.addEventListener("DOMContentLoaded", () => {
      const widget = new ProgressWidget("#progress-widget");
    });
    class ProgressWidget {
      constructor(qs) {
        this.el = document.querySelector(qs);
        this.update();
      }
      update() {
          const units = [{
            label: "mo",
            progress: ${battery}
          }, {
            label: "d",
            progress: ${outer}
          }];
          units.forEach(u => {
            const ring = this.el.querySelector(\`[data-ring="\${u.label}"]\`);
          
          if (ring) {
            const circumference = +ring.getAttribute("stroke-dasharray").split(" ")[0];
            const offset = (1 - u.progress) * circumference;
            ring.setAttribute("stroke-dashoffset", offset);
          }
        });
      }
    }
  </script>
  <script src="https://www.jq22.com/jquery/jquery-1.10.2.js"></script>
</body>
</html>
`
const webView = new WebView()
await webView.loadHTML(html)
await webView.present()