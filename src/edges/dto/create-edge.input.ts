import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateEdgeInput {
  @Field(() => String)
  node1Alias: string;

  @Field(() => String)
  node2Alias: string;

  @Field(() => Number)
  capacity: number;
}
