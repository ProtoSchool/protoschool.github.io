<template>
  <div v-if="hideIfAlreadySubscribed ? !hasUserAlreadySubscribed : true">
    <transition
      name="state-view-transition"
      mode="out-in"
    >
      <div
        v-if="stateViewActive(viewStates.form)"
        key="form"
        class="newsletter-subscription state-view flex flex-column items-center pa4 br1 navy"
        :data-state="state.type"
        :data-state-view-active="stateViewActive(viewStates.form)"
        :aria-hidden="!stateViewActive(viewStates.form)"
      >
        <h2 class="tc lh-title">Subscribe to our Newsletter</h2>
        <p class="subscribe-message tc f7 mb4">We'll let you know when we release new tutorials or site features.</p>
        <form
          class="flex flex-column flex-row-ns justify-center"
          novalidate
          @submit.prevent="submit"
        >
          <div class="flex flex-column">
            <TextInput
              v-model="data.emailAddress"
              class="email-input w5-ns mr3-ns mb3-ns mb2"
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
            <CheckboxInput
              v-model="data.leadersUpdates"
              class="leaders-updates-input w5"
              label="Send me additional news and guidance for local event leaders."
              :disabled="state.type === states.PENDING"
            />
            <!-- bot spam mitigation -->
            <div style="position: absolute; left: -5000px;" aria-hidden="true">
              <input
                v-model="data[BOT_INPUT_MITIGATION_NAME]"
                type="text"
                :name="BOT_INPUT_MITIGATION_NAME"
                tabindex="-1"
                value=""
              />
            </div>
          </div>
          <div class="flex flex-column">
            <Button
              class="submit-button mt3 mt0-ns"
              text="Sign Up"
              type="submit"
              :blur="onBlur"
              :loading="state.type === states.PENDING"
            />
            <span class="error-message f7 mt2 mw4-ns">
              Oops, something went wrong. Please try again later.
            </span>
          </div>
        </form>
      </div>
      <div
        v-if="stateViewActive(viewStates.thankYouMessage)"
        key="thankYouMessage"
        class="newsletter-subscription state-view flex flex-column items-center justify-center pa4 br1 navy"
        :data-state-view-active="stateViewActive(viewStates.thankYouMessage)"
        :aria-hidden="!stateViewActive(viewStates.thankYouMessage)"
      >
        <h2 class="tc">Thank you for subscribing!</h2>
        <p class="tc f7 mt4 mb1">You'll receive a welcome email from us shortly.</p>
        <p class="tc f7 mt0">We promise we'll only send you important updates, no spam! You can opt out at any time using the unsubscribe link at the bottom of each email.</p>
      </div>
    </transition>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import jsonp from 'jsonp'
import pify from 'pify'
import qs from 'querystringify'

import {
  MAILCHIMP_API_URL,
  MAILCHIMP_USER_ID,
  MAILCHIMP_LIST_ID
} from '../../config'
import settings from '../../utils/settings'
import { EVENTS } from '../../static/countly'
import Button from '../buttons/Button.vue'
import CheckboxInput from './inputs/CheckboxInput.vue'
import TextInput from './inputs/TextInput.vue'

const states = {
  IDLE: 'idle',
  PENDING: 'pending',
  ERROR: 'error',
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
    },
    tracking: String
  },
  data: (self) => {
    return {
      BOT_INPUT_MITIGATION_NAME: BOT_INPUT_MITIGATION_NAME,
      data: {
        emailAddress: '',
        leadersUpdates: false,
        [BOT_INPUT_MITIGATION_NAME]: ''
      },
      state: {
        type: states.IDLE,
        error: null
      }
    }
  },
  computed: {
    states: () => states,
    viewStates: () => ({
      form: [states.IDLE, states.PENDING, states.ERROR],
      thankYouMessage: [states.SUCCESS]
    }),
    hasUserAlreadySubscribed: () => {
      return !!settings.newsletters.get(settings.newsletters.PROTOSCHOOL)
    }
  },
  methods: {
    getFormValues () {
      const params = {
        u: MAILCHIMP_USER_ID,
        id: MAILCHIMP_LIST_ID,
        EMAIL: this.data.emailAddress,
        subscribe: 'Subscribe'
      }

      // parameter cannot be present if false
      if (this.data.leadersUpdates) {
        params[MAILCHIMP_AUDIENCE_INTEREST_QUERY_KEY] = 1
      }

      return params
    },
    async submit () {
      this.$v.$touch()

      if (this.$v.$error || this.data[BOT_INPUT_MITIGATION_NAME]) {
        return
      }

      this.setState(states.PENDING)

      let result

      try {
        result = await pify(jsonp)(
          `${MAILCHIMP_API_URL}/subscribe/post-json?${qs.stringify(this.getFormValues())}`,
          { param: 'c' } // callback function name
        )
      } catch (error) {
        this.setState(states.ERROR, { error })
        return
      }

      // ignore the error if the user is already subscribed
      if (result.result === 'error' && !result.msg.includes('already subscribed')) {
        this.setState(states.ERROR, { error: new Error(result.msg) })
        return
      }

      this.setState(states.SUCCESS)
      settings.newsletters.set(settings.newsletters.PROTOSCHOOL, 'subscribed')
      this.trackEvent(EVENTS.NEWSLETTER)
    },
    trackEvent: function (event, opts = {}) {
      window.Countly.q.push(['add_event', {
        key: event,
        segmentation: {
          path: this.$route.path,
          source: this.tracking,
          ...opts
        }
      }])
    },
    setState (state, data = {}) {
      switch (state) {
        case states.ERROR:
          console.log(data.error)
          this.state = { type: state, error: data.error }
          break
        default:
          this.state = { type: state, error: null }
          break
      }
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
  background-color: #F2F5F6;
  box-shadow: var(--shadow-default);
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

.error-message {
  opacity: 0;
  visibility: hidden;
  color: var(--color-red);

  transition:
    opacity var(--transition-slow),
    visibility var(--transition-slow);
}

.newsletter-subscription[data-state="error"].state-view[data-state-view-active="true"] .error-message {
  opacity: 1;
  visibility: visible;
}
</style>
