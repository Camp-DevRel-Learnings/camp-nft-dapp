"use client"
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { basecampTestnet } from 'viem/chains'; // we’ll define this next

export const config = getDefaultConfig({
  appName: 'CampNFT Dapp',
  projectId: '75942dd8e5142f8693e3afb3e1137f45',
  chains: [basecampTestnet],
});
