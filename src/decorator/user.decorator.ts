import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserDecorator = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { user } = request.cookies;
    if (!user) {
      return null;
    }
    return data ? user?.[data] : user;
  },
);
