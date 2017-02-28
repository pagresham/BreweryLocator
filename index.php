<?PHP
include "header.php";
?>
		
		<!-- this is a test with the link -->
<div id="body" class="container">
	<div class="row">
		
		<div class="col-sm-8" id="map">
		</div>
		<div class="col-sm-4">
			<form method="" action="">
				<h4>Search for Breweries</h4>
					<input type="text" name="city" id="city-name" placeholder="City Name" placeholder="City Name" maxlength="25">
				
					<input class="btn-info" type="button" name="submit-city" id="city-btn" value="Search By City">
				
					<input type="text" name="zip" id="zip" placeholder="ZIP Code" maxlength="10">
				
					<input class="btn-info" type="button" name="submit-zip" id="zip-btn" value="Search By Zip Code">
				
					<input class="btn-success" type="button" name="locate" id="locate" value="Auto-Locate">
				
			</form>
		</div>
	</div>
	<div class="row">
		<div id="output" class="col-sm-12">
			<table id="table">
				
			</table>
		</div>
	</div>
</div>

<?PHP
include "footer.php";
?>