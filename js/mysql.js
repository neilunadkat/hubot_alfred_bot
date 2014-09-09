var mysql      = require('mysql');
var str = require ('string');

var dbHost = process.env.DB_HOST;
var dbUser = process.env.DB_USER;
var dbPwd = process.env.DB_PWD;
var dbDatabase = process.env.DB_DATABASE;

var pool  = mysql.createPool({
  connectionLimit : 10,
  host     : dbHost,
  user     : dbUser,
  password : dbPwd,
  database : dbDatabase
});


function getAccountInfoById (accId,cb) {

        pool.getConnection(function(err, connection) {

                var sql = "select id,name,description from account where id =" + accId;
                connection.query( sql, function(err, rows) {
                var result = null;
console.log("Rows count "+rows.length);
		if(rows.length > 0){
                	result = {id : rows[0].id , name : rows[0].name , description : rows[0].description};
	
                	console.log(result);
		}
            // And done with the connection.
            connection.release();

            cb(result);

            // Don't use the connection here, it has been returned to the pool.
          });
        });
}

function whoIs (text,botName,cb){
                var withoutBotName = getTextAfterBotName(text,botName);

        var textAfterWhoIs = getTextAfterWhoIs(withoutBotName);
        console.log('text after whois',textAfterWhoIs);
        var accId = getAccId(textAfterWhoIs);
        
        
        function resultCallBack(info){
		var text = "This id does not seem to belong to anyone";
		if(info != null){
        	 text = "This account belongs to " + info.name;
        	console.log (text);
		}
        	cb(text);
    	}
		
		getAccountInfoById(accId,resultCallBack);
		
        
}

function getAccId (text){
        var tmp = str(text.trim());
        if (tmp.contains("accid")){
               var id = tmp.chompLeft('accid').s.trim();
               console.log ("ID =  "+ id);
               //console.log ("Id = "+tmp.chompLeft('accid').s);
                return id;
        }
        return null;
}

function getTextAfterBotName (text,botName){
        return str(text).chompLeft(botName + ':').trim().s;
}

function getTextAfterWhoIs (text){
        return str(text).chompLeft('whois').s;
}
function howManyAccounts(cb){
	pool.getConnection(function(err, connection) {

                var sql = "select count(0) as count from account";
                connection.query( sql, function(err, rows) {

                var count = rows[0].count;

                var result = "There are "+count + " accounts on the platform";
                console.log(result);
            // And done with the connection.
            connection.release();

            cb(result);

            // Don't use the connection here, it has been returned to the pool.
          });
        });
}
function getAccountInfo(accId,cb)
{
	pool.getConnection(function(err, connection) {

		var sql = "SELECT U.email,U.firstname,U.lastname,U.Phone as phone,A.name AS accname, A.id as accid FROM identity.USER U INNER JOIN pgossamercore.account A ON U.username LIKE Concat(A.name,'%') where A.id ='" + accId + "' OR A.name = '"+accId+"'";
		console.log(sql);
		connection.query( sql, function(err, rows) {
                console.log(err);
		var result = "This does not exist in the db"
               	if(rows.length > 0){
                	var info = {id : rows[0].accid , accname : rows[0].accname , email : rows[0].email, firstname : rows[0].firstname , lastname : rows[0].lastname};
                result = str('\nIt belongs to a {{firstname}} {{lastname}}. \nTheir email is {{email}}. \n Account Name : {{accname}} \n Account Id : {{id}}')	
		.template(info).s;
				}
                // console.log(result);
            // And done with the connection.
            connection.release();

            cb(result);

            // Don't use the connection here, it has been returned to the pool.
          });
        });
}
function accountInfo (text,botName,cb){
		var withoutBotName = getTextAfterBotName(text,botName);

        var accid = getTextWithoutGetInfoOf(withoutBotName,"acc");

        getAccountInfo(accid,cb);
}

function getTextWithoutGetInfoOf(text,type){
        text = text.trim();
        return str(text).chompLeft("get info for "+type).s.trim();
}

function deploymentInfo(text,botName,cb){
    var withoutBotName = getTextAfterBotName(text,botName);

    var did = getTextWithoutGetInfoOf(withoutBotName,"dep");
    getDeploymentInfo(did,cb);
}
function getDeploymentInfo(did,cb){
     pool.getConnection(function(err, connection) {

                var sql = "select d.id as did,d.Name as dname, b.Id as bid, a.Id as aid, a.Name as aname, AC.Id as accid, AC.Name as accname from deployment d inner join blueprint b on d.BlueprintId = b.Id inner join application a on a.Id = b.ApplicationId inner join account AC on AC.Id = a.AccountId where d.id = '" + did +"' OR d.name like '%"+ did+"%'";
                console.log(sql);
                connection.query( sql, function(err, rows) {
                console.log(err);
                var result = "This does not exist in the db"
                if(rows.length > 0){
                        var info = {
                            accid : rows[0].accid , 
                            accname : rows[0].accname, 
                            did : rows[0].did , 
                            dname: rows[0].dname , 
                            bid : rows[0].bid, 
                            aid : rows[0].aid,
                            aname : rows[0].aname
                        };
 result = str('\nDeployment Info \nID:{{did}} \nName:{{dname}}. \n\nApp Info \nId:{{aid}} \nName : {{aname}} \n\n Account Info \n Name:{{accname}} \n Id : {{accid}}').template(info).s;                               
}
                // console.log(result);
            // And done with the connection.
            connection.release();

            cb(result);

            // Don't use the connection here, it has been returned to the pool.
          });
        });

}
exports.deploymentInfo = deploymentInfo;
exports.accountInfo = accountInfo;
exports.whoIs = whoIs;
exports.howManyAccounts = howManyAccounts;
//whoIs('alfred: whois accid 166','alfred',function(text) { console.log("Result = " + text)});
//howManyAccounts(function(t) {console.log("Count = "+t) });
//accountInfo("alfred: get info for acc 166","alfred",function(text) { console.log("Result = " + text)});
//deploymentInfo("alfred: get info for dep fantasy","alfred",function(text) { console.log("Result = " + text)});
