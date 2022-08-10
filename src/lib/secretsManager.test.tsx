import { v4 } from 'uuid'

import { clearAll } from './secure-storage'
import secretsManager from './secretsManager'

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('uuid-1111'),
}))

describe('secretsManager', () => {
  beforeEach(() => {
    ;(v4 as jest.Mock).mockReturnValue('uuid-1111')
  })

  afterEach(() => {
    clearAll()
  })

  it('saves', async () => {
    const s = await secretsManager.upsert(
      {
        account: 'my-account',
        issuer: 'some issuer',
        secret: 'somesecret',
        uid: '11',
      },
      '11'
    )

    expect(s).toEqual({
      _id: 'uuid-1111',
      account: 'my-account',
      issuer: 'some issuer',
      secret: 'somesecret',
      uid: '11',
    })
  })

  it('updates', async () => {
    const s = await secretsManager.upsert(
      {
        account: 'my-account',
        issuer: 'some issuer',
        secret: 'newsecret',
        uid: '11',
      },
      '11'
    )

    expect(s).toEqual({
      _id: 'uuid-1111',
      account: 'my-account',
      issuer: 'some issuer',
      secret: 'newsecret',
      uid: '11',
    })
  })

  it('persists and retrieves', async () => {
    ;(v4 as jest.Mock)
      .mockReturnValueOnce('uuid-1111')
      .mockReturnValueOnce('uuid-2222')

    const s1 = await secretsManager.upsert(
      {
        account: 'my-account',
        issuer: 'some issuer',
        secret: 'newsecret',
        uid: '11',
      },
      '11'
    )

    expect(await secretsManager.get(s1._id, '11')).toEqual({
      _id: 'uuid-1111',
      account: 'my-account',
      issuer: 'some issuer',
      secret: 'newsecret',
      uid: '11',
    })

    await secretsManager.upsert(
      {
        account: 'account-2',
        issuer: 'issuer-2',
        secret: 'secret-2',
        uid: '22',
      },
      '22'
    )

    expect(await secretsManager.getAllByUser('11')).toEqual([
      {
        _id: 'uuid-1111',
        account: 'my-account',
        issuer: 'some issuer',
        secret: 'newsecret',
        uid: '11',
      },
    ])

    expect(await secretsManager.getAllByUser('22')).toEqual([
      {
        _id: 'uuid-2222',
        account: 'account-2',
        issuer: 'issuer-2',
        secret: 'secret-2',
        uid: '22',
      },
    ])
  })

  it('removes', async () => {
    const s = await secretsManager.upsert(
      {
        account: 'my-account',
        issuer: 'some issuer',
        secret: 'newsecret',
        uid: '11',
      },
      '11'
    )

    await secretsManager.remove(s._id)

    expect(await secretsManager.get(s._id, '111')).toEqual(undefined)
  })
})
