import os from 'node:os'

export function getDeviceName(): string {
  return `${os.platform()} - ${os.hostname()}`
}
