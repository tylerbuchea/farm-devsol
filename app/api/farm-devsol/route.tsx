import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { NextResponse } from "next/server";

const WHALE_WALLET = process.env.WHALE_WALLET_ADDRESS!;
const RPC_URL = "https://api.devnet.solana.com";

export async function GET(req: Request) {
  try {
    const connection = new Connection(RPC_URL, "confirmed");
    const keypair = Keypair.generate();

    console.log("requesting airdrop");
    const signature = await connection.requestAirdrop(
      keypair.publicKey,
      1 * LAMPORTS_PER_SOL
    );

    console.log("airdrop requested");
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    console.log("airdrop confirmed");
    await connection.confirmTransaction(
      {
        blockhash,
        lastValidBlockHeight,
        signature,
      },
      "finalized"
    );
    console.log("airdrop success");

    const recipient = new PublicKey(WHALE_WALLET);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: keypair.publicKey,
        toPubkey: recipient,
        lamports: 1 * LAMPORTS_PER_SOL - 0.1 * LAMPORTS_PER_SOL,
      })
    );

    console.log("sending solana");

    const txid = await sendAndConfirmTransaction(connection, transaction, [
      keypair,
    ]);

    console.log("solana sent txid:", txid);

    return Response.json({ success: "true", txid });
  } catch (error: any) {
    console.error(`${req.url}`, error?.message);
    return NextResponse.json(
      { error: "error bad request", message: error?.message },
      { status: 400 }
    );
  }
}
