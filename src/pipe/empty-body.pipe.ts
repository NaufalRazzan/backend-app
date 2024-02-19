import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class EmptyBodyPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value || (Array.isArray(value) && value.length === 0) || (typeof value === 'object' && Object.keys(value).length === 0)) {
      throw new BadRequestException('Request body must not be empty');
    }
    
    return value;
  }
}
