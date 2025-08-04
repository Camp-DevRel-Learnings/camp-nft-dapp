// lib/mint.ts
import { writeContract } from 'wagmi/actions';
import { config } from '../wagmi.config';

const ABI = [
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "string", name: "uri", type: "string" }
    ],
    name: "mintTo",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  }
];

export async function mintNFT(to: `0x${string}`, uri: string) {
  return await writeContract(config, {
    abi: ABI,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: 'mintTo',
    args: [to, uri],
  });
}
