import { EventHandler } from '@boostercloud/framework-core'
import { Booster } from '@boostercloud/framework-core/dist/booster'
import { Register } from '@boostercloud/framework-types'
import { BigFileAdded } from '../events/big-file-added'
import { BigFile } from '../entities/big-file'

const numberOfLinesPerFile = 2

@EventHandler(BigFileAdded)
export class BigFileS3Event {
  public static async handle(event: BigFileAdded, register: Register): Promise<void> {
    const AWS = require('aws-sdk')
    const s3 = new AWS.S3()

    const bigfile = await Booster.fetchEntitySnapshot(BigFile, event.s3uri)
    if (bigfile) {
      const s3uriArray = bigfile.id.toString().split('/')
      const key = s3uriArray.pop()
      const bucketName = s3uriArray.pop()

      const params = {
        Bucket: bucketName,
        Key: key,
      }
      const data = await s3.getObject(params).promise()
      const content = data.Body.toString()

      let arrayLines = []
      const lines = content.split('\n')
      let itr = 0
      let fileNumber = 1

      while (itr < lines.length) {
        if (arrayLines.length != 0 && arrayLines.length % numberOfLinesPerFile == 0) {
          const newKey = `part-${fileNumber}-${key}`
          await s3
            .putObject({
              Bucket: 'process-small-file-rocket',
              Key: newKey,
              ContentType: 'text/csv',
              Body: arrayLines.join('\n'),
            })
            .promise()

          fileNumber = fileNumber + 1
          arrayLines = []
        }
        if (lines[itr]) {
          arrayLines.push(lines[itr])
        }

        itr = itr + 1
      }

      if (arrayLines.length != 0) {
        const newKey = `part-${fileNumber}-${key}`
        await s3
          .putObject({
            Bucket: 'process-small-file-rocket',
            Key: newKey,
            ContentType: 'text/csv',
            Body: arrayLines.join('\n'),
          })
          .promise()
      }
    }
  }
}
