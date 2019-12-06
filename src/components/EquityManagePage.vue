<template>
  <div>
     <el-row>
       <el-col :span="10">
          <div class="title">会员权益</div>
          <div class="title"><UploadImage :imageWidth="imageWidth" :imageHeight="imageHeight" :imageUrl.sync="interestsImg"/></div>
          <div class="title"><el-button :loading="loading" type="primary" @click="save(1)">保存</el-button></div>
       </el-col>
       <el-col :span="10">
          <div class="title">会员章程</div>
          <div class="title"><UploadImage :imageWidth="imageWidth" :imageHeight="imageHeight" :imageUrl.sync="statutesImg"/></div>
          <div class="title"><el-button :loading="loading" type="primary" @click="save(2)">保存</el-button></div>
       </el-col>
     </el-row>
  </div>
</template>

<script>
import commonService from "../service/common";
import UploadImage from "@/components/UploadImage";
import { MessageBox } from "element-ui";
export default {
  created() {
    this.search();
  },
  components: {
    UploadImage
  },
  data() {
    return {
      imageWidth: '350px',
      imageHeight: '500px',
       loading: false,
       dataType: 'MEMBER_EQUITY',
       dataKey1: 'Interests img',
       dataKey2: 'Statutes img',
       interestsImg: '',
       statutesImg: ''
    };
  },
  methods: {
    search(){
      commonService.lov(this.dataType)
      .then(({ code, msg, data }) => {
          if (code != 200) {
            this.$message.warning(msg);
            return;
          }
          if(!data) return;
          data.map( v => {
             if(v.dataKey == this.dataKey1){
               this.interestsImg = v.dataValue;
             }else if(v.dataKey == this.dataKey2){
               this.statutesImg = v.dataValue;
             }
          });
        });
    },
    save(type){
       let dataValue = '';
       let dataKey = '';
       this.loading = true;
       if(type == 1){
         if(!this.interestsImg){
            this.$message.warning("请上传会员权益图片");
            this.loading = false;
            return;
         }else{
            dataValue = this.interestsImg;
            dataKey = this.dataKey1;
         }
       }else if(type == 2){
         if(!this.statutesImg){
           this.loading = false;
            this.$message.warning("请上传会员章程图片");
            return;
         }else{
            dataValue = this.statutesImg;
            dataKey = this.dataKey2;
         }
       }else{
         this.loading = false;
       }
       
       if(dataValue){
         commonService.saveLov(this.dataType,dataKey,dataValue)
        .then(({ code, msg, data }) => {
          this.loading = false;
            if (code != 200) {
              this.$message.warning(msg);
              return;
            }
            
            this.$message.success("保存成功");
          });
       }
    }
  }
};
</script>

<style>
.title{
  line-height:50px;
  text-align:center;
}
</style>

