<template lang="pug">
  span
    |{{currentText}}
    span.cursor(v-show="isRunning" :class="{'blinking': isRunning }")
      ||
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    },
    speed: {
      type: Number,
      default: 100
    },
    withErrors: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data() {
    return {
      currentText: '',
      stack: [],
      isRunning: false
    }
  },

  watch: {
    text(value, oldValue) {
      let commonTextCount = 0
      for (let i = 0; i < value.length; i++) {
        if (value.charAt(i) === oldValue.charAt(i)) {
          commonTextCount++
        } else {
          break
        }
      }
      if (commonTextCount < oldValue.length) {
        this.stack.push({
          type: 'delete',
          count: oldValue.length - commonTextCount
        })
      }
      if (commonTextCount <= value.length) {
        this.stack.push({ type: 'add', text: value.slice(commonTextCount) })
      }
      this.updateText()
    }
  },
  mounted() {
    if (this.text) {
      this.stack.push({ type: 'add', text: this.text })
      this.updateText()
    }
  },
  methods: {
    delay(timeout) {
      return new Promise((resolve) => setTimeout(resolve, timeout))
    },
    getRandomTypingTime() {
      return Math.floor(Math.random() * this.speed)
    },
    getRandomCharacter() {
      const letters = 'abcdefghijklmnopqrstuvwxyz'
      return letters.charAt(Math.floor(Math.random() * letters.length))
    },
    async updateText() {
      if (this.isRunning || this.stack.length === 0) {
        return
      }
      this.isRunning = true
      try {
        for (
          let action = this.stack.shift();
          action;
          action = this.stack.shift()
        ) {
          if (action.type === 'delete') {
            for (let i = 0; i < action.count; i++) {
              await this.delay(this.getRandomTypingTime())
              this.currentText = this.currentText.slice(
                0,
                this.currentText.length - 1
              )
            }
          } else {
            for (let i = 0; i < action.text.length; i++) {
              await this.delay(this.getRandomTypingTime())
              if (this.withErrors && Math.random() < 0.1) {
                const numberOfWrongCharacters = Math.floor(Math.random() * 3)
                for (let k = 0; k < numberOfWrongCharacters; k++) {
                  this.currentText += this.getRandomCharacter()
                  await this.delay(this.getRandomTypingTime())
                }
                for (let k = 0; k < numberOfWrongCharacters; k++) {
                  await this.delay(this.getRandomTypingTime())
                  this.currentText = this.currentText.slice(
                    0,
                    this.currentText.length - 1
                  )
                }
              }
              this.currentText += action.text.charAt(i)
            }
          }
        }
      } finally {
        this.isRunning = false
        this.$emit('updated')
      }
    }
  }
}
</script>

<style module>
.cursor {
  opacity: 0;
}
.blinking {
  animation: blink 0.5s linear infinite;
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  49% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  99% {
    opacity: 0;
  }
}
</style>
