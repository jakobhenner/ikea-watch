<template>
  <div
    @click="$emit('click')"
    :class="`icon icon--${name}`"
    v-html="content"
    :style="style"
  />
</template>

<script>
export default {
  name: "Icon",
  props: {
    name: {
      type: String,
      required: true,
    },
    folder: {
      type: String,
      default: "24",
    },
    size: {
      type: Number,
      default: 24,
    },
  },
  computed: {
    content() {
      const svg = require(`@/assets/icons/${this.name}.svg`);
      return svg.default;
    },
    style() {
      if (!this.size) return false;

      return {
        width: `${this.size}px`,
        height: `${this.size}px`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  width: 100%;
  height: 100%;
}
</style>

<style>
.icon svg {
  width: 100%;
  height: 100%;
}
</style>
