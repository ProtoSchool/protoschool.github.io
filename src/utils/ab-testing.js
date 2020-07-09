import { EVENTS } from '../utils/countly'
import { getTutorialByUrl } from './tutorials'
import settings from './settings'

function testComponent (event) {
  const tutorial = getTutorialByUrl(this.$route.params.tutorialUrl)

  const option = settings.abTesting.get(settings.abTesting.TUTORIAL_FEEDBACK_SURVEY) ||
    (Math.random() > 0.5 ? 'optionA' : 'optionB')

  window.Countly.q.push(['add_event', {
    key: EVENTS.TUTORIAL_FEEDBACK_SURVEY_AB_TESTING,
    segmentation: {
      path: this.$route.path,
      tutorial: tutorial.shortTitle,
      option
    }
  }])

  settings.abTesting.set(settings.abTesting.TUTORIAL_FEEDBACK_SURVEY, option)

  return option
}

export default {
  testComponent
}
