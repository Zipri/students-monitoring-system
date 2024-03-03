from app import app, mongo
from flask import jsonify, request
from bson.objectid import ObjectId

##region CRUD
# Получение списка всех пользователей
@app.route('/users', methods=['GET'])
def get_users():
    users = mongo.db.users.find()
    result = [{'id': str(user['_id']), 'username': user['username'], 'email': user['email'], 'role': user['role'], 'group': user.get('group', None)} for user in users]
    return jsonify(result)

# Добавление нового пользователя
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
##endregion

## Возвращает всех студентов заданной группы
@app.route('/users/group/<group_name>', methods=['GET'])
def get_users_by_group(group_name):
    # Используем метод find() для поиска всех пользователей, у которых поле 'group' соответствует заданному group_name и роль 'student'
    users = mongo.db.users.find({"group": group_name, "role": "Студент"})
    # Преобразуем результат в список словарей для последующей сериализации в JSON
    result = [{
        'id': str(user['_id']),
        'username': user['username'],
        'email': user['email'],
        'role': user['role'],
        'group': user['group']
    } for user in users]
    # Возвращаем результат в виде JSON
    return jsonify(result)

## Возвращает всех заданной роли
@app.route('/users/role/<role_name>', methods=['GET'])
def get_users_by_role(role_name):
    # Используем метод find() для поиска всех пользователей, у которых поле 'role' соответствует заданному role_name
    users = mongo.db.users.find({"role": role_name})
    # Преобразуем результат в список словарей для последующей сериализации в JSON
    result = [{
        'id': str(user['_id']),
        'username': user['username'],
        'email': user['email'],
        'role': user['role'],
        'group': user['group']
    } for user in users]
    # Возвращаем результат в виде JSON
    return jsonify(result)
