import { ModuleMetadata } from '@nestjs/common';

export type ControllerType = NonNullable<ModuleMetadata['controllers']>;
