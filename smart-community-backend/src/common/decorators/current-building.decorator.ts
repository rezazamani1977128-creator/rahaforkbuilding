import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentBuilding = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // Building should be extracted from headers, query params, or JWT token
    // For now, return buildingId from query or body
    const buildingId =
      request.query?.buildingId ||
      request.body?.buildingId ||
      request.params?.buildingId ||
      request.user?.currentBuildingId; // If stored in JWT

    if (data) {
      // If specific field requested, return building object with that field
      return { [data]: buildingId };
    }

    return buildingId;
  },
);
