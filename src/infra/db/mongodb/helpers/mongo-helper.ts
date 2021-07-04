import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: {} as MongoClient,
  uri: '',

  async connect (uri: string) {
    this.uri = uri
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect () {
    await this.client?.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.uri)
    }

    return this.client.db().collection(name)
  },

  map <T = any>(data: any) {
    const { _id, ...dataWithoutId } = data

    return <T> {
      id: _id,
      ...dataWithoutId
    }
  }
}
