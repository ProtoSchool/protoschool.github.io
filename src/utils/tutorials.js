import tutorialsList from '../static/tutorials.json'

export const getCurrentTutorial = route => (
  route.props && route.props.default && route.props.default.tutorialId &&
    tutorialsList[route.props.default.tutorialId]
)

export const getTutorialFullUrl = tutorial => `${window.location.origin}/#/${tutorial.url}`

export const isTutorialPassed = tutorial => !!localStorage[`passed/${tutorial.url}`]
