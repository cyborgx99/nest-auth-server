import { SetMetadata } from '@nestjs/common';
import { MetadataNames } from '../constants';

export const Public = () => SetMetadata(MetadataNames.isPublic, true);
