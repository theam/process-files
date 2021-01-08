import { EventHandler } from '@boostercloud/framework-core'
import { SmallFileAdded } from '../events/small-file-added'
import { Register, UUID } from '@boostercloud/framework-types'
import { Booster } from '@boostercloud/framework-core/dist/booster'
import { SmallFile } from '../entities/small-file'
import { AddressAdded } from '../events/address-added'

@EventHandler(SmallFileAdded)
export class BigFileS3Event {
  public static async handle(event: SmallFileAdded, register: Register): Promise<void> {
    const AWS = require('aws-sdk')
    const s3 = new AWS.S3()

    const smallFile = await Booster.fetchEntitySnapshot(SmallFile, event.s3uri)
    if (smallFile) {
      const s3uriArray = smallFile.id.toString().split('/')
      const key = s3uriArray.pop()
      const bucketName = s3uriArray.pop()

      const params = {
        Bucket: bucketName,
        Key: key,
      }
      const data = await s3.getObject(params).promise()
      const content = data.Body.toString()
      const lines = content.split('\n')

      for (let i = 0; i < lines.length; i++) {
        const values = lines[i].split(',')
        const newAddressAdded = new AddressAdded(
          UUID.generate(),
          values[1],
          values[2],
          values[3],
          values[4],
          values[5],
          values[6]
        )

        register.events(newAddressAdded)
      }
    }
  }
}
