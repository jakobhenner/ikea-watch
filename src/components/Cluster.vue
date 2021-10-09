<template>
  <div class="cluster theme" :class="{ disabled: disabled, dark: dark }">
    <div class="scroller">
      <div
        class="cell"
        ref="Cells"
        v-for="(item, n) in computedItems"
        :key="n + timeout"
        :style="setStyle(n)"
      >
        <card :t="tween.t" v-bind="getCardProps(n)" :autoplay="n === 0" />
      </div>
    </div>
    <div class="cta" ref="Cta">
      <div class="btn-container" ref="Btn" :style="buttonStyle">
        <Btn :rotate="rotate" @click="toggle" large />
      </div>
    </div>
    <div class="gesture" ref="gesture" v-show="expanded"></div>
    <header :style="headerStyle">
      <h2>{{ name }}</h2>
      <p class="color-secondary">{{ subheading }}</p>
    </header>
  </div>
</template>

<script>
import gsap from "gsap";
import hammer from "hammerjs";
import { scaleLinear } from "d3-scale";

import Card from "@/components/Card";
import Btn from "@/components/Btn";

export default {
  components: {
    Card,
    Btn,
  },
  props: {
    name: String,
    subheading: String,
    isIntersecting: Boolean,
    intersectionRatio: Number,
    dark: Boolean,
    expanded: Boolean,
    shuffle: Boolean,
    items: {
      type: Array,
      default() {
        return [
          {
            name: "Birds",
            preview: require("@/assets/videos/birds.mp4"),
          },
          {
            name: "Trains",
            preview: require("@/assets/videos/stockholm-short.mp4"),
          },
          {
            name: "MØ",
            preview: require("@/assets/videos/mo-short.mp4"),
          },
          {
            name: "CPH",
            preview: require("@/assets/videos/cph-short.mp4"),
          },
        ];
      },
    },
  },
  data() {
    return {
      tween: {
        t: 0,
      },
      bounds: {
        self: {},
        cta: {},
        cells: [],
      },
      cellTransforms: [],
      ready: false,
      panYThreshold: 300,
      timeout: null,
      computedItems: this.items,
    };
  },
  methods: {
    initGestures() {
      this.manager = new hammer.Manager(this.$refs.gesture); // this.$refs.footer
      this.pan = new hammer.Pan({
        threshold: 0,
        direction: hammer.DIRECTION_VERTICAL,
      });

      this.manager.add([this.pan]);

      this.manager.on("panstart", this.onPanStart);
      this.manager.on("panend pancancel", this.onPanEnd);
      this.manager.on("panmove", this.onPanMove);
    },
    onPanStart(e) {
      //this.setFingerState(true);
      this.$emit("expanded", true);
    },
    onPanMove(e) {
      let t = this.panT(e.deltaY);

      if (t >= 1) t = 1 + (t - 1) / 3;

      this.tween.t = t;
    },
    onPanEnd(e) {
      let t = this.expanded ? 1 : 0;

      const deltaY = Math.abs(e.deltaY);
      const velocityY = Math.abs(e.velocityY);

      if (deltaY > 10 || velocityY > 0.5) {
        t = e.deltaY > 0 ? 0 : 1;
      }

      this.animateView(t);
    },
    animateView(t) {
      if (this.animation) this.animation.kill();

      this.$emit("expanded", true);

      const ease = t === 1 ? "back.inOut(.5)" : "back.out(0.25)";
      const duration = t === 1 ? 1 : 0.75;

      this.animation = gsap.to(this.tween, {
        t,
        ease,
        duration,
        onUpdate: () => {
          this.$emit("t", this.tween.t);
        },
        onComplete: () => {
          const bool = this.tween.t === 1;
          this.$emit("expanded", bool);
        },
      });
    },
    toggle(e) {
      const t = this.tween.t === 0 ? 1 : 0;

      this.animateView(t);
    },
    getProps(n) {
      if (!this.ready || !this.cellProperties) return;

      return this.cellProperties[n];
    },
    setStyle(n) {
      const props = this.getProps(n);

      if (!props) return;

      return {
        transform: `translateX(${props.offsetX}px) translateZ(0px)`,
        zIndex: props.zIndex,
        pointerEvents: this.ready && !this.disabled ? "all" : "none",
      };
    },
    getCardProps(n) {
      const props = this.getProps(n);

      if (!props) return;

      return {
        ...this.computedItems[n],
        scale: props.scale,
        x: props.x,
        y: props.y,
      };
    },
    getRandomProps(cell) {
      const bounds = cell.getBoundingClientRect();

      let seed = Math.random();

      const s = scaleLinear().domain([0, 1]).range([0.25, 0.55]);

      const scale = s(seed);

      const maxX = window.innerWidth - bounds.width * scale - 20;
      const maxY = window.innerHeight - bounds.height * scale - 40;

      const y = scaleLinear()
        .domain([0, 1])
        .range([maxY / 4, maxY]);
      const x = scaleLinear().domain([0, 1]).range([20, maxX]);

      return {
        scale,
        x: x(seed),
        y: y(seed),
      };
    },
    shuffleCells() {
      if (!this.shuffle || this.expanded) return;
      if (this.intersectionRatio < 0.1 || !this.isIntersecting) {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = null;
        return;
      }

      this.computedItems = this.computedItems.sort(() => Math.random() - 0.5);

      console.log("shuffle");

      this.$refs.Cells.forEach((cell, n) => {
        //       const bounds = cell.getBoundingClientRect();
        //       this.bounds.cells.push(bounds);
        //
        const props = this.getRandomProps(cell);
        this.cellTransforms[n] = props;
      });

      this.timeout = setTimeout(this.shuffleCells, 700);
    },
  },
  computed: {
    disabled() {
      return !this.expanded;
    },
    buttonScales() {
      const maxX = this.bounds.cta.x - 20;
      const maxY = -this.bounds.cta.y + this.bounds.self.y + 14;

      return {
        scale: scaleLinear()
          .domain([0, 1])
          .range([1, 24 / 64]),
        rotate: scaleLinear().domain([0, 1]).range([-45, 135]),
        y: scaleLinear().domain([0, 1]).range([0, maxY]),
        x: scaleLinear().domain([0, 1]).range([0, maxX]),
      };
    },
    rotate() {
      return this.buttonScales.rotate(this.tween.t);
    },
    buttonStyle() {
      const button = this.buttonScales;
      const t = this.tween.t;

      const scale = button.scale(t);
      const x = button.x(t) / scale;
      const y = button.y(t) / scale;

      return {
        transform: `scale(${scale}) translateX(${x}px) translateY(${y}px) translateZ(0px)`,
      };
    },
    panT() {
      const domain = this.expanded
        ? [0, this.panYThreshold]
        : [0, -this.panYThreshold];
      const range = this.expanded ? [1, 0] : [0, 1];

      return scaleLinear().domain(domain).range(range);
    },
    cellProperties() {
      if (!this.ready) return;
      const t = this.tween.t;

      return this.computedItems.map((_, n) => {
        const bounds = this.bounds.cells[n];
        const cell = this.cellTransforms[n];

        const scale = scaleLinear().domain([0, 1]).range([cell.scale, 1]);
        const offsetX = scaleLinear().domain([0, 1]).range([-bounds.x, 0]);

        const x = scaleLinear().domain([0, 1]).range([cell.x, 0]);
        const y = scaleLinear().domain([0, 1]).range([cell.y, 0]);

        const zIndex = this.shuffle ? n : this.cellTransforms.length - n;

        return {
          offsetX: offsetX(t),
          scale: scale(t),
          x: x(t),
          y: y(t),
          zIndex,
          timeout: this.timeout,
        };
      });
    },
    headerStyle() {
      const y = this.tween.t * -100;
      return {
        transform: `translateY(${y}%) translateZ(0px)`,
      };
    },
  },
  watch: {
    expanded() {
      if (!this.expanded && this.shuffle) {
        this.shuffleCells();
      }
    },
    intersectionRatio() {
      if (this.shuffle && !this.timeout && this.intersectionRatio > 0.1) {
        this.shuffleCells();
      }
    },
  },
  mounted() {
    this.bounds.self = this.$el.getBoundingClientRect();
    this.bounds.cta = this.$refs.Cta.getBoundingClientRect();

    this.$refs.Cells.forEach((cell, n) => {
      const bounds = cell.getBoundingClientRect();
      this.bounds.cells.push(bounds);

      const props = this.getRandomProps(cell);

      this.cellTransforms.push(props);
    });

    if (this.shuffle) {
      this.shuffleCells();
    }

    this.initGestures();
    this.$nextTick(() => {
      this.ready = true;
    });
  },
  beforeDestroy() {
    if (this.timeout) {
      clearInterval(this.timeout);
    }
  },
};
</script>

<style lang="scss" scoped>
.cluster {
  width: 100vw;
  height: 100vh;
  position: relative;
  scroll-snap-align: start;

  &.disabled {
    pointer-events: none;

    .scroller,
    .gesture {
      pointer-events: none;
    }

    .scroller .cell {
      pointer-events: none;
    }
  }

  .scroller {
    display: grid;
    display: flex;
    flex-wrap: nowrap;
    align-items: flex-end;
    grid-column-gap: 0px;
    scroll-snap-type: x mandatory;
    overflow-x: scroll;
    pointer-events: all;

    &::-webkit-scrollbar {
      display: none;
    }

    .cell {
      scroll-snap-align: start;
      flex: 0 0 100vw;
      position: relative;
      pointer-events: all;
    }
  }

  header {
    position: absolute;
    top: 0;
    padding-top: 100px;
    padding-bottom: 80px;
    left: var(--gutter);
    pointer-events: none;
    z-index: 100;
    max-width: 80%;
  }

  .gesture {
    height: 10vh;
    position: absolute;
    width: 100%;
    top: 72px;
    z-index: 100;
    pointer-events: all;
  }

  .cta {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;

    .btn-container {
      pointer-events: all;
      transform-origin: 100% 0%;
    }
  }
}
</style>
