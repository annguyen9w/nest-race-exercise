/* eslint-disable @typescript-eslint/no-explicit-any */
import 'automapper-ts'
import { Injectable } from '@nestjs/common'

import { User } from '../users/users.entity'
import { CreateUserDto } from '../users/dto/create-user.dto'

// import { Team } from './team/entities/team.entity'
// import { TeamModel } from './team/dto/team.dto'

// import { Driver } from './driver/entities/driver.entity'
// import { DriverModel } from './driver/dto/driver.dto'

// import { Car } from './car/entities/car.entity'
// import { CarModel } from './car/dto/car.dto'

// import { Race } from './race/entities/race.entity'
// import { RaceModel } from './race/dto/race.dto'

// import { RaceResult } from './race-result/entities/race-result.entity'
// import { RaceResultModel } from '../d/result/dto/result.dto'

/**
 * Wrapper around automapper, for dependency injection convenience (static/global variables bad)
 */
@Injectable()
class Mapper {
  /**
     * Helper method, shorthand for 'map all properties of the source to the same properties in
     * the destination'.  This is useful when your model and entity share the same structuer.
     */
  private createDefaultMap(
    fromType: any,
    toType: any,
    fields: Array<string>
  ): AutoMapperJs.ICreateMapFluentFunctions {
    const map = automapper.createMap(fromType, toType)
    fields.forEach((key) => {
      map.forMember(key, (opts: AutoMapperJs.IMemberConfigurationOptions) => opts.mapFrom(key))
    })

    return map
  }

  /**
     * Helper method, creates mappings between two types in both directions
     */
  private createDefaultBiDiMap(
    typeA: any,
    typeB: any,
    fields: Array<string>
  ): Array<AutoMapperJs.ICreateMapFluentFunctions> {
    return [
      this.createDefaultMap(typeA, typeB, fields),
      this.createDefaultMap(typeB, typeA, fields)
    ]
  }

  constructor() {
    // Add code here to configure mappings
    // this.createDefaultBiDiMap(
    //   CreateAddressDto,
    //   Address,
    //   ['id', 'name', 'street', 'street2', 'city', 'state', 'zip', 'country']
    // )
    // this.createDefaultBiDiMap(
    //   UpdateAddressDto,
    //   Address,
    //   ['id', 'name', 'street', 'street2', 'city', 'state', 'zip', 'country']
    // )
    this.createDefaultBiDiMap(
      CreateUserDto,
      User,
      ['id', 'email', 'firstName', 'lastName', 'password']
    )
    // this.createDefaultBiDiMap(
    //   CreateClassDto,
    //   Class,
    //   ['id', 'name']
    // )
    // this.createDefaultBiDiMap(
    //   UpdateClassDto,
    //   Class,
    //   ['id', 'name']
    // )
    // this.createDefaultBiDiMap(
    //     TeamModel,
    //     Team,
    //     ['id', 'name', 'nationality', 'businessAddress', 'cars']
    // )
    // this.createDefaultBiDiMap(
    //     DriverModel,
    //     Driver,
    //     ['id', 'firstName', 'lastName', 'nationality', 'homeAddress', 'managementAddress', 'teams', 'results']
    // )
    // this.createDefaultBiDiMap(
    //     CarModel,
    //     Car,
    //     ['id', 'name', 'make', 'model', 'class', 'team', 'results']
    // )
    // this.createDefaultBiDiMap(
    //     RaceModel,
    //     Race,
    //     ['id', 'name', 'results']
    // )
    // this.createDefaultBiDiMap(
    //     RaceResultModel,
    //     RaceResult,
    //     ['id', 'car', 'carNumber', 'race', 'driver', 'class', 'startingPosition', 'finishingPosition', 'isFinished']
    // )
  }

  public map(source: any, destination: any, value: any): any {
    const obj = automapper.map(source, destination, value)
    return Object.keys(obj).reduce((tmpObj, key) => ({ ...tmpObj, ...(obj[key] !== undefined ? { [key]: obj[key] } : {}) }), {})
  }
}

export { Mapper }
