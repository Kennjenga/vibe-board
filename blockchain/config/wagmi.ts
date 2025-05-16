import { getDefaultConfig, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { baseSepolia } from 'wagmi/chains';
import { http, createStorage, cookieStorage } from 'wagmi';

if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
  throw new Error('Missing NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID');
}


const { wallets } = getDefaultWallets();

export const config = getDefaultConfig({
  appName: 'Neurocar',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  wallets: [
    ...wallets,
    // {
    //   groupName: "Other",
    //   wallets: [argentWallet, trustWallet, ledgerWallet],
    // },
  ],  chains: [
    baseSepolia,
  ],
  transports: {
    [baseSepolia.id]: http(`https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
  },
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});