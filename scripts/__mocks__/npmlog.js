const npmlog = jest.genMockFromModule('npmlog')

npmlog.info = (log) => {
  npmlog._onLog && npmlog._onLog(log)
}
npmlog.debug = () => {}
npmlog.error = () => {}
npmlog.warn = () => {}
npmlog.addLevel = () => {}
export default npmlog
