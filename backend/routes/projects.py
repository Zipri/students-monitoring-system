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

    projects = mongo.db.projects.find(query)
    result = [{
        'id': str(project['_id']),
        'title': project['title'],
        'description': project.get('description', 'Описание отсутствует'),
        'deadline': project.get('deadline', 'Срок сдачи не указан'),
        'status': project.get('status', 'Статус не указан'),
        'assignedStudents': project.get('assignedStudents', []),
        'assignedTeacher': project.get('assignedTeacher', 'Преподаватель не назначен')
    } for project in projects]

    return jsonify(result)

## Получение проектов по ID преподавателя
@app.route('/projects/teacher/<teacher_id>', methods=['GET'])
def get_projects_by_teacher(teacher_id):
    # Ищем проекты, где assignedTeacher равен teacher_id
    projects = mongo.db.projects.find({"assignedTeacher": teacher_id})
    result = [{
        'id': str(project['_id']),
        'title': project['title'],
        'description': project.get('description', 'Описание отсутствует'),
        'deadline': project.get('deadline', 'Срок сдачи не указан'),
        'status': project.get('status', 'Статус не указан'),
        'assignedStudents': project.get('assignedStudents', []),
        'assignedTeacher': project.get('assignedTeacher', 'Преподаватель не назначен')
    } for project in projects]
    return jsonify(result)

## Получение проектов по ID студента
@app.route('/projects/student/<student_id>', methods=['GET'])
def get_projects_by_student(student_id):
    # Используем $elemMatch для фильтрации проектов, где student_id входит в массив assignedStudents
    projects = mongo.db.projects.find({"assignedStudents": student_id})
    result = [{
        'id': str(project['_id']),
        'title': project['title'],
        'description': project['description'],
        'deadline': project['deadline'],
        'status': project['status'],
        'assignedStudents': project['assignedStudents'],
        'assignedTeacher': project['assignedTeacher']
    } for project in projects]
    return jsonify(result)

## Эндпоинт, который возвращает список проектов, назначенных студентам конкретной группы
@app.route('/projects/group/<group_name>', methods=['GET'])
def get_projects_by_group(group_name):
    # Находим всех студентов в указанной группе
    students = mongo.db.users.find({"group": group_name})
    student_ids = [student['_id'] for student in students]

    # Ищем проекты, назначенные найденным студентам
    projects = mongo.db.projects.find({"assignedStudents": {"$in": student_ids}})
    result = [{
        'id': str(project['_id']),
        'title': project['title'],
        'description': project['description'],
        'deadline': project['deadline'],
        'status': project['status'],
        'assignedStudents': [str(student_id) for student_id in project['assignedStudents']],
        'assignedTeacher': str(project['assignedTeacher']) if 'assignedTeacher' in project else None
    } for project in projects]

    return jsonify(result)


