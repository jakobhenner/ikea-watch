<template>
  <div class="btn" :class="{ large: large }" @click="$emit('click', $event)">
    <Icon :style="style" :name="icon" :size="size" />
  </div>
</template>

<script>
import Icon from "@/components/Icon";

export default {
  components: {
    Icon,
  },
  props: {
    large: Boolean,
    icon: {
      type: String,
      default: "Arrows/Arrow Right",
    },
    rotate: Number,
  },
  computed: {
    size() {
      if (this.large) {
        return 64;
      }
    },
    style() {
      return {
        transform: `rotate(${this.rotate}deg) translateZ(0px)`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.btn {
  width: var(--size-button-default);
  height: var(--size-button-default);
  border-radius: var(--size-button-default);
  background-color: var(--color-fg-primary);
  color: var(--color-bg);
  display: grid;
  place-items: center;

  &.large {
    width: var(--size-button-large);
    height: var(--size-button-large);
    border-radius: var(--size-button-large);
  }
}
</style>
