function assertLogSnapshot (log) {
  expect(log).toMatchSnapshot()
}

module.exports = { assertLogSnapshot }
