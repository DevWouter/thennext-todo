/**
 * Object that contain settings for the task-page.
 * Whenever we leave something to `undefined` we mean it won't be changed.
 * Setting values to `null` means set to setting to `undefined` (AKA: remove it).
 */
export class TaskPageNavigation {
  /**
   * The tasklist where we need to navigate to.
   * Set to null to go to primary tasklist.
   */
  taskListUuid?: string;

  /**
   * The task we need to show.
   */
  taskUuid?: string;

  /**
   * Show completed tasks.
   */
  showCompleted?: boolean;

  /**
   * Only show blocked tasks.
   */
  showBlocked?: boolean;

  /**
   * Only show negative tasks.
   */
  showNegative?: boolean;

  /**
   * The term we are searching for.
   */
  search?: string;
}
