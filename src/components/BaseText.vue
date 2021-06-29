<template>
  <el-tooltip class="ellipsis" :disabled="!isShowTooltip" :content="content" placement="top">
    <p
      @click="$emit('click')"
      @mouseenter.stop="$emit('mouseenter', isShowTooltip)"
      @mouseleave="$emit('mouseleave', false)">
      {{content | transformNull}}
    </p>
  </el-tooltip>
</template>

<script>
export default {
  name: 'BaseText',
  props: ['content'],
  data() {
    return {
      isShowTooltip: true
    };
  },
  watch: {
    content() {
      this.$nextTick(this.getShowTooltip);
    }
  },
  methods: {
    getShowTooltip() {
      this.isShowTooltip = this.$el.scrollWidth > this.$el.clientWidth;
    }
  },
  mounted() {
    this.getShowTooltip();
    window.addEventListener('resize', this.getShowTooltip);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getShowTooltip);
  }
};
</script>

<style scoped>

</style>
