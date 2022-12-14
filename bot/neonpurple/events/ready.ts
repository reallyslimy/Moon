import {MoonEvent} from 'moonhandler'
import report from 'yurnalist'

export default new MoonEvent('ready', async () => {
  report.step(3, 3, '✅ Bot is up and running!')
})
