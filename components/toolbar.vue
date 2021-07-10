<template lang="pug">
.toolbar-wrapper(@click="mouseClick($event)", @mousemove="mouseMove" :class="{'toolbar-hide-cursor': !toolbarActive}")
  .toolbar(:class='{ "toolbar-active": toolbarActive}', @pointerout="toolbarOut", @pointerover="toolbarOver", ref="toolbar")
    .toolbar-controls
      .toolbar-button(@click="toolbarToPrevious()")
        |<
      .counter
        |{{currentBreakpoint.label}}
      .toolbar-button(@click="toolbarToNext()")
        |>
    .toolbar-colors
      .toolbar-color.blue(@click="colorSchemeChange('blue')")
      .toolbar-color.grey(@click="colorSchemeChange('grey')")
</template>

<script>
export default {
  props: {
    currentBreakpoint: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      timeoutHideToolbar: 1000,
      toolbarActive: false,
      toolbarFocus: false
    }
  },
  methods: {
    colorSchemeChange(color) {
      this.$root.$emit('color-scheme-change', color)
    },
    toolbarOver() {
      this.toolbarFocus = true
      this.toolbarActive = true
    },
    toolbarOut() {
      if (this.intervalHideToolbar) {
        clearTimeout(this.intervalHideToolbar)
      }
      this.toolbarFocus = false
      this.intervalHideToolbar = setTimeout(() => {
        if (!this.toolbarFocus) {
          this.toolbarActive = false
        }
      }, this.timeoutHideToolbar)
    },
    toolbarToNext() {
      this.toolbarOut()
      this.goToNextBreakpoint()
    },
    toolbarToPrevious() {
      this.toolbarOut()
      this.goToPreviousBreakpoint()
    },
    mouseClick(event) {
      if (event.srcElement === this.$el) {
        if (!this.toolbarFocus) {
          this.toolbarActive = false
        }
        if (event.clientX > window.innerWidth / 2) {
          this.goToNextBreakpoint()
        } else {
          this.goToPreviousBreakpoint()
        }
      }
    },
    mouseMove() {
      if (!this.toolbarActive) {
        this.toolbarActive = true
        setTimeout(() => {
          if (!this.toolbarFocus) {
            this.toolbarActive = false
          }
        }, this.timeoutHideToolbar)
      }
    },
    goToPreviousBreakpoint() {
      this.$root.$emit('request-to-previous')
    },
    goToNextBreakpoint() {
      this.$root.$emit('request-to-next')
    }
  }
}
</script>

<style module>
.toolbar-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.toolbar-controls {
  display: flex;
  width: 50%;
}
.toolbar-colors {
  display: flex;
}
.toolbar-color {
  width: 25px;
  margin: 2px;
  height: 25px;
  border-radius: 15.2px;
  border: solid 2px rgba(255, 255, 255, 0);
  transition: all 200ms;
}

.grey {
  background: #545b68;
}
.blue {
  background: #006ad8;
}

.COLOR-SCHEME-GREY .grey,
.COLOR-SCHEME-BLUE .blue {
  border: solid 2px #fff;
}

.toolbar-color:hover {
  opacity: 0.8;
}

.toolbar-color:active {
  opacity: 1;
}
.toolbar-button,
.counter {
  font-size: 2rem;
  font-family: 'Segoe UI', Helvetica, sans-serif;
  color: rgba(255, 255, 255, 0.8);
  padding: 0 1rem 0 1rem;
}

.toolbar-hide-cursor {
  cursor: none;
}

.toolbar {
  user-select: none;
  transition: all 0.25s;
  box-shadow: 0 0.21875rem 0.875rem 0 rgba(47, 64, 176, 0.3);
  background-color: #222;
  min-width: 70%;
  height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  padding: 1rem;
  margin: 2rem;
  opacity: 0;
}

.toolbar-active {
  opacity: 1;
}

@media print {
  .toolbar-wrapper {
    display: none;
  }
}
</style>
