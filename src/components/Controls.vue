<template>
  <div class="controls">
    <main>
      <Btn icon="AV/Pause" large />
    </main>
    <footer class="theme dark">
      <div class="progress">
        <div
          class="current"
          :style="{ width: `${Math.random() * 100}%` }"
        ></div>
      </div>
      <div class="actions">
        <span>
          <Icon name="AV/Volume On" />
          <Icon name="AV/CC" />
          <Icon name="Actions/Expand" />
        </span>
        <span>
          <Icon name="Content/Tag" />
        </span>
      </div>
    </footer>
  </div>
</template>

<script>
import Btn from "@/components/Btn";
import Icon from "@/components/Icon";
export default {
  components: {
    Btn,
    Icon,
  },
};
</script>

<style lang="scss" scoped>
.controls {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: grid;
  grid-template-rows: 1fr minmax(min-content, max-content);
  transform: translateZ(0px);

  main {
    align-self: center;
    justify-self: center;
    position: relative;
  }

  footer {
    background: transparent;
    padding: 0px var(--gutter);
    padding-bottom: 32px;
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-row-gap: 16px;
    position: relative;

    .progress {
      height: 8px;
      background: var(--color-bg);

      .current {
        background: var(--color-fg-primary);
        width: 40%;
        height: inherit;
      }
    }

    .actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    span {
      display: flex;
      grid-column-gap: 28px;
      &:last-child {
        justify-self: end;
      }
    }
  }
}
</style>
