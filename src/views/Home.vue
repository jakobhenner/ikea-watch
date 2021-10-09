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
        @expanded="cluster.expanded = $event"
      />
    </div>
  </div>
</template>

<script>
import Cluster from "@/components/Cluster";
import Navigation from "@/components/Navigation";

import faker from "faker";

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
      clusters: [
        {
          name: "Mixed tape",
          subheading: "Made just for you",
          intersectionRatio: 0,
          isIntersecting: false,
          expanded: false,
          items: [
            {
              name: "MØ",
              preview: require("@/assets/videos/mo-short.mp4"),
            },
            {
              name: "Birds",
              preview: require("@/assets/videos/birds.mp4"),
            },
            {
              name: "Rains",
              cover: require("@/assets/img/thumbnails/11.jpg"),
            },
            {
              name: "Flowers",
              preview: require("@/assets/videos/flower.mp4"),
            },
          ],
        },
        {
          name: "New releases",
          subheading: "4 videos",
          intersectionRatio: 0,
          isIntersecting: false,
          expanded: false,
          items: [
            {
              name: "CPH",
              preview: require("@/assets/videos/cph-short.mp4"),
            },
            {
              name: "Flowers",
              preview: require("@/assets/videos/flowers.mp4"),
            },
            {
              name: "Trains",
              preview: require("@/assets/videos/stockholm-short.mp4"),
            },
            {
              name: "MØ",
              preview: require("@/assets/videos/mo-short.mp4"),
            },
          ],
        },
        {
          name: "Cooking",
          subheading: "Because you watched Pasta Queen",
          intersectionRatio: 0,
          isIntersecting: false,
          expanded: false,
          items: [
            {
              name: "Secco",
              preview: require("@/assets/videos/eat.mp4"),
            },
            {
              name: "Tomato",
              preview: require("@/assets/videos/food-short.mp4"),
            },
          ],
        },
        {
          name: "Shuffle",
          subheading: "Roll the dice",
          intersectionRatio: 0,
          isIntersecting: false,
          expanded: false,
          dark: true,
          shuffle: true,
          items: [
            {
              name: faker.name.firstName(),
              cover: require("@/assets/img/thumbnails/1.jpg"),
            },
            {
              name: faker.name.firstName(),
              cover: require("@/assets/img/thumbnails/2.jpg"),
            },
            {
              name: faker.name.firstName(),
              cover: require("@/assets/img/thumbnails/3.jpg"),
            },
            {
              name: faker.name.firstName(),
              cover: require("@/assets/img/thumbnails/4.jpg"),
            },
            {
              name: faker.name.firstName(),
              cover: require("@/assets/img/thumbnails/5.jpg"),
            },
            {
              name: faker.name.firstName(),
              cover: require("@/assets/img/thumbnails/6.jpg"),
            },
            {
              name: faker.name.firstName(),
              cover: require("@/assets/img/thumbnails/7.jpg"),
            },
            {
              name: faker.name.firstName(),
              cover: require("@/assets/img/thumbnails/8.jpg"),
            },
            {
              name: faker.name.firstName(),
              cover: require("@/assets/img/thumbnails/9.jpg"),
            },
            {
              name: faker.name.firstName(),
              cover: require("@/assets/img/thumbnails/10.jpg"),
            },
            {
              name: faker.name.firstName(),
              cover: require("@/assets/img/thumbnails/11.jpg"),
            },
            {
              name: faker.name.firstName(),
              cover: require("@/assets/img/thumbnails/12.jpg"),
            },
          ],
        },
        {
          name: "Recently watched",
          subheading: "Past month",
          intersectionRatio: 0,
          isIntersecting: false,
          expanded: false,
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
    anyClusterExpanded() {
      return this.clusters.some((cluster) => cluster.expanded);
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
    .clusters {
      pointer-events: none;
      overflow: hidden;
    }
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
    pointer-events: all;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
