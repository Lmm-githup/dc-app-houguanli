<template>
  <el-upload
    class="upload-image"
    :action='`${imgHost}/common/upload`'
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="imgUrl" :src="imgUrl" class="avatar" :style="avatarStyle">
    <i v-else class="el-icon-plus avatar-uploader-icon" :style="avatarIconStyle"></i>
  </el-upload>
</template>

<script>
export default {
  props: {
    imageUrl: {
      type: String | null,
      required: true,
      default: ""
    },
    imageWidth: {
      type: String,
      default: "120px"
    },
    imageHeight: {
      type: String,
      default: "120px"
    },
    fontSize: {
      type: String,
      default: "30px"
    },
    imageSize: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      imgUrl: this.imageUrl,
      imgHost: ''
    };
  },
  watch: {
    imageUrl(url) {
      this.imgUrl = url;
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imgUrl = URL.createObjectURL(file.raw);
      this.$emit("update:imageUrl", res.data.fileUrl);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < this.imageSize;

      if (!isJPG && !isPNG) {
        this.$message.error("上传头像图片只能是 JPG | PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 " + this.imageSize + "MB!");
      }
      return (isJPG || isPNG) && isLt2M;
    }
  },
  created() {
    this.imgHost = process.env.baseURL
    this.avatarIconStyle = this.avatarStyle = {
      width: this.imageWidth,
      height: this.imageHeight
    };
    this.avatarIconStyle.lineHeight = this.imageHeight;
    this.avatarIconStyle.fontSize = this.fontSize;
  }
};
</script>

<style>
.upload-image .el-upload {
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.upload-image .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  color: #8c939d;
  text-align: center;
}
.upload-image .avatar {
  display: block;
}
</style>
