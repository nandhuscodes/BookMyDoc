from flask import Flask, request, jsonify, render_template, redirect, abort, send_file
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS
from flask_pymongo import PyMongo
from werkzeug.security import check_password_hash, generate_password_hash
import os
import jwt
import json
from pymongo import MongoClient
from twilio.rest import Client
from bson.objectid import ObjectId
import nltk
from nltk.stem import SnowballStemmer


app = Flask(__name__)
CORS(app, origins=["http://localhost:4200"])

api = Api(app)

# Set up the database connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/patients"
mongo = PyMongo(app)

class Doctor(Resource):
    def post(self):
        data = request.get_json()
        username = data['username']
        dept = data['dept']
        email = data['email']
        password = generate_password_hash(data['password'])
        phone = data['phone']
        hospital = data['hospital']
        address = data['address']

        # create a new doctor object
        doctor = {
            'username': username,
            'dept': dept,
            'email': email,
            'password': password,
            'phone': phone,
            'hospital': hospital,
            'address': address
        }

        # add the doctor to the database
        mongo.db.doctors.insert_one(doctor)

        return jsonify({'message': 'Doctor added successfully', 'redirect': ''})

class User(Resource):
    def post(self):
        data = request.get_json()
        username = data['username']
        email = data['email']
        password = generate_password_hash(data['password'])
        phone = data['phone']
        age = data['age']
        gender = data['gender']

        # create a new user object
        user = {
            'username': username,
            'email': email,
            'password': password,
            'phone': phone,
            'age': age,
            'gender': gender
        }

        # add the user to the database
        mongo.db.users.insert_one(user)

        response_data = {
            'message': 'User created successfully',
            'redirect': ''
        }
        return jsonify(response_data)


class Login(Resource):
    def post(self):
        # TODO: Implement login functionality
        # return 'Login endpoint'
        email = request.json.get('email')
        password = request.json.get('password')
        
        user = mongo.db.users.find_one({'email': email})
        if user and check_password_hash(user['password'], password):
            # Email and password are valid
            return jsonify({'success': True})
        else:
            # Email and/or password are invalid
            return jsonify({'success': False, 'error': 'Invalid email or password'})

class DocLogin(Resource):
    def post(self):
        # TODO: Implement login functionality
        # return 'Login endpoint'
        name = request.json.get('name')
        password = request.json.get('password')
        
        doctor = mongo.db.doctors.find_one({'username': name})
        if doctor and check_password_hash(doctor['password'], password):
            # Email and password are valid
            return jsonify({'success': True})
        else:
            # Email and/or password are invalid
            return jsonify({'success': False, 'error': 'Invalid username or password'})
        
            

class Departments(Resource):
    def get(self):
        departments = mongo.db.doctors.distinct('dept')
        response_data = {
            'departments': departments
        }
        return jsonify(response_data)

api.add_resource(Departments, '/api/departments')


client = MongoClient('mongodb://localhost:27017/')
db = client['patients']

@app.route('/doctors', methods=['POST'])
def get_doctors():
    department = request.json.get('department')
    doctors = [doc['username'] for doc in db.doctors.find({'dept': department})]
    return jsonify({'doctors': doctors})

client = MongoClient('mongodb://localhost:27017/')
db = client['patients']
slots = db['slots']

@app.route('/doctor-of-that-slot', methods=['POST'])
def get_doctor_of_slot():
    datetime = request.json.get('datetime')
    patient = request.json.get('patient')
    doctors = [doc['doctor'] for doc in db.slots.find({'datetime': datetime, 'patient':patient})]
    return jsonify({'doctors': doctors})

@app.route('/api/datetime_list', methods=['GET'])
def get_datetime_list():
    email = request.args.get('email')
    datetime_list = [d['datetime'] for d in db.slots.find({'patient': email})]
    return jsonify(datetime_list)



@app.route('/book-appointment', methods=['POST'])
def book_appointment():
    doctor = request.json.get('doctor')
    datetime = request.json.get('datetime')
    status = request.json.get('status')
    patient = request.json.get('patient')
    # Check if the doctor already has an appointment scheduled for the requested datetime
    appointment_conflict = db.slots.find_one({'doctor': doctor, 'datetime': datetime})
    if appointment_conflict:
        return jsonify({'message': 'Appointment slot not available'})
    db.slots.insert_one({'doctor': doctor,'datetime': datetime, 'status': status, 'patient': patient})
    account_sid = "ACb392c9df89e1d1ae223dfd7acc428084"
    auth_token = "66974a5bb8fd2dd34ad7cc39f2277d1d"
    twilio_phone_number = "+16073177304"
    client = Client(account_sid, auth_token)
    patient = mongo.db.users.find_one({'email': patient})
    patient_phone_number = patient['phone']
    hospital = mongo.db.doctors.find_one({'username':doctor})
    doctor_hospital = hospital['hospital']
    doc_addr = hospital['address']
    message = 'Your appointment for Dr.'+doctor+' is booked on '+datetime+'\nAppointment Details\nDoctor: '+doctor+"\nHospital: "+doctor_hospital+"\nAddress: "+doc_addr+'\nSlot: '+datetime

    client.messages.create(to='+91'+patient_phone_number, from_=twilio_phone_number, body=message)

    return jsonify({'message': 'Appointment booked'})

@app.route('/api/update-appointment', methods=['POST'])
def update_appointment():
    doctor = request.json.get('doctor')
    datetime = request.json.get('datetime')
    status = request.json.get('status')
    patient = request.json.get('patient')
    new_datetime = request.json.get('newDatetime')
    # Get the appointment to update based on the doctor, datetime, and patient
    appointment_to_update = db.slots.find_one({'datetime': datetime, 'patient': patient})
    if appointment_to_update:
        # Update the appointment's datetime and status
        db.slots.update_one(
            {'_id': appointment_to_update['_id']},
            {'$set': {'datetime': new_datetime, 'status': status}}
        )
        return jsonify({'message': 'Appointment rescheduled'})
    else:
        return jsonify({'message': 'Appointment not found'})

@app.route('/api/delete-appointment', methods=['POST'])
def delete_appointment():
    doctor = request.json.get('doctor')
    datetime = request.json.get('datetime')
    status = request.json.get('status')
    patient = request.json.get('patient')
    # Get the appointment to update based on the doctor, datetime, and patient
    appointment_to_delete = db.slots.find_one({'datetime': datetime})
    if appointment_to_delete:
        db.slots.delete_one({'_id': appointment_to_delete['_id']})
        return jsonify({'message': 'Appointment cancelled'})
    else:
        return jsonify({'message': 'Appointment not found'})
    

@app.route('/api/delete', methods=['POST'])
def delete():
    doctor = request.json.get('doctor')
    datetime = request.json.get('datetime')
    # Get the appointment to update based on the doctor, datetime, and patient
    appointment_to_delete = db.slots.find_one({'doctor':doctor,'datetime': datetime})
    if appointment_to_delete:
        db.slots.delete_one({'_id': appointment_to_delete['_id']})
        return jsonify({'message': 'Appointment cancelled'})
    else:
        return jsonify({'message': 'Appointment not found'})

@app.route('/appointments')
def get_appointments():
    doctor_id = request.args.get('doctor_id')
    appointments = list(db.slots.find({'doctor': doctor_id}).sort('datetime', 1))
    
    
    appointment_list = []
    for appointment in appointments:
        patient_email = appointment['patient']
        patient = db.users.find_one({'email': patient_email})
        patient_name = patient['username'] if patient else None  # Use None as a default value if the patient is not found
        
        appointment_dict = {
            "doctor": appointment['doctor'],
            "patient": patient_name,
            "datetime": appointment['datetime'],
            "status": appointment['status']
        }
        appointment_list.append(appointment_dict)
    
    return jsonify(appointment_list)




# Load the JSON file containing the chatbot responses
with open('intents.json', 'r') as f:
    responses = json.load(f)

# Initialize the Snowball stemmer for English
stemmer = SnowballStemmer('english')

@app.route('/bot', methods=['POST'])
def bot():
    message = request.json['text']
    response = {}

    # Tokenize and stem the user input
    words = nltk.word_tokenize(message.lower())
    words = [stemmer.stem(word) for word in words]

    # Loop through the JSON file to find a matching response
    for resp in responses:
        for pattern in resp['input']:
            pattern_words = nltk.word_tokenize(pattern.lower())
            pattern_words = [stemmer.stem(word) for word in pattern_words]

            # Check for partial matches
            if any(word in pattern_words for word in words):
                response = resp['output']
                break

        if response: # stop searching if a match is found
            break

    # Return a default response if no matching response is found
    if not response:
        response = {"message": "Sorry, I didn't understand. Can you please rephrase?"}

    return jsonify(response)

api.add_resource(Doctor, '/api/signup')
api.add_resource(User, '/api/register')
api.add_resource(Login, '/api/login')
api.add_resource(DocLogin, '/api/signin')

if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=5000)
