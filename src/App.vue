<template>
  <div id="app">
    <div class="left"></div>
    <div class="right">
      <div class="title-container">title</div>
      <router-view />
    </div>
  </div>
</template>

<script>
export default {};
</script>script

<style lang="scss">
html,
body {
  margin: 0;
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  display: flex;
  height: 100%;
}

.title-container {
  height: 52px;
  background: #f0f0f0;
  text-align: left;
  line-height: 52px;
  font-size: 28px;
  color: #333;
  -webkit-app-region: drag;
  padding-left: 20px;
}

.left {
  width: 80px;
  background: #2c3e50;
  -webkit-app-region: drag;
  height: 100%;
}
.right {
  flex: 1;
  // background: #42b983;
  height: 100%;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
