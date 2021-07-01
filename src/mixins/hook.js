export default {
  beforeCreate() {
    console.log('mixin beforeCreate');
  },
  created() {
    console.log('mixin created');
  },
  beforeMount() {
    console.log('mixin beforeMount');
  },
  mounted() {
    console.log('mixin mounted');
  },
  beforeUpdate() {
    console.log('mixin beforeUpdate');
  },
  updated() {
    console.log('mixin updated');
  },
  beforeDestroy() {
    console.log('mixin beforeDestroy');
  },
  destroyed() {
    console.log('mixin destroyed');
  }
};
