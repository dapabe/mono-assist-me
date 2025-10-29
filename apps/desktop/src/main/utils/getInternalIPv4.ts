import os from 'node:os'

/**
 *  RFC 1918 Compliant
 * @link https://es.wikipedia.org/wiki/Red_privada#Redes_privadas_IPv4
 */
export function getInternalIPv4(): os.NetworkInterfaceInfoIPv4 | null {
  const nets = os.networkInterfaces()
  const results = Object.values(nets)
    .flat()
    .filter((net): net is os.NetworkInterfaceInfoIPv4 => net !== undefined)
    .filter(
      (net) =>
        net.family === 'IPv4' &&
        !net.internal &&
        // Filter for typical local network ranges
        (net.address.startsWith('192.168.') ||
          net.address.startsWith('10.') ||
          net.address.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./))
    )
    .sort((a, b) => {
      // Prefer 192.168.x.x addresses
      if (
        a.address.startsWith('192.168.') &&
        !b.address.startsWith('192.168.')
      ) {
        return -1
      }
      return 1
    })

  if (!results.length) return null

  return results[0]
}
