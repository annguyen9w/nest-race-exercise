import { Controller, Get } from '@nestjs/common'
import {
  // DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator
} from '@nestjs/terminus'
import { MzPublic } from '../app/common/decorator/public.decorator'

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator
    // private disk: DiskHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  @MzPublic()
  check() {
    return this.health.check([
      () => this.db.pingCheck('datatable', { timeout: 5000 }),
      // the process should not use more than 300MB memory
      () => this.memory.checkHeap('memory heap', 300 * 1024 * 1024)
      // the used disk storage should not exceed the 50% of the available space
      // () => this.disk.checkStorage('disk health', {
      //   thresholdPercent: 0.5, path: '/'
      // })
    ])
  }
}
