<template>
  <div class="card">
    <div class="canvas">
      <div class="video" :style="canvas" @click="toggleControlsVisibility">
        <img v-if="cover" :src="cover" />
        <video v-else :src="preview" loop autoplay muted playsinline></video>
        <transition name="fade">
          <div class="overlay" v-show="controlsVisible" />
        </transition>
        <transition name="fade">
          <controls v-show="controlsVisible" />
        </transition>
      </div>
    </div>
    <div class="details" :style="mask">
      <h1>{{ name }}</h1>
      <p>
        Kaja Hengstenberg is a German-Polish recipe developer now living in
        Sweden. Watch as she makes a fennel salad with olives, nectarines,
        ricotta and toasted almonds.
      </p>
      <tags />
    </div>
  </div>
</template>

<script>
import { scaleLinear } from "d3-scale";

import Tags from "@/components/Tags";
import Controls from "@/components/Controls";

const yScale = scaleLinear().domain([0, 1]).range([200, 0]);
const maskScale = scaleLinear().domain([0, 1]).range([0, 100]);

export default {
  props: {
    t: {
      type: Number,
      default: 0,
    },
    scale: {
      type: Number,
      default: 1,
    },
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
    autoplay: Boolean,
    name: String,
    preview: String,
    cover: String,
  },
  components: {
    Tags,
    Controls,
  },
  data() {
    return {
      backgroundColor: "transparent", //"hsl(" + Math.random() * 360 + ",100%,50%)",
      controlsVisible: false,
      controlsTimeout: null,
      controlsTimeoutDuration: 4000,
    };
  },
  methods: {
    toggleControlsVisibility() {
      this.setControlsVisibility(!this.controlsVisible);
    },
    setControlsVisibility(bool) {
      if (this.controlsTimeout) {
        clearTimeout(this.controlsTimeout);
      }
      this.controlsVisible = bool;

      if (bool) {
        this.controlsTimeout = setTimeout(() => {
          this.controlsVisible = false;
          this.controlsTimeout = null;
        }, this.controlsTimeoutDuration);
      }
    },
  },
  computed: {
    mask() {
      const y = yScale(this.t);
      const mask = maskScale(this.t);

      return {
        clipPath: `polygon(0% 0%, 100% 0%, 100% ${mask}%, 0% ${mask}%)`,
        //opacity: this.t,
        transform: `translateY(${y}px) translateZ(0px)`,
      };
    },
    canvas() {
      return {
        backgroundColor: this.backgroundColor,
        transform: `translateX(${this.x}px) translateY(${this.y}px) scale(${this.scale}) translateZ(0px)`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  overflow: auto;
  height: 100vh;
  scroll-snap-type: y mandatory;
  scroll-padding-top: 72px;
  padding-top: 72px;

  &::-webkit-scrollbar {
    display: none;
  }

  .overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    mix-blend-mode: soft-light;
    background: white;
    //transform: translateZ(0px);
  }

  .canvas {
    //aspect-ratio: 15/26;
    height: calc(26 / 15 * 100vw);
    max-height: 85vh;
    scroll-snap-align: start;
    position: relative;
    z-index: 1;

    .video,
    video,
    img {
      position: absolute;
      width: 100%;
      height: 100%;
      transform-origin: 0% 0%;
    }
    video,
    img {
      object-fit: cover;
      object-position: center;
    }
  }
  .details {
    background-color: var(--color-bg);
    min-height: 50vh;
    scroll-snap-align: end;
    padding: 0 var(--gutter);
  }
}
</style>
