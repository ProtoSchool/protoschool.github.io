import countly from '../utils/countly'
import { getTutorialByUrl } from './tutorials'
import settings from './settings'

function testComponent () {
  const tutorial = getTutorialByUrl(this.$route.params.tutorialUrl)

  const option = settings.abTesting.get(settings.abTesting.TUTORIAL_FEEDBACK_SURVEY) ||
    (Math.random() > 0.5 ? 'optionA' : 'optionB')

  countly.trackEventOnce(countly.events.TUTORIAL_FEEDBACK_SURVEY_AB_TESTING, {
    path: this.$route.path,
    tutorial: tutorial.shortTitle,
    option: option + '-2'
  })

  settings.abTesting.set(settings.abTesting.TUTORIAL_FEEDBACK_SURVEY, option)

  return option
}

export default {
  testComponent
}
