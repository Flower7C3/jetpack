<?php
/**
 * The Package_Version_Tracker class.
 *
 * @package automattic/jetpack-connection
 */

namespace Automattic\Jetpack\Connection;

/**
 * The Package_Version_Tracker class.
 */
class Package_Version_Tracker {

	/**
	 * Uses the jetpack_package_versions filter to obtain the package versions from packages that need
	 * version tracking.
	 */
	public static function get_package_versions() {
		/**
		 * Obtains the package versions.
		 *
		 * @since x.x.x
		 *
		 * @param array An associative array containing the package versions with the package slugs as the keys.
		 */
		$package_versions = apply_filters( 'jetpack_package_versions', array() );

	}
}
