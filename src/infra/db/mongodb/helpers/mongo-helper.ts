import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: {} as MongoClient,
  uri: '',

  async connect (uri: string) {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  },

  async disconnect () {
    await this.client.close()
    this.client = null
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },

  map <T = any>(data: any) {
    const { _id, ...dataWithoutId } = data

    return <T> {
      id: _id,
      ...dataWithoutId
    }
  },

  mapCollection <T extends any[] = any[]>(collection: any[]) {
    return collection.map(MongoHelper.map) as T
  }
}
