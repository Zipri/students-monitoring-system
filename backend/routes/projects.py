from app import app, mongo
from flask import jsonify, request
from bson.objectid import ObjectId

## Получение списка всех проектов
@app.route('/projects', methods=['GET'])
def get_projects():
    projects = mongo.db.projects.find()
    result = [{
        'id': str(project['_id']),
        'title': project['title'],
        'description': project['description'],
        'deadline': project['deadline'],
        'status': project['status'],
        'assignedStudents': project.get('assignedStudents', []),  # Use .get() with default empty list
        'assignedTeacher': project.get('assignedTeacher', '')  # Similarly, provide a default value
    } for project in projects]
    return jsonify(result)

## Добавление нового проекта
@app.route('/projects/add', methods=['POST'])
def add_project():
    data = request.json
    if not data or 'title' not in data:
        return jsonify({'error': 'Missing required project data'}), 400
    collection = mongo.db.projects
    result = collection.insert_one(data)
    return jsonify({'result': str(result.inserted_id)})

## Обновление данных проекта по идентификатору
@app.route('/projects/update/<id>', methods=['PUT'])
def update_project(id):
    data = request.json
    collection = mongo.db.projects
    result = collection.update_one({'_id': ObjectId(id)}, {'$set': data})
    if result.modified_count == 0:
        return jsonify({'error': 'Project not found or data not changed'}), 404
    return jsonify({'modified_count': result.modified_count})

## Удаление проекта по идентификатору
@app.route('/projects/delete/<id>', methods=['DELETE'])
def delete_project(id):
    collection = mongo.db.projects
    result = collection.delete_one({'_id': ObjectId(id)})
    if result.deleted_count == 0:
        return jsonify({'error': 'Project not found'}), 404
    return jsonify({'deleted_count': result.deleted_count})

## Получение детальной информации о проекте
@app.route('/projects/<id>', methods=['GET'])
def get_project_by_id(id):
    project = mongo.db.projects.find_one({'_id': ObjectId(id)})
    if project:
        result = {
            'id': str(project['_id']),
            'title': project['title'],
            'description': project['description'],
            'deadline': project['deadline'],
            'status': project['status'],
            'assignedStudents': project['assignedStudents'],
            'assignedTeacher': project['assignedTeacher']
        }
        return jsonify(result)
    else:
        return jsonify({'error': 'Project not found'}), 404


