import EventEmitter from 'node:events'

/**
 *  @description
 *  Register all `EventEmitters` across the app. \
 *  Remove them on electron quit.
 */
class EventBus {
  private emitters: Set<EventEmitter> = new Set()

  register(emitter: EventEmitter): void {
    this.emitters.add(emitter)
  }

  unregister(emitter: EventEmitter): void {
    this.emitters.delete(emitter)
  }

  cleanupAll(): void {
    for (const emitter of this.emitters) {
      emitter.removeAllListeners()
    }
    this.emitters.clear()
  }
}
let ref: EventBus | undefined
if (!ref) ref = new EventBus()
export const AppEventBus = ref
