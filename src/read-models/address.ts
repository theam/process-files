import { ReadModel, Projects } from '@boostercloud/framework-core'
import { UUID, ProjectionResult } from '@boostercloud/framework-types'
import { AddressEntity } from '../entities/address-entity'

@ReadModel({
  authorize: 'all',
})
export class Address {
  public constructor(
    public id: UUID,
    readonly firstName: string,
    readonly lastName: string,
    readonly address: string,
    readonly city: string,
    readonly state: string,
    readonly postalCode: string
  ) {}

  @Projects(AddressEntity, 'id')
  public static projectListeningAnalyticsEntity(
    entity: AddressEntity,
    currentAddress?: Address
  ): ProjectionResult<Address> {
    return new Address(
      entity.id,
      entity.firstName,
      entity.lastName,
      entity.address,
      entity.city,
      entity.state,
      entity.postalCode
    )
  }
}
