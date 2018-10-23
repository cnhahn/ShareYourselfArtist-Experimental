<!--This component is linked with artist_profile & business_profile.-->
<template>

</template>

<script>
  export default {
    name: 'profile',
    mounted () {
      let role = this.$store.getters.user_role
      if (role === 'artist') {
        this.$router.push({
          name: 'artist_profile'
        })
      } else if (role === 'business') {
        this.$router.push({
          // TODO: Should change this to business_profile after business_profile is found.
          name: 'business_profile'
        })
      } else {
        this.$router.push({
          name: 'page_not_found'
        })
      }
    }
  }
</script>

<style scoped>

</style>
