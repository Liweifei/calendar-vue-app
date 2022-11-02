<template>
  <div class="vue-calendar-ui" ref="vueCalendarUi">
    <div class="cv-controlBox">
      <div class="cv-title" :style="{ color: titleColor }">
        <span class="cv-date-text">{{ titleDesc }}</span>
        <i
          class="ivcufont ivcu-liulangengduo cv-arrowLeft"
          :style="{ color: arrowColor }"
          @click="handlePrevAndNexMonth('prev')"
        ></i>
        <i
          class="ivcufont ivcu-liulangengduo cv-arrowRight"
          :class="{ 'cv-arrow-disabled': arrowrDisabled }"
          :style="{ color: arrowColor }"
          @click="handlePrevAndNexMonth('next')"
        ></i>
      </div>
    </div>
    <div class="cv-contentBox" :class="{ 'cv-current-week': currentWeek }">
      <ul class="cv-top" :style="{ color: weeklabelColor }">
        <li v-for="(item, index) in labelArr" :key="index" class="cv-label">
          {{ item }}
        </li>
      </ul>
      <ul class="cv-main">
        <li
          class="cv-item"
          :class="{
            'cv-prev': item.whitchMonth === 'prev',
            'cv-next': item.whitchMonth === 'next',
            'cv-same-week-item': item.isSameWeek,
          }"
          v-for="(item, index) in arrList"
          :key="index"
        >
          <div
            class="cv-date"
            :class="{
              'cv-today': item.isToday,
            }"
            :style="{
              'background-color': item.isBirthday
                ? birthdaybgColor
                : item.isToday
                ? crrentdaybgColor
                : item.date === clickDay
                ? clickdaybgColor
                : itembgColor,
              color: item.isBirthday
                ? birthdaylabelColor
                : item.isToday
                ? crrentdaylabelColor
                : item.date === clickDay
                ? clickdaylabelColor
                : item.whitchMonth === 'prev'
                ? prevColor
                : item.whitchMonth === 'next'
                ? nextColor
                : itemlabelColor,
            }"
            @mouseenter="mouseIndex = index"
            @mouseleave="mouseIndex = null"
            @click="handleClickDate(item)"
          >
            <!-- 
            上面style匹配
            0、生日样式放最大
            1、当天的样式权重第2
            2、点击的效果放第3
            3、hover的效果放第4
            4、最后是默认的样式
           -->
            {{ item.id }}
            <span
              class="cv-click-Box"
              v-if="item.mark && item.userPopover"
              @click="showPopover(item)"
            ></span>
            <img
              v-if="item.isBirthday"
              class="cv-today-birthday"
              :src="birthdayImg"
              alt=""
            />
          </div>
          <span
            v-if="item.mark"
            class="cv-circle"
            :class="{ 'cv-circle-label': item.isLabel }"
            :style="{ 'background-color': item.color, color: item.color }"
          >
            {{ item.isLabel ? item.label : null }}
            <span
              class="cv-click-Box"
              v-if="item.mark && item.userPopover"
              @click="showPopover(item)"
            ></span>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import util from "./util";
import eventUtil from "../src/utils";
export default {
  name: "calendar-vue-app",
  props: {
    animated: {
      //是否可缩放
      type: Boolean,
      default: true,
    },
    zoom: {
      //是否默认展开
      type: Boolean,
      default: false,
    },
    futureDisabled: {
      //是否不可跳转到未来月份
      type: Boolean,
      default: false,
    },
    // sundayStart: false,// 默认是周一开始，周一或周天开始相应的位置也要改一下
    sundayStart: {
      type: Boolean,
      default: false,
    },
    titlebgColor: {
      //title颜色，默认f5f7fa
      type: String,
      default: "#f5f7fa",
    },
    titleColor: {
      //title字体颜色，默认333333
      type: String,
      default: "#333333",
    },
    titleSplit: {
      //title年月间隔，默认-
      type: Boolean | String,
      default: "-",
    },
    weeklabelColor: {
      //礼拜几字体颜色，默认9da5b1
      type: String,
      default: "#9da5b1",
    },
    arrowColor: {
      //箭头颜色，默认4b7df6
      type: String,
      default: "#4b7df6",
    },
    itembgColor: {
      //默认日期背景颜色，默认fff
      type: String,
      default: "#fff",
    },
    itemlabelColor: {
      //默认日期字体颜色，默认333333
      type: String,
      default: "#333333",
    },
    birthdayImg: {
      //生日顶部图片
      type: String,
      default: util.birthdayImg,
    },
    birthdaybgColor: {
      //当天生日背景颜色，默认#FFF5E7
      type: String,
      default: "#FFF5E7",
    },
    birthdaylabelColor: {
      //当天生日字体颜色，默认fff
      type: String,
      default: "#333333",
    },
    crrentdaybgColor: {
      //今天的背景颜色，默认4b7df6
      type: String,
      default: "#4b7df6",
    },
    crrentdaylabelColor: {
      //今天的字体颜色，默认fff
      type: String,
      default: "#fff",
    },
    clickdaybgColor: {
      //当前点击日期的背景颜色，默认rgba(51, 51, 51,0.8)
      type: String,
      default: "rgba(51, 51, 51,0.8)",
    },
    clickdaylabelColor: {
      //当前点击日期的字体颜色，默认fff
      type: String,
      default: "#fff",
    },
    hoverbgColor: {
      //鼠标经过背景颜色，默认4b7df6
      type: String,
      default: "#4b7df6",
    },
    hoverlabelColor: {
      //鼠标经过字体颜色，默认#fff
      type: String,
      default: "#fff",
    },
    prevColor: {
      //当月之前的日期颜色，默认cccccc
      type: String,
      default: "#cccccc",
    },
    nextColor: {
      //当月之后的日期颜色，默认cccccc
      type: String,
      default: "#cccccc",
    },
    markArr: {
      //需要标记的日期列表
      type: Array,
      default: () => {
        return [
          // {
          //   date: "2021/05/24", //YYYY-MM-DD
          //   color: "#EE1E1E", //图标或字的颜色
          //   isLabel: false,
          //   label: "旷旷旷旷旷旷旷旷",
          //   userPopover: true, //默认false
          //   markContent: "<span style='color:red'>今天是个好日子</span>", //需要标注的内容
          //   renderHtml: true, //需要标注的内容是否采用渲染html的格式
          // },
          // {
          //   date: "2021/05/23", //YYYY-MM-DD
          //   color: "#EE1E1E", //图标或字的颜色
          //   isLabel: true,
          //   label: "旷旷旷旷旷旷旷旷",
          //   userPopover: true, //默认false
          //   markContent: "<span style='color:red'>今天是个好日子</span>", //需要标注的内容
          //   renderHtml: true, //需要标注的内容是否采用渲染html的格式
          // },
        ];
      },
    },
    birthdayArr: {
      //需要标记的日期列表
      type: Array,
      default: () => {
        return [
          // "2021/05/31", "2021/05/30"
        ];
      },
    },
  },
  data() {
    return {
      title: "",
      arrowrDisabled: false, //右箭头是否不可用
      today: new Date(),
      clickDay: null,
      labelArrBackup: ["一", "二", "三", "四", "五", "六"],
      labelArr: ["一", "二", "三", "四", "五", "六"], //"日"由是否星期天为起始日决定
      arrList: [],
      mouseIndex: null, //当前鼠标经过的时间
      currentWeek: true, //只显示当前周
    };
  },
  watch: {
    markArr: {
      handler() {
        this.initMarkContent();
      },
      deep: true,
    },
    birthdayArr: {
      handler() {
        this.initBirthday();
      },
      deep: true,
    },
  },
  computed: {
    titleDesc() {
      const date = this.today;
      const formatDate = `${date.getFullYear()}年${this.titleSplit || ""}${
        date.getMonth() + 1
      }月`;
      return formatDate;
    },
  },
  created() {
    const sundayStart = this.sundayStart;
    util.sundayStart = sundayStart;
    if (sundayStart) {
      this.labelArr = ["日", ...this.labelArrBackup];
    } else {
      this.labelArr = [...this.labelArrBackup, "日"];
    }
    this.today = util.strToDateObj(this.today); //先初始化时间，保证为date对象
    this.getList();
    this.checkCurrentMonth();
    if (this.zoom) this.currentWeek = false;
  },
  mounted() {
    this.animated && this.initAnimated();
  },
  methods: {
    getList() {
      this.arrList = util.getMonthList(this.today);
      this.initMarkContent();
      this.initBirthday();
      this.checkIsWeekDate();
    },
    checkIsWeekDate() {
      //same week date
      let date = this.today;
      if (
        this.clickDay &&
        util.strToDateObj(this.clickDay).getMonth() ==
          util.strToDateObj(this.today).getMonth()
      ) {
        date = this.clickDay;
      }
      this.arrList.forEach((item) => {
        item.isSameWeek = this.isSameWeek(
          util.strToDateObj(item.date),
          util.strToDateObj(date)
        );
      });
    },

    isSameWeek(timeStampA, timeStampB) {
      let A = new Date(timeStampA).setHours(0, 0, 0, 0);
      let B = new Date(timeStampB).setHours(0, 0, 0, 0);
      const oneDayTime = 1000 * 60 * 60 * 24;
      const old_count = parseInt(A / oneDayTime);
      const now_other = parseInt(B / oneDayTime);
      return parseInt((old_count + 4) / 7) == parseInt((now_other + 4) / 7);
    },
    initMarkContent() {
      //初始化需要mark的信息
      this.arrList.forEach((item) => {
        item.mark = false;
        let markItem = this.markArr.find(
          (list) =>
            util.dateFormatStr(new Date(list.date)) ===
            util.dateFormatStr(new Date(item.date))
        );
        if (markItem) Object.assign(item, markItem, { mark: true });
      });
      this.$forceUpdate();
    },
    initBirthday() {
      //初始化需要生日信息
      this.arrList.forEach((item) => {
        const io = this.birthdayArr.some((date) => {
          return util.dateFormatStr(new Date(date)) === item.date;
        });
        Object.assign(item, { isBirthday: io });
      });
      this.$forceUpdate();
    },
    handlePrevAndNexMonth(type) {
      //点击获取下或下个月数据
      if (type === "next" && this.futureDisabled && this.arrowrDisabled) return;
      const today = this.today;
      this.today = util.resetprevOrNextDateObj(today, type);
      this.$emit("onchangemonth", {
        day1: this.today,
        type,
      });
      this.getList();
      this.checkCurrentMonth();
    },
    checkCurrentMonth(getDate) {
      let io = false;
      const today = getDate || this.today;
      if (this.futureDisabled) {
        const currentMonth =
          new Date().getFullYear() + "." + this.getFormatMonth(new Date());
        const showDate = util.strToDateObj(today);
        const showMonth = showDate.getFullYear() + "." + this.getFormatMonth(showDate); //先初始化时间，保证为date对象
        this.arrowrDisabled = showMonth >= currentMonth;
        io = showMonth > currentMonth; //点击日期时只能是判断传入的是否是下个月的
      }
      return io;
    },
    getFormatMonth(date) {
      let month = date.getMonth();
      if (month < 10) month = `0${month}`;
      return month;
    },
    jumpToMonth(date) {
      //点击获取指定月数据
      this.today = util.strToDateObj(date); //先初始化时间，保证为date对象
      this.getList();
      this.checkCurrentMonth();
    },
    jumpToDay(date) {
      //跳转到指定日期
      this.today = util.strToDateObj(date); //先初始化时间，保证为date对象
      this.clickDay = util.dateFormatStr(this.today);
      this.getList();
      this.checkCurrentMonth();
    },
    showPopover(item) {
      //点击展示popover
      this.$SHOW_CV_POPOVER(item);
    },
    handleClickDate(item) {
      //点击日期
      // const thisItem = { ...item };
      const date = item.date;
      if (this.checkCurrentMonth(date)) return; //如果不允许查看未来日期
      this.clickDay = date;
      item.whitchMonth != "current" && this.jumpToMonth(date);
      this.$emit("onclickdate", item);
      this.checkIsWeekDate();
    },
    initAnimated() {
      eventUtil.bindEvent(this.$refs.vueCalendarUi, "slideUp", this.slideUp);
      eventUtil.bindEvent(this.$refs.vueCalendarUi, "slideDown", this.slideDown);
    },
    slideUp() {
      this.$emit("onChangeSlide", false);
      if (this.currentWeek) return;
      if (!this.clickDay) {
        this.jumpToDay(new Date());
      }
      this.$nextTick(() => {
        this.currentWeek = true;
      });
    },
    slideDown() {
      this.$emit("onChangeSlide", true);
      if (!this.currentWeek) return;
      this.currentWeek = false;
    },
    slideChange(type) {
      const event = type ? "slideDown" : "slideUp";
      this[event]();
    },
  },
  beforeDestroy() {
    eventUtil.removeEvent(this.$refs.vueCalendarUi, "slideUp", this.slideUp);
    eventUtil.removeEvent(this.$refs.vueCalendarUi, "slideDown", this.slideDown);
  },
};
</script>
