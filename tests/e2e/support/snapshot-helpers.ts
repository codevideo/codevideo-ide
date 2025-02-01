import { Page } from '@playwright/test';
import { IAction } from '@fullstackcraftllc/codevideo-types';

export const waitForIDELoad = async (page: Page) => {
  await page.waitForSelector('.monaco-editor');
  // Add any other specific waits your IDE needs
};

export const createSnapshotName = (actionIndex: number, actions: IAction[]) => {
  if (actionIndex < 0) return 'initial-state';
  const action = actions[actionIndex];
  return `ide-state-${actionIndex}-${action.name}`;
};