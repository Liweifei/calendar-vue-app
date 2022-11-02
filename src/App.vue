<template>
  <div class="main">
    <calendar-vue-app
      ref="ca"
      :mark-arr="markArr"
      :birthday-arr="birthdayArr"
      future-disabled
      zoom
      @onChangeSlide="handleSlide"
    ></calendar-vue-app>
    <button @click="$refs.ca.slideChange(false)">关闭</button>
    <button @click="$refs.ca.slideChange(true)">打开</button>
  </div>
</template>

<script>
import eventUtil from "./utils";
export default {
  name: "App",
  data() {
    return {
      markArr: [
        {
          date: "2022/07/24", //YYYY-MM-DD
          color: "#EE1E1E", //图标或字的颜色
          isLabel: false,
          label: "旷旷旷旷旷旷旷旷",
          userPopover: true, //默认false
          markContent: "<span style='color:red'>今天是个好日子</span>", //需要标注的内容
          renderHtml: true, //需要标注的内容是否采用渲染html的格式
        },
        {
          date: "2022/07/04", //YYYY-MM-DD
          color: "#EE1E1E", //图标或字的颜色
          isLabel: true,
          label: "旷旷旷旷旷旷旷旷",
          userPopover: true, //默认false
          markContent: "<span style='color:red'>今天是个好日子</span>", //需要标注的内容
          renderHtml: true, //需要标注的内容是否采用渲染html的格式
        },
      ],
      birthdayArr: ["2022/07/11", "2022/07/30"],
    };
  },
  created() {
    const fn = (obj, e) => {
      console.log(obj);
      console.log(e);
    };
    eventUtil.bindEvent(document.body, "longPress", fn);
    eventUtil.bindEvent(document.body, "slidRight", fn);
    eventUtil.bindEvent(document.body, "slideUp", fn);
    eventUtil.bindEvent(document.body, "slidLeft", fn);

    setTimeout(() => {
      eventUtil.removeEvent(document.body, "slidRight", fn);
      eventUtil.removeEvent(document.body, "slidLeft", fn);
      eventUtil.removeEvent(document.body, "slideUp", fn);
    }, 10000);
  },
  methods: {
    handleSlide(type) {
      console.log(type);
    },
  },
};
</script>
<style></style>
