<template>
  <div class="navigation">
    <div class="logo" v-html="logo" />
    <ul>
      <li v-for="item in items" :key="item">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logo: require("@/assets/logo.svg").default,
      items: ["For you", "Cooking", "Music", "Aesthetics", "Sustainable"],
    };
  },
};
</script>

<style lang="scss" scoped>
.navigation {
  position: fixed;
  padding-top: 40px;
  top: 0;
  left: var(--gutter);
  //background: var(--color-bg);
  z-index: 100000;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: nowrap;
    white-space: nowrap;
    height: 60px;
    align-items: center;
    grid-column-gap: 24px;
    color: var(--color-fg-secondary);
    display: none;

    li {
      &:first-child {
        color: var(--color-fg-primary);
      }
    }
  }
}
</style>
