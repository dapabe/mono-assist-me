export const UDP_CONSTANTS = {
  /**
   * Local Network Control Block (224.0.0.0/24)
   * - Guaranteed to stay in local network
   * - Won't be forwarded by routers
   * - Ideal for LAN discovery
   */
  MULTICAST_ADDRESS: '224.0.0.114',
  /**
   * Port range 42000-42100 used for dynamic allocation
   * Default discovery port
   */
  DISCOVERY_PORT: 42069,
} as const;
