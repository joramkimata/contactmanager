import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";


export const GetGraphqlUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {

        const contxt = GqlExecutionContext.create(ctx);

        const { user } = contxt.getContext().req;
        return user;
    },
);
