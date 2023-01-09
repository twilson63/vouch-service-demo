import Bundlr from '@bundlr-network/client'
import fs from 'fs'
const wallet = JSON.parse(fs.readFileSync('./wallet.json', 'utf-8'))

export default async function (ctx: { address: string }) {
  const bundlr = new Bundlr('https://node2.bundlr.network', 'arweave', wallet)

  const tags = [
    { name: 'Content-Type', value: 'application/json' },
    { name: 'App-Name', value: 'Vouch' },
    { name: 'App-Version', value: '0.1' },
    { name: 'Verification-Method', value: '[YOUR SERVICE]' },
    { name: 'Vouch-For', value: ctx.address }
  ]

  const data = JSON.stringify({
    address: ctx.address,
    service: '[YOUR SERVICE]',
    type: 'Vouch'
  })

  const tx = bundlr.createTransaction(data, { tags })
  await tx.sign()

  const result = await tx.upload()
  // @ts-ignore
  return { ok: true, id: result.data.id }
}