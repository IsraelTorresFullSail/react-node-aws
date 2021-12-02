import AWS from 'aws-sdk'

export const connectAWS = () => {
  try {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'us-east-2',
    })
    const ses = new AWS.SES({ apiVersion: '2010-12-01' })
    console.log(`AWS Connected`.magenta.bold)
    return ses
  } catch (error) {
    console.log(`Error: ${error.message}`.red.underline.bold)
    process.exit(1)
  }
}
