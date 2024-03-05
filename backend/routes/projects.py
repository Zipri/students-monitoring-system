from app import app, mongo
from flask import jsonify, request
from bson.objectid import ObjectId
from datetime import datetime

# Helper functions
def validate_project_data(data, update=False):
    """Validate project data for required fields. For updates, checks are more lenient."""
    errors = []
    if not update:
        if 'title' not in data or not data['title']:
            errors.append('Title is required.')
        if 'deadline' not in data or not data['deadline']:
            errors.append('Deadline is required.')
        else:
            try:
                datetime.strptime(data['deadline'], '%Y-%m-%d')
            except ValueError:
                errors.append('Invalid deadline format. Use YYYY-MM-DD.')
        if 'status' not in data or not data['status']:
            errors.append('Status is required.')
        if 'assignedTeacher' not in data or not data['assignedTeacher']:
            errors.append('Assigned teacher is required.')
    
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
    """Convert a project document to a JSON-serializable format."""
    # Получаем информацию о преподавателе
    assignedTeacher_info = get_user_info(project.get('assignedTeacher'))
    # Получаем информацию о студентах
    assignedStudents_info = [get_user_info(student_id) for student_id in project.get('assignedStudents', [])]
    return {
        'id': str(project['_id']),
        'title': project['title'],
        'description': project.get('description', 'No description provided'),
        'deadline': project.get('deadline', 'No deadline provided'),
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
    return jsonify({'result': str(result.inserted_id)})

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
    return jsonify({'modified_count': result.modified_count})

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
    # Формируем критерии фильтрации на основе полученных параметров
    query = {}
    if title:
        query['title'] = {"$regex": title, "$options": "i"}  # Регистронезависимый поиск
    if deadline:
        query['deadline'] = deadline  # Поиск по точной дате
    if status:
        query['status'] = status  # Поиск по статусу
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