export const events = {
  CODE_RESET: 'resetCode',
  CODE_SUBMIT_WRONG: 'submitWrongCode',
  CHOICE_SUBMIT_WRONG: 'submitWrongChoice',
  LESSON_PASSED: 'lessonPassed',
  TUTORIAL_PASSED: 'tutorialPassed',
  FILTER: 'filter',
  NEWSLETTER: 'newsletterSubscribed',
  TUTORIAL_FEEDBACK_SURVEY_ANSWER: 'tutorialFeedbackSurveyAnswer',
  TUTORIAL_FEEDBACK_SURVEY_COMPLETED: 'tutorialFeedbackSurveyCompleted',
  TUTORIAL_FEEDBACK_SURVEY_DISMISSED: 'tutorialFeedbackSurveyDismissed',
  TUTORIAL_FEEDBACK_SURVEY_AB_TESTING: 'tutorialFeedbackSurveyABTesting'
}

export function trackEvent (event, data = {}) {
  window.Countly.q.push(['add_event', {
    key: event,
    segmentation: data
  }])
}

export default {
  events,
  trackEvent
}
