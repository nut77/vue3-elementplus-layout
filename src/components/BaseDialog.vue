<template>
  <el-dialog
    center
    append-to-body
    :loading="isLoading"
    :width="width"
    v-model="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="$emit('dialogClose')"
    custom-class="base-dialog-container"
  >
    <template #title>
      <base-text :content="title" class="el-dialog__title"></base-text>
    </template>
    <slot></slot>
    <template v-if="hasFooter" #footer>
      <el-button type="primary" @click="$emit('dialogConfirm')">确 定</el-button>
      <el-button type="info" @click="visible = false">取 消</el-button>
    </template>
    <template v-else #footer>
      <slot name="dialogFooter"></slot>
    </template>
  </el-dialog>
</template>

<script>
  import {ref, watch, toRef} from 'vue';
  export default {
    name: 'BaseDialog',
    props: {
      width: {
        type: String,
        default: () => (document.body.clientWidth <= 1440 ? '40%' : '30%')
      },
      title: {
        type: String,
        default: ''
      },
      dialogId: {
        type: Number,
        default: 0
      },
      hasFooter: {
        type: Boolean,
        default: true
      }
    },
    setup(props) {
      let dialogId = toRef(props, 'dialogId');
      let [visible, isLoading] = [ref(false), ref(false)];

      const loadingOpen = () => (isLoading.value = true);
      const loadingClose = () => (isLoading.value = false);
      watch(dialogId, () => (visible.value = !!dialogId.value));

      return {visible, isLoading, loadingOpen, loadingClose};
    }
  };
</script>
