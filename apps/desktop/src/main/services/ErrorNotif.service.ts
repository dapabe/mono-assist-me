import { Notification } from 'electron'

export class ErrorNotificationService {
  private static instance: ErrorNotificationService
  // private activeNotifications: Set<Notification> = new Set()

  public static getInstance(): ErrorNotificationService {
    if (!ErrorNotificationService.instance) {
      ErrorNotificationService.instance = new ErrorNotificationService()
    }
    return ErrorNotificationService.instance
  }

  static getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Unknown error occurred'
  }

  public showError(title: string, message: string): void {
    // Show native desktop notification
    const notification = new Notification({
      title: title,
      body: message,
      icon: '../../../../resources/icon.png',
      silent: false,
      urgency: 'critical'
    })

    notification.show()

    // Also send to renderer for in-app toast
    // const win = BrowserWindow.getFocusedWindow()
    // if (win) win.webContents.send('show-error', { title, message })
  }
}
