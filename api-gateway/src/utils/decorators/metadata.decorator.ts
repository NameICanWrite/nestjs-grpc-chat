import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Metadata } from '@grpc/grpc-js';

export const GrpcMetadata = createParamDecorator(
  (_data: unknown, _ctx: ExecutionContext) => {
    const metadata = new Metadata();
    metadata.set('authorization', 'req.headers.authorization');
    metadata.set(
      'user',
      JSON.stringify({ id: 1, name: 'Андрей Ткач', userId: 528, userRole: 5 }),
    );
    return metadata;
  },
);
