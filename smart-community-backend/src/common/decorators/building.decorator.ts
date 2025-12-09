import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentBuilding = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    
    if (data === 'id') {
      return request.buildingId;
    }
    
    if (data === 'membership') {
      return request.buildingMembership;
    }

    return {
      id: request.buildingId,
      membership: request.buildingMembership,
    };
  },
);
