import { 
  type BaseError,
  useReadContract,
  useWriteContract
} from 'wagmi';
import { contractConfig } from '../abi/contract';
// import { Vibe } from '@/types/vibe';

export const useCreateVibe = (emoji: string, color: string, phrase: string, imageURI: string) => {
  const { writeContract } = useWriteContract();

  const createVibe = async () => {
    try {
      const hash = await writeContract({
        address: contractConfig.address,
        abi: contractConfig.abi,
        functionName: 'createVibe',
        args: [emoji, color, phrase, imageURI],
      });
      return hash;
    } catch (e) {
      const error = e as BaseError;
      throw error;
    }
  };

  return { createVibe };
};

export const useGetLatestVibes = (limit: number) => {
  return useReadContract({
    address: contractConfig.address,
    abi: contractConfig.abi,
    functionName: 'getLatestVibes',
    args: [BigInt(limit)],
  });
};

export const useGetPopularVibes = (limit: number) => {
  return useReadContract({
    address: contractConfig.address,
    abi: contractConfig.abi,
    functionName: 'getPopularVibes',
    args: [BigInt(limit)],
  });
};

export const useGetVibe = (tokenId: bigint) => {
  return useReadContract({
    address: contractConfig.address,
    abi: contractConfig.abi,
    functionName: 'getVibe',
    args: [tokenId],
  });
};

export const useLikeVibe = (tokenId: bigint) => {
  const { writeContract } = useWriteContract();

  const likeVibe = async () => {
    try {
      const hash = await writeContract({
        address: contractConfig.address,
        abi: contractConfig.abi,
        functionName: 'likeVibe',
        args: [tokenId],
      });
      return hash;
    } catch (e) {
      const error = e as BaseError;
      throw error;
    }
  };

  return { likeVibe };
};

export const useVibeStreak = (address: `0x${string}`) => {
  return useReadContract({
    address: contractConfig.address,
    abi: contractConfig.abi,
    functionName: 'getVibeStreak',
    args: [address],
  });
};

export const useHasLiked = (tokenId: bigint, address: `0x${string}`) => {
  return useReadContract({
    address: contractConfig.address,
    abi: contractConfig.abi,
    functionName: 'hasLiked',
    args: [tokenId, address],
  });
};
