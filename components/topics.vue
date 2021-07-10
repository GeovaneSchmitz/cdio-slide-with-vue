<template lang="pug">
div.wrapper
  .list(:class='{"list-disable": currentTopics !== 1}')
    .topic(v-for="(topic, index) in topics1" :key="topic" v-html="topic")
      span(v-html="topic")
  .list.list-2(:class='{"list-disable": currentTopics !== 2}')
    .topic(v-for="(topic, index) in topics2" :key="topic")
      span(v-html="topic")
</template>
<script>
import appTextTyping from '@/components/text-typing.vue'

export default {
  components: { appTextTyping },
  props: {
    topics: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      setTimeoutId: null,
      currentTopics: 1,
      topics1: [],
      topics2: []
    }
  },
  watch: {
    topics(value) {
      if (this.setTimeoutId) clearTimeout(this.setTimeoutId)
      if (this.currentTopics === 1) {
        this.topics2 = value
        this.currentTopics = 2
        this.setTimeoutId =
          (() => {
            this.topics1 = []
          },
          400)
      } else {
        this.currentTopics = 1
        this.topics1 = value
        this.setTimeoutId =
          (() => {
            this.topics2 = []
          },
          400)
      }
    }
  },

  methods: {}
}
</script>

<style module lang="scss">
.wrapper {
  position: relative;
}

.list {
  list-style: none;
  padding: 0;
  position: absolute;
  margin: 0;
  transition: all 400ms;
  display: flex;
  flex-direction: column;
  word-break: break-word;
  &-disable {
    opacity: 0;
    transform: translateX(1em);
  }
}

.topic {
  opacity: 1;
  display: inline-block;
  transition: all 400ms;
  position: relative;
  margin: 0;
  vertical-align: middle;
  margin-top: 1em;
  padding-left: 1em;
}
.topic span {
  word-break: break-word;
  max-width: 100%;
}
.topic::before {
  content: '• ';
  position: absolute;
  font-size: 2em;
  left: 0;
  top: -0.3em;
  vertical-align: middle;
  color: var(--secondary);
}
</style>
