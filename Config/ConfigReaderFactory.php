<?php
class ConfigReaderFactory {
	private static $instance;
	private $configReaders;
	
	private function __construct() {
	}
	
	static public function getInstance() {
		if (!isset(self::$instance)) {
			$c = __CLASS__;
			self::$instance = new $c();
		}
		
		return self::$instance;	
	}

	// Prevent users to clone the instance
	public function __clone() {
		trigger_error('Clone is not allowed.', E_USER_ERROR);
	}
	
	public function getConfigReader($configFile) {
		if (!isset($this->configReaders[$configFile])) {
			$this->configReaders[$configFile] = new ConfigReader($configFile);
		}
		
		return $this->configReaders[$configFile];	
	}
}
?>
