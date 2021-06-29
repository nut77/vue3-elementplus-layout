<template>
  <div>
    list
    <list-header></list-header>
    <list-body></list-body>
    <list-footer></list-footer>
  </div>
</template>

<script>
import ListHeader from './ListHeader';
import ListBody from './ListBody';
import ListFooter from './ListFooter';
export default {
  name: 'Index',
  components: {ListHeader, ListBody, ListFooter}
};
</script>

<style scoped>

</style>
