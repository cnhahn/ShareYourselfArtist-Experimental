var startTutorial = false
var demo_arts = ["demo_artpiece"]
var not_demo_arts = ["artpiece1", "artpiece2", "artpiece3"]
var displayed_arts = null

function displayDummySubmissionDuringTutorial () {
  displayed_arts = not_demo_arts
  console.log('list of artpieces before tutorial: ', displayed_arts)
  start_tutorial()
  update_arts()
  console.log('list of artpieces after tutorial start: ', displayed_arts)
}

function start_tutorial () {
  startTutorial = true
}

function update_arts () {
  displayed_arts = demo_arts
}
