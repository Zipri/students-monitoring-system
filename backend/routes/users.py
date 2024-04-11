from app import app, mongo
from flask import jsonify, request
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
# import jwt
# from datetime import datetime, timedelta

# Helper functions
def validate_user_data(data, update=False):
    """Validate user data for required fields. For updates, checks are more lenient."""
    errors = []
    required_fields = ['username', 'email', 'role']
    if not update:
        for field in required_fields:
            if field not in data or not data[field]:
                errors.append(f'{field} is required.')
    return errors

def user_to_json(user):
    """Convert a user document to a JSON-serializable format."""
    return {
        'id': str(user['_id']),
        'username': user['username'],
        'email': user['email'],
        'role': user['role'],
        'group': user.get('group', None)
    }

##region CRUD
# Получение списка всех пользователей
@app.route('/users', methods=['GET'])
def get_users():
    users = mongo.db.users.find()
    result = [user_to_json(user) for user in users]
    return jsonify(result)

# Добавление нового пользователя
@app.route('/users/add', methods=['POST'])
def add_user():
    data = request.json
    errors = validate_user_data(data)
    if errors:
        return jsonify({'error': 'Validation failed', 'messages': errors}), 400
    # Hashing the password before saving
    hashed_password = generate_password_hash(data['password'])
    data['password'] = hashed_password  # Replace plain text with hash
    result = mongo.db.users.insert_one(data)
    # Retrieve the user to return all data except the password
    user = mongo.db.users.find_one({'_id': result.inserted_id})
    if user:
        user_data = user_to_json(user)
        return jsonify(user_data), 201
    else:
        return jsonify({'error': 'User was not added successfully'}), 500


# Обновление данных пользователя по идентификатору
@app.route('/users/update/<id>', methods=['PUT'])
def update_user(id):
    data = request.json
    errors = validate_user_data(data, update=True)
    if errors:
        return jsonify({'error': 'Validation failed', 'messages': errors}), 400
    result = mongo.db.users.update_one({'_id': ObjectId(id)}, {'$set': data})
    user = mongo.db.users.find_one({'_id': ObjectId(id)})
    if user:
        user_data = user_to_json(user)
        return jsonify(user_data), 201
    else:
        return jsonify({'error': 'User was not added successfully'}), 500

# Удаление пользователя по идентификатору
@app.route('/users/delete/<id>', methods=['DELETE'])
def delete_user(id):
    result = mongo.db.users.delete_one({'_id': ObjectId(id)})
    if result.deleted_count == 0:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'deleted_count': result.deleted_count})
##endregion

## Реализация входа в систему
@app.route('/login', methods=['POST'])
def login_user():
    data = request.json
    user = mongo.db.users.find_one({'email': data['email']})

    if user and check_password_hash(user['password'], data['password']):
        # Генерация токена
        # token = jwt.encode({
        #     'user_id': str(user['_id']),
        #     'exp': datetime.utcnow() + timedelta(hours=1)
        # }, app.config['SECRET_KEY'])

        user_data = user_to_json(user)  # Use the function to exclude password
        user_data['token'] = 'token'  # Replace 'token' with the actual token variable after generating the JWT token
        return jsonify(user_data), 200
    else:
        return jsonify({'error': 'Invalid email or password'}), 401
    
## Регистрация в систему
@app.route('/registration', methods=['POST'])
def registration():
    data = request.json
    group_id = data.pop('groupId', None)  # Извлекаем groupId из данных запроса и удаляем его из словаря
    errors = validate_user_data(data)
    if mongo.db.users.find_one({'username': data['username']}):
        return jsonify({'error': 'User with this name already exists'}), 400
    if errors:
        return jsonify({'error': 'Validation failed', 'messages': errors}), 400
    if not group_id:
        return jsonify({'error': 'Missing required groupId'}), 400
    
    # Хеширование пароля перед сохранением
    hashed_password = generate_password_hash(data['password'])
    data['password'] = hashed_password
    result = mongo.db.users.insert_one(data)
    new_user_id = result.inserted_id
    
    if new_user_id:
        # Находим группу по groupId и добавляем в неё нового пользователя
        group = mongo.db.groups.find_one({'_id': ObjectId(group_id)})
        if not group:
            return jsonify({'error': 'Group not found'}), 404
        
        new_student = {
            'userId': str(new_user_id),
            'username': data['username'],
            'email': data['email']
        }
        
        updated_students = group.get('students', [])
        updated_students.append(new_student)
        
        mongo.db.groups.update_one(
            {'_id': ObjectId(group_id)},
            {'$set': {'students': updated_students}}
        )
        
        user = mongo.db.users.find_one({'_id': new_user_id})
        user_data = user_to_json(user)
        return jsonify(user_data), 201
    else:
        return jsonify({'error': 'User was not added successfully'}), 500


## Возвращает всех студентов заданной группы
@app.route('/users/group/<group_name>', methods=['GET'])
def get_users_by_group(group_name):
    users = mongo.db.users.find({"group": group_name, "role": "student"})
    result = [user_to_json(user) for user in users]
    return jsonify(result)

## Возвращает всех заданной роли
@app.route('/users/role/<role_name>', methods=['GET'])
def get_users_by_role(role_name):
    users = mongo.db.users.find({"role": role_name})
    result = [user_to_json(user) for user in users]
    return jsonify(result)