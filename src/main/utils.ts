import * as grpc from '@grpc/grpc-js'

function promisifyGrpc<t1, t2>(
  fn: (request: t1, callback: (error: grpc.ServiceError | null, response: t2) => void) => any
): (request: t1) => Promise<t2> {
  return (request: t1): Promise<t2> => {
    return new Promise<t2>((resolve, reject) => {
      function customCallback(error: grpc.ServiceError | null, response: t2) {
        if (error) {
          return reject(error)
        }
        return resolve(response)
      }
      fn(request, customCallback)
    })
  }
}

export { promisifyGrpc }
