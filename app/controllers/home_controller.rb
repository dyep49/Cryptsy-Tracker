require 'cryptsy/api'

class HomeController < ApplicationController

	def index
	end

	def orderbook
		respond_to do |format|
			format.html
			format.json do 
				response = HTTParty.get('http://pubapi.cryptsy.com/api.php?method=marketdatav2')
				render json: response.to_json
			end
		end
	end

	def market
		cryptsy = Cryptsy::API::Client.new(ENV['CRYPTSY_PUBLIC_KEY'], ENV['CRYPTSY_PRIVATE_KEY'])
		respond_to do |format|
			format.json do 
				response = cryptsy.marketdata(params["pairId"])
				parsed_response = response["return"]["markets"].values[0]
				render json: parsed_response.to_json
			end
		end
	end

	def depth
		cryptsy = Cryptsy::API::Client.new(ENV['CRYPTSY_PUBLIC_KEY'], ENV['CRYPTSY_PRIVATE_KEY'])
		respond_to do |format|
			format.json do 
				response = cryptsy.depth(params["pairId"])
				parsed_response = response["return"]["sell"]
				render json: parsed_response.to_json
			end
		end
	end



end




# array.each_with_index do |index, item|
# 	if item[0] >= (lasttradeprice * 2)
# 		return index
# 	end
# end


# sum









