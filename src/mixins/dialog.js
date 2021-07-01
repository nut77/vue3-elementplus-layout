export default {
  data() {
    return {
      dialogId: 0
    };
  },
  methods: {
    showDialog() {
      this.dialogId = Date.now();
    },
    hideDialog() {
      this.dialogId = 0;
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
        this.$refs.form.resetFields();
      }
    }
  }
};
