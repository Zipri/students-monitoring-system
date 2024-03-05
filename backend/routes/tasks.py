from app import app, mongo
from flask import jsonify, request
from bson.objectid import ObjectId
from datetime import datetime

# Helper functions
def validate_task_data(data, update=False):
    """Validate task data for required fields. For updates, checks are more lenient."""
    errors = []
    required_fields = ['projectId', 'title', 'status', 'priority', 'deadline']
    if not update:
        for field in required_fields:
            if field not in data or not data[field]:
                errors.append(f'{field} is required.')
        if 'deadline' in data:
            try:
                datetime.strptime(data['deadline'], '%Y-%m-%d')
            except ValueError:
                errors.append('Invalid deadline format. Use YYYY-MM-DD.')
    return errors

def task_to_json(task):
    """Convert a task document to a JSON-serializable format."""
    return {
        'id': str(task['_id']),
        'projectId': str(task['projectId']),
        'title': task['title'],
        'description': task.get('description', 'No description provided'),
        'status': task['status'],
        'priority': task['priority'],
        'deadline': task.get('deadline', 'No deadline')  # Предоставление значения по умолчанию
    }

##region CRUD
# Получение списка всех задач
@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = mongo.db.tasks.find()
    result = [task_to_json(task) for task in tasks]
    return jsonify(result)

# Добавление новой задачи
@app.route('/tasks/add', methods=['POST'])
def add_task():
    data = request.json
    errors = validate_task_data(data)
    if errors:
        return jsonify({'error': 'Validation failed', 'messages': errors}), 400
    result = mongo.db.tasks.insert_one(data)
    return jsonify({'result': str(result.inserted_id)})

# Обновление данных задачи по идентификатору
@app.route('/tasks/update/<id>', methods=['PUT'])
def update_task(id):
    data = request.json
    errors = validate_task_data(data, update=True)
    if errors:
        return jsonify({'error': 'Validation failed', 'messages': errors}), 400
    result = mongo.db.tasks.update_one({'_id': ObjectId(id)}, {'$set': data})
    if result.modified_count == 0:
        return jsonify({'error': 'Task not found or data not changed'}), 404
    return jsonify({'modified_count': result.modified_count})


# Удаление задачи по идентификатору
@app.route('/tasks/delete/<id>', methods=['DELETE'])
def delete_task(id):
    result = mongo.db.tasks.delete_one({'_id': ObjectId(id)})
    if result.deleted_count == 0:
        return jsonify({'error': 'Task not found'}), 404
    return jsonify({'deleted_count': result.deleted_count})
##endregion

## Получение задач по идентификатору проекта
@app.route('/tasks/project/<projectId>', methods=['GET'])
def get_tasks_by_project(projectId):
    tasks = mongo.db.tasks.find({'projectId': projectId})
    result = [task_to_json(task) for task in tasks]
    return jsonify(result)

## Фильтрация задач по статусу
@app.route('/tasks/status/<status>', methods=['GET'])
def get_tasks_by_status(status):
    tasks = mongo.db.tasks.find({'status': status})
    result = [task_to_json(task) for task in tasks]
    return jsonify(result)

## эндпоинт, который позволяет фильтровать задачи (tasks) по всем предоставленным параметрам
@app.route('/tasks/filter', methods=['GET'])
def filter_tasks():
    query = {}
    for key in ['projectId', 'title', 'description', 'status', 'priority', 'deadline']:
        if key in request.args:
            if key in ['title', 'description']:
                query[key] = {"$regex": request.args[key], "$options": "i"}
            else:
                query[key] = request.args[key]

    tasks = mongo.db.tasks.find(query)
    result = [task_to_json(task) for task in tasks]
    return jsonify(result)

# @app.route('/tasks/filter', methods=['GET'])
# def filter_tasks():
#     query = {}

     # Фильтры для запроса
#     if 'id' in request.args:
#         query['_id'] = ObjectId(request.args['id'])
#     if 'projectId' in request.args:
#         query['projectId'] = request.args['projectId']
#     if 'title' in request.args:
#         query['title'] = {"$regex": request.args['title'], "$options": "i"}  # Поиск по подстроке, регистронезависимый
#     if 'description' in request.args:
#         query['description'] = {"$regex": request.args['description'], "$options": "i"}  # Поиск по подстроке, регистронезависимый
#     if 'status' in request.args:
#         query['status'] = request.args['status']
#     if 'priority' in request.args:
#         query['priority'] = request.args['priority']
#     if 'deadline' in request.args:
         # Предполагается, что дедлайн передаётся в формате YYYY-MM-DD # TODO на самом деле нет - проверить
         # Необходимо преобразовать строку в объект даты, если в вашей базе даты хранятся в соответствующем формате
#         query['deadline'] = request.args['deadline']

#     tasks = mongo.db.tasks.find(query)
#     result = [{
#         'id': str(task['_id']),
#         'projectId': str(task['projectId']),
#         'title': task['title'],
#         'description': task['description'],
#         'status': task['status'],
#         'priority': task['priority'],
#         'deadline': task['deadline']
#     } for task in tasks]

#     return jsonify(result)