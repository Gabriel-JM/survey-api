import { Controller } from '@/presentation/protocols'

export function adaptResolver (controller: Controller) {
  return async (_parent: any, args: any) => {
    const httpResponse = await controller.handle(args)

    return httpResponse.body
  }
}
