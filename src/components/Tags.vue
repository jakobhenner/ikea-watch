<template>
  <div class="tags">
    <div class="tag" v-for="tag in tags" :key="tag">
      {{ tag }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      default() {
        return ["Cooking", "Lunch", "Swedish"];
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.tags {
  margin-top: 24px;
  color: var(--color-fg-secondary);
  .tag {
    display: inline-flex;
    margin-right: 4px;

    &::before {
      content: "\00a0\00a0·\00a0\00a0";
    }
    &:first-child {
      &::before {
        content: "\00a0";
        margin-left: -2px;
      }
    }
  }
}
</style>
