from flask import Flask,request,jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS,cross_origin
from bson.json_util import dumps
import json
import hashlib
import User
from datetime import datetime


# Configuration:

app=Flask(__name__)
CORS(app,supports_credentials=True)
app.config['CORS_HEADERS'] = 'application/json'
app.config["MONGO_URI"] = "mongodb://localhost:27017/SambhashaDarshan"
mongo = PyMongo(app)

@app.route("/deleteAllsession",methods=['POST'])
def deleteallsession():
    mongo.db.Session.delete_many({})
    return {"msg" : "all entries are refreshed"} , 200

# Home Directory:
@app.route("/")
def hello():
    return "Hello world!"

# User signup
@app.route('/signup',methods=['POST'])
def signup():
    userdata = request.get_json()
    
    # Email,password,displayname
    if userdata:
        email = userdata['email']
        password = userdata['password']
        displayname = userdata['displayName']
        
        # user = User.User(df_id,email,password,displayname)

        res = mongo.db.User.find({'email' : email})
        if len(list(res)) != 0  :
            return jsonify({"status":"failure","msg": "Email Already Exist"}), 403

        id = mongo.db.User.insert_one(userdata)

        return jsonify({"id":email,"status":"success","msg": "Successful"}), 200
        
    else:
        return "Error", 501

# Signin
@app.route('/signin',methods=['POST'])
def signin():
    signdata = request.get_json()
    
    # Email,password
    if signdata:
        email = signdata['email']
        password = signdata['password']

        emailexist = mongo.db.Session.find_one({'userid': email})

        if emailexist:
            return jsonify({"msg": f'User already have one active session' , 'status' : 201}), 200

        if email and password:
            user = mongo.db.User.find_one({'email': email, 'password': password})
            # breakpoint()
            if user:
                return jsonify({"id": email, "msg": f'Successfully Logged In!' , 'status' : 200}), 200 
            else:
                return jsonify({"msg":"Incorrect username or password" , 'status' : 201}),200
        else:
            return jsonify({"msg": f'All details not provided' , 'status' : 201 }), 200 
    else:
        return "Error", 400

'''
@app.route('/login',methods=['POST'])
def login():
    logindata = request.get_json()
    
    # Username, password
    if not logindata.get('Username') or not logindata.get('Password'):
        return jsonify({"msg": f'{user} Invalid Username or Password'}), 401
        
    elif logindata:
        
        # DB content:
        user = mongo.db.User.find_one({"Username": logindata['Username']})
        password = mongo.db.User.find_one({"Password": logindata['Password']})
        
        if user:
            if password:
                return jsonify({"status":"success","msg": f'Login Successful'}), 201    
     
        return jsonify({"msg": f'{logindata["Username"]} is not Registered ! Kindly Register with us'}), 400

    else:
        return jsonify({"msg": f'{user} Invalid Username or Password'}), 401
''' 

@app.route('/getUsers',methods= ['POST'])
def getAllUsers():
    getall = request.get_json()

    rootuser = getall['rootuserid']

    cursor = mongo.db.User.find({"email":{"$ne": rootuser}})

    res = dumps(list(cursor))

    return jsonify({"data": res}), 200

@app.route('/logout',methods=['POST'])
def logout():
    # userid, delete the sessionid from the table
    ulog = request.get_json()
    userid = ulog['user_id']

    mongo.db.Session.delete_one({'userid':userid})

    return jsonify({"msg": f'Successfully Logged Out'}), 200

@app.route('/deleteSession',methods=['POST'])
def removeSession():
    
    deldata = request.get_json()

    if not deldata:
        return jsonify({"msg": f'Invalid Data'}), 401

    if deldata.get('sessionid')  != "" :
        sessionid = deldata['sessionid']

        mongo.db.Session.delete_one({'sessionid':sessionid})

        return jsonify({"msg": f'Session with session id: {sessionid} deleted successfully'}), 200

    elif deldata.get('userid') != "":
        userid = deldata['userid']

        mongo.db.Session.delete_one({'userid':userid})

        return jsonify({"msg": f'User with userid: {userid} deleted successfully'}), 200

    return jsonify({"msg": f'Failure!'}), 500

@app.route('/putSession',methods=['POST'])
def putSession():
    
    sessiondata = request.get_json()
    
    if sessiondata:
        userid = sessiondata['userid']
        sessionid = sessiondata['sessionid']
        
        if not userid or not sessionid:
            return jsonify({"msg": f' Invalid userid or sessionid'}), 401
        
        mongo.db.Session.insert_one(sessiondata)
        
        return jsonify({"status":"success","msg": "Data Successfully Saved"}), 200

    return jsonify({"msg": f'Invalid Details'}), 401

@app.route('/getSession',methods=['POST'])
def getSession():

    sessiondata = request.get_json()

    userid = sessiondata['userid']
    
    if not userid:
        return jsonify({"msg": f'Invalid Details'}), 401
    
    record = mongo.db.Session.find_one({"userid": userid})

    if not record :
        return jsonify({"msg": f'user is not online'}), 301

    sessionid = record['sessionid']
     

    return jsonify({"sid": str(sessionid) }), 200

@app.route('/putMessage',methods=['POST'])
def putMessage():
    msgdata = request.get_json()

    # if not  or not to:
    #     return jsonify({"msg": "Message can't be empty"})
    data = {
        'frm_to_str' : f'{msgdata['senderid']}-{msgdata['rcvrid']}',
        'time' : datetime.now(),
        'msg' : msgdata['msg']
    }
     
    mongo.db.Message.insert_one(data)
    
    return jsonify({"msg": f'Message Sent Successfully'}), 200

@app.route('/getMessage',methods=['POST'])
def getMessage():

    msgdata = request.get_json()
    myuserid = msgdata['myuserid']
    otheruserid = msgdata['otheruserid']

    # if not chatid:
    #     return jsonify({"msg": f'Chat doesn\'t exist'}), 401
    
    my_msgs = list(mongo.db.Message.find({'frm_to_str': f"{myuserid}-{otheruserid}"}))

    other_msgs = list(mongo.db.Message.find({'frm_to_str': f"{otheruserid}-{myuserid}"}))

    res = []

    for i in my_msgs:
        res.append({'body' : i['msg'] , 'me' : True , 'time' : i['time']})

    for i in other_msgs:
        res.append({'body' : i['msg'] , 'me' : False , 'time' : i['time']})

    sorted_data = sorted(res, key=lambda x: x['time'],reverse=True)

    return jsonify({"msg": f'Message Sent Successfully' , 'data' : sorted_data}), 200
    
if __name__ == "__main__":
    app.run(debug=True, port = 7248, host = '0.0.0.0')
    
