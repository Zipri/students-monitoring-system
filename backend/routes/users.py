from app import app, mongo
from flask import jsonify, request
from bson.objectid import ObjectId

# Получение списка всех пользователей
@app.route('/users', methods=['GET'])
def get_users():
    users = mongo.db.users.find()
    result = [{'id': str(user['_id']), 'username': user['username'], 'email': user['email'], 'role': user['role'], 'group': user.get('group', None)} for user in users]
    return jsonify(result)

# Добавление нового пользователя
# interface AddUserParams {
#   username: string;
#   email: string;
#   passwordHash: string; // Предполагается, что пароль уже захеширован перед отправкой
#   role: 'student' | 'teacher' | 'admin'; // Пример ограничения ролей пользователя
#   group?: string; // Необязательный параметр, может быть использован для студентов
# }
@app.route('/users/add', methods=['POST'])
def add_user():
    data = request.json
    # Проверяем наличие обязательных полей в данных
    if not data or 'username' not in data or 'role' not in data:
        return jsonify({'error': 'Missing required user data'}), 400

    # Вставляем данные нового пользователя в коллекцию 'users'
    collection = mongo.db.users
    result = collection.insert_one(data)
    return jsonify({'result': str(result.inserted_id)})

# Обновление данных пользователя по идентификатору
@app.route('/users/update/<id>', methods=['PUT'])
def update_user(id):
    data = request.json
    collection = mongo.db.users
    result = collection.update_one({'_id': ObjectId(id)}, {'$set': data})
    if result.modified_count == 0:
        return jsonify({'error': 'User not found or data not changed'}), 404
    return jsonify({'modified_count': result.modified_count})

# Удаление пользователя по идентификатору
@app.route('/users/delete/<id>', methods=['DELETE'])
def delete_user(id):
    collection = mongo.db.users
    result = collection.delete_one({'_id': ObjectId(id)})
    if result.deleted_count == 0:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'deleted_count': result.deleted_count})

# Добавление нескольких пользователей
# @app.route('/users/add_many', methods=['POST'])
# def add_many_users():
#     data = request.json
#     if not data or 'users' not in data or not isinstance(data['users'], list):
#         return jsonify({'error': 'Missing users or wrong format'}), 400

#     users_to_add = data['users']
#     collection = mongo.db.users
#     result = collection.insert_many(users_to_add)
#     return jsonify({'inserted_ids': [str(id) for id in result.inserted_ids]})

# Удаление нескольких пользователей по идентификаторам
# @app.route('/users/delete_many', methods=['POST'])
# def delete_many_users():
#     data = request.json
#     if not data or 'ids' not in data:
#         return jsonify({'error': 'Missing ids'}), 400

#     ids_to_delete = data['ids']
#     object_ids = [ObjectId(id) for id in ids_to_delete]
#     collection = mongo.db.users
#     result = collection.delete_many({'_id': {'$in': object_ids}})
#     return jsonify({'deleted_count': result.deleted_count})
