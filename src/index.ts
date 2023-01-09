import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import Arweave from 'arweave'

const app = express()
const arweave = Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' })

app.use(cors())
app.post('/', express.json(), verifyTx, qualify, vouch)

app.listen(8000)

async function vouch(req: Request, res: Response) {
  // TODO: create Vouch Transaction using Vouch Service Wallet

  // TODO: addUserToVouchDAO Contract

  res.json({ ok: true })
}

async function qualify(req: Request, res: Response, next: NextFunction) {
  // TODO: add qualify check here
  next()
}

async function verifyTx(req: Request, res: Response, next: NextFunction) {
  const tx = arweave.transactions.fromRaw(req.body)
  if (await arweave.transactions.verify(tx)) {
    const addr = arweave.utils.bufferTob64Url(
      await arweave.crypto.hash(arweave.utils.b64UrlToBuffer(tx.owner))
    )
    // @ts-ignore
    req.user = addr
    next()
  } else {
    res.status(400).json({ message: 'could not verify request' })
  }
}