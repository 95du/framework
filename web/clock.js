// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: star-of-david;
<head>
  <style>
    .clock-center {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    button {
      margin: 0; /* 去除外边距 */
      padding: 0; /* 去除内边距 */
      border: none;
      color: var(--fg);
      font: 0.5em/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    body {
      background-color: var(--bg);
      height: 90vh;
      display: grid;
      place-items: center;
    }

    .progress-clock {
      display: grid;
      justify-content: center;
      align-content: center;
      position: relative;
      text-align: center;
      width: 16em;
      height: 16em;
    }

    .progress-clock__time-date,
    .progress-clock__time-digit,
    .progress-clock__time-colon,
    .progress-clock__time-ampm {
      transition: color 0.2s linear;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
    }

    .progress-clock__time-date,
    .progress-clock__time-digit {
      background: transparent;
    }

    .progress-clock__time-date,
    .progress-clock__time-ampm {
      grid-column: 1 / 6;
    }

    .progress-clock__time-date {
      font-size: 0.75em;
      line-height: 1.33;
    }

    .progress-clock__time-digit,
    .progress-clock__time-colon {
      font-size: 2em;
      font-weight: 400;
      grid-row: 2;
    }

    .progress-clock__time-colon {
      line-height: 1.275;
    }

    .progress-clock__time-ampm {
      cursor: default;
      grid-row: 3;
    }

    .progress-clock__rings {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }

    .progress-clock__ring {
      opacity: 0.1;
    }

    .progress-clock__ring-fill {
      transition:
        opacity 0s 0.3s linear,
        stroke-dashoffset 0.3s ease-in-out;
    }

    .progress-clock__ring-fill--360 {
      opacity: 0;
      stroke-dashoffset: 0;
      transition-duration: 0.3s;
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

    [data-group="m"]:focus,
    [data-group="m"]:hover {
      color: hsl(213, 90%, 55%);
    }

    [data-group="s"]:focus,
    [data-group="s"]:hover {
      color: hsl(273, 90%, 55%);
    }

    [data-group]:focus~.progress-clock__rings [data-units],
    [data-group]:hover~.progress-clock__rings [data-units] {
      opacity: 0.2;
    }

    [data-group="d"]:focus~.progress-clock__rings [data-units="d"],
    [data-group="d"]:hover~.progress-clock__rings [data-units="d"],
    [data-group="h"]:focus~.progress-clock__rings [data-units="h"],
    [data-group="h"]:hover~.progress-clock__rings [data-units="h"],
    [data-group="m"]:focus~.progress-clock__rings [data-units="m"],
    [data-group="m"]:hover~.progress-clock__rings [data-units="m"],
    [data-group="s"]:focus~.progress-clock__rings [data-units="s"],
    [data-group="s"]:hover~.progress-clock__rings [data-units="s"] {
      opacity: 1;
    }

    /* Dark theme */
    @media (prefers-color-scheme: dark) {
      .progress-clock__ring {
        opacity: 0.25;
      }
    }
  </style>
</head>
<body>
  <div class="clock-center">
    <div id="clock" class="progress-clock">
      <button class="progress-clock__time-date" data-group="d" type="button">
        <small data-unit="w">Sunday</small><br>
        <span data-unit="mo">January</span>
        <span data-unit="d">1</span>
      </button>
      <button class="progress-clock__time-digit" data-unit="h" data-group="h" type="button">12</button>
      <span class="progress-clock__time-colon">:</span>
      <button class="progress-clock__time-digit" data-unit="m" data-group="m" type="button">00</button>
      <span class="progress-clock__time-colon">:</span>
      <button class="progress-clock__time-digit" data-unit="s" data-group="s" type="button">00</button>
      <span class="progress-clock__time-ampm" data-unit="ap">AM</span>
      <svg class="progress-clock__rings" width="256" height="256" viewbox="0 0 256 256">
        <defs>
          <lineargradient id="pc-red" x1="1" y1="0.5" x2="0" y2="0.5">
            <stop offset="0%" stop-color="hsl(343,90%,55%)">
            </stop>
            <stop offset="100%" stop-color="hsl(323,90%,55%)">
            </stop>
          </lineargradient>
          <lineargradient id="pc-yellow" x1="1" y1="0.5" x2="0" y2="0.5">
            <stop offset="0%" stop-color="hsl(43,90%,55%)">
            </stop>
            <stop offset="100%" stop-color="hsl(23,90%,55%)">
            </stop>
          </lineargradient>
          <lineargradient id="pc-blue" x1="1" y1="0.5" x2="0" y2="0.5">
            <stop offset="0%" stop-color="hsl(223,90%,55%)">
            </stop>
            <stop offset="100%" stop-color="hsl(203,90%,55%)">
            </stop>
          </lineargradient>
          <lineargradient id="pc-purple" x1="1" y1="0.5" x2="0" y2="0.5">
            <stop offset="0%" stop-color="hsl(283,90%,55%)">
            </stop>
            <stop offset="100%" stop-color="hsl(263,90%,55%)">
            </stop>
          </lineargradient>
        </defs>
        <!-- Days of Month -->
        <g data-units="d">
          <circle class="progress-clock__ring" cx="128" cy="128" r="74" fill="none" opacity="0.1" stroke="url(#pc-red)" stroke-width="12"></circle>
          <circle class="progress-clock__ring-fill" data-ring="mo" cx="128" cy="128" r="74" fill="none" stroke="url(#pc-red)" stroke-width="12" stroke-dasharray="465 465" stroke-dashoffset="465" stroke-linecap="round" transform="rotate(-90,128,128)">
          </circle>
        </g>
        <!-- Hours of Day -->
        <g data-units="h">
          <circle class="progress-clock__ring" cx="128" cy="128" r="90" fill="none" opacity="0.1" stroke="url(#pc-yellow)" stroke-width="12"></circle>
          <circle class="progress-clock__ring-fill" data-ring="d" cx="128" cy="128" r="90" fill="none" stroke="url(#pc-yellow)" stroke-width="12" stroke-dasharray="565.5 565.5" stroke-dashoffset="565.5" stroke-linecap="round" transform="rotate(-90,128,128)">
          </circle>
        </g>
        <!-- Minutes of Hour -->
        <g data-units="m">
          <circle class="progress-clock__ring" cx="128" cy="128" r="106" fill="none" opacity="0.1" stroke="url(#pc-blue)" stroke-width="12"></circle>
          <circle class="progress-clock__ring-fill" data-ring="h" cx="128" cy="128" r="106" fill="none" stroke="url(#pc-blue)" stroke-width="12" stroke-dasharray="666 666" stroke-dashoffset="666" stroke-linecap="round" transform="rotate(-90,128,128)">
          </circle>
        </g>
        <!-- Seconds of Minute -->
        <g data-units="s">
          <circle class="progress-clock__ring" cx="128" cy="128" r="122" fill="none" opacity="0.1" stroke="url(#pc-purple)" stroke-width="12"></circle>
          <circle class="progress-clock__ring-fill" data-ring="m" cx="128" cy="128" r="122" fill="none" stroke="url(#pc-purple)" stroke-width="12" stroke-dasharray="766.5 766.5" stroke-dashoffset="766.5" stroke-linecap="round" transform="rotate(-90,128,128)">
          </circle>
        </g>
      </svg>
    </div>
  </div>
  <script>  
    window.addEventListener("DOMContentLoaded", () => {
      const clock = new ProgressClock("#clock");
    });
    
    class ProgressClock {
      constructor(qs) {
        this.el = document.querySelector(qs);
        this.time = 0;
        this.updateTimeout = null;
        this.ringTimeouts = [];
        this.update();
      }
    
      getDayOfWeek(day) {
        switch (day) {
          case 1:
            return "Monday";
          case 2:
            return "Tuesday";
          case 3:
            return "Wednesday";
          case 4:
            return "Thursday";
          case 5:
            return "Friday";
          case 6:
            return "Saturday";
          default:
            return "Sunday";
        }
      }
    
      getMonthInfo(mo, yr) {
        switch (mo) {
          case 1:
            return {
              name: "February",
              days: yr % 4 === 0 ? 29 : 28,
            };
          case 2:
            return {
              name: "March",
              days: 31,
            };
          case 3:
            return {
              name: "April",
              days: 30,
            };
          case 4:
            return {
              name: "May",
              days: 31,
            };
          case 5:
            return {
              name: "June",
              days: 30,
            };
          case 6:
            return {
              name: "July",
              days: 31,
            };
          case 7:
            return {
              name: "August",
              days: 31,
            };
          case 8:
            return {
              name: "September",
              days: 30,
            };
          case 9:
            return {
              name: "October",
              days: 31,
            };
          case 10:
            return {
              name: "November",
              days: 30,
            };
          case 11:
            return {
              name: "December",
              days: 31,
            };
          default:
            return {
              name: "January",
              days: 31,
            };
        }
      }
    
      update() {
        this.time = new Date();
        if (this.el) {
          // date and time
          const dayOfWeek = this.time.getDay();
          const year = this.time.getFullYear();
          const month = this.time.getMonth();
          const day = this.time.getDate();
          const hr = this.time.getHours();
          const min = this.time.getMinutes();
          const sec = this.time.getSeconds();
          const dayOfWeekName = this.getDayOfWeek(dayOfWeek);
          const monthInfo = this.getMonthInfo(month, year);
          const m_progress = sec / 60;
          const h_progress = (min + m_progress) / 60;
          const d_progress = (hr + h_progress) / 24;
          const mo_progress = ((day - 1) + d_progress) / monthInfo.days;
          const units = [{
            label: "w",
            value: dayOfWeekName
          }, {
            label: "mo",
            value: monthInfo.name,
            progress: mo_progress
          }, {
            label: "d",
            value: day,
            progress: d_progress
          }, {
            label: "h",
            value: hr > 12 ? hr - 12 : hr,
            progress: h_progress
          }, {
            label: "m",
            value: min < 10 ? "0" + min : min,
            progress: m_progress
          }, {
            label: "s",
            value: sec < 10 ? "0" + sec : sec
          }, {
            label: "ap",
            value: hr > 12 ? "PM" : "AM"
          }];
    
          // 清除所有的计时器
          this.ringTimeouts.forEach(t => {
            clearTimeout(t);
          });
          this.ringTimeouts = [];
    
          units.forEach(u => {
            const ring = this.el.querySelector(\`[data-ring="\${u.label}"]\`);
    
            if (ring) {
              const strokeDashArray = ring.getAttribute("stroke-dasharray");
              const fill360 = "progress-clock__ring-fill--360";
    
              if (strokeDashArray) {
                const circumference = +strokeDashArray.split(" ")[0];
                const strokeDashOffsetPct = 1 - u.progress;
                ring.setAttribute(
                  "stroke-dashoffset",
                  strokeDashOffsetPct * circumference
                );
    
                // 添加淡出过渡然后移除
                if (strokeDashOffsetPct === 1) {
                  ring.classList.add(fill360);
                  this.ringTimeouts.push(
                    setTimeout(() => {
                      ring.classList.remove(fill360);
                    }, 600)
                  );
                }
              }
            }
    
            const unit = this.el.querySelector(\`[data-unit="\${u.label}"]\`);
            if (unit) unit.innerText = u.value;
          });
        }
        clearTimeout(this.updateTimeout);
        this.updateTimeout = setTimeout(this.update.bind(this), 1e3);
      }
    }
  </script>
  <script src="https://www.jq22.com/jquery/jquery-1.10.2.js"></script>
</body>