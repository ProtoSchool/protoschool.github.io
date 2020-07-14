<template>
  <div v-if="hideIfAlreadySubscribed ? !hasUserAlreadySubscribed : true">
    <transition
      name="state-view-transition"
      mode="out-in"
    >
      <div
        v-if="stateViewActive(viewStates.form)"
        key="form"
        class="newsletter-subscription content-banner state-view flex flex-column items-center navy"
        :data-state="state.type"
        :data-state-view-active="stateViewActive(viewStates.form)"
        :aria-hidden="!stateViewActive(viewStates.form)"
      >
        <h2 class="tc lh-title">Subscribe to Our Newsletter</h2>
        <p class="subscribe-message tc f7 mb4">We'll let you know when we release new tutorials or site features.</p>
        <form
          class="flex flex-row-ns flex-column justify-center flex-wrap"
          novalidate
          method="POST"
          target="_blank"
          @submit="submit"
          :action="`${config.MAILCHIMP_API_URL}/subscribe/post?${formValuesInQueryString}`"
        >
          <!-- bot spam mitigation -->
          <div style="position: absolute; left: -5000px;" aria-hidden="true">
            <input
              v-model="data[BOT_INPUT_MITIGATION_NAME]"
              type="text"
              :name="BOT_INPUT_MITIGATION_NAME"
              tabindex="-1"
            />
          </div>
          <TextInput
            v-model="data.emailAddress"
            class="email-input mr3-ns mb3-ns mb3 order-1"
            placeholder="Email Address"
            required
            type="email"
            name="email"
            :error="$v.$error && $v.data.emailAddress.$invalid"
            customErrorMessage="Please enter a valid email address."
            :input="$v.data.emailAddress"
            :onBlur="onBlur"
            :disabled="state.type === states.PENDING"
          />
          <Button
            class="submit-button mt4 mt0-ns order-2-ns order-3"
            text="Sign Up"
            type="submit"
            :blur="onBlur"
            :loading="state.type === states.PENDING"
          />
          <CheckboxInput
            v-model="data.leadersUpdates"
            class="leaders-updates-input w-100 order-3-ns order-2"
            label="Send me additional news and guidance for local event leaders."
            :disabled="state.type === states.PENDING"
          />
        </form>
      </div>
      <div
        v-if="stateViewActive(viewStates.thankYouMessage)"
        key="thankYouMessage"
        class="newsletter-subscription content-banner state-view flex flex-column items-center justify-center pa4 navy"
        :data-state-view-active="stateViewActive(viewStates.thankYouMessage)"
        :aria-hidden="!stateViewActive(viewStates.thankYouMessage)"
      >
        <h2 class="tc">Thank you for subscribing!</h2>
        <p class="tc f7 mt3">We promise we'll only send you important updates, no spam! You can opt out at any time using the unsubscribe link at the bottom of each email.</p>
      </div>
    </transition>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import qs from 'querystringify'

import config from '../../config'
import settings from '../../utils/settings'
import countly from '../../utils/countly'
import Button from '../buttons/Button.vue'
import CheckboxInput from './inputs/CheckboxInput.vue'
import TextInput from './inputs/TextInput.vue'

const states = {
  IDLE: 'idle',
  PENDING: 'pending',
  SUCCESS: 'success'
}

const MAILCHIMP_AUDIENCE_INTEREST_QUERY_KEY = 'group[68559][1]' // event organizer newsletter
const BOT_INPUT_MITIGATION_NAME = 'b_41e9e493c56c3865870435d91_967f7cf514'

export default {
  name: 'NewsletterSubscription',
  mixins: [validationMixin],
  components: {
    Button,
    TextInput,
    CheckboxInput
  },
  props: {
    hideIfAlreadySubscribed: {
      type: Boolean,
      default: true
    }
  },
  data: (self) => {
    return {
      config,
      BOT_INPUT_MITIGATION_NAME,
      data: {
        emailAddress: '',
        leadersUpdates: false,
        [BOT_INPUT_MITIGATION_NAME]: ''
      },
      state: {
        type: states.IDLE
      }
    }
  },
  computed: {
    states: () => states,
    viewStates: () => ({
      form: [states.IDLE, states.PENDING],
      thankYouMessage: [states.SUCCESS]
    }),
    hasUserAlreadySubscribed: () => {
      return !!settings.newsletters.get(settings.newsletters.PROTOSCHOOL)
    },
    formValuesInQueryString: function () {
      const params = {
        u: config.MAILCHIMP_USER_ID,
        id: config.MAILCHIMP_LIST_ID,
        EMAIL: this.data.emailAddress,
        subscribe: 'Subscribe'
      }

      // parameter cannot be present if false
      if (this.data.leadersUpdates) {
        params[MAILCHIMP_AUDIENCE_INTEREST_QUERY_KEY] = 1
      }

      return qs.stringify(params)
    },
    trackingData: function () {
      let source = `${this.$route.name} Page`

      if (this.$route.path === '/news') {
        source = 'News Page'
      } else if (this.$route.path.endsWith('/resources')) {
        source = 'Resources Page'
      }

      return {
        path: this.$route.path,
        source
      }
    }
  },
  methods: {
    async submit (event) {
      this.$v.$touch()

      if (this.$v.$error || this.data[BOT_INPUT_MITIGATION_NAME]) {
        event.preventDefault()
        return
      }

      this.setState(states.PENDING)
      setTimeout(() => this.setState(states.SUCCESS), 1000)
      countly.trackEvent(countly.events.NEWSLETTER, this.trackingData)
      settings.newsletters.set(settings.newsletters.PROTOSCHOOL, 'subscribed')
    },
    setState (state, data = {}) {
      this.state = { type: state }
    },
    stateViewActive (stateViewStates) {
      return stateViewStates.includes(this.state.type)
    },
    onBlur () {
      this.$v.$reset()
    }
  },
  validations: {
    data: {
      emailAddress: {
        required,
        email
      }
    }
  }
}
</script>
<style scoped>
.newsletter-subscription {
  --spacing-horizontal: 11rem;

  padding: 2rem var(--spacing-horizontal);
}

@media screen and (max-width: 50em) {
  .newsletter-subscription {
    --spacing-horizontal: 8rem;
  }
}

@media screen and (max-width: 40em) {
  .newsletter-subscription {
    --spacing-horizontal: 4rem;
  }
}
@media screen and (max-width: 35em) {
  .newsletter-subscription {
    --spacing-horizontal: 2rem;
  }
}

.newsletter-subscription h2 {
  margin: 0;
}

form {
  width: 100%;
}

form .submit-button,
form .email-input {
  height: 40px;
}

form .email-input {
  flex-grow: 2;
}

.error-message {
  color: var(--color-red);
}
</style>
