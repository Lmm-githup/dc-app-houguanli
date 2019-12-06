<template>
  <div>
    <BaseBreadcrumb v-if="!currentId" :navList="[['培训管理'],['新建培训']]" @click="$emit('destroy')"/>
    <BaseBreadcrumb v-if="currentId" :navList="[['培训管理'],['培训详情']]" @click="$emit('destroy')"/>
    <div style="max-width:680px;">
      <el-form 
        ref="validateInfoRef"
        :rules="dialogRulesModify" 
        :model="contentForm" label-width="80px" style="margin-top:30px;" size="mini">
          <el-form-item label="培训类型" prop="category">
            <el-radio-group v-model="contentForm.category" >
              <el-radio border v-for="(item,index) in categoryList" :key="index" :label="item.dataKey">{{item.dataValue}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input placeholder="请输入标题" v-model="contentForm.title"></el-input>
          </el-form-item>
          <el-form-item label="封面图片" prop="coverImg">
            <UploadImage :imageUrl.sync="contentForm.coverImg"/>
          </el-form-item>
          <el-form-item label="内容" prop="content">
              <quill-editor 
              class="editor"
              v-model="content"
              ref="myQuillEditor" 
              :options="editorOption" 
              @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
              @change="onEditorChange($event)">
              </quill-editor>
              <!-- 图片上传组件辅助-->
            <el-upload
              class="avatar-uploader"
              :action="serverUrl"
              name="img"
              :headers="header"
              :show-file-list="false"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :before-upload="beforeUpload">
            </el-upload>
          </el-form-item>
      </el-form>
    </div>
    <el-dialog title="预览" top="0" width="500px" :visible.sync="dialogTableVisible">
        <div class="art-title">{{contentForm.title}}</div>
        <div class="art-content" v-html="content"></div>
    </el-dialog>
    <div class="func-div">
       <el-button type="primary" size="mini" @click="preview" plain>预览</el-button>
       <el-button type="primary" size="mini" @click="save(1)">保存草搞</el-button>
       <el-button type="warning" size="mini" @click="save(2)">发布</el-button>
    </div>
  </div>
</template>

<script>
// 工具栏配置
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
  ["blockquote", "code-block"], // 引用  代码块
  [{ header: 1 }, { header: 2 }], // 1、2 级标题
  [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
  [{ script: "sub" }, { script: "super" }], // 上标/下标
  [{ indent: "-1" }, { indent: "+1" }], // 缩进
  // [{'direction': 'rtl'}],                         // 文本方向
  [{ size: ["small", false, "large", "huge"] }], // 字体大小
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
  [{ font: [] }], // 字体种类
  [{ align: [] }], // 对齐方式
  ["clean"], // 清除文本格式
  //["link", "image","video"] // 链接、图片、视频
  ["link", "image","video"] // 链接、图片
];

import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import contentService from "../service/content";
import commonService from "../service/common";
import { mapGetters } from "vuex";
import { MessageBox } from "element-ui";
import UploadImage from "@/components/UploadImage";

export default {
  props: {
    /*编辑器的内容*/
    value: {
      type: String
    },
    /*图片大小*/
    maxSize: {
      type: Number,
      default: 4000 //kb
    },
    currentId: {
      type: String | Number,
      default: ""
    }
  },

  components: {
    quillEditor,UploadImage
  },

  data() {
    return {
      contentForm:{
        contentType:"train",
        category: '',
        subCategory: '',
        title:"",
        coverImg: '',
        content: "",
        status: 0,
        rowNo: "",
      },
      categoryList: [],
      dialogTableVisible: false,
      content: this.value,
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      editorOption: {
        placeholder: "",
        theme: "snow", // or 'bubble'
        placeholder: "您想说点什么？",
        modules: {
          toolbar: {
            container: toolbarOptions,
            // container: "#toolbar",
            handlers: {
              image: function(value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector(".avatar-uploader input").click();
                } else {
                  this.quill.format("image", false);
                }
              },
            }
          }
        }
      },
      serverUrl: process.env.baseURL+"/common/upload", // 这里写你要上传的图片服务器地址
      header: {
        token: this.token
      },
      dialogRulesModify: {
        content: [
          { required: true, message: "请输入培训内容", trigger: "blur" }
        ],
        category: [
          { required: true, message: "请选择培训类型", trigger: "blur" }
        ],
        title: [
          { required: true, message: "请输入培训标题", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    document.addEventListener("keydown", this.keydownHandler);

    this.initCategory();
    this.init();
  },
  destroyed() {
    document.removeEventListener("keydown", this.keydownHandler);
  },
  computed: mapGetters(["token"]),
  methods: {
    keydownHandler(event) {
      if (event.key.toUpperCase() !== "ESCAPE" || this.dialogVisibleAdd) return;
      this.$emit("destroy");
    },
    initCategory(){
       commonService.lov('TRANNING_CATEGORY').then(({code,msg,data}) => {
           if(code == 200){
             this.categoryList = data;
           }
       });
    },
    onEditorBlur() {
      //失去焦点事件
    },
    onEditorFocus() {
      //获得焦点事件
    },
    onEditorChange() {
      //内容改变事件
      this.$emit("input", this.content);
    },

    // 富文本图片上传前
    beforeUpload() {
      // 显示loading动画
      this.quillUpdateImg = true;
    },
    uploadSuccess(res, file) {
      console.log(res);
      console.log(file)
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill;
      // 如果上传成功
      if (res.code == 200) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.url为服务器返回的图片地址
        quill.insertEmbed(length, "image", res.data.fileUrl);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message.error("图片插入失败");
      }
      // loading动画消失
      this.quillUpdateImg = false;
    },
    // 富文本图片上传失败
    uploadError() {
      // loading动画消失
      this.quillUpdateImg = false;
      this.$message.error("图片插入失败");
    },
    init(){
      if(this.currentId){
        contentService.detail(this.currentId).then(({code,msg,data})=>{
          if (code != 200) {
            this.$message.warning(msg);
            return;
          }
          this.contentForm.rowNo = data.rowNo;
          this.contentForm.category = data.category;
          this.contentForm.title = data.title;
          this.contentForm.content = data.content;
          this.content = data.content;
          this.coverImg = data.coverImg;
        });
      }
    },
    save(type){
      this.contentForm.content = this.content;
      if(!this.contentForm.rowNo){
        this.contentForm.rowNo = this.currentId;
      }
      this.contentForm.status = type;
      if(2 == type){
        MessageBox.confirm("发布后，用户在导购宝中可查看该培训内容，确认要发布吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
            this.saveContent();
        });
      }else{
        this.saveContent();
      }
    },
    saveContent(){
      this.$refs["validateInfoRef"].validate(valid => {
        if (!valid) return;
        const loading = this.$loading({
            lock: true,
            text: "数据处理中...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.8)"
          });
        contentService
        .save(this.contentForm)
        .then(({ code, msg, data }) => {
          loading.close();
          if (code != 200) {
            this.$message.warning(msg);
            return;
          }

          if(!data) return;
          this.$emit('updateTable');
          this.$message.success("操作成功");
          this.contentForm.rowNo = data.rowNo;
        });
      });
    },

    preview(){
      this.dialogTableVisible = true;
    }
  }
};
</script> 

<style>
.editor {
  line-height: normal !important;
  width: 600px;
  margin: 0 auto;
}
.ql-container {
  height: 500px !important;
}
.ql-snow .ql-tooltip[data-mode=link]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: '保存';
    padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode=video]::before {
    content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: '14px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
  content: '10px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
  content: '18px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
  content: '32px';
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '文本';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: '标题1';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: '标题2';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: '标题3';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: '标题4';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: '标题5';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: '标题6';
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: '标准字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
  content: '衬线字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
  content: '等宽字体';
}
.func-div{
    position: fixed;
    bottom: 20px;
    width: 100%;
    left:30%;
}

.art-title{
  font-size:18px;
  font-weight:800;
}
.art-content img{
  max-width:100% !important;
}
</style>
