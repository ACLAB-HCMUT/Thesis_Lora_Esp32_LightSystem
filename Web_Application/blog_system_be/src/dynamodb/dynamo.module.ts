import { Module } from '@nestjs/common';
import { DynamoDbService } from './dynamo.service';
import { DynamoDbController } from './dynamo.controller';

@Module({
  providers: [DynamoDbService],
  controllers: [DynamoDbController],
})
export class DynamoDbModule {}
