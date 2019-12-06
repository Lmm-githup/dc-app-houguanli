<template>
  <div>
    <HomeWelcomeText/>
    <p>Copyright © 2019 版权所有康佰家</p>
  </div>
</template>

<script>
import HomeWelcomeText from "@/components/HomeWelcomeText";
export default {
  created() {
    
  },
  components: {
    HomeWelcomeText
  },
  data() {
    return {
      imageList: []
    };
  }
};
</script>

<style scoped>
p {
  position: absolute;
  bottom: 15px;
  left: 0;
  right: 0;
  text-align: center;
  color: #858c8e;
}
</style>

