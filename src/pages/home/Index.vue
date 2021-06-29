<template>
  <div>
    <div class="pd10 dflex" v-for="(item, index) of datePickerList" :key="index">
      <span class="label">{{item.label}}</span>
      <base-date-picker
        :type="item.type"
        :isRange="item.isRange"
        :datePickerValueType="item.datePickerValueType"
        @change="value => item.datePickerValue = value"/>
      <span class="value">值为{{/string/i.test(item.datePickerValueType) ? '字符串' : '时间戳'}}：{{item.datePickerValue}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      datePickerList: [
        {label: '选择日期', type: 'date', isRange: false, datePickerValueType: 'string', datePickerValue: ''},
        {label: '选择日期', type: 'date', isRange: false, datePickerValueType: 'integer', datePickerValue: ''},
        {label: '选择日期范围', type: 'date', isRange: true, datePickerValueType: 'string', datePickerValue: ''},
        {label: '选择日期范围', type: 'date', isRange: true, datePickerValueType: 'arrayString', datePickerValue: ''},
        {label: '选择日期范围', type: 'date', isRange: true, datePickerValueType: 'arrayInteger', datePickerValue: ''},
        {label: '选择时间', isRange: false, datePickerValueType: 'string', datePickerValue: ''},
        {label: '选择时间', isRange: false, datePickerValueType: 'integer', datePickerValue: ''},
        {label: '选择时间范围', isRange: true, datePickerValueType: 'string', datePickerValue: ''},
        {label: '选择时间范围', isRange: true, datePickerValueType: 'arrayString', datePickerValue: ''},
        {label: '选择时间范围', isRange: true, datePickerValueType: 'arrayInteger', datePickerValue: ''}
      ]
    };
  }
};
</script>

<style scoped lang="less">
  .dflex {
    align-items: center;
  }
  .label {
    width: 100px;
    .mgr15;
    .tr;
  }
  .value {
    font-size: 12px;
    .mgl10;
  }
</style>
