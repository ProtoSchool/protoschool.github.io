import settings from './settings'
import { debugLog } from './debug'

export const events = {
  CHOICE_SUBMIT_WRONG: 'submitWrongChoice',
  CODE_RESET: 'resetCode',
  CODE_SUBMIT_WRONG: 'submitWrongCode',
  CODE_VIEW_SOLUTION: 'viewSolutionCode',
  FILTER: 'filter',
  LESSON_PASSED: 'lessonPassed',
  LINK_CLICK_CID_INSPECTOR: 'linkClickCidInspector',
  LINK_CLICK_IPLD_EXPLORER: 'linkClickIpldExplorer',
  NEWSLETTER_REFERRAL: 'newsletterReferral',
  NEWSLETTER: 'newsletterSubscribed',
  PROFILE_SURVEY_CLICK: 'profileSurveyClick',
  TUTORIAL_FEEDBACK_SURVEY_AB_TESTING: 'tutorialFeedbackSurveyABTesting',
  TUTORIAL_FEEDBACK_SURVEY_ANSWER: 'tutorialFeedbackSurveyAnswer',
  TUTORIAL_FEEDBACK_SURVEY_COMPLETED: 'tutorialFeedbackSurveyCompleted',
  TUTORIAL_FEEDBACK_SURVEY_DISMISSED: 'tutorialFeedbackSurveyDismissed',
  TUTORIAL_MODAL_REDIRECT_ACTION: 'tutorialModalRedirectAction',
  TUTORIAL_PASSED: 'tutorialPassed',
  TWITTER_SHARE_TUTORIAL_PASSED: 'twitterShareTutorialPassed'
}

/*
  Track an event to countly with the provided data
*/
export function trackEvent (event, data = {}) {
  debugLog('[countly]', 'trackEvent()', event, data)

  window.Countly.q.push(['add_event', {
    key: event,
    segmentation: data
  }])
}

/*
  Track an event to countly with the provided data only once.
  A unique ID is calculated using the event and the data object.
  Events will be tracked more than once if the data is different.

  Examples:

  1. Tracking the same event with different data -> both events are tracked
  event: 'lessonPassed', data: { lessonNumber: 1 }
  event: 'lessonPassed', data: { lessonNumber: 2 }

  2. Tracking the same event with the same data -> only the first event is tracked
  event: 'lessonPassed', data: { lessonNumber: 1 }
  event: 'lessonPassed', data: { lessonNumber: 1 }
*/
export function trackEventOnce (event, data) {
  if (settings.countly.hasEventBeenTracked(event, data)) {
    debugLog('[countly]', 'trackEventOnce()', 'skipped tracking because event was already tracked.', event, data)
    return
  }

  debugLog('[countly]', 'trackEventOnce()', event, data)
  trackEvent(event, data)
  settings.countly.markEventAsTracked(event, data)
}

export default {
  events,
  trackEvent,
  trackEventOnce
}
