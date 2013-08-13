<?php
class ConfigReader {
	const CONFIG_CACHE_TTL = 3600;
	private $configFile;
	private $config;
	
	public function __construct($configFile) {
		$this->configFile = $configFile;	
		$key = 'CONFIG_READER_' . $configFile;
		$configString = apc_fetch($key);
		if (!$configString) {
			$configString = file_get_contents($configFile);
			apc_store($key, $configString, self::CONFIG_CACHE_TTL);
		}
		$this->config = simplexml_load_string($configString, 'SimpleXMLElement', LIBXML_NOCDATA);
	}
	
	public function getConfig() {
		return $this->config;
	}
}
?>
