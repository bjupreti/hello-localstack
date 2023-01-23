import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class HelloLocalstackStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'HelloLocalstackQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const bucketName = new cdk.CfnParameter(this, 'bucketName', {
      type: 'String',
      default: '',
      description: 'S3 bucket name where Codepipeline will store lambda code'
    });

    const bucketKey = new cdk.CfnParameter(this, 'bucketKey', {
      type: 'String',
      default: '',
      description: 'S3 bucket key which Codepipeline will use to store lambda code'
    });

    const bucket = s3.Bucket.fromBucketName(this, 'pipeline-bucket', bucketName.valueAsString);

    new lambda.Function(this, 'lambdaFunction', {
      functionName: 'first-cdk-lambda',
      // code: new lambda.AssetCode('src'),
      code: lambda.Code.fromBucket(bucket, bucketKey.valueAsString),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_16_X,
      memorySize: 128
    })
  }
}
