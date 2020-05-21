const npmlog = jest.genMockFromModule('npmlog')

npmlog.info = () => {}
npmlog.debug = () => {}
npmlog.error = () => {}
npmlog.warn = () => {}
npmlog.addLevel = () => {}

module.exports = npmlog
