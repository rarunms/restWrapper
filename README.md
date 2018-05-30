# restWrapper
To run the application follow the below instrucations

1. SET blockchain enviornment variable
2. start the app : "npm run start"

Below rest endpoints available.

1. Write(POST)

    Service URL: http://hostname/{smartcontract_id}/{key}
	
	Arguments:
	{
	  "value": "{"Name":"OFS Tech", "team": "BlockChain"}"
	}

2. read(GET)

    Service URL: http://hostname/{smartcontract_id}/{key}

3. execute(PUT)

    Service URL: http://hostname/{smartcontract_id}/{key}

    Arguments:
        {
          "value": "{"Name":"OFS Tech", "team": "BlockChain"}",
          "method": "update"
        }

<a href="https://heroku.com/deploy?template=https://github.com/objectfrontiergit/restWrapper">
<img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>
