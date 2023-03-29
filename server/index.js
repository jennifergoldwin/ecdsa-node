const express = require("express");
const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "040aa06740aeefce645c": 100, //ea0e48cae4207732451f2b440f7fe4e0cc63fc68ea3df994c7398e3f386d9825
  "042de170abbb57488ae9": 50, //10ee1ff92245c077068643c923ca4859fab11c41844f63f55b092845912fff67
  "04a7ec8d434492cc3368": 75, //7ba396b441dd2da215f7a7d5b34a64ed15ae2234b57a21b65edf8b0ce3eb8c6a
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signature, recoverBit, hash, recipient, amount } = req.body;
  const sender = secp.recoverPublicKey(hash, signature, recoverBit);
  const isSign = secp.verify(signature, hash, sender);
  if (isSign) {
    setInitialBalance(toHex(sender).toString().slice(0, 20));
    setInitialBalance(
      toHex(secp.getPublicKey(recipient)).toString().slice(0, 20)
    );

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
