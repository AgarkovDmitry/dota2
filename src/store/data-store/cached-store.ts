import * as localforage from 'localforage'

localforage.config({
  driver: localforage.INDEXEDDB
})

export default class HeroStore {
  key: string
  expiryInHours: number

  constructor (key: string, expiryInHours?: number) {
    this.key = key
    this.expiryInHours = expiryInHours
  }

  getHours = () => new Date().getTime() / 1000 / 60 / 60

  readFromLocalStorage = async() => {
    const res = await localforage.getItem(this.key) as any

    if (!res)
      return { isExpired: true, data: [] }

    return { isExpired: this.getHours() > res.expiryDate, data: res.data }
  }

  writeToLocalStorage = (data: any[]) => {
    localforage.setItem(this.key, {
      data,
      expiryDate: this.expiryInHours ? this.expiryInHours + this.getHours() : null
    })
  }
}