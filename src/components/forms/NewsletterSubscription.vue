<template>
  <div
    v-if="!hasUserAlreadySubscribed"
    class="newsletter-subscription flex flex-column items-center pa4 br1 navy"
    :data-state="state.type"
  >
    <div class="state-views">
      <div
        class="state-view flex flex-column items-center"
        :data-state-view="`${states.IDLE} ${states.PENDING} ${states.ERROR}`"
        :aria-hidden="stateViewAriaHidden(`${states.IDLE} ${states.PENDING} ${states.ERROR}`)"
      >
        <h2 class="tc lh-title">Subscribe to our Newsletter</h2>
        <p class="subscribe-message tc f7 mb4">We'll let you know when more tutorials like these are available</p>
        <form
          class="flex flex-column flex-row-ns"
          novalidate
          @submit.prevent="submit"
        >
          <div class="flex flex-column">
            <TextInput
              v-model="data.emailAddress"
              class="email-input w5-ns mr3-ns mb2"
              placeholder="Email Address"
              required
              type="email"
              name="email"
              :error="$v.$error && $v.data.emailAddress.$invalid"
              customErrorMessage="Please input a valid email address."
              :input="$v.data.emailAddress"
              :onBlur="onBlur"
              :disabled="state.type === states.PENDING"
            />
            <CheckboxInput
              v-model="data.leadersUpdates"
              class="leaders-updates-input w5"
              label="Send me news and guidance for local event leaders"
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
              Ops, something went wrong. Please try again later.
            </span>
          </div>
        </form>
      </div>
      <div
        class="state-view"
        :data-state-view="states.SUCCESS"
        :aria-hidden="stateViewAriaHidden(states.SUCCESS)"
      >
        <h2 class="tc">Thank you for subscribing!</h2>
        <p class="tc f7 mt4 mb0">We just sent you an email confirmation.</p>
        <p class="tc f7 mt0">We promise we will only send you important updates, no spam!</p>
      </div>
    </div>
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
      }

      // ignore the error if the user is already subscribed
      if (result.result === 'error' && !result.msg.includes('already subscribed')) {
        this.setState(states.ERROR, { error: new Error(result.msg) })
        return
      }

      this.setState(states.SUCCESS)
      settings.newsletters.set(settings.newsletters.PROTOSCHOOL, 'subscribed')
    },
    setState (state, data) {
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
    stateViewAriaHidden (stateViewStates) {
      return !stateViewStates.includes(this.state.type)
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

.newsletter-subscription p.subscribe-message {
  padding: 0 30%;

}
@media screen and (max-width: 500px) {
  .newsletter-subscription p.subscribe-message {
    padding: 0 10%;
  }
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

/* State view changes */
.state-views {
  position: relative;
  min-width: 100%;
}

.state-view {
  width: 100%;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity var(--transition-slow),
    visibility var(--transition-slow),
    transform var(--transition-slow);
}

.state-view[data-state-view~="idle"],
.state-view[data-state-view~="pending"] {
  position: relative;

  transform: translateY(10px);
}

.state-view[data-state-view~="success"] {
  position: absolute;
  top: calc(50%);
  left: calc(50%);

  transform:
    translate(-50%, calc(10px - 50%));
}

.newsletter-subscription[data-state="idle"] .state-view[data-state-view~="idle"],
.newsletter-subscription[data-state="pending"] .state-view[data-state-view~="pending"],
.newsletter-subscription[data-state="success"] .state-view[data-state-view~="success"],
.newsletter-subscription[data-state="error"] .state-view[data-state-view~="error"] {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);

  transition-delay: var(--transition-slow);
}

.newsletter-subscription[data-state="success"] .state-view[data-state-view~="success"] {
  transform: translate(-50%, -50%);
}

.newsletter-subscription[data-state="error"] .state-view[data-state-view~="error"] .error-message {
  opacity: 1;
  visibility: visible;
}

</style>
