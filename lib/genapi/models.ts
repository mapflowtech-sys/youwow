export type AIModel = 'chatgpt' | 'claude' | 'gemini';

export interface ModelConfig {
  networkId: string;
  name: string;
  description: string;
}

export const AI_MODELS: Record<AIModel, ModelConfig> = {
  chatgpt: {
    networkId: 'gpt-5-2',
    name: 'ChatGPT 5.2',
    description: 'Быстрый и качественный',
  },
  claude: {
    networkId: 'claude-sonnet-3-5',
    name: 'Claude Sonnet 3.5',
    description: 'Лучший для креатива',
  },
  gemini: {
    networkId: 'gemini-pro',
    name: 'Gemini Pro',
    description: 'Хорошее качество',
  },
};

export const CURRENT_MODEL: AIModel =
  (process.env.AI_MODEL as AIModel) || 'chatgpt';

export function getCurrentModelConfig(): ModelConfig {
  return AI_MODELS[CURRENT_MODEL];
}
