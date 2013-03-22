<?php 

	error_reporting(E_ALL);

	function service_request($xml) 
	{
		$url = "https://services.forrent.com/service.php";
	
		$curl = curl_init ($url);
		curl_setopt ($curl, CURLOPT_POST, true); // POST request method
		curl_setopt ($curl, CURLOPT_RETURNTRANSFER, true); // return output
		curl_setopt ($curl, CURLOPT_PROXY, 'proxy.traderonline.com');
		curl_setopt ($curl, CURLOPT_PROXYPORT, 80);
		curl_setopt ($curl, CURLOPT_POSTFIELDS, "request={$xml}");
		return curl_exec ($curl);	
	}

	function getMaxBeds($beds)
	{
		$bedMax = 0;
		
	    foreach ($beds as $bed)
	    {
	    	if ($bed > $bedMax)
	    	{
				$bedMax = $bed;
			}
		}
		
		if($bedMax == 0)
		{
			$bedMax = (string) "Call for Number of Rooms";
		}
		return $bedMax;
				 
	}
				 
	function getMinBeds($beds)
	{
		$bedMin = 10;
		
		foreach ($beds as $bed)
		{
			if ($bed < $bedMin)
			{
	             $bedMin = $bed;
			}
		}
		
		if($bedMin == 0)
		{
			$bedMin = (string) "Call for Number of Rooms";
		}
		
		return $bedMin;
	}
	
	function getMaxPrice($texts)
	{
		$currentMax = 0;
		$matches = array();

		foreach($texts as $text)
		{
			preg_match('/(\d*$)/', $text, $matches);
			
			if($matches[1] > $currentMax)
			{
				$currentMax = $matches[1];
			}
		}
	
		if($currentMax == 0)
		{
			$currentMax = (string) "Call For Price";
		}
		
		return $currentMax;
	}

	function getMinPrice($texts)
	{
		$currentMin = 20000;
		$matches = array();

		foreach($texts as $text)
		{
			preg_match('/(\d*$)/', $text, $matches);
			
			if($matches[1] < $currentMin)
			{
				$currentMin = $matches[1];
			}
		}
		
		if($currentMin == NULL)
		{
			$currentMin = (string) "Call For Price";
		}
		
		return $currentMin;
	}


	$page = 1;
	
	if (isset($_REQUEST['page']))
	{
		$page = $_REQUEST['page'];
		
		if (!is_numeric($page))
		{
		$page = 1;
		}
	}

	$distance = 10;
	
	if (isset($_REQUEST['distance']))
	{
		$distance = $_REQUEST['distance'];
		
		if (!is_numeric($distance))
		{
			$distance = 10;
		}
	}

	$latitude = 36.8475;

	if (isset($_REQUEST['latitude']))
	{
		$latitude = $_REQUEST['latitude'];
		
		if (!is_numeric($latitude))
		{
		$latitude = 36.8475;
		}
		
		if(!is_float($latitude))
		{
			$latitude = (float) $latitude;
		}
	}

	$longitude = -76.2912;
	
	if (isset($_REQUEST['longitude']))
	{
		$longitude = $_REQUEST['latitude'];
		
		if (!is_numeric($longitude))
		{
		$longitude = -76.2912;
		}
		
		if(!is_float($longitude))
		{
			$longitude = (float) $longitude;
		}
	}

	$xml = '<request>
		<user>feed_unitTest_30</user>
		<pw>Howd3!</pw>
		<command name="searchByLatLng">
		<arg name="latitude">'.$latitude.'</arg>
		<arg name="longitude">'.$longitude.'</arg>
		<arg name="seed">0</arg>
		<arg name="options"><options>
		<distance>'.$distance.'</distance>
		<page>'.$page.'</page>
		</options></arg>
		</command>
   		</request>';

	$xml = service_request($xml);
	$xml = simplexml_load_string($xml);
	$results = $xml->command->data->results->site;

	foreach($results as $result)
	{
		$beds = array();
		$texts = array();
		
		foreach($result->floorplans->floorplan as $floorplan)
		{
			$beds[] =(string) $floorplan->beds;
			$texts[] =(string) $floorplan->text;
		}
	
	$minBeds = getMinBeds($beds);
	$maxBeds = getMaxBeds($beds);
	$minPrice = getMinPrice($texts);
	$maxPrice = getMaxPrice($texts);


	

	}

	$response = new stdClass();
	$response->total=(int) $xml->command->data->results["total"];
	$response->page=(int) $xml->command->data->results["page"];
	$response->number=(int) $xml->command->data->results["number"];
	$response->results=array();

	foreach ($xml->command->data->results->site as $res)
	{
		$response->results[]=$res;
	}

	header("content-type: application/json");
	echo $_REQUEST['callback'] . "(" . json_encode($response) . ");";

?>