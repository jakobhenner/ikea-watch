<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
:root {
  --gutter: 20px;
  --color-fg-primary: #111;
  --color-fg-secondary: #767676;
  --color-bg: #fff;
  --size-button-default: 44px;
  --size-button-large: calc(var(--size-button-default) / (24 / 64));
}

/*
Style guide
*/
h1,
h2,
p {
  font-weight: normal;
  margin: 0px;
  padding: 0px;
}
h1 {
  font-size: 80px;
  margin-top: 28px;
  margin-bottom: 32px;
  line-height: 100%;
  letter-spacing: -4px;
}

h2 {
  font-size: 40px;
  line-height: 100%;
  margin-bottom: 6px;
  letter-spacing: -1px;
}

.color-secondary {
  color: var(--color-fg-secondary);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0px;
  padding: 0px;
  font-size: 16px;
  color: var(--color-fg-primary);
}
@font-face {
  font-family: "Noto IKEA";
  font-weight: normal;
  src: url("./assets/NotoIKEALatin-Regular.ttf");
}
#app {
  font-family: Noto IKEA, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
