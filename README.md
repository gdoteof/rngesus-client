## Commands

All available commands can be found in the `package.json` file. Start by going into your escrow program repo and building your program with

 - Install dependencies
```
npm install
```
 - Generate piapprec chain and place it in `data/piapprec.bin`
    - see: (https://github.com/gdoteof/piapprec)[piapprec]
 - Place a keypair with sufficient solana for account generation (~1M lamports) at `keys/id.json`
 - Then, generate the program's storage account and fill with initial values

```
npm run init
```

See the `package.json` file for more.
