<template>
  <div
    class="tracker-wrapper flex"
  >
    <div
      class="tracker dib"
      :style="`--progress: ${currentStep === 0 ? 0.05 : (currentStep / maximumStep * 1.2)}`"
      :data-show="currentStep === maximumStep"
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
    </div>
    <div class="completed-pills"></div>
    <div
      class="tracker-counter f7"
      :data-active="(currentStep + 1) <= maximumStep"
    >
      {{(currentStep + 1) > maximumStep ? maximumStep : currentStep + 1}} of {{maximumStep}}
    </div>
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
  --tracker-counter-width: 4rem;
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

.tracker-counter {
  width: var(--tracker-counter-width);
  opacity: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  transition: opacity var(--transition-default);
}

.tracker-counter:not([data-active="true"]) {
  opacity: 0;
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

.progress {
  transform-origin: left;

  transition:
    transform 900ms cubic-bezier(1, 0.18, 0, 1);
}

.completed-pills {
  --pill-height: calc(var(--height) * 0.8);
  --pill-width: calc(var(--pill-height) * 2.8);

  position: relative !important;
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
    opacity 600ms cubic-bezier(1, -300, 0, 300) 200ms,
    transform 350ms ease 400ms;
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

.tracker[data-show="true"] + .completed-pills {
  opacity: 0.01;
  transform: translateX(3px);
}
.tracker[data-show="true"] + .completed-pills::after {
  transform: translateY(-0.7rem) rotateZ(-45deg);
}
.tracker[data-show="true"] + .completed-pills::before {
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
