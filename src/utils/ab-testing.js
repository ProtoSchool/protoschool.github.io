import { EVENTS } from '../static/countly'
import settings from './settings'

function testComponent (event) {
  const option = settings.abTesting.get(settings.abTesting.TUTORIAL_FEEDBACK_SURVEY) ||
    (Math.random() > 0.5 ? 'optionA' : 'optionB')

  window.Countly.q.push(['add_event', {
    key: EVENTS.TUTORIAL_FEEDBACK_SURVEY_AB_TESTING,
    segmentation: {
      path: this.$route.path,
      option
    }
  }])

  settings.abTesting.set(settings.abTesting.TUTORIAL_FEEDBACK_SURVEY, option)

  return option
}

export default {
  testComponent
}
