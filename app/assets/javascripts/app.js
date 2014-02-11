var pairArray = []


$(document).ready(function(){

	$.getJSON('/orderbook', function(data){
		console.log("Success");
		fetchBtcPairs(data)

		$.each(pairArray, function(index, pair){
			pair.setDoubleWall();
			// pair.renderTableData();
		})
	});

})

//Parsing cryptsy responses

function fetchBtcPairs(pairs){
	console.log('fetching');
	$.each(pairs.return.markets, function(index, pair){
		if (pair.secondarycode === "BTC") {
			var newPair = new BtcPair()
			newPair.name = pair.primaryname
			newPair.pairId = pair.marketid
			newPair.label = pair.label
			newPair.lastTradePrice = pair.lasttradeprice
			newPair.volume = pair.volume
			pairArray.push(newPair)
		}			
	});
}

//Creating a constructor

var BtcPair = function(){
	var self = this;

	this.renderTableData = function(){
		console.log(self);
		newRow = $('<tr></tr>');
		newRow.append('<td>' + self.name + '</td>');
		newRow.append('<td>' + self.label + '</td>');
		newRow.append('<td>' + (self.volume * self.lastTradePrice) + '</td>');
		newRow.append('<td>' + self.lastTradePrice + '</td>');
		newRow.append('<td>' + self.doubleWall + '</td>');
		$('tbody').append(newRow)
	};


	this.setDoubleWall = function(){
		$.getJSON('/depth', {'pairId': self.pairId}, function(data){
			var data = data
			var doubleIndex;
			var doubleSellArray = []

			$.each(data, function(index, order){
				if (order[0] > (self.lastTradePrice * 2)){
					doubleIndex = index;
					return false;
				}
			});

			console.log(doubleIndex);

			$.each(data.slice(0,doubleIndex), function(index, order){
				var total = order[0] * order[1];
				doubleSellArray.push(total);
			})

			self.doubleWall = _.reduce(doubleSellArray, function(memo, num){return memo + num;}, 0);
			self.renderTableData();

			});
		};
}
