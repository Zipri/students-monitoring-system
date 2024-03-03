from app import app, mongo
from flask import jsonify, request
from bson.objectid import ObjectId

##region CRUD
# Получение списка всех задач
@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = mongo.db.tasks.find()
    result = [{
        'id': str(task['_id']),
        'projectId': str(task['projectId']), # TODO сделать его тоже ObjectId
        'title': task['title'],
        'description': task['description'],
        'status': task['status'],
        'priority': task['priority'],
        'deadline': task['deadline']
    } for task in tasks]
    return jsonify(result)

# Добавление новой задачи
@app.route('/tasks/add', methods=['POST'])
def add_task():
    data = request.json
    if not data or 'title' not in data or 'projectId' not in data:
        return jsonify({'error': 'Missing required task data'}), 400
    collection = mongo.db.tasks
    result = collection.insert_one(data)
    return jsonify({'result': str(result.inserted_id)})

# Обновление данных задачи по идентификатору
@app.route('/tasks/update/<id>', methods=['PUT'])
def update_task(id):
    data = request.json
    collection = mongo.db.tasks
    result = collection.update_one({'_id': ObjectId(id)}, {'$set': data})
    if result.modified_count == 0:
        return jsonify({'error': 'Task not found or data not changed'}), 404
    return jsonify({'modified_count': result.modified_count})

# Удаление задачи по идентификатору
@app.route('/tasks/delete/<id>', methods=['DELETE'])
def delete_task(id):
    collection = mongo.db.tasks
    result = collection.delete_one({'_id': ObjectId(id)})
    if result.deleted_count == 0:
        return jsonify({'error': 'Task not found'}), 404
    return jsonify({'deleted_count': result.deleted_count})
##endregion

## Получение задач по идентификатору проекта
@app.route('/tasks/project/<projectId>', methods=['GET'])
def get_tasks_by_project(projectId):
    tasks = mongo.db.tasks.find({'projectId': projectId})
    result = [{
        'id': str(task['_id']),
        'projectId': str(task['projectId']),
        'title': task['title'],
        'description': task['description'],
        'status': task['status'],
        'priority': task['priority'],
        'deadline': task['deadline']
    } for task in tasks]
    return jsonify(result)

## Фильтрация задач по статусу
@app.route('/tasks/status/<status>', methods=['GET'])
def get_tasks_by_status(status):
    tasks = mongo.db.tasks.find({'status': status})
    result = [{
        'id': str(task['_id']),
        'projectId': str(task['projectId']),
        'title': task['title'],
        'description': task['description'],
        'status': task['status'],
        'priority': task['priority'],
        'deadline': task['deadline']
    } for task in tasks]
    return jsonify(result)

## эндпоинт, который позволяет фильтровать задачи (tasks) по всем предоставленным параметрам
@app.route('/tasks/filter', methods=['GET'])
def filter_tasks():
    query = {}

    # Фильтры для запроса
    if 'id' in request.args:
        query['_id'] = ObjectId(request.args['id'])
    if 'projectId' in request.args:
        query['projectId'] = request.args['projectId']
    if 'title' in request.args:
        query['title'] = {"$regex": request.args['title'], "$options": "i"}  # Поиск по подстроке, регистронезависимый
    if 'description' in request.args:
        query['description'] = {"$regex": request.args['description'], "$options": "i"}  # Поиск по подстроке, регистронезависимый
    if 'status' in request.args:
        query['status'] = request.args['status']
    if 'priority' in request.args:
        query['priority'] = request.args['priority']
    if 'deadline' in request.args:
        # Предполагается, что дедлайн передаётся в формате YYYY-MM-DD # TODO на самом деле нет - проверить
        # Необходимо преобразовать строку в объект даты, если в вашей базе даты хранятся в соответствующем формате
        query['deadline'] = request.args['deadline']

    tasks = mongo.db.tasks.find(query)
    result = [{
        'id': str(task['_id']),
        'projectId': str(task['projectId']),
        'title': task['title'],
        'description': task['description'],
        'status': task['status'],
        'priority': task['priority'],
        'deadline': task['deadline']
    } for task in tasks]

    return jsonify(result)