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