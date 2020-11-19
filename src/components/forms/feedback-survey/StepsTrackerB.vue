<template>
  <div
    class="tracker flex"
    :style="`--progress: ${currentStep}`"
  >
    <div
      v-for="i in maximumStep"
      :key="i"
      class="step dib"
      :data-completed="currentStep === maximumStep"
      :data-step-completed="(i - 1) >= currentStep"
      :data-is-last="i === maximumStep"
    >
      <div
        class="step-progress"
        role="progressbar"
        :aria-valuenow="currentStep / maximumStep"
        aria-valuemin="1"
        :aria-valuemax="maximumStep"
        :aria-valuetext="`Question ${currentStep + 1}`"
      >
      </div>
    </div>
    <div class="completed-pills"></div>
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
.tracker {
  --height: 0.25rem;
  --progress: 2px;

  position: relative;
  height: var(--height);
}

.step {
  position: relative;
  background: var(--color-gray-muted);
  height: var(--height);
  width: 100%;
  margin-right: 1rem;

  border-radius: var(--height);
  overflow: hidden;
}

.step[data-is-last="true"] {
  margin-right: 0;
}

.step-progress {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  transform: translateX(0);

  width: 100%;

  background: var(--color-aqua);

  transform-origin: left;

  transition:
    transform 900ms cubic-bezier(1, 0.18, 0, 1);
}

.step[data-step-completed="true"] .step-progress {
  transform: translateX(-100%);
}

.completed-pills {
  --pill-height: calc(var(--height) * 0.8);
  --pill-width: calc(var(--pill-height) * 2.8);
}

.completed-pills,
.completed-pills::after,
.completed-pills::before {
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

.completed-pills {
  opacity: 0;
  top: calc(50% - var(--pill-height) / 2);
  right: calc(-1 * var(--pill-width) - 5px);
}

.completed-pills::after {
  top: calc(50% - var(--pill-height) / 2);
  right: 0.2rem;
  transform: translateY(-0.6rem) rotateZ(-45deg);
}

.completed-pills::before {
  top: calc(50% - var(--pill-height) / 2);
  right: 0.2rem;

  transform: translateY(0.6rem) rotateZ(45deg);
}

.step[data-completed="true"] + .completed-pills {
  opacity: 0.01;
  transform: translateX(3px);
}
.step[data-completed="true"] + .completed-pills::after {
  transform: translateY(-0.7rem) rotateZ(-45deg);
}
.step[data-completed="true"] + .completed-pills::before {
  transform: translateY(0.7rem) rotateZ(45deg);
}

/* Completely hide the steps */
.step[data-completed="true"] {
  transform: scaleX(0);

  transform-origin: right;
  transition: transform var(--transition-slow);
  transition-delay: 1.2s;
}
</style>
