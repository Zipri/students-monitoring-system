from app import app, mongo
from flask import jsonify, request
from bson.objectid import ObjectId
from datetime import datetime

##region CRUD
# Получение всех комментариев
@app.route('/comments', methods=['GET'])
def get_comments():
    comments = mongo.db.comments.find()
    result = [{
        'id': str(comment['_id']),
        'taskId': str(comment['taskId']),
        'authorId': str(comment['authorId']),
        'text': comment['text'],
        'timestamp': comment.get('timestamp', 'Неизвестно')  # Использование значения по умолчанию
    } for comment in comments]
    return jsonify(result)

# Добавление нового комментария
@app.route('/comments/add', methods=['POST'])
def add_comment():
    data = request.json
    if not data or 'taskId' not in data or 'authorId' not in data or 'text' not in data:
        return jsonify({'error': 'Missing required comment data'}), 400
    # Добавляем поле timestamp с текущим временем
    data['timestamp'] = datetime.now()  # Задаем текущую дату и время
    collection = mongo.db.comments
    result = collection.insert_one(data)
    return jsonify({'result': str(result.inserted_id)})

# Обновление комментария по идентификатору
@app.route('/comments/update/<id>', methods=['PUT'])
def update_comment(id):
    data = request.json
    collection = mongo.db.comments
    result = collection.update_one({'_id': ObjectId(id)}, {'$set': data})
    if result.modified_count == 0:
        return jsonify({'error': 'Comment not found or data not changed'}), 404
    return jsonify({'modified_count': result.modified_count})

# Удаление комментария по идентификатору
@app.route('/comments/delete/<id>', methods=['DELETE'])
def delete_comment(id):
    collection = mongo.db.comments
    result = collection.delete_one({'_id': ObjectId(id)})
    if result.deleted_count == 0:
        return jsonify({'error': 'Comment not found'}), 404
    return jsonify({'deleted_count': result.deleted_count})
##endregion

## Получение комментариев по идентификатору задачи
@app.route('/comments/task/<taskId>', methods=['GET'])
def get_comments_by_task(taskId):
    comments = mongo.db.comments.find({'taskId': taskId})
    result = [{
        'id': str(comment['_id']),
        'taskId': str(comment['taskId']),
        'authorId': str(comment['authorId']),
        'text': comment['text'],
        'timestamp': comment['timestamp']
    } for comment in comments]
    return jsonify(result)
