import { Controller } from '@nestjs/common';
import { BikeService } from './bike.service';

@Controller('bikes')
export class BikeController {
  constructor(private bike: BikeService) {}
}
