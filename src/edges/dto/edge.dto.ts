import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class EdgeDTO {
  @Field(() => ID)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Number)
  capacity: number;

  @Field(() => String)
  node1Alias: string;

  @Field(() => String)
  node2Alias: string;

  @Field(() => String)
  edgePeers: string;
}
