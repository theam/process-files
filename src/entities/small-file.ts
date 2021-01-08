import { Entity, Reduces } from '@boostercloud/framework-core'
import { UUID } from '@boostercloud/framework-types'
import { SmallFileAdded } from '../events/small-file-added'

@Entity
export class SmallFile {
  public constructor(public id: UUID, readonly filesize: number) {}

  @Reduces(SmallFileAdded)
  public static reduceSmallFileAdded(event: SmallFileAdded, currentSmallFile?: SmallFile): SmallFile {
    return new SmallFile(event.s3uri, event.filesize)
  }
}
