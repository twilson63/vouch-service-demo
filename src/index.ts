import express, { Request, Response, NextFunction } from 'express'

import cors from 'cors'
import Arweave from 'arweave'

import vouch from './vouch'

const app = express()
const arweave = Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' })

app.use(cors())
app.post('/', express.json(), (req, res) => verifyTx(req.body)
  //.then(qualify)
  .then(vouch)
  .then(res.json)
  .catch(({ message }) => res.status(400).json({ message }))

)

app.listen(8000)

async function qualify(ctx: any) {
  // TODO: add qualify check here
  return ctx
}

async function verifyTx(body: Record<string, string>) {
  const tx = arweave.transactions.fromRaw(body)
  if (await arweave.transactions.verify(tx)) {
    const address = arweave.utils.bufferTob64Url(
      await arweave.crypto.hash(arweave.utils.b64UrlToBuffer(tx.owner))
    )
    return { address }
  } else {
    return Promise.reject({ message: 'Could not verify tx!' })
  }
}