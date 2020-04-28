<template>
  <div
    class="tracker-wrapper flex"
  >
    <div
      class="tracker dib"
      :style="`--progress: ${currentStep === 0 ? 0.01 : currentStep / maximumStep}`"
      :data-show="(currentStep / maximumStep) === 1"
    >
      <div
        class="progress"
        role="progressbar"
        :aria-valuenow="currentStep / maximumStep"
        aria-valuemin="1"
        :aria-valuemax="maximumStep + 1"
        :aria-valuetext="`Question ${currentStep + 1}`"
      >
      </div>
      <div class="progress-tip"></div>
    </div>
    <div class="progress-completed"></div>
  </div>
</template>

<script>
export default {
  props: {
    currentStep: Number,
    maximumStep: Number
  }
}
</script>

<style scoped>
.tracker-wrapper {
  --height: 0.25rem;
  --progress: 2px;

  position: relative;
  height: var(--height);
}

.tracker {
  position: relative;
  background: var(--color-gray-muted);
  height: var(--height);
  width: 100%;

  border-radius: var(--height);
  overflow: hidden;
}

.progress {
  content: '';

  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  transform: scaleX(var(--progress));

  width: 100%;

  background: var(--color-aqua);
}

.progress-tip {
  content: '';

  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  transform: translateX(calc(var(--progress) * 100%));

  height: 100%;
  border-radius: var(--height);
}

.progress-tip::before {
  content: '';
  z-index: 1;
  position: absolute;
  top: 0;
  left: calc(var(--height) * -0.5);
  bottom: 0;

  width: var(--height);

  background-color: var(--color-gray-muted);
}
.progress-tip::after {
  content: '';
  z-index: 2;
  position: absolute;
  top: 0;
  left: calc(var(--height) * -1);
  bottom: 0;

  width: var(--height);
  border-radius: var(--height);

  background-color: var(--color-aqua);
}

.progress, .progress-tip {
  transform-origin: left;

  transition:
    transform 900ms cubic-bezier(1, 0.18, 0, 1);
}

.progress-completed {
  --pill-height: calc(var(--height) * 0.8);
  --pill-width: calc(var(--pill-height) * 2.8);
}

.progress-completed,
.progress-completed::after,
.progress-completed::before {
  content: '';

  position: absolute;

  height: var(--pill-height);
  width: var(--pill-width);
  border-radius: var(--pill-height);
  background-color: var(--color-navy);

  transition:
    opacity 600ms cubic-bezier(1, -300, 0, 300) 400ms,
    transform 350ms ease 700ms;
}

.progress-completed {
  opacity: 0;
  top: calc(50% - var(--pill-height) / 2);
  right: calc(-1 * var(--pill-width) - 5px);
}

.progress-completed::after {
  top: calc(50% - var(--pill-height) / 2);
  right: 0.2rem;
  transform: translateY(-0.6rem) rotateZ(-45deg);
}

.progress-completed::before {
  top: calc(50% - var(--pill-height) / 2);
  right: 0.2rem;

  transform: translateY(0.6rem) rotateZ(45deg);
}

.tracker[data-show="true"] + .progress-completed {
  opacity: 0.01;
  transform: translateX(3px);
}
.tracker[data-show="true"] + .progress-completed::after {
  transform: translateY(-0.7rem) rotateZ(-45deg);
}
.tracker[data-show="true"] + .progress-completed::before {
  transform: translateY(0.7rem) rotateZ(45deg);
}

/* Completely hide the tracker */
.tracker[data-show="true"] {
  transform: scaleX(0);

  transform-origin: right;
  transition: transform var(--transition-slow);
  transition-delay: 1.2s;
}
</style>
