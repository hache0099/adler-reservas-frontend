<script>
import authService from '../services/auth.service'; 

export default {
  methods: {
    async logout() {
      const response = await authService.logout();
      
      this.$router.push('/');
    }
  },
  created() {
    this.logout();
  }
}
</script>
<template></template>
