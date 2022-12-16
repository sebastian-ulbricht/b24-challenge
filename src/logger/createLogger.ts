import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import * as WinstonCloudwatch from 'winston-cloudwatch';

export default function createLogger() {
  return WinstonModule.createLogger({
    handleExceptions: true,
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike(),
        ),
      }),
      process.env.LOG_TO_CLOUDWATCH &&
        new WinstonCloudwatch({
          awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
          awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
          awsRegion: process.env.AWS_REGION,
          logGroupName: process.env.AWS_LOG_GROUP_NAME,
          logStreamName: process.env.AWS_LOG_STREAM_NAME,
          retentionInDays: 0,
          jsonMessage: true,
          level: 'info',
        }),
    ].filter(Boolean),
  });
}
