import settings from './settings'

export const events = {
  CODE_RESET: 'resetCode',
  CODE_VIEW_SOLUTION: 'viewSolutionCode',
  LINK_CLICK_IPLD_EXPLORER: 'linkClickIpldExplorer',
  LINK_CLICK_CID_INSPECTOR: 'linkClickCidInspector',
  CODE_SUBMIT_WRONG: 'submitWrongCode',
  CHOICE_SUBMIT_WRONG: 'submitWrongChoice',
  LESSON_PASSED: 'lessonPassed',
  TUTORIAL_PASSED: 'tutorialPassed',
  FILTER: 'filter',
  NEWSLETTER: 'newsletterSubscribed',
  TUTORIAL_FEEDBACK_SURVEY_ANSWER: 'tutorialFeedbackSurveyAnswer',
  TUTORIAL_FEEDBACK_SURVEY_COMPLETED: 'tutorialFeedbackSurveyCompleted',
  TUTORIAL_FEEDBACK_SURVEY_DISMISSED: 'tutorialFeedbackSurveyDismissed',
  TUTORIAL_FEEDBACK_SURVEY_AB_TESTING: 'tutorialFeedbackSurveyABTesting',
  NEWSLETTER_REFERRAL: 'newsletterReferral'
}

/*
  Track an event to countly with the provided data
*/
export function trackEvent (event, data = {}) {
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
    return
  }

  trackEvent(event, data)
  settings.countly.markEventAsTracked(event, data)
}

export default {
  events,
  trackEvent,
  trackEventOnce
}
