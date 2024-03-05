from app import app, mongo
from flask import jsonify, request
from bson.objectid import ObjectId
from datetime import datetime
'''
Структура коллекции groups:
(все поля обязательные)
id:    уникальный идентификатор группы.
name:       название группы, например "ИУ7-53Б".
students:   список идентификаторов студентов, входящих в группу.
'''

def validate_group_data(data, is_update=False):
    errors = []
    if not is_update:
        if 'name' not in data:
            errors.append('name is required.')
        if 'students' not in data:
            errors.append('students is required.')
    # Дополнительные проверки можно добавить здесь
    return errors

def group_to_json(group):
    """Convert a group document to a JSON-serializable format."""
    return {
        'id': str(group['_id']),
        'name': group['name'],
        'students': group['students']
    }

##region CRUD
@app.route('/groups', methods=['GET'])
def get_groups():
    groups = mongo.db.groups.find()
    result = [group_to_json(group) for group in groups]
    return jsonify(result)

@app.route('/groups/add', methods=['POST'])
def add_group():
    data = request.json
    errors = validate_group_data(data)
    if errors:
        return jsonify({'error': 'Validation failed', 'messages': errors}), 400
    if mongo.db.groups.find_one({'name': data['name']}):
        return jsonify({'error': 'Group with this name already exists'}), 400
    result = mongo.db.groups.insert_one(data)
    new_group = mongo.db.groups.find_one({'_id': result.inserted_id})
    return jsonify(group_to_json(new_group)), 201

@app.route('/groups/<groupId>', methods=['PUT'])
def update_group(groupId):
    data = request.json
    errors = validate_group_data(data, is_update=True)
    if errors:
        return jsonify({'error': 'Validation failed', 'messages': errors}), 400
    result = mongo.db.groups.update_one({'_id': ObjectId(groupId)}, {'$set': data})
    if result.modified_count:
        updated_group = mongo.db.groups.find_one({'_id': ObjectId(groupId)})
        return jsonify(group_to_json(updated_group)), 200
    else:
        return jsonify({'error': 'Group not found or no changes made'}), 404

@app.route('/groups/<groupId>', methods=['DELETE'])
def delete_group(groupId):
    result = mongo.db.groups.delete_one({'_id': ObjectId(groupId)})
    if result.deleted_count:
        return jsonify({'message': 'Group deleted successfully'}), 200
    else:
        return jsonify({'error': 'Group not found'}), 404
##endregion
    
## Функция поиска групп по названию
@app.route('/groups/search', methods=['GET'])
def search_groups():
    name_query = request.args.get('name', None)
    if name_query:
        # Используем регулярные выражения для частичного соответствия (case-insensitive)
        groups = mongo.db.groups.find({'name': {'$regex': name_query, '$options': 'i'}})
    else:
        return jsonify({'error': 'Name query parameter is required'}), 400

    result = [group_to_json(group) for group in groups]
    return jsonify(result), 200

## Поиск групп, в которых студент является членом
@app.route('/groups/student/<student_id>', methods=['GET'])
def get_groups_by_student(student_id):
    groups = mongo.db.groups.find({'students': {'$in': [student_id]}})
    result = [group_to_json(group) for group in groups]
    return jsonify(result), 200