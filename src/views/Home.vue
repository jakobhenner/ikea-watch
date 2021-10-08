<template>
  <div class="home" :class="{ disabled: anyClusterExpanded }">
    <navigation :style="navigationStyle" />
    <div class="clusters">
      <!-- <div class="cover"></div> -->
      <cluster
        ref="clusters"
        v-for="cluster in clusters"
        :key="cluster.name"
        v-bind="cluster"
        @t="t = $event"
        @expanded="anyClusterExpanded = $event"
      />
    </div>
  </div>
</template>

<script>
import Cluster from "@/components/Cluster";
import Navigation from "@/components/Navigation";

import { scaleLinear } from "d3-scale";

export default {
  name: "Home",
  components: {
    Cluster,
    Navigation,
  },
  data() {
    return {
      t: 0,
      anyClusterExpanded: false,
      clusters: [
        {
          name: "Mixed tape",
          intersectionRatio: 0,
          isIntersecting: false,
          items: [
            {
              name: "MØ",
              preview: require("@/assets/videos/cph-short.mp4"),
            },
            {
              name: "Maego",
              cover: require("@/assets/img/thumbnails/1.jpg"),
            },
            {
              name: "KANIS",
              cover: require("@/assets/img/thumbnails/2.jpg"),
            },
            {
              name: "NIKI",
              cover: require("@/assets/img/thumbnails/3.jpg"),
            },
          ],
        },
        {
          name: "New releases",
          intersectionRatio: 0,
          isIntersecting: false,
          items: [
            {
              name: "Maego",
              cover: require("@/assets/img/thumbnails/5.jpg"),
            },
            {
              name: "MØ",
              preview: require("@/assets/videos/stockholm-short.mp4"),
            },
            {
              name: "KANIS",
              cover: require("@/assets/img/thumbnails/7.jpg"),
            },
            {
              name: "NIKI",
              cover: require("@/assets/img/thumbnails/8.jpg"),
            },
          ],
        },
        { name: "Cooking", intersectionRatio: 0, isIntersecting: false },
        { name: "Shuffle", intersectionRatio: 0, isIntersecting: false },
        {
          name: "Recently watched",
          intersectionRatio: 0,
          isIntersecting: false,
        },
      ],
    };
  },
  methods: {
    createObserver() {
      const options = {
        root: this.$el,
        rootMargin: "0px",
        threshold: [...Array(100).keys()].map((x) => x / 100),
      };

      this.observer = new IntersectionObserver(this.onObserve, options);

      // Loop through and observe intersect items
      this.$refs.clusters.forEach((cluster, n) => {
        cluster.$el._index = n;
        this.observer.observe(cluster.$el);
      });
    },
    onObserve(entries) {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        // Cluster
        const cluster = this.clusters[entry.target._index];

        cluster.intersectionRatio = entry.intersectionRatio;
        cluster.isIntersecting = entry.isIntersecting;
      });
    },
  },
  computed: {
    navigationStyle() {
      const y = this.t * -400;
      return {
        transform: `translateY(${y}%) translateZ(0px)`,
      };
    },
  },
  mounted() {
    this.createObserver();
  },
  beforeDestroy() {
    this.observer.disconnect();
  },
};
</script>

<style lang="scss" scoped>
.home {
  &.disabled {
    pointer-events: none;
    overflow: hidden;
  }

  .cover {
    scroll-snap-align: start;
    height: 30vh;
  }

  .clusters {
    overflow: auto;
    width: 100vw;
    height: 100vh;
    scroll-snap-type: y mandatory;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
