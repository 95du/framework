<head>
  <meta charset="utf-8" >
  <meta name="viewport" content="width=device-width,initial-scale=1.0, user-scalable=no"/>
  <link rel="stylesheet" href="https://c.runoob.com/wp-content/themes/toolrunoob2/bootstrap.min.css">
  <link rel="stylesheet" href="https://static.runoob.com/assets/js/shadowlord/dist/css/app.css?1.00" media="all"/>
</head>

<style>
.runoob-page-content {
    margin: 0 30px;
}
</style>
<div class="runoob-page-content">

<header class="flex items-center">
  <div class="header__logo mr05"></div>
  <button class="mdc-icon-button" data-btn-info type="button" aria-label="project info" style="display:none;">
  </button>
  <div class="header__input-wrapper flex flex-auto">
    <div class="flex items-center">
      <button class="mdc-button" data-btn-color-picker type="button" aria-label="toggle color picker dialog">
        <span class="mdc-button__ripple"></span>
        <svg class="mdc-button__icon" width="20" height="20" viewBox="0 0 1024 1024" aria-hidden="true">
          <path d="M941.226667 346.737778c129.365333-155.420444 85.902222-195.470222 5.12-276.878222-62.748444-63.374222-114.005333-118.727111-272.839111 6.883555l267.719111 269.994667zM594.090667 146.375111c-13.653333 12.913778-27.875556 26.794667-42.780445 41.870222l-419.555555 423.082667c-59.164444 55.921778-157.411556 370.232889-123.448889 404.48 33.905778 34.190222 342.471111-57.856 399.644444-123.107556l420.977778-424.504888c14.961778-15.018667 28.842667-29.297778 41.756444-42.894223l-276.593777-278.926222z" fill="#3F8BFF" />
        </svg>
        <span class="mdc-button__label header__preview-color"></span>
      </button>
    </div>
    <label data-color-input class="mdc-text-field mr05">
      <span class="mdc-text-field__ripple"></span>
      <input id="mdc-color" class="mdc-text-field__input" aria-labelledby="text-field-color-input" value="#6200ee" required>
      <span class="mdc-floating-label" id="text-field-color-input">Color</span>
      <span class="mdc-line-ripple"></span>
    </label>
    <label data-percent-input class="mdc-text-field mdc-text-field--with-leading-icon">
      <span class="mdc-text-field__ripple"></span>
      <span class="mdc-text-field__icon mdc-text-field__icon--leading">
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.5 3.5L20.5 5.5L5.5 20.5L3.5 18.5L18.5 3.5M7 4C8.66 4 10 5.34 10 7C10 8.66 8.66 10 7 10C5.34 10 4 8.66 4 7C4 5.34 5.34 4 7 4M17 14C18.66 14 20 15.34 20 17C20 18.66 18.66 20 17 20C15.34 20 14 18.66 14 17C14 15.34 15.34 14 17 14M7 6C6.45 6 6 6.45 6 7C6 7.55 6.45 8 7 8C7.55 8 8 7.55 8 7C8 6.45 7.55 6 7 6M17 16C16.45 16 16 16.45 16 17C16 17.55 16.45 18 17 18C17.55 18 18 17.55 18 17C18 16.45 17.55 16 17 16Z" />
        </svg>
      </span>
      <input class="mdc-text-field__input" aria-labelledby="text-field-percent-input" type="number" inputmode="decimal" value="10" min="1" max="100" step="0.1" required>
      <span class="mdc-floating-label" id="text-field-percent-input">Percent factor</span>
      <span class="mdc-line-ripple"></span>
    </label>
  </div>
  <div class="header__random-btn">
    <button class="mdc-icon-button" data-btn-random type="button" aria-label="generate tints and shades from a random color">
      <svg class="mdc-icon-button__icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.83,13.41L13.42,14.82L16.55,17.95L14.5,20H20V14.5L17.96,16.54L14.83,13.41M14.5,4L16.54,6.04L4,18.59L5.41,20L17.96,7.46L20,9.5V4M10.59,9.17L5.41,4L4,5.41L9.17,10.58L10.59,9.17Z" />
      </svg>
    </button>
  </div>
</header>

<main></main>
<script src="https://static.runoob.com/assets/js/shadowlord/dist/js/index.js"></script>