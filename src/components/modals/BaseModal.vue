<template>
  <portal to="modal" v-if="show" :target-class="targetClass">
    <div :class="`modal-overlay ${targetClass}`"></div>
    <div :class="`modal ${targetClass}`" :data-cy="dataCy">
      <div class="modal-content pa4">
        <div v-if="title" class="modal-title f2 measure-narrow b mb4 lh-title">{{title}}</div>
        <slot></slot>
        <ButtonClose
          title="Close modal"
          :onDismiss="close"
        />
      </div>
    </div>
  </portal>
</template>

<script>
import ButtonClose from '../buttons/ButtonClose'

export default {
  name: 'BaseModal',
  components: {
    ButtonClose
  },
  props: {
    show: Boolean,
    targetClass:
    {
      type: String,
      default: ''
    },
    onClose: {
      type: Function,
      default: () => {}
    },
    // Content
    title: String,
    dataCy: String
  },
  methods: {
    close () {
      this.show = false
      this.onClose()
    }
  }
}
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  background: var(--color-navy);
  opacity: 0.9;
}

.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;
}

@media screen and (min-width: 30em) {
  .modal.dn-ns,
  .modal-overlay.dn-ns {
    display: none !important;
  }
}

.modal-content {
  position: relative;

  /* Force dimensions to trigger scroll */
  max-width: calc(100vw - 1.5rem);
  max-height: calc(100vh - 1.5rem);
  overflow: auto;

  background: var(--color-snow-muted);
  border-radius: var(--border-radius-default);
}

@media only screen and (max-width: 26rem) {
  .modal {
    padding: 5rem 0;
  }
}
</style>
