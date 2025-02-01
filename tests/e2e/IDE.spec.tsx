import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { IDE } from '../../src/components/IDE';
import { tutorialActions } from './fixtures/tutorialActions';
import { waitForIDELoad, createSnapshotName } from './support/snapshot-helpers';

test.describe('IDE Visual Journey', () => {
  const createSnapshotAtIndex = async ({ mount, page }, actionIndex: number) => {
    const component = await mount(
      <IDE
        mode="step"
        actions={tutorialActions}
        currentActionIndex={actionIndex}
        course={{
          id: 'test-course',
          name: 'Test Course',
          description: 'Test Description',
          primaryLanguage: 'javascript',
          lessons: []
        }}
      />
    );

    await waitForIDELoad(page);
    
    await expect(page).toHaveScreenshot(`${createSnapshotName(actionIndex, tutorialActions)}.png`, {
      fullPage: true,
      animations: 'disabled'
    });
  };

  test('initial IDE state', async ({ mount, page }) => {
    await createSnapshotAtIndex({ mount, page }, -1);
  });

  tutorialActions.forEach((action, index) => {
    test(`IDE after action ${index}: ${JSON.stringify(action)}`, async ({ mount, page }) => {
      await createSnapshotAtIndex({ mount, page }, index);
    });
  });
});