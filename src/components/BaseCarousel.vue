<template>
  <div ref="bannerContainerRef">
    <el-carousel :autoplay="false" trigger="click" :height="imageHeight">
      <el-carousel-item v-for="({url, alt}, index) in imageList" :key="index">
        <img :src="url" :alt="alt" width="100%">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  props: {
    imageList: {
      type: Array,
      default() {
        return [
        ];
      }
    }
  },
  data() {
    return {
      imageHeight: ""
    };
  },
  mounted() {
    const scalc = 20 / 49; // 图片的高宽比: 400 x 980
    this.imageHeight = scalc * this.$refs.bannerContainerRef.clientWidth + "px";
  }
};
</script>
