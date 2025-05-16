export interface Vibe {
    emoji: string;
    color: string;
    phrase: string;
    imageURI: string;
    likes: bigint;
    timestamp: bigint;
    creator: `0x${string}`;
}

export interface NewVibe {
    emoji: string;
    color: string;
    phrase: string;
    imageURI: string;
}

export type VibeView = 'latest' | 'popular';

export const SAMPLE_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1',
    '#96CEB4', '#FFEEAD', '#D4A5A5',
    '#9BA0BC', '#A8D8B9', '#FFC09F',
    '#FFEE93', '#FCB1B1', '#B5EAD7'
];
