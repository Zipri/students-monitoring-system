from app import app, mongo
from flask import jsonify, request
from bson.objectid import ObjectId
from datetime import datetime

# Helper functions
def validate_project_data(data, update=False):
    errors = []
    if not update:
        required_fields = ['title', 'deadline', 'startDate', 'status', 'assignedTeacher']
        for field in required_fields:
            if field not in data or not data[field]:
                errors.append(f'{field} is required.')
        date_fields = ['deadline', 'startDate']
        for field in date_fields:
            if field in data:
                try:
                    datetime.strptime(data[field], '%Y-%m-%d')
                except ValueError:
                    errors.append(f'Invalid {field} format. Use YYYY-MM-DD.')
    return errors

def get_user_info(user_id):
    """Возвращает информацию о пользователе по его ID."""
    user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
    if user:
        if user['role'] == 'Студент':
            return {
                'id': str(user['_id']),
                'username': user['username'],
                'email': user['email'],
                'group': user.get('group', None)
            }
        
        return {
            'id': str(user['_id']),
            'username': user['username'],
            'email': user['email'],
        }
    return None

def project_to_json(project):
    assignedTeacher_info = get_user_info(project.get('assignedTeacher'))
    assignedStudents_info = [get_user_info(student_id) for student_id in project.get('assignedStudents', [])]
    return {
        'id': str(project['_id']),
        'title': project['title'],
        'description': project.get('description', 'No description provided'),
        'deadline': project.get('deadline', 'No deadline provided'),
        'startDate': project.get('startDate', 'No start date provided'),
        'status': project.get('status', 'No status provided'),
        'assignedStudents': assignedStudents_info,
        'assignedTeacher': assignedTeacher_info
    }


##region CRUD
# Получение списка всех проектов
@app.route('/projects', methods=['GET'])
def get_projects():
    projects = mongo.db.projects.find()
    result = [project_to_json(project) for project in projects]
    return jsonify(result)

# Добавление нового проекта
@app.route('/projects/add', methods=['POST'])
def add_project():
    data = request.json
    errors = validate_project_data(data)
    if errors:
        return jsonify({'error': 'Validation failed', 'messages': errors}), 400
    result = mongo.db.projects.insert_one(data)
    new_project_id = result.inserted_id
    # Получаем добавленный проект
    new_project = mongo.db.projects.find_one({'_id': new_project_id})
    return jsonify(project_to_json(new_project)), 201

# Обновление данных проекта по идентификатору
@app.route('/projects/update/<id>', methods=['PUT'])
def update_project(id):
    data = request.json
    errors = validate_project_data(data, update=True)
    if errors:
        return jsonify({'error': 'Validation failed', 'messages': errors}), 400
    result = mongo.db.projects.update_one({'_id': ObjectId(id)}, {'$set': data})
    if result.modified_count == 0:
        return jsonify({'error': 'Project not found or data not changed'}), 404
    # Получаем обновлённый проект
    updated_project = mongo.db.projects.find_one({'_id': ObjectId(id)})
    return jsonify(project_to_json(updated_project)), 200

# Удаление проекта по идентификатору
@app.route('/projects/delete/<id>', methods=['DELETE'])
def delete_project(id):
    result = mongo.db.projects.delete_one({'_id': ObjectId(id)})
    if result.deleted_count == 0:
        return jsonify({'error': 'Project not found'}), 404
    return jsonify({'deleted_count': result.deleted_count})
##endregion

## Получение детальной информации о проекте
@app.route('/projects/<id>', methods=['GET'])
def get_project_by_id(id):
    project = mongo.db.projects.find_one({'_id': ObjectId(id)})
    if project:
        return jsonify(project_to_json(project))
    else:
        return jsonify({'error': 'Project not found'}), 404
    
## Эндпоинт для получения проектов по названию, дате или статусу
@app.route('/projects/search', methods=['GET'])
def search_projects():
    # Получаем параметры запроса
    title = request.args.get('title')
    deadline = request.args.get('deadline')
    status = request.args.get('status')
    assignedTeacher = request.args.get('assignedTeacher')
    # Формируем критерии фильтрации на основе полученных параметров
    query = {}
    if title:
        query['title'] = {"$regex": title, "$options": "i"}  # Регистронезависимый поиск
    if deadline:
        query['deadline'] = deadline  # Поиск по точной дате
    if status:
        query['status'] = status  # Поиск по статусу
    if assignedTeacher:
        query['assignedTeacher'] = assignedTeacher
    # Ищем проекты по запросу
    projects = mongo.db.projects.find(query)
    result = [project_to_json(project) for project in projects]
    return jsonify(result)

## Получение проектов по ID преподавателя
@app.route('/projects/teacher/<teacher_id>', methods=['GET'])
def get_projects_by_teacher(teacher_id):
    # Ищем проекты, где assignedTeacher равен teacher_id
    projects = mongo.db.projects.find({"assignedTeacher": teacher_id})
    result = [project_to_json(project) for project in projects]
    return jsonify(result)

## Получение проектов по ID студента
@app.route('/projects/student/<student_id>', methods=['GET'])
def get_projects_by_student(student_id):
    # Используем $elemMatch для фильтрации проектов, где student_id входит в массив assignedStudents
    projects = mongo.db.projects.find({"assignedStudents": student_id})
    result = [project_to_json(project) for project in projects]
    return jsonify(result)

## Эндпоинт, который возвращает список проектов, назначенных студентам конкретной группы
@app.route('/projects/group/<group_name>', methods=['GET'])
def get_projects_by_group(group_name):
    # Находим всех студентов в указанной группе
    students = mongo.db.users.find({"group": group_name})
    student_ids = [student['_id'] for student in students]
    # Ищем проекты, назначенные найденным студентам
    projects = mongo.db.projects.find({"assignedStudents": {"$in": student_ids}})
    result = [project_to_json(project) for project in projects]
    return jsonify(result)

## Фильтр по всем полям
@app.route('/projects/filter', methods=['GET'])
def filter_projects():
    query = {}
    # Здесь укажем параметры, по которым можно фильтровать проекты
    for key in ['title', 'status', 'deadline', 'assignedTeacher', 'assignedStudents']:
        if key in request.args:
            # Используем регистронезависимый поиск для текстовых полей
            if key in ['title']:
                query[key] = {"$regex": request.args[key], "$options": "i"}
            # Для полей, где точное совпадение важно, присваиваем значение напрямую
            else:
                query[key] = request.args[key]

    # Ищем проекты, соответствующие заданным критериям
    projects = mongo.db.projects.find(query)
    result = [project_to_json(project) for project in projects]
    return jsonify(result)
