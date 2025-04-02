/**
 * 	Wont be used here as it calculates local device broadcast address
 *  and the limited broadcast address is sufficient, but remind me to use it in the future
 */
export function calculateBroadcastAddress(
	ipAddress: string,
	subnetMask: string
): string {
	// Convert IP address and subnet mask to arrays of integers
	const ipOctets = ipAddress.split(".").map((octet) => parseInt(octet, 10));
	const maskOctets = subnetMask.split(".").map((octet) => parseInt(octet, 10));

	// Calculate the broadcast address by applying the bitwise operations
	/**
	 *  Bits where the subnet mask is 1 identify the network portion
	 *  Bits where the subnet mask is 0 identify the host portion
	 *  Inverting the subnet mask highlights the host portion with 1s
	 *  The bit operator OR (|) with the inverted mask sets all host bits to 1, creating the broadcast address
	 *  @example
	 *  IPv4: 192.168.1.10 = 11000000.10101000.00000001.00001010
	 *  SubnetMask: 255.255.255.0 = 11111111.11111111.11111111.00000000
	 *  InvertedMask: ~(SubnetMask) = 00000000.00000000.00000000.11111111
	 *  BroadcastAddress: IPv4 | InvertedMask = 11000000.10101000.00000001.11111111
	 *  parse it to int base 10: 192.168.1.255
	 */
	const toPositive = 255; // When you invert a 8-bit value JS treats it as a negative int32 number, this is needed
	const broadcastOctets = ipOctets.map((ipOctet, index) => {
		// Bitwise OR of the IP octet and the inverted mask octet
		/**
		 *  @example
		 *  192 | (~255 & int32) = 192 | 0 = 192
		 *  168 | (~255 & int32) = 168 | 0 = 168
		 *  1 | (~255 & int32) = 1 | 0 = 1
		 *  10 | (~0 & int32) = 10 | 255 = 255
		 */
		return ipOctet | (~maskOctets[index] & toPositive);
	});

	// Join the octets back together to form the broadcast address
	return broadcastOctets.join(".");
}
