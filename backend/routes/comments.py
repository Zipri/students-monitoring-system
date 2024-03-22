from app import app, mongo
from flask import jsonify, request
from bson.objectid import ObjectId
from datetime import datetime

##region CRUD
# Получение всех комментариев
@app.route('/comments', methods=['GET'])
def get_comments():
    comments = mongo.db.comments.find()
    result = []
    for comment in comments:
        author = mongo.db.users.find_one({'_id': ObjectId(comment['authorId'])})
        author_info = {
            'id': str(author['_id']),
            'username': author['username'],
            'email': author['email'],
            'role': author['role'],
            'group': author.get('group', None)
        } if author else {'name': 'Неизвестно', 'email': 'Неизвестно'}
        
        result.append({
            'id': str(comment['_id']),
            'taskId': str(comment['taskId']),
            'author': author_info,
            'text': comment['text'],
            'timestamp': comment.get('timestamp', 'Неизвестно')
        })
    return jsonify(result)

# Добавление нового комментария
@app.route('/comments/add', methods=['POST'])
def add_comment():
    data = request.json
    if not data or 'taskId' not in data or 'authorId' not in data or 'text' not in data:
        return jsonify({'error': 'Missing required comment data'}), 400
    data['timestamp'] = datetime.now()
    comment_id = mongo.db.comments.insert_one(data).inserted_id
    comment = mongo.db.comments.find_one({'_id': comment_id})
    author = mongo.db.users.find_one({'_id': ObjectId(comment['authorId'])})
    author_info = {
        'id': str(author['_id']),
        'username': author['username'],
        'email': author['email'],
        'role': author['role'],
        'group': author.get('group', None)
    } if author else {'name': 'Неизвестно', 'email': 'Неизвестно'}
    return jsonify({
        'id': str(comment['_id']),
        'taskId': comment['taskId'],
        'author': author_info,
        'text': comment['text'],
        'timestamp': comment['timestamp']
    })

# Обновление комментария по идентификатору
@app.route('/comments/update/<id>', methods=['PUT'])
def update_comment(id):
    data = request.json
    mongo.db.comments.update_one({'_id': ObjectId(id)}, {'$set': data})
    updated_comment = mongo.db.comments.find_one({'_id': ObjectId(id)})
    if not updated_comment:
        return jsonify({'error': 'Comment not found'}), 404
    author = mongo.db.users.find_one({'_id': ObjectId(updated_comment['authorId'])})
    author_info = {
        'id': str(author['_id']),
        'username': author['username'],
        'email': author['email'],
        'role': author['role'],
        'group': author.get('group', None)
    } if author else {'name': 'Неизвестно', 'email': 'Неизвестно'}
    return jsonify({
        'id': str(updated_comment['_id']),
        'taskId': updated_comment['taskId'],
        'author': author_info,
        'text': updated_comment['text'],
        'timestamp': updated_comment['timestamp']
    })


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
    result = []
    for comment in comments:
        author = mongo.db.users.find_one({'_id': ObjectId(comment['authorId'])})
        author_info = {
            'name': author.get('name', 'Неизвестно'),
            'email': author.get('email', 'Неизвестно')
        } if author else {'name': 'Неизвестно', 'email': 'Неизвестно'}
        
        result.append({
            'id': str(comment['_id']),
            'taskId': str(comment['taskId']),
            'author': author_info,
            'text': comment['text'],
            'timestamp': comment.get('timestamp', 'Неизвестно')
        })
    return jsonify(result)