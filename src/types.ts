export const SCREENS = ['home', 'churches', 'ai-exam', 'schedule', 'confession'] as const;
export type Screen = typeof SCREENS[number];