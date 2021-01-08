import { Entity, Reduces } from '@boostercloud/framework-core'
import { AddressAdded } from '../events/address-added'
import { UUID } from '@boostercloud/framework-types'

@Entity
export class AddressEntity {
  public constructor(
    public id: UUID,
    readonly firstName: string,
    readonly lastName: string,
    readonly address: string,
    readonly city: string,
    readonly state: string,
    readonly postalCode: string
  ) {}

  @Reduces(AddressAdded)
  public static reduceAddressAdded(event: AddressAdded, currentAddressEntity?: AddressEntity): AddressEntity {
    return new AddressEntity(
      event.id,
      event.firstName,
      event.lastName,
      event.address,
      event.city,
      event.state,
      event.postalCode
    )
  }
}
