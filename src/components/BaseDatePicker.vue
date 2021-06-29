<template>
    <div class="box" :class="boxClass">
      <div class="base-date-picker">
        <i v-if="!isSingleRowDispaly" class="box-icon--start"></i>
        <el-date-picker
          v-model="start"
          @change="handleDateChange"
          :type="type"
          :placeholder="`开始${isDateType ? '日期' : '时间'}`"
          size="mini"
          :format="format"
          :value-format="format"
          :clearable="true"
          :picker-options="getStartPickerOptions()">
        </el-date-picker>
      </div>
      <span v-if="isSingleRowDispaly && isRange" class="box-divider">-</span>
      <div class="base-date-picker" v-if="isRange">
        <i v-if="!isSingleRowDispaly" class="box-icon--end"></i>
        <el-date-picker
          v-model="end"
          @change="handleDateChange"
          :type="type"
          :placeholder="`结束${isDateType ? '日期' : '时间'}`"
          size="mini"
          :format="format"
          :value-format="format"
          :clearable="true"
          :picker-options="getEndPickerOptions()">
        </el-date-picker>
      </div>
    </div>
</template>

<script>
export default {
  name: 'BaseDatePicker',
  props: {
    // 类型 date datetime
    type: {
      type: String,
      default: 'datetime'
    },
    // 是否需要选择范围
    isRange: {
      type: Boolean,
      default: false
    },
    // 初始化的时间的值，如果是范围 就传入一个数组
    value: {
      type: [String, Array, Number],
      default: ''
    },
    // 日期选择器返回值类型：string integer arrayString arrayInteger
    datePickerValueType: {
      type: String,
      default: 'string'
    },
    // 是否单行展示，针对时间范围选择
    isSingleRowDispaly: {
      type: Boolean,
      default: true
    },
    // 是否是可折叠下拉框
    isDropdown: {
      type: Boolean,
      default: false
    },
    // 可选的最小日期
    minDate: {
      type: String,
      default: '2020-01-01'
    },
    // 可选的最大日期
    maxDate: {
      type: String,
      default: new Date().format('yyyy-MM-dd')
    }
  },
  data() {
    return {
      timeRange: [' 00:00:00', ' 23:59:59'],
      start: '',
      end: '',
      timestamp: {
        start: 0,
        startDate: 0,
        end: 0,
        endDate: 0
      }
    };
  },
  computed: {
    isDateType() {
      return this.type === 'date';
    },
    boxClass() {
      return {
        flexdc: !this.isSingleRowDispaly,
        date: this.isDateType,
        dropdown: this.isDropdown
      };
    },
    format() {
      return this.isDateType ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss';
    },
    formatDateType() {
      return this.isDateType ? 'YYYY-MM-DD' : 'YYYY-MM-DD hh:mm:ss';
    },
    minTimestamp() {
      return new Date(this.minDate + this.timeRange[0]).getTime();
    },
    maxTimestamp() {
      return new Date(this.maxDate + this.timeRange[1]).getTime();
    }
  },
  methods: {
    // 根据时间选择器标识，获得初始化的时间戳。结束日期时间戳要么是当前时间要么是当天最晚的时间
    getInitTimestamp(flag = 'start') {
      if (flag === 'start') {
        return {
          dateTime: this.minTimestamp,
          date: this.minTimestamp
        };
      }
      return {
        dateTime: this.maxTimestamp,
        date: new Date(this.$tool.formatDate(this.maxTimestamp, 'YYYY-MM-DD')).getTime()
      };
    },
    // 根据时间选择器标识，设置该时间选择器的时间戳
    setTimestamp(flag = 'start') {
      const dateStr = this[flag];
      const timestamp = dateStr ? this.getTimestamp(flag) : this.getInitTimestamp(flag);
      this.timestamp[flag] = timestamp.dateTime;
      this.timestamp[flag + 'Date'] = timestamp.date;
    },
    // 根据时间选择器标识，获得该时间选择器的时间戳
    getTimestamp(flag = 'start') {
      const dateStr = this[flag];
      return {
        dateTime: new Date(this.isDateType ? dateStr + this.timeRange[flag === 'end' ? 0 : 1] : dateStr).getTime(),
        date: new Date(dateStr.replace(/(?<=\s)\S*/g, '').trim() + this.timeRange[0]).getTime()
      };
    },
    // 拿到时间选择器的值，type表示值类型：string integer arrayString arrayInteger
    getDatePickerValue(type = this.datePickerValueType) {
      if (!this.isRange) {
        const timestamp = this.isDateType ? this.timestamp.startDate : this.timestamp.start;
        return type === 'string' ? this.start : this.start && timestamp;
      }
      // 范围
      if (type === 'string') return this.start + (this.start && this.end && '/') + this.end;
      const timestampRange = this.isDateType ? [this.timestamp.startDate, this.timestamp.endDate] : [this.timestamp.start, this.timestamp.end];
      return type === 'arrayInteger' ? timestampRange : [this.start, this.end];
    },
    getStartPickerOptions() {
      return {
        disabledDate: time => {
          const timestamp = new Date(this.$tool.formatDate(time, 'YYYY-MM-DD') + this.timeRange[0]).getTime();
          return timestamp < this.minTimestamp || timestamp > this.maxTimestamp || (this.timestamp.endDate && timestamp > this.timestamp.endDate);
        }
      };
    },
    getEndPickerOptions() {
      return {
        disabledDate: time => {
          const timestamp = time.getTime();
          return timestamp < this.minTimestamp || timestamp > this.maxTimestamp || timestamp < this.timestamp.startDate;
        }
      };
    },
    handleDateChange() {
      this.start = this.start || '';
      this.end = this.end || '';
      // 日期时间选择器 时间范围限制
      if (!this.isDateType) {
        const dateNow = Date.now();
        const dateNowFormat = this.$tool.formatDate(dateNow, this.formatDateType);
        if (this.timestamp.start > dateNow) this.start = dateNowFormat;
        if (this.timestamp.end > dateNow) this.end = dateNowFormat;
        if (this.end && (this.timestamp.start > this.timestamp.end)) this.start = this.$tool.formatDate(this.timestamp.end, this.formatDateType);
      }
      this.$emit('change', this.getDatePickerValue(this.valueType));

      console.log(this.getDatePickerValue('arrayInteger'));
    },
    clearDate() {
      this.start = '';
      this.end = '';
    },
    handleClick(event) {
      let elem = event.target || event.srcElement;
      while (elem) {
        if (elem.classList && Array.from(elem.classList).includes('dropdown')) return false;
        elem = elem.parentNode;
      }
    }
  },
  watch: {
    start() {
      this.setTimestamp('start');
    },
    end() {
      this.setTimestamp('end');
    }
  },
  mounted() {
    this.setTimestamp('start');
    this.setTimestamp('end');
    this.isDropdown && document.addEventListener('click', this.handleClick);
  },
  destroyed() {
    this.isDropdown && document.removeEventListener('click', this.handleClick);
  }
};
</script>

<style scoped lang="less">
  .box {
    .dflex;
    &.flexdc {
      flex-direction: column;
      .base-date-picker + .base-date-picker {
        .mgt10;
      }
    }
    &.date {
      .base-date-picker .el-input {
        width: 150px;
      }
    }
  }
  .box-divider {
    padding: 0 5px;
    margin-top: 3px;
    color: @color-text-regular;
  }
  .base-date-picker {
    .el-input {
      width: 200px;
    }
  }
</style>
