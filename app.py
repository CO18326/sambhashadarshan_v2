from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit, join_room, leave_room
import threading
import time
import requests
from flask_cors import CORS, cross_origin
import json
from datetime import datetime
import pytz


app = Flask(__name__)
app.config['SECRET_KEY'] = '3338933a07990eac0165467a958a82dc#'
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)


ist = pytz.timezone('Asia/Kolkata')

def get_ist_time():
    """Get the current time in IST."""
    now_utc = datetime.now(pytz.utc)
    now_ist = now_utc.astimezone(ist)
    return now_ist.strftime('%Y-%m-%d %H:%M:%S')


active_users = {}
url = "http://10.129.148.248:7248/"

def deleteallsession():
    response = requests.post(f"{url}deleteAllsession")
    return response


# def send_call_notifications(receiver_session, caller_info, receiver_info):
#     while receiver_session in call_threads and call_threads[receiver_session]["active"]:
#         socketio.emit('incoming_call', {
#             'from': caller_info,
#             'to': receiver_info
#         }, room=receiver_session)
#         time.sleep(2)  #

@socketio.on('message_send')
def message_sent(data):
    data['userid'] = data['rcvrid']
    sessiondata = requests.post(f"{url}getSession", json=data)
    
    response = json.loads(sessiondata.text)
    print(data)
    if 'sid' in response:
        sid =  response['sid']
        data['time'] = str(datetime.now())
        print(data['time'])
        socketio.emit('message_incoming', data, room=sid)
    requests.post(f"{url}putMessage", json=data)

    


@socketio.on('hungup')
def hungup_call(data):
    print("hello")
    caller_session_id = request.sid
    receiver_user_id = data['to_id']
    meeting_id = data['meeting_id']
    caller_id = data['from_id']
    # username = data['username']
    if not receiver_user_id:
        return jsonify({'error': 'reciver_user_id_not_found'}), 400

    data = {
        "userid": receiver_user_id,
    }
    response = requests.post(f"{url}getSession", json=data)

    if response.status_code == 301 :
        return jsonify({'error': 'Receiver is not active'}), 301
    response = json.loads(response.text)
    receiver_session_id =  response['sid']
    socketio.emit('call_response', {
        'meeting_id':  meeting_id,
        'from_id' : caller_id,
        'type' : 'hungup',
        'meeting_id' : meeting_id,
        'from_session' : caller_session_id,
        'to_session' : receiver_session_id,
        'to_id' : receiver_user_id
    }, room=receiver_session_id),
    print("calllling________________",caller_session_id)

    return jsonify({'message': 'hungup, receiver notified'}), 200




@socketio.on('calling')
def initiate_call(data):
    print("hello")
    caller_session_id = request.sid
    receiver_user_id = data['to_id']
    meeting_id = data['meeting_id']
    caller_id = data['from_id']
    # username = data['username']
    if not receiver_user_id:
        return jsonify({'error': 'reciver_user_id_not_found'}), 400

    data = {
        "userid": receiver_user_id,
    }
    response = requests.post(f"{url}getSession", json=data)

    if response.status_code == 301 :
        return jsonify({'error': 'Receiver is not active'}), 301
    response = json.loads(response.text)
    receiver_session_id =  response['sid']
    socketio.emit('call_response', {
        'meeting_id':  meeting_id,
        'from_id' : caller_id,
        'type' : 'incomming_call',
        'meeting_id' : meeting_id,
        'from_session' : caller_session_id,
        'to_session' : receiver_session_id,
        'to_id' : receiver_user_id
    }, room=receiver_session_id),
    print("calllling________________",caller_session_id)

    return jsonify({'message': 'Call initiated, receiver notified'}), 200

@socketio.on('accept')
def accept_call(data):
    receiver_session_id = request.sid
    receiver_user_id = data['to_id'] or ""
    meeting_id = data['meeting_id']
    caller_id = data['from_id']

    
    socketio.emit('call_response', {
        'meeting_id':  meeting_id,
        'from_id' : caller_id,
        'type' : 'accepted',
        'meeting_id' : meeting_id,
        'from_session' : data['from_session'],
        'to_session' : receiver_session_id,
        'to_id' : receiver_user_id

    }, room=data['from_session']),
    print("room to send ===================" ,data['from_session'])

@socketio.on('reject')
def reject_call(data):
    receiver_session_id = request.sid
    receiver_user_id = data['to_id']
    meeting_id = data['meeting_id']
    caller_id = data['from_id']


    socketio.emit('call_response', {
        'meeting_id':  meeting_id,
        'from_id' : caller_id,
        'type' : 'rejected',
        'meeting_id' : meeting_id,
        'from_session' : data['from_session'],
        'to_session' : receiver_session_id,
        'to_id' : receiver_user_id

    }, room=data['from_session']),


@socketio.on('join')
def reject_call(data):
    receiver_session_id = request.sid
    receiver_user_id = data['to_id']
    meeting_id = data['meeting_id']
    caller_id = data['from_id']


    socketio.emit('call_response', {
        'meeting_id':  meeting_id,
        'from_id' : caller_id,
        'type' : 'joined',
        'meeting_id' : meeting_id,
        'from_session' : data['from_session'],
        'to_session' : receiver_session_id,
        'to_id' : receiver_user_id
    }, room=data["to_session"]),


@socketio.on('connect')
def on_connect():
    session_id = request.sid
    if session_id:
        print(session_id)
        active_users[session_id] = request.sid
        join_room(session_id)  # Join a room named after the session ID
        emit('status', {'message': f'User {session_id} connected'}, room=session_id)


@socketio.on('log_out')
def log_out(data):
    data = {
        "sessionid": "",
        "userid": str(data['user_id'])
    }
    response = requests.post(f"{url}deleteSession", json=data)

    print(f"disconnected {data['user_id']}")

@socketio.on('disconnect')
def on_disconnect():
    session_id = request.sid
    data = {
        "sessionid": str(session_id),
        "userid" : ""
    }
    response = requests.post(f"{url}deleteSession", json=data)

    print(f"User {session_id} disconnected")


@socketio.on('sign_in')
def sign_in(data):
    session_id = request.sid
    user_id = data['user_id']
    data = {
        "userid": data['user_id'],
        "sessionid": session_id
    }
    response = requests.post(f"{url}putSession", json=data)
    print(f"signedin {session_id} , {user_id}")
    
if __name__ == '__main__':
    deleteallsession()
    socketio.run(app, debug=True , host='0.0.0.0')