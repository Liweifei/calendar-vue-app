<template>
  <transition name="fade">
    <div class="cv-popover-ivContainer" v-if="visible" @keyup="close">
      <button class="cv-popover-ivCloseBtn" @click="close">×</button>
      <div class="cv-popover-contentBox">
        <div v-if="obj.renderHtml" v-html="obj.markContent"></div>
        <p v-else>{{ obj.markContent }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "popover",
  data() {
    return {
      visible: false,
      obj: {},
    };
  },
  methods: {
    close() {
      this.visible = false;
      document.removeEventListener("keyup", this.keyClose);
      // console.log("执行了关闭");
      if (typeof this.onClose === "function") {
        this.$nextTick(() => {
          //动画执行完毕后删除dom,v-if只能删除这个组件内的，挂载的实际上还存在，所以要删掉，不然会显示=>   <!---->
          this.onClose();
        });
      }
    },
    keyClose(e) {
      //监听esc
      if (e.keyCode == 27) {
        this.close();
      }
    },
  },
  mounted() {
    document.addEventListener("keyup", this.keyClose);
    // console.log("执行了监听");
  },
};
</script>