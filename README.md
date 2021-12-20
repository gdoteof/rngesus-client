## Commands

All available commands can be found in the `package.json` file. 

This client assumes assumes an already deployed (on devnet) on-chain program: [rngesus](https://github.com/gdoteof/rngesus), but you can use your own by changing `keys/program_pub.json`

 - Install dependencies
```
npm install
```
 - Generate piapprec chain and place it in `data/piapprec.bin`
    - see: [piapprec](https://github.com/gdoteof/piapprec)
 - Place a keypair with sufficient solana for account generation (~1M lamports) at `keys/id.json`
 - Then, generate the program's storage account and fill with initial values

```
npm run init
```

See the `package.json` file for more.
