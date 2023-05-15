import { useState } from "react";
import server from "./server";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    const hash = hashMessage(sendAmount);
    const [signature, recoverBit] = await secp.sign(hash, privateKey, {
      recovered: true,
    });
    const pubKey = secp.recoverPublicKey(hash, signature, recoverBit);
    console.log(toHex(pubKey).toString().slice(0, 20));
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        signature: signature,
        recoverBit: recoverBit,
        hash: hash,
        recipient: recipient,
        amount: parseInt(sendAmount),
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }
  function hashMessage(message) {
    const msgBytes = utf8ToBytes(message);
    const hash = keccak256(msgBytes);
    return hash;
  }
  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
