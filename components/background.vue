<template lang="pug">
  .background
    svg.newtons-cradle(:class="{'newtons-cradle-right':currentBreakpoint.index === 'blank', 'newtons-cradle-left':currentBreakpoint.index !== 'blank' && currentBreakpoint.index !=='cover'}" viewBox="0 0 160 90" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink")
      defs
        radialGradient(id="shadow-ball" cx="20%" cy="20%" r="1" gradientTransform="rotate(0, 0, 0)" gradientUnits="objectBoundingBox")
          stop(stop-color="#fff" stop-opacity="0.2" offset="0")
          stop(stop-color="#000" stop-opacity="0.5" offset="100%")
        radialGradient(id="shadow-ball-first" cx="20%" cy="20%" r="1" gradientUnits="objectBoundingBox")
          stop(stop-color="#fff" stop-opacity="0.2" offset="0")
          stop(stop-color="#000" stop-opacity="0.5" offset="100%")
          animateTransform(
            ref="firstShadowBall"
            attributeName="gradientTransform"
            type="rotate"
            begin="2s"
            keyTimes="0; 0.25; 0.5; 1"
            values="0; 15; 0; 0;"
            dur="2s"
            repeatCount="indefinite")
        radialGradient(id="shadow-ball-last" cx="20%" cy="20%" r="1" gradientUnits="objectBoundingBox")
          stop(stop-color="#fff" stop-opacity="0.2" offset="0")
          stop(stop-color="#000" stop-opacity="0.5" offset="100%")
          animateTransform(
            ref="lastShadowBall"
            attributeName="gradientTransform"
            type="rotate"
            begin="2s"
            keyTimes="0; 0.25; 0.5; 1"
            values="0; -15; 0; 0;"
            dur="2s"
            repeatCount="indefinite")
      g.first
        line.line(x1="50" y1="0" x2="50" y2="45" stroke-width="0.2")
        circle.ball-conceive(r="10" cx="50" cy="45")
        circle.ball-shadow(r="10" cx="50" cy="45" fill="url(#shadow-ball-first)" )
        image.ball(width="20" y="35" x="40" height="20" xlink:href="images/pendulo c.svg")
      g.second
        line.line(x1="70" y1="0" x2="70" y2="45" stroke-width="0.2")
        circle.ball-design(r="10" cx="70" cy="45")
        circle.ball-shadow(r="10" cx="70" cy="45" fill="url(#shadow-ball)" )
        image.ball(width="20" x="60" y="35" height="20" xlink:href="images/pendulo d.svg")
      g.third
        line.line(x1="90" y1="0" x2="90" y2="45" stroke-width="0.2")
        circle.ball-implement(r="10" cx="90" cy="45")
        circle.ball-shadow(r="10" cx="90" cy="45" fill="url(#shadow-ball)" )
        image.ball(width="20" x="80" y="35" height="20" xlink:href="images/pendulo i.svg")
      g.last
        line.line(x1="110" y1="0" x2="110" y2="45" stroke-width="0.2")
        circle.ball-operate(r="10" cx="110" cy="45")
        circle.ball-shadow(r="10" cx="110" cy="45" fill="url(#shadow-ball-last)" )
        image.ball.ball-last(width="20" transform-origin="110 45" x="100" y="35" height="20" xlink:href="images/pendulo o.svg")
</template>

<script>
export default {
  props: { currentBreakpoint: { type: Object, required: true } },
  watch: {
    currentBreakpoint(value) {
      const animations = [
        { time: 2, element: this.$refs.firstShadowBall },
        { time: 1, element: this.$refs.lastShadowBall },
      ]
      if (value.index === 'cover') {
        for (const animation of animations) {
          if (animation.element) {
            animation.element.beginElementAt(animation.time)
          }
        }
      } else {
        for (const animation of animations) {
          if (animation.element) {
            animation.element.endElement()
          }
        }
      }
    },
  },
}
</script>

<style module lang="scss">
.background {
  position: absolute;
  width: 100em;
  height: 56.25em;
  z-index: -1;
  overflow: hidden;
  background-color: var(--background);
}

@keyframes first-ball {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(15deg);
  }
  50%,
  100% {
    transform: rotate(0deg);
  }
}

@keyframes middle-ball {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-0.5deg);
  }
  50% {
    transform: rotate(0deg);
  }
  75% {
    transform: rotate(0.5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

@keyframes last-ball {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-15deg);
  }
  50%,
  100% {
    transform: rotate(0deg);
  }
}

.first {
  animation: first-ball 2s forwards infinite linear;
  transform-origin: 50px 0;
  animation-delay: 2s;
}

.second {
  animation: middle-ball 2s forwards infinite linear;
  transform-origin: 70px 0;
  animation-delay: 1s;
}

.third {
  animation: middle-ball 2s forwards infinite linear;
  transform-origin: 90px 0;
  animation-delay: 1s;
}

.last {
  animation: last-ball 2s forwards infinite linear;
  transform-origin: 110px 0;
  animation-delay: 3s;
}
.newtons-cradle g text {
  fill: var(--text-on-secondary);
}

.ball-conceive {
  fill: #00e2ff;
}

.ball-design {
  fill: #aab500;
}

.ball-implement {
  fill: #ca2a00;
}

.ball-operate {
  fill: #0050d8;
}

.line {
  stroke: var(--text);
}
.newtons-cradle {
  width: 100em;
  transition: transform 5s;
  transform: translate(0, 0) scale(1.2);
}
.newtons-cradle-right {
  transform: translate(200em, 0) scale(5);
}
.newtons-cradle-left {
  transform: translate(-200em, 0) scale(5);
}

.newtons-cradle-left .first,
.newtons-cradle-left .last,
.newtons-cradle-right .last,
.newtons-cradle-right .first,
.newtons-cradle-left .second,
.newtons-cradle-left .third,
.newtons-cradle-right .second,
.newtons-cradle-right .third {
  animation: none;
}
</style>
