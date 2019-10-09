<template>
  <div class="home">
    <UserSignUpEdit/>
  </div>
</template>

<script>
// @ is an alias to /src
import UserSignUpEdit from '@/components/UserSignUpEdit.vue'
export default {
  name: 'home',
  components: {
    UserSignUpEdit
  }
}
</script>