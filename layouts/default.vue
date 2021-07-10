<template lang="pug">
  div
    nuxt(:class="{'COLOR-SCHEME-BLUE': this.colorScheme ==='blue', 'COLOR-SCHEME-GREY': this.colorScheme ==='grey'}")
</template>
<script>
export default {
  data() {
    return { colorScheme: 'blue' }
  },

  head() {
    const head = {}
    head.bodyAttrs = {}
    head.bodyAttrs.class = this.colorScheme
    return head
  },

  mounted() {
    this.$root.$on('color-scheme-change', (colorScheme) => {
      this.colorScheme = colorScheme
    })
  },
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-weight: 300;
}
@media print {
  @page {
    size: 1920px 1080px;
    padding: 0;
    margin: 0;
  }
  body {
    margin: 0;
  }
}
</style>
