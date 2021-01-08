import { Booster } from '@boostercloud/framework-core'
import { BoosterConfig } from '@boostercloud/framework-types'
import { Provider } from '@boostercloud/framework-provider-aws'

Booster.configure('production', (config: BoosterConfig): void => {
  config.appName = 'process-files'
  config.provider = Provider([
    {
      packageName: '@boostercloud/rocket-uploads3-store-event-aws-infrastructure',
      parameters: {
        bucketName: 'process-big-file-rocket',
        eventTypeName: 'BigFileAdded',
        entityTypeName: 'BigFile',
      },
    },
    {
      packageName: '@boostercloud/rocket-uploads3-store-event-aws-infrastructure',
      parameters: {
        bucketName: 'process-small-file-rocket',
        eventTypeName: 'SmallFileAdded',
        entityTypeName: 'SmallFile',
      },
    },
  ])
})
