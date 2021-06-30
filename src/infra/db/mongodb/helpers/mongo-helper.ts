import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: {} as MongoClient,

  async connect (uri: string) {
    this.client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect () {
    await this.client.close()
  },

  getCollection (name: string): Collection {
    return this.client.isConnected() && this.client.db().collection(name)
  },

  map <T = any>(data: any) {
    const { _id, ...dataWithoutId } = data

    return <T> {
      id: _id,
      ...dataWithoutId
    }
  }
}
