import { Entity, Reduces } from '@boostercloud/framework-core'
import { BigFileAdded } from '../events/big-file-added'
import { UUID } from '@boostercloud/framework-types'

@Entity
export class BigFile {
  public constructor(public id: UUID, readonly filesize: number) {}

  @Reduces(BigFileAdded)
  public static reduceBigFileAdded(event: BigFileAdded, currentBigFile?: BigFile): BigFile {
    return new BigFile(event.s3uri, event.filesize)
  }
}
